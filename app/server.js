"use strict";
/// <reference path="./typings/tsd.d.ts"/>
const express = require("express");
const homeRouter = require("./route/home");
/**
 * server
 */
class server {
    constructor() {
        this.app = express();
        this.configure();
        this.route();
    }
    configure() {
        this.app.set("port", 3000);
    }
    route() {
        let router = new homeRouter.HomeRoute();
        this.app.use("/", router.getRouter());
    }
    start() {
        this.app.listen(3000, function (err) {
            if (err)
                console.log(err);
            console.log("app is running at port 3000");
        });
    }
}
new server().start();
//# sourceMappingURL=server.js.map