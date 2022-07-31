import {CommonUtil} from "../util/common.util";
import {Context} from "koa";
import {container} from "../di-container/container";
import {IBmlsService} from "../services/bmls/ibmls.service";
import {IRedisClientNew} from "../lib/redis/iredis.lib";

export class BmlsController {
    private static bmlsService = container.get<IBmlsService>('BmlsService')
    private static redisCache = container.get<IRedisClientNew>('RedisClient')

    static async getBmls(ctx: Context): Promise<void> {
        const result = await BmlsController.bmlsService.getBmlsByQuery(ctx.query);

        CommonUtil.makeResponse(ctx, result);
    }

    static async helloWorld(ctx: Context): Promise<void> {
        ctx.body = 'hello world';
    }

    static async searchResults(ctx: Context): Promise<void> {
        try {
            const result = await BmlsController.bmlsService.getSearchResults(ctx.query);
            CommonUtil.makeResponse(ctx, result);
        }catch (error) {
            CommonUtil.makeError(ctx, error)
        }
    }

    static async download(ctx: Context): Promise<void> {
        await BmlsController.redisCache.hset('csv', ctx.request.body.fileName, JSON.stringify({
            status: 'In queue', progress: 0, fileName: ctx.request.body.fileName
        }))

        BmlsController.bmlsService.download({...ctx.request.body});

        CommonUtil.makeResponse(ctx, 'ok')
    }

    static async getStatus(ctx: Context): Promise<void> {
        const fileName: any = ctx.request.query.fileName ? ctx.request.query.fileName : '';

        const result = await BmlsController.bmlsService.getStatus('csv', fileName);

        CommonUtil.makeResponse(ctx, result)
    }
}
