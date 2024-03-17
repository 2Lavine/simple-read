filename=$(echo "$1" | tr '|' '_')

# 返回替换后的文档名
echo "$filename"