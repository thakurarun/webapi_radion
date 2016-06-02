var google = require('googleapis');
import { Credential} from "./Credentials";

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
            access_type: 'online',
            scope: ["https://www.googleapis.com/auth/drive",
                "https://www.googleapis.com/auth/drive.metadata.readonly"
            ]
        });
    }
    setAccessToken(code) {
        let self = this;
        self.oauth2Client.getToken(code, function (err, tokens) {
            debugger;
            if (err)
                console.log(err);
            self.oauth2Client.setCredentials({ "access_token": tokens.access_token });
            self.service = google.drive({ version: 'v2', auth: self.oauth2Client });
        });
    }
    getAuthObject() {
        return this.oauth2Client;
    }
    async getFiles(): Promise<Array<string>> {
        return await this.service.files.list({
            maxResults: 10,
        }, function (err, response) {
            let arr : string[]; 
            if (err)
                return err;
            var files = response.items;
            return  files;
            // if (files.length == 0) {
            //     console.log('No files found.');
            // } else {
            //     for (var i = 0; i < files.length; i++) {
            //         var file = files[i];
            //         console.log('%s (%s)', file.title, file.id);
            //         arr.push(file.title);
            //     }
            // }
            // console.log(response);
            // return arr;
        });
    }
}
