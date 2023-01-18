import { GameController, ViewPortGame } from 'features/game-controller'
import { useMemo } from 'preact/hooks'
import { SplitPanel } from 'ui'
import './styles.scss'

export const Game = () => {
	const sizes = useMemo(() => {
		const width = window.innerWidth
		const r = (400 / width) * 100
		return [r, 100 - r]
	}, [])

	const handlerDragEnd = () => {
		window.dispatchEvent(new Event('resize'))
	}

	return (
		<div class={'controller-editor'}>
			<SplitPanel
				onDragEnd={handlerDragEnd}
				className={'controller-editor-split'}
				sizes={sizes}
				gutterSize={3}
				minSize={0}
				Left={<GameController />}
				Right={<ViewPortGame />}
			/>
		</div>
	)
}
