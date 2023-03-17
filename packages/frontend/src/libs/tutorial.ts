import {
	attach,
	combine,
	createEffect,
	createEvent,
	createStore,
	sample,
} from 'effector'
import { delay } from './delay'
import { stringToJson } from './json-is-valid'

type TutorialsStatus = 'pending' | 'not-started' | 'completed'

const initTutorialsStatus = ((): { [id: string]: TutorialsStatus } => {
	try {
		const { parsedJson } = stringToJson(
			localStorage.getItem('tutorials-statuses') || ''
		)
		return parsedJson || {}
	} catch (error) {
		return {}
	}
})()

const $tutorialsStatus = createStore<{ [id: string]: TutorialsStatus }>(
	initTutorialsStatus
)

const setTutorialStatus = createEvent<{ id: string; status: TutorialsStatus }>()

//инициализирует статус туторила, если его нет или он не 'completed' то создает запись со статусом 'not-started'
const initTutorial = createEvent<{ id: string }>()

const saveTutorialsStatusFx = attach({
	source: $tutorialsStatus,
	effect: tutorials => {
		localStorage.setItem('tutorials-statuses', JSON.stringify(tutorials))
	},
})

$tutorialsStatus.on(setTutorialStatus, (tutorials, { id, status }) => ({
	...tutorials,
	[id]: status,
}))

$tutorialsStatus.on(initTutorial, (tutorials, { id }) => ({
	...tutorials,
	[id]: tutorials?.[id] === 'completed' ? 'completed' : 'not-started',
}))

sample({ clock: $tutorialsStatus, target: saveTutorialsStatusFx })

interface TutorialStep {
	element?: null | HTMLElement | (() => HTMLElement | null)
	title?: string | (() => string) // html like content
	message: string | (() => string) // html like content
	viewPosition?:
		| 'top'
		| 'bottom'
		| 'right'
		| 'left'
		| 'bottom-right'
		| 'top-right'
		| 'top-left'
		| 'bottom-left'
}

export interface ViewParams {
	data: {
		message: string
		title?: string
	}
	stepIndex: number
	lastIndex: number
	canBack: boolean
	back: () => void
	canNext: boolean
	next: () => void
	selectedElement: HTMLElement | null
	close: () => void
	style: Partial<CSSStyleDeclaration>
}

interface Tutorial {
	steps: TutorialStep[]
	delayStart?: number
	view: (params: ViewParams) => HTMLElement
	id: string
}

