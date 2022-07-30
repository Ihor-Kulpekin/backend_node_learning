import { Db, MongoClient } from "mongodb";
import {Context} from "koa";
import {CommonUtil} from "../util/common.util";

type OperationsFunction = (db: Db) => Promise<void>;

export class MongoConnection {
    public static async withDbHook(operations: OperationsFunction, context: Context) {
        try {
            const client = await MongoClient.connect('mongodb://localhost:777')

            const db: Db = client.db('bmls');

            await operations(db)

            await client.close();
        }catch (error) {
            if (context) {
                CommonUtil.makeError(context, {message: `Error:${error}`});
            }
        }
    }
}
