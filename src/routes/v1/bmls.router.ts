import {BaseRouter} from "../base.router";
import {BmlsController} from "../../controllers/bmls.controller";

export class BmlsRouter extends BaseRouter{
    public init(): void {
        this.router.get(
            '/',
            BmlsController.getBmls
        );

        this.router.get(
            '/hello-world',
            BmlsController.helloWorld
        );

        this.router.get(
            '/search-results',
            BmlsController.searchResults
        );

        this.router.post(
            '/download',
            BmlsController.download
        );

        this.router.get(
            '/status',
            BmlsController.getStatus
        );
    }
}
