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
    const object =  req.body

	console.log(1.1, object);

    if( !isHamstersObject(object)) {
		console.log(1.2, object);
        res.status(400).send("Wrong structure on the object")
        return
    };

	//Skapa en funktion som håller och lägger till (vinst, förlust och antal matcher)

	console.log(2.1, object);

    const hamsterRef = await db.collection('hamster').add(object);
	console.log(3.1, object);
    res.status(200).send(hamsterRef.id);
});

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
function isPositiveNumber(x) {
    return (typeof x) == 'number' && x >= 0;
};

function isASting(x) {
    return (typeof x) == 'string';
};

function isHamstersObject(obj) {
    console.log(1, obj)
    if (!obj) {
        console.log(2)
        return false;
    } else if (!isASting(obj.name) || !isASting(obj.favFood)) {
        console.log(3)
        return false;
    } else if (!isASting(obj.loves) || !isASting(obj.imgName)) {
        console.log(3)
        return false;
    } else if (!isPositiveNumber(obj.age) || !isPositiveNumber(obj.defeats)) {
        console.log(3)
        return false;
    } else if (!isPositiveNumber(obj.games) || !isPositiveNumber(obj.age)) {
        console.log(4)
        return false;
    }
    console.log(5, obj)
    return true;
}

function checkInput(obj) {
	console.log(obj);
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
		if (prop === "name" && !isASting(obj[prop])) {
			console.log(3);
			return false;
		} else if (prop === "age" && !isPositiveNumber(obj[prop])) {
			console.log(4);
			return false;
		} else if (prop === "favFood" && !isASting(obj[prop])) {
			console.log(5);
			return false;
		} else if (prop === "loves" && !isASting(obj[prop])) {
			console.log(6);
			return false;
		} else if (prop === "imgName" && !isASting(obj[prop])) {
			console.log(7);
			return false;
		} else if (prop === "wins" && !isPositiveNumber(obj[prop])) {
			console.log(8);
			return false;
		} else if (prop === "defeats" && !isPositiveNumber(obj[prop])) {
			console.log(9);
			return false;
		} else if (prop === "games"  && !isPositiveNumber(obj[prop])) {
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

module.exports = router


module.exports = router
