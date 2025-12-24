#!/usr/bin/env python3

"""
启动本地HTTP服务器，用于测试和预览网站
"""

import http.server
import socketserver
import os
import sys

# 默认端口
PORT = 8000

# 检查是否提供了端口参数
if len(sys.argv) > 1:
    try:
        PORT = int(sys.argv[1])
    except ValueError:
        print(f"无效的端口号: {sys.argv[1]}")
        print(f"使用默认端口: {PORT}")

# 获取当前目录
current_dir = os.path.dirname(os.path.abspath(__file__))

print("=" * 60)
print(f"本地HTTP服务器启动信息")
print("=" * 60)
print(f"当前工作目录: {current_dir}")
print(f"服务器端口: {PORT}")
print(f"访问地址: http://localhost:{PORT}")
print("=" * 60)
print(f"按 Ctrl+C 停止服务器")
print("=" * 60)

# 启动服务器
Handler = http.server.SimpleHTTPRequestHandler

with socketserver.TCPServer(("", PORT), Handler) as httpd:
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print("\n服务器已停止")
        httpd.shutdown()
