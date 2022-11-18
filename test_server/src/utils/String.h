#pragma once

#include <string>

namespace Utils
{

class CString
{
public:
	/**
	 * Replace all substrings with another string
	 * 
	 * @param str - target string
	 * @param subStr1 - a substring to remove
	 * @param subStr2 - a substring to insert
	 * 
	 * @return the modified string
	 */
	static std::string& ReplaceAll(std::string& str, const std::string& subStr1, const std::string& subStr2);

};

};   // namespace Utils
