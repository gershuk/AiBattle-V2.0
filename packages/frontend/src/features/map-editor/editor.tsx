import { useUnit } from 'effector-react'
import { createPanelSizeController } from 'libs'
import { MapData } from 'model'
import { useMemo } from 'preact/hooks'
import { CodeEditor, SplitPanel } from 'ui'
import { $mapsWithSessionValue, $sessions } from './model'
import './styles.scss'
import { TileEditor } from './tile-editor'

export interface EditorCode {
	active?: string | null
	onSave?: (value: string) => void
}

const { $sizes, setSizes } = createPanelSizeController(
	window.innerHeight / 2,
	'vertical'
)

export const EditorMap = ({ active, onSave }: EditorCode) => {
	const { maps, sizes, sessions } = useUnit({
		maps: $mapsWithSessionValue,
		sizes: $sizes,
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
		setSizes([...sizesPanel])
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
			sizes={sizes ?? undefined}
			minSize={[0, 0]}
			className="json-map-editor"
			gutterSize={5}
			direction={'vertical'}
			Left={
				<CodeEditor
					session={activeSession}
					fileName={selectMap.name}
					onSave={value => onSave?.(value)}
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
							mapData={selectMap.textEditorMapData as MapData}
							onChange={value => activeSession.doc.setValue(value)}
							onUndo={() => undoManager!.undo(activeSession)}
							onRedo={() => undoManager!.redo(activeSession)}
							onSave={value => {
								activeSession.doc.setValue(value)
								onSave?.(value)
							}}
							modify={selectMap.modified}
							canUndo={undoManager!.canUndo()}
							canRedo={undoManager!.canRedo()}
						/>
					) : null}
				</div>
			}
		/>
	)
}
