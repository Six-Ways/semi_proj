'use client';

import { ChapterTemplate } from '@/components/templates/ChapterTemplate';
import { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import { getChapterTheme } from '@/lib/chapterThemes';

// 动态导入MDXContentRenderer，实现代码分割
const MDXContentRenderer = dynamic(() => import('@/components/MDXContentRenderer').then((mod) => mod.MDXContentRenderer));
type Section = import('@/lib/mdxProcessorServer').Section;

// 简化的章节模板，只渲染MDX内容
export function SimpleChapterTemplate({ 
  title,
  chapterNumber,
  children,
  chapterSlug
}: { 
  title: string;
  chapterNumber: string;
  children: ReactNode;
  chapterSlug?: string;
}) {
  // 获取章节主题
  const theme = chapterSlug ? getChapterTheme(chapterSlug) : getChapterTheme('default');
  
  return (
    <div className={`min-h-screen bg-[${theme.backgroundColor}] text-[${theme.textColor}]`}>
      {/* 标题 */}
      <motion.section
        className="mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className={`font-serif text-4xl font-bold mb-4 text-center text-[${theme.headingColor}]`}>
          {title}
        </h1>
        <div className={`text-center font-mono text-lg text-[${theme.primaryColor}]`}>
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
  
  // 使用新的章节元数据结构
  const { metadata, mainContent } = chapterData;
  
  // 从metadata中提取非正文内容
  const logicalPosition = metadata.logicalPosition || '';
  const keywords = metadata.keywords || [];
  const prerequisitePrompt = metadata.prerequisitePrompt || metadata['先修提示'] || '';
  const openingLine = metadata.openingLine || metadata['起手式'] || '';
  const chapterSummary = metadata.chapterSummary || '';
  const logicalChain = sections?.find(s => s.component === 'LogicalChain')?.content || '';
  const nextChapterPreview = metadata.nextChapterPreview || '';
  
  // 处理宗门心法
  const sectMentalityContent = metadata.sectMentality || '';
  
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

  // 获取章节主题
  const theme = getChapterTheme(chapterData.slug);

  return (
    <ChapterTemplate
      title={title}
      chapterNumber={chapterNumber}
      logicalPosition={logicalPosition}
      objectives={[]}
      coreContent={[]} // 使用空数组，避免undefined错误
      keywords={keywords}
      prerequisitePrompt={prerequisitePrompt}
      openingLine={openingLine}
      mainContent={[]}
      logicalChain={logicalChain}
      chapterSummary={chapterSummary}
      nextChapterPreview={nextChapterPreview}
      sectMentality={sectMentality}
      toc={toc || []}
      onPreviousChapter={navigation?.prev ? handlePreviousChapter : undefined}
      onNextChapter={navigation?.next ? handleNextChapter : undefined}
      theme={theme}
    >
      {/* 传递所有sections给MDXContentRenderer组件，每个二级标题对应一个组件 */}
      <MDXContentRenderer 
        sections={sections || []} 
        theme={theme} 
        chapterSlug={chapterData.slug} 
        metadata={metadata} // 传递metadata参数，用于渲染三个section模块
      />
    </ChapterTemplate>
  );
}