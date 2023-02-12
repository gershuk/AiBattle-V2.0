import { SplitPanel } from 'ui'
import { MapsList } from 'features/map-editor'
import { useUnit } from 'effector-react'
import { $selectMap, savedMap, selectedMap } from './model'
import { EditorMap } from 'features/map-editor'
import './styles.scss'
import { createPanelSizeController } from 'libs'

const { $sizes, setSizes } = createPanelSizeController(200)

export const MapEditor = () => {
	const { selectMap, sizes } = useUnit({ selectMap: $selectMap, sizes: $sizes })
	const handlerDragEnd = (sizesPanel: number[]) => {
		setSizes([...sizesPanel])
		window.dispatchEvent(new Event('resize'))
	}

	return (
		<div class={'maps-editor-page'}>
			<SplitPanel
				onDragEnd={handlerDragEnd}
				className={'maps-editor-split'}
				sizes={sizes}
				gutterSize={5}
				minSize={0}
				Left={
					<MapsList active={selectMap?.name} ontToggleSelect={selectedMap} />
				}
				Right={
					<EditorMap
						active={selectMap?.name}
						onSave={value =>
							savedMap({ name: selectMap?.name ?? '', content: value })
						}
					/>
				}
			/>
		</div>
	)
}
