import { useUnit } from 'effector-react'
import { clsx, createTranslation } from 'libs'
import { Spawn } from 'model'
import { Button, PlusIcon } from 'ui'
import { $mode, setMode } from '../../model'

const { useTranslation } = createTranslation({
	ru: {
		spawnList: 'Точки появления ботов:',
		addSpawn: 'Укажите точку появления ботов на карте',
	},
	en: {
		spawnList: 'Spawn list:',
		addSpawn: 'Specify a spawn point on the map',
	},
})
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
	const t = useTranslation()
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
			<span className={'type-cell-title'}>{t('spawnList')}</span>
			<div className={'wrapper-spawn'}>
				{spawns.map(({ x, y }, i) => (
					<div className={'item-spawn'}>
						<div className={'item-spawn'}>
							<Button color="danger" onClick={() => onRemoveSpawnHandler(i)}>
								<PlusIcon />
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
				{activeSpawnMode ? <span>{t('addSpawn')}</span> : null}
			</div>
		</div>
	)
}
