import { useEffect, useRef, useState } from 'preact/hooks'
import './styles.scss'

export interface InputNumberProps {
	name?: string
	disabled?: boolean
	placeholder?: string
	className?: string
	value?: number
	initValue?: number
	min?: number
	max?: number
	onChange?: (value: number | null) => void
	required?: boolean
	[k: string]: any
}

export const InputNumber = ({
	name,
	disabled,
	placeholder,
	className,
	value: valueProps,
	initValue,
	min,
	max,
	onChange,
	required,
	...props
}: InputNumberProps) => {
	const [value, setValue] = useState(initValue ?? '')
	const ref = useRef<HTMLInputElement | null>(null)

	useEffect(() => {
		if (typeof valueProps === 'number') setValue(valueProps ?? '')
	}, [valueProps])

	useEffect(() => {
		if (typeof initValue === 'number') setValue(initValue ?? '')
	}, [])

	const handlerChange = (_value: string) => {
		if (disabled) return
		setValue(_value)
		onChange?.(_value.trim() === '' ? null : Number(_value))
	}

	return (
		<div className={`input-number ${className ?? ''}`}>
			<input
				required={required}
				min={min}
				max={max}
				type="number"
				name={name}
				disabled={disabled}
				placeholder={placeholder}
				ref={ref}
				className={'input-field'}
				onChange={e => handlerChange(e.currentTarget.value)}
				value={String(value)}
				{...props}
			/>
		</div>
	)
}
