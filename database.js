const admin = require("firebase-admin");

//const serviceAccount = require("./firebase-hamsterwars-key.json");
//serviceAccount ändras för HEROKU
let serviceAccount;

if( process.env.PRIVATE_KEY ){
	serviceAccount = JSON.parse( process.env.PRIVATE_KEY )
} else {
	serviceAccount = require("./firebase-hamsterwars-key.json")
}

admin.initializeApp({
	credential: admin.credential.cert(serviceAccount)
});


function getDatabase() {
	return admin.firestore();
}

module.exports = getDatabase
