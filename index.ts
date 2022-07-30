import 'source-map-support/register';

import Koa from 'koa';
import bodyParser from 'koa-bodyparser';
import {Routes} from "./src/routes";
import cors from "@koa/cors";


const PORT = 3002;

async function main() {
    const app = new Koa();
    app.use(bodyParser());
    app.use(cors())

    app.use(async (ctx, next) => {
        ctx.set('Access-Control-Allow-Origin', '*');
        ctx.set('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
        ctx.set('Access-Control-Allow-Methods', 'POST, GET, PUT, DELETE, OPTIONS');
        await next();
    });

    app
        .use(new Routes().routes)
        .use(new Routes().router.allowedMethods());

    app.listen(PORT, () => {
        console.log(`Server started on ${PORT}`)
    })
}

main().then().catch()
