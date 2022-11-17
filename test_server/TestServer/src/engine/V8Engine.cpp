#include "V8Engine.h"

#include "helpers/Log.h"

#include <libplatform/libplatform.h>
#include <v8-platform.h>

#include <assert.h>

namespace v8
{

static THandle MakeHandle()
{
	static THandle hNextHandle = 0;
	return hNextHandle++;
}

CEngine::~CEngine()
{
	if (m_isInitialized)
	{
		ArrayBuffer::Allocator* pIsolateAllocator = m_pIsolate->GetArrayBufferAllocator();

		// Deinitialize
		m_pIsolate->Dispose();
		V8::Dispose();
		V8::DisposePlatform();

		delete pIsolateAllocator;

		LOG_INFO("[V8] The engine is deinitialized\r\n");
	}
}

bool CEngine::Initialize()
{
	if (m_isInitialized)
	{
		return true;
	}

	LOG_INFO("[V8] Initializing engine...\r\n");

	// Create engine isolate allocator
	ArrayBuffer::Allocator* pIsolateAllocator = ArrayBuffer::Allocator::NewDefaultAllocator();
	if (pIsolateAllocator == NULL)
	{
		LOG_INFO("[V8] Failed to create an isolate allocator\r\n");
		return false;
	}

	m_platform = platform::NewDefaultPlatform();
	V8::InitializePlatform(m_platform.get());

	const bool isV8Initialized = V8::Initialize();

	// V8::Initialize() always returns true
	// Just in case the engine API is changed
	assert(isV8Initialized == true);

	Isolate::CreateParams isolateCreateParams;
	isolateCreateParams.array_buffer_allocator = pIsolateAllocator;
	m_pIsolate = Isolate::New(isolateCreateParams);
	if (m_pIsolate == NULL)
	{
		LOG_INFO("[V8] Failed to create an isolate\r\n");
		delete pIsolateAllocator;
		return false;
	}

	m_isInitialized = true;

	LOG_INFO("[V8] Intialized!\r\n");

	return true;
}

THandle CEngine::CreateContext()
{
	if (!m_isInitialized)
	{
		return INVALID_HANDLE;
	}

	Isolate::Scope isolateScope(m_pIsolate);
	HandleScope handleScope(m_pIsolate);

	Local<Context> localContext = Context::New(m_pIsolate);
	THandle hContext = MakeHandle();

	TScriptContext newContext;
	newContext.Reset(m_pIsolate, localContext);
	m_contextsMap.insert({ hContext, std::move(newContext) });

	return hContext;
}

void CEngine::CloseContext(THandle hContext)
{
	if (!m_isInitialized)
	{
		return;
	}

	auto it = m_contextsMap.find(hContext);
	if (it != m_contextsMap.end())
	{
		m_contextsMap.erase(it);
	}
}

};   // namespace v8
