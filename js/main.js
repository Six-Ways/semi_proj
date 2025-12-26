// SEMI_PROJ - 半导体器件与制造技术交互式指南 JavaScript

// DOM加载完成后执行
document.addEventListener('DOMContentLoaded', function() {
    // 初始化所有功能
    initNavigation();
    initMobileMenu();
    initModal();
    initLearningPath();
    initChapterCards();
    initInteractiveDemo();
    initTabs();
    initNotifications();
    
    // 仅在侧边栏元素存在时初始化侧边栏
    if (document.querySelector('.sidebar')) {
        initSidebar();
    } else {
        console.log('Sidebar element not found in DOM, skipping initSidebar');
    }
    
    initScrollHeader();
    
    // 初始化移动端优化
    if (window.mobileOptimizer) {
        console.log('Mobile optimizer already initialized');
    } else {
        // 检测是否为移动设备
        const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || 
                         (window.innerWidth <= 768 && 'ontouchstart' in window);
        
        if (isMobile) {
            const script = document.createElement('script');
            script.src = 'js/mobile-optimization.js';
            document.head.appendChild(script);
        }
    }
});

// 导航功能
function initNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('.section');
    
    // 点击导航链接切换页面
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // 移除所有active类
            navLinks.forEach(l => l.classList.remove('active'));
            sections.forEach(s => s.classList.remove('active'));
            
            // 添加active类到当前链接和对应部分
            this.classList.add('active');
            const targetId = this.getAttribute('href').substring(1);
            const targetSection = document.getElementById(targetId);
            
            if (targetSection) {
                targetSection.classList.add('active');
                
                // 添加淡入动画
                targetSection.classList.add('fade-in');
                setTimeout(() => {
                    targetSection.classList.remove('fade-in');
                }, 500);
                
                // 滚动到顶部
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// 移动端菜单
function initMobileMenu() {
    const menuToggle = document.querySelector('.menu-toggle');
    const mainNav = document.querySelector('.main-nav');
    
    if (menuToggle && mainNav) {
        menuToggle.addEventListener('click', function() {
            mainNav.classList.toggle('active');
            
            // 切换图标
            const icon = this.querySelector('i');
            if (icon.classList.contains('fa-bars')) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-times');
            } else {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        });
        
        // 点击导航链接后关闭移动菜单
        const navLinks = document.querySelectorAll('.main-nav a');
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                mainNav.classList.remove('active');
                const icon = menuToggle.querySelector('i');
                if (icon.classList.contains('fa-times')) {
                    icon.classList.remove('fa-times');
                    icon.classList.add('fa-bars');
                }
            });
        });
    }
}

// 滚动时导航栏隐藏/显示效果
function initScrollHeader() {
    const header = document.querySelector('.header');
    if (!header) return;
    
    let lastScrollTop = 0;
    let scrollThreshold = 100; // 滚动阈值，超过此值才开始隐藏/显示
    
    // 添加初始样式
    header.style.transition = 'transform 0.3s ease-in-out';
    
    // 监听滚动事件
    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        // 如果滚动距离小于阈值，不执行任何操作
        if (Math.abs(scrollTop - lastScrollTop) < scrollThreshold) return;
        
        if (scrollTop > lastScrollTop && scrollTop > 100) {
            // 向下滚动且不在顶部，隐藏导航栏
            header.style.transform = 'translateY(-100%)';
        } else {
            // 向上滚动或在顶部附近，显示导航栏
            header.style.transform = 'translateY(0)';
        }
        
        lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
    }, { passive: true });
}

// 模态框功能
function initModal() {
    const modal = document.getElementById('interactive-modal');
    const modalTrigger = document.getElementById('interactive-demo');
    const closeModal = document.querySelector('.close');
    
    if (modal && modalTrigger) {
        // 打开模态框
        modalTrigger.addEventListener('click', function() {
            modal.style.display = 'flex';
            document.body.style.overflow = 'hidden';
        });
        
        // 关闭模态框
        if (closeModal) {
            closeModal.addEventListener('click', function() {
                modal.style.display = 'none';
                document.body.style.overflow = '';
            });
        }
        
        // 点击模态框外部关闭
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                modal.style.display = 'none';
                document.body.style.overflow = '';
            }
        });
    }
}

// 学习路径选择
function initLearningPath() {
    const pathButtons = document.querySelectorAll('.path-card button');
    
    pathButtons.forEach(button => {
        button.addEventListener('click', function() {
            const pathCard = this.closest('.path-card');
            const pathType = pathCard.getAttribute('data-path');
            
            // 保存用户选择的学习路径
            localStorage.setItem('learningPath', pathType);
            
            // 显示通知
            showNotification(`您已选择${pathCard.querySelector('h3').textContent}学习路径`, 'success');
            
            // 跳转到基础原理部分
            document.querySelector('[href="#basics"]').click();
        });
    });
}

// 章节卡片点击事件
function initChapterCards() {
    const chapterCards = document.querySelectorAll('.chapter-card button');
    
    chapterCards.forEach(button => {
        button.addEventListener('click', function() {
            // 检查按钮是否有onclick属性，如果有，则不执行这里的逻辑
            if (this.hasAttribute('onclick')) {
                return;
            }
            
            const chapterCard = this.closest('.chapter-card');
            const chapterNumber = chapterCard.getAttribute('data-chapter');
            
            // 跳转到对应的章节页面
            window.location.href = `chapters/chapter${chapterNumber}.html`;
        });
    });
}

