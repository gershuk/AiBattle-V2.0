import { useUnit } from 'effector-react'
import { $selectedMap } from '../model/select-map'
import './styles.scss'

export const MapInfo = () => {
	const activeMap = useUnit($selectedMap)
	return (
		<div className={'map-info'}>
			<div className={'title'}>Информация о карте</div>
			<div className={'infos-list'}>
				<div>Ширина - {activeMap?.data?.width}</div>
				<div>Высота - {activeMap?.data?.height}</div>
				<div>Количество ботов - {activeMap?.data?.spawns.length}</div>
				<div>Ходов на игру - {activeMap?.data?.turns}</div>
			</div>
		</div>
	)
}
