from fastapi import HTTPException, FastAPI
from src.services.llm_service import understand_music_request, playlist_genrating
from src.schemas.recommendation import MusicRequest


app = FastAPI()

@app.post("/ai/understand")
async def understand(req:MusicRequest):
    
    result = await understand_music_request(req.message)

    return result

@app.post("/ai/playlist")
async def playlist(req:MusicRequest):
    
    result = await playlist_genrating(req.message)

    return result


