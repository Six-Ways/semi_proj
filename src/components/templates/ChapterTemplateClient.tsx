'use client';

import { ChapterTemplate } from '@/components/templates/ChapterTemplate';
import { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';

// 动态导入MDXContentRenderer，实现代码分割
const MDXContentRenderer = dynamic(() => import('@/components/MDXContentRenderer').then((mod) => mod.MDXContentRenderer));
type Section = import('@/components/MDXContentRenderer').Section;

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
  sections,
  navigation,
  toc
}: { 
  chapterData: any; 
  sections?: Section[];
  navigation?: { prev?: string | null; next?: string | null };
  toc?: Array<{ level: number; text: string; id: string }>;
}) {
  // 从sections中提取章节标题（如果有一级标题）
  const chapterTitleSection = sections?.find(s => s.component === 'ChapterTitle');
  const title = chapterTitleSection?.title || chapterData.metadata.title;
  
  // 从sections中提取数据并映射到ChapterTemplate的属性
  const logicalPosition = sections?.find(s => s.component === 'LogicalPosition')?.content || '';
  const objectives = sections?.find(s => s.component === 'ChapterObjectives')?.content
    ?.split('\n')
    .filter(line => line.trim().startsWith('- '))
    .map(line => line.replace('- ', '').trim()) || [];
  const coreContent = sections?.find(s => s.component === 'CoreContent')?.content
    ?.split('\n')
    .filter(line => line.trim().startsWith('- '))
    .map(line => line.replace('- ', '').trim()) || [];
  const keywords = sections?.find(s => s.component === 'Keywords')?.content
    ?.split(/[,，]/)  // 支持中英文逗号分割
    .map(keyword => keyword.trim()) 
    .filter(keyword => keyword.length > 0) || [];
  const prerequisitePrompt = sections?.find(s => s.component === 'PrerequisitePrompt')?.content || '';
  const openingLine = sections?.find(s => s.component === 'OpeningLine')?.content || '';
  
  // 处理正文内容
  // 从sections中提取所有非预定义组件的节（这些是正文的三级标题分割）
  const predefinedComponents = [
    'ChapterTitle',
    'LogicalPosition',
    'ChapterObjectives',
    'CoreContent',
    'Keywords',
    'PrerequisitePrompt',
    'OpeningLine',
    'ChapterSummary',
    'LogicalChain',
    'NextChapterPreview',
    'SectMentality',
    'MainContent'
  ];
  
  // 提取正文部分的节
  const mainContentSections = sections
    ?.filter(s => !predefinedComponents.includes(s.component))
    .map(section => ({
      title: section.title,
      content: section.content
    })) || [];
  
  // 如果没有三级标题分割，查找MainContent组件
  const mainContent = mainContentSections.length > 0 ? mainContentSections : [
    {
      title: undefined,
      content: sections?.find(s => s.component === 'MainContent')?.content || ''
    }
  ];

  
  const chapterSummary = sections?.find(s => s.component === 'ChapterSummary')?.content || '';
  const logicalChain = sections?.find(s => s.component === 'LogicalChain')?.content || '';
  const nextChapterPreview = sections?.find(s => s.component === 'NextChapterPreview')?.content || '';
  
  // 处理宗门心法
  const sectMentalityContent = sections?.find(s => s.component === 'SectMentality')?.content || '';
  
  // 简化处理：将所有内容作为overview显示，不再严格要求特定子标题结构
  const sectMentality: { overview: string; breakthrough: string[]; corePrinciple: string } = {
    overview: sectMentalityContent.trim(),
    breakthrough: [],
    corePrinciple: ""
  };

  // 从slug中提取章节编号（如从'part1/ch1'提取'01'）
  const getChapterNumberFromSlug = (slug: string): string => {
    if (!slug || typeof slug !== 'string') {
      return '00';
    }
    
    // 提取所有数字
    const numbers = slug.match(/[0-9]+/g);
    if (numbers) {
      // 找到章节部分的数字（通常是第二个数字）
      // 例如 'part0/ch0' → ['0', '0'] → 取第二个'0'
      // 'part1/ch1' → ['1', '1'] → 取第二个'1'
      if (numbers.length >= 2) {
        return numbers[1].padStart(2, '0');
      }
      // 如果只有一个数字，就用它
      return numbers[0].padStart(2, '0');
    }
    
    return '00';
  };

  const chapterNumber = `CH.${getChapterNumberFromSlug(chapterData.slug)}`;
  const router = useRouter();

  // 导航处理函数
  const handlePreviousChapter = () => {
    if (navigation?.prev) {
      router.push(`/chapters/${navigation.prev}`);
    }
  };

  const handleNextChapter = () => {
    if (navigation?.next) {
      router.push(`/chapters/${navigation.next}`);
    }
  };

  return (
    <ChapterTemplate
      title={title}
      chapterNumber={chapterNumber}
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
      toc={toc || []}
      onPreviousChapter={navigation?.prev ? handlePreviousChapter : undefined}
      onNextChapter={navigation?.next ? handleNextChapter : undefined}
    />
  );
}