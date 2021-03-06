const fs = require('fs');
const path = require('path');
const request = require('request');
const {
    DOM
} = require(path.join(__dirname, '../utils/dom'));
const {
    URL
} = require(path.join(__dirname, '../utils/url'));
const {
    Frontier
} = require(path.join(__dirname, '../utils/frontier'));
const {
    Corpus
} = require(path.join(__dirname, '../utils/corpus'));

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

    return {
        ...content,
        links
    };
}

fs.readFile('./assets/seeds.txt', (error, data) => {
    if (error) {
        console.log(error);
        return;
    }

    data = data.toString();
    data = data.split("\n");

    for (let i = 0; i < data.length; i++) {
        setTimeout(() => crawl(URL.parse(data[i].trim())), i * 1000);
    }

});

setInterval(() => {

    frontier.nextURL((error, url) => {
        if (error) {
            console.log(error);
            return;
        }
        if (url) {
            crawl(url);
        }
    })
}, 150);

process.on('uncaughtException', (error) => {
    console.log(error);
});