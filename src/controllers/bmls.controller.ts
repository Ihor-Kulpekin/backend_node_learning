import {CommonUtil} from "../util/common.util";
import {Context} from "koa";
import {Workbook} from 'exceljs';
import {MongoConnection} from "../database/mongo.connection";
import {Db} from "mongodb";
import fs from "fs";
import {Zip} from "../lib/zip.lib";
import {container} from "../di-container/container";
import {IBmlsService} from "../services/ibmls.service";

export class BmlsController {
    private static bmlsService = container.get<IBmlsService>('BmlsService')

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
        const result = await BmlsController.bmlsService.download(ctx.query);

        CommonUtil.makeResponse(ctx, result)
    }
}
