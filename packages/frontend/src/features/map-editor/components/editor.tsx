import { useUnit } from 'effector-react'
import {
	createFontSizeController,
	createPanelSizeController,
	createTranslation,
} from 'libs'
import { MapData } from 'model'
import { useMemo } from 'preact/hooks'
import { CodeEditor, SplitPanel } from 'ui'
import { $mapsWithSessionValue, $sessions } from '../model'
import './styles.scss'
import { TileEditor } from './tile-editor'

export interface EditorCode {
	active?: string | null
	onSave?: (value: string) => void
}

const { $sizes, setSizes } = createPanelSizeController(
	window.innerHeight / 2,
	'vertical',
	'map-and-tile-editor'
)

const { $fontSize, changedFontSize } = createFontSizeController(
	14,
	'map-editor'
)

const { useTranslation } = createTranslation({
	ru: {
		jsonInvalid: 'JSON не валиден',
		mapInvalid: 'Структура JSON не соответствует карте',
	},
	en: {
		jsonInvalid: 'Invalid JSON',
		mapInvalid: `JSON's structure does not match the map`,
	},
})

export const EditorMap = ({ active, onSave }: EditorCode) => {
	const t = useTranslation()
	const { maps, sizes, sessions, fontSize } = useUnit({
		maps: $mapsWithSessionValue,
		sizes: $sizes,
		sessions: $sessions,
		fontSize: $fontSize,
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
				activeSession ? (
					<CodeEditor
						session={activeSession}
						fileName={selectMap.name}
						onSave={value => onSave?.(value)}
						fontSize={fontSize}
						onChangeFontSize={changedFontSize}
					/>
				) : null
			}
			Right={
				<div className={'preview-map'}>
					{!selectMap.modifyJsonValid || !selectMap.modifyValidDataMap ? (
						<div className={'error-valid-json'}>
							{t(!selectMap.modifyJsonValid ? 'jsonInvalid' : 'mapInvalid')}
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
