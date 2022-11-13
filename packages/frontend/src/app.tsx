import { useUnit } from 'effector-react'
import { Game } from 'pages/game'
import { SideBar } from 'features/side-bar'
import { $locationSearch } from 'model'
import { ControllerEditor } from 'pages/controller-editor'
import './styles.scss'
import { MapEditor } from 'pages/map-editor'

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
	}
	return null
}
