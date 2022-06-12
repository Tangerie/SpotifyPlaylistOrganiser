import { createClient } from 'redis';

let database;

/**
 * 
 * @returns {import('redis').RedisClientType}
 */
export function getDatabase() {
    if(database) {
        return database;
    }

    const client = createClient(
        {
            url: process.env.REDIS_SERVER,
            database: 0
        }
    );
    
    client.on('error', (err) => console.log('Redis Client Error', err));

    return client;
}