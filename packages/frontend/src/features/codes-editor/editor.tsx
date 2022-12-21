import { useUnit } from 'effector-react'
import { useMemo } from 'preact/hooks'
import { CodeEditor } from '../../ui'
import { $codesWithCache, $sessions, changedCode } from './model'
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
		<CodeEditor
			session={session}
			mode="javascript"
			value={selectCode.modify ? selectCode.cache || '' : selectCode.content}
			fileName={selectCode.name}
			onSave={value => onSave?.(value)}
			onChange={value => changedCode({ name: selectCode.name, content: value })}
		/>
	)
}
