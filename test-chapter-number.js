// 测试slug映射和章节号提取逻辑
const { chapterSlugMap } = require('./src/lib/content');

// 测试章节号提取函数
function getChapterNumberFromSlug(slug) {
  const match = slug.match(/ch([0-9]+)/i);
  if (match) {
    return match[1].padStart(2, '0');
  }
  return '00';
}

// 测试所有slug映射
console.log('=== 测试slug映射和章节号提取 ===');
for (const [slug, mappedSlug] of Object.entries(chapterSlugMap)) {
  const chapterNumber = getChapterNumberFromSlug(slug);
  console.log(`\nSlug: ${slug}`);
  console.log(`Mapped slug: ${mappedSlug}`);
  console.log(`Chapter number: CH.${chapterNumber}`);
}

// 测试具体的slug
console.log('\n=== 测试具体slug ===');
const testSlugs = ['part0/ch0', 'part1/ch1', 'part1/ch2', 'part1/ch3', 'part3/ch4'];
testSlugs.forEach(slug => {
  const chapterNumber = getChapterNumberFromSlug(slug);
  console.log(`Slug: ${slug} => Chapter: CH.${chapterNumber}`);
});