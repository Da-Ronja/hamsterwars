const express = require('express')
const router = express.Router()

const getDatabase = require('../database.js')
const db = getDatabase()


// GET all hamsters
router.get('/', async (req, res) => {
	const hamstersRef = db.collection('hamster');
	const snapShot = await hamstersRef.get();

	if (snapShot.empty) {
		res.status(404).send('There are no hamsters here!');
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
		res.status(404).send([], 'It is empty')
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
    const hamsterIdRef = db.collection('hamster').doc(id)
    const hamsterRef = await hamsterIdRef.get()

    if(!hamsterRef.exists) {
        res.status(404).send(`Hamster with id: "${id}" does not exist`);
        return
    };

    const data = hamsterRef.data();
    data.id = hamsterRef.id
    res.status(200).send(data);
})

//POST /hamsters
router.post('/', async (req, res) => {
    const object = req.body;

    if( !isHamstersObject(object)) {
        res.status(400).send("Wrong structure on the object")
        return
    };

    const hamsterRef = await db.collection('hamster').add(object);
    res.status(200).send(hamsterRef.id);
});

//Functions
function isHamstersObject(maybeObject) {
    console.log(1)
    if (!maybeObject) {
        console.log(2)
        return false;
    } else if (!maybeObject.name || !maybeObject.favFood || !maybeObject.loves || !maybeObject.imgName) {
        console.log(3)
        return false;
    } else if (!isPositiveNumber(maybeObject.wins) || !isPositiveNumber(maybeObject.defeats) || !isPositiveNumber(maybeObject.games) || !isPositiveNumber(maybeObject.age)) {
        console.log(4)
        return false;
    }
    console.log(5)
    return true;
}
function isPositiveNumber(x) {
    return (typeof x) == 'number' && x >= 0;
}

//PUT /hamsters/:id
router.put("/:id", async (req, res) => {
	const obj = req.body;
	const id = req.params.id;

	const hamsterRef = db.collection("hamster");
	const snapshot = await hamsterRef.get();

	let hamsterId = false;
	snapshot.forEach((doc) => {
		if (id === doc.id) {
			hamsterId = true;
		}
	});

	if (!checkInput(obj)) {
		res.status(400).send("Wrong object structure.");
		return;
	} else if (!hamsterId) {
		res.status(404).send(`Hamster with id: "${id}" does not exist`);
		return;
	}

	await db.collection("hamster").doc(id).set(obj, { merge: true });
	res.send("Hamster changed.");
});

function checkInput(obj) {
	for (const prop in obj) {
		if (
			prop === "name" || prop === "age" ||
			prop === "favFood" || prop === "loves" ||
			prop === "imgName" || prop === "wins" ||
			prop === "defeats" || prop === "games"
		) {
			console.log(1);
			continue
		} else {
			console.log(2);
			return false;
		}
	}

	for (const prop in obj) {
		if (prop === "name" && typeof obj[prop] !== "string") {
			console.log(3);
			return false;
		} else if (prop === "age" && typeof obj[prop] !== "number") {
			console.log(4);
			return false;
		} else if (prop === "favFood" && typeof obj[prop] !== "string") {
			console.log(5);
			return false;
		} else if (prop === "loves" && typeof obj[prop] !== "string") {
			console.log(6);
			return false;
		} else if (prop === "imgName" && typeof obj[prop] !== "string") {
			console.log(7);
			return false;
		} else if (prop === "wins" && typeof obj[prop] !== "number") {
			console.log(8);
			return false;
		} else if (prop === "defeats" && typeof obj[prop] !== "number") {
			console.log(9);
			return false;
		} else if (prop === "games" && typeof obj[prop] !== "number") {
			console.log(10);
			return false;
		} else {
			console.log(11);
			continue
		}
	}
	console.log(1);
	return true;
}

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

module.exports = router
