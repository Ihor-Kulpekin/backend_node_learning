import {injectable} from "inversify";
import {BaseRepository} from "../base/base.repository";
import {IBmlsRepository} from "./ibmls.repository";

@injectable()
export class BmlsRepository extends BaseRepository<any> implements IBmlsRepository{
    protected collectionName: string = 'bmls';

    public async getBmls(query: any): Promise<any> {
        const items = await this.getMany(query);
        const totalCount = await this.count(query);

        return {
            items,
            totalCount
        };
    }

    public async getBml(id: string): Promise<any> {
        return this.getOne(id);
    }

    public async getSearchResults(query: any): Promise<any> {
        await this.init();

        const bmls = await this.collection?.find({
            $or: [
                {
                    hotel_name: {$regex: query.search_value, $options: 'i'}
                },
                {
                    region: {$regex: query.search_value, $options: 'i'}
                },
                {
                    city: {$regex: query.search_value, $options: 'i'}
                }
            ]
        }, {limit: 15, skip: 0}).toArray();

        return bmls?.map((bml) => ({
            id: bml._id,
            text: bml.hotel_name
        }));
    }
}