// 加载章节内容
function loadChapterContent(chapterNumber) {
    // 这里可以加载具体的章节内容
    // 实际项目中，这些内容可能从服务器获取或从单独的HTML文件加载
    
    // 简单示例：显示一个通知
    showNotification(`正在加载第${chapterNumber}章内容...`, 'success');
    
    // 实际实现中，这里可能会：
    // 1. 创建一个新的模态框显示章节内容
    // 2. 跳转到一个新的页面
    // 3. 在当前页面动态加载内容
}

// 交互式演示
function initInteractiveDemo() {
    const demoOptions = document.querySelectorAll('.demo-option');
    const demoContainer = document.getElementById('demo-container');
    
    demoOptions.forEach(option => {
        option.addEventListener('click', function() {
            // 移除所有active类
            demoOptions.forEach(opt => opt.classList.remove('active'));
            
            // 添加active类到当前选项
            this.classList.add('active');
            
            // 加载对应的演示内容
            const demoType = this.getAttribute('data-demo');
            loadDemoContent(demoType, demoContainer);
        });
    });
}

// 加载演示内容
function loadDemoContent(demoType, container) {
    // 清空容器
    container.innerHTML = '<div class="loading"></div>';
    
    // 模拟加载延迟
    setTimeout(() => {
        switch(demoType) {
            case 'mosfet-switch':
                loadMOSFETSwitchDemo(container);
                break;
            case 'iv-curve':
                loadIVCurveDemo(container);
                break;
            case 'band-structure':
                loadBandStructureDemo(container);
                break;
            case 'device-3d':
                loadDevice3DDemo(container);
                break;
            default:
                container.innerHTML = '<p>演示内容加载失败</p>';
        }
    }, 500);
}

