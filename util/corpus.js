const fs = require('fs');

class Corpus {
    constructor() {

    }

    static store(content, url) {

        let writeToFile = (path) => {
            fs.writeFile(path, JSON.stringify(content), (error) => {
                if (error) {
                    console.log(error);
                }
            });
        }

        let filename = url.endpoint.replace(/\W+/g, "-");
        if (filename.length > 127) {
            filename = new Date().valueOf();
        }

        fs.exists(`./corpus/${url.domain}`, (exists) => {
            if (exists) {
                writeToFile(`./corpus/${url.domain}/${filename}.json`);
            }
            else {
                fs.mkdir(`./corpus/${url.domain}`, (error) => {
                    if (error) {
                        console.log(error);
                        return;
                    }
                    writeToFile(`./corpus/${url.domain}/${filename}.json`);
                });
            }
        });
    }
}

module.exports.Corpus = Corpus;