import "reflect-metadata";

import {Container} from "inversify";
import {IBmlsRepository} from "../repositories/bmls/ibmls.repository";
import {BmlsRepository} from "../repositories/bmls/bmls.repository";
import {IBmlsService} from "../services/bmls/ibmls.service";
import {BmlsService} from "../services/bmls/bmls.service";
import {IRedisClientNew} from "../lib/redis/iredis.lib";
import {RedisClient} from "../lib/redis/redis.lib";

export const container = new Container();

container.bind<IBmlsRepository>('BmlsRepository').to(BmlsRepository);
container.bind<IBmlsService>('BmlsService').to(BmlsService);
container.bind<IRedisClientNew>('RedisClient').to(RedisClient);
