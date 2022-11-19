#pragma once

#include "helpers/Singleton.h"

#include <v8.h>

#include <map>
#include <stdint.h>

namespace v8
{

// An unique identifier for generated objects
typedef int64_t THandle;

/**
 * A helper type for V8 persistent context object.
 * A script execution is isolated within its context.
 * External contexts can be accessed if security tokens are provided.
 * 
 * @see https://v8.dev/docs/embed#security-model
 */
typedef UniquePersistent<Context> TScriptContext;

// A pre-defined value for an invalid handle
static constexpr THandle INVALID_HANDLE = -1;

/** A wrapper for V8 JavaScript Engine */
class CEngine : public Helpers::TSingleton<CEngine>
{
	~CEngine();

public:
	/**
	 * Starts up an engine instance and
	 * creates an isolate for the further work.
	 *
	 * @return True if initialized successfully
	 */
	bool Initialize();

	/**
	 * Initializes a new context for scripts execution.
	 * @return a new context handle if intialization succeded, INVALID_HANDLE otherwise
	 */
	THandle CreateContext();

	/**
	 * Removes a created context.
	 * @param hContext - a handle of the context to delete
	 */
	void CloseContext(THandle hContext);

	/**
	 * Executes a string with JavaScript code
	 *
	 * @param hContext - a handle of execution context
	 * @param sourceStr - a code for execution
	 *
	 * @return True if evaluated successfully
	 */
	bool Evaluate(THandle hContext, const std::string& sourceStr) const;

	/**
	 * Executes a string with JavaScript code from a file
	 *
	 * @param hContext - a handle of execution context
	 * @param filePathStr - a full path to code file
	 *
	 * @return True if evaluated successfully
	 */
	bool EvaluateFile(THandle hContext, const std::string& filePathStr) const;

	/**
	 * Executes a string with JavaScript code, returning a result value
	 *
	 * @param hContext - a handle of execution context
	 * @param sourceStr - a code for execution
	 * @param outStr - execution result output in string form
	 *
	 * @return True if evaluated successfully
	 */
	bool Evaluate(THandle hContext, const std::string& sourceStr, std::string& outStr) const;

	/**
	 * Executes a string with JavaScript code from a file, returning a result value
	 *
	 * @param hContext - a handle of execution context
	 * @param filePathStr - a full path to code file
	 * @param outStr - execution result output in string form
	 *
	 * @return True if evaluated successfully
	 */
	bool EvaluateFile(THandle hContext, const std::string& filePathStr, std::string& outStr) const;

private:
	/**
	 * Handles try-catch exceptions
	 *
	 * @param tryCatch - an exception source
	 */
	void ProcessException(TryCatch* tryCatch) const;

	// A storage for created contexts
	std::map<THandle, TScriptContext> m_contextsMap;

	// Saving a platform pointer so that it is
	// not deleted while an engine instance exists
	std::unique_ptr<Platform> m_platform;

	Isolate* m_pIsolate = NULL;
	bool m_isInitialized = false;
};

};   // namespace v8
