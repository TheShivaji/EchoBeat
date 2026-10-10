from typing import Optional, List
from pydantic import BaseModel, Field


# ─── Tool Input Schemas ────────────────────────────────────────────────────────

class GetLikedSongsArgs(BaseModel):
    """Filter and fetch a user's liked songs from the EchoBeats library."""

    artist_name: Optional[str] = Field(
        None,
        description="Artist name to filter by (e.g. 'Arijit Singh'). Returns all liked songs if omitted.",
    )
    limit: Optional[int] = Field(
        20,
        description="Max songs to return. Default is 20.",
    )
    page: Optional[int] = Field(
        1,
        description="Page number for pagination. Default is 1.",
    )


class SearchSongsArgs(BaseModel):
    """Search songs in the EchoBeats database by query, artist, or category."""

    query: Optional[str] = Field(
        None,
        description="Free-text search query (e.g. 'summer vibes', 'sad songs').",
    )
    artist_name: Optional[str] = Field(
        None,
        description="Filter by artist name.",
    )
    category: Optional[str] = Field(
        None,
        description="Mood/genre category such as 'sad', 'romantic', 'workout', 'party'.",
    )
    limit: Optional[int] = Field(
        10,
        description="Max results. Default is 10.",
    )


class RecentPlayedArgs(BaseModel):
    """Fetch the user's recently played songs."""

    limit: Optional[int] = Field(
        10,
        description="Number of recent songs to fetch. Default is 10.",
    )


class GetPlaylistArgs(BaseModel):
    """Fetch the user's playlists, optionally filtering by name."""

    playlist_name: Optional[str] = Field(
        None,
        description="Name (or partial name) of the playlist to look up. Returns all playlists if omitted.",
    )
    limit: Optional[int] = Field(
        10,
        description="Max playlists to return. Default is 10.",
    )


class GetArtistArgs(BaseModel):
    """Fetch details or songs for a specific artist."""

    artist_name: str = Field(
        ...,
        description="The name of the artist to look up (e.g. 'Arijit Singh').",
    )
    limit: Optional[int] = Field(
        10,
        description="Max songs to return for the artist. Default is 10.",
    )


class CreatePlaylistArgs(BaseModel):
    """Create a new playlist in the user's EchoBeats library."""

    playlist_name: str = Field(
        ...,
        description="Name for the new playlist.",
    )
    description: Optional[str] = Field(
        None,
        description="Optional description for the playlist.",
    )


# ─── User Context (pre-fetched by Node.js and passed to Python) ────────────────

class SongItem(BaseModel):
    id: Optional[str] = None
    title: Optional[str] = None
    artist: Optional[str] = None
    category: Optional[str] = None

class PlaylistItem(BaseModel):
    id: Optional[str] = None
    name: Optional[str] = None
    description: Optional[str] = None

class UserContext(BaseModel):
    """All user-specific data pre-fetched by the Node.js backend."""
    liked_songs: List[SongItem] = Field(default_factory=list)
    recent_played: List[SongItem] = Field(default_factory=list)
    playlists: List[PlaylistItem] = Field(default_factory=list)


# ─── API Request / Response Schemas ───────────────────────────────────────────

class PendingPlaylist(BaseModel):
    """Playlist to be created by Node.js after agent response."""
    name: str
    description: Optional[str] = None
    song_ids: List[str] = Field(default_factory=list)


class PlaySongArgs(BaseModel):
    """Play a specific song from the user's library."""
    song_name: str = Field(
        ...,
        description="The name of the song to play (e.g. 'Tum Hi Ho', 'Sairat Zaala Ji').",
    )


class ChatRequest(BaseModel):
    """Incoming request body for the /ai/assistant endpoint."""

    message: str = Field(..., description="The user's natural-language message.")
    user_id: Optional[str] = Field(
        None,
        description="Authenticated user ID forwarded from the Node backend.",
    )
    user_context: Optional[UserContext] = Field(
        None,
        description="Pre-fetched user data (liked songs, playlists, recent played) from the Node backend.",
    )


class ChatResponse(BaseModel):
    """Final response returned by the /ai/assistant endpoint."""

    reply: str = Field(..., description="The agent's final natural-language answer.")
    pending_playlist: Optional[PendingPlaylist] = Field(
        None,
        description="If the agent decided to create a playlist, contains the data to create it.",
    )
    play_song: Optional[SongItem] = Field(
        None,
        description="If the agent decided to play a song, contains the song data to play.",
    )
