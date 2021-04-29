function makeArray(input, res) {
	let items = []

	if (input.empty) {
        res.status(404).send('It is empty!');
        return;
    };

	input.forEach(doc => {
		const data = doc.data()
		data.id = doc.id
		items.push( data )
	})
	console.log("make array", items);
	return items
}


function isASting(x) {
    return (typeof x) == 'string';
};

function isPositiveNumber(x) {
    return (typeof x) == 'number' && x >= 0;
}

function isHamstersObject(maybeObject) {
    if (!maybeObject) {
        return false;
    }
    else if (!maybeObject.name || !maybeObject.favFood || !maybeObject.loves || !maybeObject.imgName) {
        return false;
    }
    else if ( !isPositiveNumber(maybeObject.wins) || !isPositiveNumber(maybeObject.defeats) || !isPositiveNumber(maybeObject.games) || !isPositiveNumber(maybeObject.age)) {
        return false;
    }
    return true;
}

function checkInput(obj) {
	for (const prop in obj) {
		if (
			prop === "name" || prop === "age" ||
			prop === "favFood" || prop === "loves" ||
			prop === "imgName" || prop === "wins" ||
			prop === "defeats" || prop === "games"
		) {
			continue
		} else {
			return false;
		}
	}

	for (const prop in obj) {
		if (prop === "name" && !isASting(obj[prop])) {
			return false;
		} else if (prop === "age" && !isPositiveNumber(obj[prop])) {
			return false;
		} else if (prop === "favFood" && !isASting(obj[prop])) {
			return false;
		} else if (prop === "loves" && !isASting(obj[prop])) {
			return false;
		} else if (prop === "imgName" && !isASting(obj[prop])) {
			return false;
		} else if (prop === "wins" && !isPositiveNumber(obj[prop])) {
			return false;
		} else if (prop === "defeats" && !isPositiveNumber(obj[prop])) {
			return false;
		} else if (prop === "games"  && !isPositiveNumber(obj[prop])) {
			return false;
		} else {
			continue
		}
	}
	return true;
}

module.exports = {
	makeArray,
	isHamstersObject,
	isASting,
	isPositiveNumber,
	checkInput
}
