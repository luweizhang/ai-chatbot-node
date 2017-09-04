//use this to test some javascript code / node js code locally
'use strict'

let message = "My weights is 162 pounds.";
let splitmessage = message.split(' ');

console.log(splitmessage)

function messageHandler(sender, message) {
/*
Determine how to handle the message
*/

if (splitmessage.includes('weight') || splitmessage.includes('pounds')) {
	weightTrackingHander(sender, message)
} else {
    //do nothing
};
}

function weightTrackingHander(sender, message) {
	sendTextMessage(sender, "Got it! Your weight for today has been recorded as: " + String(162))
}