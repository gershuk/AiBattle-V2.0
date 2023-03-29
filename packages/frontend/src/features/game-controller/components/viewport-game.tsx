import { useUnit } from 'effector-react'
import { useEffect, useMemo } from 'preact/hooks'
import { ViewportGame } from 'ui'
import {
	$activeGame,
	$playingGameInfo,
	AliveBot,
	engine,
	gameCanvas,
} from '../model/game'
import './styles.scss'

export const ViewGame = () => {
	const { activeGame, tileSize, mapData, playingGameInfo } = useUnit({
		activeGame: $activeGame,
		tileSize: engine.gameState.$tileSize,
		mapData: engine.gameState.$mapData,
		playingGameInfo: $playingGameInfo,
	})

	useEffect(() => {
		if (activeGame) engine.methods.renderFrame()
	}, [activeGame])

	const bots = useMemo(() => {
		const aliveBot = (playingGameInfo?.botsInfo || []).filter(
			({ status }) => status === 'alive'
		) as AliveBot[]
		return aliveBot.map(bot => ({
			...bot,
			botName: bot.botName ?? bot.codeName,
		}))
	}, [playingGameInfo])

	if (!activeGame) return null
	return (
		<div className={'viewport-game'}>
			<ViewportGame
				canvas={gameCanvas}
				className="awesome-canvas-game"
				tileSize={tileSize ?? 0}
				map={mapData?.map!}
				onChangeTileSize={engine.methods.setTileSize}
				showPlayer
				bots={bots}
			/>
		</div>
	)
}
