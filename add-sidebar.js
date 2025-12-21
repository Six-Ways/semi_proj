// 为所有章节添加左侧菜单目录的脚本

const fs = require('fs');
const path = require('path');

// 章节列表
const chapters = [
    { file: 'chapter2.html', title: '第2章：半导体材料基础', active: 2 },
    { file: 'chapter3.html', title: '第3章：基础半导体器件', active: 3 },
    { file: 'chapter4.html', title: '第4章：MOSFET核心技术', active: 4 },
    { file: 'chapter5.html', title: '第5章：数字集成器件', active: 5 },
    { file: 'chapter6.html', title: '第6章：模拟集成器件', active: 6 },
    { file: 'chapter7.html', title: '第7章：特殊功能器件', active: 7 },
    { file: 'chapter8.html', title: '第8章：衬底与晶圆制备', active: 8 },
    { file: 'chapter9.html', title: '第9章：器件图形化工艺', active: 9 },
    { file: 'chapter10.html', title: '第10章：器件掺杂与薄膜工艺', active: 10 },
    { file: 'chapter11.html', title: '第11章：器件互连与封装', active: 11 },
    { file: 'chapter12.html', title: '第12章：纳米尺度器件挑战与解决方案', active: 12 },
    { file: 'chapter13.html', title: '第13章：宽禁带半导体器件', active: 13 },
    { file: 'chapter14.html', title: '第14章：后摩尔时代器件技术', active: 14 },
    { file: 'chapter15.html', title: '第15章：器件设计与仿真工具', active: 15 },
    { file: 'chapter16.html', title: '第16章：故障排查与测试技术', active: 16 },
    { file: 'chapter17.html', title: '第17章：行业资源汇总', active: 17 }
];

// 生成左侧菜单HTML
function generateSidebar(activeChapter) {
    let chapterLinks = '';
    for (let i = 1; i <= 17; i++) {
        const activeClass = i === activeChapter ? 'active' : '';
        chapterLinks += `
                <a href="chapter${i}.html" class="chapter-nav-item ${activeClass}">
                    第${i}章：${getChapterTitle(i)}
                </a>`;
    }
    
    return `
    <!-- 左侧菜单目录 -->
    <aside class="sidebar">
        <button class="sidebar-toggle">
            <i class="fas fa-chevron-left"></i>
        </button>
        
        <div class="sidebar-content">
            <h3>章节导航</h3>
            <nav class="chapter-nav">
                <a href="../index.html" class="chapter-nav-item">
                    <i class="fas fa-home"></i> 返回主页
                </a>
                ${chapterLinks}
            </nav>
            
            <div class="current-chapter-nav">
                <h4>当前章节</h4>
                <nav class="section-nav">
                    <!-- 这里将根据每个章节的具体内容进行定制 -->
                </nav>
            </div>
        </div>
    </aside>`;
}

// 获取章节标题
function getChapterTitle(chapterNumber) {
    const titles = {
        1: '半导体行业与技术演进',
        2: '半导体材料基础',
        3: '基础半导体器件',
        4: 'MOSFET核心技术',
        5: '数字集成器件',
        6: '模拟集成器件',
        7: '特殊功能器件',
        8: '衬底与晶圆制备',
        9: '器件图形化工艺',
        10: '器件掺杂与薄膜工艺',
        11: '器件互连与封装',
        12: '纳米尺度器件挑战与解决方案',
        13: '宽禁带半导体器件',
        14: '后摩尔时代器件技术',
        15: '器件设计与仿真工具',
        16: '故障排查与测试技术',
        17: '行业资源汇总'
    };
    return titles[chapterNumber] || '';
}

// 为每个章节添加左侧菜单目录
chapters.forEach(chapter => {
    const filePath = path.join(__dirname, 'chapters', chapter.file);
    
    try {
        // 读取文件内容
        let content = fs.readFileSync(filePath, 'utf8');
        
        // 查找插入位置（在body标签之后）
        const bodyStartIndex = content.indexOf('<body>');
        if (bodyStartIndex === -1) {
            console.error(`无法在${chapter.file}中找到<body>标签`);
            return;
        }
        
        // 生成左侧菜单HTML
        const sidebarHTML = generateSidebar(chapter.active);
        
        // 插入左侧菜单
        content = content.substring(0, bodyStartIndex + 6) + 
                  '\n    \n' + sidebarHTML + 
                  '\n    \n' + content.substring(bodyStartIndex + 6);
        
        // 确保main-content类存在
        if (!content.includes('class="main-content"')) {
            content = content.replace('<main>', '<main class="main-content">');
        }
        
        // 写回文件
        fs.writeFileSync(filePath, content, 'utf8');
        
        console.log(`已为${chapter.file}添加左侧菜单目录`);
    } catch (error) {
        console.error(`处理${chapter.file}时出错:`, error.message);
    }
});

console.log('所有章节左侧菜单目录添加完成！');