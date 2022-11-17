#include "engine/V8Engine.h"
#include "TestManager.h"

#include <iostream>

int main()
{
    CV8Engine::Instance().Initialize();

    std::cout << "Hello World!\n";
}
