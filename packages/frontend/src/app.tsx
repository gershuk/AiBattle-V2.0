import { useUnit } from 'effector-react'
import { Game } from 'pages/game'
import { SideBar } from 'features/side-bar'
import { $locationSearch } from 'model'
import { ControllerEditor } from 'pages/controller-editor'
import { MapEditor } from 'pages/map-editor'
import './styles.scss'

export const App = () => {
	return (
		<div className={'app'}>
			<SideBar />
			<div className={'content'}>
				<SwitchPage />
			</div>
		</div>
	)
}

//TODO: вынести роутинг в отдельный контролер и сделать хорошо
const SwitchPage = () => {
	const { page = '' } = useUnit($locationSearch)
	switch (page) {
		case '':
		case 'controller-editor':
			return <ControllerEditor />
		case 'game':
			return <Game />
		case 'map-editor':
			return <MapEditor />
	}
	return null
}
