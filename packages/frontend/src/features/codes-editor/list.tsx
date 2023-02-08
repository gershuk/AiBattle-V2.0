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
import { Input, List, ListItem, showConfirm, showMessage } from 'ui'
import { htmlFormToJson } from 'libs'

export interface LoaderScriptProps {
	active?: string | null
	ontToggleSelect?: (code: UploadedCode | null) => void
}

export const CodesList = ({ active, ontToggleSelect }: LoaderScriptProps) => {
	const codes = useUnit($codesWithCache)

	const createCodeFile = async () => {
		const { status, htmlElement } = await showConfirm({
			title: 'Создать скрипт',
			content: (
				<form className={'create-map-popup'}>
					<div className={'create-map-popup-item'}>
						<div>Имя файла</div>
						<Input required name={'name'} />
					</div>
				</form>
			),
			okButtonClick: ({ htmlElement }) => {
				const form = htmlElement.querySelector('form')
				const dataForm = htmlFormToJson<{ name: string }>(form!)
				const valid = form?.reportValidity()
				if (!valid) return false
				else {
					if (!!codes.find(({ name }) => name === dataForm.name)) {
						showMessage({ content: 'Файл с таким именем уже существует.' })
						return false
					}
				}
			},
		})
		if (status !== 'ok') return
		const form = htmlElement.querySelector('form')
		const { name } = htmlFormToJson<{ name: string }>(form!)
		if (name?.trim()) createdFileCode(name.trim())
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

	const handlerRemove = async (item: ListItem) => {
		const { status } = await showConfirm({ content: 'Удалить файл?' })
		if (status === 'ok') removedFileCode(item.id)
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
