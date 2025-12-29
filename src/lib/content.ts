import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const contentDirectory = path.join(process.cwd(), 'content');

export function getChapterBySlug(slug: string) {
  try {
    // 尝试多种可能的文件路径
    const possiblePaths = [
      path.join(contentDirectory, `chapters/${slug}.mdx`),
      path.join(contentDirectory, `chapters/${slug}.md`),
      path.join(contentDirectory, `chapters/${slug}/index.mdx`),
      path.join(contentDirectory, `chapters/${slug}/index.md`),
    ];
    
    // 如果slug包含路径分隔符，说明是子目录中的文件
    if (slug.includes('/')) {
      possiblePaths.push(
        path.join(contentDirectory, `chapters/${slug}.mdx`),
        path.join(contentDirectory, `chapters/${slug}.md`)
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
      throw new Error(`File not found for slug: ${slug}`);
    }
    
    const { data, content } = matter(fileContents);
    
    return {
      slug,
      metadata: data,
      content,
    };
  } catch (error) {
    console.error(`Error reading chapter ${slug}:`, error);
    return null;
  }
}

export function getAllChapters() {
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
    return slugs.map(slug => getChapterBySlug(slug)).filter(Boolean);
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