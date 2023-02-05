import { clsx, deepCopyJson } from 'libs'
import { Spawn } from 'model'
import { Button, InputNumber } from 'ui'

export interface ListSpawnsProps {
	spawns: Spawn[]
	classNameWrapper?: string
	onChangeSpawn: (spawns: Spawn[], type: 'add' | 'remove' | 'change') => void
}

export const ListSpawns = ({
	spawns,
	classNameWrapper,
	onChangeSpawn,
}: ListSpawnsProps) => {
	const onAddSpawnHandler = () => {
		const newSpawns = [...spawns, { x: 1, y: 1 }]
		onChangeSpawn(newSpawns, 'add')
	}
	const onChangeXSpawnHandler = (index: number, newX: number) => {
		const newSpawns = deepCopyJson(spawns)
		newSpawns[index].x = newX
		onChangeSpawn(newSpawns, 'change')
	}
	const onChangeYSpawnHandler = (index: number, newY: number) => {
		const newSpawns = deepCopyJson(spawns)
		newSpawns[index].y = newY
		onChangeSpawn(newSpawns, 'change')
	}
	const onRemoveSpawnHandler = (index: number) => {
		const newSpawns = spawns.filter((_, i) => i !== index)
		onChangeSpawn(newSpawns, 'remove')
	}

	return (
		<div className={clsx(classNameWrapper, 'list-spawner-wrapper')}>
			<span className={'type-cell-title'}>Места спавнов:</span>
			<div className={'wrapper-spawn'}>
				{spawns.map(({ x, y }, i) => (
					<div className={'item-spawn'}>
						<div className={'item-spawn'}>
							<Button>
								<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
									<path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
								</svg>
							</Button>
							<Button color="danger">
								<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
									<path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
								</svg>
							</Button>
						</div>
						<div>
							<div>
								<span>x:</span>{' '}
								<InputNumber
									value={x}
									onChange={value => onChangeXSpawnHandler(i, value ?? 0)}
								/>
							</div>
							<div>
								<span>y:</span>{' '}
								<InputNumber
									value={y}
									onChange={value => onChangeYSpawnHandler(i, value ?? 0)}
								/>
							</div>
						</div>
					</div>
				))}
			</div>
			<div className={'add-spawn-wrapper'}>
				<Button onClick={onAddSpawnHandler}>+</Button>
			</div>
		</div>
	)
}
