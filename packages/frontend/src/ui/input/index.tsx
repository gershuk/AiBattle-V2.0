import { useEffect, useRef, useState } from 'preact/hooks'
import './styles.scss'

export interface InputProps {
	name?: string
	disabled?: boolean
	placeholder?: string
	className?: string
	value?: string
	initialValue?: string
	onChange?: (value: string) => void
	required?: boolean
	autoFocus?: boolean
	[k: string]: any
}

export const Input = ({
	name,
	disabled,
	placeholder,
	className,
	value: valueProps,
	initialValue,
	required,
	onChange,
	autoFocus,
	...props
}: InputProps) => {
	const [value, setValue] = useState(valueProps ?? initialValue ?? '')
	const ref = useRef<HTMLInputElement | null>(null)

	useEffect(() => {
		if (ref.current) {
			if (valueProps !== undefined) {
				ref.current.value = valueProps
			} else {
				ref.current.value = value
			}
		}
	}, [ref, value])

	useEffect(() => {
		if (typeof valueProps === 'string') setValue(valueProps ?? '')
	}, [valueProps])

	useEffect(() => {
		if (autoFocus && ref.current) {
			ref.current.focus()
		}
	}, [])

	const handlerChange = (_value: string) => {
		if (disabled) return
		setValue(_value)
		onChange?.(_value)
	}

	return (
		<div className={`input ${className ?? ''}`}>
			<input
				required={required}
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
