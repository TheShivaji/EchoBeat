from fastapi import HTTPException, FastAPI
from src.services.llm_service import understand_music_request, playlist_genrating, process_lyrics_request
from src.schemas.recommendation import MusicRequest
from src.schemas.lyrics import LyricsRequest, LyricsResponse


app = FastAPI()

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


