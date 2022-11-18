#include "TestManager.h"

// TODO: add path to an actual core
#define CORE_SCRIPTS_PATH ".\\..\\..\\..\\AiBattle\\scripts\\"

CTestManager::CTestManager()
{
    m_hSceneContext = v8::CEngine::Instance().CreateContext();
    LoadScripts();
}

CTestManager::~CTestManager()
{
    v8::CEngine::Instance().CloseContext(m_hSceneContext);
}

void CTestManager::LoadScripts() const
{
    // TODO: update with a new core

    std::string files[] =
    {
        "ImageFake.js",
        "GameObject.js",
        "StaticObject.js",
        "MovableObject.js",
        "ResourceLoader.js",
        "SafeEval.js",
        "Scene.js"
    };

    for (auto&& fileName : files)
    {
        v8::CEngine::Instance().EvaluateFile(m_hSceneContext, CORE_SCRIPTS_PATH + fileName);
    }
}
