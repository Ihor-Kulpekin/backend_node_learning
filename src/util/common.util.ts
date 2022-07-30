import {Context} from "koa";

export class CommonUtil {
    static makeResponse(ctx: Context, data: any): void {
        ctx.body = data;
        ctx.message = 'success';
    }

    static makeError(ctx: Context, data: any): void {
        ctx.body = data;
        ctx.message = 'failed';
    }
}
