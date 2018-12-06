const request = require('request');
const jsdom = require('jsdom');
const fs = require('fs');

const { JSDOM } = jsdom;

let crawl = () => {
    request('https://www.sciencedaily.com/terms/artificial_intelligence.htm', (error, response, body) => {
        if (error) {
            console.log(error);
            return;
        }

        if (response.statusCode !== 200) {
            console.log(response.statusCode);
            return;
        }

        let dom = new JSDOM(body);
        let document = dom.window.document;

        document = removeTags(document, 'iframe', 'link', 'script', 'noscript', 'style');

        let content = removeTags(document, 'ALL');
        fs.writeFileSync('scripts/content.txt', content.text);

    });
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

            return {title, description, keywords, text};
        }
    }

    return document;
}

let removeSpecialCharacters = (text) => {
    text = text.replace(/\W+/g, " ").replace(/\s+/g, " ");
    return text;
}

crawl();