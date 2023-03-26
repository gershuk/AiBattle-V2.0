import { useUnit } from 'effector-react'
import { $codesData } from 'model'
import { useMemo } from 'preact/hooks'
import { DropDown, Input } from 'ui'
import { $activeGame, $selectedMap } from '../../model'
import './styles.scss'
import { createTranslation } from 'libs'

const colors = [
	'red',
	'black',
	'yellow',
	'grey',
	'green',
	'blue',
	'pink',
	'purple',
]

const { useTranslation } = createTranslation({
	ru: {
		configBot: 'Конфигурация ботов',
		botName: 'Имя бота',
	},
	en: {
		configBot: 'Bot configuration',
		botName: 'Bot name',
	},
})

export const BotsSetting = () => {
	const t = useTranslation()
	const { activeMap, codesData, startedGame } = useUnit({
		activeMap: $selectedMap,
		codesData: $codesData,
		startedGame: $activeGame,
	})

	const listCodes = useMemo(() => {
		return Object.values(codesData).map(({ name }) => ({
			id: name,
			text: name,
		}))
	}, [codesData])

	return (
		<div className={'bot-setting'}>
			<div className={'title'}>{t('configBot')}</div>
			<div className={'bot-list'}>
				{activeMap?.data?.spawns.map((_, i) => (
					<div className={'bot-setting-item'}>
						{/* <div className={'bot-color'} style={{ background: colors[i] }} /> */}
						<Input
							required
							name={`bot[${i}].name`}
							className="bot-name"
							placeholder={t('botName')}
							initialValue={`bot#${i}`}
							disabled={startedGame}
						/>
						<DropDown
							name={`bot[${i}].controller`}
							className="bot-controller"
							options={listCodes}
							disabled={startedGame}
						/>
					</div>
				))}
			</div>
		</div>
	)
}
