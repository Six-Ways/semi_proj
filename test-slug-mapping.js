const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');

const contentDirectory = path.join(__dirname, 'content');

// 章节slug映射表
const chapterSlugMap = {
  'part0/ch0': 'part0/ch0-preface',
  'part1/ch1': 'part1/ch1-Crystal-Structures',
  'part1/ch2': 'part1/ch2-Quantum-Energy-Band',
  'part1/ch3': 'part1/ch3-Statistics-Thermal-Equilibrium',
  'part3/ch4': 'part3/ch4-Carrier-Transport'
};

function getChapterBySlug(slug) {
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
    
    console.log(`Testing slug: ${slug}`);
    console.log(`Mapped to: ${mappedSlug}`);
    console.log('Possible paths:');
    
    for (const possiblePath of possiblePaths) {
      try {
        fileContents = fs.readFileSync(possiblePath, 'utf8');
        fullPath = possiblePath;
        console.log(`  ✓ Found file at: ${fullPath}`);
        break;
      } catch (e) {
        console.log(`  ✗ File not found at: ${possiblePath}`);
      }
    }
    
    if (!fullPath) {
      throw new Error(`File not found for slug: ${slug}`);
    }
    
    const { data, content } = matter(fileContents);
    
    return {
      slug,
      mappedSlug,
      metadata: data,
      content: content.substring(0, 100) + '...', // 只显示前100个字符
    };
  } catch (error) {
    console.error(`Error reading chapter ${slug}:`, error.message);
    return null;
  }
}

// 测试所有slug映射
console.log('=== Testing All Slug Mappings ===\n');

Object.keys(chapterSlugMap).forEach(slug => {
  console.log(`--- Testing ${slug} ---`);
  const chapter = getChapterBySlug(slug);
  if (chapter) {
    console.log(`  ✓ Successfully loaded chapter: ${chapter.metadata.title}`);
    console.log(`  ✓ Metadata:`, Object.keys(chapter.metadata));
  } else {
    console.log(`  ✗ Failed to load chapter`);
  }
  console.log('\n');
});

console.log('=== Test Complete ===');
