import { useUnit } from 'effector-react'
import { useEffect } from 'preact/hooks'
import { ViewportGame } from 'ui/viewport-game'
import { $activeGame, engine, gameCanvas } from '../model/game'
import './styles.scss'

export const ViewGame = () => {
	const { activeGame, tileSize, mapData } = useUnit({
		activeGame: $activeGame,
		tileSize: engine.gameState.$tileSize,
		mapData: engine.gameState.$mapData,
	})

	useEffect(() => {
		if (activeGame) engine.methods.renderFrame()
	}, [activeGame])

	if (!activeGame) return null
	return (
		<div className={'viewport-game'}>
			<ViewportGame
				canvas={gameCanvas}
				className="awesome-canvas-game"
				tileSize={tileSize ?? 0}
				map={mapData?.map!}
				onChangeTileSize={engine.methods.setTileSize}
			/>
		</div>
	)
}
