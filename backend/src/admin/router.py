import os

from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from sqlalchemy import select
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session, selectinload

from src.admin.schemas import (
    AcademicProgramCreate,
    AcademicProgramRead,
    AdminLogin,
    AdminToken,
    CrawlRunCreate,
    CrawlRunSummary,
)
from src.database import get_db
from src.models import AcademicProgram, CurriculumCourse, GraduationRequirement
from src.services.ingestion import upsert_document, upsert_program

router = APIRouter(prefix="/api/admin", tags=["admin"])
bearer_scheme = HTTPBearer()
ADMIN_ID = os.getenv("ADMIN_ID", "root")
ADMIN_PASSWORD = os.getenv("ADMIN_PASSWORD", "3011")
ADMIN_TOKEN = os.getenv("ADMIN_TOKEN", "pnu-pathfinder-admin-local-token")


def require_admin(credentials: HTTPAuthorizationCredentials = Depends(bearer_scheme)):
    if credentials.credentials != ADMIN_TOKEN:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="관리자 인증이 필요합니다.")


def load_program(program_id: int, db: Session):
    program = db.scalar(
        select(AcademicProgram)
        .where(AcademicProgram.id == program_id)
        .options(selectinload(AcademicProgram.courses), selectinload(AcademicProgram.graduation_requirement))
    )
    if not program:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="학과 정보를 찾을 수 없습니다.")
    return program


def build_program(payload: AcademicProgramCreate):
    return AcademicProgram(
        department=payload.department.strip(),
        major=payload.major.strip() if payload.major else None,
        curriculum_year=payload.curriculum_year,
    )


def replace_program_children(program: AcademicProgram, payload: AcademicProgramCreate, db: Session):
    if program.graduation_requirement:
        requirement = program.graduation_requirement
        for key, value in payload.graduation_requirement.model_dump().items():
            setattr(requirement, key, value)
    else:
        db.add(GraduationRequirement(program_id=program.id, **payload.graduation_requirement.model_dump()))

    program.courses.clear()
    db.flush()

    for course_payload in payload.courses:
        db.add(CurriculumCourse(program_id=program.id, **course_payload.model_dump()))


def commit_or_duplicate_error(db: Session):
    try:
        db.commit()
    except IntegrityError as exc:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="같은 학부/학과, 전공, 교과과정 연도가 이미 저장되어 있습니다.",
        ) from exc


@router.post("/login", response_model=AdminToken)
def admin_login(payload: AdminLogin):
    if payload.admin_id != ADMIN_ID or payload.password != ADMIN_PASSWORD:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="해당 학번이 없습니다.")
    return {
        "access_token": ADMIN_TOKEN,
        "user": {"role": "admin", "name": "관리자", "admin_id": ADMIN_ID},
    }


@router.post("/programs", response_model=AcademicProgramRead, status_code=status.HTTP_201_CREATED, dependencies=[Depends(require_admin)])
def create_program(payload: AcademicProgramCreate, db: Session = Depends(get_db)):
    program = build_program(payload)
    db.add(program)
    db.flush()

    db.add(GraduationRequirement(program_id=program.id, **payload.graduation_requirement.model_dump()))
    for course_payload in payload.courses:
        db.add(CurriculumCourse(program_id=program.id, **course_payload.model_dump()))

    commit_or_duplicate_error(db)
    return load_program(program.id, db)


@router.get("/programs", response_model=list[AcademicProgramRead], dependencies=[Depends(require_admin)])
def list_programs(db: Session = Depends(get_db)):
    return db.scalars(
        select(AcademicProgram)
        .options(selectinload(AcademicProgram.courses), selectinload(AcademicProgram.graduation_requirement))
        .order_by(AcademicProgram.curriculum_year.desc(), AcademicProgram.id.desc())
    ).all()


@router.put("/programs/{program_id}", response_model=AcademicProgramRead, dependencies=[Depends(require_admin)])
def update_program(program_id: int, payload: AcademicProgramCreate, db: Session = Depends(get_db)):
    program = load_program(program_id, db)
    program.department = payload.department.strip()
    program.major = payload.major.strip() if payload.major else None
    program.curriculum_year = payload.curriculum_year
    replace_program_children(program, payload, db)
    commit_or_duplicate_error(db)
    return load_program(program.id, db)


@router.delete("/programs/{program_id}", status_code=status.HTTP_204_NO_CONTENT, dependencies=[Depends(require_admin)])
def delete_program(program_id: int, db: Session = Depends(get_db)):
    program = load_program(program_id, db)
    db.delete(program)
    db.commit()


@router.post("/crawl/run", response_model=CrawlRunSummary, dependencies=[Depends(require_admin)])
def run_crawl_ingestion(payload: CrawlRunCreate, db: Session = Depends(get_db)):
    summary = {
        "programs_created": 0,
        "programs_updated": 0,
        "documents_created": 0,
        "documents_updated": 0,
        "documents_unchanged": 0,
        "chunks_written": 0,
    }

    for program_payload in payload.programs:
        action = upsert_program(db, program_payload)
        summary[f"programs_{action}"] += 1

    for document_payload in payload.documents:
        action, chunk_count = upsert_document(db, **document_payload.model_dump())
        summary[f"documents_{action}"] += 1
        if action != "unchanged":
            summary["chunks_written"] += chunk_count

    db.commit()
    return summary
