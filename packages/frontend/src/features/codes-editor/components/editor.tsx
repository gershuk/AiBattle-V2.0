import { useUnit } from 'effector-react'
import { createFontSizeController, createPanelSizeController } from 'libs'
import { useMemo } from 'preact/hooks'
import { CodeEditor, SplitPanel } from 'ui'
import { Debug } from './debug'
import { $codesModified, $sessions } from '../model'
import './styles.scss'

export interface EditorCode {
	active?: string | null
	onSave?: (value: string) => void
}

const { $sizes, setSizes } = createPanelSizeController(
	window.innerHeight / 2,
	'vertical'
)

const { $fontSize, changedFontSize } = createFontSizeController(
	14,
	'code-editor'
)

export const EditorCode = ({ active, onSave }: EditorCode) => {
	const { codes, sessions, sizes, fontSize } = useUnit({
		codes: $codesModified,
		sessions: $sessions,
		sizes: $sizes,
		fontSize: $fontSize,
	})
	const selectCode = useMemo(() => {
		if (!active) return null
		return codes.find(({ name }) => name === active)
	}, [active, codes])

	const session = useMemo(() => {
		if (selectCode) return sessions[selectCode.name]
		return undefined
	}, [sessions, codes, selectCode])

	if (!selectCode) return null

	const handlerDragEnd = (sizesPanel: number[]) => {
		setSizes([...sizesPanel])
		window.dispatchEvent(new Event('resize'))
	}

	return (
		<SplitPanel
			onDragEnd={handlerDragEnd}
			minSize={[0, 0]}
			sizes={sizes}
			className="split-bot-editor"
			gutterSize={5}
			direction={'vertical'}
			Left={
				session ? (
					<CodeEditor
						session={session}
						fileName={selectCode.name}
						onSave={value => onSave?.(value)}
						fontSize={fontSize}
						onChangeFontSize={changedFontSize}
					/>
				) : null
			}
			Right={<Debug selectedCodeName={selectCode.name} />}
		/>
	)
}
