#include "V8Engine.h"

#include "helpers/Log.h"

#include <libplatform/libplatform.h>
#include <v8-platform.h>

#include <assert.h>
#include <fstream>

namespace v8
{

// Creates an unique handle value
static THandle MakeHandle()
{
	static THandle hNextHandle = 0;
	return hNextHandle++;
}

// Extracts a C string from a V8 Utf8Value.
static const char* ToCString(const String::Utf8Value& value) {
	return *value ? *value : "<string conversion failed>";
}

CEngine::~CEngine()
{
	if (m_isInitialized)
	{
		// Close contexts
		m_contextsMap.clear();

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

bool CEngine::Evaluate(THandle hContext, const std::string& sourceStr) const
{
	if (!m_isInitialized)
	{
		return false;
	}

	// Try find a context
	auto it = m_contextsMap.find(hContext);
	if (it == m_contextsMap.end())
	{
		return false;
	}

	Isolate::Scope isolateScope(m_pIsolate);
	HandleScope handleScope(m_pIsolate);
	TryCatch tryCatch(m_pIsolate);

	// Enter the context for compiling and running the script.
	Local<Context> context = it->second.Get(m_pIsolate);
	Context::Scope contextScope(context);
	{
		// Create a string containing the JavaScript source code.
		Local<String> source;
		if (!String::NewFromUtf8(m_pIsolate, sourceStr.c_str()).ToLocal(&source))
		{
			ProcessException(&tryCatch);
			return false;
		}

		// Compile the source code.
		Local<Script> script;
		if (!Script::Compile(context, source).ToLocal(&script))
		{
			ProcessException(&tryCatch);
			return false;
		}

		// Run the script to get the result.
		Local<Value> result;
		if (!script->Run(context).ToLocal(&result))
		{
			ProcessException(&tryCatch);
			return false;
		}

		// Convert the result to an UTF8 string and print it.
		String::Utf8Value utf8(m_pIsolate, result);
		LOG_INFO("%s\r\n", *utf8);
	}

	return true;
}

bool CEngine::EvaluateFile(THandle hContext, const std::string& filePathStr) const
{
	if (!m_isInitialized)
	{
		return false;
	}

	Isolate::Scope isolateScope(m_pIsolate);
	HandleScope handleScope(m_pIsolate);

	std::ifstream sourceFile(filePathStr, std::ios::binary);
	if (!sourceFile.is_open())
	{
		LOG_ERR("[V8] Failed to open the source file '%s'\r\n", filePathStr.c_str());
		return false;
	}

	std::string sourceStr;
	sourceFile.seekg(0, std::ios_base::end);
	std::ifstream::pos_type len = sourceFile.tellg();
	sourceFile.seekg(0);
	sourceStr.resize(len);
	sourceFile.read((char*)sourceStr.data(), len);

	return Evaluate(hContext, sourceStr);
}

void CEngine::ProcessException(TryCatch* tryCatch) const
{
	if (!m_isInitialized)
	{
		return;
	}

	HandleScope handleScope(m_pIsolate);
	String::Utf8Value exception(m_pIsolate, tryCatch->Exception());

	const char* szException = ToCString(exception);
	Local<Message> message = tryCatch->Message();

	LOG_ERR("\r\n[V8] Handled an exception:\r\n");
	LOG_ERR("-------------------------\r\n");

	if (message.IsEmpty())
	{
		// V8 didn't provide any extra information about this error;
		// just print the exception.
		LOG_ERR("%s\r\n", szException);
	}
	else
	{
		// Print (filename):(line number): (message).
		String::Utf8Value filename(m_pIsolate, message->GetScriptOrigin().ResourceName());
		Local<Context> context(m_pIsolate->GetCurrentContext());
		const char* szFileName = ToCString(filename);
		int linenum = message->GetLineNumber(context).FromJust();
		LOG_ERR("%s:%i: %s\n", szFileName, linenum, szException);

		// Print line of source code.
		String::Utf8Value sourceline(m_pIsolate, message->GetSourceLine(context).ToLocalChecked());
		const char* sourceline_string = ToCString(sourceline);
		LOG_ERR("%s\n", sourceline_string);

		// Print wavy underline (GetUnderline is deprecated).
		int start = message->GetStartColumn(context).FromJust();
		for (int i = 0; i < start; i++)
		{
			LOG_ERR(" ");
		}

		int end = message->GetEndColumn(context).FromJust();
		for (int i = start; i < end; i++)
		{
			LOG_ERR("^");
		}
		LOG_ERR("\n");

		Local<Value> stack_trace_string;
		if (tryCatch->StackTrace(context).ToLocal(&stack_trace_string) &&
			stack_trace_string->IsString() &&
			stack_trace_string.As<String>()->Length() > 0)
		{
			String::Utf8Value stack_trace(m_pIsolate, stack_trace_string);
			const char* err = ToCString(stack_trace);
			LOG_ERR("%s\n", err);
		}
	}

	LOG_ERR("-------------------------\r\n");
}

};   // namespace v8
