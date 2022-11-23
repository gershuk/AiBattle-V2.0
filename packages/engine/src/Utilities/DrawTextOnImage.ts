export function DrawOverlay(canvas: HTMLCanvasElement, img: HTMLImageElement) {
	const ctx = canvas.getContext('2d')
	ctx.drawImage(img, 0, 0)
	ctx.fillStyle = 'rgba(30, 144, 255, 0.4)'
	ctx.fillRect(0, 0, canvas.width, canvas.height)
}

export function DrawText(canvas: HTMLCanvasElement, text: string) {
	const ctx = canvas.getContext('2d')
	ctx.fillStyle = 'white'
	ctx.textBaseline = 'middle'
	ctx.font = "50px 'Montserrat'"
	ctx.fillText(text, 50, 50)
}

export function convertToImage(canvas: HTMLCanvasElement) {
	window.open(canvas.toDataURL('png'))
}
