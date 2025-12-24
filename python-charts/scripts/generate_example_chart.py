# -*- coding: utf-8 -*-
"""
示例图表生成脚本
用于演示如何生成Python图表并集成到网站中
"""

import matplotlib.pyplot as plt
import numpy as np
import os

# 配置图表样式，使其与网站风格一致
plt.rcParams.update({
    'font.family': 'SimHei',  # 支持中文
    'axes.unicode_minus': False,  # 支持负号
    'figure.figsize': (10, 6),  # 图表尺寸
    'savefig.dpi': 300,  # 保存分辨率
    'figure.dpi': 100,  # 显示分辨率
    'axes.titlesize': 14,
    'axes.labelsize': 12,
    'xtick.labelsize': 10,
    'ytick.labelsize': 10,
    'legend.fontsize': 10,
    'grid.linestyle': '--',
    'grid.alpha': 0.7,
    'axes.facecolor': 'white',
    'axes.edgecolor': '#e0e0e0',
    'axes.linewidth': 1.0,
})

# 创建数据
x = np.linspace(0, 10, 100)
y1 = np.sin(x)
y2 = np.cos(x)

# 创建图表
fig, ax = plt.subplots()

# 绘制曲线，使用网站主题色
ax.plot(x, y1, label='正弦波', color='#0066cc', linewidth=2)
ax.plot(x, y2, label='余弦波', color='#ff6600', linewidth=2)

# 设置图表标题和标签
ax.set_title('正弦波与余弦波', fontsize=14, fontweight='bold')
ax.set_xlabel('X轴', fontsize=12)
ax.set_ylabel('Y轴', fontsize=12)

# 添加网格
ax.grid(True)

# 添加图例
ax.legend(loc='upper right')

# 添加阴影效果
for spine in ax.spines.values():
    spine.set_edgecolor('#e0e0e0')
    spine.set_linewidth(1.0)

# 创建所有章节的图表目录
chapters = [f'chapter{i}' for i in range(1, 21)]
for chapter in chapters:
    os.makedirs(f'../generated/{chapter}', exist_ok=True)

# 保存图表为SVG格式（矢量图，缩放不失真）
save_path_svg = '../generated/chapter1/example_chart.svg'
plt.savefig(save_path_svg, bbox_inches='tight', transparent=True)
print(f'SVG图表已保存到: {save_path_svg}')

# 保存图表为PNG格式（备用格式）
save_path_png = '../generated/chapter1/example_chart.png'
plt.savefig(save_path_png, bbox_inches='tight', dpi=300)
print(f'PNG图表已保存到: {save_path_png}')

# 测试生成不同类型的图表
# 1. 散点图
fig, ax = plt.subplots()
np.random.seed(42)
x_scatter = np.random.randn(100)
y_scatter = np.random.randn(100)
colors = np.random.randn(100)
sizes = 100 * np.random.randn(100) ** 2

ax.scatter(x_scatter, y_scatter, c=colors, s=sizes, alpha=0.5, cmap='viridis')
ax.set_title('散点图示例', fontsize=14, fontweight='bold')
ax.set_xlabel('X轴', fontsize=12)
ax.set_ylabel('Y轴', fontsize=12)
ax.grid(True)

scatter_svg = '../generated/chapter1/scatter_example.svg'
plt.savefig(scatter_svg, bbox_inches='tight', transparent=True)
print(f'散点图已保存到: {scatter_svg}')

# 2. 直方图
fig, ax = plt.subplots()
data = np.random.randn(1000)
ax.hist(data, bins=30, alpha=0.7, color='#0066cc', edgecolor='black')
ax.set_title('直方图示例', fontsize=14, fontweight='bold')
ax.set_xlabel('数值', fontsize=12)
ax.set_ylabel('频率', fontsize=12)
ax.grid(True, axis='y')

hist_svg = '../generated/chapter1/histogram_example.svg'
plt.savefig(hist_svg, bbox_inches='tight', transparent=True)
print(f'直方图已保存到: {hist_svg}')

print("\n所有图表生成完成！")