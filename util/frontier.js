const fs = require('fs');
const { URL } = require('../util/url');

class Frontier {
    constructor() {
        this.visitedURLs = [];
        this.domains = [];
        this.loadDomains();
    }

    loadDomains() {

        fs.readdi

        fs.readdir('./frontier', (error, files) => {
            if (error) {
                console.log(error);
                return;
            }

            this.domains = files;
        });
    }

    static addToVisited(url) {
        let hyperlink = URL.join(url);

        fs.readFile(`./frontier/${url.domain}/visited.json`, (error, data) => {

            if (error) {
                if (error.code !== 'ENOENT') {
                    console.log(error);
                }
                data = {};
            }
            else {
                try {
                    data = JSON.parse(data);
                }
                catch (error) {
                    data = {};
                }
            }


            if (!data[hyperlink]) {
                data[hyperlink] = {};
                data[hyperlink].timestamp = [];
            }

            data[hyperlink].timestamp.push(new Date().valueOf());

            fs.writeFile(`./frontier/${url.domain}/visited.json`, JSON.stringify(data), (error) => {
                if (error) {
                    console.log(error);
                }
            });
        });
    }

    static addToPending(hyperlinks, url) {

        fs.readFile(`./frontier/${url.domain}/pending.json`, (error, data) => {

            if (error) {
                if (error.code !== 'ENOENT') {
                    console.log(error);
                }
                data = [];
            }
            else {
                try {
                    data = JSON.parse(data);
                }
                catch (error) {
                    data = [];
                }
            }


            fs.readFile(`./frontier/${url.domain}/visited.json`, (error, visited) => {
                if (error) {

                    if (error.code === 'ENOENT') {
                        fs.writeFile(`./frontier/${url.domain}/visited.json`, JSON.stringify({}), (error) => {
                            if (error) {
                                console.log(error);
                            }
                        });
                    }
                    else {
                        console.log(error);
                    }

                    if (hyperlinks instanceof Array) {

                        for (let hyperlink of hyperlinks) {
                            if (hyperlink) {
                                hyperlink = URL.toAbsoulte(hyperlink, url);

                                if (!data.includes(hyperlink)) {
                                    data.push(hyperlink);
                                }
                            }
                        }
                    }
                    else if (hyperlinks) {
                        let hyperlink = hyperlinks;
                        hyperlink = URL.toAbsoulte(hyperlink, url);

                        if (!data.includes(hyperlink)) {
                            data.push(hyperlink);
                        }
                    }

                    fs.writeFile(`./frontier/${url.domain}/pending.json`, JSON.stringify(data), (error) => {
                        if (error) {
                            console.log(error);
                        }
                    });
                }
                else {
                    try {
                        visited = JSON.parse(visited);
                    }
                    catch (error) {
                        visited = {};
                    }

                    if (hyperlinks instanceof Array) {

                        for (let hyperlink of hyperlinks) {
                            if (hyperlink) {
                                hyperlink = URL.toAbsoulte(hyperlink, url);

                                if (!data.includes(hyperlink) && !visited[hyperlink]) {
                                    data.push(hyperlink);
                                }
                            }
                        }
                    }
                    else if (hyperlinks) {
                        let hyperlink = hyperlinks;
                        hyperlink = URL.toAbsoulte(hyperlink, url);

                        if (!data.includes(hyperlink) && !visited[hyperlink]) {
                            data.push(hyperlink);
                        }
                    }

                    fs.writeFile(`./frontier/${url.domain}/pending.json`, JSON.stringify(data), (error) => {
                        if (error) {
                            console.log(error);
                        }
                    });

                }

            });
        });
    }

    add(hyperlinks, url) {

        if (this.domains.includes(url.domain)) {
            Frontier.addToVisited(url);
            Frontier.addToPending(hyperlinks, url);
        }
        else {
            fs.mkdir(`./frontier/${url.domain}`, (error) => {
                if (error) {
                    console.log(error);
                    return;
                }

                this.domains.push(url.domain);

                Frontier.addToVisited(url);
                Frontier.addToPending(hyperlinks, url);
            });
        }
    }

    nextURL(callback) {
        let domain = this.domains.shift();
        if (domain) {

            this.domains.push(domain);

            fs.readFile(`./frontier/${domain}/pending.json`, (error, data) => {
                if (error) {
                    if (error.code !== 'ENOENT') {
                        console.log(error);
                    }
                    return;
                }

                try {
                    data = JSON.parse(data);
                }
                catch (error) {
                    data = [];
                }

                let hyperlink = data.shift();

                fs.writeFile(`./frontier/${domain}/pending.json`, JSON.stringify(data), (error) => {
                    if (error) {
                        console.log(error);
                        return;
                    }

                    if (hyperlink) {
                        callback(undefined, URL.parse(hyperlink));
                    }
                    else {
                        callback(undefined, undefined);
                    }
                });
            });
        }
    }
}

module.exports.Frontier = Frontier;