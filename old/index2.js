const { RTMClient } = require('@slack/rtm-api');
const { WebClient } = require('@slack/web-api');

// Read a token from the environment variables
require('dotenv').config()
const token = process.env.SLACK_BOT_TOKEN;
 
// Authentication Airtable
const base = require('airtable').base('appzr5taRmaHbzkbz');

// Initialize
const rtm = new RTMClient(token);
const web = new WebClient(token);

// Retrieve data from table 1

base('Table 1').select().all().then((data)=>{
    //console.log(data);
    // Object.keys(data);
    //data.name();
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
    //console.log(persons);
    console.log(persons[0].photo);
    const main = async () => {
        // Connect to Slack
        const { self, team } = await rtm.start();
        rtm.on('message', async (event) => {
            console.log(event);
            if(event.subtype === 'bot_message' || event.user === 'USLACKBOT'){ // Si le subtype vaut bot message alors on s'arrete là ou que c'est le bot slack
                return;
            }
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
                            {
                                "type": "button",
                                "text": {
                                    "type": "plain_text",
                                    "text": persons[1].nom, // A remplacer
                                    "emoji": true
                                },
                                "value": "click_me_123"
                            },
                            {
                                "type": "button",
                                "text": {
                                    "type": "plain_text",
                                    "text": persons[2].nom, // A remplacer
                                    "emoji": true
                                },
                                "value": "click_me_123"
                            }
                        ]
                    }
                
                    
                
                ]
                
                ,
                channel: event.channel,
              });
    
          });
        
    
    }
    main();
})

