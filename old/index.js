//console.log(process.env.SLACK_AUTH_TOKEN);
var SlackBot = require("slackbots");
require('dotenv').config()

var bot  = new SlackBot({
  token : process.env.SLACK_AUTH_TOKEN,
  name: "Trombi"

});

bot.on("start", async function() {
    // bot.postMessageToChannel(channel, "Hello world!");
    const rez = await bot.getUserByEmail('coline.hasle@leb612.com');
    await bot.postMessage(rez.id,'T es l feu');  
    console.log(rez);
    console.log("Hello world!");
});
