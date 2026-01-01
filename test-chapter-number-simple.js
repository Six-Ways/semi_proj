// 简单测试章节号提取逻辑

// 新的章节号提取函数
function getChapterNumberFromSlug(slug) {
  if (!slug || typeof slug !== 'string') {
    return '00';
  }
  
  // 提取所有数字
  const numbers = slug.match(/[0-9]+/g);
  if (numbers) {
    // 找到章节部分的数字（通常是第二个数字）
    if (numbers.length >= 2) {
      return numbers[1].padStart(2, '0');
    }
    // 如果只有一个数字，就用它
    return numbers[0].padStart(2, '0');
  }
  
  return '00';
}

// 测试所有可能的slug
const testSlugs = [
  'part0/ch0',
  'part1/ch1',
  'part1/ch2', 
  'part1/ch3',
  'part3/ch4'
];

console.log('=== 测试新的章节号提取逻辑 ===');
testSlugs.forEach(slug => {
  console.log(`\nTesting: ${slug}`);
  const chapterNumber = getChapterNumberFromSlug(slug);
  console.log(`Result: CH.${chapterNumber}`);
});

// 测试边界情况
console.log('\n=== 测试边界情况 ===');
const edgeCases = ['', null, undefined, 'part1', 'ch1', 'part0/ch0-preface', 'part1/ch1-Crystal-Structures'];
edgeCases.forEach(slug => {
  console.log(`Testing: ${JSON.stringify(slug)}`);
  const chapterNumber = getChapterNumberFromSlug(slug);
  console.log(`Result: CH.${chapterNumber}`);
});