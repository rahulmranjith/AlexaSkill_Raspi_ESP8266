{
    "intents": [{
            "name": "AMAZON.CancelIntent",
            "samples": []
        },
        {
            "name": "AMAZON.HelpIntent",
            "samples": []
        },
        {
            "name": "AMAZON.StopIntent",
            "samples": []
        },
        {
            "name": "getHumidity",
            "samples": [],
            "slots": []
        },
        {
            "name": "getTemperature",
            "samples": [
                "whats the current temperature",
                "what is the temperature ",
                "what is the temperature now",
                "please give me the temperature",
                "please give me the current temperature",
                "current temperature"
            ],
            "slots": []
        },
        {
            "name": "setColor",
            "samples": [
                "to set {room} light to {color}",
                "to set {room} light color to {color}",
                "to set {room} color to {color}",
                "to set {room} brightness to {brightness} percentage",
                "to set {room} brightness to {brightness} ",
                "to set {color} ",
                "to set {room} to {color} ",
                "to set brightness to {brightness} ",
                "set {room}  light to {color} ",
                "set {room}  light color to {color} ",
                "set {room} color to {color} ",
                "set color"
            ],
            "slots": [{
                    "name": "room",
                    "type": "rooms",
                    "samples": [
                        "{room} ",
                        "I want {room} ",
                        "set {room} color to {color}"
                    ]
                },
                {
                    "name": "color",
                    "type": "AMAZON.Color",
                    "samples": [
                        "set {room}  color to {color} ",
                        "{color} "
                    ]
                },
                {
                    "name": "brightness",
                    "type": "AMAZON.NUMBER",
                    "samples": []
                },
                {
                    "name": "switch",
                    "type": "onoff",
                    "samples": []
                }
            ]
        },
        {
            "name": "setPower",
            "samples": [
                "turn {switch} {room} {devices}",
                "switch {switch} {room} light",
                "turn {switch} {room} light ",
                "switch {switch} {room} {devices}",
                "turn {switch} "
            ],
            "slots": [{
                    "name": "switch",
                    "type": "onoff",
                    "samples": []
                },
                {
                    "name": "room",
                    "type": "rooms",
                    "samples": [
                        "turn {switch}  {room} {devices} "
                    ]
                },
                {
                    "name": "devices",
                    "type": "rahul_Devices",
                    "samples": [
                        "{devices} ",
                        "turn {switch}  {room} {devices} "
                    ]
                }
            ]
        }
    ],
    "types": [{
            "name": "onoff",
            "values": [{
                    "name": {
                        "value": "on"
                    }
                },
                {
                    "name": {
                        "value": "off"
                    }
                }
            ]
        },
        {
            "name": "rahul_Devices",
            "values": [{
                    "name": {
                        "value": "bulb"
                    }
                },
                {
                    "name": {
                        "value": "fan"
                    }
                },
                {
                    "name": {
                        "value": "ac"
                    }
                },
                {
                    "name": {
                        "value": "air conditioner"
                    }
                },
                {
                    "name": {
                        "value": "television"
                    }
                },
                {
                    "name": {
                        "value": "tv"
                    }
                },
                {
                    "name": {
                        "value": "set top box"
                    }
                },
                {
                    "name": {
                        "value": "satellite box"
                    }
                },
                {
                    "name": {
                        "value": "camera"
                    }
                },
                {
                    "name": {
                        "value": "raspi "
                    }
                },
                {
                    "name": {
                        "value": "apple tv"
                    }
                },
                {
                    "name": {
                        "value": "outlet"
                    }
                },
                {
                    "name": {
                        "value": "tube light"
                    }
                },
                {
                    "name": {
                        "value": "cfl light"
                    }
                },
                {
                    "name": {
                        "value": "led light"
                    }
                },
                {
                    "name": {
                        "value": "led"
                    }
                },
                {
                    "name": {
                        "value": "oven"
                    }
                },
                {
                    "name": {
                        "value": "inverter"
                    }
                },
                {
                    "name": {
                        "value": "fridge"
                    }
                },
                {
                    "name": {
                        "value": "refrigerator"
                    }
                },
                {
                    "name": {
                        "value": "home theater"
                    }
                },
                {
                    "name": {
                        "value": "blu ray player"
                    }
                },
                {
                    "name": {
                        "value": "amplifier"
                    }
                },
                {
                    "name": {
                        "value": "receiver"
                    }
                },
                {
                    "name": {
                        "value": "cable tv box"
                    }
                },
                {
                    "name": {
                        "value": "pump"
                    }
                },
                {
                    "name": {
                        "value": "sound bar"
                    }
                },
                {
                    "name": {
                        "value": "clock"
                    }
                },
                {
                    "name": {
                        "value": "phone charger"
                    }
                },
                {
                    "name": {
                        "value": "charger"
                    }
                },
                {
                    "name": {
                        "value": "laptop charger"
                    }
                },
                {
                    "name": {
                        "value": "computer charger"
                    }
                },
                {
                    "name": {
                        "value": "pc charger"
                    }
                },
                {
                    "name": {
                        "value": "bluetooth charger"
                    }
                },
                {
                    "name": {
                        "value": "iphone charger"
                    }
                },
                {
                    "name": {
                        "value": "mobile charger"
                    }
                },
                {
                    "name": {
                        "value": "tubelight"
                    }
                },
                {
                    "name": {
                        "value": "cfl"
                    }
                }
            ]
        },
        {
            "name": "rooms",
            "values": [{
                    "name": {
                        "value": "living room"
                    }
                },
                {
                    "name": {
                        "value": "bed room"
                    }
                },
                {
                    "name": {
                        "value": "kitchen"
                    }
                },
                {
                    "name": {
                        "value": "garage"
                    }
                },
                {
                    "name": {
                        "value": "ground floor bedroom"
                    }
                },
                {
                    "name": {
                        "value": "ground floor bathroom"
                    }
                },
                {
                    "name": {
                        "value": "ground floor living room"
                    }
                },
                {
                    "name": {
                        "value": "ground floor lounge"
                    }
                },
                {
                    "name": {
                        "value": "ground floor kitchen"
                    }
                },
                {
                    "name": {
                        "value": "ground floor master bedroom"
                    }
                },
                {
                    "name": {
                        "value": "my bedroom"
                    }
                },
                {
                    "name": {
                        "value": "father's bedroom"
                    }
                },
                {
                    "name": {
                        "value": "mother's bedroom"
                    }
                },
                {
                    "name": {
                        "value": "brother's bedroom"
                    }
                },
                {
                    "name": {
                        "value": "sister's bedroom"
                    }
                },
                {
                    "name": {
                        "value": "first bedroom"
                    }
                },
                {
                    "name": {
                        "value": "second bedroom"
                    }
                },
                {
                    "name": {
                        "value": "third bedroom"
                    }
                },
                {
                    "name": {
                        "value": "ground floor first bedroom"
                    }
                },
                {
                    "name": {
                        "value": "ground floor second bedroom"
                    }
                },
                {
                    "name": {
                        "value": "ground floor third bedroom"
                    }
                },
                {
                    "name": {
                        "value": "first floor bedroom"
                    }
                },
                {
                    "name": {
                        "value": "first floor master bedroom"
                    }
                },
                {
                    "name": {
                        "value": "first floor lounge"
                    }
                },
                {
                    "name": {
                        "value": "first floor living room"
                    }
                },
                {
                    "name": {
                        "value": "first floor balcony"
                    }
                },
                {
                    "name": {
                        "value": "ground floor balcony"
                    }
                },
                {
                    "name": {
                        "value": "open terrace"
                    }
                }
            ]
        }
    ],
    "prompts": [{
            "id": "Elicit.Intent-setColor.IntentSlot-room",
            "promptVersion": "1.0",
            "definitionVersion": "1.0",
            "variations": [{
                    "type": "PlainText",
                    "value": "which room light color to be set ?"
                },
                {
                    "type": "PlainText",
                    "value": "which room light color you want to select ?"
                },
                {
                    "type": "PlainText",
                    "value": "which room you want to select ?"
                },
                {
                    "type": "PlainText",
                    "value": "which room ?"
                }
            ]
        },
        {
            "id": "Elicit.Intent-setColor.IntentSlot-color",
            "promptVersion": "1.0",
            "definitionVersion": "1.0",
            "variations": [{
                    "type": "PlainText",
                    "value": "which color you want to set ?"
                },
                {
                    "type": "PlainText",
                    "value": "which is your favourite color ?"
                },
                {
                    "type": "PlainText",
                    "value": "what is your expected color ?"
                },
                {
                    "type": "PlainText",
                    "value": "which color you like the most ?"
                },
                {
                    "type": "PlainText",
                    "value": "you missed to say the color "
                }
            ]
        },
        {
            "id": "Elicit.Intent-setPower.IntentSlot-room",
            "promptVersion": "1.0",
            "definitionVersion": "1.0",
            "variations": [{
                    "type": "PlainText",
                    "value": "which room ?"
                },
                {
                    "type": "PlainText",
                    "value": "which room you need to select ?"
                },
                {
                    "type": "PlainText",
                    "value": "please select the room"
                },
                {
                    "type": "PlainText",
                    "value": "tell me the room you want to select"
                }
            ]
        },
        {
            "id": "Elicit.Intent-setPower.IntentSlot-devices",
            "promptVersion": "1.0",
            "definitionVersion": "1.0",
            "variations": [{
                    "type": "PlainText",
                    "value": "which device you want to select ?"
                },
                {
                    "type": "PlainText",
                    "value": "please select the device"
                },
                {
                    "type": "PlainText",
                    "value": "name the device please"
                }
            ]
        },
        {
            "id": "Confirm.Intent-setPower.IntentSlot-devices",
            "promptVersion": "1.0",
            "definitionVersion": "1.0",
            "variations": [{
                "type": "PlainText",
                "value": "are you sure you want to turn {switch}  {room} {devices} "
            }]
        }
    ],
    "dialog": {
        "version": "1.0",
        "intents": [{
                "name": "getHumidity",
                "confirmationRequired": false,
                "prompts": {},
                "slots": []
            },
            {
                "name": "getTemperature",
                "confirmationRequired": false,
                "prompts": {},
                "slots": []
            },
            {
                "name": "setColor",
                "confirmationRequired": false,
                "prompts": {},
                "slots": [{
                        "name": "room",
                        "type": "rooms",
                        "elicitationRequired": true,
                        "confirmationRequired": false,
                        "prompts": {
                            "elicit": "Elicit.Intent-setColor.IntentSlot-room"
                        }
                    },
                    {
                        "name": "color",
                        "type": "AMAZON.Color",
                        "elicitationRequired": true,
                        "confirmationRequired": false,
                        "prompts": {
                            "elicit": "Elicit.Intent-setColor.IntentSlot-color"
                        }
                    },
                    {
                        "name": "brightness",
                        "type": "AMAZON.NUMBER",
                        "elicitationRequired": false,
                        "confirmationRequired": false,
                        "prompts": {}
                    },
                    {
                        "name": "switch",
                        "type": "onoff",
                        "elicitationRequired": false,
                        "confirmationRequired": false,
                        "prompts": {}
                    }
                ]
            },
            {
                "name": "setPower",
                "confirmationRequired": false,
                "prompts": {},
                "slots": [{
                        "name": "switch",
                        "type": "onoff",
                        "elicitationRequired": false,
                        "confirmationRequired": false,
                        "prompts": {}
                    },
                    {
                        "name": "room",
                        "type": "rooms",
                        "elicitationRequired": true,
                        "confirmationRequired": false,
                        "prompts": {
                            "elicit": "Elicit.Intent-setPower.IntentSlot-room"
                        }
                    },
                    {
                        "name": "devices",
                        "type": "rahul_Devices",
                        "elicitationRequired": true,
                        "confirmationRequired": true,
                        "prompts": {
                            "elicit": "Elicit.Intent-setPower.IntentSlot-devices",
                            "confirm": "Confirm.Intent-setPower.IntentSlot-devices"
                        }
                    }
                ]
            }
        ]
    }
}
