var numberPattern = /\d+/g;
console.log(numberPattern)
console.log('I am dfdfdf pounds'.match( numberPattern ));


function weightParser(message) {
	let numberPattern = /\d+/g;
	console.log( message.match( numberPattern ))
	//return message.match( numberPattern )[0]
}