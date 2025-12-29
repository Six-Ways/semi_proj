import { getChapterBySlug } from '@/lib/content';
import { serialize } from 'next-mdx-remote/serialize';
import { PrefacePageClient } from './PrefacePageClient';

// 在服务器端获取和序列化内容
async function getSerializedContent() {
  const chapter = getChapterBySlug("preface");
  
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
export default async function Preface() {
  const chapterData = await getSerializedContent();
  
  if (!chapterData) {
    return <div className="flex justify-center items-center min-h-screen">内容加载失败</div>;
  }
  
  return <PrefacePageClient chapterData={chapterData} />;
}