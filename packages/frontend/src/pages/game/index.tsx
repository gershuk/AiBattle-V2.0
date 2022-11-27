import {
	GameEngine,
	GameEngineParameters,
	SceneParameters,
} from '@ai-battle/engine'
import { createStore } from 'effector'
import { GameController } from 'features/game-controller'
import { createEngineCanvas } from 'libs/engine-canvas'
import { useMemo } from 'preact/hooks'
import { SplitPanel } from 'ui'
import './styles.scss'

export const Game = () => {
	const sizes = useMemo(() => {
		const width = window.innerWidth
		const r = (400 / width) * 100
		return [r, 100 - r]
	}, [])
	return (
		<div class={'controller-editor'}>
			<SplitPanel
				className={'controller-editor-split'}
				sizes={sizes}
				gutterSize={3}
				minSize={0}
				Left={<GameController />}
				Right={<GameMap />}
			/>
		</div>
	)
}

const GameMap = () => {
	return <CanvasComponent />
}

const { canvas, CanvasComponent } = createEngineCanvas({
	className: 'canvas-game',
	wrapperClassName: 'canvas-game-wrapper',
})

const engine = new GameEngine(
	new GameEngineParameters(new SceneParameters(10, 10, 10, 120, canvas))
)
const $engine = createStore(engine)
$engine.watch(engine => console.log('engine', engine))
