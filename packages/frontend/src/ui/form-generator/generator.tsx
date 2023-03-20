import { RangeInput } from '../range'
import { InputNumber } from '../input-number'
import { AllFields } from './type'
import { JSXInternal } from 'preact/src/jsx'
import { memo } from 'preact/compat'
import { DropDown } from '../dropdown'

export const FormGenerator = ({
	fields,
	renderUnit,
}: {
	fields: AllFields[]
	renderUnit: (
		Unit: JSXInternal.Element | null,
		fieldData: AllFields
	) => JSXInternal.Element | null
}) => {
	return <>{fields.map(field => renderUnit(<Unit field={field} />, field))}</>
}

const Unit = memo(
	({ field, ...props }: { field: AllFields; [k: string]: any }) => {
		switch (field.type) {
			case 'number':
				return (
					<InputNumber
						{...field}
						{...props}
						onChange={value => field?.onChange?.(value, field)}
					/>
				)
			case 'range':
				return (
					<RangeInput
						{...field}
						{...props}
						onChange={value => field?.onChange?.(value, field)}
					/>
				)
			case 'dropdown':
				return (
					<DropDown
						{...field}
						{...props}
						onChange={value => field?.onChange?.(value, field)}
					/>
				)
		}
		return null
	}
)
