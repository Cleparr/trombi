const {shuffle} = require('./shuffle');
const Airtable = require('airtable');

// Authentication Airtable
const base = Airtable.base(process.env.AIRTABLE_TABLE);

// Recherche de la base Airtable
const getPersons = async () => {
    // Start your app
    const data = await base('Table 1').select().all()
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
    return persons;
};

const getQuizMessage = async (user) => {
    const persons = await getPersons();
    shuffle(persons);
    //const photo0 = persons[entierAlea].photo;
    const buttons = [
        {
            "type": "button",
            "text": {
                "type": "plain_text",
                "text": persons[0].nom, // A remplacer
                //"emoji": true
            },
            "value": "click_me_123",
            "action_id": "guess_correct"
                
        },
        {
            "type": "button",
            "text": {
                "type": "plain_text",
                "text": persons[1].nom, // A remplacer
                //"emoji": true
            },
            "value": JSON.stringify({nom: persons[0].nom, entreprise: persons[0].entreprise}),
            "action_id": "guess_false1"
        },
        {
            "type": "button",
            "text": {
                "type": "plain_text",
                "text": persons[2].nom, // A remplacer
                //"emoji": true
            },
            "value": JSON.stringify({nom: persons[0].nom, entreprise: persons[0].entreprise}),
            "action_id": "guess_false2"
        }
    ];
    shuffle(buttons);
    
    // say() sends a message to the channel where the event was triggered
    return {
        blocks: [
            {
                "type": "section",
                "text": {
                    "type": "mrkdwn",
                    "text": `Hey <@${user}> ! Prêt pour une partie de qui-est-ce ?`
                },
            },
            
            {
                "type": "image",
                "title": {
                    "type": "plain_text",
                    "text": "image1",
                    "emoji": true
                },
                //"image_url": "https://api.slack.com/img/blocks/bkb_template_images/beagle.png",
                "image_url": persons[0].photo, // A remplacer
                "alt_text": "image1"      
            },
            
            {
                "type": "actions",
                "elements": buttons,
            }
        ]
    };
}

function sleep(ms){
    return new Promise(resolve=>{
        setTimeout(resolve,ms)
    })
}

exports.getQuizMessage = getQuizMessage;
exports.getPersons = getPersons;
exports.sleep = sleep;
