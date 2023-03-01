import { useUnit } from 'effector-react'
import { $locationSearch } from 'model'
import { ControllerEditorPage } from './controller-editor'
import { GamePage } from './game'
import { MapEditorPage } from './map-editor'
import { ReplaysPage } from './replays'
import { useMemo } from 'react'

export const routesView = Object.freeze({
	routes: [
		{ view: ControllerEditorPage, path: 'controller-editor' },
		{ view: GamePage, path: 'game' },
		{ view: MapEditorPage, path: 'map-editor' },
		{ view: ReplaysPage, path: 'replay' },
	],
	homePath: 'controller-editor',
} as const)

export type RoutesPath = typeof routesView['routes'][number]['path']

export const pathExists = (path: string) => {
	return !!Object.values(routesView.routes).find(route => route.path === path)
}

export const pathIsActive = (targetPath: RoutesPath, currentPath: string) => {
	const _currentPath = pathExists(currentPath)
		? currentPath
		: routesView.homePath
	return targetPath === _currentPath
}

const getViewByPath = (route: string) => {
	const targetView =
		routesView.routes.find(({ path }) => path === route)?.view ??
		routesView.routes.find(({ path }) => path === routesView.homePath)!.view
	return targetView
}

export const RoutesView = () => {
	const { page = '' } = useUnit($locationSearch)
	const TargetView = useMemo(() => getViewByPath(page), [page])
	return <TargetView />
}
