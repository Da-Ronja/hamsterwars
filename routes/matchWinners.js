const express = require('express')
const router = express.Router()

const getDatabase = require('../database.js')
const db = getDatabase()

// GET /matchWinners/:id
router.get('/:id', async (req, res) => {
	const matchesRef = db.collection('matches')
	const snapshot = await matchesRef.where('winnerId', '==', req.params.id).get();
	let allMatches = [];

	//If  !object || !id
	 if (snapshot.empty) {
		res.status(404).send('There are no winners here!')
  		return;
	}

	snapshot.forEach(doc => {
		const data = doc.data();
		data.id = doc.id;
		allMatches.push(data);
	});
	res.status(200).send(allMatches);

});

module.exports = router
