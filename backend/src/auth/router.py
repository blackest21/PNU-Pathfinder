from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from sqlalchemy.orm import Session

from src.auth.schemas import Token, UserCreate, UserLogin, UserRead
from src.auth.service import (
    authenticate_user,
    create_access_token,
    create_user,
    decode_access_token,
    get_user_by_student_id,
)
from src.database import get_db
from src.models import User

router = APIRouter(prefix="/api/auth", tags=["auth"])
bearer_scheme = HTTPBearer()


def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(bearer_scheme),
    db: Session = Depends(get_db),
) -> User:
    student_id = decode_access_token(credentials.credentials)
    user = get_user_by_student_id(db, student_id)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="사용자를 찾을 수 없습니다.",
        )
    return user


@router.post("/signup", response_model=Token, status_code=status.HTTP_201_CREATED)
def signup(payload: UserCreate, db: Session = Depends(get_db)):
    user = create_user(db, payload)
    return {"access_token": create_access_token(user), "user": user}


@router.post("/login", response_model=Token)
def login(payload: UserLogin, db: Session = Depends(get_db)):
    user = authenticate_user(db, payload.student_id, payload.password)
    return {"access_token": create_access_token(user), "user": user}


@router.get("/me", response_model=UserRead)
def me(current_user: User = Depends(get_current_user)):
    return current_user
