"""
llm_service.py — EchoBeats AI Service

Is file mein 4 kaam hote hain:
  1. LLM (Gemini) setup
  2. Echo Agent tools (user ki library se data padhte hain)
  3. LLM chains (playlist, lyrics, music search)
  4. chatbot_assistant() — main agent function
"""

import os
from dotenv import load_dotenv

# ── Schemas ───────────────────────────────────────────────────────────────────
from ..schemas.recommendation import RecommendationIntent, PlaylistGenerating
from ..schemas.lyrics import LyricsRequest, LyricsResponse
from ..schemas.assistant import (
    ChatRequest, ChatResponse, PendingPlaylist, UserContext,
    SearchSongsArgs, RecentPlayedArgs, GetLikedSongsArgs,
    GetPlaylistArgs, GetArtistArgs, CreatePlaylistArgs,
)

# ── Prompts ───────────────────────────────────────────────────────────────────
from .prompt import (
    music_request_prompt,
    playlist_generating_prompt,
    lyrics_system_prompt,
    chatbot_assistant_prompt,
)

# ── LangChain ─────────────────────────────────────────────────────────────────
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.tools import tool
from langchain.agents import create_agent


# =============================================================================
# 1. LLM Setup
# =============================================================================

load_dotenv()

api_key = os.getenv("GOOGLE_API_KEY")
if not api_key:
    raise ValueError("GOOGLE_API_KEY is not set in .env")

llm = ChatGoogleGenerativeAI(
    model="gemini-3.5-flash-lite",
    google_api_key=api_key,
)


# =============================================================================
# 2. Echo Agent Tools
#    Node.js pehle se user ka data (liked songs, playlists, recent played)
#    fetch karke bhejta hai. Yeh tools usi data se padhte hain.
# =============================================================================

def build_tools(user_context: UserContext, pending: list):
    """
    6 tools banata hai jo user_context se data padhte hain.
    `pending` list mein create_playlist apna data store karta hai
    taaki Node.js baad mein actual playlist bana sake.
    """

    # Liked + Recently Played songs — dono ko merge karo (duplicates hata ke)
    def _all_songs():
        seen = set()
        result = []
        for s in list(user_context.liked_songs) + list(user_context.recent_played):
            key = ((s.title or "").lower(), (s.artist or "").lower())
            if key not in seen:
                seen.add(key)
                result.append(s)
        return result

    # ── Tool 1: Song Search ───────────────────────────────────────────────────
    @tool(args_schema=SearchSongsArgs)
    async def search_songs(
        query: str | None = None,
        artist_name: str | None = None,
        category: str | None = None,
        limit: int = 10,
    ) -> str:
        """Search songs from user's library (liked + recently played) by name, artist, or mood."""
        q = (query or artist_name or category or "").lower()
        matches = [
            s for s in _all_songs()
            if q in (s.title or "").lower()
            or q in (s.artist or "").lower()
            or q in (s.category or "").lower()
        ][:limit]
        if not matches:
            return f"'{q}' se koi song nahi mila aapki library mein."
        return "\n".join(f"• {s.title} — {s.artist}" for s in matches)

    # ── Tool 2: Recently Played ───────────────────────────────────────────────
    @tool(args_schema=RecentPlayedArgs)
    async def get_recent_played(limit: int = 10) -> str:
        """Get the user's recently played songs."""
        songs = user_context.recent_played[:limit]
        if not songs:
            return "Koi recently played songs nahi mili. Pehle kuch suniye!"
        return "\n".join(f"• {s.title} — {s.artist}" for s in songs)

    # ── Tool 3: Liked Songs ───────────────────────────────────────────────────
    @tool(args_schema=GetLikedSongsArgs)
    async def get_liked_songs(
        artist_name: str | None = None,
        limit: int = 20,
        page: int = 1,
    ) -> str:
        """Get user's liked songs, optionally filtered by artist name."""
        songs = user_context.liked_songs
        if artist_name:
            songs = [s for s in songs if artist_name.lower() in (s.artist or "").lower()]
        songs = songs[(page - 1) * limit : page * limit]
        if not songs:
            return f"{'Koi' if not artist_name else artist_name + ' ke'} liked songs nahi mile."
        return "\n".join(f"• {s.title} — {s.artist}" for s in songs)

    # ── Tool 4: User Playlists ────────────────────────────────────────────────
    @tool(args_schema=GetPlaylistArgs)
    async def get_playlist(playlist_name: str | None = None, limit: int = 10) -> str:
        """Get user's playlists, optionally filtered by name."""
        playlists = user_context.playlists
        if playlist_name:
            playlists = [p for p in playlists if playlist_name.lower() in (p.name or "").lower()]
        playlists = playlists[:limit]
        if not playlists:
            return "Koi playlist nahi mili."
        return "\n".join(f"• {p.name}" for p in playlists)

    # ── Tool 5: Artist Songs ──────────────────────────────────────────────────
    @tool(args_schema=GetArtistArgs)
    async def get_artist(artist_name: str, limit: int = 10) -> str:
        """Get songs by a specific artist from user's full library."""
        songs = [
            s for s in _all_songs()
            if artist_name.lower() in (s.artist or "").lower()
        ][:limit]
        if not songs:
            return f"{artist_name} ke gaane library mein nahi mile. Unhe sunke library add karein!"
        return "\n".join(f"• {s.title} — {s.artist}" for s in songs)

    # ── Tool 6: Create Playlist ───────────────────────────────────────────────
    @tool(args_schema=CreatePlaylistArgs)
    async def create_playlist(playlist_name: str, description: str | None = None) -> str:
        """
        Create a new playlist. Just tell the name and what kind of songs you want.
        Node.js will search the full database and create it automatically.
        """
        # Sirf name aur description store karo — Node.js baaki sab karega
        pending.append(PendingPlaylist(
            name=playlist_name,
            description=description or playlist_name,
            song_ids=[],  # Node.js khud songs dhundega
        ))
        return f"✅ Playlist '{playlist_name}' create ho rahi hai! Node.js songs dhundh ke add karega."

    return [search_songs, get_recent_played, get_liked_songs, get_playlist, get_artist, create_playlist]


