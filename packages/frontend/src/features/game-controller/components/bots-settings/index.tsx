import { useUnit } from 'effector-react'
import { $codesData } from 'model'
import { useMemo } from 'preact/hooks'
import { DropDown, Input } from 'ui'
import {
	$activeGame,
	$formValues,
	$selectedMap,
	setFieldValue,
} from '../../model'
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
	const { activeMap, codesData, startedGame, formValues } = useUnit({
		activeMap: $selectedMap,
		codesData: $codesData,
		startedGame: $activeGame,
		formValues: $formValues,
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
				{activeMap?.data?.spawns.map((_, i) => {
					const fieldName = `bot[${i}].name`
					const fieldController = `bot[${i}].controller`

					const nameValue = formValues[fieldName] ?? ''
					const controllerValue = formValues[fieldController] ?? null

					const required = !!nameValue || !!controllerValue

					return (
						<div className={'bot-setting-item'}>
							{/* <div className={'bot-color'} style={{ background: colors[i] }} /> */}
							<Input
								initialValue={nameValue}
								required={required}
								name={fieldName}
								className="bot-name"
								placeholder={t('botName')}
								disabled={startedGame}
								onChange={value =>
									setFieldValue({ fieldName: fieldName, value: value })
								}
							/>
							<DropDown
								required={required}
								initValue={controllerValue}
								name={fieldController}
								className="bot-controller"
								options={listCodes}
								disabled={startedGame}
								onChange={value =>
									setFieldValue({ fieldName: fieldController, value: value })
								}
							/>
						</div>
					)
				})}
			</div>
		</div>
	)
}
