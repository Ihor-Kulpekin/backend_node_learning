import {inject, injectable} from "inversify";
import {IBmlsRepository} from "../repositories/bmls/ibmls.repository";
import {IBmlsService} from "./ibmls.service";
import {Workbook} from "exceljs";
import {MongoConnection} from "../database/mongo.connection";
import {Db} from "mongodb";
import fs from "fs";
import {Zip} from "../lib/zip.lib";

@injectable()
export class BmlsService implements IBmlsService{
    constructor(
        @inject('BmlsRepository') private bmlsRepository: IBmlsRepository
    ) {}

    public async getBmlsByQuery(query: any): Promise<any> {
        return this.bmlsRepository.getBmls(query);
    }

    public async getSearchResults(query: any): Promise<any> {1
        return this.bmlsRepository.getSearchResults(query)
    }

    public async download(query: any): Promise<any> {
        const filePath = `excel_demo.xlsx`;

        const workbook = new Workbook() //creating workbook
        const worksheet = workbook.addWorksheet('sheet1') //creating worksheet
        const fields: any[] = [];
        const rows: any[] = [];

        const bml = await this.bmlsRepository.getBml('ffffbb371287d8949d879a583a94a2d8');

        Object.keys(bml).forEach((key)=>{
            fields.push(key);
        });

        const columns: any[] = fields.map((field: string) => ({
            header: field.charAt(0).toUpperCase() + field.slice(1),
            key: field
        }));

        //add column headers
        worksheet.columns = columns;

        query.limit = 100;
        query.skip = 0;
        const bmls = await this.bmlsRepository.getBmls(query);
        bmls.items.forEach((bml: any) => {
            rows.push({...bml})
        })

        worksheet.addRows(rows);
        await workbook.xlsx.writeFile(filePath);

        const file = await this.compression(filePath, filePath);

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

        return {
            content: buffer,
            file
        }
    }

    private async compression(name: string, file: string): Promise<string> {

        return new Zip(`${file}.zip`)
            .add(name, file)
            .save();
    }
}
