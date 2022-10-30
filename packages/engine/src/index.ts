import { repeatElement } from 'lib/array'

const btn = document.createElement('button')
btn.innerText = 'click'
btn.addEventListener('click', e => {
	const div = document.createElement('div')
	div.innerText = `${e.clientX},${e.clientY}`
	document.body.append(div)
})

document.body.append(btn)

console.log(repeatElement(1, 10))
