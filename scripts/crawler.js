const request = require('request');
const { JSDOM } = require('jsdom');
const { URL } = require('../util/url');
const { Frontier } = require('../util/frontier');
const { Corpus } = require('../util/corpus');

let frontier = new Frontier();

let crawl = (url) => {

    let hyperlink = URL.join(url);

    fetch(hyperlink, (error, content) => {
        if (error) {
            console.log(error);
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
            console.log(response.statusCode);
            callback(new Error("Status not okay"), undefined, undefined);
            return;
        }

        let dom = new JSDOM(body);
        let document = dom.window.document;

        let content = purge(document);
        callback(undefined, content);

    });
}

let purge = (document) => {

    document = removeTags(document, 'iframe', 'link', 'script', 'noscript', 'style');

    let aTags = document.querySelectorAll("a");
    let links = [];
    for (let a of aTags) {
        let href = a.getAttribute("href");
        if (href && !href.startsWith("#")) {
            links.push(href);
        }
    }

    let content = removeTags(document, 'ALL');
    return { ...content, links };
}


let removeTags = (...args) => {

    let document = args[0];

    if (args.length > 2) {
        let tags = args.slice();
        tags.shift();

        for (let tag of tags) {
            let elements = document.querySelectorAll(tag);
            for (let i = 0; i < elements.length; i++) {
                elements[i].remove();
            }
        }
    }
    else if (args.length === 2) {
        if (args[1] === 'ALL') {

            let title = document.querySelector("html head title");
            if (title) {
                title = title.textContent;
            }

            let description = document.querySelector("html head meta[name=description]");

            if (description) {
                description = removeSpecialCharacters(description.getAttribute("content").trim());
            }
            else {
                description = "";
            }

            let keywords = document.querySelector("html head meta[name=keywords]");

            if (keywords) {
                keywords = removeSpecialCharacters(keywords.getAttribute("content").trim());
            }
            else {
                keywords = [];
            }


            let text = "";
            let body = document.querySelector("html body");
            for (let i = 0; i < body.children.length; i++) {
                let el = body.children[i];

                text = text.concat(el.textContent, " ");
            }
            text = removeSpecialCharacters(text);
            text = text.trim();

            return { title, description, keywords, text };
        }
    }

    return document;
}

let removeSpecialCharacters = (text) => {
    return text.replace(/\W+/g, " ").replace(/\s+/g, " ");
}


// let hyperlink = 'https://www.sciencedaily.com/terms/artificial_intelligence.htm';

crawl({
    protocol: 'http',
    host: 'www',
    domain: 'csequest.com',
    endpoint: '/'
});