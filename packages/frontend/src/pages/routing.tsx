import { useUnit } from 'effector-react'
import { ControllerEditorPage } from './controller-editor'
import { GamePage } from './game'
import { MapEditorPage } from './map-editor'
import { useMemo } from 'react'
import { OtherwisePage } from './otherwise'
import { $locationSearch } from 'libs'
import { RoutePath } from 'model'

export const routesView = Object.freeze({
	routes: [
		{ view: ControllerEditorPage, path: RoutePath.controllerEditor },
		{ view: GamePage, path: RoutePath.game },
		{ view: MapEditorPage, path: RoutePath.mapEditor },
	],
	otherwise: OtherwisePage,
} as const)


export const pathExists = (path: string) => {
	return !!Object.values(routesView.routes).find(route => route.path === path)
}

export const pathIsActive = (targetPath: RoutePath, currentPath: string) => {
	return pathExists(currentPath) && targetPath === currentPath
}

const getViewByPath = (route: string) => {
	const targetView =
		routesView.routes.find(({ path }) => path === route)?.view ??
		routesView.otherwise
	return targetView
}

export const RoutesView = () => {
	const { page = '' } = useUnit($locationSearch)
	const TargetView = useMemo(() => getViewByPath(page), [page])
	return <TargetView />
}
