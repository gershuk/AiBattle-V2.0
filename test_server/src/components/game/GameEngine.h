#pragma once

#include "engine/V8Engine.h"

class CGameEngine
{
public:
	void Start();
	void RenderFrame();
	void DoNextTurn();
	void StopAutoTurn();
	void StartAutoTurn();
};
