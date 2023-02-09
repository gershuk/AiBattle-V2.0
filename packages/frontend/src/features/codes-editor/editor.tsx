import { useUnit } from 'effector-react'
import { useMemo } from 'preact/hooks'
import { CodeEditor, SplitPanel } from '../../ui'
import { Debug } from './debug'
import { $codesWithCache, $sessions } from './model'
import './styles.scss'

export interface EditorCode {
	active?: string | null
	onSave?: (value: string) => void
}

export const EditorCode = ({ active, onSave }: EditorCode) => {
	const { codes, sessions } = useUnit({
		codes: $codesWithCache,
		sessions: $sessions,
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

	return (
		<SplitPanel
			minSize={[0, 0]}
			className="json-map-editor"
			gutterSize={5}
			direction={'vertical'}
			Left={
				<CodeEditor
					session={session}
					mode="javascript"
					fileName={selectCode.name}
					onSave={value => onSave?.(value)}
				/>
			}
			Right={<Debug />}
		/>
	)
}
