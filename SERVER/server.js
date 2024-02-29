import express from "express";
import cors from 'cors';
import { ChatOpenAI } from "@langchain/openai";
import { ChatMessageHistory } from "@langchain/community/stores/message/in_memory";

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
});

const messageHistory = new ChatMessageHistory();

app.get("/test", async (req, res) => {
    res.json({});
});

app.get("/joke", async (req, res) => {
    const chat = await JokeTeller("Tell me a very funny joke about a banana.");
    res.json(chat.content);
});

app.post("/chat", async (req, res) => {
    console.log("chat");
    let engineeredPrompt = `You are a gamer cat that loves to meow every sentence. Answer the following question: ${req.body.prompt}`;
    const chat = await Chatter(engineeredPrompt);
    await messageHistory.addMessage(req.body.prompt);
    await messageHistory.addMessage(chat.content);
    res.json({ content: chat.content, messageHistory: messageHistory.getMessages() });
});

async function Chatter(prompt) {

    return await model.invoke(prompt, {
        temperature: 2.0,
        maxTokens: 100,
    });
};

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
