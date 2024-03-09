let history = [];
let controller = new AbortController();

let fetchUrl;
let catBool = false;
let karenBool = false
let daveBool = false;

const submitButton = document.getElementById('submitButton');
const catButton = document.getElementById('catButton');
const cancelButton = document.getElementById('cancelButton');
const karenButton = document.getElementById('karenButton');
const daveButton = document.getElementById('daveButton');
const clearButton = document.getElementById('clearButton');
const userInput = document.getElementById('userInput');

function saveHistoryToLocalStorage() {
    localStorage.setItem('history', JSON.stringify(history));
}

function removeHistoryFromLocalStorage() {
    localStorage.removeItem('history');
    history = [];
}

async function loadHistoryFromLocalStorage() {
    history = JSON.parse(localStorage.getItem('history')) || [];

    const lastPrompt = history[history.length - 1];
    if (lastPrompt) {
        if (lastPrompt.assistant === 'cat') {
            catBool = true;
        } else if (lastPrompt.assistant === 'karen') {
            karenBool = true;
        } else if (lastPrompt.assistant === 'dave') {
            daveBool = true;
        }
    }

    await disableButtons();
}

window.onload = loadHistoryFromLocalStorage;

function sendInput(action) {
    controller = new AbortController();
    const signal = controller.signal;

    const userInput = document.getElementById('userInput').value;

    const loaderDiv = document.getElementById('loaderDiv');

    const textInputForm = document.getElementById('textInputForm');

    catButton.disabled = true;
    submitButton.disabled = true;
    karenButton.disabled = true;
    daveButton.disabled = true;
    clearButton.disabled = true;

    cancelButton.style.display = 'inline-block';

    loaderDiv.style.display = 'inline-block';
    textInputForm.style.display = 'none';
    clearButton.style.display = 'none';

    console.log(userInput);
    history.push({"human": userInput})
    console.log(history);

    saveHistoryToLocalStorage();

    if (action === 'cat') {
        fetchUrl = 'http://localhost:8000/cat';
        catBool = true;
    }
    else if (action === 'karen')
    {
        fetchUrl = 'http://localhost:8000/karen';
        karenBool = true
    }
    else if (action === 'dave')
    {
        fetchUrl = 'http://localhost:8000/dave';
        daveBool = true
    }
    else {
        fetchUrl = 'http://localhost:8000/chat';

        catBool = false;
        karenBool = false;
        daveBool = false;
    }

    fetch(fetchUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ prompt: history }),
        signal: signal,
    })
        .then(async response => { return response.json();
        }).then(async data => {
            console.log('Input sent successfully:', data);

            await addResponse(data, userInput);

            await disableButtons();

            cancelButton.style.display = 'none';
            loaderDiv.style.display = 'none';
            textInputForm.style.display = 'block';

            history.push({"assistant": data});

            saveHistoryToLocalStorage();

        })
        .catch(error => {
            console.error('Error sending input:', error);

            cancelButton.style.display = 'none';
            loaderDiv.style.display = 'none';
            textInputForm.style.display = 'block';
        });
}

async function addResponse(data, userInput) {

    const currentDiv = document.getElementById("responseDiv");

    const bubbleWrapper = document.createElement("div");
    bubbleWrapper.classList.add("conversation-bubble");

    const userBubble = document.createElement("div");
    userBubble.classList.add("user-bubble");
    const userContent = document.createTextNode(userInput);
    userBubble.appendChild(userContent);

    const assistantBubble = document.createElement("div");
    assistantBubble.classList.add("assistant-bubble");
    const assistantContent = document.createTextNode(data);
    assistantBubble.appendChild(assistantContent);

    bubbleWrapper.appendChild(assistantBubble)
    bubbleWrapper.appendChild(userBubble);

    currentDiv.prepend(bubbleWrapper);
    clearButton.style.display = 'inline-block';
    clearButton.disabled = false;

}

async function cancelChat() {

    await disableButtons();

    controller.abort("Request cancelled by user");
}

async function disableButtons()  {

    if (catBool === true) {

        submitButton.disabled = true;
        catButton.disabled = false;
        karenButton.disabled = true;
        daveButton.disabled = true;

    }
    else if (karenBool === true){

        submitButton.disabled = true;
        catButton.disabled = true;
        karenButton.disabled = false;
        daveButton.disabled = true;

    }
    else if (daveBool === true){

        submitButton.disabled = true;
        catButton.disabled = true ;
        karenButton.disabled = true;
        daveButton.disabled = false;

    }
    else {

        catButton.disabled = true;
        submitButton.disabled = false;
        karenButton.disabled = true;
        daveButton.disabled = true;

    }
}

function clearHistory() {
    history = [];
    removeHistoryFromLocalStorage();
    userInput.value = '';

    catButton.disabled = false;
    submitButton.disabled = false;
    karenButton.disabled = false;
    daveButton.disabled = false;
}

window.onload = loadHistoryFromLocalStorage;