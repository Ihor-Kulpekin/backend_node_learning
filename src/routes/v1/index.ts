import {BaseRouter} from "../base.router";
import {BmlsRouter} from "./bmls.router";

export class ApiV1 extends BaseRouter {
    public init(): void {
        this.router.use(
            '/bmls',
            new BmlsRouter().routes
        )
    }
}
