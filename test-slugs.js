const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');

const contentDirectory = path.join(__dirname, 'content');

function getChapterBySlug(slug) {
  try {
    console.log(`Trying to find chapter with slug: ${slug}`);
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
    
    console.log('Possible paths:', possiblePaths);
    
    // 尝试每个可能的路径
    for (const possiblePath of possiblePaths) {
      try {
        fileContents = fs.readFileSync(possiblePath, 'utf8');
        fullPath = possiblePath;
        console.log(`Found file at: ${fullPath}`);
        break;
      } catch (e) {
        console.log(`File not found at: ${possiblePath}`);
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

function getAllChapters() {
  try {
    // 递归读取所有子目录中的MDX和MD文件
    const getAllMarkdownFiles = (dir, basePath = '') => {
      const files = [];
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
    console.log('Generated slugs:', slugs);
    return slugs.map(slug => getChapterBySlug(slug)).filter(Boolean);
  } catch (error) {
    console.error('Error reading chapters:', error);
    return [];
  }
}

// 测试getAllChapters
console.log('Testing getAllChapters:');
const chapters = getAllChapters();
console.log('Found chapters:', chapters.length);

// 测试getChapterBySlug with part0/ch0
console.log('\nTesting getChapterBySlug with part0/ch0:');
getChapterBySlug('part0/ch0');

// 测试getChapterBySlug with part0/Chapter0-preface
console.log('\nTesting getChapterBySlug with part0/Chapter0-preface:');
getChapterBySlug('part0/Chapter0-preface');
