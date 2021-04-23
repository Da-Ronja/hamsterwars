const express = require('express')
const router = express.Router()

const getDatabase = require('../database.js')
const db = getDatabase()


// GET all hamsters
router.get('/', async (req, res) => {
	const hamstersRef = db.collection('hamster');
	const snapShot = await hamstersRef.get();

	if (snapShot.empty) {
		res.status(404).send('There are no hamsters here!')
		return;
	};

	let allHamsters = [];
	snapShot.forEach( doc => {
		const data = doc.data();
		data.id = doc.id;
		allHamsters.push(data);
	});
	res.status(200).send(allHamsters);
});

//GET random hamsters /hamsters/random
router.get('/random', async (req, res) => {
	const hamstersRef = db.collection('hamster')
	const snapshot = await hamstersRef.get()

	if (snapshot.empty) {
		res.send([])
		return
	}

	let items = []
	snapshot.forEach(doc => {
		const data = doc.data()
		data.id = doc.id; //få med Id från firestore
		items.push(data)
	});
	let randomIndex = Math.floor(Math.random() * items.length);

	res.status(200).send(items[randomIndex])
})

//GET hamsters with ID  /hamsters/:id
router.get('/:id', async (req, res) => {
    const id = req.params.id;
    const hamsterIdRef = await db.collection('hamster').doc(id).get();
	const data = hamsterIdRef.data();
	data.id = hamsterIdRef.id

    if(!hamsterIdRef.exists) {
        res.status(404).send(`Hamster with id: "${id}" does not exist`)
        return
    }



    res.send(data);
})

//POST /hamsters
router.post('/', async (req, res) => {
    const object = req.body

    if( isHamstersObject(object)) {
        res.sendStatus(400)
        return
    }

    const hamsterRef = await db.collection('hamster').add(object)
    res.send(hamsterRef.id)
})

//PUT /hamsters/:id
router.put('/:id', async (req, res) => {
	const object = req.body; //new
	const id = req.params.id;
    const hamsterIdRef = await db.collection('hamster').doc(id).get();
	const data = hamsterIdRef.data();

	if (!object || !id) {
		res.sendStatus(400);
		return;
	} else if(!hamsterIdRef.exists) {
        res.status(404).send(`Hamster with id: "${id}" does not exist`)
        return
    }
		//for (const property in object) {
		//	console.log(`2.1, ${property}:, 2.3, ${object[property]}`);
		//}
		//for (const property in data) {
		//	console.log(`3.1, ${property}:, 3.3, ${data[property]}`);
		//}
		//console.log(2.2, object)
		//console.log(3.1, data);

		//const data = hamsterIdRef.data();
		//let keys = Object.keys(object)

		//keys.map(x=>{
		//	data[x] =  object[x]
		//})

	const hamsterRef = db.collection('hamster').doc(id);
	await hamsterRef.set(object, { merge: true });
	res.sendStatus(200);

});



//DELETE /hamsters/:id
router.delete('/:id', async (req, res) => {
	const id = req.params.id
	const hamsterIdRef = await db.collection('hamster').doc(id).get();

	if( !id ) {
		res.sendStatus(400)
		return
	} else if(!hamsterIdRef.exists) {
        res.status(404).send(`Hamster with id: "${id}" does not exist`)
        return
    }

	await db.collection('hamster').doc(id).delete()
	res.sendStatus(200)
})

//Functions
function isHamstersObject(maybeObject) {
	if (!maybeObject) {
		return false;
	} else if (!maybeObject.name || !maybeObject.age || !maybeObject.favFood || !maybeObject.loves || !maybeObject.imgName) {
		return false;
	} else if (!maybeObject.wins || !maybeObject.defeats || !maybeObject.games) {
		return false;
	}
		return true;
}

module.exports = router
