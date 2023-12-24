const https = require("https");

module.exports = class RedditMemesFetcher {
    #API = `443:www.reddit.com:/r/{{Sub}}.json?sort=top&t=week`;
    #REPO = "https://github.com/TheHellTower/Reddit-Meme-Fetcher"
    #SUB = ["Memes", "Dankmemes", "HistoryMemes"];
    #Authorization = "";
    
    /**
     * @constructor
     * @param {string} Authorization (no idea for the full implementation if any required.
     */
    constructor(Authorization = "") {
        this.#Authorization = Authorization;
    }

    /**
     * Get A Random Meme
     * @param {true} ageGate true || false => (default: true = filter +18 content)
     * @returns {Promise<boolean>}
     */
    getRandomMeme(ageGate = true) {
        return new Promise(async (resolve, reject) => {
            var splitted = this.#API.split(':'),
            randomSub = this.#SUB[parseInt(Math.random() * (this.#SUB.length - 0) + 0)];
            var req = https.request({
                host: splitted[1],
                port: splitted[0],
                path: splitted[2].replace("{{Sub}}", randomSub),
                method: "GET",
                headers: {
                    "User-Agent": this.#REPO,
                    "Authorization": this.#Authorization
                }
            }, res => {
                var jsonData = "";

                res.on("data", body => {
                    jsonData += body.toString();
                })
                .on("error", e => reject(e))
                .on("end", x => {
                    jsonData = JSON.parse(jsonData);
                    if(jsonData.error) return resolve({ error: true, data: { code: jsonData.error, message: jsonData.message } });
                    const allowed = ageGate ? jsonData["data"]["children"].filter((post) => !post.data.over_18) : jsonData["data"]["children"];
                    if (!allowed.length) return reject({error: true, message: `There are no fresh \`${randomSub}\` memes try again !`});
                    const randomMeme = allowed[Math.floor(Math.random() * allowed.length)];
                    return resolve({
                        error: false,
                        data: {
                            sub: {
                                name: randomSub,
                                subscribers: randomMeme.data.subreddit_subscribers
                            },
                            author: {
                                name: randomMeme.data.author,
                                fullName: randomMeme.data.author_fullname,
                                flairText: randomMeme.data.author_flair_text,
                                isBlocked: randomMeme.data.author_is_blocked,
                                isPremium: randomMeme.data.author_premium
                            },
                            post: {
                                comments: randomMeme.data.num_comments,
                                edited: randomMeme.data.edited,
                                imageURL: {
                                    url: randomMeme.data.url,
                                    urlOverriden: randomMeme.data.url_overridden_by_dest
                                },
                                score: randomMeme.data.score,
                                thumbnail: {
                                    url: randomMeme.data.thumbnail,
                                    height: randomMeme.data.thumbnail_height,
                                    width: randomMeme.data.thumbnail_width,
                                },
                                title: randomMeme.data.title,
                                votes: {
                                    up: randomMeme.data.ups,
                                    upRatio: randomMeme.data.upvote_ratio,
                                    Down: randomMeme.data.downs
                                },
                                permaLink: `https://${splitted[1]}${randomMeme.data.permalink}`,
                                extra: {
                                    archived: randomMeme.data.archived,
                                    created: randomMeme.data.created,
                                    createdAsDate: new Date(randomMeme.data.created * 1000),
                                    isVideo: randomMeme.data.is_video,
                                    media_only: randomMeme.data.media_only,
                                    over18: randomMeme.data.over_18,
                                    pinned: randomMeme.data.pinned,
                                    spoiler: randomMeme.data.spoiler
                                }
                            }
                        }
                    });
                });
            });
            req.write(this.#REPO);
            req.end();
        });
    }   
}