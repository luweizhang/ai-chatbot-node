var numberPattern = /\d+/g;
console.log('I am 128 pounds'.match( numberPattern )[0]);


function weightParser(message) {
	let numberPattern = /\d+/g;
	return message.match( numberPattern )[0]
}