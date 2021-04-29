const express = require('express')
const router = express.Router()

const getDatabase = require('../database.js')
const db = getDatabase()

const { makeArray } = require('./func.js');

// GET /matchWinners/:id
//http://localhost:1357//matchWinners/:id
router.get('/:id', async (req, res) => {
	const matchesRef = db.collection('matches');
	let allMatches

	try {
		const snapShot = await matchesRef.where('winnerId', '==', req.params.id).get();

		allMatches = makeArray(snapShot, res)

		res.status(200).send(allMatches);
	} catch (error) {
		res.status(500).send(error.message)
	}
});

module.exports = router
