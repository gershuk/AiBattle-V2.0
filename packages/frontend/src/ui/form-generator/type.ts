interface BaseField<Type extends string, onChangeValue> {
	type: Type
	onChange?: (
		value: onChangeValue,
		field: BaseField<Type, onChangeValue>
	) => void
	name: string
	required?: boolean
	[k: string]: any
}

interface RangeField extends BaseField<'range', number> {
	min: number
	max: number
	step?: number
	disabled?: boolean
}

interface NumberField extends BaseField<'number', number | null> {
	min?: number
	max?: number
	disabled?: boolean
}

interface DropdownField extends BaseField<'dropdown', string | null> {
	options: { id: string; text: string }[]
	disabled?: boolean
}

export type AllFields = RangeField | NumberField | DropdownField
