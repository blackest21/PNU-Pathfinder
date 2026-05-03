from datetime import datetime

from sqlalchemy import Boolean, CheckConstraint, DateTime, ForeignKey, Integer, String, Text, UniqueConstraint, func
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

    course_records: Mapped[list["CourseRecord"]] = relationship(back_populates="user", cascade="all, delete-orphan")


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


class CourseRecord(Base):
    __tablename__ = "course_records"
    __table_args__ = (
        UniqueConstraint("user_id", "course_number", "semester", name="uq_course_records_user_course_semester"),
        CheckConstraint("credits > 0", name="ck_course_records_credits_positive"),
    )

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    course_number: Mapped[str] = mapped_column(String(30), nullable=False)
    course_name: Mapped[str] = mapped_column(String(150), nullable=False)
    completion_category: Mapped[str] = mapped_column(String(30), nullable=False)
    credits: Mapped[int] = mapped_column(Integer, nullable=False)
    grade: Mapped[str | None] = mapped_column(String(5), nullable=True)
    semester: Mapped[str] = mapped_column(String(20), nullable=False)
    is_retake: Mapped[bool] = mapped_column(Boolean, nullable=False, default=False, server_default="false")
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now(), nullable=False)

    user: Mapped[User] = relationship(back_populates="course_records")


class IngestedDocument(Base):
    __tablename__ = "ingested_documents"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    source_url: Mapped[str] = mapped_column(String(500), unique=True, nullable=False, index=True)
    title: Mapped[str] = mapped_column(String(200), nullable=False)
    category: Mapped[str] = mapped_column(String(50), nullable=False, default="notice")
    content_hash: Mapped[str] = mapped_column(String(64), nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
        onupdate=func.now(),
        nullable=False,
    )

    chunks: Mapped[list["DocumentChunk"]] = relationship(back_populates="document", cascade="all, delete-orphan")


class DocumentChunk(Base):
    __tablename__ = "document_chunks"
    __table_args__ = (
        UniqueConstraint("document_id", "chunk_index", name="uq_document_chunks_document_index"),
        CheckConstraint("chunk_index >= 0", name="ck_document_chunks_chunk_index_natural"),
    )

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    document_id: Mapped[int] = mapped_column(ForeignKey("ingested_documents.id", ondelete="CASCADE"), nullable=False, index=True)
    chunk_index: Mapped[int] = mapped_column(Integer, nullable=False)
    content: Mapped[str] = mapped_column(Text, nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now(), nullable=False)

    document: Mapped[IngestedDocument] = relationship(back_populates="chunks")
