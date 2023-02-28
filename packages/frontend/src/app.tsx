import { SideBar } from 'features/side-bar'
import { readCodesFromLocalStorageFx, readMapsFromLocalStorageFx } from 'model'
import './styles.scss'
import { RoutesView } from 'routing'

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
