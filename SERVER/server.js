import express from "express";
import cors from 'cors';
import { ChatOpenAI } from "@langchain/openai";

console.log("hello world");
console.log(process.env.AZURE_OPENAI_API_KEY);

const app = express();
const port = 8000;

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

app.get("/test", async (req, res) => {
    res.json({});
});

app.get("/joke", async (req, res) => {
    const chat = await JokeTeller("Tell me a very funny joke about a banana.");
    res.json(chat.content);
});

app.post("/chat", async (req, res) => {
    let stringifiedPrompt = JSON.stringify(req.body.prompt);
    let engineeredPrompt = `You are a gamer cat that loves to meow every sentence. Answer the following question: ${stringifiedPrompt}`;
    console.log(req.body.prompt);
    console.log(engineeredPrompt);
    const chat = await Chatter(engineeredPrompt);

    res.json(chat.content);
});

async function Chatter(prompt) {

    return await model.invoke(prompt);
};

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
