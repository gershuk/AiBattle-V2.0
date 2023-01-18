import { engine } from './model/game'
import './styles.scss'

const { CanvasComponent } = engine

export const ViewPortGame = () => {
	return <CanvasComponent className="awesome-canvas-game" />
}
