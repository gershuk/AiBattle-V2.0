import { useUnit } from 'effector-react'
import { $locationSearch } from 'model'
import { ControllerEditor } from 'pages/controller-editor'
import { Game } from 'pages/game'
import { MapEditor } from 'pages/map-editor'
import { Replays } from 'pages/replays'
import { useMemo } from 'react'

export const routesView = {
	routes: {
		controllerEditor: { view: ControllerEditor, path: 'controller-editor' },
		game: { view: Game, path: 'game' },
		mapEditor: { view: MapEditor, path: 'map-editor' },
		replay: { view: Replays, path: 'replay' },
	},
	homeRoute: 'controllerEditor' as const,
}

export type RoutesId = keyof typeof routesView['routes']

export const pathExists = (path: string) => {
	return !!Object.values(routesView.routes).find(route => route.path === path)
}

export const routeIsActive = (routeId: RoutesId, path: string) => {
	return pathExists(path)
		? path === routesView.routes[routeId].path
		: routeId === routesView.homeRoute
}

const getViewByPath = (route: string) => {
	const targetView =
		Object.values(routesView.routes).find(({ path }) => path === route)?.view ??
		routesView.routes[routesView.homeRoute].view
	return targetView
}

export const RoutesView = () => {
	const { page = '' } = useUnit($locationSearch)
	const TargetView = useMemo(() => getViewByPath(page), [page])
	return <TargetView />
}
