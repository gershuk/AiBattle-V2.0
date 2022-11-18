#pragma once

#include "engine/V8Engine.h"

class CTestManager
{

public:
	CTestManager();
	~CTestManager();

private:
	void LoadScripts() const;

	// A context for scene scripts execution
	// Bots should be executed in separate contexts
	v8::THandle m_hSceneContext = v8::INVALID_HANDLE;
};
