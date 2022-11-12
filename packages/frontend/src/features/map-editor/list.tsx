import { useUnit } from 'effector-react'
import { $maps } from 'model'
import { MapData } from 'model/uploaded-maps/type'
import { List, ListItem } from 'ui'
import { AddIcon, UploadIcon } from './assets/icons'
import { createdFile, uploadedFile } from './model'
import './styles.scss'

interface MapsListProps {
	active?: string | null
	ontToggleSelect?: (code: { data: MapData; name: string } | null) => void
}

export const MapsList = ({ active, ontToggleSelect }: MapsListProps) => {
	const maps = useUnit($maps)

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
				items={maps.map(({ name }) => ({
					text: name,
					id: name,
					active: active ? active === name : false,
				}))}
				onClick={handlerClickItemList}
				contextMenu={[
					{ text: 'Удалить', onClick: item => console.log(item) },
					{
						text: 'Сохранить на устройство',
						onClick: item => console.log(item),
					},
				]}
			/>
		</div>
	)
}
