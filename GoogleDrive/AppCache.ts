var redis = require("redis"),
    client = redis.createClient("6379", "127.0.0.1");
export class Cache {
    //static _list: Array<TokenCache> = new Array<TokenCache>();
    public static addItem(key: string, access_token: string, refresh_access_token?: string) {
        new TokenCache(key, access_token, refresh_access_token);
    }
    public static getValue(key: string): Promise<TokenCache> {
        var self = this;
        return new Promise<TokenCache>((resolve, reject) => {
            client.get(key, function (err, reply) {
                if (err || reply == null)
                    reject(null);
                else
                    resolve(JSON.parse(reply) as TokenCache);
            });
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
        client.set(item.key, JSON.stringify(item));
        //Cache._list.push(item);
    }
}
