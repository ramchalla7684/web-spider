const fs = require('fs');
const { URL } = require('../util/url');

class Frontier {
    constructor() {
        this.data = {};
        this.visitedURLs = [];
        this.loadFrontier();
        this.loadVisitedURLs();
        this.domains = [];
    }

    loadFrontier() {
        fs.readFile('./assets/frontier.json', (error, data) => {
            if (error) {
                console.log(error);
                return;
            }

            try {
                this.data = JSON.parse(data);
            }
            catch (error) {
                console.log(error);
            }
            this.domains = Object.keys(this.data);
        });
    }

    loadVisitedURLs() {
        fs.readFile('./assets/visited-urls.json', (error, data) => {
            if (error) {
                console.log(error);
                return;
            }

            try {
                this.visitedURLs = JSON.parse(data);
            }
            catch (error) {
                console.log(error);
            }
        });
    }


    add(hyperlinks, url) {

        let addToFrontier = (url) => {
            if (!this.visitedURLs.includes(new RegExp(URL.join(url).toLowerCase().replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&')), "ig")) {
                if (this.data[url.domain]) {

                    let urlsAdded = this.data[url.domain].urls;
                    for (let urlAdded of urlsAdded) {
                        if (url.host === urlAdded.host && url.endpoint === urlAdded.endpoint) {
                            break;
                        }
                    }

                    this.data[url.domain].urls.push({
                        host: url.host,
                        endpoint: url.endpoint
                    });
                }
                else {
                    this.data[url.domain] = {
                        protocol: url.protocol,
                        time: 10,
                        urls: [{
                            host: url.host,
                            endpoint: url.endpoint
                        }]
                    };

                    this.domains.push(url.domain);
                }
            }
        }

        let hyperlink = URL.join(url);
        this.visitedURLs.push(hyperlink.toLowerCase());

        if (hyperlinks instanceof Array) {
            for (let hyperlink of hyperlinks) {
                if (hyperlink) {
                    hyperlink = URL.toAbsoulte(hyperlink, url);
                    addToFrontier(URL.parse(hyperlink));
                }
            }
        }
        else if (hyperlinks) {
            let hyperlink = hyperlinks;
            hyperlink = URL.toAbsoulte(hyperlink, url);
            addToFrontier(URL.parse(hyperlink));
        }
    }
}

module.exports.Frontier = Frontier;