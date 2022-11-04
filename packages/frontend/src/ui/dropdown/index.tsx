import { useEffect, useRef, useState } from 'preact/hooks'
import './styles.scss'

export interface DropDownProps {
	value?: string | null
	onChange?: (selectId: string | null) => void
	options: { id: string; text: string }[]
	disabled?: boolean
	name?: string
	className?: string
	[k: string]: any
}

export const DropDown = ({
	value: valueProps,
	options,
	onChange,
	disabled,
	name,
	className,
	...props
}: DropDownProps) => {
	const ref = useRef<HTMLSelectElement | null>(null)
	const [value, setValue] = useState<string | null>(valueProps ?? null)

	useEffect(() => {
		if (ref.current) {
			if (valueProps !== undefined) {
				ref.current.value = valueProps ?? ''
			} else {
				ref.current.value = value || ''
			}
		}
	}, [ref, value])

	useEffect(() => {
		setValue(valueProps ?? null)
	}, [valueProps])

	const handlerChange = (_value: string) => {
		if (disabled) return
		const newValue = value === _value ? null : _value
		setValue(newValue)
		onChange?.(newValue)
	}

	const handlerClear = () => {
		if (disabled) return
		setValue(null)
		onChange?.(null)
	}

	return (
		<div
			className={`dropdown ${disabled ? 'disabled' : ''} ${className ?? ''}`}
		>
			<select
				name={name}
				disabled={disabled}
				className={'dropdown-select'}
				ref={ref}
				onChange={e => handlerChange(e.currentTarget.value)}
				{...props}
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
