const fs = require('fs');

let dir = fs.readdirSync("./corpus/");
console.log("Domains: " + dir.length);

let count = 0;
for (let i = 0; i < dir.length; i++) {
    let d = fs.readdirSync('./corpus/' + dir[i]);
    count += d.length;
}

console.log("Docs: " + count);