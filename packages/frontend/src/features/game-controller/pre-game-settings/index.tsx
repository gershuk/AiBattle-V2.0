import { useUnit } from 'effector-react'
import { ComponentChild } from 'preact'
import { useMemo } from 'preact/hooks'
import { FormGenerator } from 'ui/form-generator/generator'
import { AllFields } from 'ui/form-generator/type'
import { $activeGame, $formValues, setFieldValue } from '../model'
import './styles.scss'

const _formFields: AllFields[] = [
	{
		type: 'range',
		min: 1,
		max: 200,
		initValue: 30,
		name: 'sceneParams.tileSize',
		required: true,
		className: 'game-settings-range',
		title: 'Задать размер тайла',
	},
	{
		type: 'number',
		required: true,
		name: 'sceneParams.maxTurnIndex',
		min: 1,
		initValue: 1000000,
		title: 'maxTurnIndex',
	},
	{
		type: 'number',
		required: true,
		name: 'sceneParams.animTicksCount',
		min: 1,
		initValue: 60,
		title: 'animTicksCount',
	},
	{
		type: 'number',
		required: true,
		name: 'sceneParams.animTicksTime',
		min: 1,
		initValue: 12,
		title: 'animTicksTime',
	},
	{
		type: 'number',
		required: true,
		name: 'sceneParams.autoTurnTime',
		min: 1,
		initValue: 1100,
		title: 'autoTurnTime',
	},
]

export const PreGameSettings = () => {
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
				initValue: formValues[field.name] ?? field?.initValue,
			})),
		[_formFields, startedGame, formValues]
	)

	return (
		<div className={'pre-game-settings'}>
			<div className={'title'}>Конфигурация игры</div>
			<div className={'wrapper-settings'}>
				{/* <div className={'setting-item'}>
					<div>Название реплея</div>
					<Input required name="replay-name" />
				</div> */}
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
