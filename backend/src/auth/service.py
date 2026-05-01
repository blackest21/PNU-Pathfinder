import os
from datetime import datetime, timedelta, timezone

import jwt
from fastapi import HTTPException, status
from passlib.context import CryptContext
from sqlalchemy import select
from sqlalchemy.orm import Session

from src.auth.schemas import UserCreate
from src.models import User

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

JWT_SECRET = os.getenv("JWT_SECRET", "pnu-pathfinder-local-dev-secret")
JWT_ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24


def get_password_hash(password: str) -> str:
    return pwd_context.hash(password)


def verify_password(plain_password: str, password_hash: str) -> bool:
    return pwd_context.verify(plain_password, password_hash)


def get_user_by_student_id(db: Session, student_id: str) -> User | None:
    return db.scalar(select(User).where(User.student_id == student_id))


def create_user(db: Session, payload: UserCreate) -> User:
    if get_user_by_student_id(db, payload.student_id):
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="이미 가입된 학번입니다.",
        )

    user = User(
        name=payload.name,
        student_id=payload.student_id,
        password_hash=get_password_hash(payload.password),
        department=payload.department,
        major=payload.major,
        career_goal=payload.career_goal,
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return user


def authenticate_user(db: Session, student_id: str, password: str) -> User:
    user = get_user_by_student_id(db, student_id)
    if not user or not verify_password(password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="학번 또는 비밀번호가 올바르지 않습니다.",
        )
    return user


def create_access_token(user: User) -> str:
    expire = datetime.now(timezone.utc) + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    payload = {"sub": user.student_id, "exp": expire}
    return jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALGORITHM)


def decode_access_token(token: str) -> str:
    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
        student_id = payload.get("sub")
        if not student_id:
            raise ValueError
        return student_id
    except (jwt.PyJWTError, ValueError):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="인증 정보가 유효하지 않습니다.",
        )
