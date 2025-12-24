#!/bin/bash

# SEMI_PROJ 部署脚本
# 用于生成静态网站并准备部署

echo "=== 开始部署 SEMI_PROJ 网站 ==="

# 检查必要的目录
if [ ! -d "css" ] || [ ! -d "js" ] || [ ! -d "chapters" ]; then
    echo "错误：缺少必要的目录，请确保在项目根目录执行此脚本"
    exit 1
fi

# 创建输出目录
OUTPUT_DIR="dist"
mkdir -p $OUTPUT_DIR

echo "正在复制文件到输出目录..."

# 复制HTML文件
cp index.html $OUTPUT_DIR/

# 复制CSS目录
cp -r css $OUTPUT_DIR/

# 复制JS目录
cp -r js $OUTPUT_DIR/

# 复制章节目录
cp -r chapters $OUTPUT_DIR/

# 复制图片目录（如果存在）
if [ -d "assets" ]; then
    cp -r assets $OUTPUT_DIR/
fi

echo "文件复制完成"

# 检查是否有Python环境，用于启动本地服务器
echo "检查Python环境..."
if command -v python3 &> /dev/null; then
    PYTHON_CMD="python3"
elif command -v python &> /dev/null; then
    PYTHON_CMD="python"
else
    echo "警告：未找到Python环境，无法启动本地服务器"
    PYTHON_AVAILABLE=false
    exit 1
fi

PYTHON_AVAILABLE=true

# 启动本地服务器
echo "=== 部署完成 ==="
echo "静态网站已生成到 $OUTPUT_DIR 目录"

if [ "$PYTHON_AVAILABLE" = true ]; then
    echo ""
    echo "是否启动本地服务器？(y/n)"
    read -r answer
    if [ "$answer" = "y" ] || [ "$answer" = "Y" ]; then
        echo "启动本地服务器..."
        cd $OUTPUT_DIR
        $PYTHON_CMD -m http.server 8000
    else
        echo "部署完成，您可以使用任何HTTP服务器来提供 $OUTPUT_DIR 目录的内容"
        echo "例如：使用Python启动服务器：cd $OUTPUT_DIR && $PYTHON_CMD -m http.server 8000"
        echo "或使用Node.js：npm install -g http-server && cd $OUTPUT_DIR && http-server -p 8000"
    fi
fi

echo ""
echo "=== 部署脚本执行完毕 ==="
