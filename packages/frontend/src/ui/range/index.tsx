import { useEffect, useRef, useState } from 'preact/hooks'
import './styles.scss'

interface RangeInputProps {
	initialValue?: number
	min?: number
	max?: number
	onChange?: (value: number) => void
	className?: string
	disabled?: boolean
	[k: string]: any
}

export const RangeInput = ({
	initialValue: initialValue,
	min,
	max,
	className,
	onChange,
	disabled,
	...props
}: RangeInputProps) => {
	const ref = useRef<HTMLInputElement>(null)
	const [value, setValue] = useState<null | number>(initialValue ?? null)

	useEffect(() => {
		if (ref.current) {
			ref.current.value = String(value ?? '')
		}
	}, [value])

	useEffect(() => {
		if (ref.current) {
			setValue(Number(ref.current.value || ''))
		}
	}, [])

	const handlerChange = (_value: number) => {
		setValue(_value)
		onChange?.(_value)
	}

	return (
		<div className={`range-input ${className ?? ''}`}>
			<input
				value={value ?? undefined}
				ref={ref}
				type="range"
				min={min}
				max={max}
				onChange={e => handlerChange(Number(e.currentTarget.value))}
				disabled={disabled}
				{...props}
			/>
			<span className={'label'}>{value}</span>
		</div>
	)
}
