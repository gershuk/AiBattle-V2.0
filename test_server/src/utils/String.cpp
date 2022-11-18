#include "String.h"

namespace Utils
{

	std::string& CString::ReplaceAll(std::string& str, const std::string& subStr1, const std::string& subStr2)
	{
		size_t pos = 0;
		size_t subStr2Size = subStr2.size();
		while (pos = str.find(subStr1, pos), pos != std::string::npos)
		{
			str.replace(pos, subStr1.length(), subStr2);
			pos += subStr2Size;
		}
		return str;
	}

}   // namespace Utils
