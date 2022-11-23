import { useEffect, useRef, useState } from 'preact/hooks'
import './styles.scss'

interface RangeInputProps {
	value?: number
	min?: number
	max?: number
	onChange?: (value: number) => void
	className?: string
	[k: string]: any
}

export const RangeInput = ({
	value: valueProps,
	min,
	max,
	className,
	onChange,
	...props
}: RangeInputProps) => {
	const ref = useRef<HTMLInputElement>(null)
	const [value, setValue] = useState<null | number>(null)

	useEffect(() => {
		if (ref.current) {
			if (valueProps !== undefined) {
				ref.current.value = String(valueProps)
			} else {
				ref.current.value = String(value ?? '')
			}
		}
	}, [value])

	useEffect(() => {
		setValue(valueProps ?? null)
	}, [valueProps])

	useEffect(() => {
		if (ref.current && valueProps === undefined) {
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
				value={valueProps ?? value ?? undefined}
				ref={ref}
				type="range"
				min={min}
				max={max}
				onChange={e => handlerChange(Number(e.currentTarget.value))}
				{...props}
			/>
			<span className={'label'}>{value}</span>
		</div>
	)
}
