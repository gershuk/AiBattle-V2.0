import { useUnit } from 'effector-react'
import { GameController, ViewPortGame } from 'features/game-controller'
import { createPanelSizeController } from 'libs'
import { SplitPanel } from 'ui'
import './styles.scss'

const { $sizes, setSizes } = createPanelSizeController(400)

export const Game = () => {
	const sizes = useUnit($sizes)
	const handlerDragEnd = (sizesPanel: number[]) => {
		setSizes([...sizesPanel])
		window.dispatchEvent(new Event('resize'))
	}

	return (
		<div class={'controller-editor'}>
			<SplitPanel
				onDragEnd={handlerDragEnd}
				className={'controller-editor-split'}
				sizes={sizes}
				gutterSize={5}
				minSize={0}
				Left={<GameController />}
				Right={<ViewPortGame />}
			/>
		</div>
	)
}
