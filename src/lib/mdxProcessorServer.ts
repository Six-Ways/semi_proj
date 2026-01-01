// 定义节类型
export interface Section {
  title: string;
  content: string;
  component: string;
  id?: string;
}

// 定义目录项类型
export interface TocItem {
  level: number;
  text: string;
  id: string;
  component?: string;
}

// 生成标题的唯一ID
export function generateId(text: string): string {
  return text.toLowerCase()
    .replace(/[^a-z0-9\s]/g, '') // 移除特殊字符
    .replace(/\s+/g, '-') // 空格替换为连字符
    .trim();
}

// 从MDX内容中提取目录
export function extractTocFromMDX(source: string): TocItem[] {
  const toc: TocItem[] = [];
  
  // 匹配所有标题（H1-H6）
  const headingRegex = /^(#{1,6})\s+(.+)$/gm;
  let match;
  
  while ((match = headingRegex.exec(source)) !== null) {
    const level = match[1].length;
    const text = match[2].trim();
    const id = generateId(text);
    
    toc.push({
      level,
      text,
      id
    });
  }
  
  return toc;
}

// 将MDX内容分割成节
export function splitMDXContent(source: string): Section[] {
  // 匹配所有顶级标题
  // 使用正则表达式查找所有顶级一级标题的位置
  const topLevelTitleRegex = /(^# (.+)$)/m;
  const topLevelTitleMatch = topLevelTitleRegex.exec(source);
  
  // 匹配所有顶级二级标题（非嵌套在正文内的）
  const topLevelSectionsRegex = /(^## (.+)$)/gm;
  const matches = [];
  let match;
  
  while ((match = topLevelSectionsRegex.exec(source)) !== null) {
    matches.push({
      index: match.index,
      title: match[2].trim(),
      fullMatch: match[0],
      level: 2
    });
  }
  
  const result: Section[] = [];
  
  // 如果有一级标题，添加为单独的节
  if (topLevelTitleMatch) {
    result.push({
      title: topLevelTitleMatch[2].trim(),
      content: '',
      component: 'ChapterTitle'
    });
  }
  
  // 处理每个顶级节
  for (let i = 0; i < matches.length; i++) {
    const currentMatch = matches[i];
    const nextMatch = matches[i + 1];
    
    // 获取当前节的内容（从当前标题到下一个标题或文件末尾）
    const contentStart = currentMatch.index + currentMatch.fullMatch.length;
    const contentEnd = nextMatch ? nextMatch.index : source.length;
    const content = source.substring(contentStart, contentEnd).trim();
    
    // 根据标题确定组件类型
    let component = 'default';
    switch (currentMatch.title) {
      case '章节目标':
        component = 'ChapterObjectives';
        break;
      case '本章逻辑位':
        component = 'LogicalPosition';
        break;
      case '核心内容':
        component = 'CoreContent';
        break;
      case '关键词':
        component = 'Keywords';
        break;
      case '先修提示':
        component = 'PrerequisitePrompt';
        break;
      case '开篇语':
        component = 'OpeningLine';
        break;
      case '前置认知提示':
        component = 'PrerequisitePrompt';
        break;
      case '起手式':
        component = 'OpeningLine';
        break;
      case '正文':
        // 处理正文内容中的三级标题
        const subsections = processMainContent(content);
        if (subsections.length > 0) {
          subsections.forEach(subsection => {
            result.push(subsection);
          });
        } else {
          result.push({
            title: currentMatch.title,
            content,
            component: 'MainContent'
          });
        }
        continue; // 跳过默认添加，因为已经处理了正文的子节
      case '本章小结':
        component = 'ChapterSummary';
        break;
      case '章节逻辑链':
        component = 'LogicalChain';
        break;
      case '章节逻辑链：':
        component = 'LogicalChain';
        break;
      case '欲知后事如何，且听下回分解。':
        component = 'NextChapterPreview';
        break;
      case '欲知后事如何且听下回分解':
        component = 'NextChapterPreview';
        break;
      case '宗门心法':
        component = 'SectMentality';
        break;
      default:
        component = 'default';
        break;
    }
    
    result.push({
      title: currentMatch.title,
      content,
      component
    });
  }
  
  return result;
}

// 处理正文内容，将三级标题分割成独立组件
function processMainContent(content: string): Section[] {
  const subsections: Section[] = [];
  
  // 匹配所有三级标题
  const level3Regex = /(^### (.+)$)/gm;
  const matches = [];
  let match;
  
  while ((match = level3Regex.exec(content)) !== null) {
    matches.push({
      index: match.index,
      title: match[2].trim(),
      fullMatch: match[0],
      level: 3
    });
  }
  
  if (matches.length === 0) {
    // 如果没有三级标题，返回空数组
    return [];
  }
  
  // 处理每个三级标题
  for (let i = 0; i < matches.length; i++) {
    const currentMatch = matches[i];
    const nextMatch = matches[i + 1];
    
    // 获取当前子节的内容
    const contentStart = currentMatch.index + currentMatch.fullMatch.length;
    const contentEnd = nextMatch ? nextMatch.index : content.length;
    const subsectionContent = content.substring(contentStart, contentEnd).trim();
    
    // 将标题转换为组件名（首字母大写，移除特殊字符，空格转驼峰）
    const componentName = currentMatch.title
      .replace(/[^a-zA-Z0-9\s]/g, '') // 移除特殊字符
      .split(/\s+/)
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join('');
    
    subsections.push({
      title: currentMatch.title,
      content: subsectionContent,
      component: componentName || 'MainContent'
    });
  }
  
  return subsections;
}