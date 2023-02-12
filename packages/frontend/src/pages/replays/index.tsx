import { useUnit } from 'effector-react'
import { ReplayController } from 'features/replay-contoller'
import { ReplayList } from 'features/replays-list/list'
import { createPanelSizeController } from 'libs'
import { Button, SplitPanel } from 'ui'
import {
	$selectReplay,
	$startGame,
	selectedReplay,
	setStartReplay,
} from './model'
import './styles.scss'

const { $sizes, setSizes } = createPanelSizeController(200)

export const Replays = () => {
	const { selectReplay, startGame, sizes } = useUnit({
		selectReplay: $selectReplay,
		startGame: $startGame,
		sizes: $sizes,
	})

	const handlerDragEnd = (sizesPanel: number[]) => {
		setSizes([...sizesPanel])
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
						{!startGame ? (
							<>
								<ReplayList
									ontToggleSelect={selectedReplay}
									active={selectReplay?.name}
								/>
								<div className={'replays-start-wrapper'}>
									<Button
										onClick={() => setStartReplay(true)}
										disabled={!selectReplay}
									>
										Запустить
									</Button>
								</div>
							</>
						) : (
							<>
								<ReplayController replay={selectReplay!} />
								<div className={'replays-start-wrapper'}>
									<Button color="danger" onClick={() => setStartReplay(false)}>
										Отменить
									</Button>
								</div>
							</>
						)}
					</div>
				}
				Right={null}
			/>
		</div>
	)
}
