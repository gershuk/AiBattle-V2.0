import { useUnit } from 'effector-react'
import { createTranslation } from 'libs'
import { $playingGameInfo } from '../../model'
import './styles.scss'

const { useTranslation } = createTranslation({
	ru: {
		configGame: 'Конфигурация игры',
	},
	en: {
		configGame: 'Game configuration',
	},
})

export const PlayingGameInfo = () => {
	const t = useTranslation()
	const playingGameInfo = useUnit($playingGameInfo)
	if (!playingGameInfo) return null
	return (
		<div className={'playing-game-info'}>
			<div className={'title'}>{t('configGame')}</div>
			<div className={'wrapper-steps'}>
				Шаг {playingGameInfo.currentStep} из {playingGameInfo.maxStep}
			</div>
			<div className={'bots-length-wrapper'}>
				Осталось {playingGameInfo.currentBotsCount} ботов из{' '}
				{playingGameInfo.botsCount}
			</div>
			<div className={'status-bots-game-wrapper'}>
				Боты:
				<div>
					{playingGameInfo.botsInfo.map(bot => {
						return (
							<div key={bot.guid} className={'status-bot-game'}>
								<span
									title={`${bot.botName} (${bot.codeName})`}
									className={'status-bot-game-name'}
								>
									<b>{bot.botName}</b> ({bot.codeName})
								</span>
								{bot.status === 'alive' ? (
									<span className={'status-bot-game-position'}>
										x:{bot.position.x} y:{bot.position.y}
									</span>
								) : (
									<span className={'status-bot-game-die'}>died</span>
								)}
							</div>
						)
					})}
				</div>
			</div>
		</div>
	)
}
