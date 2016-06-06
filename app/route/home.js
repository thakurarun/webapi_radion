"use strict";
/// <reference path="./../typings/tsd.d.ts"/>
const express = require("express");
const Drive_1 = require("./../GoogleDrive/Drive");
var ms = require('mediaserver');
/**
 * HomeRoute
 */
class HomeRoute {
    constructor() {
        let self = this;
        self.router = express.Router();
        self._drive = new Drive_1.Drive();
        self.cache = {};
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
            self._drive.setAccessToken(req.query.code).then((drive) => {
                self.cache[req.query.code] = Object.assign({}, drive);
                res.redirect("/getfolders?token=" + req.query.code);
            });
        });
        self.router.get("/getfolders", function (req, res, next) {
            self._drive.getFolders(self.cache[req.query.token]).then((files) => {
                res.status(200).send(files);
            }, (err) => res.status(500).send(err));
        });
        self.router.get("/getfiles", function (req, res, next) {
            self._drive.getFiles(self.cache[req.query.token]).then((files) => {
                res.status(200).send(files);
            }, (err) => res.status(500).send(err));
        });
        self.router.get("/getstream", function (req, res, next) {
            if (req.query.surl)
                self._drive.getStream(req.query.surl).then((response) => {
                    res.writeHead(200, {
                        'Content-Type': 'audio/mpeg',
                        'Content-Transfer-Encoding': 'chunked',
                        'Content-Range': "bytes 0-" + response.headers["content-length"] + "/" + response.headers["content-length"],
                        'Content-length': response.headers["content-length"]
                    });
                    response.on('data', (d) => {
                        res.write(d);
                    });
                    response.on('end', (d) => {
                        res.end();
                    });
                }, (err) => res.status(500).send(err));
            else
                res.status(200).send("Parameter missing");
        });
    }
    getRouter() {
        return this.router;
    }
}
exports.HomeRoute = HomeRoute;
//# sourceMappingURL=home.js.map