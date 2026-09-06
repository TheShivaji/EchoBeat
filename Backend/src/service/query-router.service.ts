export type RouteDecision = 'SEARCH' | 'AI_RECOMMENDATION';

export const routeQuery = (query: string): RouteDecision => {
    const normalizedQuery = query.toLowerCase().trim();
    
    if (!normalizedQuery) {
        return 'SEARCH';
    }

    let score = 0;

    // Strong intent keywords (+2)
    const strongKeywords = [
        "give me",
        "suggest",
        "recommend",
        "batao",
        "sunao",
        "chalao",
        "play some",
        "songs like",
        "ke songs do",
        "songs do",
        "dikhao"
    ];

    // Moderate intent keywords (+1)
    const moderateKeywords = [
        "top",
        "best",
        "latest",
        "sad",
        "romantic",
        "party",
        "workout",
        "chill",
        "songs of",
        "gaane"
    ];

    
    if (/\b\d+\s+(songs|gaane)\b/.test(normalizedQuery) || /\btop\s+\d+\b/.test(normalizedQuery)) {
        score += 2;
    }

    
    for (const keyword of strongKeywords) {
        if (normalizedQuery.includes(keyword)) {
            score += 2;
        }
    }

    
    for (const keyword of moderateKeywords) {
        
        const regex = new RegExp(`\\b${keyword}\\b`);
        if (regex.test(normalizedQuery)) {
            score += 1;
        }
    }

    
    if (score >= 2) {
        const wordCount = normalizedQuery.split(/\s+/).length;
        
        if (wordCount > 2) {
            return 'AI_RECOMMENDATION';
        }
    }

    return 'SEARCH';
};
