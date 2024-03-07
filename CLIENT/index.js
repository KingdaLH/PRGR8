let history = [];

function sendInput() {
    const userInput = document.getElementById('userInput').value;

    const loaderDiv = document.getElementById('loaderDiv');
    const submitButton = document.getElementById('submitButton');
    const textInputForm = document.getElementById('textInputForm');

    submitButton.disabled = true;
    loaderDiv.style.display = 'inline-block';
    textInputForm.style.display = 'none';

    // let stringInput = JSON.stringify(userInput);
    console.log(userInput);
    history.push({"human": userInput})
    // let historyString = JSON.stringify(history);
     console.log(history);

    const promptString = `{ prompt: ${JSON.stringify(history) }}`


    fetch('http://localhost:8000/chat', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ prompt: history })
    })
        .then(async response => { return response.json();
        }).then(async data => {
            console.log('Input sent successfully:', data);

            await addResponse(data);

            submitButton.disabled = false;
            loaderDiv.style.display = 'none';
            textInputForm.style.display = 'block';

            // let stringData = JSON.stringify(data.content);
            // console.log(stringData);
            history.push({"assistant": data});

        })
        .catch(error => {
            console.error('Error sending input:', error);

            submitButton.disabled = false;
            loaderDiv.style.display = 'none';
            textInputForm.style.display = 'block';
        });
}
async function addResponse(data) {
    const newText = document.createElement("p");
    const newContent = document.createTextNode(data);

    newText.appendChild(newContent);

    const currentDiv = document.getElementById("responseDiv");

    currentDiv.innerHTML = '';
    currentDiv.appendChild(newText);
}