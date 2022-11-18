#include "GameScene.h"

#include "components/Configurator.h"
#include "helpers/Log.h"
#include "utils/FileSystem.h"
#include "utils/String.h"

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

    const auto& config = CConfigurator::Instance().GetConfig();

    const std::string& scriptsPath = config.scriptsPath;
    for (auto&& fileName : files)
    {
        v8::CEngine::Instance().EvaluateFile(m_hSceneContext, scriptsPath + fileName);
    }

    // Load scene main script

    const std::string sceneScriptFile = scriptsPath + "SceneSimulator.js";
    std::string sceneScript;
    if (!Utils::CFileSystem::LoadFileToString(sceneScriptFile, sceneScript))
    {
        LOG_ERR("[CGameScene] Failed to scene script from '%s'\r\n", sceneScriptFile.c_str());
        return;
    }

    std::string mapScript;
    if (!Utils::CFileSystem::LoadFileToString(config.mapPath, mapScript))
    {
        LOG_ERR("[CGameScene] Failed to a map script from '%s'\r\n", config.mapPath.c_str());
        return;
    }

    std::string controllersTexts;
    for (std::string botPath : config.botPaths)
    {
        std::string botScript;
        if (Utils::CFileSystem::LoadFileToString(botPath, botScript))
        {
            Utils::CString::ReplaceAll(botScript, "\n", "\\n");
            Utils::CString::ReplaceAll(botScript, "'", "\\'");
            controllersTexts += "'" + botScript + "',";
        }
        else
        {
            LOG_ERR("[CGameScene] Failed to load a bot controller from '%s'\r\n", botPath.c_str());
        }
    }

    if (!controllersTexts.empty())
    {
        controllersTexts.pop_back();
    }

    Utils::CString::ReplaceAll(controllersTexts, "\n", "");
    Utils::CString::ReplaceAll(controllersTexts, "\r", "");

    std::string botNames;
    for (std::string botName : config.botPaths)
    {
        botNames += "'" + botName + "',";
    }

    if (!botNames.empty())
    {
        botNames.pop_back();
    }

    const std::vector<std::string> colorNames =
    {
        "red",
        "black",
        "yellow",
        "grey",
        "green",
        "blue",
        "pink",
        "purple"
    };

    std::string botColors;
    for (int i = 0; i < config.botPaths.size(); ++i)
    {
        botColors += "'" + colorNames[i % colorNames.size()] + "',";
    }

    if (!botColors.empty())
    {
        botColors.pop_back();
    }

    Utils::CString::ReplaceAll(sceneScript, "$mapInfo", mapScript);
    Utils::CString::ReplaceAll(sceneScript, "$controllerTexts", controllersTexts);
    Utils::CString::ReplaceAll(sceneScript, "$botNames", botNames);
    Utils::CString::ReplaceAll(sceneScript, "$botColors", botColors);
    Utils::CString::ReplaceAll(sceneScript, "$timeout", std::to_string(config.initTimeout));
    Utils::CString::ReplaceAll(sceneScript, "$onComplete", "null");
    Utils::CString::ReplaceAll(sceneScript, "$isShortReplay", config.isShortReplay ? "true" : "false");
    Utils::CString::ReplaceAll(sceneScript, "$isStoreControllersText", config.isStoreControllersText ? "true" : "false");

    if (!v8::CEngine::Instance().Evaluate(m_hSceneContext, sceneScript))
    {
        LOG_ERR("[CGameScene] Failed to evaluate scene script\r\n");
        return;
    }

    v8::CEngine::Instance().Evaluate(m_hSceneContext, "InitScene()");
}
