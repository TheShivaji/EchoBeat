import asyncio

from fastapi import HTTPException, FastAPI
from .services.llm_service import (
    understand_music_request,
    playlist_genrating,
    process_lyrics_request,
    chatbot_assistant,
)
from .schemas.recommendation import MusicRequest
from .schemas.lyrics import LyricsRequest, LyricsResponse
from .schemas.assistant import ChatRequest, ChatResponse


app = FastAPI(
    title="EchoBeats AI Service",
    description="AI-powered music intelligence engine for EchoBeats",
    version="1.0.0",
)
from fastapi import HTTPException, FastAPI
import asyncio





@app.get("/health", status_code=200)
async def health_check():
    return {"status": "healthy"}

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
        raise HTTPException(
            status_code=400, 
            detail="Lyrics are required for processing."
            )
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
        raise HTTPException(
            status_code=400, 
            detail="Message is required."
            )

        
    max_attempt = 2 

    for attempt in range(max_attempt):
        try:
            result = await asyncio.wait_for(
                chatbot_assistant(req),
                timeout= 30.0
            )
            return result

        except asyncio.TimeoutError:
            if attempt == 0:
                print("Echo Agent timed out. Retrying once...")
                await asyncio.sleep(1)
                continue

            raise HTTPException(
                status_code=504,
                detail="AI processing timed out (took more than 30 seconds). Please try again."
            )
        except Exception:
            raise HTTPException(
                status_code=500,
                detail="Failed to process your request. Please try again."
            )
    
 

    
