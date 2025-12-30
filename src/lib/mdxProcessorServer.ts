// 定义节类型
export interface Section {
  title: string;
  content: string;
  component: string;
}

// 将MDX内容分割成节
export function splitMDXContent(source: string): Section[] {
  // 匹配所有顶级二级标题（非嵌套在正文内的）
  // 使用正则表达式查找所有顶级二级标题的位置
  const topLevelSectionsRegex = /(^## (.+)$)/gm;
  const matches = [];
  let match;
  
  while ((match = topLevelSectionsRegex.exec(source)) !== null) {
    matches.push({
      index: match.index,
      title: match[2].trim(),
      fullMatch: match[0]
    });
  }
  
  const result: Section[] = [];
  
  // 处理每个顶级节
  for (let i = 0; i < matches.length; i++) {
    const currentMatch = matches[i];
    const nextMatch = matches[i + 1];
    
    // 获取当前节的内容（从当前标题到下一个标题或文件末尾）
    const contentStart = currentMatch.index + currentMatch.fullMatch.length;
    const contentEnd = nextMatch ? nextMatch.index : source.length;
    let content = source.substring(contentStart, contentEnd).trim();
    
    // 处理正文（MainContent）特殊情况 - 保留所有嵌套的二级标题
    if (currentMatch.title === '正文') {
      // 正文内容包括所有嵌套的二级标题和内容
      // 我们不需要额外处理，因为上面的content已经包含了所有内容
    } else {
      // 对于其他节，我们需要确保内容中不包含顶级二级标题（这应该不会发生，但以防万一）
      content = content.split(/^## (.+)$/gm)[0]?.trim() || content;
    }
    
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
        component = 'MainContent';
        break;
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