import { createEvent, sample } from 'effector'
import { historyMethods } from 'libs'

enum RoutePath {
	controllerEditor = 'controller-editor',
	game = 'game',
	mapEditor = 'map-editor',
}

const changeRoute = createEvent<RoutePath | null>()

sample({
	clock: changeRoute,
	fn: route => ({ page: route ?? '' }),
	target: historyMethods.appendParams,
})

export { RoutePath, changeRoute }
