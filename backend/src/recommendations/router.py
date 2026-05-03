from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from src.auth.router import get_current_user
from src.database import get_db
from src.models import User
from src.recommendations.schemas import OpportunityRecommendationsRead
from src.services.opportunities import build_opportunity_recommendations

router = APIRouter(prefix="/api/recommendations", tags=["recommendations"])


@router.get("/opportunities", response_model=OpportunityRecommendationsRead)
def get_opportunity_recommendations(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    return build_opportunity_recommendations(db, current_user)
