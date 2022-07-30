import Router = require('koa-router');

export class BaseRouter {
    constructor(public router: Router = new Router()) {
        this.init();
    }

    public get routes(): any {
        return this.router.routes();
    }

    protected init(): void {
        console.warn('Router not init');
    }
}
