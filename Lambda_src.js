const languageStrings = {
    'en-US': {
        translation: {

            SKILL_NAME: 'RasPi HomeKit',
            HELP_MESSAGE: 'You can say tell me to turn off a device or set color of the room light, or, you can say exit... What can I help you with?',
            HELP_REPROMPT: 'What can I help you with?',
            STOP_MESSAGE: 'Goodbye!',
            LAUNCH_MESSAGE: 'Welcome to Raspi HomeKit. I can turn on , off devices and even I can control the light color and brightness',
            LAUNCH_MESSAGE_REPROMPT: 'Try asking me to control the devices through Raspi HomeKit or Ask for help'
        },
    }
};

// 2. Skill Code =======================================================================================================


var Alexa = require('alexa-sdk');
var http = require('http');
var speechOutput = "";

exports.handler = function(event, context, callback) {
    var alexa = Alexa.handler(event, context);

    // alexa.appId = 'amzn1.echo-sdk-ams.app.1234';
    // alexa.dynamoDBTableName = 'YourTableName'; // creates new table for session.attributes
    alexa.resources = languageStrings;
    alexa.registerHandlers(handlers);
    alexa.execute();
};

var handlers = {
    'LaunchRequest': function() {
        //this.emit(':ask', "which room would you like to select ?","please tell which room you need to select ?");
        const speechOutput = this.t('LAUNCH_MESSAGE');
        const repromptOutput = this.t('LAUNCH_MESSAGE_REPROMPT');
        this.emit(':askWithCard', speechOutput, repromptOutput, this.t('SKILL_NAME'), removeSSML(speechOutput));
    },
    'setPower': function() {
        this.emit('setColor');
    },
    'getTemperature': function() {
        var self = this;
        getData("temperature", self);
    },

    'setColor': function() {
        console.log(this.event.request);
        console.log(this.event.request.intent.slots);
        if (this.event.request.dialogState == "STARTED" || this.event.request.dialogState == "IN_PROGRESS") {
            this.context.succeed({
                "response": {
                    "directives": [{
                        "type": "Dialog.Delegate"
                    }],
                    "shouldEndSession": false
                },
                "sessionAttributes": {}
            });
        } else {

            var self = this;
            pushData(this.event.request.intent, self);

        }


    },
    'AMAZON.HelpIntent': function() {
        const speechOutput = this.t('HELP_MESSAGE');
        const reprompt = this.t('HELP_MESSAGE');
        this.emit(':ask', speechOutput, reprompt);
    },
    'AMAZON.CancelIntent': function() {
        speechOutput = "";
        this.emit(':tell', speechOutput);
    },
    'AMAZON.StopIntent': function() {
        speechOutput = "";
        this.emit(':tell', speechOutput);
    },
    'SessionEndedRequest': function() {
        var speechOutput = "";
        this.emit(':tell', speechOutput);
    },
};

function getData(method, self) {

    var options = {
        host: 'abc.example.com',
        port: 8000,
        path: '/temperature'
    };

    http.get(options, function(res) {
        console.log("Got response: " + res.statusCode);

        res.on("data", function(chunk) {
            console.log("BODY: " + chunk);
            self.emit(':tell', chunk);
        });
    }).on('error', function(e) {
        console.log("Got error: " + e.message);
    });



}

function pushData(intent, self) {

    var data = JSON.stringify(intent);
    var options = {
        host: 'abc.example.com',
        port: 8000,
        path: '',
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Content-Length': Buffer.byteLength(data)
        }
    };

    var req = http.request(options, function(res) {
        res.setEncoding('utf8');

        res.on('data', function(chunk) {
            self.emit(':tell', chunk);
        });

    });

    req.write(data);
    req.end();
}

//    END of Intent Handlers {} ========================================================================================
// 3. Helper Function  =================================================================================================



function removeSSML(s) {
    return s.replace(/<\/?[^>]+(>|$)/g, "");
};
