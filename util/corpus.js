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

        fs.exists(`./corpus/${url.domain}`, (exists) => {
            if (exists) {
                writeToFile(`./corpus/${url.domain}/${new Date().valueOf()}.ws`);
            }
            else {
                fs.mkdir(`./corpus/${url.domain}`, (error) => {
                    if (error) {
                        console.log(error);
                        return;
                    }
                    writeToFile(`./corpus/${url.domain}/${Math.random()}.ws`);
                });
            }
        });
    }
}

module.exports.Corpus = Corpus;