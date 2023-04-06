const RedditMemesFetcherClient = new (require('../src/RedditMemesFetcher.js'))("json");

/*
Optional parameters(in order):
    Type: "today" and "random" (default: random)
    Format "text" and "json" (default: text)

Example JSON output:
    {
        text: 'A pig`s orgasm lasts for 30 minutes.',
        source: 'djtech.net',
        source_url: 'http://www.djtech.net/humor/useless_facts.htm',
        language: 'en',
        permalink: 'https://uselessfacts.jsph.pl/api/v2/facts/20703986d294054ff282e1ee212e3242'
    }

    Usage: console.log(res["text"]);
Example Text output:
    "A pig`s orgasm lasts for 30 minutes."

    Usage: console.log(res);

Example getUselessFact Usage:
1) await UselessFactsClient.getUselessFact("random", "json");
2) UselessFactsClient.getUselessFact("random", "json").then(res => {
    console.log(res["text"]);
})
*/

RedditMemesFetcherClient.getRandomMeme("json").then(res => {
  console.log(res); //Json
})