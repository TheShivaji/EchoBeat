import os
import asyncio
from dotenv import load_dotenv

from ..schemas.recommendation import RecommendationIntent, PlaylistGenerating
from ..schemas.lyrics import LyricsRequest, LyricsResponse
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.prompts import ChatPromptTemplate



load_dotenv()

api_key = os.getenv("GOOGLE_API_KEY")

if not api_key:
    raise ValueError("GOOGLE_API_KEY is not set")

llm  = ChatGoogleGenerativeAI(
        model = "gemini-3.5-flash-lite",
        google_api_key = api_key
    )

async def understand_music_request (message):

    system_prompt = """You are the query understanding engine for EchoBeats.

Your job is to understand the user's music request and extract structured search intent.

Extract:
- artist
- category
- limit

Rules:
1. Return only valid JSON.
2. Do not recommend or invent songs.
3. Do not answer the user's question.
4. If an artist is mentioned, return the artist name.
5. If a music category/mood is mentioned, return it.
6. If the user specifies a number of songs, use that number.
7. If no limit is specified, use 10.
8. If a field is not present, return null.
9. Normalize obvious artist names when possible.
10. Keep the category concise, such as "sad", "romantic", "party", "workout", or "devotional".

Output format:

{{
  "artist": "string | null",
  "category": "string | null",
  "limit": number
}}"""


    prompt = ChatPromptTemplate.from_messages([
        ("system" , system_prompt),
        ("human" , "{message}"),
    ])

    structured_llm = llm.with_structured_output(RecommendationIntent,method="json_mode")

    chain = prompt | structured_llm

    result = await chain.ainvoke({"message":message})
    print(result)
    return result

async def playlist_genrating(message: str):

    playlist_prompt = """You are the EchoBeats AI Playlist Intent Understanding Engine.

Your job is to understand the user's playlist request and extract structured intent.

Extract:
- playlist_name
- category
- artist
- limit

Rules:
- Return only structured output.
- Do not generate or recommend song names.
- Do not invent songs, artists, or categories.
- If an artist is mentioned, extract the artist name.
- If a mood, genre, activity, or purpose is mentioned, use it as category.
- If the user specifies a number of songs, use that number as limit.
- If no number is specified, default limit to 10.
- If a field is not mentioned or cannot be determined, return null.
- Keep category short and normalized, such as "sad", "romantic", "workout", "coding", "party", "devotional".
- Generate a concise playlist_name based on the user's request.
- Understand Hinglish, Hindi, and English requests.

The LLM only understands the user's intent.
Actual songs will be retrieved from the EchoBeats database by the backend."""

    prompt = ChatPromptTemplate.from_messages([
        ("system" , playlist_prompt),
        ("human" , "{message}"),
    ])

    structured_llm = llm.with_structured_output(PlaylistGenerating,method="json_mode")

    chain = prompt | structured_llm

    result = await chain.ainvoke({"message":message})
    print(result)
    return result

async def process_lyrics_request(req: LyricsRequest) -> LyricsResponse:
    lyrics_system_prompt = """You are the EchoBeats AI Lyrics Translator & Explainer Engine.

Your job is to process ONLY the provided song lyrics according to the user's intent.

CRITICAL CONSTRAINTS:
1. Process ONLY the lyrics provided in the input. Do NOT invent, guess, or reconstruct missing lyrics.
2. Do NOT invent real-world biographical facts or claim uncertain background as fact. Base your explanations strictly on the emotional, poetic, and thematic interpretation of the provided lyrics.
3. Understand the user's intent from their prompt or explicit action:
   - If TRANSLATION is requested (e.g. action="translate" or prompt asks to translate into a language):
     * Translate the provided lyrics naturally and lyrically into the target language (default to Hindi if unspecified).
     * Set 'action' to 'translate'.
     * Set 'target_language' to the requested language.
     * Leave 'meaning_summary', 'mood_and_vibe', 'key_themes', and 'poetic_breakdown' as null/empty unless also requested.
   - If MEANING / EXPLANATION is requested (e.g. action="explain" or prompt asks "meaning samjhao", "what does this mean", "explain chorus/line"):
     * Set 'action' to 'explain'.
     * Provide a clear, insightful 'meaning_summary'.
     * Provide 2-4 'key_themes' (e.g., ["Heartbreak", "Longing", "Self-Discovery"]).
     * Leave 'translated_lyrics' as null unless translation was also requested.
   - If MOOD / VIBE is requested (e.g. action="mood" or prompt asks "mood kya hai", "vibe"):
     * Set 'action' to 'mood'.
     * Set 'mood_and_vibe' to a concise, expressive description (e.g., "Melancholic, deeply nostalgic, and reflective").
     * Provide a concise 'meaning_summary' highlighting the emotional atmosphere.
     * Leave other unrequested fields null.
   - If BOTH / COMPREHENSIVE is requested (e.g. action="all" or prompt asks "translate karke meaning samjhao"):
     * Set 'action' to 'all'.
     * Populate 'translated_lyrics', 'meaning_summary', 'mood_and_vibe', and 'key_themes'.
4. Understand English, Hindi, and Hinglish prompts seamlessly.
5. Return clean structured output."""

    human_prompt = f"""Song Title: {req.title}
Artist: {req.artist or 'Unknown Artist'}
Requested Action: {req.action or 'explain'}
Target Language: {req.target_language or 'Hindi'}
User Prompt: {req.prompt or 'Explain the meaning of this song'}

Provided Lyrics:
---
{req.lyrics}
---"""

    prompt = ChatPromptTemplate.from_messages([
        ("system", lyrics_system_prompt),
        ("human", human_prompt),
    ])

    structured_llm = llm.with_structured_output(LyricsResponse, method="json_mode")
    chain = prompt | structured_llm

    result = await chain.ainvoke({})
    print("Lyrics AI result:", result)
    return result




