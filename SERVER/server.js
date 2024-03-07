import express from "express";
import cors from 'cors';
import { ChatOpenAI } from "@langchain/openai";

console.log("hello world");
console.log(process.env.AZURE_OPENAI_API_KEY);

const app = express();
const port = 8000;

let stringifiedPrompt = '';

let test = `You are a gamer cat that loves to meow every sentence. Answer the following question:`

app.use(cors()); // Enable CORS

app.use(express.json());

const model = new ChatOpenAI({
    azureOpenAIApiKey: process.env.AZURE_OPENAI_API_KEY,
    azureOpenAIApiVersion: process.env.OPENAI_API_VERSION,
    azureOpenAIApiInstanceName: process.env.INSTANCE_NAME,
    azureOpenAIApiDeploymentName: process.env.ENGINE_NAME,
    temperature: 0.7,
    maxTokens: 100,
});

async function drawCard(url) {
    const response = await fetch(url);
    const data = await response.json();
    console.log(data.cards);
    const dataValue = data.cards[0].value;
    return dataValue;
}

app.get("/test", async (req, res) => {
    res.json({});
});

app.get("/joke", async (req, res) => {
    const chat = await JokeTeller("Tell me a very funny joke about a banana.");
    res.json(chat.content);
});

app.post("/chat", async (req, res) => {
    stringifiedPrompt = JSON.stringify(req.body.prompt);


    const assistantCard = await drawCard("https://www.deckofcardsapi.com/api/deck/new/draw/?count=1");
    const humanCard = await drawCard("https://www.deckofcardsapi.com/api/deck/new/draw/?count=1");

    let winner;
    console.log("Assistant card: ", assistantCard);
    console.log("Human card: ", humanCard);
    if (assistantCard > humanCard) {
        winner = "Assistant";
    } else if (assistantCard < humanCard) {
        winner = "Human";
    } else {
        winner = "It's a tie!";
    }

    console.log(winner);

    let engineeredPrompt = `You are a famous gambler, and you are at a casino. 
    You are playing a new and exciting card game where both you and the human draw a card. 
    Your card is ${assistantCard}, the human drew ${humanCard}, 
    please roleplay this game with them and after they have told you to draw a card you tell them both cards and the ${winner}. 
    You should start by greeting the human before playing the game.
    You should make sure that they understand the rules so you can have a fair game with them.
    You always play a best out of 3 and should tell them the current score after every draw.
    You will only do 1 draw per answer, so you will have to wait for the human to answer before you can draw a new card.
    After every draw, tell them what the current score is between you two. 
    Use gender neutral terms if possible, else use lassie. Only use the provided info and don't use your own information about card games.
    Please make sure to write sentences in a very stereotypical scottish accent. You like to often use gaelic slang. 
    Your answer should always be a normal sentence without the mention of a human, assistant or punctuation marks that are not periods or exclamation marks`;

    console.log(req.body.prompt);
    console.log(engineeredPrompt);
    const chat = await Chatter(engineeredPrompt);

    res.json(chat.content);
});

async function Chatter(engineeredPrompt) {

    return await model.invoke([
        ["system", engineeredPrompt],
        ["human", stringifiedPrompt],
    ]);
};

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
