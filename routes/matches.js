const express = require('express')
const router = express.Router()

const getDatabase = require('../database.js')
const db = getDatabase()

const { makeArray } = require('./func.js');

// GET /matches
//http://localhost:1357/matches

router.get('/', async (req, res) => {
	const matchesRef = db.collection('matches')
	let allMatches

	try {
		const snapShot = await matchesRef.get()
		allMatches = makeArray(snapShot)

		res.status(200).send(allMatches);
	} catch (error) {
		res.status(500).send(error.message)
	}
});


// GET /matches/:id
//http://localhost:1357/matches
router.get('/:id', async (req, res) => {
    const id = req.params.id;

	try {
		const matchRef = await db.collection('matches').doc(id).get();

		if(!matchRef.exists) {
	        res.status(404).send(`Match with id: "${id}" does not exist`)
	        return
	    }

		const data = matchRef.data();
		data.id = matchRef.id

	    res.status(200).send(data);
	} catch (error) {
		res.status(500).send(error.message)
	}
});

// POST /matches
//http://localhost:1357/matches
router.post('/', async (req, res) => {
	const object = req.body;

	try {
		if(!object || !object.winnerId || !object.loserId) {
			res.status(400).send('Ops! Wrong object structur');
			return
		}

		const matchRef = await db.collection('matches').add(object);

		objectId = { id: matchRef.id }

		res.status(200).send(objectId);
	} catch (error) {
		res.status(500).send(error.message)
	}
});

// DELETE //matches/:id
//http://localhost:1357/matches
router.delete('/:id', async (req, res) => {
	const id = req.params.id

	try {
		const matchIdRef = await db.collection('matches').doc(id).get();

		if (!id) {
			res.status(404).send('Is not a id')
			return
		} else if(!matchIdRef.exists) {
	        res.status(404).send(`Match with id: "${id}" does not exist`)
	        return
	    }

	 	await db.collection('matches').doc(id).delete()
		res.status(200).send(`Match with id: "${id}" is removed`)
	} catch (error) {
		res.status(500).send(error.message)
	}
});

module.exports = router
