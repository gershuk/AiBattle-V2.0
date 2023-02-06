import { useUnit } from 'effector-react'
import {
	uploadedFileCode,
	removedFileCode,
	createdFileCode,
	$codesWithCache,
} from './model'
import { UploadedCode } from '../../model'
import { AddIcon, UploadIcon } from './assets/icons'
import { createAndDownloadFile } from '../../api'
import './styles.scss'
import { List, ListItem } from 'ui'

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

	const handlerClickItemList = (item: ListItem) => {
		const value = active === item.id ? null : item.id
		if (value === null) ontToggleSelect?.(null)
		else {
			const map = codes.find(x => x.name === item.id)
			ontToggleSelect?.(map ?? null)
		}
	}

	const handlerDeviceSave = (item: ListItem) => {
		const map = codes.find(x => x.name === item.id)
		createAndDownloadFile(map?.content, item.id, 'text/plain')
	}

	const handlerRemove = (item: ListItem) => {
		const res = confirm('Удалить файл?')
		if (res) removedFileCode(item.id)
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
			<List
				items={codes.map(({ name, modified }) => ({
					// htmlTitle: !valid ? 'invalid js' : undefined,
					text: (
						<span className={`codes-list-item ${modified ? 'modify' : ''}`}>
							{/* {!valid ? <div className={'error-indicator'} /> : null} */}
							{name}
						</span>
					),
					id: name,
					active: active ? active === name : false,
				}))}
				onClick={handlerClickItemList}
				contextMenu={[
					{ text: 'Удалить', onClick: handlerRemove },
					{
						text: 'Сохранить на устройство',
						onClick: handlerDeviceSave,
					},
				]}
			/>
		</div>
	)
}
