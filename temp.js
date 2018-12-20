const fs = require('fs');

let corpus = fs.readdirSync("./corpus");
for (let i = 0; i < corpus.length; i++) {
    let domain = corpus[i];

    let files = fs.readdirSync("./corpus/" + domain);

    for (let j = 0; j < files.length; j++) {
        console.log(i + 1, j + 1);
        let file = fs.readFileSync("./corpus/" + domain + "/" + files[j]);

        try {
            file = JSON.parse(file);
            file["title"] = file["title"].replace(/[\W_]+/g, " ").replace(/\s\s+/g, " ").trim();
        }
        catch(error)
        {
            console.log(error);
        };

        fs.writeFileSync("./corpus/" + domain + "/" + files[j], JSON.stringify(file));
    }
}