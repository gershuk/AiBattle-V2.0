import { useUnit } from 'effector-react'
import { createTranslation } from 'libs'
import { Checkbox } from 'ui'
import { $formValues, $playingGameInfo, setFieldValue } from '../../model'
import './styles.scss'

const { useTranslation } = createTranslation({
	ru: {
		title: 'Информация об игре',
		currentStep: (current: number, max: number) => `Шаг ${current} из ${max}`,
		remainingBots: (currentBots: number, max: number) =>
			`Осталось ${currentBots} ботов из ${max}`,
		bots: 'Боты:',
		died: 'умер',
	},
	en: {
		title: 'Game information',
		currentStep: (current: number, max: number) => `Step ${current} of ${max}`,
		remainingBots: (currentBots: number, max: number) =>
			`${currentBots} bots left out of  ${max}`,
		bots: 'Bots:',
		died: 'died',
	},
})

export const PlayingGameInfo = () => {
	const t = useTranslation()
	const { playingGameInfo, formValues } = useUnit({
		playingGameInfo: $playingGameInfo,
		formValues: $formValues,
	})
	if (!playingGameInfo) return null
	return (
		<div className={'playing-game-info'}>
			<div className={'title'}>{t('title')}</div>
			<div className={'wrapper-steps'}>
				{t(x =>
					x.currentStep(playingGameInfo.currentStep, playingGameInfo.maxStep)
				)}
			</div>
			<div className={'bots-length-wrapper'}>
				{t(x =>
					x.remainingBots(
						playingGameInfo.currentBotsCount,
						playingGameInfo.botsCount
					)
				)}
			</div>
			<div className={'show-name-bots'}>
				<Checkbox
					initValue={formValues.showPlayerName}
					label={'Показать имена ботов'}
					onChange={value =>
						setFieldValue({ fieldName: 'showPlayerName', value })
					}
				/>
			</div>
			<div className={'status-bots-game-wrapper'}>
				<div>{t('bots')}</div>
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
									<span className={'status-bot-game-die'}>{t('died')}</span>
								)}
							</div>
						)
					})}
				</div>
			</div>
		</div>
	)
}
