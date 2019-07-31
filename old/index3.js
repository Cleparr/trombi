const { RTMClient } = require('@slack/rtm-api');
const { WebClient } = require('@slack/web-api');
const { createMessageAdapter } = require('@slack/interactive-messages');
const Airtable = require('airtable');

// Read a token from the environment variables
require('dotenv').config()
const token = process.env.SLACK_BOT_TOKEN;

// Read the client secret from the environment variables
const slackClientSecret = process.env.SLACK_CLIENT_SECRET;
 
// Authentication Airtable

// Initialize
const rtm = new RTMClient(token);
const web = new WebClient(token);

// Retrieve data from table 1

const main = async () => {
    // Connect to Slack
    const base = Airtable.base(process.env.AIRTABLE_TABLE);
    const { self, team } = await rtm.start();
    const slackInteractions = createMessageAdapter(slackClientSecret);

    const server = await slackInteractions.start(process.env.PORT || 3000);
        
    slackInteractions.action({ type: 'guess_person' }, (payload, respond) => {
        respond({text: 'Ca marche'});
    })

    const data = await base('Table 1').select().all();
    const persons = data.map((person) => {
        if (!person.fields.Nom) {
            return false;
        }
        return {
            nom: person.fields.Nom,
            logo: person.fields.Logo[0].url,
            photo: person.fields.Photo[0].url,
            entreprise: person.fields.Entreprise
        }
    }).filter((person) => person);
    

    rtm.on('message', async (event) => {
        console.log(event);
        if(event.subtype === 'bot_message' || event.user === 'USLACKBOT'){ // Si le subtype vaut bot message alors on s'arrete là ou que c'est le bot slack
            return;
        }
        try {

            const result = await web.chat.postMessage({
                blocks: [
                        {
                            "type": "section",
                            "text": {
                                "type": "mrkdwn",
                                "text": "Hey ! Prêt pour une partie de qui-est-ce ? "
                            }
                        },
                      
                        {
                            "type": "image",
                            "title": {
                                "type": "plain_text",
                                "text": "image1",
                                "emoji": true
                            },
                            //"image_url": "https://api.slack.com/img/blocks/bkb_template_images/beagle.png",
                            "image_url": persons[1].photo, // A remplacer
                            "alt_text": "image1"
                        },
                        {
                            "type": "actions",
                            "elements": [
                                {
                                    "type": "button",
                                    "text": {
                                        "type": "plain_text",
                                        "text": persons[0].nom, // A remplacer
                                        "emoji": true
                                    },
                                    "value": "click_me_123"
                                },
                            ]
                            

                        // {
                        //     text: "Qui est-ce ?",
                        //     type: "section",
                        //     actions: [
                        //         {
                        //             "type": "button",
                        //             "text": persons[0].nom, // A remplacer
                        //             "value": persons[0].nom,
                        //             "name": "guess_person",
                        //         },
                        //         {
                        //             "type": "button",
                        //             "text": persons[1].nom, // A remplacer
                        //             "value": persons[1].nom,
                        //             "name": "guess_person",
                        //         },
                        //         {
                        //             "type": "button",
                        //             "text": persons[2].nom, // A remplacer
                        //             "value": persons[2].nom,
                        //             "name": "guess_person",
                        //         }
                        //     ]
                        // },
                        // {
                        //     "type": "actions",
                        //     "elements": [
                        //         {
                        //             "type": "button",
                        //             "text": persons[0].nom, // A remplacer
                        //             "value": persons[0].nom,
                        //             "action_id": "guess_person",
                        //         },
                        //         {
                        //             "type": "button",
                        //             "text": persons[1].nom, // A remplacer
                        //             "value": persons[1].nom,
                        //             "action_id": "guess_person2",
                        //         },
                        //         {
                        //             "type": "button",
                        //             "text": persons[2].nom, // A remplacer
                        //             "value": persons[2].nom,
                        //             "action_id": "guess_person3",
                        //         }
                        //     ]
                        // }
                    ,]
                ,
                channel: event.channel,
              });
        } catch (e) {
            console.error(e.data.response_metadata);
        }

      });
}
main().catch((e) => {console.error(e)});

// process.on('unhandledRejection', (e) => {
//     console.error(e);
// })