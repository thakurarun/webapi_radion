export class Credential {
    ClientID: string;
    ProjectId: string;
    TokenUri: string;
    Auth_provider_x509_cert_url: string;
    RedirectUrls: string[];
    ClientSecret: string;
    AuthUrl: string;
    private static _Credential: Credential;

    public GetInstance(): Credential {
        if (Credential._Credential)
            return Credential._Credential;
        Credential._Credential = new Credential();
        this.ClientID = "963148973652-qgq436tgin54ld44ed9v20949g4v099d.apps.googleusercontent.com";
        this.ProjectId = "avigoapi";
        this.TokenUri = "https://accounts.google.com/o/oauth2/token";
        this.Auth_provider_x509_cert_url = "https://www.googleapis.com/oauth2/v1/certs";
        this.RedirectUrls = ["http://localhost:3000/redirectCallback"];
        this.ClientSecret = "j0aakyJv75IMFUlbe9BA0Dzs";
        this.AuthUrl = "https://accounts.google.com/o/oauth2/auth";

        return Credential._Credential = this;;
    }
}