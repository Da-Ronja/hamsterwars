const express = require('express')
const router = express.Router()

const getDatabase = require('../database.js')
const db = getDatabase()

const { makeArray,
	isHamstersObject,
	isASting,
	isPositiveNumber,
	checkInput
} = require('./func.js');

// GET all hamsters
//http://localhost:1357/hamsters
router.get('/', async (req, res) => {
    const hamstersRef = db.collection('hamsters');
	let allHamsters

	try {
		const snapShot = await hamstersRef.get();
		allHamsters = makeArray(snapShot)

		res.status(200).send(allHamsters);
	} catch (error) {
		res.status(500).send(error.message)
	}
});

//GET random hamsters
//http://localhost:1357/hamsters/random
router.get('/random', async (req, res) => {
    const hamstersRef = db.collection('hamsters')
    let items = []

    try {
        const snapshot = await hamstersRef.get()
        if (snapshot.empty) {
            res.status(404).send('There are no hamsters here!');
            return
        }

        snapshot.forEach(doc => {
            const data = doc.data()
            data.id = doc.id;
            items.push(data)
        });

        let randomIndex = Math.floor(Math.random() * items.length);
        res.status(200).send(items[randomIndex]);
    }
    catch (error) {
        res.status(500).send(error.message)
    }
});


//GET hamsters by ID
//http://localhost:1357/hamsters/2w4gtJCakWDndyqXi7wI
router.get('/:id', async (req, res) => {
    const id = req.params.id;
    const hamsterIdRef = db.collection('hamsters').doc(id)

	try {
	    const hamsterRef = await hamsterIdRef.get()

	    if(!hamsterRef.exists) {
	        res.status(404).send('Hamster does not exist');
	        return
	    };

	    const data = hamsterRef.data();
	    data.id = hamsterRef.id

	    res.status(200).send(data);
	} catch (error) {
		res.status(500).send(error.message)
	}
});

//POST create new hamster
//http://localhost:1357/hamsters
router.post('/', async (req, res) => {
    const object = req.body;

	try {
	    if( !isHamstersObject(object)) {
	        res.status(400).send("Wrong structure on the object")
	        return
	    };

	    const hamsterRef = await db.collection('hamsters').add(object);
		objectId = { id: hamsterRef.id }

	    res.status(200).send(objectId);
	} catch (error) {
		res.status(500).send(error.message)
	}
});

//PUT change or add
//http://localhost:1357/hamsters/2w4gtJCakWDndyqXi7wI
router.put("/:id", async (req, res) => {
    const object = req.body;
    const id = req.params.id;
    const hamsterRef = db.collection("hamsters");

	try {
	    const snapshot = await hamsterRef.get();

	    let hamsterId = false;
	    snapshot.forEach((doc) => {
		    if (id === doc.id) {
		        hamsterId = true;
		    }
	    });

		if (!Object.keys(object).length) {
					res.sendStatus(400)
					return
		} else if (!checkInput(object)) {
	        res.status(400).send("Wrong structure on the object");
	        return;
	    }
	    else if (!hamsterId) {
	        res.status(404).send("There is no hamster with that id.");
	        return;
	    }

	    await db.collection("hamsters").doc(id).set(object, { merge: true });
	    res.send("Hamster changed.");
	} catch (error) {
		res.status(500).send(error.message)
	}
});


//DELETE by id
//http://localhost:1357/hamsters/2w4gtJCakWDndyqXi7wI
router.delete('/:id', async (req, res) => {
    const id = req.params.id

	try {
	    const hamsterIdRef = await db.collection('hamsters').doc(id).get();

	    if( !id ) {
	        res.sendStatus(400)
	        return;
	    }
	    else if ( !hamsterIdRef.exists ) {
	        res.status(404).send('Hamster does not exist')
	        return;
	    };

	    await db.collection('hamsters').doc(id).delete()
	    res.sendStatus(200);
	} catch (error) {
		res.status(500).send(error.message)
	}
});

module.exports = router
