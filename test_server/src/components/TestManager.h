#pragma once

#include "components/game/GameScene.h"

class CTestManager
{
public:
	CTestManager();

private:
	std::unique_ptr<CGameScene> m_gameScene;
};
