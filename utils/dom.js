const htmlparser2 = require('htmlparser2');
const cheerio = require('cheerio');

class DOM {
    constructor(document) {
        let dom = htmlparser2.parseDOM(document);
        this.$ = cheerio.load(dom);
    }

    querySelectorAll(query) {
        return this.$(query);
    }

    querySelector(query) {
        return this.$(query);
    }

    removeTags(...tags) {
        for (let tag of tags) {
            let elements = this.querySelectorAll(tag);
            elements.each((index, element) => {
                this.$(element).remove();
            });
        }
    }

    content() {
        let title = this.querySelector("html head title");
        if (title) {
            title = title.text();
            if(title)
            {
                title = DOM.removeSpecialCharacters(title).trim();
            }
        }

        let description = this.querySelector("html head meta[name=description]");

        if (description) {
            description = description.attr("content");
            if (description) {
                description = DOM.removeSpecialCharacters(description.trim());
            }
        }
        else {
            description = "";
        }

        let keywords = this.querySelector("html head meta[name=keywords]");

        if (keywords) {
            keywords = keywords.attr("content");
            if (keywords) {
                keywords = DOM.removeSpecialCharacters(keywords).trim();
            }
        }
        else {
            keywords = "";
        }


        this.querySelectorAll("html body *").each((index, element) => {
            this.$(element).append(" ");
        });
        let body = this.querySelector("html body");
        let text = body.text();
        text = DOM.removeSpecialCharacters(text);
        text = text.trim();

        return { title, description, keywords, text };
    }

    links() {
        let aTags = this.querySelectorAll("a");
        let links = [];
        aTags.each((index, a) => {
            let href = this.$(a).attr("href");
            if (href && !href.startsWith("#")) {
                links.push(href.trim());
            }
        });

        return links;
    }

    static removeSpecialCharacters(text) {
        return text.replace(/[\W_]+/g, " ").replace(/\s\s+/g, " ");
    }
}

module.exports.DOM = DOM;