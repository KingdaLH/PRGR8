let history = [];

function sendInput() {
    const userInput = document.getElementById('userInput').value;

    const loaderDiv = document.getElementById('loaderDiv');
    const submitButton = document.getElementById('submitButton');
    const textInputForm = document.getElementById('textInputForm');

    submitButton.disabled = true;
    loaderDiv.style.display = 'inline-block';
    textInputForm.style.display = 'none';

    console.log(userInput);
    history.push({"human": userInput})
    console.log(history);


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

            await addResponse(data, userInput);

            submitButton.disabled = false;
            loaderDiv.style.display = 'none';
            textInputForm.style.display = 'block';

            history.push({"assistant": data});

        })
        .catch(error => {
            console.error('Error sending input:', error);

            submitButton.disabled = false;
            loaderDiv.style.display = 'none';
            textInputForm.style.display = 'block';
        });
}
async function addResponse(data, userInput) {
    const newText = document.createElement("p");
    const newText2 = document.createElement("p");
    const newContent = document.createTextNode(userInput);

    newText.appendChild(newContent);

    const newContent2 = document.createTextNode(data);

    newText2.appendChild(newContent2);

    const currentDiv = document.getElementById("responseDiv");

    //currentDiv.innerHTML = '';

    currentDiv.prepend(newText);
    currentDiv.prepend(newText2);
}