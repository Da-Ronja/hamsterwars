function statusCode(status, code, el, msg) {
	if( status == code ) return true;
	el.innerHTML = msg
	return false
}

export const ev = {
	status200: (status, element) => statusCode(status, 200, element, 'Response status is not 200. (ok)'),
	status400: (status, element) => statusCode(status, 400, element, 'Response status is not 400. (bad request)'),
	status404: (status, element) => statusCode(status, 404, element, 'Response status is not 404. (not found)'),
	
	isArray: (body, element) => {
		if( Array.isArray(body) ) return true;
		element.innerHTML = 'Does not respond with an array.'
		return false
	},

	arrayHasData: (body, element) => {
		if( body.length >= 1 ) return true;
		element.innerHTML = 'Array does not have any data.'
		return false
	},

	isHamster: (object, element) => {
		// Test if object has certain properties
		if( object && ['name', 'age', 'favFood', 'loves', 'imgName', 'wins', 'defeats', 'games'].every(o => object.hasOwnProperty(o)) )
			return true
		element.innerHTML = 'Did not respond with a hamster object.'
		return false
	},

	objectHasId: (object, element) => {
		if( object && object.id )
			return true
		element.innerHTML = 'Must respond with an object that has an id property: { id: "id from database here" }'
		return false
	}
}
