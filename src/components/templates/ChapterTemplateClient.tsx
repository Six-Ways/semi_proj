'use client';

import { ChapterTemplate } from '@/components/templates/ChapterTemplate';
import { MDXContentRenderer, Section } from '@/components/MDXContentRenderer';
import { ReactNode } from 'react';
import { motion } from 'framer-motion';

// 简化的章节模板，只渲染MDX内容
export function SimpleChapterTemplate({ 
  title,
  chapterNumber,
  children
}: { 
  title: string;
  chapterNumber: string;
  children: ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#f8fafc] text-[#1e293b]">
      {/* 标题 */}
      <motion.section
        className="mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="font-serif text-4xl font-bold text-[#1e293b] mb-4 text-center">
          {title}
        </h1>
        <div className="text-center font-mono text-lg text-[#007AFF]">
          {chapterNumber}
        </div>
      </motion.section>
      
      {/* MDX内容 */}
      {children}
    </div>
  );
}

// ChapterTemplateClient组件 - 客户端组件用于处理交互
export function ChapterTemplateClient({ 
  chapterData, 
  sections
}: { 
  chapterData: any; 
  sections?: Section[];
}) {
  // 从sections中提取数据并映射到ChapterTemplate的属性
  const logicalPosition = sections?.find(s => s.component === 'LogicalPosition')?.content || '';
  const objectives = sections?.find(s => s.component === 'ChapterObjectives')?.content
    ?.split('\n')
    .filter(line => line.trim().startsWith('- '))
    .map(line => line.replace('- ', '').trim()) || [];
  const coreContent = sections?.find(s => s.component === 'CoreContent')?.content
    ?.split('\n\n')
    .filter(p => p.trim()) || [];
  const keywords = sections?.find(s => s.component === 'Keywords')?.content
    ?.split(/[,，]/)  // 支持中英文逗号分割
    .map(keyword => keyword.trim()) 
    .filter(keyword => keyword.length > 0) || [];
  const prerequisitePrompt = sections?.find(s => s.component === 'PrerequisitePrompt')?.content || '';
  const openingLine = sections?.find(s => s.component === 'OpeningLine')?.content || '';
  
  // 处理其他特殊部分
  // 解析正文内容，保留嵌套的二级标题
  const parseMainContent = (content: string) => {
    if (!content) return [];
    
    // 使用正则表达式匹配所有二级标题（##）及其内容
    const sectionRegex = /##\s+([^\n]+)\n\n([\s\S]*?)(?=(?:^##\s+[^\n]+\n\n|$))/gm;
    const sections: Array<{title?: string; content: string}> = [];
    let match;
    
    // 查找所有匹配的二级标题和内容
    while ((match = sectionRegex.exec(content)) !== null) {
      sections.push({
        title: match[1].trim(),
        content: match[2].trim()
      });
    }
    
    // 如果没有找到任何二级标题，将整个内容作为一个部分
    if (sections.length === 0) {
      return [{
        content: content.trim()
      }];
    }
    
    return sections;
  };
  
  const mainContent = parseMainContent(sections?.find(s => s.component === 'MainContent')?.content || '');

  
  const chapterSummary = sections?.find(s => s.component === 'ChapterSummary')?.content || '';
  const logicalChain = sections?.find(s => s.component === 'LogicalChain')?.content || '';
  const nextChapterPreview = sections?.find(s => s.component === 'NextChapterPreview')?.content || '';
  
  // 处理宗门心法
  const sectMentalityContent = sections?.find(s => s.component === 'SectMentality')?.content || '';
  const sectMentality: { overview: string; breakthrough: string[]; corePrinciple: string } = {
    overview: sectMentalityContent.split('【总纲（灵根篇）】')[1]?.split('【破劫三式（飞升篇）】')[0]?.trim() || "",
    breakthrough: [],
    corePrinciple: ""
  };
  
  // 提取突破要点
  const breakthroughSection = sectMentalityContent.split('【破劫三式（飞升篇）】')[1]?.split('【心法要诀】')[0]?.trim() || "";
  if (breakthroughSection) {
    const breakthroughMatches = breakthroughSection.match(/第[一二三]式[^：]*：([^第]+)/g);
    if (breakthroughMatches) {
      sectMentality.breakthrough = breakthroughMatches.map(match => match.replace(/第[一二三]式[^：]*：/, '').trim());
    }
  }
  
  // 提取核心心法
  const corePrincipleSection = sectMentalityContent.split('【心法要诀】')[1]?.trim() || "";
  sectMentality.corePrinciple = corePrincipleSection;

  return (
    <ChapterTemplate
      title={chapterData.metadata.title}
      chapterNumber={`CH.${chapterData.metadata.chapterNumber.toString().padStart(2, '0')}`}
      logicalPosition={logicalPosition}
      objectives={objectives}
      coreContent={coreContent}
      keywords={keywords}
      prerequisitePrompt={prerequisitePrompt}
      openingLine={openingLine}
      mainContent={mainContent}
      logicalChain={logicalChain}
      chapterSummary={chapterSummary}
      nextChapterPreview={nextChapterPreview}
      sectMentality={sectMentality}
    />
  );
}