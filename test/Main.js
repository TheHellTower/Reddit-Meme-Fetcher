const RedditMemesFetcherClient = new (require("../src/RedditMemesFetcher.js"))("json");


//Example JSON output:
/*
{
   "error":false,
   "data":{
      "sub":{
         "name":"Memes",
         "subscribers":25075037
      },
      "author":{
         "name":"GDino12",
         "fullName":"t2_anbdckfn",
         "flairText":null,
         "isBlocked":false,
         "isPremium":false
      },
      "post":{
         "title":"Derp snake",
         "imageURL":{
            "url":"https://i.redd.it/wg115d8oq9sa1.jpg",
            "urlOverriden":"https://i.redd.it/wg115d8oq9sa1.jpg"
         },
         "thumbnail":"https://b.thumbs.redditmedia.com/8KdasQHACh-BXrFz4Ro-ZBLFuj-5WtuVAQGXldqGFCU.jpg",
         "votes":{
            "up":684,
            "upRatio":0.95,
            "Down":0
         },
         "score":684,
         "comments":19,
         "viewCount":0,
         "permaLink":"https://www.reddit.com/r/memes/comments/12ddsib/derp_snake/",
         "extra":{
            "archived":false,
            "pinned":false,
            "over18":false,
            "createdUTC":1680770850
         }
      }
   }
}
*/

RedditMemesFetcherClient.getRandomMeme("json").then(res => {
  console.log(res["data"]);
})