import {PageIdsConstant} from "../constants/page-ids.constant";

export class ColumnsUtil {
    protected columns: any[] = [];

    protected page: any = {
        [PageIdsConstant.bmls]: this.bmlsTable.bind(this),
    };


    constructor(protected options: any) {
        this.map();
    }

    protected map(): void {
        this.columns = this.getColumns();
    }

    public getColumns(): any[] {
        return this.page[this.options.module]();
    }

    private bmlsTable(){
        return this.options.fields.map((field: string) => ({
            header: field.charAt(0).toUpperCase() + field.slice(1),
            key: field
        }));
    }
}
