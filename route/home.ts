/// <reference path="./../typings/tsd.d.ts"/>
import * as express from "express";
import {Drive} from "./../GoogleDrive/Drive";
/**
 * HomeRoute
 */
export class HomeRoute {
    private router: express.Router;
    private _drive: Drive;
    constructor() {
        let self = this;
        self.router = express.Router();
        self._drive = new Drive();
        self.router.get("/", function (req: express.Request, res: express.Response, next: Function) {
            res.status(200).send("api is up :)");
        });
        self.router.get("/authenticate", function (req: express.Request, res: express.Response, next: Function) {
            self._drive.generateAuthUrl().then((url) => {
                res.redirect(url);
            }, (rejected) => {
                res.status(500).send(rejected);
            });
        });
        self.router.get("/redirectCallback", function (req: express.Request, res: express.Response, next: Function) {
            self._drive.setAccessToken(req.query.code);
            res.status(200).send("validated");
        });
        self.router.get("/getfiles", function (req: express.Request, res: express.Response, next: Function) {
            self._drive.getFiles().then((response)=>{
                res.status(200).send(response);
            });
        });
    }
    getRouter(): express.Router {
        return this.router;
    }
} 
