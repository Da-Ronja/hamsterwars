express = require('express')
const router = express.Router()

const getDatabase = require('../database.js')
const db = getDatabase()

const { makeArray } = require('./func.js');

// GET /winners
router.get('/', async (req, res) => {
   const getHamsters = db.collection('hamsters');
   let winnerHamsters
   try {
	   const snapShot = await getHamsters.orderBy('wins', 'desc').limit(5).get();
	   winnerHamsters = makeArray(snapShot)

	   res.status(200).send(winnerHamsters);
	} catch (error) {
		res.status(500).send(error.message)
	}
});


module.exports = router;
