import { GameController } from 'features/game-controller'
import { useMemo } from 'preact/hooks'
import { SplitPanel } from 'ui'

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
				Right={null}
			/>
		</div>
	)
}
