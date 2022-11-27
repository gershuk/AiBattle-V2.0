import { memo, useEffect, useRef } from 'react'
import { clsx } from 'libs/clsx'

export const createEngineCanvas = () => {
	const canvas = document.createElement('canvas')

	const CanvasComponent = memo(({ className }: { className?: string }) => {
		const refContainer = useRef<HTMLDivElement | null>(null)
		useEffect(() => {
			if (refContainer.current) {
				refContainer.current.appendChild(canvas)
			}
		}, [])
		return <div ref={refContainer} className={clsx(className)}></div>
	})

	return { canvas, CanvasComponent }
}
