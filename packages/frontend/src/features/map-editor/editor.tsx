import { createEvent, createStore } from 'effector'
import { useUnit } from 'effector-react'
import { MapData } from 'model'
import { useMemo } from 'preact/hooks'
import { CodeEditor, SplitPanel } from 'ui'
import { $mapsWithCache, $sessions, changedMap } from './model'
import './styles.scss'
import { TileEditor } from './tile-editor'

export interface EditorCode {
	active?: string | null
	onSave?: (value: string) => void
}

const $size = createStore<number[]>([50, 50])
const setSize = createEvent<number[]>()
$size.on(setSize, (_, x) => x)

export const EditorMap = ({ active, onSave }: EditorCode) => {
	const { maps, size, sessions } = useUnit({
		maps: $mapsWithCache,
		size: $size,
		sessions: $sessions,
	})
	const selectMap = useMemo(() => {
		if (!active) return null
		return maps.find(map => map.name === active) ?? null
	}, [active, maps])

	const activeSession = useMemo(() => {
		if (selectMap) return sessions[selectMap.name]
		return undefined
	}, [selectMap, sessions])

	const handlerDragEnd = (sizesPanel: number[]) => {
		setSize([...sizesPanel])
		window.dispatchEvent(new Event('resize'))
	}

	const undoManager = useMemo(() => {
		if (activeSession) return activeSession.getUndoManager()
		return undefined
	}, [activeSession])

	if (!selectMap) return null
	return (
		<SplitPanel
			onDragEnd={handlerDragEnd}
			sizes={size ?? undefined}
			minSize={[0, 0]}
			className="json-map-editor"
			gutterSize={5}
			direction={'vertical'}
			Left={
				<CodeEditor
					session={activeSession}
					fileName={selectMap.name}
					onSave={value => onSave?.(value)}
					onChange={value =>
						changedMap({ name: selectMap.name, content: value })
					}
				/>
			}
			Right={
				<div className={'preview-map'}>
					{!selectMap.modifyJsonValid || !selectMap.modifyValidDataMap ? (
						<div className={'error-valid-json'}>
							Предпросмотр не доступен по причине:{' '}
							{!selectMap.modifyJsonValid
								? 'JSON не валиден'
								: 'структура JSON не соответствует карте'}
						</div>
					) : activeSession ? (
						<TileEditor
							mapData={selectMap.cacheMapData as MapData}
							onChange={value => activeSession.doc.setValue(value)}
							onUndo={() => undoManager!.undo(activeSession)}
							onRedo={() => undoManager!.redo(activeSession)}
							onSave={value => {
								activeSession.doc.setValue(value)
								onSave?.(value)
							}}
							modify={selectMap.modify}
							canUndo={undoManager!.canUndo()}
							canRedo={undoManager!.canRedo()}
						/>
					) : null}
				</div>
			}
		/>
	)
}
