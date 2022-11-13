import { createAndDownloadFile } from 'api'
import { useUnit } from 'effector-react'
import { List, ListItem } from 'ui'
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

	const createCodeFile = () => {
		const res = prompt('Введите название файла')
		if (res?.trim()) {
			createdFile(res.trim())
		}
	}

	const handlerDeviceSave = (item: ListItem) => {
		const map = maps.find(x => x.name === item.id)
		createAndDownloadFile(map?.content, item.id, 'text/plain')
	}

	const handlerRemove = (item: ListItem) => {
		removedFileMap(item.id)
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
				items={maps.map(({ name, validJson, modify }) => ({
					htmlTitle: !validJson ? 'invalid json' : undefined,
					text: (
						<span className={`maps-list-item ${modify ? 'modify' : ''}`}>
							{!validJson ? <div className={'error-indicator'} /> : null}
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
