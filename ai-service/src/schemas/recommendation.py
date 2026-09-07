from pydantic import BaseModel

class MusicRequest(BaseModel):
    message:str

class RecommendationIntent(BaseModel):
    artist: str | None = None
    category: str | None = None
    limit: int = 10

class PlaylistGenerating(BaseModel):
    playlist_name: str | None = None
    artist: str | None = None
    category: str | None = None
    limit: int = 10

# Alias for backwards compatibility if referenced anywhere
PlaylistGenrating = PlaylistGenerating