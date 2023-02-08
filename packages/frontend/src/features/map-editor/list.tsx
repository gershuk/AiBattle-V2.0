import { createAndDownloadFile } from 'api'
import { useUnit } from 'effector-react'
import { htmlFormToJson } from 'libs'
import {
	Input,
	InputNumber,
	List,
	ListItem,
	showConfirm,
	showMessage,
} from 'ui'
import { AddIcon, UploadIcon } from './assets/icons'
import {
	$mapsWithSessionValue,
	createdFile,
	removedFileMap,
	uploadedFile,
} from './model'
import './styles.scss'

interface MapsListProps {
	active?: string | null
	ontToggleSelect?: (code: { content: string; name: string } | null) => void
}

export const MapsList = ({ active, ontToggleSelect }: MapsListProps) => {
	const maps = useUnit($mapsWithSessionValue)

	const handlerClickItemList = (item: ListItem) => {
		const value = active === item.id ? null : item.id
		if (value === null) ontToggleSelect?.(null)
		else {
			const map = maps.find(x => x.name === item.id)
			ontToggleSelect?.(map ?? null)
		}
	}

	const createCodeFile = async () => {
		const { status, htmlElement } = await showConfirm({
			title: 'Создать карту',
			content: (
				<form className={'create-map-popup'}>
					<div className={'create-map-popup-item'}>
						<div>Имя файла</div>
						<Input required name={'name'} />
					</div>
					<div className={'create-map-popup-item'}>
						<div>Ширина карты</div>
						<InputNumber required min={3} max={50} name={'rows'} />
					</div>
					<div className={'create-map-popup-item'}>
						<div>Высота карты</div>
						<InputNumber required min={3} max={50} name={'columns'} />
					</div>
				</form>
			),
			okButtonClick: ({ htmlElement }) => {
				const form = htmlElement.querySelector('form')
				const dataForm = htmlFormToJson<{ name: string }>(form!)
				const valid = form?.reportValidity()
				if (!valid) return false
				else {
					if (!!maps.find(({ name }) => name === dataForm.name)) {
						showMessage({ content: 'Файл с таким именем уже существует.' })
						return false
					}
				}
			},
		})
		if (status !== 'ok') return
		const form = htmlElement.querySelector('form')
		const dataForm = htmlFormToJson<{
			name: string
			rows: number
			columns: number
		}>(form!)
		createdFile(dataForm)
	}

	const handlerDeviceSave = (item: ListItem) => {
		const map = maps.find(x => x.name === item.id)
		createAndDownloadFile(map?.content, item.id, 'text/plain')
	}

	const handlerRemove = async (item: ListItem) => {
		const { status } = await showConfirm({ content: 'Удалить файл?' })
		if (status === 'ok') removedFileMap(item.id)
	}

	return (
		<div className={'maps-list'}>
			<div className={'header'}>
				<div className={'title'}>Список файлов</div>
				<div className={'toolbar'}>
					<div onClick={createCodeFile}>
						<AddIcon />
					</div>
					<div onClick={() => uploadedFile()}>
						<UploadIcon />
					</div>
				</div>
			</div>
			<List
				items={maps.map(({ name, valid, modified: modify }) => ({
					htmlTitle: !valid ? 'invalid data' : undefined,
					text: (
						<span className={`maps-list-item ${modify ? 'modify' : ''}`}>
							{!valid ? <div className={'error-indicator'} /> : null}
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
