import { createSourceTranslation } from 'libs'

export const GAME_ENGINE_TRANSLATION = createSourceTranslation({
	ru: {
		'sceneParams.tileSizeScale': 'Начальный размер тайла',
		'sceneParams.maxTurnIndex': 'Максимальное количество ходов',
		'sceneParams.animTicksCount': 'Количество тиков проигрывания анимации',
		'sceneParams.animTicksTime': 'Время тика анимации',
		'sceneParams.autoTurnTime': 'Время между ходами',
		'sceneParams.initTimeout': 'Тайм-аут инициализации',
		'sceneParams.commandCalcTimeout': 'Тайм-аут расчета команды',
	},
	en: {
		'sceneParams.tileSizeScale': 'Init tile size',
		'sceneParams.maxTurnIndex': 'Maximum number of moves',
		'sceneParams.animTicksCount': 'Number of ticks to play animation',
		'sceneParams.animTicksTime': 'Animation tick time',
		'sceneParams.autoTurnTime': 'Time between turns',
		'sceneParams.initTimeout': 'Initialization timeout',
		'sceneParams.commandCalcTimeout': 'Command calculation timeout',
	},
})
