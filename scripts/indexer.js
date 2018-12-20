const fs = require('fs');
const stemmer = require('../util/stemmer');

let stopWords = [];

let index = (document) => {

    let indexes = {};

    let terms = [];

    let title = document["title"];
    let descrption = document["descrption"];
    let keywords = document["keywords"];
    let text = document["text"];

    let url = document["url"];

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
                indexes[term][url] = [];
            }
            else if (!indexes[term][url]) {
                indexes[term][url] = [];
            }

            indexes[term][url].push(i);
        }
    }

    save(indexes);
}

let save = (indexes) => {

    for (let term in indexes) {
        try {
            let fileName = term;

            let savedIndexes = {};
            if (fs.existsSync(`./indexes/${fileName}.json`)) {
                savedIndexes = fs.readFileSync(`./indexes/${fileName}.json`);
                savedIndexes = JSON.parse(savedIndexes);
            }

            savedIndexes = { ...savedIndexes, ...indexes[term] };

            fs.writeFileSync(`./indexes/${fileName}.json`, JSON.stringify(savedIndexes));
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

    // Just for progress status
    
    for (let i = 0; i < domains.length; i++) {

        let domain = domains[i];
        try {
            let files = fs.readdirSync(`./corpus/${domain}`);
            for (let file of files) {
                try {
                    let document = fs.readFileSync(`./corpus/${domain}/${file}`);
                    document = JSON.parse(document);
                    index(document);
                }
                catch (error) {
                    console.log(error);
                }

            }
        }
        catch (error) {
            console.log(error);
        }

        //Just for progress status
        console.log("Domain: " + (i+1));
    }
});