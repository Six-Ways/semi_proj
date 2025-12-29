// 定义节类型
export interface Section {
  title: string;
  content: string;
  component: string;
}

// 将MDX内容分割成节
export function splitMDXContent(source: string): Section[] {
  // 将内容按二级标题分割
  const sections = source.split(/^## (.+)$/gm);
  
  // 第一个元素是空字符串（因为内容以##开头）
  if (sections.length > 0 && sections[0].trim() === '') {
    sections.shift();
  }
  
  const result: Section[] = [];
  
  // 处理每个节
  for (let i = 0; i < sections.length; i += 2) {
    const title = sections[i]?.trim();
    const sectionContent = sections[i + 1]?.trim() || '';
    
    if (!title) continue;
    
    // 根据标题确定组件类型
    let component = 'default';
    switch (title) {
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
      title,
      content: sectionContent,
      component
    });
  }
  
  return result;
}