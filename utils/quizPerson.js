const {shuffle} = require('./shuffle');
const Airtable = require('airtable');

// Authentication Airtable
const base = Airtable.base(process.env.AIRTABLE_TABLE);

const CACHE_EXPIRATION = 3600000; // temps d'expiration du cache choisi

let personsCache = null;
let heure_debut_cache = Date.now();
const getPersons = async () => {
    if (personsCache == null || (Date.now() - heure_debut_cache) > CACHE_EXPIRATION) {
        console.log("Loading cache");
        personsCache = await getPersonsOnline();
        heure_debut_cache = Date.now();
    }

    return personsCache;
}

// Recherche de la base Airtable
const getPersonsOnline = async () => {
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
            entreprise: person.fields.Entreprise,
            sexe: person.fields.MrMme.
            id: person.id,
            }
    }).filter((person) => person);
    return persons;
};

const getQuizMessage = async (user) => {
    const persons = await getPersons();
    shuffle(persons);
    const personSexeToGuess = persons[0].sexe;
    const memesexe = persons.filter((person) => {
        return person.sexe === personSexeToGuess;
    });  
    const buttons = [
        {
            "type": "button",
            "text": {
                "type": "plain_text",
                "text": memesexe[0].nom, // A remplacer
                //"emoji": true
            },
            "value": "click_me_123",
            "action_id": "guess_correct"
                
        },
        {
            "type": "button",
            "text": {
                "type": "plain_text",
                "text": memesexe[1].nom, // A remplacer
                //"emoji": true
            },
            "value": JSON.stringify({nom: memesexe[0].nom, entreprise: memesexe[0].entreprise, id: memesexe[0].id}),
            "action_id": "guess_false1"
        },
        {
            "type": "button",
            "text": {
                "type": "plain_text",
                "text": memesexe[2].nom, // A remplacer
                //"emoji": true
            },
            "value": JSON.stringify({nom: memesexe[0].nom, entreprise: memesexe[0].entreprise, id: memesexe[0].id}),
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
                "image_url": memesexe[0].photo, // A remplacer
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
