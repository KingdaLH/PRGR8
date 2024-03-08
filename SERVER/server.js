import express from "express";
import cors from 'cors';
import { ChatOpenAI } from "@langchain/openai";

console.log("hello world");
console.log(process.env.AZURE_OPENAI_API_KEY);

const app = express();
const port = 8000;

let stringifiedPrompt = '';
const controller = new AbortController();

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
    signal: controller.signal
});

async function shuffleDeck(url) {
    const response = await fetch(url);
    const data = await response.json();
    let deckId = data.deck_id;
    return deckId;
}
async function drawCard(url) {
    const response = await fetch(url);
    const data = await response.json();
    console.log(data.cards);
    const dataValue = data.cards[0].value;
    return dataValue;
}

app.post("/cat", async (req, res) => {

    req.on('abort', () => {
        console.log('Request aborted');
        res.json({ error: "Request aborted" });
    });

    const deckId = await shuffleDeck("https://www.deckofcardsapi.com/api/deck/new/shuffle/?cards=AH,2H,3H,4H,5H,6H,7H,8H,9C,10H,JH,QH,KH");

    stringifiedPrompt = JSON.stringify(req.body.prompt);

    const cat = `You are a gamer cat that loves to meow every sentence, you must use cute words, and show your admiration to the human.`;

    const catCard = await drawCard(`https://www.deckofcardsapi.com/api/deck/${deckId}/draw/?count=1`);
    const humanCard = await drawCard(`https://www.deckofcardsapi.com/api/deck/${deckId}/draw/?count=1`);

    let gamePrompt = await game(catCard, humanCard, cat);

    const chat = await Chatter(gamePrompt);

    res.json(chat.content);
});

app.post("/chat", async (req, res) => {

    req.on('abort', () => {
        console.log('Request aborted');
        res.json({ error: "Request aborted" });
    });

    stringifiedPrompt = JSON.stringify(req.body.prompt);
    const assistantCard = await drawCard("https://www.deckofcardsapi.com/api/deck/new/draw/?count=1");
    const humanCard = await drawCard("https://www.deckofcardsapi.com/api/deck/new/draw/?count=1");

    const gambler = `You are a famous gambler, and you are at a casino. Please make sure to write sentences in a very stereotypical scottish accent. You like to often use gaelic slang.`;

    let gamePrompt = await game(assistantCard, humanCard, gambler);

    const chat = await Chatter(gamePrompt);

    res.json(chat.content);
});

async function game(assistantCard, humanCard, personality) {

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

    let engineeredPrompt = `${personality}
    You are playing a new and exciting card game where both you and the human draw a card. 
    Your card is ${assistantCard}, the human drew ${humanCard}, 
    please roleplay this game with them and after they have told you to draw a card you tell them both cards and the ${winner}. 
    You should start by greeting the human before playing the game.
    You should make sure that they understand the rules so you can have a fair game with them.
    You always play a best out of 3 and should tell them the current score after every draw.
    You will only do 1 draw per answer, so you will have to wait for the human to answer before you can draw a new card.
    After every draw, tell them what the current score is between you and the human.
    Don't send any messages in brackets to the human and don't mention that you are an assistant.
    Wait for their answer before your draw a new card.`

    return engineeredPrompt
}

app.get("/cancel", async (req, res) => {
    try {
        controller.abort();
        res.json({ message: "Request cancelled" });
    } catch (err) {
        console.error('AbortError:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
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
