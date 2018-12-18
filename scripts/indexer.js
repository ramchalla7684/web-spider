const fs = require('fs');
const stemmer = require('../util/stemmer');

let stopWords = [];

let index = (document, fileName) => {

    let indexes = {};

    let terms = [];

    let title = document["title"];
    let descrption = document["descrption"];
    let keywords = document["keywords"];
    let text = document["text"];

    if (title) {
        terms.push(...title.split(" "));
    }
    if (descrption) {
        terms.push(...descrption.split(" "));
    }
    if (keywords) {
        terms.push(...keywords.split(" "));
    }
    if (text) {
        terms.push(...text.split(" "));
    }

    for (let i = 0; i < terms.length; i++) {

        let term = terms[i];
        if (term.length === 0) {
            continue;
        }

        if (!stopWords.includes(term.toLowerCase())) {

            term = stemmer(term);
            if (!indexes[term]) {
                indexes[term] = {};
                indexes[term][fileName] = [];
            }

            indexes[term][fileName].push(i);
        }
    }

    save(indexes);
}

let save = (indexes) => {

    for (let term in indexes) {
        try {
            let fileName = term.charAt(0);

            if (!fs.existsSync(`./indexes/${fileName}.json`)) {
                fs.writeFileSync(`./indexes/${fileName}.json`, JSON.stringify({}));
            }

            let savedIndexes = fs.readFileSync(`./indexes/${fileName}.json`);
            savedIndexes = JSON.parse(savedIndexes);

            if (savedIndexes[term]) {

                for (let fileName in indexes[term]) {
                    if (savedIndexes[term][fileName]) {
                        savedIndexes[term][fileName].push(...indexes[term][fileName]);
                    }
                    else {
                        savedIndexes[term][fileName] = indexes[term][fileName];
                    }
                }

            }
            else {
                savedIndexes[term] = indexes[term];
            }

            fs.writeFileSync(`./indexes/${fileName}.json`, JSON.stringify(savedIndexes));
            console.log("Saved indexes ", fileName);
        }
        catch (error) {
            console.log(error);
        }
    }
}

try {
    stopWords = fs.readFileSync('./assets/stop-words.txt').toString().split("\r\n");
}
catch (error) {
    console.log(error);
}

fs.readdir('./corpus', (error, domains) => {
    if (error) {
        console.log(error);
        return;
    }

    for (let domain of domains) {
        try {
            let files = fs.readdirSync(`./corpus/${domain}`);
            for (let file of files) {
                try {
                    let document = fs.readFileSync(`./corpus/${domain}/${file}`);
                    document = JSON.parse(document);
                    index(document, file);
                }
                catch (error) {
                    console.log(error);
                }
            }
        }
        catch (error) {
            console.log(error);
        }
    }
});