import { getChapterBySlug } from '@/lib/content';
import { ChapterTemplateClient } from '@/components/templates/ChapterTemplateClient';
import { splitMDXContent } from '@/lib/mdxProcessorServer';
import { MDXContentRenderer } from '@/components/MDXContentRenderer';
import { notFound } from 'next/navigation';

// 获取章节内容
async function getChapterData() {
  const chapter = getChapterBySlug('part1/ch2');
  
  if (!chapter) {
    console.log('Chapter not found');
    return null;
  }
  
  console.log('Chapter found:', chapter);
  
  // 分割MDX内容
  const sections = splitMDXContent(chapter.content);
  
  return {
    ...chapter,
    sections
  };
}

// 服务器组件
export default async function Ch2Page() {
  const chapterData = await getChapterData();
  
  if (!chapterData) {
    notFound();
  }
  
  return (
    <ChapterTemplateClient 
      chapterData={chapterData} 
      sections={chapterData.sections} 
    />
  );
}
