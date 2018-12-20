const fs = require('fs');

class Retriever {
    constructor() {
        this.indexes = {};
        this.loadIndexes();
    }

    loadIndexes() {
        fs.readdir("./indexes", (files) => {
            for (let i = 0; i < files.length; i++) {
                let index = 0;
            }
        });
    }

    retrieve(terms) {
        for(let term of terms)
        {
            let fileName = term.charAt(0);
            let index = fs.readFileSync(`./indexes/${fileName}.json`);
        }
    }
}