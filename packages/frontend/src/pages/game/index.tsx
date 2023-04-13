import { useUnit } from 'effector-react'
import { GameController, ViewGame } from 'features/game-controller'
import { createPanelSizeController } from 'libs'
import { useEffect } from 'react'
import { SplitPanel } from 'ui'
import './styles.scss'
import { tutorialGameSetting } from './tutorials'

const { $sizes, setSizes } = createPanelSizeController(
	400,
	'horizontal',
	'page-game-setting'
)

export const GamePage = () => {
	const sizes = useUnit($sizes)
	const handlerDragEnd = (sizesPanel: number[]) => {
		setSizes([...sizesPanel])
		window.dispatchEvent(new Event('resize'))
	}

	useEffect(() => {
		tutorialGameSetting.start()
	}, [])

	return (
		<div class={'controller-editor'}>
			<SplitPanel
				onDragEnd={handlerDragEnd}
				className={'controller-editor-split'}
				sizes={sizes}
				gutterSize={5}
				minSize={0}
				Left={<GameController />}
				Right={<ViewGame />}
			/>
		</div>
	)
}
