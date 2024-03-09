# Introduction
This a card game interface that uses GPT3.5 turbo by OpenAI and Anthropic ai to simulate a card game. Using the deck of cards api.

This package features the following:

```
- A simple to understand card game that involves drawing from a deck of cards through an external api and comparing values.
- An ai dealer that will draw your cards and explain the rules.
- Four different personalities to play against!
  - Two personalities are powered by GPT3.5 turbo
  - Two personalities are powered by Anthropic ai
- A back end rest api using langchain and express.
- A front end interface with a simple layout.
- Chat history that is being saved to local storage and utilised to give the ai context of your conversation.
- A voice recognition feature that allows you to speak your requests (make sure to use google chrome for this to ensure compatibility.)
- The ability to cancel a request.


## How to install and setup:

- Unzip the folder
```
- cd server
- npm init
- npm install
- npm install @langchain/openai
- npm install @langchain/anthropic
```

## How to setup the package.json
- In package.json add the following line: "dev": "node --env-file=.env --watch server.js"

## how to setup the environment file
- Create an .env file env file and fill it with your own api info like this:
```  
OPENAI_API_TYPE=type
OPENAI_API_VERSION=version
OPENAI_API_BASE=base
AZURE_OPENAI_API_KEY=key
DEPLOYMENT_NAME=deploy
ENGINE_NAME=engine
INSTANCE_NAME=instance

ANTHROPIC_API_KEY=key

```

## How to start

- Use npm run dev to start the server
- Open the html file in your browser.
