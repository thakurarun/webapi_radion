"use strict";
/// <reference path="./../typings/tsd.d.ts"/>
const express = require("express");
const Drive_1 = require("./../GoogleDrive/Drive");
/**
 * HomeRoute
 */
class HomeRoute {
    constructor() {
        let self = this;
        self.router = express.Router();
        self._drive = new Drive_1.Drive();
        self.router.get("/", function (req, res, next) {
            res.status(200).send("api is up :)");
        });
        self.router.get("/authenticate", function (req, res, next) {
            self._drive.generateAuthUrl().then((url) => {
                res.redirect(url);
            }, (rejected) => {
                res.status(500).send(rejected);
            });
        });
        self.router.get("/redirectCallback", function (req, res, next) {
            self._drive.setAccessToken(req.query.code);
            res.status(200).send("validated");
        });
        self.router.get("/getfiles", function (req, res, next) {
            self._drive.getFiles().then((response) => {
                res.status(200).send(response);
            });
        });
    }
    getRouter() {
        return this.router;
    }
}
exports.HomeRoute = HomeRoute;
//# sourceMappingURL=home.js.map