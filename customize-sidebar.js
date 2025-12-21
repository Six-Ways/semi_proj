const fs = require('fs');
const path = require('path');

// 获取所有章节文件
const chaptersDir = path.join(__dirname, 'chapters');
const chapterFiles = fs.readdirSync(chaptersDir)
    .filter(file => file.startsWith('chapter') && file.endsWith('.html'))
    .sort((a, b) => {
        const aNum = parseInt(a.match(/\d+/)[0]);
        const bNum = parseInt(b.match(/\d+/)[0]);
        return aNum - bNum;
    });

// 为每个章节文件添加侧边栏头部
chapterFiles.forEach(file => {
    const filePath = path.join(chaptersDir, file);
    let content = fs.readFileSync(filePath, 'utf8');
    
    // 检查是否已经有sidebar-header
    if (content.includes('class="sidebar-header"')) {
        console.log(`${file} 已经包含侧边栏头部，跳过...`);
        return;
    }
    
    // 查找并替换侧边栏内容
    const sidebarContentMatch = content.match(/(\s+<div class="sidebar-content">\s+<h3>章节导航<\/h3>)/);
    
    if (sidebarContentMatch) {
        const oldContent = sidebarContentMatch[1];
        const newContent = `
        <div class="sidebar-header">
            <h3>章节导航</h3>
            <button class="sidebar-hide-btn" title="隐藏侧边栏">
                <i class="fas fa-times"></i>
            </button>
        </div>
        
        <div class="sidebar-content">`;
        
        content = content.replace(oldContent, newContent);
        
        // 写回文件
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`已为 ${file} 添加侧边栏头部`);
    } else {
        console.log(`无法在 ${file} 中找到侧边栏内容区域`);
    }
});

console.log('所有章节文件处理完成！');