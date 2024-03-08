let history = [];
let controller = new AbortController();

let fetchUrl;
let catBool;

const submitButton = document.getElementById('submitButton');
const catButton = document.getElementById('catButton');
const cancelButton = document.getElementById('cancelButton');

function sendInput(action) {
    controller = new AbortController();
    const signal = controller.signal;

    const userInput = document.getElementById('userInput').value;

    const loaderDiv = document.getElementById('loaderDiv');

    const textInputForm = document.getElementById('textInputForm');

    catButton.disabled = true;
    submitButton.disabled = true;
    cancelButton.style.display = 'inline-block';

    loaderDiv.style.display = 'inline-block';
    textInputForm.style.display = 'none';

    console.log(userInput);
    history.push({"human": userInput})
    console.log(history);

    if (action === 'cat') {
        fetchUrl = 'http://localhost:8000/cat';
        catBool = true
    }else {
        fetchUrl = 'http://localhost:8000/chat';
        catBool = false;
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

            if (catBool === true) {
                submitButton.disabled = true;
                catButton.disabled = false;
            }else{
                catButton.disabled = true;
                submitButton.disabled = false;
            }

            cancelButton.style.display = 'none';
            loaderDiv.style.display = 'none';
            textInputForm.style.display = 'block';

            history.push({"assistant": data});

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

}

function cancelChat() {

    if (catBool === true) {
        submitButton.disabled = true;
        catButton.disabled = false;
    }else{
        catButton.disabled = true;
        submitButton.disabled = false;
    }

    controller.abort("Request cancelled by user");
}