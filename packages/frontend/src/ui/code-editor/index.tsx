import AceEditor from 'react-ace'
import './styles.scss'
import 'ace-builds/src-noconflict/mode-javascript'
import 'ace-builds/src-noconflict/mode-json'
import 'ace-builds/src-noconflict/theme-tomorrow'
import 'ace-builds/src-noconflict/ext-language_tools'
import { useCallback, useEffect, useRef } from 'preact/hooks'
import { createAndDownloadFile } from 'api'
import { Ace, createEditSession } from 'ace-builds'
import { createTranslation } from 'libs'

interface CodeEditorProps {
	mode?: 'javascript' | 'json'
	onChange?: (value: string) => void
	onSave?: (value: string) => void
	fileName: string
	session?: Ace.EditSession
}

const { useTranslation } = createTranslation({
	ru: {
		save: 'Сохранить',
		saveToDevice: 'Сохранить на устройство',
	},
	en: {
		save: 'Save',
		saveToDevice: 'Save to device',
	},
})

export const CodeEditor = ({
	mode,
	onChange,
	onSave,
	fileName,
	session,
}: CodeEditorProps) => {
	const t = useTranslation()
	const refEditor = useRef<Ace.Editor | null>(null)

	useEffect(() => {
		if (session && refEditor.current) {
			refEditor.current.setSession(session)
		}
	}, [session])

	useEffect(() => {
		return () => {
			if (refEditor.current) {
				//TODO: почему то при анмаунте ace едитора он портит текущую сессию и её потом нельзя использовать
				//@ts-expect-error
				refEditor.current.setSession(createEditSession('', undefined))
			}
		}
	}, [])

	const handlerSave = () => {
		onSave?.(refEditor.current?.getSession().getValue() || '')
	}

	const handlerChange = (value: string) => {
		onChange?.(value)
	}

	const handlerSaveDevise = () => {
		createAndDownloadFile(
			refEditor.current?.getSession().getValue() || '',
			fileName,
			'text/plain'
		)
	}

	const handlerSaveKeyboard = useCallback(
		(e?: KeyboardEvent) => {
			if (e?.ctrlKey && e?.key.toLowerCase() === 's') {
				e.preventDefault()
				onSave?.(refEditor.current?.getSession().getValue() || '')
			}
		},
		[session]
	)

	useEffect(() => {
		document.removeEventListener('keydown', handlerSaveKeyboard)
		document.addEventListener('keydown', handlerSaveKeyboard)
		return () => {
			document.removeEventListener('keydown', handlerSaveKeyboard)
		}
	}, [handlerSaveKeyboard])

	useEffect(() => {
		window.dispatchEvent(new Event('resize'))
	}, [])

	return (
		<div className={'code-editor'}>
			<div className={'toolbar'}>
				<div className={'toolbar-item'} onClick={handlerSave}>
					{t('save')}
				</div>
				<div className={'toolbar-item'} onClick={handlerSaveDevise}>
					{t('saveToDevice')}
				</div>
			</div>
			<AceEditor
				onLoad={editor => {
					refEditor.current = editor
					if (session) {
						editor.setSession(session)
					}
				}}
				onChange={handlerChange}
				className="ace-editor"
				height="100%"
				width="100%"
				fontSize={14}
				mode={mode}
				theme="tomorrow"
				setOptions={{
					enableBasicAutocompletion: true,
					enableLiveAutocompletion: true,
					enableSnippets: true,
					showLineNumbers: true,
					tabSize: 2,
				}}
			/>
		</div>
	)
}
