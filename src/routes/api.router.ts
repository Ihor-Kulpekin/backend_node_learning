import {BaseRouter} from "./base.router";
import {ApiV1} from "./v1";

export class ApiRouter extends BaseRouter{
    public init(): void {
        this.router.use(
            '/v1',
            new ApiV1().routes
        )
    }
}
