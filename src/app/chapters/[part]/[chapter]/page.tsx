import { getChapterBySlug, getChapterNavigation } from '@/lib/content';
import { ChapterTemplateClient } from '@/components/templates/ChapterTemplateClient';
import { splitMDXContent, extractTocFromMDX } from '@/lib/mdxProcessorServer';
import { notFound } from 'next/navigation';
import { chapterSlugMap } from '@/lib/content';

// 获取章节内容
async function getChapterData(part: string, chapter: string) {
  const slug = `${part}/${chapter}`;
  const chapterContent = getChapterBySlug(slug);
  
  if (!chapterContent) {
    return null;
  }
  
  // 分割MDX内容
  const sections = splitMDXContent(chapterContent.content);
  // 提取目录
  const toc = extractTocFromMDX(chapterContent.content);
  
  return {
    ...chapterContent,
    sections,
    toc
  };
}

// 动态路由页面组件
export default async function ChapterPage({ params }: { params: Promise<{ part: string; chapter: string }> }) {
  const { part, chapter } = await params;
  const chapterData = await getChapterData(part, chapter);
  
  if (!chapterData) {
    notFound();
  }
  
  // 获取导航信息
  const navigation = getChapterNavigation(`${part}/${chapter}`);
  
  return (
    <ChapterTemplateClient 
      chapterData={chapterData} 
      sections={chapterData.sections}
      navigation={navigation}
      toc={chapterData.toc}
    />
  );
}

// 生成所有静态路由参数，用于静态导出
export async function generateStaticParams() {
  // 手动返回所有实际存在的章节路由参数
  // 这确保与output: export配置兼容
  return [
    // Part 0
    { part: 'part0', chapter: 'ch0' },
    // Part 1
    { part: 'part1', chapter: 'ch1' },
    { part: 'part1', chapter: 'ch2' },
    { part: 'part1', chapter: 'ch3' },
    // Part 2
    { part: 'part2', chapter: 'ch4' },
    { part: 'part2', chapter: 'ch5' },
    { part: 'part2', chapter: 'ch6' },
  ];
}

// 动态生成页面metadata
export async function generateMetadata({ params }: { params: Promise<{ part: string; chapter: string }> }) {
  const { part, chapter } = await params;
  const chapterData = await getChapterData(part, chapter);
  
  if (!chapterData) {
    return {
      title: "章节不存在 - 半导体学习平台",
      description: "您访问的章节不存在，请检查URL或返回首页。"
    };
  }
  
  // 从章节内容中提取关键词
  const keywords = chapterData.metadata.tags || [];
  
  return {
    title: `${chapterData.metadata.title} - 半导体学习平台`,
    description: chapterData.metadata.description || `深入学习${chapterData.metadata.title}的相关知识`,
    keywords: keywords.join(', ')
  };
}
