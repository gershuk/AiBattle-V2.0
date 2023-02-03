import { clsx, generateGuid } from 'libs'
import { useMemo } from 'preact/hooks'
import React, { useState } from 'react'
import './styles.scss'

interface CheckboxProps {
	label?: string
	initialChecked?: boolean
	onChange?: (checked: boolean) => void
	className?: string
	id?: string
	[k: string]: any
}

export const Checkbox: React.FC<CheckboxProps> = ({
	label,
	initialChecked = false,
	onChange,
	className,
	id: idProp,
	...props
}) => {
	const [checked, setChecked] = useState(initialChecked)

	const handleChange = (newChecked: boolean) => {
		setChecked(newChecked)
		if (onChange) {
			onChange(newChecked)
		}
	}

	const id = useMemo(() => {
		if (idProp) return idProp
		return generateGuid()
	}, [idProp])

	return (
		<div className={clsx('checkbox', className)}>
			<input
				id={id}
				type="checkbox"
				checked={checked}
				onChange={e => handleChange(e.currentTarget.checked)}
				{...props}
			/>
			{label ? <label htmlFor={id}>{label}</label> : null}
		</div>
	)
}
