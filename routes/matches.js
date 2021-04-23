const express = require('express')
const router = express.Router()

const getDatabase = require('../database.js')
const db = getDatabase()

// GET /matches
router.get('/', async (req, res) => {
	const matchesRef = db.collection('matches')
	const snapShot = await matchesRef.get()

	console.log(1, snapShot.empty);

	if (snapShot.empty) {
		console.log(2, snapShot.empty);
		res.status(404).send('There are no hamsters here!')
		return;
	};

	let allMatches = [];
	snapShot.forEach( doc => {
		const data = doc.data();
		console.log(2.1, data);
		data.id = doc.id;
		allMatches.push(data);
	});
	console.log(3, allMatches);
	res.status(200).send(allMatches);
});

// GET /matches/:id
router.get('/:id', async (req, res) => {
    const id = req.params.id;
    const matchRef = await db.collection('matches').doc(id).get();
	const data = matchRef.data();
	data.id = matchRef.id

    if(!matchRef.exists) {
        res.status(404).send(`Match with id: "${id}" does not exist`)
        return
    }

    res.status(200).send(data);
})

// POST /matches
router.post('/', async (req, res) => {
	const object = req.body;

	if(!object || !object.winnerId || !object.loserId) {
		res.status(400).send('Ops! Wrong object structur');
		return
	}
	const matchRef = await db.collection('matches').add(object);
	res.status(200).send(matchRef.id);
});

// DELETE //matches/:id
router.delete('/:id', async (req, res) => {
})

module.exports = router
