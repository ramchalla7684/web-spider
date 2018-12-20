let speechRecognition;

try {
    let SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    speechRecognition = new SpeechRecognition();
}
catch (e) {
    console.error(e);
}

speechRecognition.continuous = true;

speechRecognition.onstart = function () {
    console.log('Speech recognition activated');
}

speechRecognition.onspeechend = function () {
    console.log('Speech recognition terminated');
}

speechRecognition.onerror = function (event) {
    if (event.error === 'no-speech') {
        console.log('No speech detected');
    };
}

export default speechRecognition;