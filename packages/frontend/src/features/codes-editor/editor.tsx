import { useUnit } from 'effector-react'
import { useMemo } from 'preact/hooks'
import { CodeEditor } from '../../ui'
import { $codesWithCache, changedCode } from './model'
import './styles.scss'

export interface EditorCode {
	active?: string | null
	onSave?: (value: string) => void
}

export const EditorCode = ({ active, onSave }: EditorCode) => {
	const codes = useUnit($codesWithCache)
	const selectCode = useMemo(() => {
		if (!active) return null
		return codes.find(({ name }) => name === active)
	}, [active, codes])

	if (!selectCode) return null
	return (
		<CodeEditor
			value={selectCode.modify ? selectCode.cache || '' : selectCode.content}
			fileName={selectCode.name}
			onSave={value => onSave?.(value)}
			onChange={value => changedCode({ name: selectCode.name, content: value })}
		/>
	)
}
