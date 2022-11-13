import { useUnit } from 'effector-react'
import { useMemo } from 'preact/hooks'
import { CodeEditor, SplitPanel } from 'ui'
import { $mapsWithCache, changedMap } from './model'
import './styles.scss'

export interface EditorCode {
	active?: string | null
	onSave?: (value: string) => void
}

let sizes: undefined | number[] = undefined

export const EditorMap = ({ active, onSave }: EditorCode) => {
	const maps = useUnit($mapsWithCache)
	const selectMap = useMemo(() => {
		if (!active) return null
		return maps.find(map => map.name === active) ?? null
	}, [active, maps])

	if (!selectMap) return null

	return (
		<SplitPanel
			onDragEnd={e => {
				sizes = e
			}}
			sizes={sizes}
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
					{!selectMap.validJson ? (
						<div className={'error-valid-json'}>
							Предпросмотр не доступен JSON не валиден
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
