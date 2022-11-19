#pragma once

#include "components/game/GameBot.h"
#include "engine/V8Engine.h"

class CGameScene
{
public:
	CGameScene();
	~CGameScene();

private:
	/**
	 * Evaluates game core and scene scripts
	 */
	void LoadSceneScripts() const;

	/**
	 * Generates initialized bots instances
	 */
	void InitializeBots();

	// A storage for user bots instances
	std::vector<std::unique_ptr<CGameBot>> m_gameBots;

	// A context for scene scripts execution
	// Bots should be executed in separate contexts
	v8::THandle m_hSceneContext = v8::INVALID_HANDLE;
};
