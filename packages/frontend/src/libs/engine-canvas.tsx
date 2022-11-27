import { memo, useEffect, useRef } from 'react'
import { clsx } from './clsx'

export const CreateEngineCanvas = ({
	className,
	wrapperClassName,
}: {
	className?: string | string[]
	wrapperClassName?: string
}) => {
	const canvas = document.createElement('canvas')
	if (className) {
		;(Array.isArray(className) ? className : [className]).forEach(cls => {
			canvas.classList.add(cls)
		})
	}

	const CanvasComponent = memo(() => {
		const refContainer = useRef<HTMLDivElement | null>(null)
		useEffect(() => {
			if (refContainer.current) {
				refContainer.current.appendChild(canvas)
			}
		}, [])
		return (
			<div
				ref={refContainer}
				className={clsx('engine-canvas-wrapper', wrapperClassName)}
			></div>
		)
	})

	return { canvas, CanvasComponent }
}
