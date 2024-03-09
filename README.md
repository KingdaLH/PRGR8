This a card game interface that uses GPT3.5 turbo by OpenAI and Anthropic ai to simulate a card game. Using the deck of cards api.

Steps to install:

- Unzip the folder
- cd server
- npm init
- npm install
- npm install @langchain/openai
- npm install @langchain/anthropic
- In package.json add the following line: "dev": "node --env-file=.env --watch server.js"
- Create an .env file env file and fill it with your own api info like this:
  
OPENAI_API_TYPE=type
OPENAI_API_VERSION=version
OPENAI_API_BASE=base
AZURE_OPENAI_API_KEY=key
DEPLOYMENT_NAME=deploy
ENGINE_NAME=engine
INSTANCE_NAME=instance

ANTHROPIC_API_KEY=key

- Use npm run dev to start the server
- Open the html file in your browser.
