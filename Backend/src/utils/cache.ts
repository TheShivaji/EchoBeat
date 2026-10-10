import { redis } from "../config/redis.js";

export async function getCache(key: string) {
    const data = await redis.get(key);

    if (!data) {
        return null;
    }

    return JSON.parse(data);
}

export async function setCache(
    key: string,
    data: unknown,
    ttl: number
) {
    await redis.set(
        key,
        JSON.stringify(data),
        { EX: ttl }
    );
}

export async function deleteCache(key: string) {
    if (!key) return;
    try {
        await redis.del(key);
    } catch (err) {
        console.error(`Failed to delete cache for key ${key}:`, err);
    }
}

export async function deleteCacheByPattern(pattern: string) {
    if (!pattern) return;
    try {
        const keys: string[] = [];
        for await (const key of redis.scanIterator({ MATCH: pattern })) {
            if (key) keys.push(...key);
        }
        if (keys.length > 0) {
            await redis.del(keys);
        }
    } catch (err) {
        console.error(`Failed to delete cache pattern ${pattern}:`, err);
    }
}



export async function deleteHomeCache() {
    await Promise.all([
        deleteCache("home:popular_artists"),
        deleteCache("home:trending_songs"),
        deleteCache("home:new_releases"),
    ]);
}