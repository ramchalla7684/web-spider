try {
  var SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  var recognition = new SpeechRecognition();
}

catch(e) {
  console.error(e);
  $('.no-browser-support').show();
  $('.app').hide();
}

var noteTextarea = $('#note-textarea');
var instructions = $('#recording-instructions');
var query = '';

recognition.continuous = true;

recognition.onresult = function(event) {
  var current = event.resultIndex;
  var transcript = event.results[current][0].transcript;
  var mobileRepeatBug = (current == 1 && transcript == event.results[0][0].transcript);

  if(!mobileRepeatBug) {
    query += transcript;
    noteTextarea.val(query);
  }
  console.log(query);
};

recognition.onstart = function() {
  instructions.text('Voice recognition activated. Try speaking into the microphone.');
}

recognition.onspeechend = function() {
  instructions.text('You were quiet for a while so voice recognition turned itself off.');
}

recognition.onerror = function(event) {
  if(event.error == 'no-speech') {
    instructions.text('No speech was detected. Try again.');  
  };
}

$('#start-record-btn').on('click', function(e) {
  if (query.length) {
    query = ' ';
  }
  recognition.start();
});

$('#pause-record-btn').on('click', function(e) {
  recognition.stop();
  instructions.text('Voice recognition paused.');
});