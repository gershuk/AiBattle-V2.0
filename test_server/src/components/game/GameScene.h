#pragma once

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

private:
	// A context for scene scripts execution
	// Bots should be executed in separate contexts
	v8::THandle m_hSceneContext = v8::INVALID_HANDLE;
};
