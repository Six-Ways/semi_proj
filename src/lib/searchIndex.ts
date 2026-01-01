// 搜索索引文件
// 此文件在构建时生成，包含所有章节的内容以便客户端搜索

interface ChapterIndex {
  slug: string;
  title: string;
  content: string;
  part: string;
  chapter: string;
  tags: string[];
}

interface SearchIndex {
  chapters: ChapterIndex[];
  lastUpdated: string;
}

// 生成搜索索引
const generateSearchIndex = (): SearchIndex => {
  // 导入内容
  const content = require("./content");
  
  // 获取所有章节
  const chapters = content.getAllChapters();
  
  // 构建索引
  const chapterIndices: ChapterIndex[] = chapters
    .filter(Boolean)
    .map((chapter: any) => {
      // 从slug中提取part和chapter信息
      const [part, ch] = chapter.slug.split("/");
      
      return {
        slug: chapter.slug,
        title: chapter.metadata.title || "",
        content: chapter.content || "",
        part: part || "",
        chapter: ch || "",
        tags: chapter.metadata.tags || []
      };
    });
  
  return {
    chapters: chapterIndices,
    lastUpdated: new Date().toISOString()
  };
};

// 导出搜索索引
const searchIndex: SearchIndex = generateSearchIndex();

export default searchIndex;
