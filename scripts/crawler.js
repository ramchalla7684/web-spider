const request = require('request');
const { DOM } = require('../util/dom');
const { URL } = require('../util/url');
const { Frontier } = require('../util/frontier');
const { Corpus } = require('../util/corpus');

let frontier = new Frontier();

let crawl = (url) => {

    let hyperlink = URL.join(url);
    console.log(hyperlink);

    fetch(hyperlink, (error, content) => {
        if (error) {
            console.log(error, url);
            return;
        }

        frontier.add(content.links, url);
        Corpus.store(content, url);
    });
}


let fetch = (url, callback) => {
    request(url, (error, response, body) => {
        if (error) {
            callback(error, undefined, undefined);
            return;
        }

        if (response.statusCode !== 200) {
            console.log(response.statusCode, url);
            callback(new Error("Status not okay"), undefined, undefined);
            return;
        }

        let document = new DOM(body);

        let content = purge(document);
        callback(undefined, content);

    });
}

let purge = (document) => {
    document.removeTags('iframe', 'link', 'script', 'noscript', 'style');

    let links = document.links();
    let content = document.content();
    
    return { ...content, links };
}

setInterval(() => {

    let domain = frontier.domains.shift();
    if (domain) {
        let url = frontier.data[domain].urls.shift();
        let protocol = frontier.data[domain].protocol;
        if (url) {
            url = { ...url, domain, protocol };
            crawl(url);
        }

        frontier.domains.push(domain);
    }
}, 100);

crawl({
    protocol: 'http',
    host: 'www',
    domain: 'csequest.com',
    endpoint: '/'
});

let saveState = () => {
    console.log("Saving frontier and visited urls");
    fs.writeFileSync("./assets/frontier.json", JSON.stringify(frontier.data));
    fs.writeFileSync("./assets/visited-urls.json", JSON.stringify(frontier.visitedURLs));
}

process.on('beforeExit', (code) => {
    console.log(`Exit code: ${code}`);
    saveState();
});
process.on('SIGNINT', saveState);

process.on('uncaughtException', (error) => {
    console.log(error);
});