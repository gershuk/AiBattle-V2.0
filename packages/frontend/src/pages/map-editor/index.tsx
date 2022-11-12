import { useMemo } from 'preact/hooks'
import { SplitPanel } from 'ui'
import { MapsList } from 'features/map-editor'
import './styles.scss'
import { useUnit } from 'effector-react'
import { $selectMap, selectedMap } from './model'

export const MapEditor = () => {
	const selectMap = useUnit($selectMap)
	const sizes = useMemo(() => {
		const width = window.innerWidth
		const r = (300 / width) * 100
		return [r, 100 - r]
	}, [])
	return (
		<div class={'maps-editor-page'}>
			<SplitPanel
				className={'maps-editor-split'}
				sizes={sizes}
				gutterSize={3}
				minSize={0}
				Left={
					<MapsList active={selectMap?.name} ontToggleSelect={selectedMap} />
				}
				Right={null}
			/>
		</div>
	)
}
