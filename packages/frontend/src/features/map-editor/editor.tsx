import { createEvent, createStore } from 'effector'
import { useUnit } from 'effector-react'
import { useMemo } from 'preact/hooks'
import { CodeEditor, SplitPanel } from 'ui'
import { $mapsWithCache, changedMap } from './model'
import './styles.scss'

export interface EditorCode {
	active?: string | null
	onSave?: (value: string) => void
}

const $size = createStore<number[]>([50, 50])
const setSize = createEvent<number[]>()
$size.on(setSize, (_, x) => x)

export const EditorMap = ({ active, onSave }: EditorCode) => {
	const { maps, size } = useUnit({ maps: $mapsWithCache, size: $size })
	const selectMap = useMemo(() => {
		if (!active) return null
		return maps.find(map => map.name === active) ?? null
	}, [active, maps])

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
					mode="json"
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
					{!selectMap.modifyJsonValid ? (
						<div className={'error-valid-json'}>
							Предпросмотр не доступен по причине: JSON не валиден
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
