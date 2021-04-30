// const button = document.querySelector('#messageButton')
//
// button.addEventListener('click', event => {
// 	console.log('Button clicked');
//
// 	fetch('http://localhost:1357/hamsters/random')
// 	.then(response => response.json())
// 	.then(data => {
// 	    console.log(data)
// 	})
//
// 	const messageElement = document.querySelector('.message')
// 	messageElement.innerHTML += `<br> Random hamster in console!`
//
//
// })


const button = document.querySelector('#randomButton')

button.addEventListener('click', event => {
 	const url = 'https://fue20-hamsterwars.herokuapp.com/hamsters/random';

	getData(url, showHamster);

	function getData(URL, callback) {
		fetch(URL)
		.then(response => response.json())
		.then(data => { callback(data); })
		.catch(error => console.log(error));
	}

function showHamster(hamsters) {
	const randomHamster = document.getElementById('hamster');

		removeAllChildNodes(randomHamster);

		const divTag = document.createElement('div');
		const h3Tag = document.createElement('h3');
		const imgTag = document.createElement('img');

		h3Tag.innerText = hamsters.name;
		imgTag.src = `../img/${hamsters.imgName}`;

		randomHamster.appendChild(divTag);
		divTag.appendChild(h3Tag);
		divTag.appendChild(imgTag);
	}

})

function removeAllChildNodes(parent) {
    while (parent.firstChild) {
        parent.removeChild(parent.firstChild);
    }
}
