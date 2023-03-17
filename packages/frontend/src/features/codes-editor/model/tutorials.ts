import { createTutorial } from 'libs/tutorial'
import { createRef } from 'preact'
import { createTutorialPanel } from 'ui'

const codeListRef = createRef<HTMLDivElement>()
const addCodeRef = createRef<HTMLDivElement>()
const loadCodeRef = createRef<HTMLDivElement>()

const tutorialList = createTutorial({
	steps: [
		{
			message:
				'Слева ты видишь список скриптов, наверное он пустой, давай создадим новый скрипт.',
			title: 'Твои скрипты',
			element: () => codeListRef.current,
			viewPosition: 'right',
		},
		{
			element: () => addCodeRef.current,
			message:
				'Нажми на плюсик, чтобы создать новый скрипт для бота. <b>Создастся пример бота.</b>',
			viewPosition: 'bottom-right',
			title: 'Твои скрипты',
		},
		{
			element: () => loadCodeRef.current,
			message: 'Но если вдруг захочешь, ты можешь загрузить свой с компьютера',
			viewPosition: 'bottom-right',
			title: 'Твои скрипты',
		},
	],
	delayStart: 1000,
	view: createTutorialPanel,
	id: 'code-list-tutorial',
})

export { codeListRef, addCodeRef, loadCodeRef, tutorialList }
