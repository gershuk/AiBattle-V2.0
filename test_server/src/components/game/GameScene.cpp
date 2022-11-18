#include "GameScene.h"
#include "Components/Configurator.h"

CGameScene::CGameScene()
{
    m_hSceneContext = v8::CEngine::Instance().CreateContext();
    LoadSceneScripts();
}

CGameScene::~CGameScene()
{
    v8::CEngine::Instance().CloseContext(m_hSceneContext);
}

void CGameScene::LoadSceneScripts() const
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

    const std::string& scriptsPath = CConfigurator::Instance().GetConfig().scriptsPath;
    for (auto&& fileName : files)
    {
        v8::CEngine::Instance().EvaluateFile(m_hSceneContext, scriptsPath + fileName);
    }


}
