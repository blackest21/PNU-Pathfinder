from pydantic import BaseModel, ConfigDict, Field, field_validator


class UserCreate(BaseModel):
    name: str = Field(min_length=1, max_length=50)
    student_id: str = Field(min_length=4, max_length=20)
    password: str = Field(min_length=8, max_length=72)
    department: str = Field(min_length=1, max_length=100)
    major: str | None = Field(default=None, max_length=100)
    career_goal: str | None = Field(default=None, max_length=100)
    privacy_consent: bool

    @field_validator("privacy_consent")
    @classmethod
    def privacy_consent_must_be_true(cls, value: bool) -> bool:
        if not value:
            raise ValueError("개인정보 활용에 동의해야 회원가입할 수 있습니다.")
        return value


class UserLogin(BaseModel):
    student_id: str
    password: str


class UserRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    name: str
    student_id: str
    department: str
    major: str | None
    career_goal: str | None


class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserRead
