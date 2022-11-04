import { useEffect, useRef, useState } from 'preact/hooks'
import './styles.scss'

export interface DropDownProps {
	value?: string | null
	onChange?: (selectId: string | null) => void
	options: { id: string; text: string }[]
}

export const DropDown = ({
	value: valueProps,
	options,
	onChange,
}: DropDownProps) => {
	const ref = useRef<HTMLSelectElement | null>(null)
	const [value, setValue] = useState<string | null>(valueProps ?? null)

	useEffect(() => {
		if (ref.current) {
			ref.current.value = value || ''
		}
	}, [ref, value])

	useEffect(() => {
		setValue(valueProps ?? null)
	}, [valueProps])

	const handlerChange = (_value: string) => {
		const newValue = value === _value ? null : _value
		setValue(newValue)
		onChange?.(newValue)
	}

	const handlerClear = () => {
		setValue(null)
		onChange?.(null)
	}
	return (
		<div className={'dropdown'}>
			<select
				className={'dropdown-select'}
				ref={ref}
				value={'Чебурашка'}
				onChange={e => handlerChange((e.target as HTMLSelectElement).value)}
			>
				{options.map(({ id, text }) => (
					<option key={id} value={id}>
						{text}
					</option>
				))}
			</select>
			<div
				onClick={handlerClear}
				class={'clear-dropdown'}
				title="Очистить значение"
			></div>
		</div>
	)
}
