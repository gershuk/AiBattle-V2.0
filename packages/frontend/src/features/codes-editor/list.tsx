import { useUnit } from 'effector-react'
import {
	uploadedFileCode,
	removedFileCode,
	createdFileCode,
	$codesWithCache,
} from './model'
import { UploadedCode } from '../../model'
import { AddIcon, UploadIcon } from './assets/icons'
import { useEffect, useState } from 'preact/hooks'
import { getPositionMouseEvent } from './utils'
import { createPortal } from 'preact/compat'
import { createAndDownloadFile } from '../../api'
import './styles.scss'
import { StoreValue } from 'effector'

export interface LoaderScriptProps {
	active?: string | null
	ontToggleSelect?: (code: UploadedCode | null) => void
}

export const CodesList = ({ active, ontToggleSelect }: LoaderScriptProps) => {
	const codes = useUnit($codesWithCache)

	const createCodeFile = () => {
		const res = prompt('Введите название файла')
		if (res?.trim()) {
			createdFileCode(res.trim())
		}
	}

	return (
		<div className={'code-loader'}>
			<div className={'header'}>
				<div className={'title'}>Список файлов</div>
				<div className={'toolbar'}>
					<div onClick={createCodeFile}>
						<AddIcon />
					</div>
					<div onClick={() => uploadedFileCode()}>
						<UploadIcon />
					</div>
				</div>
			</div>
			<div>
				{codes.map(code => (
					<Item
						key={code.name}
						code={code}
						active={active ?? null}
						ontToggleSelect={ontToggleSelect}
					/>
				))}
			</div>
		</div>
	)
}

interface ItemProps {
	code: StoreValue<typeof $codesWithCache>[0]
	active: string | null
	ontToggleSelect?: (code: UploadedCode | null) => void
}

const Item = ({ code, active, ontToggleSelect }: ItemProps) => {
	const [showContextMenu, setShowContextMenu] = useState<{
		show: boolean
		x: number
		y: number
	}>({ show: false, x: 0, y: 0 })
	const selected = active === code.name

	const handlerRemove = () => {
		const res = confirm('Удалить файл?')
		if (res) removedFileCode(code.name)
	}

	const handlerSave = () => {
		createAndDownloadFile(code.content, code.name, 'text/plain')
	}

	const handlerClose = () => {
		setShowContextMenu({ ...showContextMenu, show: false })
	}

	return (
		<>
			<div
				className={`item-file ${selected ? 'active' : ''} ${
					code.modify ? 'modify' : ''
				}`}
				onClick={() => ontToggleSelect?.(selected ? null : code)}
				onContextMenu={e => {
					e.preventDefault()
					setShowContextMenu({
						show: !showContextMenu.show,
						...getPositionMouseEvent(e),
					})
				}}
				key={code.name}
			>
				<div class={'item-file-name'}>{code.name}</div>
			</div>
			{showContextMenu?.show ? (
				<ContextMenu
					{...showContextMenu}
					onClose={handlerClose}
					onRemove={handlerRemove}
					onSave={handlerSave}
				/>
			) : null}
		</>
	)
}

interface ContextMenuProps {
	x: number
	y: number
	onClose: () => void
	onRemove: () => void
	onSave: () => void
}

const ContextMenu = ({ x, y, onClose, onRemove, onSave }: ContextMenuProps) => {
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
			className={'codes-list-item-context-menu'}
			style={{ left: `${x}px`, top: `${y}px` }}
		>
			<div className={'item'} onClick={onRemove}>
				Удалить
			</div>
			<div className={'item'} onClick={onSave}>
				Сохранить на устройство
			</div>
		</div>,
		document.body
	)
}
