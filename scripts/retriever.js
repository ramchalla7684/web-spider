const fs = require('fs');
const stemmer = require('../utils/stemmer');
const { URL } = require('../utils/url');

class Retriever {
    constructor() {
        this.stopWords = [];
        this.loadStopWords();
    }

    loadStopWords() {
        fs.readFile('./assets/stop-words.txt', (error, data) => {
            if (error) {
                console.log(error);
                return;
            }
            this.stopWords = String(data).toString().split("\r\n");
        });
    }

    retrieve(query) {

        query = query.trim();
        query = query.replace(/[\W_]+/g, " ").replace(/\s\s+/g, " ");
        query = query.toLowerCase();

        let terms = query.split(" ");

        let docs = [];

        for (let term of terms) {
            if (!this.stopWords.includes(term)) {
                term = stemmer(term);
                let fileName = term;

                if (fs.existsSync(`./indexes/${fileName}.json`)) {
                    let index = fs.readFileSync(`./indexes/${fileName}.json`);
                    index = JSON.parse(index);
                    docs = docs.concat(Retriever.calcTFIDF(index));
                }
            }
        }

        docs = docs.sort((a, b) => {
            if (a.weight < b.weight) {
                return 1;
            }
            else if (a.weight > b.weight) {
                return -1;
            }
            return 0;
        }).map(doc => ({ href: doc.href }));

        // for (let i = 0; i < 10; i++) {

        //     let url = URL.parse(docs[i].url);
        //     let domain = url.domain;
        //     let endpoint = url.endpoint;
        //     console.log(domain, endpoint);
        //     fs.readFileSync(`./corpus/${domain}`);
        // }
        return docs.slice(0, 20);
    }

    static calcTFIDF(index) {

        let tf = 0;
        let idf = Math.log(100000 / Object.keys(index).length);

        let docs = [];

        for (let docID in index) {
            let tf = index[docID].positions.length / index[docID].nTerms;
            let weight = tf * idf;
            docs.push({ href: docID, weight });
        }

        return docs;
    }
}


module.exports.Retriever = Retriever;
