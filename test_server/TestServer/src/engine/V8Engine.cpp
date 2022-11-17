#include "V8Engine.h"

#include "helpers/Log.h"

#include <libplatform/libplatform.h>
#include <v8-platform.h>

#include <assert.h>

CV8Engine::~CV8Engine()
{
	if (m_isInitialized)
	{
		// Deinitialize
		v8::V8::Dispose();
		v8::V8::ShutdownPlatform();

		// Release platform
		m_platform.reset();

		LOG_INFO("[V8] The engine is deinitialized\r\n");
	}
}

void CV8Engine::Initialize()
{
	if (m_isInitialized)
	{
		return;
	}

	LOG_INFO("[V8] Initializing engine...\r\n");

	m_platform = v8::platform::NewDefaultPlatform();
	v8::V8::InitializePlatform(m_platform.get());

	m_isInitialized = v8::V8::Initialize();

	// V8::Initialize() always returns true
	// Just in case the engine API is changed
	assert(m_isInitialized == true);

	LOG_INFO("[V8] Intialized!\r\n");
}
