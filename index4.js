require('dotenv').config()
const { App } = require('@slack/bolt');
const {getQuizMessage} = require('./utils/quizPerson');
const {getPersons} = require('./utils/quizPerson');
const {sleep} = require('./utils/quizPerson');

// Read a token from the environment variables
const app = new App({
    token: process.env.SLACK_BOT_TOKEN,
    signingSecret: process.env.SLACK_SIGNING_SECRET
});

/// Listens to incoming messages that contain "hello"
app.message(async ({ message, say }) => {
    const quiz = await getQuizMessage(message.user);
    say(quiz);
});

app.action('guess_correct', async ({ body, ack, say }) => {
    // Acknowledge the action
    ack();
    say(`:heavy_check_mark: Bien joué !`);  
    await sleep(1000);
    const quiz = await getQuizMessage(body.user.id);
    say(quiz);
    
});

const falseGuess = async ({ body, ack, say }) => {
    // Acknowledge the action
    ack();
    const correctPerson = JSON.parse(body.actions[0].value);
    say(`:face_with_rolling_eyes: Raté, c'était en fait ${correctPerson.nom} de l'équipe ${correctPerson.entreprise}`);
    await sleep(2000);
    const quiz = await getQuizMessage(body.user.id);
    say(quiz);
    
}

app.action('guess_false1', falseGuess);
app.action('guess_false2', falseGuess);

(async () => {
    // Start your app
    await app.start(process.env.PORT || 3000);
    
    console.log('⚡️ Bolt app is running!');
})();

app.error((error) => {
    // Check the details of the error to handle cases where you should retry sending a message or stop the app
    console.error(error);
});

// function entierAleatoire(min, max)
// {
//  return Math.floor(Math.random() * (max - min + 1)) + min;
// }