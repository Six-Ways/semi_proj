import { Section } from '@/lib/mdxProcessorServer';

// 服务器端MDX内容处理器
export async function processMDXContentServer(sections: Section[]): Promise<ProcessedSection[]> {
  // 在服务器端处理MDX内容，转换为纯文本或HTML
  const processedSections: ProcessedSection[] = [];
  
  for (const section of sections) {
    // 这里可以添加MDX到HTML的转换逻辑
    // 目前我们只传递原始内容，让客户端组件处理渲染
    processedSections.push({
      title: section.title,
      content: section.content,
      component: section.component
    });
  }
  
  return processedSections;
}

// 处理后的节类型
export interface ProcessedSection {
  title: string;
  content: string;
  component: string;
}