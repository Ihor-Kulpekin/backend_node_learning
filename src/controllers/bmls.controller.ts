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
        const filePath = `excel_demo.xlsx`;

        const workbook = new Workbook() //creating workbook
        const worksheet = workbook.addWorksheet('sheet1') //creating worksheet
        const fields: any[] = [];
        const rows: any[] = [];

        await MongoConnection.withDbHook(async (dB: Db) => {
            const collection = await dB.collection('bmls');

            const response = await collection.findOne({unique_id: 'ffffbb371287d8949d879a583a94a2d8'}) || {};

            Object.keys(response).forEach((key)=>{
                fields.push(key);
            })
        }, ctx)

        const columns: any[] = fields.map((field: string) => ({
            header: field.charAt(0).toUpperCase() + field.slice(1),
            key: field
        }));

        //add column headers
        worksheet.columns = columns;

        await MongoConnection.withDbHook(async (dB: Db) => {
            const collection = await dB.collection('bmls');

            const response = await collection.find({}, {limit: 100, skip: 0}).toArray();

            response.forEach((item) => {
                rows.push({...item});
            })
        }, ctx);

        worksheet.addRows(rows);
        await workbook.xlsx.writeFile(filePath);

        const file = await BmlsController.compression(filePath, filePath);

        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
        }
        //
        // //Write to local, File

        //Write to memory, buffer
        const buffer = await fs.promises.readFile(file, { encoding:null })

        if (fs.existsSync(file)) {
            fs.unlinkSync(file);
        }

        ctx.body = {
            status: 'success',
            content: buffer,
            file: file || 'hui'
        }
    }

    private static async compression(name: string, file: string): Promise<string> {

        return new Zip(`${file}.zip`)
            .add(name, file)
            .save();
    }
}
