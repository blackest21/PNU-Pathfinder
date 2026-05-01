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
