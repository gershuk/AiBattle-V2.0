#pragma once

#include "helpers/Singleton.h"

#include <string>

/**
 * A structure that holds all necessary configurable properties
 */
struct SConfig
{
	std::string scriptsPath;
	std::string mapPath;
	std::string scoreOutPath;
	std::string replayOutPath;
	int initTimeout = 100;
	int turnTimeout = 100;
	bool isLogging = true;
	bool isShortReplay = false;
	bool isStoreControllersText = false;
};

class CConfigurator : public Helpers::TSingleton<CConfigurator>
{

public:
	/**
	 * Loads a configuration file to memory and
	 * updates the confuguration struct data.
	 * 
	 * @param filePath - a full path to the file with config data
	 * 
	 * @return True if the config is loaded and stored successfully
	 */
	bool LoadConfiguration(const std::string& filePath);

	/**
	 * @return config data (@see m_config) 
	 */
	SConfig GetConfig() const;

private:
	/**
	 * A configuration data structure,
	 * this data can be accessed and used by other components
	 * @see GetConfig()
	 */
	SConfig m_config;
};