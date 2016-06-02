/// <reference path="./typings/tsd.d.ts"/>
import * as express from "express";
import * as homeRouter from "./route/home";
/**
 * server
 */
class server {
    private app : express.Application; 
    constructor() {
        this.app = express();
        this.configure();
        this.route();   
    }
    configure(){
        this.app.set("port",3000);
    }
    route(){
        let router = new  homeRouter.HomeRoute();
        this.app.use("/",  router.getRouter());
    }
    start(){
        this.app.listen(3000, function (err) {
            if(err) console.log(err);
            console.log("app is running at port 3000");
        })
    }
}
new server().start();