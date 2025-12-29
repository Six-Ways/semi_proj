import { ReactNode } from 'react';
import { MDXRemote } from 'next-mdx-remote/rsc';
import {
  LogicalPosition,
  ChapterObjectives,
  CoreContent,
  Keywords,
  PrerequisitePrompt,
  OpeningLine
} from '@/components/sections';

// 将MDX内容分割成节
export function processMDXContent(source: string, components: any = {}): ReactNode[] {
  // 将内容按二级标题分割
  const sections = source.split(/^## (.+)$/gm);
  
  // 第一个元素是空字符串（因为内容以##开头）
  if (sections.length > 0 && sections[0].trim() === '') {
    sections.shift();
  }
  
  const result: ReactNode[] = [];
  
  // 处理每个节
  for (let i = 0; i < sections.length; i += 2) {
    const title = sections[i]?.trim();
    const sectionContent = sections[i + 1]?.trim() || '';
    
    if (!title) continue;
    
    // 根据标题获取对应的组件
    const component = getSectionComponent(title, sectionContent, components);
    if (component) {
      result.push(component);
    }
  }
  
  return result;
}

// 根据标题内容返回对应的组件
function getSectionComponent(title: string, content: string, components: any): ReactNode {
  switch (title) {
    case '本章逻辑位':
      return (
        <LogicalPosition key={title}>
          <MDXRemote source={content} components={components} />
        </LogicalPosition>
      );
    case '章节目标':
      return (
        <ChapterObjectives key={title}>
          <MDXRemote source={content} components={components} />
        </ChapterObjectives>
      );
    case '核心内容':
      return (
        <CoreContent key={title}>
          <MDXRemote source={content} components={components} />
        </CoreContent>
      );
    case '关键词':
      return (
        <Keywords key={title}>
          <MDXRemote source={content} components={components} />
        </Keywords>
      );
    case '前置认知提示':
      return (
        <PrerequisitePrompt key={title}>
          <MDXRemote source={content} components={components} />
        </PrerequisitePrompt>
      );
    case '起手式':
      return (
        <OpeningLine key={title}>
          <MDXRemote source={content} components={components} />
        </OpeningLine>
      );
    case '正文':
      return (
        <CoreContent key={title}>
          <MDXRemote source={content} components={components} />
        </CoreContent>
      );
    case '本章小结':
      return (
        <CoreContent key={title}>
          <MDXRemote source={content} components={components} />
        </CoreContent>
      );
    case '章节逻辑链':
      return (
        <CoreContent key={title}>
          <MDXRemote source={content} components={components} />
        </CoreContent>
      );
    case '欲知后事如何，且听下回分解。':
      return (
        <CoreContent key={title}>
          <MDXRemote source={content} components={components} />
        </CoreContent>
      );
    case '宗门心法':
      return (
        <CoreContent key={title}>
          <MDXRemote source={content} components={components} />
        </CoreContent>
      );
    default:
      // 对于不匹配的标题，返回原始内容
      return (
        <div key={title}>
          <h2>{title}</h2>
          <MDXRemote source={content} components={components} />
        </div>
      );
  }
}