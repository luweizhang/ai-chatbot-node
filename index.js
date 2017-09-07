'use strict'
const express     = require('express')
const bodyParser  = require('body-parser')
const request     = require('request')
const pg 	      = require('pg'); //postgresql
const querystring = require('querystring');

const app         = express()

//config variables
const connectionString = process.env.DATABASE_URL //\ || 'postgres://localhost:5432/todo';

app.set('port', (process.env.PORT || 5000))
app.use(bodyParser.urlencoded({extended: false}))

// parse application/json
app.use(bodyParser.json())

//index
app.get('/', function (req, res) {
	res.send('566348112')
})

/* you will need this to setup a webhook with the facebook api */
app.get("/webhook", function (req, res) {
  if (req.query["hub.verify_token"] === "penguin") {
    console.log("Verified webhook");
    res.status(200).send(req.query["hub.challenge"]);
  } else {
    console.error("Verification failed. The tokens do not match.");
    res.sendStatus(403);
  }
});

// to post data
app.post('/webhook/', function (req, res) {
	let messaging_events = req.body.entry[0].messaging
	for (let i = 0; i < messaging_events.length; i++) {
		let event = req.body.entry[0].messaging[i]
		let sender = event.sender.id
		if (event.message && event.message.text) {
			let message = event.message.text
			messageHandler(sender, message)
		}
		if (event.postback) {
			let text = JSON.stringify(event.postback)
			sendTextMessage(sender, "Postback received: " +text.substring(0, 200), token)
			continue
		}
	}
	res.sendStatus(200)
})



