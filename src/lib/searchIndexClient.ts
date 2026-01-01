// 客户端搜索索引 - 仅包含索引数据，不包含生成逻辑

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

// 客户端搜索索引数据 - 实际项目中可以通过构建脚本生成
// 这里我们提供一个模拟的索引数据结构
const searchIndex: SearchIndex = {
  chapters: [],
  lastUpdated: new Date().toISOString()
};

export default searchIndex;
