#pragma once

#include <string>

namespace Utils
{

class CFileSystem
{
public:
	/**
	 * Opens a file and copies its data to string
	 * 
	 * @param filePath - a full path to the target file
	 * @param outStr - output string with file contents
	 * 
	 * @return True if file opened and stored successfully
	 */
	static bool LoadFileToString(const std::string& filePath, std::string& outStr);
};

}   // namespace Utils
