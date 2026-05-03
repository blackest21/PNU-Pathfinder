from datetime import date

from pydantic import BaseModel, ConfigDict, Field


class AdminLogin(BaseModel):
    admin_id: str
    password: str


class AdminToken(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: dict[str, str]


class CurriculumCourseCreate(BaseModel):
    completion_category: str = Field(min_length=1, max_length=30)
    course_number: str = Field(min_length=1, max_length=30)
    course_name_ko: str = Field(min_length=1, max_length=150)
    course_name_en: str | None = Field(default=None, max_length=200)
    description: str | None = Field(default=None, max_length=1000)
    recommended_semester: str = Field(min_length=1, max_length=20)
    credits: int = Field(ge=1)


class GraduationRequirementCreate(BaseModel):
    liberal_required: int = Field(ge=0)
    liberal_elective: int = Field(ge=0)
    major_basic: int = Field(ge=0)
    major_required: int = Field(ge=0)
    major_elective: int = Field(ge=0)
    general_elective: int = Field(ge=0)
    total_credits: int = Field(ge=0)


class AcademicProgramCreate(BaseModel):
    department: str = Field(min_length=1, max_length=100)
    major: str | None = Field(default=None, max_length=100)
    curriculum_year: int = Field(ge=2000, le=2100)
    courses: list[CurriculumCourseCreate] = Field(default_factory=list)
    graduation_requirement: GraduationRequirementCreate


class CurriculumCourseRead(CurriculumCourseCreate):
    model_config = ConfigDict(from_attributes=True)

    id: int


class GraduationRequirementRead(GraduationRequirementCreate):
    model_config = ConfigDict(from_attributes=True)

    id: int


class AcademicProgramRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    department: str
    major: str | None
    curriculum_year: int
    courses: list[CurriculumCourseRead]
    graduation_requirement: GraduationRequirementRead | None


class IngestionDocumentCreate(BaseModel):
    source_url: str = Field(min_length=1, max_length=500)
    title: str = Field(min_length=1, max_length=200)
    category: str = Field(default="notice", min_length=1, max_length=50)
    content: str = Field(min_length=1)


class ExtracurricularProgramCreate(BaseModel):
    title: str = Field(min_length=1, max_length=200)
    organizer: str | None = Field(default=None, max_length=100)
    category: str = Field(default="extracurricular", min_length=1, max_length=50)
    start_date: date | None = None
    end_date: date | None = None
    application_deadline: date | None = None
    location: str | None = Field(default=None, max_length=150)
    target_department: str | None = Field(default=None, max_length=100)
    target_grade: str | None = Field(default=None, max_length=50)
    source_url: str = Field(min_length=1, max_length=500)
    summary: str | None = None


class CertificationScheduleCreate(BaseModel):
    name: str = Field(min_length=1, max_length=150)
    issuer: str | None = Field(default=None, max_length=100)
    exam_date: date | None = None
    application_deadline: date | None = None
    related_career: str | None = Field(default=None, max_length=150)
    source_url: str = Field(min_length=1, max_length=500)
    summary: str | None = None


class JobOpportunityCreate(BaseModel):
    title: str = Field(min_length=1, max_length=200)
    organization: str | None = Field(default=None, max_length=150)
    opportunity_type: str = Field(default="job", min_length=1, max_length=50)
    application_deadline: date | None = None
    required_skills: str | None = Field(default=None, max_length=500)
    related_career: str | None = Field(default=None, max_length=150)
    source_url: str = Field(min_length=1, max_length=500)
    summary: str | None = None


class LabProfileCreate(BaseModel):
    lab_name: str = Field(min_length=1, max_length=150)
    professor_name: str | None = Field(default=None, max_length=100)
    department: str | None = Field(default=None, max_length=100)
    research_keywords: str | None = Field(default=None, max_length=500)
    source_url: str = Field(min_length=1, max_length=500)
    summary: str | None = None


class CrawlRunCreate(BaseModel):
    programs: list[AcademicProgramCreate] = Field(default_factory=list)
    documents: list[IngestionDocumentCreate] = Field(default_factory=list)
    extracurriculars: list[ExtracurricularProgramCreate] = Field(default_factory=list)
    certifications: list[CertificationScheduleCreate] = Field(default_factory=list)
    jobs: list[JobOpportunityCreate] = Field(default_factory=list)
    labs: list[LabProfileCreate] = Field(default_factory=list)


class CrawlRunSummary(BaseModel):
    programs_created: int
    programs_updated: int
    documents_created: int
    documents_updated: int
    documents_unchanged: int
    chunks_written: int
    extracurriculars_upserted: int
    certifications_upserted: int
    jobs_upserted: int
    labs_upserted: int
