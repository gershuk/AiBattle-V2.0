import { useEffect, useRef, useState } from 'preact/hooks'
import { JSXInternal } from 'preact/src/jsx'
import './styles.scss'

interface RangeInputProps {
	initValue?: number
	value?: number
	min?: number
	max?: number
	onChange?: (value: number) => void
	className?: string
	disabled?: boolean
	[k: string]: any
}

export const RangeInput = ({
	initValue,
	value: valueProps,
	min,
	max,
	className,
	onChange,
	disabled,
	...props
}: RangeInputProps) => {
	const ref = useRef<HTMLInputElement>(null)
	const [value, setValue] = useState<null | number>(
		valueProps ?? initValue ?? null
	)

	useEffect(() => {
		if (ref.current) {
			ref.current.value = String(value ?? '')
		}
	}, [value])

	useEffect(() => {
		if (valueProps !== undefined) setValue(valueProps)
	}, [valueProps])

	useEffect(() => {
		if (ref.current) {
			setValue(Number(ref.current.value || ''))
		}
	}, [])

	const handlerChange = (
		e: JSXInternal.TargetedEvent<HTMLInputElement, Event>
	) => {
		const _value = Number(e.currentTarget.value)
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
				onChange={e => handlerChange(e)}
				disabled={disabled}
				{...props}
			/>
			<span className={'label'}>{value}</span>
		</div>
	)
}
