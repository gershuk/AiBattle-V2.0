#include "components/Configurator.h"
#include "components/TestManager.h"
#include "engine/V8Engine.h"
#include "helpers/Log.h"

#include <iostream>

#define CONFIG_FILE_PATH ".\\config\\config.json"

int main()
{
    const bool bConfigLoaded = CConfigurator::Instance().LoadConfiguration(CONFIG_FILE_PATH);
    if (!bConfigLoaded)
    {
        LOG_ERR("Failed to load configuration, shutting down...\r\n");
        return 0;
    }

    v8::CEngine::Instance().Initialize();

    CTestManager testManager = CTestManager();


    //std::cout << "Hello World!\n";
    return 0;
}
