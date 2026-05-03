from datetime import date

from sqlalchemy import or_, select
from sqlalchemy.orm import Session

from src.models import CertificationSchedule, ExtracurricularProgram, JobOpportunity, LabProfile, User


def build_opportunity_recommendations(db: Session, user: User, limit: int = 5) -> dict:
    today = date.today()
    return {
        "extracurriculars": [
            _extracurricular_item(item, user)
            for item in _rank_items(_load_extracurriculars(db, user, today), user)[:limit]
        ],
        "certifications": [
            _certification_item(item, user)
            for item in _rank_items(_load_certifications(db, today), user)[:limit]
        ],
        "jobs": [
            _job_item(item, user)
            for item in _rank_items(_load_jobs(db, today), user)[:limit]
        ],
        "labs": [
            _lab_item(item, user)
            for item in _rank_items(_load_labs(db, user), user)[:limit]
        ],
    }


def _load_extracurriculars(db: Session, user: User, today: date) -> list[ExtracurricularProgram]:
    return db.scalars(
        select(ExtracurricularProgram)
        .where(
            or_(
                ExtracurricularProgram.application_deadline.is_(None),
                ExtracurricularProgram.application_deadline >= today,
            ),
            or_(
                ExtracurricularProgram.target_department.is_(None),
                ExtracurricularProgram.target_department == user.department,
            ),
        )
        .order_by(ExtracurricularProgram.application_deadline.asc().nulls_last(), ExtracurricularProgram.id.desc())
    ).all()


def _load_certifications(db: Session, today: date) -> list[CertificationSchedule]:
    return db.scalars(
        select(CertificationSchedule)
        .where(
            or_(
                CertificationSchedule.application_deadline.is_(None),
                CertificationSchedule.application_deadline >= today,
            )
        )
        .order_by(CertificationSchedule.application_deadline.asc().nulls_last(), CertificationSchedule.id.desc())
    ).all()


def _load_jobs(db: Session, today: date) -> list[JobOpportunity]:
    return db.scalars(
        select(JobOpportunity)
        .where(
            or_(
                JobOpportunity.application_deadline.is_(None),
                JobOpportunity.application_deadline >= today,
            )
        )
        .order_by(JobOpportunity.application_deadline.asc().nulls_last(), JobOpportunity.id.desc())
    ).all()


def _load_labs(db: Session, user: User) -> list[LabProfile]:
    return db.scalars(
        select(LabProfile)
        .where(or_(LabProfile.department.is_(None), LabProfile.department == user.department))
        .order_by(LabProfile.id.desc())
    ).all()


def _rank_items(items: list, user: User) -> list:
    return sorted(items, key=lambda item: _score_item(item, user), reverse=True)


def _score_item(item, user: User) -> int:
    text = " ".join(str(value or "") for value in vars(item).values()).lower()
    keywords = [user.department, user.major, user.career_goal]
    return sum(1 for keyword in keywords if keyword and keyword.lower() in text)


def _reason(user: User) -> str:
    if user.career_goal:
        return f"진로 목표({user.career_goal})와 관련성이 높은 항목입니다."
    return "학생의 학과/전공 정보와 일정 조건을 기준으로 추천했습니다."


def _extracurricular_item(item: ExtracurricularProgram, user: User) -> dict:
    return {
        "id": item.id,
        "type": "extracurricular",
        "title": item.title,
        "source_url": item.source_url,
        "summary": item.summary,
        "deadline": item.application_deadline,
        "reason": _reason(user),
    }


def _certification_item(item: CertificationSchedule, user: User) -> dict:
    return {
        "id": item.id,
        "type": "certificate",
        "title": item.name,
        "source_url": item.source_url,
        "summary": item.summary,
        "deadline": item.application_deadline,
        "reason": _reason(user),
    }


def _job_item(item: JobOpportunity, user: User) -> dict:
    return {
        "id": item.id,
        "type": item.opportunity_type,
        "title": item.title,
        "source_url": item.source_url,
        "summary": item.summary,
        "deadline": item.application_deadline,
        "reason": _reason(user),
    }


def _lab_item(item: LabProfile, user: User) -> dict:
    return {
        "id": item.id,
        "type": "lab",
        "title": item.lab_name,
        "source_url": item.source_url,
        "summary": item.summary,
        "deadline": None,
        "reason": _reason(user),
    }
