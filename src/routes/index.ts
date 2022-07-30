import {BaseRouter} from "./base.router";
import {ApiRouter} from "./api.router";

export class Routes extends BaseRouter{
    public init(): void {
        this.router.use(
            '/api',
            new ApiRouter().routes
        )
    }
}
