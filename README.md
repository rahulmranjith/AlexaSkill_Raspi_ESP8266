# AlexaSkill Raspi 3 - ESP8266 - MQTT 

### A dialog interactive alexa skill which interacts with webserver hosted in RPi which the communicates to the ESP8266 using the MQTT ; controls NeoPixel ,gets Temp & humidity and  Cryptocurrency values

This Alexa skill provides:

1. #### An option to change the HSL values of the Neopixel 
1. #### Provide the temperature, humidity reading from the ESP8266 which is send back to user as speech output .
1. #### The latest option is to give the cryptocurrency coin values in INR(Indian Rupees).The logic can be changed to fetch values for any currencies.


_My other projects had the HAP NodeJS setup in the Raspberry Pi which communicated to the ESP8266 through MQTT. 
ESP8266 publishes the topic messages for humidity,temperature and the Raspberry Pi receives the messages ,parse and make it available for the accessories ._

_The HAP NodeJS publishes the HSL values(The HSL values which are changed for the bulb through the homekit app) for the NeoPixel through MQTT. ESP8266 parses the HSL value and sends to Neo._

**_Recently I got the Alexa and the main reason I got it was to make the alexa control my home kit._
_Alexa has a new skill builder option which enables to have an interactive conversation . This would be something like "Alexa, open my homekit" , then alexa gives the welcome messages and the subsequent comamands will make alexa ask us for the "room" ,color  in this which are the required slots for the intents._**

### AWS Setup:

1.) An aws is required for hosting the nodejs code through the lambda function . An aws free trial can be created and can be consumed for an year with sufficient api calls available . 
[https://aws.amazon.com ](https://aws.amazon.com ). 
- Create a lambda function with runtime as Nodejs 6.1.0 giving a description and function name. Copy the code given in [https://github.com/rahulmranjith/AlexaSkill_Raspi_ESP8266/blob/master/Lambda_src.js](https://github.com/rahulmranjith/AlexaSkill_Raspi_ESP8266/blob/master/Lambda_src.js) and save the function. The function ARN would be something like **"_arn:aws:lambda:us-east-1:xxxxxxxxx:function:raspifunction_"**  
- The **pushData**() method makes a post request with the intent slots and its values to the pi server hosted in the raspberry pi.The port 8000 has to be opened at the raspberry pi to accept the calls from the lambda function .The host can be the public ip of the raspi pi OR can configure the duckdns for a subdomain so that we don't need to worry about the public ip if its not static.

- The role of this lambda function here is to just pass on the slots and the values to the raspi pi. We use the lambda function as the end point for the skills through which we can pass the intent,slot values to the raspi pi.

### Alexa Skill Setup :

1.)Create a developer account in amazon.com . Go to the Alexa section and create a new skill with the following configuration :
- Give a invocation to the skill ex: "my homekit"
- In the Configuration section set AWS Lambda ARN (Amazon Resource Name) as the one which we created in AWS section 
"arn:aws:lambda:us-east-1:xxxxxxxxx:function:raspifunction"
- Interaction Model (Builder Beta): This one helps us to create the interactive model using the skill builder. Earlier it was more or less manual json input but we have got an interface to provide the value , at the same time the "slot filling prompt" is there which helps to prompt with the missing slot values when we invoke the alexa .Most of the skills are configured and the https://github.com/rahulmranjith/AlexaSkill_Raspi_ESP8266/blob/master/Utterances_Intent(Using%20Skill%20Builder%20Beta).js   
can be put in the Code Editor. These are the default values for my projects which can be configured as per your wish with more questions and prompts.

How It Works ?

The intents are basically getting called based on the requirements/questions we make to alexa. In this case we have the following intents apart from default ones. 
**'setPower','getCoinValues','getTemperature','setColor'**. These intents are associated with utterances , and these utterances make the alexa call the intent in the lambda functions and perform its business logic. 
Ex: We have an intent getTemperature and it has some utterances like "please give me the current temperature", "what is the current temperature" and many like that.

So what happens is that once the alexa is triggered using the invocation keyword "my homekit", alexa starts with welcome message and then wait for dialogState to be in completed state .Once it waits we can ask for any intent trigger , here in this case it would be the "what is the current temperature" and since this utterance is associated to the getTemperature intent, the same is called in the lambda function which inturn calls the raspi method from the lambda function.

In case of the "setColor" , slots will come into play which is something we need to provide as an input for the intent. The setColor expects "room" , the "color" and "brightness" intent slot values.(These intent slots are set as required). So if the respective intent is invoked using the utterances , alexa will ask for the values to be filled for each of these slots as they are make required , and once all the values are provided the "setColor" intent is called in the lambda function . The slot values are then passed to the rapsberry Pi and then from pi to the ESP8266 through MQTT .

**CryptoCoin current value in Indian Rupees**
A socket 






