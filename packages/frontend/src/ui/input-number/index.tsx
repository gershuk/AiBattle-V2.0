import { useEffect, useRef, useState } from 'preact/hooks'
import './styles.scss'

export interface InputNumberProps {
	name?: string
	disabled?: boolean
	placeholder?: string
	className?: string
	value?: number
	min?: number
	max?: number
	onChange?: (value: number) => void
	required?: boolean
	[k: string]: any
}

export const InputNumber = ({
	name,
	disabled,
	placeholder,
	className,
	value: valueProps,
	min,
	max,
	onChange,
	required,
	...props
}: InputNumberProps) => {
	const [value, setValue] = useState(valueProps ?? '')
	const ref = useRef<HTMLInputElement | null>(null)

	useEffect(() => {
		if (ref.current) {
			if (valueProps !== undefined) {
				ref.current.value = String(valueProps)
			} else {
				ref.current.value = String(value)
			}
		}
	}, [ref, value])

	useEffect(() => {
		setValue(valueProps ?? '')
	}, [valueProps])

	const handlerChange = (_value: string) => {
		if (disabled) return
		setValue(_value)
		onChange?.(Number(_value))
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
				value={valueProps ?? value}
				{...props}
			/>
		</div>
	)
}
