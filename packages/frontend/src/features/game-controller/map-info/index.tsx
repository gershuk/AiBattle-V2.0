import { useUnit } from 'effector-react'
import { $selectedMap } from '../model/select-map'
import './styles.scss'

export const MapInfo = () => {
	const activeMap = useUnit($selectedMap)
	return (
		<div className={'map-info'}>
			<div className={'title'}>Информация о карте</div>
			<div className={'infos-list'}>
				<div>Ширина - {activeMap?.data?.map?.[0]?.length}</div>
				<div>Высота - {activeMap?.data?.map?.length}</div>
				<div>Количество ботов - {activeMap?.data?.spawns.length}</div>
			</div>
		</div>
	)
}
