import { useState } from 'preact/hooks'
import { JSXInternal } from 'preact/src/jsx'
import Split, { SplitProps } from 'react-split'
import './styles.scss'
import { clsx } from 'libs'

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
	return (
		//TODO: разобраться с типами преакта и тс конфигом
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
			className={clsx(
				'split-panel',
				drag && 'drag-split',
				_className || '',
				direction
			)}
		>
			<div className={'column'}>{Left}</div>
			<div className={'column'}>{Right}</div>
		</Split>
	)
}
