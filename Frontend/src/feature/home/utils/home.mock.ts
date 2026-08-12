import type { HomeData } from "../types/home.types";

// ─── MOCK DATA — Remove once real API data is available ──────────────────────
// Images from picsum.photos (seed-based = consistent per ID)

export const MOCK_HOME_DATA: HomeData = {
    popularArtists: [
        { id: "a1", name: "Luna Ray",       imageUrl: "https://picsum.photos/seed/luna/300/300",   playCount: 48200 },
        { id: "a2", name: "The Void Echo",  imageUrl: "https://picsum.photos/seed/void/300/300",   playCount: 37100 },
        { id: "a3", name: "Marlowe",        imageUrl: "https://picsum.photos/seed/marlowe/300/300",playCount: 29500 },
        { id: "a4", name: "Nadia Sol",      imageUrl: "https://picsum.photos/seed/nadia/300/300",  playCount: 21800 },
        { id: "a5", name: "Caspian",        imageUrl: "https://picsum.photos/seed/caspian/300/300",playCount: 18300 },
        { id: "a6", name: "Elliot Crane",   imageUrl: "https://picsum.photos/seed/elliot/300/300", playCount: 14700 },
        { id: "a7", name: "Voss",           imageUrl: "https://picsum.photos/seed/voss/300/300",   playCount: 11200 },
    ],

    popularSongs: [
        { id: "s1",  title: "Midnight Static",    artists: [{ id: "a1", name: "Luna Ray" }],      imageUrl: "https://picsum.photos/seed/s1/80/80",  playCount: 12400 },
        { id: "s2",  title: "Drift",              artists: [{ id: "a2", name: "The Void Echo" }],  imageUrl: "https://picsum.photos/seed/s2/80/80",  playCount: 10800 },
        { id: "s3",  title: "Pale Hours",         artists: [{ id: "a3", name: "Marlowe" }],        imageUrl: "https://picsum.photos/seed/s3/80/80",  playCount: 9300  },
        { id: "s4",  title: "Solace",             artists: [{ id: "a4", name: "Nadia Sol" }],      imageUrl: "https://picsum.photos/seed/s4/80/80",  playCount: 8700  },
        { id: "s5",  title: "Northern Light",     artists: [{ id: "a5", name: "Caspian" }],        imageUrl: "https://picsum.photos/seed/s5/80/80",  playCount: 7600  },
        { id: "s6",  title: "Hollow Ground",      artists: [{ id: "a6", name: "Elliot Crane" }],   imageUrl: "https://picsum.photos/seed/s6/80/80",  playCount: 6900  },
        { id: "s7",  title: "The Quiet Room",     artists: [{ id: "a1", name: "Luna Ray" }],       imageUrl: "https://picsum.photos/seed/s7/80/80",  playCount: 6100  },
        { id: "s8",  title: "Carbon",             artists: [{ id: "a7", name: "Voss" }],           imageUrl: "https://picsum.photos/seed/s8/80/80",  playCount: 5400  },
    ],

    newReleases: [
        { id: "n1", title: "Afterglow",         artists: [{ id: "a1", name: "Luna Ray" }],      imageUrl: "https://picsum.photos/seed/n1/300/300", releasedDate: "2026-08-01" },
        { id: "n2", title: "Signals",           artists: [{ id: "a2", name: "The Void Echo" }], imageUrl: "https://picsum.photos/seed/n2/300/300", releasedDate: "2026-07-28" },
        { id: "n3", title: "Interlude",         artists: [{ id: "a3", name: "Marlowe" }],       imageUrl: "https://picsum.photos/seed/n3/300/300", releasedDate: "2026-07-22" },
        { id: "n4", title: "Glass Ceiling",     artists: [{ id: "a4", name: "Nadia Sol" }],     imageUrl: "https://picsum.photos/seed/n4/300/300", releasedDate: "2026-07-15" },
        { id: "n5", title: "Periphery",         artists: [{ id: "a5", name: "Caspian" }],       imageUrl: "https://picsum.photos/seed/n5/300/300", releasedDate: "2026-07-10" },
        { id: "n6", title: "The Last Shore",    artists: [{ id: "a7", name: "Voss" }],          imageUrl: "https://picsum.photos/seed/n6/300/300", releasedDate: "2026-07-04" },
    ],

    recentlyPlayed: [
        { id: "rp1", playedAt: "2026-08-12T10:00:00Z", song: { id: "s1", title: "Midnight Static", artists: [{ id: "a1", name: "Luna Ray" }],     imageUrl: "https://picsum.photos/seed/s1/80/80" } },
        { id: "rp2", playedAt: "2026-08-12T09:30:00Z", song: { id: "s3", title: "Pale Hours",       artists: [{ id: "a3", name: "Marlowe" }],       imageUrl: "https://picsum.photos/seed/s3/80/80" } },
        { id: "rp3", playedAt: "2026-08-12T09:00:00Z", song: { id: "s5", title: "Northern Light",   artists: [{ id: "a5", name: "Caspian" }],       imageUrl: "https://picsum.photos/seed/s5/80/80" } },
        { id: "rp4", playedAt: "2026-08-11T22:00:00Z", song: { id: "s2", title: "Drift",            artists: [{ id: "a2", name: "The Void Echo" }], imageUrl: "https://picsum.photos/seed/s2/80/80" } },
        { id: "rp5", playedAt: "2026-08-11T21:00:00Z", song: { id: "n1", title: "Afterglow",        artists: [{ id: "a1", name: "Luna Ray" }],      imageUrl: "https://picsum.photos/seed/n1/80/80" } },
        { id: "rp6", playedAt: "2026-08-11T20:00:00Z", song: { id: "s4", title: "Solace",           artists: [{ id: "a4", name: "Nadia Sol" }],     imageUrl: "https://picsum.photos/seed/s4/80/80" } },
    ],
};
