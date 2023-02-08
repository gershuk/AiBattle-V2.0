import { useUnit } from 'effector-react'
import { clsx, deepCopyJson } from 'libs'
import { Spawn } from 'model'
import { Button } from 'ui'
import { $mode, setMode } from '../model'

export interface ListSpawnsProps {
	spawns: Spawn[]
	classNameWrapper?: string
	onChangeSpawn: (spawns: Spawn[]) => void
}

export const ListSpawns = ({
	spawns,
	classNameWrapper,
	onChangeSpawn,
}: ListSpawnsProps) => {
	const mode = useUnit($mode)

	const onAddSpawnHandler = () => {
		setMode(mode !== 'add-spawn' ? 'add-spawn' : 'none')
	}

	const onRemoveSpawnHandler = (index: number) => {
		const newSpawns = spawns.filter((_, i) => i !== index)
		onChangeSpawn(newSpawns)
	}

	const activeSpawnMode = mode === 'add-spawn'

	return (
		<div className={clsx(classNameWrapper, 'list-spawner-wrapper')}>
			<span className={'type-cell-title'}>Места спавнов:</span>
			<div className={'wrapper-spawn'}>
				{spawns.map(({ x, y }, i) => (
					<div className={'item-spawn'}>
						<div className={'item-spawn'}>
							<Button color="danger" onClick={() => onRemoveSpawnHandler(i)}>
								<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
									<path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
								</svg>
							</Button>
						</div>
						<div>
							x: {x}; y: {y}
						</div>
					</div>
				))}
			</div>
			<div className={'add-spawn-wrapper'}>
				<Button
					color={activeSpawnMode ? 'danger' : 'primary'}
					onClick={onAddSpawnHandler}
				>
					+
				</Button>
				{activeSpawnMode ? <span>Укажите точку спавна на карте</span> : null}
			</div>
		</div>
	)
}
