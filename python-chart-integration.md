# Python图表集成技术栈架构设计

## 1. 设计目标

- 支持在静态HTML网站中直接使用Python生成的图表
- 保持现有网站架构的简洁性和可维护性
- 提供灵活的图表生成和集成方式
- 支持多种图表类型（折线图、散点图、直方图、3D图等）
- 确保图表样式与网站整体风格一致
- 便于本地开发和部署

## 2. 技术栈选择

### 2.1 核心技术栈

| 层 | 技术 | 用途 |
| --- | --- | --- |
| 前端 | HTML5 + CSS3 + JavaScript | 网站基础架构 |
| 前端图表库 | Chart.js | 客户端动态图表生成 |
| Python图表库 | Matplotlib + Plotly + Bokeh | 服务器端/本地图表生成 |
| 图表格式 | SVG + PNG + HTML | 图表输出格式 |
| 构建工具 | Python脚本 | 自动化图表生成 |
| 可选后端 | Flask/FastAPI | 动态图表生成服务（可选） |
| 可选WebAssembly | Pyodide | 浏览器内Python执行（未来扩展） |

### 2.2 技术选择理由

- **Matplotlib**：成熟稳定，支持多种图表类型，适合生成静态图表
- **Plotly**：支持交互式图表，可生成HTML格式嵌入网页
- **Bokeh**：适合生成高性能交互式图表
- **SVG格式**：矢量图，缩放不失真，便于与网页样式集成
- **Python脚本**：轻量级，无需复杂的构建工具

## 3. 架构设计

### 3.1 目录结构

```
semi_proj/
├── chapters/              # 章节HTML文件
├── css/                   # 样式文件
├── js/                    # JavaScript文件
├── python-charts/         # Python图表生成相关文件
│   ├── scripts/           # Python图表生成脚本
│   ├── generated/         # 生成的图表文件（按章节组织）
│   │   ├── chapter1/      # 第1章图表
│   │   ├── chapter2/      # 第2章图表
│   │   └── ...
│   └── templates/         # 图表样式模板
├── images/                # 其他图片资源
└── index.html             # 首页
```

### 3.2 图表生成流程

#### 3.2.1 静态图表生成流程

1. 编写Python图表脚本（`python-charts/scripts/`）
2. 运行脚本生成图表文件（SVG/PNG/HTML）
3. 图表文件自动保存到对应章节目录（`python-charts/generated/chapterX/`）
4. 在HTML文件中通过`<img>`或`<iframe>`标签引用生成的图表

#### 3.2.2 动态图表生成流程（可选）

1. 启动本地Flask/FastAPI服务
2. 前端通过AJAX请求图表数据或直接请求图表HTML
3. 后端运行Python图表脚本生成图表
4. 返回图表数据或HTML给前端显示

## 4. 实现步骤

### 4.1 第一步：创建Python图表生成基础架构

1. 创建`python-charts`目录结构
2. 编写Python图表生成脚本模板
3. 实现图表样式统一管理

### 4.2 第二步：集成到现有网站

1. 在HTML文件中添加图表容器
2. 实现图表引用机制
3. 添加图表交互功能（如果使用交互式图表）

### 4.3 第三步：自动化构建

1. 编写批处理脚本，一键生成所有图表
2. 集成到GitHub Actions（如果需要）

### 4.4 第四步：测试和优化

1. 测试不同图表类型的生成和显示
2. 优化图表加载性能
3. 确保响应式设计

## 5. 代码示例

### 5.1 Python图表生成脚本模板

```python
# python-charts/scripts/generate_chart.py
import matplotlib.pyplot as plt
import numpy as np
import os

# 图表配置
plt.rcParams['font.family'] = 'SimHei'  # 支持中文
plt.rcParams['axes.unicode_minus'] = False  # 支持负号
plt.rcParams['figure.figsize'] = (10, 6)  # 图表尺寸
plt.rcParams['savefig.dpi'] = 300  # 保存分辨率

# 生成数据
x = np.linspace(0, 10, 100)
y = np.sin(x)

# 创建图表
fig, ax = plt.subplots()
ax.plot(x, y, label='正弦波', color='#0066cc', linewidth=2)

# 设置图表样式
ax.set_title('示例图表', fontsize=14, fontweight='bold')
ax.set_xlabel('X轴', fontsize=12)
ax.set_ylabel('Y轴', fontsize=12)
ax.grid(True, linestyle='--', alpha=0.7)
ax.legend()

# 保存图表
save_dir = '../generated/chapter1'
os.makedirs(save_dir, exist_ok=True)
save_path = os.path.join(save_dir, 'example_chart.svg')
plt.savefig(save_path, bbox_inches='tight', transparent=True)

print(f'图表已保存到: {save_path}')
```

