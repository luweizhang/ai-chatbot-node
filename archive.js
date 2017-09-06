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

function dbStoreWeight(params) {
	console.log("attempting to post")	

	// Set the headers
	var headers = {
	    'User-Agent':       'Super Agent/0.0.1',
	    'Content-Type':     'application/x-www-form-urlencoded'
	}

	// Configure the request
	var options = {
	    url: '/db/weight',
	    method: 'POST',
	    headers: headers,
	    form: {user_id: '123' , weight: 123, metric: 'lbs'}
	}

	// Start the request
	request(options, function (error, response, body) {
	    if (!error && response.statusCode == 200) {
	        // Print out the response body
	        console.log(body)
	    } else {
	    	console.log(error)
	    }
	});
};