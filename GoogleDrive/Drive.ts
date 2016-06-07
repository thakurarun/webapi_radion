var google = require('googleapis');
import * as http from "https";
import { Credential} from "./Credentials";
import {FileType, TokenInfo } from "./FileType";
import * as Download from "./DownloadMedia";
import * as Cache from "./AppCache";
var URL = require('url');
export class Drive {
    private oauth2Client: any;
    private credential: Credential;
    private service: any;
    private cache: Cache.Cache;
    constructor() {
        this.credential = new Credential().GetInstance();
        this.oauth2Client = new google.auth.OAuth2(this.credential.ClientID, this.credential.ClientSecret, this.credential.RedirectUrls[0]);
    }
    async generateAuthUrl(): Promise<string> {
        return await this.oauth2Client.generateAuthUrl({
            access_type: 'offline',
            scope: ["https://www.googleapis.com/auth/drive.readonly",
                "https://www.googleapis.com/auth/drive.metadata.readonly"
            ]
        });
    }
    setAccessToken(code): Promise<string> {
        let self = this;
        return new Promise<string>(function (resolve, reject) {
            self.oauth2Client.getToken(code, function (err, tokens) {
                if (err)
                    reject(err);
                Cache.Cache.getValue(code).then((token: Cache.TokenCache) => {
                    resolve(code);
                }, () => {
                    Cache.Cache.addItem(code, tokens.access_token, tokens.refresh_token);
                    resolve(code);
                });
            });
        });
    }
    IsTokenExpire(access_token: string): Promise<TokenInfo> {
        let url = "https://www.googleapis.com/oauth2/v2/tokeninfo"
        let _url = URL.parse(url, true);
        let options = {
            host: _url.hostname,
            path: _url.pathname + "?access_token=" + access_token,
            method: 'GET',
        };

        return new Promise((resolve, reject) => {
            http.get(options, (res) => {
                let data = "";
                res.on("data", function (chunk) {
                    data += chunk;
                });
                res.on("end", function () {
                    let tokenInfo = JSON.parse(data) as TokenInfo;
                    if (tokenInfo.error || tokenInfo.error_description) {
                        //todo: check if token expire than refresh using refresh_token
                        reject(tokenInfo.error || tokenInfo.error_description);
                    }
                    else {
                        tokenInfo.token = access_token;
                        resolve(tokenInfo);
                    }
                });
            }).on('error', function (e) {
                reject(e);
            });
        });
    }
    //it return service
    resolveGoogleService(token: string): Promise<any> {
        let self = this;
        return new Promise<any>((resolve, reject) => {
            let oauth2Client = new google.auth.OAuth2(self.credential.ClientID, self.credential.ClientSecret, self.credential.RedirectUrls[0])
            Cache.Cache.getValue(token)
                .then((token: Cache.TokenCache) => self.IsTokenExpire(token.access_token))
                .then((body: TokenInfo) => {
                    console.log(body.expires_in);
                    return body.token;
                })
                .then((access_token: string) => {
                    oauth2Client.setCredentials({ "access_token": access_token });
                    resolve(google.drive({ version: 'v2', auth: oauth2Client }));
                }, (err) => {
                    reject(err);
                });
        });
    }
    getAuthObject() {
        return this.oauth2Client;
    }
    getFolders(token: string): Promise<any> {
        let self = this;
        return new Promise<any>(function (resolve, reject) {
            self.resolveGoogleService(token).then((service: any) => {
                service.files.list({
                    q: "mimeType='application/vnd.google-apps.folder' and trashed=false",
                    maxResults: 5,
                }, (err, response: FileType) => {
                    if (err)
                        reject(err);
                    else
                        resolve(response);
                });
            }, (err) => reject(err))
        }).then((_res: FileType) => {
            return _res.items.map(x => {
                return { "id": x.id, "name": x.title };
            });

        });
    }

    getFiles(token: string): Promise<any> {
        let self = this;
        return new Promise<any>(function (resolve, reject) {
            self.resolveGoogleService(token).then((service: any) => {
                service.files.list({
                    q: "mimeType='audio/mpeg' or mimeType='audio/mp3' and trashed=false",
                    maxResults: 5,
                }, (err, response: FileType) => {
                    if (err)
                        reject(err);
                    else
                        resolve(response);
                });
            })
        }).then((_res: FileType) => {
            return _res.items.map(x => {
                return {
                    "id": x.id,
                    "name": x.title,
                    "streamUrl": encodeURIComponent(x.downloadUrl + "&at=" + self.oauth2Client.credentials.access_token),
                    "size": x.fileSize
                };
            });
        });
    }
    getStream(surl: string) {
        let self = this;
        return new Promise<any>(function (resolve, reject) {
            new Download.DownloadMedia(surl, self.oauth2Client.credentials.access_token, (options: any) => {
                resolve(options);
            });
        });

    }
}
