import { readCodesFromLocalStorageFx, readMapsFromLocalStorageFx } from 'model'
import { RoutesView, SideBar } from 'pages'
import './styles.scss'

export const App = () => {
	return (
		<div className={'app'}>
			<SideBar />
			<div className={'content'}>
				<RoutesView />
			</div>
		</div>
	)
}

readCodesFromLocalStorageFx()
readMapsFromLocalStorageFx()
