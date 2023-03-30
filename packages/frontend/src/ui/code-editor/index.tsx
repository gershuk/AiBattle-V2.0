import { Ace, createEditSession } from 'ace-builds'
import AceEditor from 'react-ace'
import './styles.scss'
import 'ace-builds/src-noconflict/theme-tomorrow'
import 'ace-builds/src-noconflict/ext-language_tools'
import { useEffect, useRef } from 'preact/hooks'
import { createTranslation, createAndDownloadFile, useKeyboard } from 'libs'
import { useMemo } from 'react'

interface CodeEditorProps {
	onChange?: (value: string) => void
	onSave?: (value: string) => void
	fileName: string
	session: Ace.EditSession
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
	onChange,
	onSave,
	fileName,
	session,
}: CodeEditorProps) => {
	const t = useTranslation()
	const refEditor = useRef<Ace.Editor | null>(null)
	const mode = useMemo(() => session.getMode(), [session])

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

	useKeyboard({
		filter: ({ key, ctrlKey }) => ctrlKey && key.toLowerCase() === 's',
		fn: () => onSave?.(refEditor.current?.getSession().getValue() || ''),
		dependencies: [onSave, session],
	})

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
					enableSnippets: false,
					showLineNumbers: true,
					tabSize: 2,
				}}
			/>
		</div>
	)
}
