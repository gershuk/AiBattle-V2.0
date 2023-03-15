import { GAME_ENGINE_TRANSLATION } from 'api'
import { useUnit } from 'effector-react'
import { createTranslation } from 'libs'
import { ComponentChild } from 'preact'
import { useMemo } from 'preact/hooks'
import { FormGenerator, AllFields } from 'ui'
import { $activeGame, $formValues, setFieldValue } from '../../model'
import './styles.scss'

const _formFields = [
	{
		type: 'number',
		min: 1,
		max: 200,
		name: 'sceneParams.tileSizeScale',
		required: true,
	},
	{
		type: 'number',
		required: true,
		name: 'sceneParams.maxTurnIndex',
		min: 1,
	},
	{
		type: 'number',
		required: true,
		name: 'sceneParams.animTicksCount',
		min: 1,
	},
	{
		type: 'number',
		required: true,
		name: 'sceneParams.animTicksTime',
		min: 1,
	},
	{
		type: 'number',
		required: true,
		name: 'sceneParams.autoTurnTime',
		min: 1,
	},
	{
		type: 'number',
		required: true,
		name: 'sceneParams.initTimeout',
	},
	{
		type: 'number',
		required: true,
		name: 'sceneParams.commandCalcTimeout',
	},
] as const

const { useTranslation } = createTranslation(
	GAME_ENGINE_TRANSLATION.merge({
		ru: {
			configGame: 'Конфигурация игры',
		},
		en: {
			configGame: 'Game configuration',
		},
	})
)

export const GameSettings = () => {
	const t = useTranslation()
	const { startedGame, formValues } = useUnit({
		startedGame: $activeGame,
		formValues: $formValues,
	})

	const formFields = useMemo(
		() =>
			_formFields.map<AllFields>(field => ({
				...field,
				disabled: startedGame,
				onChange: (value: any) =>
					setFieldValue({ value, fieldName: field.name }),
				initValue: formValues[field.name],
				title: t(field.name),
			})),
		[_formFields, startedGame, formValues, t]
	)

	return (
		<div className={'pre-game-settings'}>
			<div className={'title'}>{t('configGame')}</div>
			<div className={'wrapper-settings'}>
				<FormGenerator
					fields={formFields}
					renderUnit={(Unit, fieldData) => (
						<TemplateField fieldData={fieldData} key={fieldData.name}>
							{Unit}
						</TemplateField>
					)}
				/>
			</div>
		</div>
	)
}

const TemplateField = ({
	fieldData,
	children,
}: {
	fieldData: AllFields
	children: ComponentChild
}) => {
	return (
		<div className={'setting-item'}>
			<div className={'input-title'}>{fieldData.title}</div>
			{children}
		</div>
	)
}
