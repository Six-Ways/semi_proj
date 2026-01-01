import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const contentDirectory = path.join(process.cwd(), 'content');

// 自动生成章节slug映射表，将简化的slug（如part0/ch0）映射到实际的文件名
export const chapterSlugMap: Record<string, string> = (() => {
  const map: Record<string, string> = {};
  
  // 递归扫描content/chapters目录下的所有MDX文件
  const scanChapters = (dir: string, basePath: string = '') => {
    const items = fs.readdirSync(dir);
    
    for (const item of items) {
      const fullPath = path.join(dir, item);
      const stat = fs.statSync(fullPath);
      
      if (stat.isDirectory()) {
        // 递归扫描子目录
        scanChapters(fullPath, path.join(basePath, item));
      } else if (item.endsWith('.mdx') || item.endsWith('.md')) {
        // 处理MDX/MD文件
        const relativePath = path.join(basePath, item.replace(/\.(mdx|md)$/, ''));
        
        // 尝试从文件名中提取简化的slug
        const match = item.match(/ch(\d+)-(.+)/i);
        if (match && basePath) {
          const chapterNum = match[1];
          const simplifiedSlug = `${basePath}/ch${chapterNum}`;
          map[simplifiedSlug] = relativePath;
        } else if (basePath && item.startsWith('ch0-')) {
          // 特殊处理ch0-preface
          map[`${basePath}/ch0`] = relativePath;
        }
      }
    }
  };
  
  // 开始扫描
  scanChapters(path.join(contentDirectory, 'chapters'));
  
  // 如果没有扫描到任何文件，使用默认映射（兼容旧版本）
  if (Object.keys(map).length === 0) {
    return {
      'part0/ch0': 'part0/ch0-preface',
      'part1/ch1': 'part1/ch1-Crystal-Structures',
      'part1/ch2': 'part1/ch2-Quantum-Energy-Band',
      'part1/ch3': 'part1/ch3-Statistics-Thermal-Equilibrium',
      'part2/ch4': 'part2/ch4-Carrier-Transport',
      'part2/ch5': 'part2/ch5-Nonequilibrium-Carriers',
      'part2/ch6': 'part2/ch6-High-Field'
    };
  }
  
  return map;
})();

// 定义章节元数据类型
interface ChapterMetadata {
  title?: string;
  description?: string;
  tags: string[];
  [key: string]: any; // 允许其他未知字段
}

interface Chapter {
  slug: string;
  metadata: ChapterMetadata;
  content: string;
  sections?: any[];
  toc?: any[];
}

