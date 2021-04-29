const button = document.querySelector('#messageButton')

button.addEventListener('click', event => {
	console.log('Button clicked');

	fetch('http://localhost:1357/hamsters/random')
	.then(response => response.json())
	.then(data => {
	    console.log(data)
	})

	const messageElement = document.querySelector('.message')
	messageElement.innerHTML += `<br> Random hamster in console!`


})
