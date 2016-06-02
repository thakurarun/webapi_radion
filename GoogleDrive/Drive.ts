var google = require('googleapis');
var clientId = require("../ClientId");
export class Drive {
    private OAuth2: any;
    private oauth2Client: any;
    constructor() {
        let client = clientId.Client.web;
        this.oauth2Client = new google.auth.OAuth2(client.client_id, client.client_secret, "http://localhost:3000/redirectCallback");
    }
    generateAuthUrl(): void {
        debugger;
        let url = this.oauth2Client.generateAuthUrl({
            access_type: 'online',
            scope: "https://www.googleapis.com/auth/drive" // If you only need one scope you can pass it as string
        });
        console.log(url);
        debugger;
        //this.oauth2Client.getToken
    }
}
