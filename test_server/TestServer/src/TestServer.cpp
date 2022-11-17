#include "engine/V8Engine.h"
#include "TestManager.h"

#include <iostream>

int main()
{
    v8::CEngine::Instance().Initialize();

    std::cout << "Hello World!\n";
}
