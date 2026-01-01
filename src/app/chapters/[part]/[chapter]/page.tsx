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
  return Object.keys(chapterSlugMap).map((slug) => {
    const [part, chapter] = slug.split('/');
    return {
      part,
      chapter
    };
  });
}
