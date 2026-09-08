from pydantic import BaseModel, Field

class LyricsRequest(BaseModel):
    title: str
    artist: str | None = None
    lyrics: str
    prompt: str | None = None
    action: str | None = None  # "translate" | "explain" | "mood" | "all"
    target_language: str | None = None

class LyricsResponse(BaseModel):
    action: str
    target_language: str | None = None
    translated_lyrics: str | None = None
    meaning_summary: str | None = None
    mood_and_vibe: str | None = None
    key_themes: list[str] = Field(default_factory=list)
    poetic_breakdown: str | None = None
