import { useUnit } from 'effector-react'
import {
	uploadedFileCode,
	removedFileCode,
	createdFileCode,
	$codesModified,
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
import { useEffect } from 'react'

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
	},
})

export const CodesList = ({ active, ontToggleSelect }: LoaderScriptProps) => {
	const codes = useUnit($codesModified)
	const t = useTranslation()

	const createCodeFile = async () => {
		const { status, htmlElement } = await showPopup({
			content: props => (
				<CreateCodeForm {...props} codesName={codes.map(({ name }) => name)} />
			),
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
		const { status } = await showConfirm({ content: t('removeFile') })
		if (status === 'ok') removedFileCode(item.id)
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
				]}
			/>
		</div>
	)
}

const CreateCodeForm = ({
	ok,
	cancel,
	codesName,
}: {
	ok: () => void
	cancel: () => void
	codesName: string[]
}) => {
	const t = useTranslation()

	return (
		<form
			onSubmit={e => {
				e.preventDefault()
				const dataForm = htmlFormToJson<{ name: string }>(e.currentTarget)
				const fileExists = !!codesName.find(name => name === dataForm.name)
				if (fileExists) showMessage({ content: t('fileExists') })
				else ok()
			}}
		>
			<div className={'popup-header'}>{t('createScript')}</div>
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
