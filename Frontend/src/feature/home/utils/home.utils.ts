// ─── Greeting helper ──────────────────────────────────────────────────────────

export const getGreeting = (): string => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 17) return "Good afternoon";
    return "Good evening";
};

// ─── Duration formatter ───────────────────────────────────────────────────────

export const formatDuration = (seconds?: number): string => {
    if (!seconds) return "—";
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
};
