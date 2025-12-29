'use client';

import { ReactNode } from 'react';
import {
  LogicalPosition,
  ChapterObjectives,
  CoreContent,
  Keywords,
  PrerequisitePrompt,
  OpeningLine
} from '@/components/sections/ChapterSections';

// 定义节类型
export interface Section {
  title: string;
  content: string;
  component: string;
}

// 获取节组件
function getSectionComponent(section: Section): ReactNode {
  const { title, content, component } = section;
  
  // 确保内容不为空
  if (!content || content.trim() === '') {
    return null;
  }
  
  // 将Markdown内容转换为简单的HTML元素
  const renderContent = () => {
    // 简单处理，将换行符转换为<p>标签
    const paragraphs = content.split('\n\n').filter(p => p.trim());
    
    return paragraphs.map((paragraph, index) => {
      // 处理列表项
      if (paragraph.trim().startsWith('- ')) {
        const listItems = paragraph.split('\n').filter(item => item.trim().startsWith('- '));
        return (
          <ul key={index} className="list-disc list-inside mb-4 space-y-2">
            {listItems.map((item, itemIndex) => (
              <li key={itemIndex} className="text-gray-700">
                {item.replace('- ', '').trim()}
              </li>
            ))}
          </ul>
        );
      }
      
      // 处理标题
      if (paragraph.trim().startsWith('### ')) {
        return (
          <h3 key={index} className="text-lg font-semibold mb-4 text-gray-800">
            {paragraph.replace('### ', '').trim()}
          </h3>
        );
      }
      
      // 普通段落
      return (
        <p key={index} className="mb-4 text-gray-700 leading-relaxed">
          {paragraph.trim()}
        </p>
      );
    });
  };
  
  switch (component) {
    case 'ChapterObjectives':
      return (
        <ChapterObjectives>
          <h2 className="text-xl font-bold mb-4 text-green-900">{title}</h2>
          {renderContent()}
        </ChapterObjectives>
      );
    case 'LogicalPosition':
      return (
        <LogicalPosition>
          <h2 className="text-xl font-bold mb-4 text-blue-900">{title}</h2>
          {renderContent()}
        </LogicalPosition>
      );
    case 'CoreContent':
      return (
        <CoreContent>
          <h2 className="text-xl font-bold mb-4 text-amber-900">{title}</h2>
          {renderContent()}
        </CoreContent>
      );
    case 'Keywords':
      return (
        <Keywords>
          <h2 className="text-xl font-bold mb-4 text-yellow-900">{title}</h2>
          {renderContent()}
        </Keywords>
      );
    case 'PrerequisitePrompt':
      return (
        <PrerequisitePrompt>
          <h2 className="text-xl font-bold mb-4 text-red-900">{title}</h2>
          {renderContent()}
        </PrerequisitePrompt>
      );
    case 'OpeningLine':
      return (
        <OpeningLine>
          <h2 className="text-xl font-bold mb-4 text-indigo-900">{title}</h2>
          {renderContent()}
        </OpeningLine>
      );
    default:
      return (
        <div className="mb-8 p-6 bg-gray-50 rounded-lg border border-gray-200">
          <h2 className="text-xl font-bold mb-4">{title}</h2>
          {renderContent()}
        </div>
      );
  }
}

// 处理MDX内容并返回React节点
export function MDXContentRenderer({ sections }: { 
  sections: Section[] 
}) {
  if (!sections || sections.length === 0) {
    return <div>没有找到内容</div>;
  }
  
  return (
    <div className="mdx-content">
      {sections.map((section, index) => (
        <div key={index} className="section-wrapper">
          {getSectionComponent(section)}
        </div>
      ))}
    </div>
  );
}