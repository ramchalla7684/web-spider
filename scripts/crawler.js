const request = require('request');
const { JSDOM } = require('jsdom');
const frontier = require('../util/frontier');
const corpus = require('../util/corpus');

let crawl = () => {

    fetch('https://www.sciencedaily.com/terms/artificial_intelligence.htm', (content, error) => {
        if (error) {
            console.log(error);
            return;
        }

        console.log(content);
    });
}


let fetch = (link, callback) => {
    request(link, (error, response, body) => {
        if (error) {
            callback(undefined, undefined, error);
            return;
        }

        if (response.statusCode !== 200) {
            console.log(response.statusCode);
            callback(undefined, undefined, new Error("Status not okay"));
            return;
        }

        let dom = new JSDOM(body);
        let document = dom.window.document;

        let content = purge(document);

        callback(content, undefined);

    });
}

let purge = (document) => {

    document = removeTags(document, 'iframe', 'link', 'script', 'noscript', 'style');

    let aTags = document.querySelectorAll("a");
    let links = [];
    for (let a of aTags) {
        links.push(a.getAttribute("href"));
    }

    let { title, description, keywords, text } = removeTags(document, 'ALL');

    return { title, description, keywords, text, links };
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

            let description = document.querySelector("html head meta[name=description]");
            description = removeSpecialCharacters(description.getAttribute("content"));

            let keywords = document.querySelector("html head meta[name=keywords]");
            keywords = removeSpecialCharacters(keywords.getAttribute("content"));


            let text = "";
            let body = document.querySelector("html body");
            for (let i = 0; i < body.children.length; i++) {
                let el = body.children[i];

                text = text.concat(" ", removeSpecialCharacters(el.textContent));
            }

            return { title, description, keywords, text };
        }
    }

    return document;
}

let removeSpecialCharacters = (text) => {
    return text.replace(/\W+/g, " ").replace(/\s+/g, " ");
}

crawl();