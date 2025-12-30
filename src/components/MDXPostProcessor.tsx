'use client';

import { ReactNode, useEffect, useRef, useState } from 'react';
import {
  LogicalPosition,
  ChapterObjectives,
  CoreContent,
  Keywords,
  PrerequisitePrompt,
  OpeningLine
} from '@/components/sections';

interface MDXPostProcessorProps {
  children: ReactNode;
}

// 根据标题内容返回对应的组件
function getSectionComponent(title: string, children: ReactNode) {
  switch (title) {
    case '本章逻辑位':
      return <LogicalPosition>{children}</LogicalPosition>;
    case '章节目标':
      return <ChapterObjectives>{children}</ChapterObjectives>;
    case '核心内容':
      return <CoreContent>{children}</CoreContent>;
    case '关键词':
      return <Keywords>{children}</Keywords>;
    case '前置认知提示':
      return <PrerequisitePrompt>{children}</PrerequisitePrompt>;
    case '起手式':
      return <OpeningLine>{children}</OpeningLine>;
    case '正文':
      return <CoreContent>{children}</CoreContent>; // 使用CoreContent组件渲染正文
    case '本章小结':
      return <CoreContent>{children}</CoreContent>; // 使用CoreContent组件渲染小结
    case '章节逻辑链':
      return <CoreContent>{children}</CoreContent>; // 使用CoreContent组件渲染逻辑链
    case '欲知后事如何，且听下回分解。':
      return <CoreContent>{children}</CoreContent>; // 使用CoreContent组件渲染过渡
    case '宗门心法':
      return <CoreContent>{children}</CoreContent>; // 使用CoreContent组件渲染心法
    default:
      return <>{children}</>;
  }
}

// MDX后处理器，用于在客户端处理渲染后的内容
export function MDXPostProcessor({ children }: MDXPostProcessorProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [processedContent, setProcessedContent] = useState<ReactNode>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    const elements = Array.from(container.children) as HTMLElement[];
    const sections: ReactNode[] = [];
    let currentSection: { title: string; elements: HTMLElement[] } | null = null;

    // 遍历所有元素，查找特定的h2标题
    elements.forEach((element) => {
      if (element.tagName === 'H2') {
        // 如果已经有当前节，先处理它
        if (currentSection) {
          sections.push(
            getSectionComponent(
              currentSection.title,
              currentSection.elements.map((el, index) => (
                <div key={index} dangerouslySetInnerHTML={{ __html: el.outerHTML }} />
              ))
            )
          );
        }

        // 检查是否是特定的标题
        const title = element.textContent || '';
        const isSpecialTitle = [
          '本章逻辑位', '章节目标', '核心内容', '关键词', '前置认知提示', '起手式',
          '正文', '本章小结', '章节逻辑链', '欲知后事如何，且听下回分解。', '宗门心法'
        ].includes(title);

        if (isSpecialTitle) {
          // 开始新的节
          currentSection = {
            title,
            elements: []
          };
        } else {
          // 普通标题，直接添加到结果中
          if (currentSection) {
            sections.push(
              getSectionComponent(
                currentSection.title,
                currentSection.elements.map((el, index) => (
                  <div key={index} dangerouslySetInnerHTML={{ __html: el.outerHTML }} />
                ))
              )
            );
            currentSection = null;
          }
          sections.push(<div key={title} dangerouslySetInnerHTML={{ __html: element.outerHTML }} />);
        }
      } else {
        // 非标题元素
        if (currentSection) {
          currentSection.elements.push(element);
        } else {
          sections.push(<div key={element.textContent} dangerouslySetInnerHTML={{ __html: element.outerHTML }} />);
        }
      }
    });

    // 处理最后一个节
    if (currentSection) {
      sections.push(
        getSectionComponent(
          (currentSection as { title: string; elements: HTMLElement[] }).title,
          (currentSection as { title: string; elements: HTMLElement[] }).elements.map((el, index) => (
            <div key={index} dangerouslySetInnerHTML={{ __html: el.outerHTML }} />
          ))
        )
      );
    }

    setProcessedContent(<>{sections}</>);
  }, [children]);

  return (
    <>
      <div ref={containerRef} style={{ display: 'none' }}>
        {children}
      </div>
      {processedContent}
    </>
  );
}