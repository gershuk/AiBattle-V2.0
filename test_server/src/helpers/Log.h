#pragma once

#include <stdio.h>

#define LOG_INFO(...)	fprintf(stdout, __VA_ARGS__)
#define LOG_ERR(...)	fprintf(stderr, __VA_ARGS__)
