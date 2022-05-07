import { client } from './redis';

async function set(key: any, data: any, ttl?: any) {
    await client.set(key, data);
    if (ttl) await client.expire(key, ttl)
}

async function get(key: any) {
    return await client.get(key);
}

async function del(key: any) {
    return await client.del(key)
}

async function clearCache(){
    return client.flushDb();
}


export class RedisCache {
    static async connect() {
        client.on("error", (err: any) => console.log("Redis Client Error", err));
    }

    static async setCache(key: any, data: any, ttl?: any) {
        await set(key, data, ttl);
    }

    static async getCache(key: any) {
        return await get(key);
    }

    static async delCache(key: any) {
        return await del(key)
    }

    static async clearCache(){
        return await clearCache();
    }
}


