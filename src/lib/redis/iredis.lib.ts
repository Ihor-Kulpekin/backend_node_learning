export interface IRedisClientNew {
    init(): Promise<string | null>;
    hgetall(key: string): Promise<{[key: string]: string}>;
    hget(key: string, field: string): Promise<string>;
    expire(key: string, seconds: number): Promise<number>;
    hset(key: string, field: string, value: string): Promise<number>;
    hincrby(key: string, field: string, increment: number): Promise<boolean>;
    hkeys(key: string): Promise<string[]>;
    hdel(key: string, field: string | string[]): Promise<number>;
    set(key: string, value: string): Promise<string>;
    get(key: string): Promise<string>;
    getset(key: string, value: string): Promise<string>;
    del(key: string): Promise<number>;
    delwild(keyWithWildcard: string): Promise<any>;
}
