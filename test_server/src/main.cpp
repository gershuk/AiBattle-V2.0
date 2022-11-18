#include "components/TestManager.h"
#include "engine/V8Engine.h"

#include <iostream>

int main()
{
    v8::CEngine::Instance().Initialize();

    CTestManager testManager = CTestManager();

    //std::cout << "Hello World!\n";
}
