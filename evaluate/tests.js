const ev = (await import('./evaluators.js')).ev

const defaultEvaluator = {
	method: 'GET',
	title: '/hamsters',
	resource: () => '/hamsters',
	body: () => null
}

// Test för varje resurs i uppgiften
export const tests = (addEvaluator, data) => [
	addEvaluator({
		...defaultEvaluator,
		checkResponse: (statusCode, body, messageElement) => {
			data.hamsters = body  // all objects in collection
			return ev.status200(statusCode, messageElement)
				&& ev.isArray(body, messageElement)
				&& ev.arrayHasData(body, messageElement)
			// check if contents ok
		}
	}),

	addEvaluator({
		...defaultEvaluator,
		method: 'POST',
		title: '/hamsters/  { add new hamster }',
		body: getNewObject,
		checkResponse: (statusCode, body, messageElement) => {
			data.newId = body && body.id
			// console.log('tests.js POST data=', data);
			return ev.status200(statusCode, messageElement)
				&& ev.objectHasId(body, messageElement)
		}
	}),

	addEvaluator({
		...defaultEvaluator,
		title: '/hamsters/:id',
		resource: () => ('/hamsters/' + data.newId),
		checkResponse: (statusCode, body, messageElement) => {
			return ev.status200(statusCode, messageElement)
				&& ev.isHamster(body, messageElement)
		}
	}),
	addEvaluator({
		...defaultEvaluator,
		title: '/hamsters/random',
		resource: () => ('/hamsters/random'),
		checkResponse: (statusCode, body, messageElement) => {
			return ev.status200(statusCode, messageElement)
				&& ev.isHamster(body, messageElement)
		}
	}),

	addEvaluator({
		...defaultEvaluator,
		method: 'PUT',
		title: '/hamsters/:id',
		resource: () => ('/hamsters/' + data.newId),
		body: getChangeObject,
		checkResponse: (statusCode, body, messageElement) => {
			return ev.status200(statusCode, messageElement)
		}
	}),
	addEvaluator({
		...defaultEvaluator,
		method: 'PUT',
		title: '/hamsters/:id  (id that does not exist in db)',
		resource: () => ('/hamsters/id-does-not-exist'),
		body: getChangeObject,
		checkResponse: (statusCode, body, messageElement) => {
			return ev.status404(statusCode, messageElement)
		}
	}),
	addEvaluator({
		...defaultEvaluator,
		method: 'PUT',
		title: '/hamsters/:id  (no change object in body)',
		resource: () => ('/hamsters/:id'),
		body: () => ({}),  // cannot send NULL or "" because JSON.parse in Express can't handle it
		checkResponse: (statusCode, body, messageElement) => {
			return ev.status400(statusCode, messageElement)
		}
	}),

	addEvaluator({
		...defaultEvaluator,
		method: 'DELETE',
		title: '/hamsters/:id',
		resource: () => ('/hamsters/' + data.newId),
		checkResponse: (statusCode, body, messageElement) => {
			return ev.status200(statusCode, messageElement)
		}
	}),
	addEvaluator({
		...defaultEvaluator,
		title: '/hamsters/:id  (the removed hamster)',
		resource: () => ('/hamsters/' + data.newId),
		checkResponse: (statusCode, body, messageElement) => {
			return ev.status404(statusCode, messageElement)
		}
	}),
	addEvaluator({
		...defaultEvaluator,
		method: 'DELETE',
		title: '/hamsters/:id  (id that does not exist in db)',
		resource: () => ('/hamsters/id-does-not-exist'),
		checkResponse: (statusCode, body, messageElement) => {
			return ev.status404(statusCode, messageElement)
		}
	}),

]

function getNewObject() {
	return {
	   "name":"Banan",
	   "age":5,
	   "favFood":"morot",
	   "loves":"springa i hamsterhjulet",
	   "imgName":"hamster-2.jpg",
	   "wins":0,
	   "defeats":0,
	   "games":0
	}
}
function getChangeObject() {
	return { wins: 5, games: 8 }
}
