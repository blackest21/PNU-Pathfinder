from datetime import datetime

from sqlalchemy import CheckConstraint, DateTime, ForeignKey, Integer, String, UniqueConstraint, func
from sqlalchemy.orm import Mapped, mapped_column, relationship

from src.database import Base


class User(Base):
    __tablename__ = "users"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    name: Mapped[str] = mapped_column(String(50), nullable=False)
    student_id: Mapped[str] = mapped_column(String(20), unique=True, index=True, nullable=False)
    password_hash: Mapped[str] = mapped_column(String(255), nullable=False)
    department: Mapped[str] = mapped_column(String(100), nullable=False)
    major: Mapped[str | None] = mapped_column(String(100), nullable=True)
    career_goal: Mapped[str | None] = mapped_column(String(100), nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now(), nullable=False)


class AcademicProgram(Base):
    __tablename__ = "academic_programs"
    __table_args__ = (
        UniqueConstraint("department", "major", "curriculum_year", name="uq_academic_program_department_major_year"),
        CheckConstraint("curriculum_year >= 2000", name="ck_academic_programs_curriculum_year_min"),
    )

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    department: Mapped[str] = mapped_column(String(100), nullable=False)
    major: Mapped[str | None] = mapped_column(String(100), nullable=True)
    curriculum_year: Mapped[int] = mapped_column(Integer, nullable=False, default=2024)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now(), nullable=False)

    courses: Mapped[list["CurriculumCourse"]] = relationship(back_populates="program", cascade="all, delete-orphan")
    graduation_requirement: Mapped["GraduationRequirement | None"] = relationship(back_populates="program", cascade="all, delete-orphan", uselist=False)


class CurriculumCourse(Base):
    __tablename__ = "curriculum_courses"
    __table_args__ = (
        CheckConstraint("credits > 0", name="ck_curriculum_courses_credits_positive"),
    )

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    program_id: Mapped[int] = mapped_column(ForeignKey("academic_programs.id", ondelete="CASCADE"), nullable=False, index=True)
    completion_category: Mapped[str] = mapped_column(String(30), nullable=False)
    course_number: Mapped[str] = mapped_column(String(30), nullable=False)
    course_name_ko: Mapped[str] = mapped_column(String(150), nullable=False)
    course_name_en: Mapped[str | None] = mapped_column(String(200), nullable=True)
    description: Mapped[str | None] = mapped_column(String(1000), nullable=True)
    recommended_semester: Mapped[str] = mapped_column(String(20), nullable=False)
    credits: Mapped[int] = mapped_column(Integer, nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now(), nullable=False)

    program: Mapped[AcademicProgram] = relationship(back_populates="courses")


class GraduationRequirement(Base):
    __tablename__ = "graduation_requirements"
    __table_args__ = (
        CheckConstraint("liberal_required >= 0", name="ck_graduation_requirements_liberal_required_natural"),
        CheckConstraint("liberal_elective >= 0", name="ck_graduation_requirements_liberal_elective_natural"),
        CheckConstraint("major_basic >= 0", name="ck_graduation_requirements_major_basic_natural"),
        CheckConstraint("major_required >= 0", name="ck_graduation_requirements_major_required_natural"),
        CheckConstraint("major_elective >= 0", name="ck_graduation_requirements_major_elective_natural"),
        CheckConstraint("general_elective >= 0", name="ck_graduation_requirements_general_elective_natural"),
        CheckConstraint("total_credits >= 0", name="ck_graduation_requirements_total_credits_natural"),
    )

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    program_id: Mapped[int] = mapped_column(ForeignKey("academic_programs.id", ondelete="CASCADE"), unique=True, nullable=False, index=True)
    liberal_required: Mapped[int] = mapped_column(Integer, nullable=False)
    liberal_elective: Mapped[int] = mapped_column(Integer, nullable=False)
    major_basic: Mapped[int] = mapped_column(Integer, nullable=False)
    major_required: Mapped[int] = mapped_column(Integer, nullable=False)
    major_elective: Mapped[int] = mapped_column(Integer, nullable=False)
    general_elective: Mapped[int] = mapped_column(Integer, nullable=False)
    total_credits: Mapped[int] = mapped_column(Integer, nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now(), nullable=False)

    program: Mapped[AcademicProgram] = relationship(back_populates="graduation_requirement")
