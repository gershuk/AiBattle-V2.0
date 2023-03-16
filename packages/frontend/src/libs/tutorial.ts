import {
	attach,
	combine,
	createEffect,
	createEvent,
	createStore,
	sample,
} from 'effector'
import { delay } from './delay'

interface TutorialStep {
	element?: null | HTMLElement | (() => HTMLElement | null)
	title?: string
	message: string // html like content
	viewPosition?:
		| 'top'
		| 'down'
		| 'right'
		| 'left'
		| 'bottom-right'
		| 'top-right'
}

export interface ViewParams {
	data: TutorialStep
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
}

export const createTutorial = ({
	steps,
	delayStart = 0,
	view: viewCreator,
}: Tutorial) => {
	const $show = createStore(false)
	const $view = createStore<{
		view: HTMLElement | null
		selectedContainer: HTMLDivElement | null
		overlay: HTMLDivElement | null
	}>({ view: null, selectedContainer: null, overlay: null })

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
	const show = createEffect(() => delay(delayStart))

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
				document.body.appendChild(selectedContainer)

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
					if (viewPosition === 'down')
						return {
							...styleView,
							left: `${boundary.width / 2}px`,
							top: `${boundary.top + boundary.height + 10}px`,
							transform: `translate(-50%, 0)`,
						}
					if (viewPosition === 'top')
						return {
							...styleView,
							left: `${boundary.width / 2}px`,
							top: `${boundary.top - 10}px`,
							transform: `translate(-50%, -100%)`,
						}
					if (viewPosition === 'bottom-right')
						return {
							...styleView,
							left: `${boundary.left + boundary.width + 10}px`,
							top: `${boundary.top + boundary.height}px`,
							transform: `translate(0, 0)`,
						}
					if (viewPosition === 'top-right')
						return {
							...styleView,
							left: `${boundary.left + boundary.width + 10}px`,
							top: `${boundary.top}px`,
							transform: `translate(0, -100%)`,
						}
					return {}
				})()
			} else {
				selectedContainer.style.top = '50%'
				selectedContainer.style.left = '50%'

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
				data: currentStep,
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
		clock: [show.doneData, setActiveIndexStep],
		target: createViewFx,
	})

	sample({
		clock: close,
		target: removeViewFx,
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

	createViewFx.fail.watch(console.error)

	return { show, close, setActiveIndexStep }
}
