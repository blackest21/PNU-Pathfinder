from datetime import date

from pydantic import BaseModel


class OpportunityItem(BaseModel):
    id: int
    type: str
    title: str
    source_url: str
    summary: str | None
    deadline: date | None
    reason: str


class OpportunityRecommendationsRead(BaseModel):
    extracurriculars: list[OpportunityItem]
    certifications: list[OpportunityItem]
    jobs: list[OpportunityItem]
    labs: list[OpportunityItem]
