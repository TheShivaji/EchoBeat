from pydantic import BaseModel

class MusicRequest(BaseModel):
    message:str

class RecommendationIntent(BaseModel):
    artist: str | None = None
    category: str | None = None
    limit: int = 10