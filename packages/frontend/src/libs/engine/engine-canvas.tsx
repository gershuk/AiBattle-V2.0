import { memo, useEffect, useRef } from 'react'
import { clsx } from 'libs/clsx'

export const createEngineCanvas = () => {
	const canvas = document.createElement('canvas')

	const CanvasComponent = memo(({ className }: { className?: string }) => {
		const refContainer = useRef<HTMLDivElement | null>(null)
		useEffect(() => {
			const resizeCanvas = () => {
				if (refContainer.current) {
					canvas.width = refContainer.current.clientWidth
					canvas.height = refContainer.current.clientHeight
				}
			}
			if (refContainer.current) {
				refContainer.current.appendChild(canvas)
				canvas.width = refContainer.current.clientWidth
				canvas.height = refContainer.current.clientHeight
				window.addEventListener('resize', resizeCanvas)
			}
			return () => {
				window.removeEventListener('resize', resizeCanvas)
			}
		}, [])
		return <div ref={refContainer} className={clsx(className)}></div>
	})

	return { canvas, CanvasComponent }
}
