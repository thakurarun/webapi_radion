import * as http from "https";
var URL = require('url');
export class DownloadMedia {
    private _url: string;
    private _fileSize: number;
    private _xhr: XMLHttpRequest;
    private arraybuffer :ArrayBuffer;
    constructor(url: string, accessToken: string, callback: Function) {
        let self =this;
        let _url = URL.parse(url, true);
        var options = {
            host: _url.hostname,
            path: _url.pathname + "?gd=true&alt=media",
            method: 'GET',
            headers: {
                'Authorization': 'Bearer ' + accessToken
            }
        };
        callback(options);
    }
}