### 5.2 HTML中引用图表示例

```html
<!-- 静态SVG图表 -->
<div class="chart-container">
    <h3>示例图表</h3>
    <img src="../python-charts/generated/chapter1/example_chart.svg" alt="示例图表" class="python-chart">
</div>

<!-- 交互式HTML图表（Plotly/Bokeh） -->
<div class="chart-container">
    <h3>交互式图表</h3>
    <iframe src="../python-charts/generated/chapter1/interactive_chart.html" class="python-chart-interactive"></iframe>
</div>
```

### 5.3 CSS样式示例

```css
/* CSS样式 */
.python-chart {
    max-width: 100%;
    height: auto;
    border-radius: 8px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    margin: 1rem 0;
}

.python-chart-interactive {
    width: 100%;
    height: 500px;
    border: none;
    border-radius: 8px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    margin: 1rem 0;
}

.chart-container {
    background-color: white;
    padding: 1.5rem;
    border-radius: 8px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
    margin: 1.5rem 0;
}
```

## 6. 未来扩展计划

### 6.1 WebAssembly集成

考虑使用Pyodide在浏览器中直接运行Python代码，实现更动态的图表生成：

```html
<!-- 未来可能的WebAssembly集成 -->
<div class="chart-container">
    <h3>动态生成图表</h3>
    <div id="dynamic-chart"></div>
    <button onclick="generateChartWithPython()">生成图表</button>
</div>

<script src="https://cdn.jsdelivr.net/pyodide/v0.23.4/full/pyodide.js"></script>
<script>
async function generateChartWithPython() {
    // 初始化Pyodide
    const pyodide = await loadPyodide();
    
    // 安装所需库
    await pyodide.loadPackage(['matplotlib', 'numpy']);
    
    // Python代码
    const pythonCode = `
    import matplotlib.pyplot as plt
    import numpy as np
    
    x = np.linspace(0, 10, 100)
    y = np.sin(x)
    
    plt.plot(x, y)
    plt.title('动态生成的图表')
    plt.xlabel('X轴')
    plt.ylabel('Y轴')
    
    # 将图表转换为HTML
    import io
    from base64 import b64encode
    
    buf = io.BytesIO()
    plt.savefig(buf, format='svg')
    buf.seek(0)
    svg_data = buf.getvalue().decode('utf-8')
    svg_data
    `;
    
    // 执行Python代码
    const svgData = await pyodide.runPythonAsync(pythonCode);
    
    // 显示图表
    document.getElementById('dynamic-chart').innerHTML = svgData;
}
</script>
```

### 6.2 动态后端服务

如果需要更强大的图表生成能力，可以添加Flask/FastAPI后端服务：

```python
# python-charts/server/app.py
from fastapi import FastAPI
from fastapi.responses import FileResponse
import os

app = FastAPI()

@app.get("/api/charts/{chapter}/{chart_name}")
async def get_chart(chapter: str, chart_name: str):
    chart_path = f"../generated/{chapter}/{chart_name}"
    if os.path.exists(chart_path):
        return FileResponse(chart_path)
    return {"error": "Chart not found"}

@app.post("/api/generate-chart")
async def generate_chart(chapter: str, script_name: str):
    # 执行Python脚本生成图表
    # ...
    return {"success": True, "chart_url": f"/api/charts/{chapter}/{generated_chart_name}"}
```

## 7. 部署建议

1. **本地开发**：
   - 安装Python及所需库（matplotlib, plotly, bokeh）
   - 运行`python-charts/scripts/generate_all_charts.py`生成所有图表
   - 使用本地HTTP服务器查看效果

2. **生产部署**：
   - 可以继续使用静态网站部署方式（GitHub Pages, Netlify等）
   - 图表文件与HTML文件一起部署
   - 如果使用动态后端服务，需要部署到支持Python的服务器

3. **自动化部署**：
   - 在GitHub Actions中添加图表生成步骤
   - 每次推送代码时自动生成并更新图表

## 8. 总结

本设计提供了一个灵活、可扩展的Python图表集成方案，既保持了现有静态网站的简洁性，又支持未来的动态扩展。通过合理的目录结构和脚本设计，用户可以方便地使用Python生成和管理图表，同时确保图表与网站整体风格一致。