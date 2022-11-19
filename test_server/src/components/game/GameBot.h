#pragma once

#include "engine/V8Engine.h"

class CGameBot
{
public:
	CGameBot();
	~CGameBot();

	/**
	 * Intializes a bot from its script
	 * 
	 * @param botId - a bot number on the scene
	 * @param timeout - init time threshold in ms (-1 means no timeout)
	 * 
	 * @return True if the bit is initialized successfully
	 * 
	 * TODO: replace bool with status enum
	 */
	bool InitializeBot(int32_t botId, int32_t timeout) const;

	// A context for user scripts execution
	v8::THandle m_hBotContext = v8::INVALID_HANDLE;
};
