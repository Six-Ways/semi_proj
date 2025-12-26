// SEMI_PROJ AI助手 - 半导体器件智能学习助手

class SemiAIAssistant {
    constructor() {
        this.apiKey = null; // 在实际部署时需要配置API密钥
        this.conversationHistory = [];
        this.learningProfile = {
            currentLevel: 'beginner', // beginner, intermediate, advanced
            interests: ['semiconductor-basics'],
            completedChapters: [],
            weakAreas: [],
            learningGoals: []
        };
        this.init();
    }

    init() {
        this.createAIAssistantUI();
        this.loadLearningProfile();
        this.initEventListeners();
    }

    createAIAssistantUI() {
        // 创建AI助手界面
        const aiAssistantHTML = `
            <div id="ai-assistant" class="ai-assistant">
                <div class="ai-assistant-header">
                    <div class="ai-avatar">
                        <i class="fas fa-robot"></i>
                    </div>
                    <div class="ai-info">
                        <h4>半导体学习助手</h4>
                        <span class="ai-status">在线</span>
                    </div>
                    <button class="ai-toggle" id="ai-toggle">
                        <i class="fas fa-chevron-down"></i>
                    </button>
                </div>
                <div class="ai-assistant-body" id="ai-assistant-body">
                    <div class="ai-tabs">
                        <button class="ai-tab active" data-tab="chat">智能问答</button>
                        <button class="ai-tab" data-tab="learning">学习路径</button>
                        <button class="ai-tab" data-tab="simulation">参数模拟</button>
                    </div>
                    <div class="ai-content">
                        <div class="ai-panel active" id="ai-chat">
                            <div class="chat-messages" id="chat-messages">
                                <div class="ai-message">
                                    <div class="message-content">
                                        <p>你好！我是你的半导体学习助手。我可以帮助你理解半导体器件原理、解答技术问题、推荐学习路径，以及模拟器件参数。有什么可以帮助你的吗？</p>
                                    </div>
                                </div>
                            </div>
                            <div class="chat-input-container">
                                <input type="text" id="chat-input" placeholder="输入你的问题..." />
                                <button id="send-message"><i class="fas fa-paper-plane"></i></button>
                            </div>
                        </div>
                        <div class="ai-panel" id="ai-learning">
                            <div class="learning-overview">
                                <h4>你的学习进度</h4>
                                <div class="progress-indicator">
                                    <div class="progress-bar">
                                        <div class="progress-fill" style="width: ${this.calculateProgress()}%"></div>
                                    </div>
                                    <span class="progress-text">${this.calculateProgress()}% 完成</span>
                                </div>
                                <div class="learning-recommendations">
                                    <h5>推荐学习路径</h5>
                                    <div class="recommendation-list" id="recommendation-list">
                                        <!-- 动态生成推荐内容 -->
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="ai-panel" id="ai-simulation">
                            <div class="simulation-controls">
                                <h4>器件参数模拟器</h4>
                                <div class="parameter-form">
                                    <div class="form-group">
                                        <label for="device-type">器件类型</label>
                                        <select id="device-type">
                                            <option value="mosfet">MOSFET</option>
                                            <option value="bjt">BJT</option>
                                            <option value="diode">二极管</option>
                                            <option value="jfet">JFET</option>
                                        </select>
                                    </div>
                                    <div class="form-group">
                                        <label for="param-voltage">电压 (V)</label>
                                        <input type="range" id="param-voltage" min="0" max="10" step="0.1" value="1.0">
                                        <span class="param-value">1.0V</span>
                                    </div>
                                    <div class="form-group">
                                        <label for="param-current">电流 (mA)</label>
                                        <input type="range" id="param-current" min="0" max="100" step="1" value="10">
                                        <span class="param-value">10mA</span>
                                    </div>
                                    <button id="run-simulation" class="btn btn-primary">运行模拟</button>
                                </div>
                                <div class="simulation-results" id="simulation-results">
                                    <canvas id="simulation-chart"></canvas>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;

        // 添加到页面
        document.body.insertAdjacentHTML('beforeend', aiAssistantHTML);
    }

    initEventListeners() {
        // AI助手开关
        document.getElementById('ai-toggle').addEventListener('click', () => {
            const assistantBody = document.getElementById('ai-assistant-body');
            const toggleIcon = document.querySelector('#ai-toggle i');
            
            if (assistantBody.style.display === 'none') {
                assistantBody.style.display = 'block';
                toggleIcon.className = 'fas fa-chevron-down';
            } else {
                assistantBody.style.display = 'none';
                toggleIcon.className = 'fas fa-chevron-up';
            }
        });

        // 标签切换
        document.querySelectorAll('.ai-tab').forEach(tab => {
            tab.addEventListener('click', () => {
                // 移除所有活动状态
                document.querySelectorAll('.ai-tab').forEach(t => t.classList.remove('active'));
                document.querySelectorAll('.ai-panel').forEach(p => p.classList.remove('active'));
                
                // 添加当前活动状态
                tab.classList.add('active');
                const tabId = tab.getAttribute('data-tab');
                document.getElementById(`ai-${tabId}`).classList.add('active');
                
                // 如果是学习路径标签，更新推荐内容
                if (tabId === 'learning') {
                    this.updateLearningRecommendations();
                }
            });
        });

        // 聊天输入
        document.getElementById('send-message').addEventListener('click', () => {
            this.sendMessage();
        });

        document.getElementById('chat-input').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.sendMessage();
            }
        });

        // 参数模拟器
        document.getElementById('param-voltage').addEventListener('input', (e) => {
            document.querySelector('#param-voltage + .param-value').textContent = `${e.target.value}V`;
        });

        document.getElementById('param-current').addEventListener('input', (e) => {
            document.querySelector('#param-current + .param-value').textContent = `${e.target.value}mA`;
        });

        document.getElementById('run-simulation').addEventListener('click', () => {
            this.runSimulation();
        });
    }

    sendMessage() {
        const input = document.getElementById('chat-input');
        const message = input.value.trim();
        
        if (!message) return;
        
        // 添加用户消息
        this.addMessageToChat(message, 'user');
        input.value = '';
        
        // 模拟AI响应（实际应用中应调用AI API）
        setTimeout(() => {
            const response = this.generateAIResponse(message);
            this.addMessageToChat(response, 'ai');
        }, 1000);
    }

    addMessageToChat(message, sender) {
        const chatMessages = document.getElementById('chat-messages');
        const messageElement = document.createElement('div');
        messageElement.className = `${sender}-message`;
        
        const messageContent = document.createElement('div');
        messageContent.className = 'message-content';
        messageContent.innerHTML = `<p>${message}</p>`;
        
        messageElement.appendChild(messageContent);
        chatMessages.appendChild(messageElement);
        
        // 滚动到底部
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    generateAIResponse(userMessage) {
        // 简单的基于规则的响应系统
        // 实际应用中应连接到真正的AI API
        
        const lowerMessage = userMessage.toLowerCase();
        
        // 半导体基础问题
        if (lowerMessage.includes('什么是半导体') || lowerMessage.includes('半导体是什么')) {
            return '半导体是导电性介于导体和绝缘体之间的材料。常见的半导体材料有硅(Si)、锗(Ge)、砷化镓(GaAs)等。半导体器件是现代电子技术的基础，如二极管、晶体管、集成电路等都是由半导体材料制成的。';
        }
        
        // MOSFET相关问题
        if (lowerMessage.includes('mosfet') || lowerMessage.includes('场效应管')) {
            return 'MOSFET（金属-氧化物-半导体场效应晶体管）是一种重要的半导体器件。它通过栅极电压控制沟道导电性，实现开关和放大功能。MOSFET有N沟道和P沟道两种类型，是现代集成电路的基本构建单元。';
        }
        
        // 工艺相关问题
        if (lowerMessage.includes('工艺') || lowerMessage.includes('制造')) {
            return '半导体制造工艺主要包括晶圆制备、氧化、光刻、刻蚀、离子注入、薄膜沉积、化学机械抛光等步骤。这些工艺步骤的精确控制对半导体器件的性能至关重要。';
        }
        
        // 学习路径建议
        if (lowerMessage.includes('学习') || lowerMessage.includes('怎么学')) {
            return '建议按照以下路径学习半导体知识：\n1. 半导体材料与物理基础\n2. PN结与二极管原理\n3. 双极晶体管(BJT)工作原理\n4. MOSFET结构与特性\n5. 集成电路基础\n6. 半导体制造工艺\n\n每个阶段都需要理论学习与实践相结合，多做实验和仿真有助于加深理解。';
        }
        
        // 默认响应
        return '这是一个很好的问题！半导体器件与工艺是一个复杂而有趣的领域。你可以尝试查看相关章节内容，或者提出更具体的问题，我会尽力为你解答。你也可以使用学习路径功能获取个性化推荐。';
    }

    calculateProgress() {
        // 计算学习进度
        const totalChapters = 20;
        const completedCount = this.learningProfile.completedChapters.length;
        return Math.round((completedCount / totalChapters) * 100);
    }

    updateLearningRecommendations() {
        // 更新学习推荐
        const recommendationList = document.getElementById('recommendation-list');
        
        // 基于当前学习水平和进度生成推荐
        const recommendations = this.generateRecommendations();
        
        recommendationList.innerHTML = '';
        recommendations.forEach(rec => {
            const recElement = document.createElement('div');
            recElement.className = 'recommendation-item';
            recElement.innerHTML = `
                <div class="rec-icon">
                    <i class="${rec.icon}"></i>
                </div>
                <div class="rec-content">
                    <h5>${rec.title}</h5>
                    <p>${rec.description}</p>
                    <button class="btn btn-sm btn-primary" onclick="window.location.href='${rec.link}'">开始学习</button>
                </div>
            `;
            recommendationList.appendChild(recElement);
        });
    }

    generateRecommendations() {
        // 根据学习档案生成个性化推荐
        const { currentLevel, completedChapters, weakAreas } = this.learningProfile;
        
        if (currentLevel === 'beginner') {
            return [
                {
                    title: '半导体材料基础',
                    description: '了解半导体材料的基本特性和分类',
                    icon: 'fas fa-atom',
                    link: 'chapters/chapter2.html'
                },
                {
                    title: 'PN结原理',
                    description: '学习PN结的形成机理和基本特性',
                    icon: 'fas fa-link',
                    link: 'chapters/chapter3.html'
                }
            ];
        } else if (currentLevel === 'intermediate') {
            return [
                {
                    title: 'MOSFET工作原理',
                    description: '深入理解MOSFET的结构和工作机制',
                    icon: 'fas fa-microchip',
                    link: 'chapters/chapter4.html'
                },
                {
                    title: '器件制造工艺',
                    description: '了解半导体器件制造的关键工艺步骤',
                    icon: 'fas fa-industry',
                    link: 'chapters/chapter9.html'
                }
            ];
        } else {
            return [
                {
                    title: '纳米尺度器件',
                    description: '探索纳米尺度半导体器件的挑战与解决方案',
                    icon: 'fas fa-nanos',
                    link: 'chapters/chapter12.html'
                },
                {
                    title: '宽禁带半导体',
                    description: '了解宽禁带半导体器件的特性与应用',
                    icon: 'fas fa-bolt',
                    link: 'chapters/chapter13.html'
                }
            ];
        }
    }

    runSimulation() {
        // 运行器件参数模拟
        const deviceType = document.getElementById('device-type').value;
        const voltage = parseFloat(document.getElementById('param-voltage').value);
        const current = parseFloat(document.getElementById('param-current').value);
        
        // 生成模拟数据
        const simulationData = this.generateSimulationData(deviceType, voltage, current);
        
        // 绘制图表
        this.drawSimulationChart(simulationData);
    }

    generateSimulationData(deviceType, voltage, current) {
        // 根据器件类型和参数生成模拟数据
        const data = {
            labels: [],
            datasets: [{
                label: `${deviceType.toUpperCase()} I-V特性`,
                data: [],
                borderColor: '#1a73e8',
                backgroundColor: 'rgba(26, 115, 232, 0.1)',
                fill: true,
                tension: 0.4
            }]
        };
        
        // 生成电压点
        for (let v = 0; v <= voltage * 1.2; v += voltage * 0.05) {
            data.labels.push(v.toFixed(2));
            
            // 根据器件类型计算电流
            let i;
            switch (deviceType) {
                case 'diode':
                    // 二极管指数特性
                    i = current * (Math.exp(v / 0.026) - 1) / (Math.exp(voltage / 0.026) - 1);
                    break;
                case 'mosfet':
                    // MOSFET平方律特性
                    if (v < voltage * 0.7) {
                        i = 0.01 * current * v * v / (voltage * voltage);
                    } else {
                        i = current * (v - voltage * 0.7) / (voltage * 0.3);
                    }
                    break;
                case 'bjt':
                    // BJT指数特性
                    i = current * (Math.exp(v / 0.026) - 1) / (Math.exp(voltage / 0.026) - 1);
                    break;
                case 'jfet':
                    // JFET平方律特性
                    i = current * (1 - v / voltage) * (1 - v / voltage);
                    break;
                default:
                    i = current * v / voltage;
            }
            
            data.datasets[0].data.push(i.toFixed(3));
        }
        
        return data;
    }

    drawSimulationChart(data) {
        const canvas = document.getElementById('simulation-chart');
        const ctx = canvas.getContext('2d');
        
        // 如果已有图表实例，先销毁
        if (window.simulationChart) {
            window.simulationChart.destroy();
        }
        
        // 创建新图表
        window.simulationChart = new Chart(ctx, {
            type: 'line',
            data: data,
            options: {
                responsive: true,
                plugins: {
                    title: {
                        display: true,
                        text: '器件特性曲线'
                    },
                    legend: {
                        display: true
                    }
                },
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
                        }
                    }
                }
            }
        });
    }

    loadLearningProfile() {
        // 从本地存储加载学习档案
        const savedProfile = localStorage.getItem('semi-proj-learning-profile');
        if (savedProfile) {
            this.learningProfile = { ...this.learningProfile, ...JSON.parse(savedProfile) };
        }
    }

    saveLearningProfile() {
        // 保存学习档案到本地存储
        localStorage.setItem('semi-proj-learning-profile', JSON.stringify(this.learningProfile));
    }

    markChapterCompleted(chapterId) {
        // 标记章节为已完成
        if (!this.learningProfile.completedChapters.includes(chapterId)) {
            this.learningProfile.completedChapters.push(chapterId);
            this.saveLearningProfile();
            
            // 更新进度
            if (document.querySelector('.progress-fill')) {
                document.querySelector('.progress-fill').style.width = `${this.calculateProgress()}%`;
                document.querySelector('.progress-text').textContent = `${this.calculateProgress()}% 完成`;
            }
        }
    }
}

// 初始化AI助手
document.addEventListener('DOMContentLoaded', function() {
    // 检查是否在章节页面
    if (window.location.pathname.includes('chapters/')) {
        window.semiAI = new SemiAIAssistant();
    }
});