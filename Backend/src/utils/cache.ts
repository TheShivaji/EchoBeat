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
    await redis.del(key);
}

export async function deleteCacheByPattern(pattern: string) {
    for await (const key of redis.scanIterator({ MATCH: pattern })) {
        await redis.del(key);
    }
}



export async function deleteHomeCache() {
    await Promise.all([
        deleteCache("home:popular_artists"),
        deleteCache("home:trending_songs"),
        deleteCache("home:new_releases"),
    ]);
}