# =============================================================================
# 3. LLM Chains (Music Search, Playlist Generator, Lyrics)
# =============================================================================

async def understand_music_request(message: str):
    """User ke message se artist/category/limit samjho (for search feature)."""
    chain = (
        ChatPromptTemplate.from_messages([("system", music_request_prompt), ("human", "{message}")])
        | llm.with_structured_output(RecommendationIntent, method="json_mode")
    )
    return await chain.ainvoke({"message": message})


async def playlist_genrating(message: str):
    """User ke message se playlist ke liye details nikalo (name, artist, category)."""
    chain = (
        ChatPromptTemplate.from_messages([("system", playlist_generating_prompt), ("human", "{message}")])
        | llm.with_structured_output(PlaylistGenerating, method="json_mode")
    )
    return await chain.ainvoke({"message": message})


async def process_lyrics_request(req: LyricsRequest) -> LyricsResponse:
    """Song ke lyrics ko translate/explain/mood analyze karo."""
    human_prompt = (
        f"Song Title: {req.title}\n"
        f"Artist: {req.artist or 'Unknown Artist'}\n"
        f"Action: {req.action or 'explain'}\n"
        f"Language: {req.target_language or 'Hindi'}\n"
        f"User Request: {req.prompt or 'Explain the meaning'}\n\n"
        f"Lyrics:\n---\n{req.lyrics}\n---"
    )
    chain = (
        ChatPromptTemplate.from_messages([("system", lyrics_system_prompt), ("human", human_prompt)])
        | llm.with_structured_output(LyricsResponse, method="json_mode")
    )
    return await chain.ainvoke({})


# =============================================================================
# 4. Echo Agent (Main Chatbot Function)
# =============================================================================

async def chatbot_assistant(req: ChatRequest) -> ChatResponse:
    """
    EchoBeats AI Agent — user ki music requests handle karta hai.

    Flow:
      1. user_context (liked songs, playlists, recent played) se tools banao
      2. Agent ko user ka message do
      3. Agent tools call karta hai aur reply deta hai
      4. Agar playlist banani ho, Node.js ko pending_playlist mein bhejo
    """
    ctx = req.user_context or UserContext()
    pending: list = []
    tools = build_tools(ctx, pending)

    agent = create_agent(model=llm, tools=tools, system_prompt=chatbot_assistant_prompt)

    result = await agent.ainvoke({"messages": [{"role": "user", "content": req.message}]})

    # Final reply extract karo (string ya list dono handle karo)
    final = result["messages"][-1]
    content = final.content if hasattr(final, "content") else str(final)
    reply = (
        " ".join(c.get("text", "") if isinstance(c, dict) else str(c) for c in content)
        if isinstance(content, list)
        else str(content)
    )

    # Windows console pe emoji crash hoti hai — safe print
    print("Echo Agent:", reply.encode("ascii", "backslashreplace").decode("ascii"))

    return ChatResponse(reply=reply, pending_playlist=pending[-1] if pending else None)