// MOSFET开关演示
function loadMOSFETSwitchDemo(container) {
    container.innerHTML = `
        <div class="simulator-container">
            <h3>MOSFET开关动态演示</h3>
            <div class="simulator-controls">
                <div class="control-group">
                    <label for="gate-voltage">栅极电压 (V)</label>
                    <input type="range" id="gate-voltage" min="0" max="5" step="0.1" value="0">
                    <span id="gate-voltage-value">0</span> V
                </div>
                <div class="control-group">
                    <label for="drain-voltage">漏极电压 (V)</label>
                    <input type="range" id="drain-voltage" min="0" max="5" step="0.1" value="3">
                    <span id="drain-voltage-value">3</span> V
                </div>
            </div>
            <div class="simulator-output">
                <div class="mosfet-visualization">
                    <div class="mosfet-diagram">
                        <!-- 这里将放置MOSFET的SVG或Canvas表示 -->
                        <canvas id="mosfet-canvas" width="600" height="300"></canvas>
                    </div>
                    <div class="status-indicator">
                        <p>状态: <span id="mosfet-status">关闭</span></p>
                        <p>漏极电流: <span id="drain-current">0</span> mA</p>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    // 初始化MOSFET演示
    initMOSFETSimulation();
}

// I-V特性曲线演示
function loadIVCurveDemo(container) {
    container.innerHTML = `
        <div class="simulator-container">
            <h3>二极管I-V特性曲线</h3>
            <div class="simulator-controls">
                <div class="control-group">
                    <label for="diode-type">二极管类型</label>
                    <select id="diode-type">
                        <option value="silicon">硅二极管</option>
                        <option value="germanium">锗二极管</option>
                        <option value="schottky">肖特基二极管</option>
                    </select>
                </div>
                <div class="control-group">
                    <label for="temperature">温度 (°C)</label>
                    <input type="range" id="temperature" min="-50" max="150" step="10" value="25">
                    <span id="temperature-value">25</span> °C
                </div>
            </div>
            <div class="simulator-output">
                <div class="chart-container">
                    <canvas id="iv-curve-chart"></canvas>
                </div>
            </div>
        </div>
    `;
    
    // 初始化I-V曲线图
    initIVCurveChart();
}

// 能带结构演示
function loadBandStructureDemo(container) {
    container.innerHTML = `
        <div class="simulator-container">
            <h3>半导体能带结构</h3>
            <div class="simulator-controls">
                <div class="control-group">
                    <label for="material">材料类型</label>
                    <select id="material">
                        <option value="silicon">硅 (Si)</option>
                        <option value="germanium">锗 (Ge)</option>
                        <option value="gaas">砷化镓 (GaAs)</option>
                        <option value="sic">碳化硅 (SiC)</option>
                    </select>
                </div>
                <div class="control-group">
                    <label for="doping-type">掺杂类型</label>
                    <select id="doping-type">
                        <option value="intrinsic">本征</option>
                        <option value="n-type">N型</option>
                        <option value="p-type">P型</option>
                    </select>
                </div>
                <div class="control-group">
                    <label for="doping-concentration">掺杂浓度 (cm<sup>-3</sup>)</label>
                    <input type="range" id="doping-concentration" min="14" max="20" step="1" value="16">
                    <span id="doping-value">10<sup>16</sup></span> cm<sup>-3</sup>
                </div>
            </div>
            <div class="simulator-output">
                <div class="band-structure-visualization">
                    <canvas id="band-structure-canvas" width="600" height="400"></canvas>
                </div>
                <div class="band-properties">
                    <p>禁带宽度: <span id="bandgap-value">1.12</span> eV</p>
                    <p>费米能级: <span id="fermi-level-value">0</span> eV</p>
                </div>
            </div>
        </div>
    `;
    
    // 初始化能带结构演示
    initBandStructureSimulation();
}

// 3D器件结构演示
function loadDevice3DDemo(container) {
    container.innerHTML = `
        <div class="simulator-container">
            <h3>器件3D结构查看器</h3>
            <div class="simulator-controls">
                <div class="control-group">
                    <label for="device-type">器件类型</label>
                    <select id="device-type">
                        <option value="mosfet">MOSFET</option>
                        <option value="finfet">FinFET</option>
                        <option value="gaafet">GAA FET</option>
                        <option value="igbt">IGBT</option>
                    </select>
                </div>
                <div class="control-group">
                    <label for="view-mode">查看模式</label>
                    <select id="view-mode">
                        <option value="exterior">外部结构</option>
                        <option value="cross-section">截面图</option>
                        <option value="layers">分层视图</option>
                    </select>
                </div>
            </div>
            <div class="simulator-output">
                <div class="viewer-3d" id="device-3d-viewer">
                    <div class="viewer-3d-placeholder">
                        <p>3D器件模型加载中...</p>
                    </div>
                </div>
                <div class="viewer-controls">
                    <button id="rotate-left" title="向左旋转"><i class="fas fa-arrow-left"></i></button>
                    <button id="rotate-right" title="向右旋转"><i class="fas fa-arrow-right"></i></button>
                    <button id="rotate-up" title="向上旋转"><i class="fas fa-arrow-up"></i></button>
                    <button id="rotate-down" title="向下旋转"><i class="fas fa-arrow-down"></i></button>
                    <button id="zoom-in" title="放大"><i class="fas fa-search-plus"></i></button>
                    <button id="zoom-out" title="缩小"><i class="fas fa-search-minus"></i></button>
                    <button id="reset-view" title="重置视图"><i class="fas fa-undo"></i></button>
                </div>
            </div>
        </div>
    `;
    
    // 初始化3D查看器
    initDevice3DViewer();
}

// 初始化MOSFET仿真
function initMOSFETSimulation() {
    const gateVoltage = document.getElementById('gate-voltage');
    const drainVoltage = document.getElementById('drain-voltage');
    const gateVoltageValue = document.getElementById('gate-voltage-value');
    const drainVoltageValue = document.getElementById('drain-voltage-value');
    const mosfetStatus = document.getElementById('mosfet-status');
    const drainCurrent = document.getElementById('drain-current');
    const canvas = document.getElementById('mosfet-canvas');
    
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    
    // 更新显示值
    gateVoltage.addEventListener('input', function() {
        gateVoltageValue.textContent = this.value;
        updateMOSFETState();
    });
    
    drainVoltage.addEventListener('input', function() {
        drainVoltageValue.textContent = this.value;
        updateMOSFETState();
    });
    
    function updateMOSFETState() {
        const vg = parseFloat(gateVoltage.value);
        const vd = parseFloat(drainVoltage.value);
        
        // 简化的MOSFET模型
        const vth = 1.0; // 阈值电压
        let id, status;
        
        if (vg < vth) {
            // 截止区
            id = 0;
            status = "关闭";
        } else if (vd < vg - vth) {
            // 线性区
            const k = 0.5; // 跨导参数
            id = k * ((vg - vth) * vd - 0.5 * vd * vd);
            status = "线性区";
        } else {
            // 饱和区
            const k = 0.5; // 跨导参数
            id = 0.5 * k * (vg - vth) * (vg - vth);
            status = "饱和区";
        }
        
        // 更新显示
        mosfetStatus.textContent = status;
        drainCurrent.textContent = (id * 1000).toFixed(2); // 转换为mA
        
        // 绘制MOSFET示意图
        drawMOSFETDiagram(ctx, vg, vd, status);
    }
    
    // 初始绘制
    updateMOSFETState();
}

// 绘制MOSFET示意图
function drawMOSFETDiagram(ctx, vg, vd, status) {
    const width = ctx.canvas.width;
    const height = ctx.canvas.height;
    
    // 清空画布
    ctx.clearRect(0, 0, width, height);
    
    // 设置基本样式
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 2;
    
    // 绘制MOSFET结构
    const centerX = width / 2;
    const centerY = height / 2;
    
    // 绘制栅极
    ctx.beginPath();
    ctx.moveTo(centerX - 60, centerY - 80);
    ctx.lineTo(centerX + 60, centerY - 80);
    ctx.stroke();
    
    // 绘制栅极连接
    ctx.beginPath();
    ctx.moveTo(centerX, centerY - 80);
    ctx.lineTo(centerX, centerY - 40);
    ctx.stroke();
    
    // 绘制氧化层
    ctx.fillStyle = '#e0e0e0';
    ctx.fillRect(centerX - 40, centerY - 40, 80, 10);
    
    // 绘制沟道
    const channelColor = status === "关闭" ? '#f0f0f0' : '#4CAF50';
    ctx.fillStyle = channelColor;
    ctx.fillRect(centerX - 40, centerY - 30, 80, 60);
    
    // 绘制源极和漏极
    ctx.fillStyle = '#666';
    ctx.fillRect(centerX - 60, centerY - 30, 20, 60);
    ctx.fillRect(centerX + 40, centerY - 30, 20, 60);
    
    // 绘制源极和漏极连接
    ctx.beginPath();
    ctx.moveTo(centerX - 50, centerY - 30);
    ctx.lineTo(centerX - 50, centerY - 80);
    ctx.stroke();
    
    ctx.beginPath();
    ctx.moveTo(centerX + 50, centerY - 30);
    ctx.lineTo(centerX + 50, centerY - 80);
    ctx.stroke();
    
    // 绘制衬底
    ctx.fillStyle = '#333';
    ctx.fillRect(centerX - 80, centerY + 30, 160, 20);
    
    // 绘制电压指示
    ctx.font = '14px Arial';
    ctx.fillStyle = '#333';
    
    // 栅极电压
    ctx.fillText(`Vg = ${vg}V`, centerX - 80, centerY - 90);
    
    // 漏极电压
    ctx.fillText(`Vd = ${vd}V`, centerX + 60, centerY - 90);
    
    // 状态指示
    ctx.font = '16px Arial';
    ctx.fillStyle = status === "关闭" ? '#F44336' : '#4CAF50';
    ctx.fillText(`状态: ${status}`, centerX - 40, centerY + 80);
}

// 初始化I-V曲线图
function initIVCurveChart() {
    const canvas = document.getElementById('iv-curve-chart');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    
    // 创建图表
    const chart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: [],
            datasets: [{
                label: 'I-V特性曲线',
                data: [],
                backgroundColor: 'rgba(26, 115, 232, 0.2)',
                borderColor: 'rgba(26, 115, 232, 1)',
                borderWidth: 2,
                tension: 0.4,
                fill: true
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                x: {
                    title: {
                        display: true,
                        text: '电压 (V)'
                    }
                },
                y: {
                    title: {
                        display: true,
                        text: '电流 (mA)'
                    },
                    beginAtZero: true
                }
            },
            plugins: {
                legend: {
                    display: true,
                    position: 'top'
                }
            }
        }
    });
    
    // 生成初始数据
    updateIVCurveData(chart, 'silicon', 25);
    
    // 监听控件变化
    const diodeType = document.getElementById('diode-type');
    const temperature = document.getElementById('temperature');
    const temperatureValue = document.getElementById('temperature-value');
    
    if (diodeType) {
        diodeType.addEventListener('change', function() {
            updateIVCurveData(chart, this.value, parseInt(temperature.value));
        });
    }
    
    if (temperature) {
        temperature.addEventListener('input', function() {
            temperatureValue.textContent = this.value;
            updateIVCurveData(chart, diodeType.value, parseInt(this.value));
        });
    }
}

// 更新I-V曲线数据
function updateIVCurveData(chart, diodeType, temperature) {
    // 根据二极管类型和温度生成I-V曲线数据
    const voltages = [];
    const currents = [];
    
    // 二极管参数
    let Is, n, Vt;
    
    switch(diodeType) {
        case 'silicon':
            Is = 1e-12; // 反向饱和电流
            n = 1.7; // 发射系数
            break;
        case 'germanium':
            Is = 1e-6;
            n = 1.5;
            break;
        case 'schottky':
            Is = 1e-8;
            n = 1.2;
            break;
        default:
            Is = 1e-12;
            n = 1.7;
    }
    
    // 热电压
    Vt = 0.026 * (temperature + 273) / 300; // kT/q
    
    // 生成数据点
    for (let v = -2; v <= 2; v += 0.05) {
        voltages.push(v.toFixed(2));
        
        // 二极管方程: I = Is * (exp(V/(n*Vt)) - 1)
        let i;
        if (v < -0.5) {
            // 反向击穿简化处理
            i = -Is * 1000; // 转换为mA
        } else {
            i = Is * (Math.exp(v / (n * Vt)) - 1) * 1000; // 转换为mA
        }
        
        // 限制电流值
        i = Math.min(i, 100); // 最大100mA
        currents.push(i.toFixed(4));
    }
    
    // 更新图表
    chart.data.labels = voltages;
    chart.data.datasets[0].data = currents;
    chart.update();
}

// 初始化能带结构仿真
function initBandStructureSimulation() {
    const material = document.getElementById('material');
    const dopingType = document.getElementById('doping-type');
    const dopingConcentration = document.getElementById('doping-concentration');
    const dopingValue = document.getElementById('doping-value');
    const bandgapValue = document.getElementById('bandgap-value');
    const fermiLevelValue = document.getElementById('fermi-level-value');
    const canvas = document.getElementById('band-structure-canvas');
    
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    
    // 材料参数
    const materialParams = {
        'silicon': { bandgap: 1.12, effectiveMass: 1.08, dielectricConstant: 11.7 },
        'germanium': { bandgap: 0.66, effectiveMass: 0.56, dielectricConstant: 16.0 },
        'gaas': { bandgap: 1.42, effectiveMass: 0.067, dielectricConstant: 12.9 },
        'sic': { bandgap: 3.26, effectiveMass: 0.68, dielectricConstant: 9.7 }
    };
    
    // 更新掺杂浓度显示
    dopingConcentration.addEventListener('input', function() {
        const exponent = this.value;
        dopingValue.innerHTML = `10<sup>${exponent}</sup>`;
        updateBandStructure();
    });
    
    // 监听其他控件变化
    material.addEventListener('change', updateBandStructure);
    dopingType.addEventListener('change', updateBandStructure);
    
    function updateBandStructure() {
        const mat = material.value;
        const doping = dopingType.value;
        const conc = Math.pow(10, parseInt(dopingConcentration.value));
        
        const params = materialParams[mat];
        const Eg = params.bandgap; // 禁带宽度
        
        // 更新禁带宽度显示
        bandgapValue.textContent = Eg.toFixed(2);
        
        // 计算费米能级
        let Ef;
        if (doping === 'intrinsic') {
            Ef = Eg / 2; // 本征费米能级在禁带中间
        } else if (doping === 'n-type') {
            // N型掺杂，费米能级靠近导带
            // 简化计算
            Ef = Eg - 0.1 * Math.log10(conc / 1e16);
            Ef = Math.max(Eg - 0.3, Math.min(Ef, Eg - 0.05));
        } else {
            // P型掺杂，费米能级靠近价带
            Ef = 0.1 * Math.log10(conc / 1e16);
            Ef = Math.min(0.3, Math.max(Ef, 0.05));
        }
        
        // 更新费米能级显示
        fermiLevelValue.textContent = Ef.toFixed(2);
        
        // 绘制能带图
        drawBandStructure(ctx, Eg, Ef, doping);
    }
    
    // 初始绘制
    updateBandStructure();
}

// 绘制能带结构图
function drawBandStructure(ctx, Eg, Ef, dopingType) {
    const width = ctx.canvas.width;
    const height = ctx.canvas.height;
    
    // 清空画布
    ctx.clearRect(0, 0, width, height);
    
    // 设置坐标系
    const margin = 50;
    const graphWidth = width - 2 * margin;
    const graphHeight = height - 2 * margin;
    
    // 能量轴范围 (0 到 Eg + 0.5 eV)
    const energyMin = -0.5;
    const energyMax = Eg + 0.5;
    const energyRange = energyMax - energyMin;
    
    // 绘制坐标轴
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 2;
    
    // Y轴 (能量)
    ctx.beginPath();
    ctx.moveTo(margin, margin);
    ctx.lineTo(margin, height - margin);
    ctx.stroke();
    
    // X轴 (位置)
    ctx.beginPath();
    ctx.moveTo(margin, height - margin);
    ctx.lineTo(width - margin, height - margin);
    ctx.stroke();
    
    // 绘制价带顶
    ctx.strokeStyle = '#4CAF50';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(margin, height - margin - (0 / energyRange) * graphHeight);
    ctx.lineTo(width - margin, height - margin - (0 / energyRange) * graphHeight);
    ctx.stroke();
    
    // 绘制导带底
    ctx.strokeStyle = '#2196F3';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(margin, height - margin - (Eg / energyRange) * graphHeight);
    ctx.lineTo(width - margin, height - margin - (Eg / energyRange) * graphHeight);
    ctx.stroke();
    
    // 绘制费米能级
    ctx.strokeStyle = '#FF9800';
    ctx.lineWidth = 2;
    ctx.setLineDash([5, 5]);
    ctx.beginPath();
    ctx.moveTo(margin, height - margin - (Ef / energyRange) * graphHeight);
    ctx.lineTo(width - margin, height - margin - (Ef / energyRange) * graphHeight);
    ctx.stroke();
    ctx.setLineDash([]);
    
    // 添加标签
    ctx.fillStyle = '#333';
    ctx.font = '14px Arial';
    
    // 价带标签
    ctx.fillText('价带顶 (Ev)', width - margin - 80, height - margin - (0 / energyRange) * graphHeight - 10);
    
    // 导带标签
    ctx.fillText('导带底 (Ec)', width - margin - 80, height - margin - (Eg / energyRange) * graphHeight - 10);
    
    // 费米能级标签
    ctx.fillText('费米能级 (Ef)', width - margin - 80, height - margin - (Ef / energyRange) * graphHeight - 10);
    
    // 禁带宽度标注
    ctx.beginPath();
    ctx.moveTo(margin - 10, height - margin - (0 / energyRange) * graphHeight);
    ctx.lineTo(margin - 10, height - margin - (Eg / energyRange) * graphHeight);
    ctx.stroke();
    
    ctx.beginPath();
    ctx.moveTo(margin - 15, height - margin - (0 / energyRange) * graphHeight);
    ctx.lineTo(margin - 5, height - margin - (0 / energyRange) * graphHeight);
    ctx.stroke();
    
    ctx.beginPath();
    ctx.moveTo(margin - 15, height - margin - (Eg / energyRange) * graphHeight);
    ctx.lineTo(margin - 5, height - margin - (Eg / energyRange) * graphHeight);
    ctx.stroke();
    
    ctx.fillText(`Eg = ${Eg.toFixed(2)} eV`, margin - 45, height - margin - (Eg / (2 * energyRange)) * graphHeight);
    
    // 添加能量刻度
    ctx.font = '12px Arial';
    for (let e = 0; e <= Eg; e += Eg / 5) {
        const y = height - margin - (e / energyRange) * graphHeight;
        
        ctx.beginPath();
        ctx.moveTo(margin - 5, y);
        ctx.lineTo(margin, y);
        ctx.stroke();
        
        ctx.fillText(`${e.toFixed(1)} eV`, margin - 40, y + 4);
    }
    
    // 添加掺杂类型信息
    let dopingText;
    switch(dopingType) {
        case 'intrinsic':
            dopingText = '本征半导体';
            break;
        case 'n-type':
            dopingText = 'N型半导体';
            break;
        case 'p-type':
            dopingText = 'P型半导体';
            break;
    }
    
    ctx.font = '16px Arial';
    ctx.fillText(dopingText, width / 2 - 40, 30);
}

// 初始化3D器件查看器
function initDevice3DViewer() {
    const deviceType = document.getElementById('device-type');
    const viewMode = document.getElementById('view-mode');
    const viewer = document.getElementById('device-3d-viewer');
    
    if (!viewer) return;
    
    // 初始化控制按钮
    const rotateLeft = document.getElementById('rotate-left');
    const rotateRight = document.getElementById('rotate-right');
    const rotateUp = document.getElementById('rotate-up');
    const rotateDown = document.getElementById('rotate-down');
    const zoomIn = document.getElementById('zoom-in');
    const zoomOut = document.getElementById('zoom-out');
    const resetView = document.getElementById('reset-view');
    
    // 当前旋转角度和缩放
    let rotationX = 0;
    let rotationY = 0;
    let zoom = 1;
    
    // 更新3D视图
    function update3DView() {
        const device = deviceType.value;
        const mode = viewMode.value;
        
        // 这里应该使用真正的3D渲染库，如Three.js
        // 为了演示，我们使用一个占位符
        viewer.innerHTML = `
            <div class="viewer-3d-placeholder" style="transform: rotateX(${rotationX}deg) rotateY(${rotationY}deg) scale(${zoom})">
                <p>${device.toUpperCase()} 器件 - ${mode === 'exterior' ? '外部结构' : mode === 'cross-section' ? '截面图' : '分层视图'}</p>
                <p>旋转: X=${rotationX}°, Y=${rotationY}°, 缩放: ${zoom.toFixed(1)}x</p>
            </div>
        `;
    }
    
    // 控制按钮事件
    if (rotateLeft) {
        rotateLeft.addEventListener('click', () => {
            rotationY -= 15;
            update3DView();
        });
    }
    
    if (rotateRight) {
        rotateRight.addEventListener('click', () => {
            rotationY += 15;
            update3DView();
        });
    }
    
    if (rotateUp) {
        rotateUp.addEventListener('click', () => {
            rotationX -= 15;
            update3DView();
        });
    }
    
    if (rotateDown) {
        rotateDown.addEventListener('click', () => {
            rotationX += 15;
            update3DView();
        });
    }
    
    if (zoomIn) {
        zoomIn.addEventListener('click', () => {
            zoom = Math.min(zoom + 0.2, 3);
            update3DView();
        });
    }
    
    if (zoomOut) {
        zoomOut.addEventListener('click', () => {
            zoom = Math.max(zoom - 0.2, 0.5);
            update3DView();
        });
    }
    
    if (resetView) {
        resetView.addEventListener('click', () => {
            rotationX = 0;
            rotationY = 0;
            zoom = 1;
            update3DView();
        });
    }
    
    // 器件类型和视图模式变化
    deviceType.addEventListener('change', update3DView);
    viewMode.addEventListener('change', update3DView);
    
    // 初始化视图
    update3DView();
}

// 标签页功能
function initTabs() {
    const tabButtons = document.querySelectorAll('.tab');
    
    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            const tabId = this.getAttribute('data-tab');
            const tabContainer = this.closest('.tabs-container');
            
            if (!tabContainer) return;
            
            // 移除所有active类
            tabContainer.querySelectorAll('.tab').forEach(tab => {
                tab.classList.remove('active');
            });
            
            tabContainer.querySelectorAll('.tab-content').forEach(content => {
                content.classList.remove('active');
            });
            
            // 添加active类到当前标签
            this.classList.add('active');
            
            // 显示对应内容
            const targetContent = tabContainer.querySelector(`#${tabId}`);
            if (targetContent) {
                targetContent.classList.add('active');
            }
        });
    });
}

