import { JSXInternal } from 'preact/src/jsx'
import { useMemo } from 'react'
import { useState } from 'react'
import Split, { SplitProps } from 'react-split'
import './styles.scss'

interface SplitPanelProps extends SplitProps {
	Left: JSXInternal.Element | null
	Right: JSXInternal.Element | null
}

export const SplitPanel = ({
	Left,
	Right,
	onDrag,
	onDragEnd,
	className: _className,
	direction = 'horizontal',
	...props
}: SplitPanelProps) => {
	const [drag, setDrag] = useState(false)
	const className = useMemo(
		() =>
			['split-panel', drag ? 'drag-split' : '', _className || '', direction]
				.join(' ')
				.trim(),
		[drag, _className]
	)
	return (
		//TODO: разобраться с типами реакта и тс конфигом
		//@ts-ignore
		<Split
			{...props}
			direction={direction}
			onDrag={value => {
				setDrag(true)
				onDrag?.(value)
			}}
			onDragEnd={value => {
				setDrag(false)
				onDragEnd?.(value)
			}}
			className={className}
		>
			<div className={'column'}>{Left}</div>
			<div className={'column'}>{Right}</div>
		</Split>
	)
}