const token = process.env.token
function sendTextMessage(sender, text) {
	let messageData = { text:text }
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

function sendGenericMessage(sender) {
	let messageData = {
		"attachment": {
			"type": "template",
			"payload": {
				"template_type": "generic",
				"elements": [{
					"title": "First card",
					"subtitle": "Element #1 of an hscroll",
					"image_url": "http://messengerdemo.parseapp.com/img/rift.png",
					"buttons": [{
						"type": "web_url",
						"url": "https://www.messenger.com",
						"title": "web url"
					}, {
						"type": "postback",
						"title": "Postback",
						"payload": "Payload for first element in a generic bubble",
					}],
				}, {
					"title": "Second card",
					"subtitle": "Element #2 of an hscroll",
					"image_url": "http://messengerdemo.parseapp.com/img/gearvr.png",
					"buttons": [{
						"type": "postback",
						"title": "Postback",
						"payload": "Payload for second element in a generic bubble",
					}],
				}]
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
}

function messageHandler(sender, message) {
	/*
	Determine how to handle the message
	*/
	let splitmessage = message.toLowerCase().split(' ');

	if (splitmessage.includes('weight') || splitmessage.includes('pounds')) {
		weightTrackingHandler(sender, message)
	} 

	else if ((splitmessage.includes('i') && splitmessage.includes('did')) || splitmessage.includes('task:') || (splitmessage[0] == 'today' && splitmessage[1] == 'i')){
		taskTrackingHandler(sender, message)
	}

	else if (splitmessage.includes('feeling') || splitmessage.includes('mood') || splitmessage.includes('feel') ) {
		moodTrackingHandler(sender, message)
	}

	else if (splitmessage.includes('hi') || splitmessage.includes('hello') || splitmessage.includes('hey')) {
		greetingHandler(sender, message)
	}

	else if (splitmessage.includes('help') || splitmessage.includes('tip') || splitmessage.includes('tips')) {
		helpHandler(sender, message)
	}

	else if (splitmessage.includes('generic')) {
		genericMessageHandler(sender, message)
	}

	else {
		let response = lookForResponse(sender, message.toLowerCase())

	};
}

function genericMessageHandler(sender, message) {
	console.log("welcome to chatbot")
  	sendGenericMessage(sender)
}

function weightTrackingHandler(sender, message) {
	let weight = numberParser(message)
	if (weight == null) {
		sendTextMessage(sender, "Please enter a weight, i.e my weight is X")
		return
	}
	sendTextMessage(sender, "Got it! Your weight for today has been recorded as: " + String(weight))
	dbStoreWeight(sender, weight);
}

function moodTrackingHandler(sender, message) {
	/*
	Test cases:

	I am feeling very good: Got it! Your mood for today is 10/10
	I am feeling good: 8/10
	I am feeling bad: 3/10
	I am feeling very bad: 1/10
	
	I am feeling like a 7: Got it! Your mood for today is a 7/10
	*/

	let mood = parseInt(numberParser(message));
	if (mood == null) {
		sendTextMessage(sender, "Please enter a mood number between 0 and 10, i.e my mood is X out of 10")
		return
	}

	let message_end
	if (mood >= 0 && mood <= 4) {
		message_end = "I hope you feel better soon!"
	} else if (mood > 4 && mood <= 7) {
		message_end = ""
	} else if (mood > 7 && mood <= 10) {
		message_end = "I'm glad you are feeling great today!"
	} else {
		sendTextMessage(sender, "Please enter a mood number between 0 and 10, i.e my mood is X out of 10")
		return
	}
	sendTextMessage(sender, "Got it, we have recorded your mood as: " + String(mood) + ". " + message_end)
	dbStoreMood(sender, mood);
}

function taskTrackingHandler(sender, message) {
	sendTextMessage(sender, "Got it! Your accomplishment for today has been recorded")
	dbStoreTask(sender, message);
}

function greetingHandler(sender, message) {
	let possible_responses = ["Hello!","Greetings!","Hi!","Hola!","Hey!","Bonjour!"];
	let random_index = Math.floor(Math.random()*(possible_responses.length));
	let mymessage = possible_responses[random_index];
	sendTextMessage(sender, mymessage);	
}

function helpHandler(sender, message) {
	let possible_responses = [
	"Type \"My weight is X \" to record your weight for today",
	"Type \"My mood is X out of 10, to record your mood for today",
	"Type \" I did X\" or \"task: X\" to record your accomplishments for today"
	];

	let random_index = Math.floor(Math.random()*(possible_responses.length));
	let mymessage = possible_responses[random_index];
	sendTextMessage(sender, "Heres a tip: " + mymessage);	
}

app.listen(app.get('port'), function() {
	console.log('running on port', app.get('port'))
})


//db request functions
function dbStoreWeight(sender, weight) {
	console.log("attempting to post weight")	
	  const data = {user_id: sender , weight: weight, metric: 'lbs'};
	  console.log(data);
	  // Get a Postgres client from the connection pool
	  pg.connect(connectionString, (err, client, done) => {
	    // Handle connection errors
	    if(err) {
	      done();
	      console.log(err);
	      return {success: false, data: err};
	    }
	    // SQL Query > Insert Data
	    client.query('INSERT INTO weight (user_id, weight, metric, message_time) values($1, $2, $3, current_timestamp);',
	    [data.user_id, data.weight, data.metric]);
		done();
		return {success: true,message: 'inserted weight record'}
	  });
};

function dbStoreMood(sender, mood) {
	console.log("attempting to post mood")	
	  const data = {user_id: sender , mood: mood};
	  console.log(data);
	  // Get a Postgres client from the connection pool
	  pg.connect(connectionString, (err, client, done) => {
	    // Handle connection errors
	    if(err) {
	      done();
	      console.log(err);
	      return {success: false, data: err};
	    }
	    // SQL Query > Insert Data
	    client.query('INSERT INTO mood (user_id, mood, message_time) VALUES($1, $2, current_timestamp);',
	    [data.user_id, data.mood]);
		done();
		return {success: true,message: 'inserted mood record'}
	  });
};

function dbStoreTask(sender, accomp) {
	console.log("attempting to post accomplishment")	
	  const data = {user_id: sender , accomp: accomp};
	  console.log(data);
	  // Get a Postgres client from the connection pool
	  pg.connect(connectionString, (err, client, done) => {
	    // Handle connection errors
	    if(err) {
	      done();
	      console.log(err);
	      return {success: false, data: err};
	    }
	    // SQL Query > Insert Data
	    client.query('INSERT INTO accomplishment (user_id, accomplishment, message_time) VALUES($1, $2, current_timestamp);',
	    [data.user_id, data.accomp]);
		done();
		return {success: true,message: 'inserted accomplishment record'}
	  });
};

function lookForResponse(sender, message) {
	const results = [];
	pg.connect(connectionString, function(err, client, done) {
    const query = client.query('SELECT response FROM responses WHERE message = $1;',[message]);
    // Stream results back one row at a time
    query.on('row', (row) => {
      results.push(row);
    });
    // After all data is returned, close connection and return results
    query.on('end', () => {
		done();
		console.log(results)
  		if (results.length > 0) {
			let random_index = Math.floor(Math.random()*(results.length));
			let mymessage = results[random_index];
			sendTextMessage(sender, mymessage.response);
		} else {
	    //sendTextMessage(sender, "Sorry, I could not understand what you were saying...");
	    sendTextMessage(sender, "Note: Please type \"help\" to learn how to interact with me!");
		}
    });
  	});
}

function numberParser(message) {
	let numberPattern = /\d+/g;
	let messageMatch = message.match( numberPattern )
	if (messageMatch == null) {
		return null
	} else {
		return messageMatch[0]
	}
	
}

/* immediate todo list
-- Add postgresql conection
-- submit app for review 
*/


/*
More features to add in the future:

-- Ask some introductory question to learn about the user and collect some initial data
-- After facebook authentication, data mine the user!
-- connect to wit ai
-- postgresql connection

-- create a web portal to display all the analytics that have been gathered, 
-- or dynamically generate an html page with the graph that is needed

-- in addition to the web portal, also send vizualizations through the chat itself.  For example, after recording the weight, 
-- display a graph of the weight fluctuations over the last two months.

-- connect to wit ai to do general NLP (don't need to do all the work myself)



*/

/* future vision
-- After learning about the user, serve ads and do affiliate marketing.


*/

/*
Other ideas, detect your mood.

-- need some sort of ability to record the message context,
 to enable more complex complex conversations
 for example -> "how are you?" -> good, and you? -> good! -> "thats good to hear!"

 occasionally, ai buddy will ask you some question to learn more about you! 
 it will use this information for your benefit.
*/