export function getChapterBySlug(slug: string): Chapter | null {
  try {
    // 首先检查是否有映射的slug
    const mappedSlug = chapterSlugMap[slug] || slug;
    
    // 尝试多种可能的文件路径
    const possiblePaths = [
      path.join(contentDirectory, `chapters/${mappedSlug}.mdx`),
      path.join(contentDirectory, `chapters/${mappedSlug}.md`),
      path.join(contentDirectory, `chapters/${mappedSlug}/index.mdx`),
      path.join(contentDirectory, `chapters/${mappedSlug}/index.md`),
    ];
    
    // 如果mappedSlug包含路径分隔符，说明是子目录中的文件
    if (mappedSlug.includes('/')) {
      possiblePaths.push(
        path.join(contentDirectory, `chapters/${mappedSlug}.mdx`),
        path.join(contentDirectory, `chapters/${mappedSlug}.md`)
      );
    }
    
    let fullPath = '';
    let fileContents = '';
    
    // 尝试每个可能的路径
    for (const possiblePath of possiblePaths) {
      try {
        fileContents = fs.readFileSync(possiblePath, 'utf8');
        fullPath = possiblePath;
        break;
      } catch (e) {
        // 继续尝试下一个路径
      }
    }
    
    if (!fullPath) {
      return null;
    }
    
    const { data, content } = matter(fileContents);
    
    // 提取标签
    let tags: string[] = [];
    
    // 尝试从metadata的tags字段获取
    if (data.tags) {
      tags = Array.isArray(data.tags) ? data.tags : [data.tags];
    } 
    // 尝试从内容中提取关键词
    else {
      const keywordsMatch = content.match(/## 关键词\n(.*?)(?:##|\n---|$)/s);
      if (keywordsMatch && keywordsMatch[1]) {
        tags = keywordsMatch[1].split(',').map(tag => tag.trim()).filter(Boolean);
      }
    }
    
    return {
      slug,
      metadata: {
        ...data,
        tags
      } as ChapterMetadata,
      content,
    };
  } catch (error) {
    console.error(`Error reading chapter ${slug}:`, error);
    return null;
  }
}

export function getAllChapters(): Chapter[] {
  try {
    // 递归读取所有子目录中的MDX和MD文件
    const getAllMarkdownFiles = (dir: string, basePath: string = ''): string[] => {
      const files: string[] = [];
      const items = fs.readdirSync(dir);
      
      for (const item of items) {
        const fullPath = path.join(dir, item);
        const stat = fs.statSync(fullPath);
        
        if (stat.isDirectory()) {
          files.push(...getAllMarkdownFiles(fullPath, path.join(basePath, item)));
        } else if (item.endsWith('.mdx') || item.endsWith('.md')) {
          // 跳过index文件，因为它们会通过目录路径访问
          if (item === 'index.md' || item === 'index.mdx') {
            // 如果是index文件，使用目录路径作为slug
            if (basePath) {
              files.push(basePath);
            }
          } else {
            // 否则使用文件路径（去掉扩展名）作为slug
            const relativePath = path.join(basePath, item.replace(/\.(mdx|md)$/, ''));
            files.push(relativePath);
          }
        }
      }
      
      return files;
    };
    
    const slugs = getAllMarkdownFiles(path.join(contentDirectory, 'chapters'));
    return slugs.map(slug => getChapterBySlug(slug)).filter((chapter): chapter is Chapter => chapter !== null);
  } catch (error) {
    console.error('Error reading chapters:', error);
    return [];
  }
}

export function getChapterContent(slug: string) {
  const chapter = getChapterBySlug(slug);
  if (!chapter) return null;
  
  return {
    metadata: chapter.metadata,
    content: chapter.content
  };
}

// 获取所有章节的顺序列表
export function getChapterOrder() {
  return Object.keys(chapterSlugMap).sort((a, b) => {
    // 解析章节编号并排序
    const parseSlug = (slug: string) => {
      const parts = slug.split('/');
      const partNum = parseInt(parts[0].replace('part', ''));
      const chapterNum = parseInt(parts[1].replace('ch', ''));
      return { partNum, chapterNum };
    };
    
    const aParts = parseSlug(a);
    const bParts = parseSlug(b);
    
    if (aParts.partNum !== bParts.partNum) {
      return aParts.partNum - bParts.partNum;
    }
    return aParts.chapterNum - bParts.chapterNum;
  });
}

// 获取章节的上一章和下一章
export function getChapterNavigation(currentSlug: string) {
  const chapterOrder = getChapterOrder();
  const currentIndex = chapterOrder.indexOf(currentSlug);
  
  if (currentIndex === -1) {
    return { prev: null, next: null };
  }
  
  return {
    prev: currentIndex > 0 ? chapterOrder[currentIndex - 1] : null,
    next: currentIndex < chapterOrder.length - 1 ? chapterOrder[currentIndex + 1] : null
  };
}

// 获取所有独特标签
export function getAllTags() {
  const chapters = getAllChapters();
  const tagMap = new Map<string, number>();
  
  for (const chapter of chapters) {
    if (chapter && chapter.metadata.tags) {
      for (const tag of chapter.metadata.tags) {
        tagMap.set(tag, (tagMap.get(tag) || 0) + 1);
      }
    }
  }
  
  // 转换为数组并按使用频率排序
  return Array.from(tagMap.entries())
    .sort(([, a], [, b]) => b - a)
    .map(([tag, count]) => ({ tag, count }));
}

// 获取带有特定标签的章节
export function getChaptersByTag(tag: string) {
  const chapters = getAllChapters();
  return chapters.filter(chapter => 
    chapter && chapter.metadata.tags && chapter.metadata.tags.includes(tag)
  );
}