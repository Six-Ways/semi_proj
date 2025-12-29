/**
 * 中英文混排文本处理工具
 * 自动在中英文之间添加适当的空格，提升可读性
 */

/**
 * 检测字符是否为中文字符
 * @param char 单个字符
 * @returns 是否为中文字符
 */
export const isChineseChar = (char: string): boolean => {
  const code = char.charCodeAt(0);
  return (
    (code >= 0x4e00 && code <= 0x9fff) || // 基本汉字
    (code >= 0x3400 && code <= 0x4dbf) || // 扩展A
    (code >= 0x20000 && code <= 0x2a6df) || // 扩展B
    (code >= 0x2a700 && code <= 0x2b73f) || // 扩展C
    (code >= 0x2b740 && code <= 0x2b81f) || // 扩展D
    (code >= 0x2b820 && code <= 0x2ceaf) || // 扩展E
    (code >= 0x2ceb0 && code <= 0x2ebef) || // 扩展F
    (code >= 0x3000 && code <= 0x303f) || // 中文标点
    (code >= 0xff00 && code <= 0xffef)    // 全角字符
  );
};

/**
 * 检测字符是否为英文字符
 * @param char 单个字符
 * @returns 是否为英文字符
 */
export const isEnglishChar = (char: string): boolean => {
  const code = char.charCodeAt(0);
  return (
    (code >= 0x0041 && code <= 0x005a) || // 大写字母
    (code >= 0x0061 && code <= 0x007a) || // 小写字母
    (code >= 0x0030 && code <= 0x0039)    // 数字
  );
};

/**
 * 在中英文之间自动添加空格
 * @param text 原始文本
 * @returns 处理后的文本
 */
export const addSpacingBetweenZhEn = (text: string): string => {
  if (!text) return '';
  
  let result = '';
  const chars = text.split('');
  
  for (let i = 0; i < chars.length; i++) {
    const currentChar = chars[i];
    const prevChar = i > 0 ? chars[i - 1] : '';
    const nextChar = i < chars.length - 1 ? chars[i + 1] : '';
    
    // 添加当前字符
    result += currentChar;
    
    // 检查是否需要在当前字符后添加空格
    // 情况1: 中文后面跟着英文
    if (isChineseChar(currentChar) && isEnglishChar(nextChar)) {
      // 确保下一个字符不是空格
      if (nextChar !== ' ') {
        result += ' ';
      }
    }
    // 情况2: 英文后面跟着中文
    else if (isEnglishChar(currentChar) && isChineseChar(nextChar)) {
      // 确保下一个字符不是空格
      if (nextChar !== ' ') {
        result += ' ';
      }
    }
    // 情况3: 英文单词后面跟着中文，但前面已经有空格
    else if (currentChar === ' ' && isChineseChar(nextChar) && i > 0 && isEnglishChar(prevChar)) {
      // 保持当前空格
    }
  }
  
  return result;
};

/**
 * 为React组件处理的文本添加适当的CSS类
 * @param text 文本内容
 * @param className 额外的CSS类名
 * @returns 包含适当CSS类名的文本
 */
export const formatMixedText = (text: string, className = ''): string => {
  const processedText = addSpacingBetweenZhEn(text);
  return `<span class="text-mixed ${className}">${processedText}</span>`;
};

/**
 * 识别并标记半导体专业术语
 * @param text 文本内容
 * @returns 标记了专业术语的HTML字符串
 */
export const markSemiconductorTerms = (text: string): string => {
  // 常见半导体术语列表
  const semiconductorTerms = [
    'semiconductor', 'silicon', 'germanium', 'gallium', 'arsenide',
    'transistor', 'diode', 'MOSFET', 'CMOS', 'IC', 'VLSI',
    'doping', 'p-n junction', 'band gap', 'electron', 'hole',
    'mobility', 'diffusion', 'drift', 'carrier', 'wafer',
    'fabrication', 'lithography', 'etching', 'deposition',
    'oxide', 'nitride', 'metallization', 'packaging',
    'Moore\'s Law', 'nanometer', 'quantum', 'photon',
    'LED', 'laser', 'solar cell', 'integrated circuit',
    'CPU', 'GPU', 'memory', 'processor', 'chip'
  ];
  
  let processedText = text;
  
  // 为每个术语添加标记
  semiconductorTerms.forEach(term => {
    const regex = new RegExp(`\\b${term}\\b`, 'gi');
    processedText = processedText.replace(regex, `<span class="semiconductor-term">$&</span>`);
  });
  
  return processedText;
};

/**
 * 综合处理混排文本：添加空格并标记专业术语
 * @param text 原始文本
 * @param className 额外的CSS类名
 * @returns 处理后的HTML字符串
 */
export const processMixedText = (text: string, className = ''): string => {
  let processedText = addSpacingBetweenZhEn(text);
  processedText = markSemiconductorTerms(processedText);
  return `<span class="text-mixed ${className}">${processedText}</span>`;
};