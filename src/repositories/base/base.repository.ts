import {injectable} from "inversify";
import {IBaseRepository} from "./ibase.repository";
import {MongoClient, Collection} from "mongodb";

@injectable()
export class BaseRepository<T> implements IBaseRepository<T> {
    protected collection: Collection<T> | undefined;
    protected collectionName: string = '';
    private client: MongoClient | undefined;

    public async count(query: any): Promise<any> {
        await this.init();

        const filters = query.filters ? JSON.parse(query.filters) : {};

        return this.collection?.count({...filters});
    }

    public async getMany(query: any = {}): Promise<any> {
        await this.init();

        const filters = query.filters ? JSON.parse(query.filters) : {};
        console.log('this.collection', this.collection);
        return this.collection?.find(filters, {limit: query.limit, skip: query.skip}).toArray();
    }

    getOne(_id: string): Promise<any> {
        return Promise.resolve(undefined);
    }

    private async init(): Promise<void> {
        await this._connect();
    }

    private async _connect(): Promise<void> {
        this.client = await MongoClient.connect('mongodb://localhost:777');
        this.collection = this.client.db('bmls').collection(this.collectionName);
    }
}
