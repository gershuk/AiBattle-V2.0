import { useUnit } from 'effector-react'
import { ReplayList } from 'features/replays-list/list'
import { useMemo } from 'preact/hooks'
import { Button, SplitPanel } from 'ui'
import { $selectReplay, selectedReplay } from './model'
import './styles.scss'

export const Replays = () => {
	const selectReplay = useUnit($selectReplay)
	const sizes = useMemo(() => {
		const width = window.innerWidth
		const r = (300 / width) * 100
		return [r, 100 - r]
	}, [])
	const handlerDragEnd = () => {
		window.dispatchEvent(new Event('resize'))
	}

	return (
		<div class={'replays'}>
			<SplitPanel
				onDragEnd={handlerDragEnd}
				className={'replays-split'}
				sizes={sizes}
				gutterSize={5}
				minSize={0}
				Left={
					<div className={'controller-replays-wrapper'}>
						<ReplayList
							ontToggleSelect={selectedReplay}
							active={selectReplay?.name}
						/>
						<div className={'replays-start-wrapper'}>
							<Button disabled={!selectReplay}>Запустить</Button>
						</div>
					</div>
				}
				Right={null}
			/>
		</div>
	)
}
