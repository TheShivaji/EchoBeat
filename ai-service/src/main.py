from fastapi import HTTPException, FastAPI
from src.services.llm_service import (
    understand_music_request,
    playlist_genrating,
    process_lyrics_request,
    chatbot_assistant,
)
from src.schemas.recommendation import MusicRequest
from src.schemas.lyrics import LyricsRequest, LyricsResponse
from src.schemas.assistant import ChatRequest, ChatResponse


app = FastAPI(
    title="EchoBeats AI Service",
    description="AI-powered music intelligence engine for EchoBeats",
    version="1.0.0",
)


@app.post("/ai/understand")
async def understand(req: MusicRequest):
    result = await understand_music_request(req.message)
    return result


@app.post("/ai/playlist")
async def playlist(req: MusicRequest):
    result = await playlist_genrating(req.message)
    return result


@app.post("/ai/lyrics", response_model=LyricsResponse)
async def lyrics(req: LyricsRequest):
    if not req.lyrics or not req.lyrics.strip():
        raise HTTPException(status_code=400, detail="Lyrics are required for processing.")
    result = await process_lyrics_request(req)
    return result


@app.post("/ai/assistant", response_model=ChatResponse)
async def assistant(req: ChatRequest):
    """
    EchoBeats Echo Agent — understands natural-language music requests and
    calls the appropriate Node/Express backend tools (liked songs, search,
    recent played, playlists, artists, create playlist).
    """
    if not req.message or not req.message.strip():
        raise HTTPException(status_code=400, detail="Message is required.")
    result = await chatbot_assistant(req)
    return result
