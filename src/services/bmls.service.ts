import {inject, injectable} from "inversify";
import {IBmlsRepository} from "../repositories/bmls/ibmls.repository";
import {IBmlsService} from "./ibmls.service";

@injectable()
export class BmlsService implements IBmlsService{
    constructor(
        @inject('BmlsRepository') private bmlsRepository: IBmlsRepository
    ) {}

    public async getBmlsByQuery(query: any): Promise<any> {
        return this.bmlsRepository.getBmls(query);
    }

    public async getSearchResults(query: any): Promise<any> {
        console.log(1);
        return this.bmlsRepository.getSearchResults(query)
    }
}
