import AceEditor from 'react-ace'
import './styles.scss'
import 'ace-builds/src-noconflict/mode-javascript'
import 'ace-builds/src-noconflict/theme-tomorrow'
import 'ace-builds/src-noconflict/ext-language_tools'
import { useCallback, useEffect, useState } from 'preact/hooks'
import { createAndDownloadFile } from '../../api'

interface CodeEditorProps {
	onChange?: (value: string) => void
	onSave?: (value: string) => void
	value?: string
	fileName: string
}

export const CodeEditor = ({
	onChange,
	onSave,
	value: valueProps,
	fileName,
}: CodeEditorProps) => {
	const [value, setValue] = useState(valueProps || '')

	useEffect(() => {
		setValue(valueProps)
	}, [valueProps])

	const handlerSave = () => {
		onSave?.(value)
	}

	const handlerChange = (value: string) => {
		setValue(value)
		onChange?.(value)
	}

	const handlerSaveDevise = () => {
		createAndDownloadFile(value, fileName, 'text/plain')
	}

	const handlerSaveKeyboard = useCallback(
		(e?: KeyboardEvent) => {
			if (e.ctrlKey && e.key.toLowerCase() === 's') {
				e.preventDefault()
				onSave?.(value)
			}
		},
		[value]
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
					Сохранить
				</div>
				<div className={'toolbar-item'} onClick={handlerSaveDevise}>
					Сохранить на устройство
				</div>
			</div>
			<AceEditor
				onChange={handlerChange}
				value={value}
				className="ace-editor"
				height="100%"
				width="100%"
				fontSize={14}
				mode="javascript"
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
