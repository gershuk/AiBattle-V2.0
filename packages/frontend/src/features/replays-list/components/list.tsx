import { createAndDownloadFile } from 'api'
import { useUnit } from 'effector-react'
import { Replay } from 'model'
import { $replays } from 'model/replays/model'
import { List, ListItem, showConfirm, UploadIcon } from 'ui'
import { removedReplay, uploadedReplay } from '../model'
import './styles.scss'

interface ReplayListProps {
	active?: string | null
	ontToggleSelect?: (code: Replay | null) => void
}

export const ReplayList = ({ active, ontToggleSelect }: ReplayListProps) => {
	const replays = useUnit($replays)

	const handlerClickItemList = (item: ListItem) => {
		const value = active === item.id ? null : item.id
		if (value === null) ontToggleSelect?.(null)
		else {
			const map = replays.find(x => x.name === item.id)
			ontToggleSelect?.(map ?? null)
		}
	}

	const handlerDeviceSave = (item: ListItem) => {
		const map = replays.find(x => x.name === item.id)
		createAndDownloadFile(map?.content, item.id, 'text/plain')
	}

	const handlerRemove = async (item: ListItem) => {
		const { status } = await showConfirm({ content: 'Удалить файл?' })
		if (status === 'ok') removedReplay(item.id)
	}

	return (
		<div className={'replays-list'}>
			<div className={'header'}>
				<div className={'title'}>Список файлов</div>
				<div className={'toolbar'}>
					<div onClick={() => uploadedReplay()}>
						<UploadIcon />
					</div>
				</div>
			</div>
			<List
				items={replays.map(({ name }) => ({
					text: name,
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
