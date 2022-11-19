#include "GameBot.h"

#include "helpers/Log.h"

#include <thread>
#include <mutex>
#include <condition_variable>

CGameBot::CGameBot()
{
    m_hBotContext = v8::CEngine::Instance().CreateContext();
}

CGameBot::~CGameBot()
{
    v8::CEngine::Instance().CloseContext(m_hBotContext);
}

bool CGameBot::InitializeBot(int32_t botId, int32_t timeout) const
{
    LOG_INFO("[CGameBot] Initializing bot #%d, timeout = %d\r\n", botId, timeout);

    std::mutex m;
    std::condition_variable cv;
    std::string initRes;

    std::thread initThread([this, botId, &cv, &initRes]()
        {
            const std::string initStr =
                "buffVar = InitBotClone(scene, " + std::to_string(botId) + "); buffVar";
            if (!v8::CEngine::Instance().Evaluate(m_hBotContext, initStr, initRes))
            {
                LOG_ERR("[CGameBot] Initialization error!\r\n");
            }

            cv.notify_one();
        });

    initThread.detach();

    {
        std::unique_lock<std::mutex> l(m);
        if (cv.wait_for(l, std::chrono::duration<int32_t, std::milli>(timeout)) == std::cv_status::timeout)
        {
            LOG_ERR("[CGameBot] Initialization timeout!\r\n");
            return false;
        }
    }

    return !initRes.empty();
}