// 通知功能
function initNotifications() {
    // 这里可以添加通知系统的初始化代码
}

// 显示通知
function showNotification(message, type = 'info') {
    // 创建通知元素
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    // 添加到页面
    document.body.appendChild(notification);
    
    // 显示通知
    setTimeout(() => {
        notification.classList.add('show');
    }, 10);
    
    // 3秒后自动隐藏
    setTimeout(() => {
        notification.classList.remove('show');
        
        // 移除元素
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// 开始学习按钮
document.getElementById('start-learning')?.addEventListener('click', function() {
    window.location.href = 'chapters/preface.html';
});

// 工具函数：格式化数字
function formatNumber(num, decimals = 2) {
    return parseFloat(num).toFixed(decimals);
}

// 工具函数：科学计数法
function scientificNotation(num, decimals = 2) {
    return num.toExponential(decimals);
}

// 工具函数：单位转换
function convertUnit(value, fromUnit, toUnit) {
    // 这里可以实现各种单位转换
    // 例如：V -> mV, A -> mA, 等。
    return value;
}

// 左侧菜单目录功能
function initSidebar() {
    const sidebarToggle = document.querySelector('.sidebar-toggle');
    const sidebarHideBtn = document.querySelector('.sidebar-hide-btn');
    const sidebar = document.querySelector('.sidebar');
    const mainContent = document.querySelector('.main-content');
    
    // 如果侧边栏不存在，则不执行初始化
    if (!sidebar) {
        console.log('Sidebar element not found, skipping sidebar initialization');
        return;
    }
    
    // 创建提示元素
    const sidebarHint = document.createElement('div');
    sidebarHint.className = 'sidebar-hint';
    sidebarHint.textContent = '按 [S] 键或点击此处显示侧边栏';
    sidebar.appendChild(sidebarHint);
    
    // 侧边栏状态管理
    const sidebarStates = {
        NORMAL: 'normal',      // 正常显示
        COLLAPSED: 'collapsed', // 折叠状态
        AUTO_HIDDEN: 'auto-hidden' // 自动隐藏状态
    };
    
    // 获取当前侧边栏状态
    function getSidebarState() {
        if (sidebar.classList.contains('auto-hidden')) return sidebarStates.AUTO_HIDDEN;
        if (sidebar.classList.contains('collapsed')) return sidebarStates.COLLAPSED;
        return sidebarStates.NORMAL;
    }
    
    // 设置侧边栏状态
    function setSidebarState(state) {
        // 清除所有状态类
        sidebar.classList.remove('collapsed', 'auto-hidden');
        mainContent.classList.remove('expanded', 'full-expanded');
        
        // 根据状态添加相应的类
        switch (state) {
            case sidebarStates.COLLAPSED:
                sidebar.classList.add('collapsed');
                mainContent.classList.add('expanded');
                break;
            case sidebarStates.AUTO_HIDDEN:
                sidebar.classList.add('auto-hidden');
                mainContent.classList.add('full-expanded');
                break;
            case sidebarStates.NORMAL:
            default:
                // 默认状态，无需添加额外类
                break;
        }
        
        // 更新按钮图标
        updateToggleIcon(state);
        
        // 保存状态到本地存储
        localStorage.setItem('sidebarState', state);
    }
    
    // 更新切换按钮图标
    function updateToggleIcon(state) {
        const icon = sidebarToggle.querySelector('i');
        if (!icon) return;
        
        // 清除所有图标类
        icon.classList.remove('fa-chevron-left', 'fa-chevron-right', 'fa-eye');
        
        // 根据状态添加相应的图标
        switch (state) {
            case sidebarStates.COLLAPSED:
                icon.classList.add('fa-chevron-right');
                break;
            case sidebarStates.AUTO_HIDDEN:
                icon.classList.add('fa-eye');
                break;
            case sidebarStates.NORMAL:
            default:
                icon.classList.add('fa-chevron-left');
                break;
        }
    }
    
    // 循环切换侧边栏状态
    function cycleSidebarState() {
        const currentState = getSidebarState();
        let nextState;
        
        // 定义状态切换顺序
        switch (currentState) {
            case sidebarStates.NORMAL:
                nextState = sidebarStates.COLLAPSED;
                break;
            case sidebarStates.COLLAPSED:
                nextState = sidebarStates.AUTO_HIDDEN;
                break;
            case sidebarStates.AUTO_HIDDEN:
                nextState = sidebarStates.NORMAL;
                break;
            default:
                nextState = sidebarStates.NORMAL;
                break;
        }
        
        setSidebarState(nextState);
    }
    
    if (sidebarToggle && sidebar && mainContent) {
        // 点击切换按钮循环切换状态
        sidebarToggle.addEventListener('click', function(e) {
            e.preventDefault();
            cycleSidebarState();
        });
        
        // 双击切换按钮直接切换到自动隐藏状态
        sidebarToggle.addEventListener('dblclick', function(e) {
            e.preventDefault();
            setSidebarState(sidebarStates.AUTO_HIDDEN);
        });
        
        // 手动隐藏按钮点击事件
        if (sidebarHideBtn) {
            sidebarHideBtn.addEventListener('click', function(e) {
                e.preventDefault();
                setSidebarState(sidebarStates.AUTO_HIDDEN);
            });
        }
        
        // 从本地存储恢复侧边栏状态，但默认设置为正常状态
        const savedState = localStorage.getItem('sidebarState') || sidebarStates.NORMAL;
        
        // 始终设置为正常状态，确保侧边栏默认显示
        setSidebarState(sidebarStates.NORMAL);
    }
    
    // 键盘快捷键支持
    document.addEventListener('keydown', function(e) {
        // 按 S 键切换侧边栏状态
        if (e.key === 's' || e.key === 'S') {
            // 确保焦点不在输入框中
            if (document.activeElement.tagName !== 'INPUT' && 
                document.activeElement.tagName !== 'TEXTAREA' && 
                document.activeElement.contentEditable !== 'true') {
                e.preventDefault();
                cycleSidebarState();
            }
        }
        
        // 按 Esc 键隐藏侧边栏
        if (e.key === 'Escape') {
            setSidebarState(sidebarStates.AUTO_HIDDEN);
        }
    });
    
    // 自动隐藏功能 - 鼠标离开侧边栏区域后自动隐藏
    let autoHideTimer;
    
    sidebar.addEventListener('mouseenter', function() {
        // 鼠标进入侧边栏，清除自动隐藏计时器
        clearTimeout(autoHideTimer);
        
        // 如果是自动隐藏状态，暂时显示
        if (getSidebarState() === sidebarStates.AUTO_HIDDEN) {
            sidebar.classList.remove('auto-hidden');
            mainContent.classList.remove('full-expanded');
        }
    });
    
    sidebar.addEventListener('mouseleave', function() {
        // 鼠标离开侧边栏，设置自动隐藏计时器
        clearTimeout(autoHideTimer);
        autoHideTimer = setTimeout(function() {
            // 如果之前是自动隐藏状态，恢复自动隐藏
            const savedState = localStorage.getItem('sidebarState') || sidebarStates.NORMAL;
            if (savedState === sidebarStates.AUTO_HIDDEN) {
                sidebar.classList.add('auto-hidden');
                mainContent.classList.add('full-expanded');
            }
        }, 3000); // 3秒后自动隐藏
    });
    
    // 页面滚动时自动隐藏侧边栏（可选）
    let scrollTimer;
    let lastScrollTop = 0;
    
    window.addEventListener('scroll', function() {
        const currentScrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        // 清除之前的计时器
        clearTimeout(scrollTimer);
        
        // 如果是向下滚动且不是自动隐藏状态，则自动隐藏
        if (currentScrollTop > lastScrollTop && getSidebarState() === sidebarStates.NORMAL) {
            scrollTimer = setTimeout(function() {
                setSidebarState(sidebarStates.AUTO_HIDDEN);
            }, 1000); // 1秒后自动隐藏
        }
        
        lastScrollTop = currentScrollTop <= 0 ? 0 : currentScrollTop;
    });
    
    // 鼠标移动到左侧边缘时唤醒侧边栏
    let mouseTimer;
    document.addEventListener('mousemove', function(e) {
        // 如果侧边栏不是自动隐藏状态，则不需要处理
        if (getSidebarState() !== sidebarStates.AUTO_HIDDEN) return;
        
        // 检查鼠标是否在左侧边缘20px范围内
        if (e.clientX <= 20) {
            // 清除之前的定时器
            clearTimeout(mouseTimer);
            
            // 设置一个短暂的延迟，避免意外触发
            mouseTimer = setTimeout(function() {
                setSidebarState(sidebarStates.NORMAL);
            }, 200);
        } else {
            // 清除定时器
            clearTimeout(mouseTimer);
        }
    });
    
    // 章节导航点击事件
    const chapterNavItems = document.querySelectorAll('.chapter-nav-item');
    chapterNavItems.forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            
            // 移除所有活动状态
            chapterNavItems.forEach(navItem => navItem.classList.remove('active'));
            
            // 添加当前活动状态
            this.classList.add('active');
            
            // 跳转到对应章节
            const chapterUrl = this.getAttribute('href');
            if (chapterUrl) {
                window.location.href = chapterUrl;
            }
        });
    });
    
    // 当前章节内导航点击事件
    const sectionNavItems = document.querySelectorAll('.section-nav-item');
    sectionNavItems.forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            
            // 移除所有活动状态
            sectionNavItems.forEach(navItem => navItem.classList.remove('active'));
            
            // 添加当前活动状态
            this.classList.add('active');
            
            // 滚动到对应部分
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                // 计算偏移量，考虑固定头部和侧边栏
                const headerHeight = document.querySelector('.header').offsetHeight;
                const offset = 20; // 额外的偏移量
                
                window.scrollTo({
                    top: targetElement.offsetTop - headerHeight - offset,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // 滚动时更新当前章节内导航的活动状态
    window.addEventListener('scroll', function() {
        const sections = document.querySelectorAll('section[id]');
        const scrollPosition = window.scrollY + 100; // 考虑固定头部的高度
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                // 移除所有活动状态
                sectionNavItems.forEach(navItem => navItem.classList.remove('active'));
                
                // 添加当前部分的活动状态
                const activeNavItem = document.querySelector(`.section-nav-item[href="#${sectionId}"]`);
                if (activeNavItem) {
                    activeNavItem.classList.add('active');
                }
            }
        });
    });
    
    // 移动端侧边栏处理
    if (window.innerWidth <= 576) {
        // 添加移动端菜单按钮
        const mobileMenuBtn = document.createElement('button');
        mobileMenuBtn.className = 'mobile-sidebar-btn';
        mobileMenuBtn.innerHTML = '<i class="fas fa-bars"></i>';
        mobileMenuBtn.style.cssText = `
            position: fixed;
            top: 90px;
            left: 20px;
            z-index: 1001;
            background-color: var(--primary-color);
            color: white;
            border: none;
            border-radius: 50%;
            width: 50px;
            height: 50px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 1.2rem;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
        `;
        
        document.body.appendChild(mobileMenuBtn);
        
        // 移动端菜单按钮点击事件
        mobileMenuBtn.addEventListener('click', function() {
            sidebar.classList.toggle('active');
            
            // 更新按钮图标
            const icon = this.querySelector('i');
            if (sidebar.classList.contains('active')) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-times');
            } else {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        });
        
        // 点击侧边栏外部关闭侧边栏
        document.addEventListener('click', function(e) {
            if (!sidebar.contains(e.target) && !mobileMenuBtn.contains(e.target)) {
                sidebar.classList.remove('active');
                const icon = mobileMenuBtn.querySelector('i');
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        });
    }
}