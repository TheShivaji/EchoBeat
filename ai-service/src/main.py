from fastapi import HTTPException, FastAPI
from src.services.llm_service import understand_music_request
from src.schemas.recommendation import MusicRequest


app = FastAPI()

@app.post("/ai/understand")
async def understand(req:MusicRequest):
    
    result = await understand_music_request(req.message)

    return result


