import { useUnit } from 'effector-react'
import { useEffect } from 'preact/hooks'
import { $activeGame, engine } from '../model/game'
import './styles.scss'

const { CanvasComponent } = engine

export const ViewportGame = () => {
	const activeGame = useUnit($activeGame)

	useEffect(() => {
		if (activeGame) engine.methods.renderFrame()
	}, [activeGame])

	if (!activeGame) return null
	return (
		<div className={'viewport-game'}>
			<CanvasComponent className="awesome-canvas-game" />
		</div>
	)
}
