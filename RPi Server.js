var http = require('http');
http.createServer(function(request, response) {

        response.writeHead(200, {
            'Content-Type': 'text/plain'
        });
        if (request.method == 'POST') {

            var op = "";
            console.log("POST " + request.url);
            var body = '';
            request.on('data', function(data) {
                body += data;
                console.log("Partial body: " + body);
            });
            request.on('end', function() {
                op = parseInput(body);
                response.writeHead(200, {
                    'Content-Type': 'text/html'
                });
                response.end(op);
            });

        } else {
            console.log("GET " + request.url);
            var url = request.url;
            var responseSpeech;
            if (url == "/temperature") {
                if (homekitSensors.temperature == 1000) {
                    responseSpeech = "The temperature sensor is not working. Please check the sensor."
                } else {
                    responseSpeech = "Current room temperature is " + homekitSensors.temperature + " degree celsius. Current humidity is " + homekitSensors.temperature
                }
            }
            response.end(responseSpeech);
        }

    })
    .listen(8000, '192.168.1.99');

function parseInput(body) {
    var jsonvalue = JSON.parse(body);
    console.log(jsonvalue.name)
    if (jsonvalue.name == "setColor") {
        var colorschema = jsonvalue;
        var color = colorschema.slots.color.value;
        var room = colorschema.slots.room.value;
        var brightness = colorschema.slots.brightness.value

        var foundCol = colorHSB.Colors[color.toUpperCase()];
        if (foundCol != undefined) {
            var HUE = foundCol.H;
            var SATURATION = foundCol.S;
            var BRIGHTNESS = foundCol.L;
            publishMqtt('brightness', 'brightness' + BRIGHTNESS);
            publishMqtt('saturation', 'saturation' + SATURATION); //publish saturation to ESP8266
            publishMqtt('hue', 'hue' + HUE);

            console.log("Color: " + color + " Room: " + room + " Hue: " + HUE + " Saturation:" + SATURATION + " Brightness: " + BRIGHTNESS);
            return room + " color has been set to " + color;

        } else {
            return "color cannot be identified"
            console.log("Color not found..");
        }
    } else if (jsonvalue.name == "setPower") {

        var deviceSchema = jsonvalue;
        var room = deviceSchema.slots.room.value;
        var device = deviceSchema.slots.devices.value;
        var swt = deviceSchema.slots.switch.value

        return device + " in  " + room + " has been turned " + swt;

    }
}



function publishMqtt(type, value) {
    console.log(value);
    var mqtt = require('mqtt');
    var clients = mqtt.connect('mqtt://localhost');
    clients.publish(type, value.toString());
}

var homekitSensors = {
    temperature: 1000,
    humidity: 3000
}

var mqtt = require('mqtt');
var client = mqtt.connect('mqtt://localhost');

client.on('connect', function() {
    client.subscribe('temperature');

    client.on('message', function(topic, message) { //subscribe to topic

        if (topic == "temperature") {
            homekitSensors.temperature = message;

            console.log("temperature " + message.toString());
        }
        if (topic == "humidity") {
            homekitSensors.humidity = message;

            console.log("humidity " + message.toString());
        }
    });
});

var colorHSB = {
    "Colors": {
        "WHITE": {
            "H": "0",
            "S": "0",
            "L": "0"
        },
        "RED": {
            "H": "0",
            "S": "100",
            "L": "50"
        },
        "LIME": {
            "H": "120",
            "S": "100",
            "L": "50"
        },
        "BLUE": {
            "H": "240",
            "S": "100",
            "L": "50"
        },
        "YELLOW": {
            "H": "60",
            "S": "100",
            "L": "50"
        },
        "CYAN": {
            "H": "180",
            "S": "100",
            "L": "50"
        },
        "MAGENTA": {
            "H": "300",
            "S": "100",
            "L": "50"
        },
        "SILVER": {
            "H": "0",
            "S": "0",
            "L": "75"
        },
        "GRAY": {
            "H": "0",
            "S": "0",
            "L": "50"
        },
        "MAROON": {
            "H": "0",
            "S": "100",
            "L": "25"
        },
        "OLIVE": {
            "H": "60",
            "S": "100",
            "L": "25"
        },
        "GREEN": {
            "H": "120",
            "S": "100",
            "L": "25"
        },
        "PURPLE": {
            "H": "300",
            "S": "100",
            "L": "25"
        },
        "TEAL": {
            "H": "180",
            "S": "100",
            "L": "25"
        },
        "NAVY": {
            "H": "240",
            "S": "100",
            "L": "25"
        }
    }
}
console.log('Server running at http://192.168.1.99:8000/');
