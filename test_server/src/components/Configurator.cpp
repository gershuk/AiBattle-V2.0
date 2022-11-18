#include "Configurator.h"

#include "helpers/Log.h"

#include <fstream>
#include <nlohmann/json.hpp>

using json = nlohmann::json;

bool CConfigurator::LoadConfiguration(const std::string& filePath)
{
	LOG_INFO("[CConfigurator] Loading config from file '%s'...\r\n", filePath.c_str());

	std::ifstream infile(filePath);

	if (!infile.is_open())
	{
		LOG_ERR("[CConfigurator] Failed to load a config file\r\n");
		return false;
	}

	json data = json::parse(infile);

	// Reset to defaults
	m_config = SConfig();

	if (data.contains("ScriptsPath"))				m_config.scriptsPath = data["ScriptsPath"];
	if (data.contains("MapPath"))					m_config.mapPath = data["MapPath"];
	if (data.contains("ScoreOutPath"))				m_config.scoreOutPath = data["ScoreOutPath"];
	if (data.contains("ReplayOutPath"))				m_config.replayOutPath = data["ReplayOutPath"];
	if (data.contains("InitTimeout"))				m_config.initTimeout = data["InitTimeout"];
	if (data.contains("TurnTimeout"))				m_config.turnTimeout = data["TurnTimeout"];
	if (data.contains("IsLogging"))					m_config.isLogging = data["IsLogging"];
	if (data.contains("IsShortReplay"))				m_config.isShortReplay = data["IsShortReplay"];
	if (data.contains("IsStoreControllersText"))	m_config.isStoreControllersText = data["IsStoreControllersText"];

	if (data.contains("BotPaths"))					m_config.botPaths = data["BotPaths"];

	LOG_INFO("[CConfigurator] Updated configuration:\r\n"
		"\tscriptsPath = '%s'\r\n"
		"\tmapPath = '%s'\r\n"
		"\tscoreOutPath = '%s'\r\n"
		"\treplayOutPath = '%s'\r\n"
		"\tinitTimeout = %d\r\n"
		"\tturnTimeout = %d\r\n"
		"\tisLogging = %s\r\n"
		"\tisShortReplay = %s\r\n"
		"\tisStoreControllersText = %s\r\n"
		, m_config.scriptsPath.c_str()
		, m_config.mapPath.c_str()
		, m_config.scoreOutPath.c_str()
		, m_config.replayOutPath.c_str()
		, m_config.initTimeout
		, m_config.turnTimeout
		, m_config.isLogging ? "true" : "false"
		, m_config.isShortReplay ? "true" : "false"
		, m_config.isStoreControllersText ? "true" : "false"
	);

	LOG_INFO("\tbotPaths =\r\n");
	if (m_config.botPaths.empty())
	{
		LOG_INFO("\t\tempty\r\n");
	}
	else
	{
		for (auto&& botPath : m_config.botPaths)
		{
			LOG_INFO("\t\t'%s'\r\n", botPath.c_str());
		}
	}

	return true;
}

SConfig CConfigurator::GetConfig() const
{
	return m_config;
}
