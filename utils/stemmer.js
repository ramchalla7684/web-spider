const fs = require('fs');

const consonants = '([^aeiou]+)';
const vowels = '([aeiou]+)';

let step2list = {};
let step3list = {};

try {
    step2list = fs.readFileSync('./assets/step2list.json');
    step2list = JSON.parse(step2list);
}
catch (error) {
    console.log(error);
    step2list = {};
}

try {
    step3list = fs.readFileSync('./assets/step3list.json');
    step3list = JSON.parse(step3list);
}
catch (error) {
    console.log(error);
    step3list = {};
}

const gt0 = new RegExp('^' + consonants + '?' + vowels + consonants);
const eq1 = new RegExp('^' + consonants + '?' + vowels + consonants + vowels + '?$');
const gt1 = new RegExp('^' + consonants + '?(' + vowels + consonants + '){2,}');
const vowelInStem = new RegExp('^' + consonants + '?' + '[aeiou]');
const consonantLike = new RegExp('^' + consonants + '[aeiou]' + '[^aeiouwxy]$');

const sfxLl = /ll$/;
const sfxY = /^(.+?)y$/;
const sfxE = /^(.+?)e$/;
const sfxIon = /^(.+?(s|t))(ion)$/;
const sfxEdOrIng = /^(.+?)(ed|ing)$/;
const sfxAtOrBlOrIz = /(at|bl|iz)$/;
const sfxEED = /^(.+?)eed$/;
const sfxS = /^.+?[^s]s$/;
const sfxSsesOrIes = /^.+?(ss|i)es$/;
const sfxMultiConsonantLike = /([^aeiouylsz])\1$/;
const step2 = new RegExp('^(.+?)(ational|tional|enci|anci|izer|bli|alli|entli|eli|ousli|ization|ation|ator|alism|iveness|fulness|ousness|aliti|iviti|biliti|logi)$');
const step3 = /^(.+?)(icate|ative|alize|iciti|ical|ful|ness)$/;
const step4 = new RegExp('^(.+?)(al|ance|ence|er|ic|able|ible|ant|ement|ment|ent|ou|ism|ate|iti|ous|ive|ize)$');

let stemmer = (value) => {
    let firstCharacterWasLowerCaseY;
    let match;

    value = String(value).toLowerCase();

    if (value.length < 3) {
        return value;
    }

    if (value.charAt(0) === 'y') {
        firstCharacterWasLowerCaseY = true;
        value = 'Y' + value.substr(1);
    }

    if (sfxSsesOrIes.test(value)) {
        value = value.substr(0, value.length - 2);
    }

    else if (sfxS.test(value)) {
        value = value.substr(0, value.length - 1);
    }

    if ((match = sfxEED.exec(value))) {
        if (gt0.test(match[1])) {
            value = value.substr(0, value.length - 1);
        }
    }

    else if ((match = sfxEdOrIng.exec(value)) && vowelInStem.test(match[1])) {
        value = match[1];

        if (sfxAtOrBlOrIz.test(value) || consonantLike.test(value)) {
            value += 'e';
        }

        else if (sfxMultiConsonantLike.test(value)) {
            value = value.substr(0, value.length - 1);
        }
    }

    if ((match = sfxY.exec(value)) && vowelInStem.test(match[1])) {
        value = match[1] + 'i'
    }

    if ((match = step2.exec(value)) && gt0.test(match[1])) {
        value = match[1] + step2list[match[2]];
    }

    if ((match = step3.exec(value)) && gt0.test(match[1])) {
        value = match[1] + step3list[match[2]];
    }

    if ((match = step4.exec(value))) {
        if (gt1.test(match[1])) {
            value = match[1];
        }
    }

    else if ((match = sfxIon.exec(value)) && gt1.test(match[1])) {
        value = match[1];
    }

    if ((match = sfxE.exec(value)) && (gt1.test(match[1]) || (eq1.test(match[1]) && !consonantLike.test(match[1])))) {
        value = match[1];
    }

    if (sfxLl.test(value) && gt1.test(value)) {
        value = value.substr(0, value.length - 1);
    }

    if (firstCharacterWasLowerCaseY) {
        value = 'y' + value.substr(1);
    }

    if (value[value.length - 1] == 'i') {
        value = value.substr(0, value.length - 1) + 'y';
    }

    return value;
}

module.exports = stemmer;