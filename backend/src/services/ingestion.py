import hashlib
import os
import re

from sqlalchemy import or_, select
from sqlalchemy.orm import Session

from src.admin.schemas import AcademicProgramCreate
from src.models import (
    AcademicProgram,
    CertificationSchedule,
    CurriculumCourse,
    DocumentChunk,
    ExtracurricularProgram,
    GraduationRequirement,
    IngestedDocument,
    JobOpportunity,
    LabProfile,
)

OPENAI_EMBEDDING_MODEL = os.getenv("OPENAI_EMBEDDING_MODEL", "text-embedding-3-small")


def chunk_text(text: str, chunk_size: int = 800, overlap: int = 120) -> list[str]:
    cleaned = " ".join(text.split())
    if not cleaned:
        return []

    chunks: list[str] = []
    start = 0
    while start < len(cleaned):
        end = min(start + chunk_size, len(cleaned))
        chunks.append(cleaned[start:end])
        if end == len(cleaned):
            break
        start = max(end - overlap, start + 1)
    return chunks


def content_hash(content: str) -> str:
    return hashlib.sha256(content.encode("utf-8")).hexdigest()


def upsert_program(db: Session, payload: AcademicProgramCreate) -> str:
    program = db.scalar(
        select(AcademicProgram).where(
            AcademicProgram.department == payload.department.strip(),
            AcademicProgram.major == (payload.major.strip() if payload.major else None),
            AcademicProgram.curriculum_year == payload.curriculum_year,
        )
    )
    action = "updated" if program else "created"
    if not program:
        program = AcademicProgram(
            department=payload.department.strip(),
            major=payload.major.strip() if payload.major else None,
            curriculum_year=payload.curriculum_year,
        )
        db.add(program)
        db.flush()

    if program.graduation_requirement:
        for key, value in payload.graduation_requirement.model_dump().items():
            setattr(program.graduation_requirement, key, value)
    else:
        db.add(GraduationRequirement(program_id=program.id, **payload.graduation_requirement.model_dump()))

    program.courses.clear()
    db.flush()
    for course_payload in payload.courses:
        db.add(CurriculumCourse(program_id=program.id, **course_payload.model_dump()))

    return action


def upsert_document(db: Session, source_url: str, title: str, category: str, content: str) -> tuple[str, int]:
    digest = content_hash(content)
    document = db.scalar(select(IngestedDocument).where(IngestedDocument.source_url == source_url))
    action = "updated" if document else "created"

    if document and document.content_hash == digest:
        return "unchanged", len(document.chunks)

    if not document:
        document = IngestedDocument(
            source_url=source_url,
            title=title.strip(),
            category=category.strip(),
            content_hash=digest,
        )
        db.add(document)
        db.flush()
    else:
        document.title = title.strip()
        document.category = category.strip()
        document.content_hash = digest
        document.chunks.clear()
        db.flush()

    chunks = chunk_text(content)
    for index, chunk in enumerate(chunks):
        db.add(
            DocumentChunk(
                document_id=document.id,
                chunk_index=index,
                content=chunk,
                embedding=create_embedding(chunk),
            )
        )

    return action, len(chunks)


def upsert_extracurricular(db: Session, payload) -> None:
    item = db.scalar(select(ExtracurricularProgram).where(ExtracurricularProgram.source_url == payload.source_url))
    values = payload.model_dump()
    if not item:
        db.add(ExtracurricularProgram(**values))
        return
    for key, value in values.items():
        setattr(item, key, value)


def upsert_certification(db: Session, payload) -> None:
    item = db.scalar(select(CertificationSchedule).where(CertificationSchedule.source_url == payload.source_url))
    values = payload.model_dump()
    if not item:
        db.add(CertificationSchedule(**values))
        return
    for key, value in values.items():
        setattr(item, key, value)


def upsert_job(db: Session, payload) -> None:
    item = db.scalar(select(JobOpportunity).where(JobOpportunity.source_url == payload.source_url))
    values = payload.model_dump()
    if not item:
        db.add(JobOpportunity(**values))
        return
    for key, value in values.items():
        setattr(item, key, value)


def upsert_lab(db: Session, payload) -> None:
    item = db.scalar(select(LabProfile).where(LabProfile.source_url == payload.source_url))
    values = payload.model_dump()
    if not item:
        db.add(LabProfile(**values))
        return
    for key, value in values.items():
        setattr(item, key, value)


def retrieve_document_context(db: Session, query: str, limit: int = 3) -> list[dict[str, str]]:
    query_embedding = create_embedding(query)
    if query_embedding:
        vector_context = _retrieve_vector_context(db, query_embedding, limit)
        if vector_context:
            return vector_context

    return _retrieve_keyword_context(db, query, limit)


def create_embedding(text: str) -> list[float] | None:
    if not os.getenv("OPENAI_API_KEY"):
        return None
    try:
        from openai import OpenAI
    except ImportError:
        return None

    try:
        client = OpenAI()
        response = client.embeddings.create(
            model=OPENAI_EMBEDDING_MODEL,
            input=text,
        )
        return response.data[0].embedding
    except Exception:
        return None


def _retrieve_vector_context(db: Session, query_embedding: list[float], limit: int) -> list[dict[str, str]]:
    rows = db.execute(
        select(DocumentChunk, IngestedDocument)
        .join(IngestedDocument)
        .where(DocumentChunk.embedding.is_not(None))
        .order_by(DocumentChunk.embedding.l2_distance(query_embedding))
        .limit(limit)
    ).all()

    return [
        {
            "title": document.title,
            "source_url": document.source_url,
            "category": document.category,
            "content": chunk.content,
        }
        for chunk, document in rows
    ]


def _retrieve_keyword_context(db: Session, query: str, limit: int) -> list[dict[str, str]]:
    terms = _search_terms(query)
    if not terms:
        return []

    conditions = []
    for term in terms:
        pattern = f"%{term}%"
        conditions.append(DocumentChunk.content.ilike(pattern))
        conditions.append(IngestedDocument.title.ilike(pattern))

    rows = db.execute(
        select(DocumentChunk, IngestedDocument)
        .join(IngestedDocument)
        .where(or_(*conditions))
        .order_by(DocumentChunk.id.desc())
        .limit(limit * 4)
    ).all()

    ranked = []
    for chunk, document in rows:
        score = _match_score(chunk.content, document.title, terms)
        ranked.append(
            {
                "title": document.title,
                "source_url": document.source_url,
                "category": document.category,
                "content": chunk.content,
                "score": score,
            }
        )

    ranked.sort(key=lambda item: item["score"], reverse=True)
    return [
        {
            "title": item["title"],
            "source_url": item["source_url"],
            "category": item["category"],
            "content": item["content"],
        }
        for item in ranked[:limit]
    ]


def _search_terms(query: str) -> list[str]:
    terms = re.findall(r"[0-9A-Za-z가-힣]{2,}", query.lower())
    return terms[:6]


def _match_score(content: str, title: str, terms: list[str]) -> int:
    haystack = f"{title} {content}".lower()
    return sum(haystack.count(term) for term in terms)
