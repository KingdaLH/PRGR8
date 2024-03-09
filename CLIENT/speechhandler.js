const SpeechRecognition =
    window.SpeechRecognition || window.webkitSpeechRecognition;
const SpeechGrammarList =
    window.SpeechGrammarList || window.webkitSpeechGrammarList;
const SpeechRecognitionEvent =
    window.SpeechRecognitionEvent || window.webkitSpeechRecognitionEvent;

let recognition = new SpeechRecognition();

recognition.continuous = false;
recognition.lang = 'en-US du-NL';
recognition.interimResults = false;
recognition.maxAlternatives = 1;

//diagnostic = document.querySelector('.output');

function startSpeechRecognition() {
    recognition.start();
    console.log("Ready to receive a command.");
};

recognition.onresult = (event) => {

    const query = event.results[0][0].transcript;
    console.log(`Confidence: ${event.results[0][0].confidence}`);
    document.getElementById('userInput').value = query;

};

recognition.onspeechend = () => {
    recognition.stop();
    console.log("Speech recognition ended.");
};

recognition.onnomatch = (event) => {
    diagnostic.textContent = "I didn't recognize that.";
};

recognition.onerror = (event) => {
    diagnostic.textContent = `Error occurred in recognition: ${event.error}`;
};