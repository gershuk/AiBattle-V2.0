#pragma once

#include <utility>

namespace Helpers {

template<class T>
class CSingleton
{
public:
    template<typename... Args>
    static T& Instance(Args&&... args)
    {
        if (!s_instance)
        {
            s_instance = new T(std::forward<Args>(args)...);
        }
        return *s_instance;
    }

    static void Destroy()
    {
        if (IsCreated())
        {
            delete s_instance;
        }
        s_instance = nullptr;
    }

    static bool IsCreated() { return s_instance != nullptr; }

private:
    static T* s_instance;
};

template<class T>
T* CSingleton<T>::s_instance = nullptr;

}   // namespace Helpers
