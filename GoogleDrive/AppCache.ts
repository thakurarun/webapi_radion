export class Cache {
    static _list: Array<TokenCache> = new Array<TokenCache>();
    public static addItem(key: string, access_token: string, refresh_access_token?: string) {
        new TokenCache(key, access_token, refresh_access_token);
    }
    public static getValue(key: string): Promise<TokenCache> {
        var self = this;
        return new Promise<TokenCache>((resolve, reject) => {
            let token = Cache._list.find(x => x.key == key);
            if (token) resolve(token);
            else reject(null);
        });
    }
}
export class TokenCache {
    public key: string;
    public access_token: string;
    public refresh_access_token: string
    constructor(key, access_token, refresh_access_token?: string) {
        this.key = key;
        this.access_token = access_token;
        this.refresh_access_token = refresh_access_token;
        this.add(this);
    }
    private add(item: TokenCache) {
        Cache._list.push(item);
    }
}
