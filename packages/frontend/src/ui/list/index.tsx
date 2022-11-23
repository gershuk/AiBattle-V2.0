import { useEffect, useState } from 'preact/hooks'
import { createPortal } from 'preact/compat'
import { getPositionMouseEvent } from './utils'
import { JSXInternal } from 'preact/src/jsx'
import './styles.scss'

export interface ListItem {
	id: string
	text: string | JSXInternal.Element
	active?: boolean
	className?: string
	htmlTitle?: string
	[k: string]: any
}

export interface ListContextMenu {
	text: string
	onClick: (item: ListItem) => void
}

export interface ListProps {
	items: ListItem[]
	contextMenu?: ListContextMenu[]
	onClick?: (item: ListItem) => void
	className?: string
}

export const List = ({ items, contextMenu, className, onClick }: ListProps) => {
	return (
		<div className={`flat-list ${className ?? ''}`}>
			{items.map(item => (
				<Item
					key={item.id}
					data={item}
					onClick={onClick}
					contextMenu={contextMenu}
				/>
			))}
		</div>
	)
}

interface ItemProps {
	data: ListItem
	contextMenu?: ListContextMenu[]
	onClick?: (item: ListItem) => void
}

const Item = ({ data, contextMenu, onClick }: ItemProps) => {
	const {
		active = false,
		className,
		text,
		htmlTitle,
		id: _,
		renderContent,
		...props
	} = data

	const [showContextMenu, setShowContextMenu] = useState<{
		show: boolean
		x: number
		y: number
	}>({ show: false, x: 0, y: 0 })

	const handlerContextMenu = (
		e: JSXInternal.TargetedMouseEvent<HTMLDivElement>
	) => {
		if (!contextMenu) return
		e.preventDefault()
		setShowContextMenu({
			show: !showContextMenu.show,
			...getPositionMouseEvent(e),
		})
	}

	const handlerClose = () => {
		setShowContextMenu({ ...showContextMenu, show: false })
	}

	return (
		<>
			<div
				{...props}
				title={htmlTitle}
				className={`flat-list-item ${active ? 'active' : ''} ${
					className ?? ''
				}`}
				onClick={() => onClick?.(data)}
				onContextMenu={handlerContextMenu}
			>
				<div class={'flat-list-item-name'}>{text}</div>
			</div>
			{showContextMenu?.show ? (
				<ContextMenu
					{...showContextMenu}
					onClose={handlerClose}
					data={contextMenu!}
					item={data}
				/>
			) : null}
		</>
	)
}

interface ContextMenuProps {
	x: number
	y: number
	data: ListContextMenu[]
	onClose: () => void
	item: ListItem
}

const ContextMenu = ({ x, y, data, item, onClose }: ContextMenuProps) => {
	useEffect(() => {
		const onCloseHandler = () => {
			setTimeout(() => onClose(), 1)
		}
		document.addEventListener('click', onCloseHandler)
		document.addEventListener('contextmenu', onCloseHandler)
		return () => {
			document.removeEventListener('click', onCloseHandler)
			document.removeEventListener('contextmenu', onCloseHandler)
		}
	})
	return createPortal(
		<div
			onContextMenu={e => e.preventDefault()}
			className={'flat-list-context-menu'}
			style={{ left: `${x}px`, top: `${y}px` }}
		>
			{data.map(({ onClick, text }) => (
				<div className={'item'} onClick={() => onClick(item)}>
					{text}
				</div>
			))}
		</div>,
		document.body
	)
}
