import { useUnit } from 'effector-react'
import { htmlFormToJson, createTranslation, createAndDownloadFile } from 'libs'
import {
	AddIcon,
	Button,
	Input,
	InputNumber,
	List,
	ListItem,
	showConfirm,
	showMessage,
	showPopup,
	UploadIcon,
} from 'ui'
import {
	$mapsWithSessionValue,
	createdFile,
	removedFileMap,
	uploadedFile,
} from '../model'
import './styles.scss'

const { useTranslation } = createTranslation({
	ru: {
		removeFile: 'Удалить файл?',
		remove: 'Удалить',
		saveToDevice: 'Сохранить на устройство',
		fileList: 'Список файлов',
		fileExists: 'Файл с таким именем уже существует.',
		fileName: 'Имя файла',
		ok: 'Ок',
		cancel: 'Отмена',
		createMap: 'Создать карту',
		widthMap: 'Ширина карты',
		heightMap: 'Высота карты',
		fillCode: 'Заполнение карты (код клетки)',
		fillBorderCode: 'Заполнение краев карты (код клетки)',
	},
	en: {
		removeFile: 'Remove file?',
		remove: 'Remove',
		saveToDevice: 'Save to device',
		fileList: 'File list',
		fileExists: 'A file with the same name already exists.',
		fileName: 'File name',
		ok: 'Ок',
		cancel: 'Cancel',
		createMap: 'Create map',
		widthMap: 'Map width',
		heightMap: 'Map height',
		fillCode: 'Type of tile (cell code)',
		fillBorderCode: `Type of map's border (cell code)`,
	},
})

interface MapsListProps {
	active?: string | null
	ontToggleSelect?: (code: { content: string; name: string } | null) => void
}

export const MapsList = ({ active, ontToggleSelect }: MapsListProps) => {
	const maps = useUnit($mapsWithSessionValue)
	const t = useTranslation()

	const handlerClickItemList = (item: ListItem) => {
		const value = active === item.id ? null : item.id
		if (value === null) ontToggleSelect?.(null)
		else {
			const map = maps.find(x => x.name === item.id)
			ontToggleSelect?.(map ?? null)
		}
	}

	const createMapFile = async () => {
		const { status, htmlElement } = await showPopup({
			content: props => (
				<CreateMapForm {...props} mapsName={maps.map(({ name }) => name)} />
			),
		})
		if (status !== 'ok') return
		const form = htmlElement.querySelector('form')
		const dataForm = htmlFormToJson<{
			name: string
			rows: number
			columns: number
			fillCode: number
			borderCode: number
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
				<div className={'title'}>{t('fileList')}</div>
				<div className={'toolbar'}>
					<div class={'add-map'} onClick={createMapFile}>
						<AddIcon />
					</div>
					<div class={'upload-map'} onClick={() => uploadedFile()}>
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
					{ text: t('remove'), onClick: handlerRemove },
					{
						text: t('saveToDevice'),
						onClick: handlerDeviceSave,
					},
				]}
			/>
		</div>
	)
}

const CreateMapForm = ({
	ok,
	cancel,
	mapsName,
}: {
	ok: () => void
	cancel: () => void
	mapsName: string[]
}) => {
	const t = useTranslation()

	return (
		<form
			onSubmit={e => {
				e.preventDefault()
				const dataForm = htmlFormToJson<{ name: string }>(e.currentTarget)
				const fileExists = !!mapsName.find(name => name === dataForm.name)
				if (fileExists) showMessage({ content: t('fileExists') })
				else ok()
			}}
		>
			<div className={'popup-header'}>{t('createMap')}</div>
			<div className={'popup-content create-map-popup'}>
				<div className={'create-map-popup-item'}>
					<div>{t('fileName')}</div>
					<Input autoFocus required name={'name'} />
				</div>
				<div className={'create-map-popup-item'}>
					<div>{t('widthMap')}</div>
					<InputNumber required min={3} max={50} name={'rows'} />
				</div>
				<div className={'create-map-popup-item'}>
					<div>{t('heightMap')}</div>
					<InputNumber required min={3} max={50} name={'columns'} />
				</div>
				<div className={'create-map-popup-item'}>
					<div>{t('fillCode')}</div>
					<InputNumber initValue={0} required name={'fillCode'} />
				</div>
				<div className={'create-map-popup-item'}>
					<div>{t('fillBorderCode')}</div>
					<InputNumber initValue={2} required name={'borderCode'} />
				</div>
			</div>
			<div className={'popup-footer'}>
				<Button onClick={() => cancel()} type="button" color="danger">
					{t('cancel')}
				</Button>
				<Button type="submit" color="primary">
					{t('ok')}
				</Button>
			</div>
		</form>
	)
}
