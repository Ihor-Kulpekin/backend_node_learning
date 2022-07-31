import {inject, injectable} from "inversify";
import {IBmlsRepository} from "../../repositories/bmls/ibmls.repository";
import {IBmlsService} from "./ibmls.service";
import {Workbook} from "exceljs";
import fs from "fs";
import {Zip} from "../../lib/zip/zip.lib";
import {ColumnsUtil} from "../../util/columns.util";
import {IRedisClientNew} from "../../lib/redis/iredis.lib";
import {ExportFileStatusEnum} from "../../constants/exportFileStatus.enum";

@injectable()
export class BmlsService implements IBmlsService {
    private rows: number = 1000;

    constructor(
        @inject('BmlsRepository') private bmlsRepository: IBmlsRepository,
        @inject('RedisClient') private redisClient: IRedisClientNew,
    ) {
    }

    public async getBmlsByQuery(query: any): Promise<any> {
        return this.bmlsRepository.getBmls(query);
    }

    public async getSearchResults(query: any): Promise<any> {
        return this.bmlsRepository.getSearchResults(query)
    }

    public async download(query: any): Promise<any> {
        const filePath = query && query.fileName ? query.fileName : 'excel_demo.xlsx';
        let progress = 0;

        const workbook = new Workbook() //creating workbook
        const worksheet = workbook.addWorksheet('sheet1') //creating worksheet

        const entity = await this.bmlsRepository.getBml('ffffbb371287d8949d879a583a94a2d8');

        const column = new ColumnsUtil({module: 'bmls', fields: Object.keys(entity)})

        //add column headers
        worksheet.columns = column.getColumns();
        query.filters = JSON.stringify({
            OTA: 'Priceline'
        })

        query.limit = this.rows;
        query.skip = 0;

        await this.setStatus(ExportFileStatusEnum.DOWNLOADING, 0, filePath);

        const {totalCount} = await this.bmlsRepository.getBmls(query)
        const totalPageCount = Math.ceil(totalCount / this.rows);

        const pages = Array.from(Array(totalPageCount).keys()).map((item) => ++item);

        for (let [index] of pages.entries()) {
            let page = 0;
            const dateProgress = BmlsService.calcProgress(90, pages.length, index);

            const {items} = await this.bmlsRepository.getBmls(query);

            if (items && items.length) {
                worksheet.addRows(items);
            }

            let buffer = dateProgress + BmlsService.calcProgress(90, Math.ceil(totalCount / this.rows), ++page);
            buffer !== Infinity && (progress = buffer);

            await this.setStatus(ExportFileStatusEnum.DOWNLOADING, progress, filePath);

            if (items.length < this.rows) {
                break;
            }
        }

        await workbook.xlsx.writeFile(filePath);

        await this.setStatus(ExportFileStatusEnum.COMPRESSION, 95, filePath);
        const file = await this.compression(filePath, filePath);

        await this.setStatus(ExportFileStatusEnum.COMPRESSION_FINISHED, 98, file);

        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
        }

        const buffer = await fs.promises.readFile(file, {encoding: null})

        await this.setStatus(ExportFileStatusEnum.DONE, 100, file, {
            buffer,
            file
        })

        if (fs.existsSync(file)) {
            fs.unlinkSync(file);
        }

        return 'ok'
    }

    public async getStatus(fileId: string, fileName: string): Promise<any> {
        const result = await this.redisClient.hget('csv', fileName);

        if (result) {
            return JSON.parse(result);
        }

        return null;
    }

    private async setStatus(status: string, progress: number, fileName: string, downloadLink?: any): Promise<void> {
        const data = JSON.stringify({status, progress, fileName, downloadLink});

        await this.redisClient.hset('csv', fileName, data);
    }

    private static calcProgress(max: number, elements: number, page: number): number {
        return Math.round((max / elements) * page);
    }

    private async compression(name: string, file: string): Promise<string> {

        return new Zip(`${file}.zip`)
            .add(name, file)
            .save();
    }
}
