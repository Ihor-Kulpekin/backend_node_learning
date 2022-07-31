// @ts-ignore
import { ClientOpts, createClient, RedisClient as IRedisClient } from 'redis';
import { injectable } from 'inversify';
import 'reflect-metadata';
import { promisify } from 'util';
import {IRedisClientNew} from "./iredis.lib";

@injectable()
export class RedisClient implements IRedisClientNew {
    private redisClient: IRedisClient;
    private options: ClientOpts;

    constructor(
    ) {
    }

    public async init(): Promise<string | null> {
        if (!this.redisClient) {
            const config = {
                host: "127.0.0.1",
                port: 6379,
                expire: 43200,
                userExpire: 3600,
                graphExpire: 3600,
                retryDelay: 5000
            };
            const prefix = 'igor';

            const {host, port, retryDelay} = config;

            this.options = {
                host,
                port,
                prefix: `${prefix}.`,
                retry_strategy: () => retryDelay
            };

            this.redisClient = createClient(this.options);
            this.redisClient.on('reconnecting', (err: any) => {
                console.log('RedisClient', `Redis reconnecting ${JSON.stringify(err)}`)
            });

            return Promise.resolve('');
        }

        return Promise.resolve('');
    }

    public async hgetall(key: string): Promise<{ [key: string]: string }> {
        await this.init();

        return promisify(this.redisClient.hgetall).bind(this.redisClient)(key);
    }

    public async hget(key: string, field: string): Promise<string> {
        await this.init();

        return promisify(this.redisClient.hget).bind(this.redisClient)(key, field);
    }

    public async expire(key: string, seconds: number): Promise<number> {
        await this.init();

        return promisify(this.redisClient.expire).bind(this.redisClient)(key, seconds);
    }

    public async hset(key: string, field: string, value: string): Promise<number> {
        await this.init();

        return promisify(this.redisClient.hset).bind(this.redisClient)(key, field, value);
    }

    public async hincrby(key: string, field: string, increment: number): Promise<boolean> {
        await this.init();

        return promisify(this.redisClient.hincrby).bind(this.redisClient)(key, field, increment);
    }

    public async hkeys(key: string): Promise<string[]> {
        await this.init();

        return promisify(this.redisClient.hkeys).bind(this.redisClient)(key);
    }

    public async hdel(key: string, field: string | string[]): Promise<number> {
        await this.init();

        return promisify(this.redisClient.hdel).bind(this.redisClient)(key, field);
    }

    public async set(key: string, value: string): Promise<string> {
        await this.init();

        return promisify(this.redisClient.set).bind(this.redisClient)(key, value);
    }

    public async get(key: string): Promise<string> {
        await this.init();

        return promisify(this.redisClient.get).bind(this.redisClient)(key);
    }

    public async getset(key: string, value: string): Promise<string> {
        await this.init();

        return promisify(this.redisClient.getset).bind(this.redisClient)(key, value);
    }

    public async del(key: string): Promise<number> {
        await this.init();

        return promisify(this.redisClient.del).bind(this.redisClient)(key);
    }

    /*
        reference: https://github.com/galanonym/redis-delete-wildcard/blob/master/index.js
    */
    public async delwild(keyWithWildcard: string): Promise<any> {
        await this.init();

        if (this.options.prefix) {
            keyWithWildcard = this.options.prefix + keyWithWildcard;
        }

        return new Promise<any>((resolve, reject) => {
            this.redisClient.eval(
                // little fancy atomic lua script based on
                // http://stackoverflow.com/a/16974060/3202588
                'local keysToDelete = redis.call(\'keys\', ARGV[1]) ' + // find keys with wildcard
                'if #keysToDelete ~= 0 then ' + // if there are any keys
                'local res = 0 ' +
                'local step = 100 ' +
                'for i = 1, #keysToDelete, step do ' +
                'res = res + redis.call(\'del\', unpack(keysToDelete, i, math.min(i + step - 1, #keysToDelete))) ' +
                'end ' +
                'return res ' + // delete all
                'else ' +
                'return 0 ' + // if no keys to delete
                'end ',
                0, // no keys names passed, only one argument ARGV[1]
                keyWithWildcard,
                (err: Error | null, reply: number) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(reply);
                    }
                }
            );
        });
    }
}
