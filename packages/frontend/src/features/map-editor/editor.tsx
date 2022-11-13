import { useUnit } from 'effector-react'
import { $dataMaps } from 'model'
import { useMemo } from 'preact/hooks'
import { CodeEditor } from 'ui'
import { $mapsWithCache, changedMap } from './model'
import './styles.scss'

export interface EditorCode {
	active?: string | null
	onSave?: (value: string) => void
}

export const EditorMap = ({ active, onSave }: EditorCode) => {
	const maps = useUnit($mapsWithCache)
	const selectMap = useMemo(() => {
		if (!active) return null
		return maps.find(map => map.name === active) ?? null
	}, [active, maps])

	if (!selectMap) return null
	return (
		<CodeEditor
			mode="json"
			value={selectMap.modify ? selectMap.cache || '' : selectMap.content}
			fileName={selectMap.name}
			onSave={value => onSave?.(value)}
			onChange={value => changedMap({ name: selectMap.name, content: value })}
		/>
	)
}
