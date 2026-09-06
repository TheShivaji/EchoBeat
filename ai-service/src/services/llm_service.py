import os
import asyncio
from dotenv import load_dotenv

from ..schemas.recommendation import RecommendationIntent
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.prompts import ChatPromptTemplate



load_dotenv()

api_key = os.getenv("GOOGLE_API_KEY")

if not api_key:
    raise ValueError("GOOGLE_API_KEY is not set")




async def understand_music_request (message):

    llm  = ChatGoogleGenerativeAI(
        model = "gemini-3.5-flash-lite",
        google_api_key = api_key
    )

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



