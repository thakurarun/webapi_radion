/// <reference path="./../typings/tsd.d.ts"/>
import * as express from "express";
/**
 * HomeRoute
 */
export class HomeRoute {
    private router: express.Router;
    constructor() {
        this.router = express.Router();
        this.router.get("/", function (req: express.Request, res: express.Response, next: Function) {
            res.status(200).send("api is up :)");
        });
         this.router.get("/authenticate", function (req: express.Request, res: express.Response, next: Function) {
            res.status(200).send("let authenticate now :)");
        });
    }
    getRouter(): express.Router {
        return this.router;
    }
} 
