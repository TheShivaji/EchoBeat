import os
import asyncio
from dotenv import load_dotenv
from typing import Any

from ..schemas.recommendation import RecommendationIntent, PlaylistGenerating
from ..schemas.lyrics import LyricsRequest, LyricsResponse
from ..schemas.assistant import (
    ChatRequest,
    ChatResponse,
    GetLikedSongsArgs,
    SearchSongsArgs,
    RecentPlayedArgs,
    GetPlaylistArgs,
    GetArtistArgs,
    CreatePlaylistArgs,
    UserContext,
)
from .prompt import (
    music_request_prompt,
    playlist_generating_prompt,
    lyrics_system_prompt,
    chatbot_assistant_prompt,
)

from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.tools import tool
from langchain.agents import create_agent


load_dotenv()

api_key = os.getenv("GOOGLE_API_KEY")

if not api_key:
    raise ValueError("GOOGLE_API_KEY is not set")

llm = ChatGoogleGenerativeAI(
    model="gemini-3.5-flash-lite",
    google_api_key=api_key,
)


# ─── Tool Builder: reads from pre-fetched user_context ────────────────────────

def build_tools(user_context: UserContext):
    """
    Build LangChain tools that read directly from the user_context
    pre-fetched by Node.js (no HTTP calls to backend needed).
    """

    # Merge liked_songs + recent_played (deduped by title+artist) for broader search
    def _all_songs() -> list:
        seen = set()
        merged = []
        for s in list(user_context.liked_songs) + list(user_context.recent_played):
            key = ((s.title or "").lower(), (s.artist or "").lower())
            if key not in seen:
                seen.add(key)
                merged.append(s)
        return merged

    @tool(args_schema=SearchSongsArgs)
    async def search_songs(
        query: str | None = None,
        artist_name: str | None = None,
        category: str | None = None,
        limit: int = 10,
    ) -> str:
        """Search songs from the user's full library (liked + recently played) by query, artist, or mood/category."""
        q_lower = (query or artist_name or category or "").lower()
        all_songs = _all_songs()
        results = [
            s for s in all_songs
            if q_lower in (s.title or "").lower()
            or q_lower in (s.artist or "").lower()
            or q_lower in (s.category or "").lower()
        ][:limit]
        if not results:
            return f"Aapki library mein '{q_lower}' se koi matching song nahi mila."
        return "\n".join(f"• {s.title or 'Unknown'} — {s.artist or 'Unknown'}" for s in results)

    @tool(args_schema=RecentPlayedArgs)
    async def get_recent_played(limit: int = 10) -> str:
        """Fetch the user's recently played songs from their listening history."""
        songs = user_context.recent_played[:limit]
        if not songs:
            return "Koi recently played songs nahi mile. Pehle kuch gaane suniye!"
        return "\n".join(f"• {s.title or 'Unknown'} — {s.artist or 'Unknown'}" for s in songs)

    @tool(args_schema=GetLikedSongsArgs)
    async def get_liked_songs(
        artist_name: str | None = None,
        limit: int = 20,
        page: int = 1,
    ) -> str:
        """Fetch the user's liked/favorited songs, optionally filtered by artist name."""
        songs = user_context.liked_songs
        if artist_name:
            a_lower = artist_name.lower()
            songs = [s for s in songs if a_lower in (s.artist or "").lower()]
        start = (page - 1) * limit
        songs = songs[start: start + limit]
        if not songs:
            msg = f"{artist_name} ke" if artist_name else "Koi"
            return f"{msg} liked songs nahi mile."
        return "\n".join(f"• {s.title or 'Unknown'} — {s.artist or 'Unknown'}" for s in songs)

    @tool(args_schema=GetPlaylistArgs)
    async def get_playlist(
        playlist_name: str | None = None,
        limit: int = 10,
    ) -> str:
        """Fetch the user's playlists, optionally filtering by playlist name."""
        playlists = user_context.playlists
        if playlist_name:
            p_lower = playlist_name.lower()
            playlists = [p for p in playlists if p_lower in (p.name or "").lower()]
        playlists = playlists[:limit]
        if not playlists:
            return "Koi playlist nahi mili."
        return "\n".join(f"• {p.name or 'Unknown'}" for p in playlists)

    @tool(args_schema=GetArtistArgs)
    async def get_artist(artist_name: str, limit: int = 10) -> str:
        """Fetch songs for a specific artist from the user's full library (liked + recently played)."""
        a_lower = artist_name.lower()
        all_songs = _all_songs()
        songs = [
            s for s in all_songs
            if a_lower in (s.artist or "").lower()
        ][:limit]
        if not songs:
            return (
                f"{artist_name} ke koi gaane aapki library (liked ya recently played) mein nahi mile.\n"
                f"Unke gaane search karke suniye, phir library mein automatically aayenge!"
            )
        return "\n".join(f"• {s.title or 'Unknown'} — {s.artist or 'Unknown'}" for s in songs)

    @tool(args_schema=CreatePlaylistArgs)
    async def create_playlist(
        playlist_name: str,
        description: str | None = None,
    ) -> str:
        """Suggest creating a new playlist with a name and optional description."""
        desc = description or f"AI generated playlist: {playlist_name}"
        return (
            f"✅ Playlist '{playlist_name}' create karne ke liye ready hai!\n"
            f"Description: {desc}\n"
            f"Note: App mein 'Create Playlist' button se confirm karein."
        )

    return [
        search_songs,
        get_recent_played,
        get_liked_songs,
        get_playlist,
        get_artist,
        create_playlist,
    ]


# ─── Existing LLM Chains ──────────────────────────────────────────────────────

async def understand_music_request(message):
    prompt = ChatPromptTemplate.from_messages([
        ("system", music_request_prompt),
        ("human", "{message}"),
    ])
    structured_llm = llm.with_structured_output(RecommendationIntent, method="json_mode")
    chain = prompt | structured_llm
    result = await chain.ainvoke({"message": message})
    print(result)
    return result


async def playlist_genrating(message: str):
    prompt = ChatPromptTemplate.from_messages([
        ("system", playlist_generating_prompt),
        ("human", "{message}"),
    ])
    structured_llm = llm.with_structured_output(PlaylistGenerating, method="json_mode")
    chain = prompt | structured_llm
    result = await chain.ainvoke({"message": message})
    print(result)
    return result


async def process_lyrics_request(req: LyricsRequest) -> LyricsResponse:
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


# ─── Echo Agent ────────────────────────────────────────────────────────────────

async def chatbot_assistant(req: ChatRequest) -> ChatResponse:
    """
    Run the EchoBeats ReAct agent.
    Tools read from user_context (pre-fetched by Node.js) — no backend HTTP calls needed.
    """
    ctx = req.user_context or UserContext()
    tools = build_tools(ctx)

    agent = create_agent(
        model=llm,
        tools=tools,
        system_prompt=chatbot_assistant_prompt,
    )

    messages = [{"role": "user", "content": req.message}]
    result = await agent.ainvoke({"messages": messages})

    final_message = result["messages"][-1]
    content = final_message.content if hasattr(final_message, "content") else str(final_message)
    if isinstance(content, list):
        reply = " ".join([c.get("text", "") if isinstance(c, dict) else str(c) for c in content])
    else:
        reply = str(content)

    # Safe print for Windows consoles (avoids UnicodeEncodeError with emojis)
    safe_reply = reply.encode('ascii', 'backslashreplace').decode('ascii')
    print("Echo Agent reply:", safe_reply)

    return ChatResponse(reply=reply)
