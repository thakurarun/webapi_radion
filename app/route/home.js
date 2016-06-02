"use strict";
/// <reference path="./../typings/tsd.d.ts"/>
const express = require("express");
/**
 * HomeRoute
 */
class HomeRoute {
    constructor() {
        this.router = express.Router();
        this.router.get("/", function (req, res, next) {
            res.status(200).send("api is up :)");
        });
        this.router.get("/authenticate", function (req, res, next) {
            res.status(200).send("let authenticate now :)");
        });
    }
    getRouter() {
        return this.router;
    }
}
exports.HomeRoute = HomeRoute;
//# sourceMappingURL=home.js.map