import { notFound } from 'next/navigation';
import { getChapterBySlug, getAllChapters } from '@/lib/content';
import { serialize } from 'next-mdx-remote/serialize';
import { ChapterTemplateClient } from '@/components/templates/ChapterTemplateClient';
import { mdxComponents } from '@/components/mdx-components';

export async function generateStaticParams() {
  const chapters = getAllChapters();
  return chapters.map((chapter) => ({
    slug: chapter.slug,
  }));
}

// 在服务器端获取和序列化内容
async function getSerializedContent(slug: string) {
  const chapter = getChapterBySlug(slug);
  
  if (!chapter) {
    return null;
  }
  
  // 序列化MDX内容
  const mdxSource = await serialize(chapter.content, {
    parseFrontmatter: false, // 我们已经在getChapterBySlug中解析了frontmatter
  });
  
  return {
    ...chapter,
    mdxSource
  };
}

// 服务器组件
export default async function ChapterPage({ params }: { params: { slug: string } }) {
  const chapterData = await getSerializedContent(params.slug);
  
  if (!chapterData) {
    notFound();
  }
  
  return <ChapterTemplateClient chapterData={chapterData} mdxComponents={mdxComponents} />;
}