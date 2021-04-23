const qs = document.querySelector.bind(document)
const ce = document.createElement.bind(document)

const submission = qs('#submission')
const urlInput = qs('#submission > input')
const testAllButton = qs('#submission > button')

const status = { ok: '✔️', fail: '❌', inProgress: '⏳', notStarted: '❔' }

// Test för varje resurs i uppgiften
const testData = {}
const tests = (await import('./tests.js')).tests(addEvaluator, testData)



testAllButton.addEventListener('click', async () => {
	console.log('Running tests...');
	console.time('api-tests')
	// Need to run the tests after each other
	for( let i=0; i<tests.length; i++ ) {
		await tests[i]()
	}
	console.log('All tests done.');
	console.timeEnd('api-tests')

	// This would run the tests independently of each other
	// tests.forEach(async f => await f())
})


function addEvaluator(params) {
	const { method, title, resource: resourceFunction, body: bodyFunction, checkResponse } = params
	let div = ce('div'), code = ce('code'), span1 = ce('span'), span2 = ce('span'), span3 = ce('span')
	span1.innerHTML = status.notStarted
	span2.innerHTML = `${method} ${title}`
	span3.className = 'error-message'
	code.appendChild(span1)
	code.appendChild(span2)
	div.appendChild(code)
	div.appendChild(span3)
	submission.appendChild(div)

	// This function is called when the user clicks the button
	return async function() {
		// console.log('Evaluator started', span1.innerHTML);
		span1.innerHTML = status.inProgress
		try {
			const resource = urlInput.value + resourceFunction()
			const body = JSON.stringify( bodyFunction() )
			const hasRequestBody = (method != 'GET' && method != 'DELETE')
			const hasResponseBody = (method == 'GET' || method == 'POST')
			let response;
			let json;

			// if( method == 'POST' )
			// 	console.log(`script.js sending request: ${method} ${resource}`, body);
			if( hasRequestBody ) {
				response = await fetch(resource, { method, headers: { 'Content-Type': 'application/json' }, body })
			} else {
				response = await fetch(resource, { method })
			}

			const statusCode = response.status
			if( hasResponseBody && statusCode == '200' ) {
				json = await response.json()
			} else {
				json = null
			}
			// console.log('script.addEvaluator respond-json=', json, method, body, resource);

			if( checkResponse(statusCode, json, span3) ) {
				span1.innerHTML = status.ok
			} else {
				span1.innerHTML = status.fail
			}

		} catch(e) {
			console.error('Evaluator error: ', e.message)
			span1.innerHTML = status.fail
		}
	}
}

function isFunction(functionToCheck) {
	return functionToCheck && {}.toString.call(functionToCheck) === '[object Function]';
}
