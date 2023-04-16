import { useUnit } from 'effector-react'
import {
	uploadedFileCode,
	removedFileCode,
	createdFileCode,
	$codesModified,
	renamedFileCode,
} from '../model'
import { UploadedCode } from 'model'
import './styles.scss'
import {
	AddIcon,
	Button,
	Input,
	List,
	ListItem,
	showConfirm,
	showMessage,
	showPopup,
	UploadIcon,
} from 'ui'
import { createTranslation, htmlFormToJson, createAndDownloadFile } from 'libs'

export interface LoaderScriptProps {
	active?: string | null
	ontToggleSelect?: (code: UploadedCode | null) => void
}

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
		createScript: 'Создать скрипт',
		rename: 'Переименовать',
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
		createScript: 'Create script',
		rename: 'Rename',
	},
})

export const CodesList = ({ active, ontToggleSelect }: LoaderScriptProps) => {
	const codes = useUnit($codesModified)
	const t = useTranslation()

	const createCodeFile = async () => {
		const { status, value } = await showPopup<{ name: string }>({
			content: props => (
				<CreateCodeForm
					{...props}
					codesName={codes.map(({ name }) => name)}
					title={t('createScript')}
				/>
			),
		})
		if (status !== 'ok') return
		createdFileCode(value.name)
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
		const code = codes.find(x => x.name === item.id)
		createAndDownloadFile(code?.content, item.id, 'text/plain')
	}

	const handlerRemove = async (item: ListItem) => {
		const { status } = await showConfirm({ content: t('removeFile') })
		if (status === 'ok') removedFileCode(item.id)
	}

	const handlerRename = async (item: ListItem) => {
		const { status, value } = await showPopup<{ name: string }>({
			content: props => (
				<CreateCodeForm
					{...props}
					codesName={codes.map(({ name }) => name)}
					title={t('rename')}
				/>
			),
		})
		if (status !== 'ok') return
		renamedFileCode({ oldName: item.id, newName: value.name })
	}

	return (
		<div className={'code-loader'}>
			<div className={'header'}>
				<div className={'title'}>{t('fileList')}</div>
				<div className={'toolbar'}>
					<div className={'add-code'} onClick={createCodeFile}>
						<AddIcon />
					</div>
					<div className={'upload-code'} onClick={() => uploadedFileCode()}>
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
					{ text: t('remove'), onClick: handlerRemove },
					{
						text: t('saveToDevice'),
						onClick: handlerDeviceSave,
					},
					{
						text: t('rename'),
						onClick: handlerRename,
					},
				]}
			/>
		</div>
	)
}

const CreateCodeForm = ({
	ok,
	cancel,
	codesName,
	title,
}: {
	ok: (value: { name: string }) => void
	cancel: () => void
	codesName: string[]
	title: string
}) => {
	const t = useTranslation()

	return (
		<form
			onSubmit={e => {
				e.preventDefault()
				const dataForm = htmlFormToJson<{ name: string }>(e.currentTarget)
				const codeName = dataForm.name.includes('.')
					? dataForm.name
					: `${dataForm.name}.js`
				const fileExists = !!codesName.find(name => name === codeName)
				if (fileExists) showMessage({ content: t('fileExists') })
				else ok({ name: codeName })
			}}
		>
			<div className={'popup-header'}>{title}</div>
			<div className={'popup-content'}>
				<div className={'create-map-popup-item'}>
					<div>{t('fileName')}</div>
					<Input autoFocus required name={'name'} />
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
