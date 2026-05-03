from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from src.auth.router import get_current_user
from src.chat.schemas import ChatRequest, ChatResponse
from src.database import get_db
from src.models import User
from src.services.chat import generate_chat_response

router = APIRouter(prefix="/api/chat", tags=["chat"])


@router.post("", response_model=ChatResponse)
def chat(
    payload: ChatRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    return generate_chat_response(db, current_user, payload.message)
