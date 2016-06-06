var google = require('googleapis');
import * as http from "https";
import { Credential} from "./Credentials";
import * as GoogleFile from "./FileType";
import * as Download from "./DownloadMedia";
export class Drive {
    private oauth2Client: any;
    private credential: Credential;
    private service: any;
    constructor() {
        this.credential = new Credential().GetInstance();
        this.oauth2Client = new google.auth.OAuth2(this.credential.ClientID, this.credential.ClientSecret, this.credential.RedirectUrls[0]);
    }
    async generateAuthUrl(): Promise<string> {
        return await this.oauth2Client.generateAuthUrl({
            access_type: 'offline',
            scope: ["https://www.googleapis.com/auth/drive",
                "https://www.googleapis.com/auth/drive.metadata.readonly"
            ]
        });
    }
    setAccessToken(code): Promise<Drive> {
        let self = this;
        return new Promise<any>(function (resolve, reject) {
            self.oauth2Client.getToken(code, function (err, tokens) {
                if (err)
                    console.log(err);
                self.oauth2Client.setCredentials({ "access_token": tokens.access_token });
                self.service = google.drive({ version: 'v2', auth: self.oauth2Client });
                resolve(self);
            });
        });

    }
    getAuthObject() {
        return this.oauth2Client;
    }
    getFolders(drive: Drive): Promise<any> {
        return new Promise<any>(function (resolve, reject) {
            drive.service.files.list({
                q: "mimeType='application/vnd.google-apps.folder' and trashed=false",
                maxResults: 5,
            }, (err, response: GoogleFile.FileType) => {
                if (err)
                    reject(err);
                else
                    resolve(response);
            });
        }).then((_res: GoogleFile.FileType) => {
            return _res.items.map(x => {
                return { "id": x.id, "name": x.title };
            });
        });
    }
    getFiles(service: any): Promise<any> {
        let self = this;
        return new Promise<any>(function (resolve, reject) {
            service.files.list({
                q: "mimeType='audio/mpeg' or mimeType='audio/mp3' and trashed=false",
                maxResults: 5,
            }, (err, response: GoogleFile.FileType) => {
                if (err)
                    reject(err);
                else
                    resolve(response);
            });
        }).then((_res: GoogleFile.FileType) => {
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
