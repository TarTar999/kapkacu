// El Mehdi LAIDOUNI

var express = require('express')
var bodyParser = require('body-parser')
var request = require('request')
var app = express()

app.set('port', (process.env.PORT || 5000))

// Process urlencoded
app.use(bodyParser.urlencoded({extended: false}))

// Process json
app.use(bodyParser.json())

// Index route
app.get('/', function (req, res) {
    res.send('salut je suis le kapkacu_bot')
})

app.get('/webhook/', function (req, res) {
    if (req.query['hub.verify_token'] === 'Bot_Messenger_App') {
        res.send(req.query['hub.challenge'])
    }
    res.send('Error, wrong token')
})

app.listen(app.get('port'), function() {
    console.log('running on port', app.get('port'))
})


// End Point

app.post('/webhook/', function (req, res) {
    messaging_events = req.body.entry[0].messaging
    for (i = 0; i < messaging_events.length; i++) {
        event = req.body.entry[0].messaging[i]
        sender = event.sender.id
        if (event.message && event.message.text) {
            text = event.message.text
            if (text === 'salut') {
                sendGenericMessage(sender)
                continue
            }
            sendTextMessage(sender, "Bot: " + text.substring(0, 200))
        }
        if (event.postback) {
            text = JSON.stringify(event.postback)
            sendTextMessage(sender, "Postback received: "+text.substring(0, 200), token)
            continue
        }
    }
    res.sendStatus(200)
})

var token = "EAAS27BrwedgBADkzlF02viqgwDeBtsN6CTTCZCF1C59GaKA2RLV62bAgsRZCw5XusJEbpfTAOnmnWbzSRkLBvdTfUc0V8MjpZBFc9EEfCHABuO8slZBnuIM9RZBpnJ60sZCccJDybhYNWbE8TZB0SfMsGmPZAvbqPJxkLqPL8qEVvAZDZD"

// Echo back messages

function sendTextMessage(sender, text) {


    messageData = {
        text:text
    }
    request({
        url: 'https://graph.facebook.com/v2.6/me/messages',
        qs: {access_token:token},
        method: 'POST',
        json: {
            recipient: {id:sender},
            message: messageData,
        }
    }, function(error, response, body) {
        if (error) {
            console.log('Error sending messages: ', error)
        } else if (response.body.error) {
            console.log('Error: ', response.body.error)
        }
    })
}

function teste() {
    request({
        url: 'https://www.admin.ifcad.net/serveur/matiere.php?action=out',
        method: 'POST',
        json: {
            recipient: {id:sender},
            message: messageData,
        }
    }, function(error, response, body) {
        console.log(response)
    })
}


// Two cards.

function sendGenericMessage(sender) {

    
    messageData = {
        "attachment": {
            "type": "template",
            "payload": {
                "template_type": "generic",
                "elements": [{
                    "title": "Bienvenue sur le bot kapkacu",
                    "subtitle": "kapkacu paiement",
                    "image_url": "http://kapkacu.com/img/logo.JPG",
                    "buttons": [{
                        "type": "web_url",
                        "url": "https://www.kapkacu.com",
                        "title": "Cree vous un compte kapkacu"
                    }, {
                        "type": "web_url",
                        "url": "https://web.facebook.com/kapkacu/",
                        "title": "Suivez moi sur FB"
                    }],
                }, ]  
            } 
        }
    }

     request({
        url: 'https://graph.facebook.com/v2.6/me/messages',
        qs: {access_token:token},
        method: 'POST',
        json: {
            recipient: {id:sender},
            message: messageData,
        }
    }, function(error, response, body) {
        if (error) {
            console.log('Error sending messages: ', error)
        } else if (response.body.error) {
            console.log('Error: ', response.body.error)
        }
    })

     teste()
}