export const createTutorial = ({
	steps,
	delayStart = 0,
	view: viewCreator,
	id,
}: Tutorial) => {
	initTutorial({ id })

	const $show = createStore(false)
	const $view = createStore<{
		view: HTMLElement | null
		selectedContainer: HTMLDivElement | null
		overlay: HTMLDivElement | null
	}>({ view: null, selectedContainer: null, overlay: null })
	const $status = $tutorialsStatus.map(tutorials => tutorials[id])

	const $steps = createStore(steps)
	const $activeIndexStep = createStore<number | null>(null)

	const $currentStep = combine(
		$steps,
		$activeIndexStep,
		$show,
		(steps, index, show) =>
			show && typeof index === 'number' ? steps[index] : null
	)

	const setActiveIndexStep = createEvent<number>()

	const close = createEvent()
	const resetStatus = createEvent()

	/**
	 * всегда запускает туториал
	 */
	const show = createEffect(() => delay(delayStart))

	/**
	 * запускает туториал только тогда когда его статус равен not-started
	 */
	const start = createEvent()

	const createViewFx = attach({
		source: [$view, $currentStep, $activeIndexStep, $steps],
		effect: ([
			{ view, selectedContainer: _selectedContainer, overlay: _overlay },
			currentStep,
			activeIndexStep,
			steps,
		]) => {
			if (view) view.remove()
			if (_selectedContainer) _selectedContainer.remove()
			if (_overlay) _overlay.remove()
			if (!currentStep || typeof activeIndexStep !== 'number')
				return { view: null, selectedContainer: null, overlay: null }
			const { element: rawElement, viewPosition } = currentStep
			const element =
				typeof rawElement === 'function' ? rawElement() : rawElement

			const overlay = document.createElement('div')
			overlay.classList.add('tutorial-selected-overlay')
			overlay.style.position = 'fixed'
			overlay.style.left = '0'
			overlay.style.top = '0'
			overlay.style.width = '100vw'
			overlay.style.height = '100vh'
			overlay.style.zIndex = '98'
			document.body.appendChild(overlay)

			const selectedContainer = document.createElement('div')
			selectedContainer.classList.add('tutorial-selected-container')
			selectedContainer.style.position = 'fixed'
			selectedContainer.style.boxShadow = `var(--color-overlay) 0px 0px 0px 5000px`
			selectedContainer.style.zIndex = '99'
			document.body.appendChild(selectedContainer)

			let styleView: Partial<CSSStyleDeclaration> = {
				zIndex: '99',
				position: 'fixed',
			}

			if (element) {
				const boundary = element.getBoundingClientRect()

				selectedContainer.style.top = `${boundary.top}px`
				selectedContainer.style.left = `${boundary.left}px`
				selectedContainer.style.width = `${boundary.width}px`
				selectedContainer.style.height = `${boundary.height}px`

				styleView = ((): Partial<CSSStyleDeclaration> => {
					if (viewPosition === 'right')
						return {
							...styleView,
							left: `${boundary.left + boundary.width + 10}px`,
							top: `${boundary.height / 2}px`,
							transform: `translate(0, -50%)`,
						}
					if (viewPosition === 'left')
						return {
							...styleView,
							left: `${boundary.left - 10}px`,
							top: `${boundary.height / 2}px`,
							transform: `translate(-100%, -50%)`,
						}
					if (viewPosition === 'bottom')
						return {
							...styleView,
							left: `${boundary.width / 2}px`,
							top: `${boundary.top + boundary.height + 10}px`,
							transform: `translate(0, 0)`,
						}
					if (viewPosition === 'top')
						return {
							...styleView,
							left: `${boundary.width / 2}px`,
							top: `${boundary.top - 10}px`,
							transform: `translate(0, -100%)`,
						}
					if (viewPosition === 'bottom-right')
						return {
							...styleView,
							left: `${boundary.left + boundary.width + 10}px`,
							top: `${boundary.top + boundary.height + 10}px`,
							transform: `translate(0, 0)`,
						}
					if (viewPosition === 'top-right')
						return {
							...styleView,
							left: `${boundary.left + boundary.width + 10}px`,
							top: `${boundary.top - 10}px`,
							transform: `translate(0, -100%)`,
						}
					if (viewPosition === 'top-left')
						return {
							...styleView,
							left: `${boundary.left - 10}px`,
							top: `${boundary.top - 10}px`,
							transform: `translate(-100%, -100%)`,
						}
					if (viewPosition === 'bottom-left')
						return {
							...styleView,
							left: `${boundary.left - 10}px`,
							top: `${boundary.top + boundary.height + 10}px`,
							transform: `translate(-100%, 0)`,
						}
					return {}
				})()
			} else {
				selectedContainer.style.top = '50%'
				selectedContainer.style.left = '50%'
				selectedContainer.style.width = '0'
				selectedContainer.style.height = '0'

				styleView = {
					...styleView,
					left: '50%',
					top: '50%',
					transform: `translate(-50%, -50%)`,
				}
			}

			const canBack = activeIndexStep !== 0
			const canNext = activeIndexStep !== steps.length - 1
			const newView = viewCreator({
				data: {
					title:
						typeof currentStep.title === 'function'
							? currentStep.title()
							: currentStep.title,
					message:
						typeof currentStep.message === 'function'
							? currentStep.message()
							: currentStep.message,
				},
				stepIndex: activeIndexStep,
				lastIndex: steps.length - 1,
				canBack: canBack,
				back: () => {
					if (canBack) setActiveIndexStep(activeIndexStep - 1)
				},
				canNext: activeIndexStep !== steps.length - 1,
				next: () => {
					if (canNext) setActiveIndexStep(activeIndexStep + 1)
				},
				selectedElement: element ?? null,
				close: close,
				style: styleView,
			})

			newView.style.left = styleView?.left ?? newView.style.left
			newView.style.top = styleView?.top ?? newView.style.top
			newView.style.transform = styleView?.transform ?? newView.style.transform
			newView.style.position = styleView?.position ?? newView.style.position
			newView.style.position = styleView?.position ?? newView.style.position
			newView.style.zIndex = styleView?.zIndex ?? newView.style.zIndex

			document.body.appendChild(newView)
			return { view: newView, selectedContainer, overlay }
		},
	})

	const removeViewFx = attach({
		source: $view,
		effect: ({ view, selectedContainer, overlay }) => {
			if (view) view.remove()
			if (selectedContainer) selectedContainer.remove()
			if (overlay) overlay.remove()
			return null
		},
	})

	$activeIndexStep.on(setActiveIndexStep, (_, i) => i)

	$show.on(show.doneData, () => true)
	$show.on(close, () => false)

	sample({
		clock: show,
		fn: () => 0,
		target: setActiveIndexStep,
	})

	sample({
		clock: show,
		fn: () => ({ status: 'pending' as const, id }),
		target: setTutorialStatus,
	})

	sample({
		clock: [show.doneData, setActiveIndexStep],
		target: createViewFx,
	})

	sample({
		clock: close,
		target: removeViewFx,
	})

	sample({
		clock: close,
		fn: () => ({ status: 'completed' as const, id }),
		target: setTutorialStatus,
	})

	sample({
		clock: createViewFx.doneData,
		target: $view,
	})

	sample({
		clock: removeViewFx.doneData,
		fn: () => ({ view: null, selectedContainer: null, overlay: null }),
		target: $view,
	})

	sample({
		clock: resetStatus,
		fn: () => ({ status: 'not-started' as const, id }),
		setTutorialStatus,
	})

	sample({
		clock: start,
		filter: $status.map(status => status === 'not-started'),
		target: show,
	})

	createViewFx.fail.watch(console.error)

	return { $status, start, show, close, resetStatus, setActiveIndexStep }
}
