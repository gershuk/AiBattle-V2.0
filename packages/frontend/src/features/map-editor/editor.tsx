import { createEvent, createStore } from 'effector'
import { useUnit } from 'effector-react'
import { useMemo } from 'preact/hooks'
import { CodeEditor, SplitPanel } from 'ui'
import { $mapsWithCache, $sessions, changedMap } from './model'
import './styles.scss'

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
					value={selectMap.modify ? selectMap.cache ?? '' : selectMap.content}
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
					) : (
						<>
							<div className={'title'}>Предпросмотр</div>
							<div className={'text-content'}>
								когда-нибудь это будет сделано
							</div>
						</>
					)}
				</div>
			}
		/>
	)
}
