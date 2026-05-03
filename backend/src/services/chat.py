import os

from fastapi import HTTPException
from sqlalchemy.orm import Session

from src.models import User
from src.services.graduation import build_recommendations, calculate_progress

OPENAI_MODEL = os.getenv("OPENAI_MODEL", "gpt-4o-mini")


def generate_chat_response(db: Session, user: User, message: str) -> dict:
    try:
        progress = calculate_progress(db, user)
        recommendations = build_recommendations(db, user)
    except HTTPException:
        progress = None
        recommendations = {"next_courses": [], "retake_courses": []}

    openai_answer = _openai_answer(user, message, progress, recommendations)
    if openai_answer:
        return {
            "answer": openai_answer,
            "used_sources": ["student_profile", "course_records", "graduation_requirements"],
            "mode": "openai",
        }

    answer = _local_answer(user, message, progress, recommendations)
    return {
        "answer": answer,
        "used_sources": ["student_profile", "course_records", "graduation_requirements"],
        "mode": "local",
    }


def _openai_answer(user: User, message: str, progress: dict | None, recommendations: dict) -> str | None:
    if not os.getenv("OPENAI_API_KEY"):
        return None

    try:
        from openai import OpenAI
    except ImportError:
        return None

    context = _context_text(user, progress, recommendations)
    try:
        client = OpenAI()
        response = client.responses.create(
            model=OPENAI_MODEL,
            instructions=(
                "너는 부산대학교 학생을 돕는 학업 상담 assistant다. "
                "제공된 학생 이수현황과 졸업요건 컨텍스트만 근거로 답한다. "
                "확실하지 않은 학교 규정은 단정하지 말고 관리자 데이터 확인이 필요하다고 말한다. "
                "답변은 한국어로 짧고 실행 가능한 조언 위주로 작성한다."
            ),
            input=f"{context}\n\n학생 질문: {message}",
        )
        return response.output_text
    except Exception:
        return None


def _local_answer(user: User, message: str, progress: dict | None, recommendations: dict) -> str:
    if not progress:
        return (
            f"{user.name}님 학과/전공에 맞는 졸업요건 데이터가 아직 없습니다. "
            "관리자 교과과정 입력 또는 크롤러 ingestion을 먼저 실행해 주세요."
        )

    total = progress["total"]
    next_courses = recommendations["next_courses"][:3]
    course_names = ", ".join(course["course_name_ko"] for course in next_courses) or "추천 가능한 과목 없음"

    return (
        f"{user.name}님의 현재 총 이수 학점은 {total['earned']}학점이고, "
        f"졸업요건까지 {total['remaining']}학점이 남았습니다. "
        f"현재 질문은 '{message}'로 이해했습니다. "
        f"우선 다음 과목을 검토해 보세요: {course_names}."
    )


def _context_text(user: User, progress: dict | None, recommendations: dict) -> str:
    if not progress:
        return (
            f"학생: {user.name}\n"
            f"학과: {user.department}\n"
            f"전공: {user.major or '미입력'}\n"
            "졸업요건 데이터: 없음"
        )

    total = progress["total"]
    categories = "\n".join(
        f"- {key}: 필요 {value['required']}학점, 이수 {value['earned']}학점, 남은 {value['remaining']}학점"
        for key, value in progress["categories"].items()
    )
    next_courses = ", ".join(course["course_name_ko"] for course in recommendations["next_courses"][:5]) or "없음"
    retake_courses = ", ".join(course["course_name_ko"] for course in recommendations["retake_courses"][:5]) or "없음"

    return (
        f"학생: {user.name}\n"
        f"학과: {progress['department']}\n"
        f"전공: {progress['major'] or '미입력'}\n"
        f"교과과정 연도: {progress['curriculum_year']}\n"
        f"총 이수: {total['earned']}학점 / 필요 {total['required']}학점 / 남은 {total['remaining']}학점\n"
        f"영역별 현황:\n{categories}\n"
        f"추천 과목: {next_courses}\n"
        f"재수강 후보: {retake_courses}"
    )
