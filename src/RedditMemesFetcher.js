const https = require("https");

module.exports = class RedditMemesFetcher {
    #API = `443:www.reddit.com:/r/{{Sub}}.json?sort=top&t=week`;
    #REPO = "https://github.com/TheHellTower/Reddit-Meme-Fetcher"
    #SUB = ["Memes", "Dankmemes", "HistoryMemes"];
    #Format = "";
    //sub = sub[parseInt(Math.random() * (#sub.length - 0) + 0)];

    /**
     * @constructor
     * @param {string} Format json || description => (default: json = full data on the post.)
     */
    constructor(Format = "json") {
        this.#Format = Format;
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
                method: "GET"
            }, res => {
                var jsonData = "";

                res.on("data", body => {
                    jsonData += body.toString();
                    /*var response = JSON.parse(body.toString());

                    return resolve(res.statusCode == 200 ?
                        (Format === "text" ?
                            response["text"] :
                            {
                                text: response["text"],
                                source: response["source"],
                                source_url: response["source_url"],
                                language: response["language"],
                                permalink: response["permalink"]
                            }
                        ) : 
                        "{}"
                    );*/
                })
                .on("error", e => reject(e))
                .on("end", x => {
                    jsonData = JSON.parse(jsonData);
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
                                title: randomMeme.data.title,
                                imageURL: {
                                    url: randomMeme.data.url,
                                    urlOverriden: randomMeme.data.url_overridden_by_dest
                                },
                                thumbnail: randomMeme.data.thumbnail,
                                votes: {
                                    up: randomMeme.data.ups,
                                    upRatio: randomMeme.data.upvote_ratio,
                                    Down: randomMeme.data.downs
                                },
                                score: randomMeme.data.score,
                                comments: randomMeme.data.num_comments,
                                viewCount: randomMeme.data.view_count ?? 0,
                                permaLink: `https://${splitted[1]}${randomMeme.data.permalink}`,
                                extra: {
                                    archived: randomMeme.data.archived,
                                    pinned: randomMeme.data.pinned,
                                    over18: randomMeme.data.over_18,
                                    createdUTC: randomMeme.data.created_utc
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