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
    return await client.flushDb();
}

async function getKeys(key: any) {
    return client.keys(key);
}

async function delKeys(key:any) {
    for (let index = 0; index < key.length; index++) {
        await del(key[index]);        
    }
    return true;
}


export class RedisCache {
    static async connect() {
        await client.connect();
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

    static async getKeys(key: any){
        return await getKeys(key);
    }

    static async delKeys(key: any){
        return await delKeys(key);
    }
}


