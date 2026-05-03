import hashlib

from sqlalchemy import select
from sqlalchemy.orm import Session

from src.admin.schemas import AcademicProgramCreate
from src.models import (
    AcademicProgram,
    CurriculumCourse,
    DocumentChunk,
    GraduationRequirement,
    IngestedDocument,
)


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
        db.add(DocumentChunk(document_id=document.id, chunk_index=index, content=chunk))

    return action, len(chunks)
