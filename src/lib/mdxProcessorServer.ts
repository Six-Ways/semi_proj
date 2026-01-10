// 定义节类型
export interface Section {
  title: string;
  content: string;
  component: string;
  props?: Record<string, any>;
  type?: 'main' | 'metadata'; // 添加类型区分，main表示正文，metadata表示非正文
}

// 定义非正文内容的结构化数据
export interface ChapterMetadata {
  logicalPosition?: string;
  keywords?: string[];
  prerequisitePrompt?: string;
  openingLine?: string;
  seekKnowledge?: string;
  chapterSummary?: string;
  nextChapterPreview?: string;
  sectMentality?: string;
  [key: string]: any;
}

// 扩展章节组件映射配置
export interface ChapterComponentMap {
  [key: string]: {
    component: string;
    props?: Record<string, any>;
  };
}

// 为每个章节定义组件映射（保留用于特定章节的特殊组件）
export const chapterComponentMaps: Record<string, ChapterComponentMap> = {};

// 定义目录项类型
export interface TocItem {
  level: number;
  text: string;
  id: string;
  component?: string;
}

// 生成标题的唯一ID
export function generateId(text: string): string {
  const baseId = text.toLowerCase()
    .replace(/[^a-z0-9\s]/g, '') // 移除特殊字符
    .replace(/\s+/g, '-') // 空格替换为连字符
    .trim();
  
  // 确保id不为空，如果为空则使用时间戳生成唯一id
  return baseId || `heading-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

// 从正文内容中提取子节（基于H3标题）
function extractSubSections(content: string): Section[] {
  const subSections: Section[] = [];
  
  // 匹配所有H3标题
  const h3Regex = /^(### (.+)$)/gm;
  const matches = [];
  let match;
  
  while ((match = h3Regex.exec(content)) !== null) {
    matches.push({
      index: match.index,
      title: match[2].trim(),
      fullMatch: match[0]
    });
  }
  
  // 如果没有H3标题，返回空数组
  if (matches.length === 0) {
    return [];
  }
  
  // 处理每个子节
  for (let i = 0; i < matches.length; i++) {
    const currentMatch = matches[i];
    const nextMatch = matches[i + 1];
    
    // 获取当前子节的内容
    const contentStart = currentMatch.index + currentMatch.fullMatch.length;
    const contentEnd = nextMatch ? nextMatch.index : content.length;
    const subContent = content.substring(contentStart, contentEnd).trim();
    
    subSections.push({
      title: currentMatch.title,
      content: subContent,
      component: 'default' // 默认组件，后续会被内容映射系统覆盖
    });
  }
  
  return subSections;
}

// 从正文内容中提取主要节（基于H2标题）
function extractMainContentSections(content: string): Section[] {
  const sections: Section[] = [];
  
  // 匹配所有H2标题
  const h2Regex = /^(## (.+)$)/gm;
  const matches = [];
  let match;
  
  while ((match = h2Regex.exec(content)) !== null) {
    matches.push({
      index: match.index,
      title: match[2].trim(),
      fullMatch: match[0]
    });
  }
  
  // 如果没有H2标题，返回空数组
  if (matches.length === 0) {
    return [];
  }
  
  // 处理每个节
  for (let i = 0; i < matches.length; i++) {
    const currentMatch = matches[i];
    const nextMatch = matches[i + 1];
    
    // 获取当前节的内容
    const contentStart = currentMatch.index + currentMatch.fullMatch.length;
    const contentEnd = nextMatch ? nextMatch.index : content.length;
    const sectionContent = content.substring(contentStart, contentEnd).trim();
    
    sections.push({
      title: currentMatch.title,
      content: sectionContent,
      component: 'default' // 默认组件，后续会被内容映射系统覆盖
    });
  }
  
  return sections;
}

// 从Markdown内容中提取目录
export function extractTocFromMarkdown(source: string): TocItem[] {
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

// 从MDX内容中提取目录 - 兼容旧函数名
export function extractTocFromMDX(source: string): TocItem[] {
  return extractTocFromMarkdown(source);
}

// 将Markdown内容分割成节
export function splitMarkdownContent(source: string, chapterSlug: string = ''): Section[] {
  // 匹配所有顶级标题
  // 使用正则表达式查找所有顶级一级标题的位置
  const topLevelTitleRegex = /(^# (.+)$)/m;
  const topLevelTitleMatch = topLevelTitleRegex.exec(source);
  
  const result: Section[] = [];
  
  // 如果有一级标题，添加为单独的节
  if (topLevelTitleMatch) {
    result.push({
      title: topLevelTitleMatch[2].trim(),
      content: '',
      component: 'ChapterTitle',
      type: 'metadata'
    });
  }
  
  // 先找到所有顶级二级标题，然后处理正文内容
  const topLevelSectionsRegex = /(^## (.+)$)/gm;
  const topLevelMatches = [];
  let topLevelMatch;
  
  while ((topLevelMatch = topLevelSectionsRegex.exec(source)) !== null) {
    topLevelMatches.push({
      index: topLevelMatch.index,
      title: topLevelMatch[2].trim(),
      fullMatch: topLevelMatch[0],
      level: 2
    });
  }
  
  // 处理每个顶级节
  for (let i = 0; i < topLevelMatches.length; i++) {
    const currentMatch = topLevelMatches[i];
    const nextMatch = topLevelMatches[i + 1];
    
    // 获取当前节的内容
    const contentStart = currentMatch.index + currentMatch.fullMatch.length;
    const contentEnd = nextMatch ? nextMatch.index : source.length;
    const content = source.substring(contentStart, contentEnd).trim();
    
    // 根据标题确定组件类型和类型
    let component = 'default';
    let type: 'main' | 'metadata' = 'metadata';
    let props: Record<string, any> = {};
    
    // 按照用户要求，每个二级标题对应一个组件
    switch (currentMatch.title) {
      case '本章逻辑位':
        component = 'LogicalPosition';
        break;
      case '关键词':
        component = 'Keywords';
        break;
      case '先修提示':
      case '前置认知提示':
        component = 'PrerequisitePrompt';
        break;
      case '开篇语':
      case '起手式':
        component = 'OpeningLine';
        break;
      case '正文':
        // 处理正文内容，支持组件插入
        component = 'MainContentStart';
        type = 'main';
        props = {
          originalContent: content.trim() // 保留原始内容，供后续处理
        };
        break;
      case '本章小结':
        component = 'ChapterSummary';
        type = 'main';
        break;
      case '章节逻辑链':
      case '章节逻辑链：':
        component = 'LogicalChain';
        type = 'main';
        break;
      case '欲知后事如何，且听下回分解。':
      case '欲知后事如何且听下回分解':
        component = 'NextChapterPreview';
        type = 'main';
        break;
      case '宗门心法':
        component = 'SectMentality';
        type = 'main';
        break;
      case '上下求索':
        component = 'SeekKnowledgeModule';
        break;
      default:
        // 对于未定义的二级标题，使用默认组件
        component = 'DefaultContentModule';
        break;
    }
    
    // 添加section到结果中
    result.push({
      title: currentMatch.title,
      content: content,
      component,
      type,
      props
    });
  }
  
  return result;
}

// 从分割后的节中提取非正文内容到结构化对象
export function extractChapterMetadata(sections: Section[]): ChapterMetadata {
  const metadata: ChapterMetadata = {};
  
  sections.forEach(section => {
    // 处理metadata类型的section
    if (section.type === 'metadata') {
      switch (section.component) {
        case 'LogicalPosition':
          metadata.logicalPosition = section.content;
          break;
        case 'Keywords':
          metadata.keywords = section.content.split(',').map(keyword => keyword.trim()).filter(Boolean);
          break;
        case 'PrerequisitePrompt':
          metadata.prerequisitePrompt = section.content;
          break;
        case 'OpeningLine':
          metadata.openingLine = section.content;
          break;
        case 'SeekKnowledgeModule':
          metadata.seekKnowledge = section.content;
          break;
      }
    }
    // 处理main类型的section，从中提取三个section模块的内容
    else if (section.type === 'main') {
      // 从正文内容中提取本章小结、欲知后事如何且听下回分解、宗门心法
      const content = section.props?.originalContent || '';
      
      // 提取本章小结
      const chapterSummaryMatch = content.match(/## 本章小结\n([\s\S]*?)(?=## |$)/);
      if (chapterSummaryMatch && chapterSummaryMatch[1]) {
        metadata.chapterSummary = chapterSummaryMatch[1].trim();
      }
      
      // 提取欲知后事如何且听下回分解
      const nextChapterMatch = content.match(/## 欲知后事如何(，且听下回分解|且听下回分解)\n([\s\S]*?)(?=## |$)/);
      if (nextChapterMatch && nextChapterMatch[2]) {
        metadata.nextChapterPreview = nextChapterMatch[2].trim();
      }
      
      // 提取宗门心法
      const sectMentalityMatch = content.match(/## 宗门心法\n([\s\S]*?)(?=## |$)/);
      if (sectMentalityMatch && sectMentalityMatch[1]) {
        metadata.sectMentality = sectMentalityMatch[1].trim();
      }
    }
  });
  
  return metadata;
}

// 从分割后的节中提取正文内容
export function extractMainContent(sections: Section[]): string {
  const mainSection = sections.find(section => section.type === 'main');
  return mainSection?.props?.originalContent || '';
}

// 将MDX内容分割成节 - 兼容旧函数名
export function splitMDXContent(source: string, chapterSlug: string = ''): Section[] {
  return splitMarkdownContent(source, chapterSlug);
}

// 处理正文内容，识别特定标题并创建对应的节
function processMainContent(content: string, chapterSlug: string = ''): Section[] {
  // 正文内容暂不直接映射，返回空数组
  // 等待后续个性化显示样式设计
  return [];
}