#include "FileSystem.h"
#include <fstream>

bool CFileSystem::LoadFileToString(const std::string& filePath, std::string& outStr)
{
	std::ifstream sourceFile(filePath, std::ios::binary);
	if (!sourceFile.is_open())
	{
		return false;
	}

	std::string sourceStr;
	sourceFile.seekg(0, std::ios_base::end);
	std::ifstream::pos_type len = sourceFile.tellg();
	sourceFile.seekg(0);
	sourceStr.resize(len);
	sourceFile.read((char*)sourceStr.data(), len);

	return true;
}
