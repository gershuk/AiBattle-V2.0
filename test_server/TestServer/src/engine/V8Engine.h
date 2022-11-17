#pragma once

#include "helpers/Singleton.h"
#include <v8.h>

/** A class for V8 JavaScript Engine */
class CV8Engine : public Helpers::CSingleton<CV8Engine>
{
	~CV8Engine();

public:
	/**
	 * Starts up an engine instance
	 */
    void Initialize();

private:
	std::unique_ptr<v8::Platform> m_platform;
	bool m_isInitialized = false;
};
