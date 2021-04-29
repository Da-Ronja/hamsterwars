const express = require('express')
const router = express.Router()

const getDatabase = require('../database.js')
const db = getDatabase()

const { makeArray } = require('./func.js');

// GET /losers
//http://localhost:1357/losers

router.get('/', async (req, res) => {
	const getHamsters = db.collection('hamsters');
	let loserHamster

	try {
		const snapShot = await getHamsters.orderBy('defeats', 'desc').limit(5).get();
		loserHamster = makeArray(snapShot)

		res.status(200).send(loserHamster);
	} catch (error) {
		res.status(500).send(error.message)
	}
});

module.exports = router;
