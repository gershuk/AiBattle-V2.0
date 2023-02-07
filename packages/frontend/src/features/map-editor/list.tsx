import { createAndDownloadFile } from 'api'
import { useUnit } from 'effector-react'
import { htmlFormToJson } from 'libs'
import { Input, InputNumber, List, ListItem, showPopup } from 'ui'
import { AddIcon, UploadIcon } from './assets/icons'
import {
	$mapsWithCache,
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
	const maps = useUnit($mapsWithCache)

	const handlerClickItemList = (item: ListItem) => {
		const value = active === item.id ? null : item.id
		if (value === null) ontToggleSelect?.(null)
		else {
			const map = maps.find(x => x.name === item.id)
			ontToggleSelect?.(map ?? null)
		}
	}

	const createCodeFile = async () => {
		const { status, htmlElement } = await showPopup({
			title: 'Создать карту',
			content: (
				<form className={'create-map-popup'}>
					<div className={'create-map-popup-item'}>
						<div>Имя файла</div>
						<Input required name={'name'} />
					</div>
					<div className={'create-map-popup-item'}>
						<div>Ширина карты</div>
						<InputNumber required min={2} max={50} name={'rows'} />
					</div>
					<div className={'create-map-popup-item'}>
						<div>Высота карты</div>
						<InputNumber required min={2} max={50} name={'columns'} />
					</div>
				</form>
			),
			okButtonText: 'Ок',
			cancelButtonText: 'Отмена',
			okButtonClick: ({ htmlElement }) =>
				htmlElement.querySelector('form')?.reportValidity(),
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

	const handlerRemove = (item: ListItem) => {
		const res = confirm('Удалить файл?')
		if (res) removedFileMap(item.id)
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
