import { getChapterBySlug, getAllChapters } from '@/lib/content';
import { notFound } from 'next/navigation';
import { ChapterTemplateClient } from '@/components/templates/ChapterTemplateClient';
import { mdxComponents } from '@/components/mdx-components';

// 支持嵌套路径的动态路由
export async function generateStaticParams() {
  const chapters = getAllChapters();
  
  // 为每个章节生成路径参数
  return chapters.map((chapter) => {
    if (!chapter) return { slug: [] };
    
    // 将slug拆分为路径数组
    const slugParts = chapter.slug.split('/');
    
    return {
      slug: slugParts
    };
  });
}

// 在服务器端获取内容
async function getChapterContent(slugParts: string[]) {
  // 将路径数组重新组合为slug字符串
  const slug = slugParts.join('/');
  const chapter = getChapterBySlug(slug);
  
  return chapter;
}

// 服务器组件
export default async function ChapterPage({ params }: { params: { slug: string[] } }) {
  const chapterData = await getChapterContent(params.slug);
  
  if (!chapterData) {
    notFound();
  }
  
  return <ChapterTemplateClient chapterData={chapterData} mdxComponents={mdxComponents} />;
}