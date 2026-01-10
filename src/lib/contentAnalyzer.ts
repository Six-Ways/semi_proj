import { ContentFeatureRule, ContentFeatureAnalysis, contentFeatureMappings } from './contentFeatureMappings';

// 内容块接口
export interface ContentBlock {
  id: string;
  content: string;
  type: 'paragraph' | 'heading' | 'list' | 'blockquote' | 'code' | 'formula' | 'component';
  level?: number; // 标题级别
  componentName?: string;
  componentProps?: Record<string, any>;
}

// 分析内容块的特征
export function analyzeContentBlock(contentBlock: ContentBlock): ContentFeatureAnalysis[] {
  const results: ContentFeatureAnalysis[] = [];
  const { content } = contentBlock;

  // 检查每个映射规则
  for (const rule of contentFeatureMappings) {
    let score = 0;
    const { matchers, priority } = rule;

    // 1. 关键词匹配
    if (matchers.keywords) {
      const keywordMatches = matchers.keywords.filter(keyword => content.includes(keyword));
      score += keywordMatches.length * 10;
    }

    // 2. 正则表达式匹配已移除，避免正则表达式导致的问题

    // 3. 结构匹配
    if (matchers.structure) {
      const { hasList, hasDates, hasNumbers, minLength, maxLength } = matchers.structure;

      if (hasList && (content.includes('- ') || content.includes('1. ') || content.includes('* '))) {
        score += 20;
      }

      if (hasDates) {
        // 简单的日期匹配（YYYY年或YYYY-MM-DD）
        const dateRegex = /\b\d{4}([年-]\d{2}){0,2}\b/g;
        const dateMatches = content.match(dateRegex) || [];
        score += dateMatches.length * 25;
      }

      if (hasNumbers) {
        // 匹配数字
        const numberRegex = /\b\d+\b/g;
        const numberMatches = content.match(numberRegex) || [];
        score += numberMatches.length * 5;
      }

      if (minLength && content.length >= minLength) {
        score += 5;
      }

      if (maxLength && content.length <= maxLength) {
        score += 5;
      }
    }

    // 4. 类型匹配（如果内容块有明确类型）
    if (contentBlock.type === 'blockquote' && rule.type === 'blockquote') {
      score += 30;
    }

    if (contentBlock.type === 'code' && rule.type === 'code') {
      score += 30;
    }

    if (contentBlock.type === 'formula' && rule.type === 'formula') {
      score += 30;
    }

    // 只有分数大于0的规则才会被考虑
    if (score > 0) {
      results.push({
        type: rule.type,
        component: rule.component,
        props: rule.defaultProps || {},
        score: score + priority // 加入优先级作为最终分数的一部分
      });
    }
  }

  // 按分数降序排序
  return results.sort((a, b) => b.score - a.score);
}

// 解析组件插入语法 [component:ComponentName](param1:value1, param2:value2)
function parseComponentInsertion(line: string): { componentName: string; props: Record<string, any> } | null {
  // 直接trim行，处理可能的前后空格
  const processedLine = line.trim();
  
  // 匹配组件插入语法，支持空括号
  const componentRegex = /\[component:([^\]]+)\]\(([^)]*)\)/;
  const match = processedLine.match(componentRegex);
  
  if (!match) return null;
  
  const componentName = match[1].trim();
  const propsString = match[2].trim();
  
  // 解析属性
  const props: Record<string, any> = {};
  
  if (propsString) {
    // 分割属性对
    const propPairs = propsString.split(',').map(pair => pair.trim());
    
    for (const pair of propPairs) {
      const [key, value] = pair.split(':').map(item => item.trim());
      if (key && value) {
        // 尝试将值转换为数字或布尔值
        let parsedValue: any = value;
        if (!isNaN(Number(value))) {
          parsedValue = Number(value);
        } else if (value.toLowerCase() === 'true') {
          parsedValue = true;
        } else if (value.toLowerCase() === 'false') {
          parsedValue = false;
        } else if (value.startsWith('"') && value.endsWith('"')) {
          parsedValue = value.slice(1, -1);
        } else if (value.startsWith('\'') && value.endsWith('\'')) {
          parsedValue = value.slice(1, -1);
        }
        props[key] = parsedValue;
      }
    }
  }
  
  return { componentName, props };
}

// 将内容分割成内容块
export function splitContentIntoBlocks(content: string): ContentBlock[] {
  const blocks: ContentBlock[] = [];
  const lines = content.split('\n');

  let currentBlock: ContentBlock | null = null;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    
    // 跳过代码块内的行，因为代码块会在后面单独处理
    if (currentBlock && currentBlock.type === 'code') {
      currentBlock.content += `\n${line}`;
      continue;
    }
    
    // 处理所有包含组件插入语法的行，无论是否为独立行
    if (line.includes('[component:')) {
      // 检查是否包含组件插入语法
      const componentInsertion = parseComponentInsertion(line);
      
      if (componentInsertion) {
        // 结束当前块
        if (currentBlock) {
          blocks.push(currentBlock);
          currentBlock = null;
        }
        
        // 添加组件块
        const componentBlock: ContentBlock = {
          id: `block-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          content: line,
          type: 'component',
          componentName: componentInsertion.componentName,
          componentProps: componentInsertion.props
        };
        blocks.push(componentBlock);
        continue;
      }
    }
    
    // 处理标题
    if (line.match(/^#{1,6}\s/)) {
      // 结束当前块
      if (currentBlock) {
        blocks.push(currentBlock);
        currentBlock = null;
      }

      const level = line.match(/^#{1,6}/)![0].length;
      const titleContent = line.replace(/^#{1,6}\s/, '');

      blocks.push({
        id: `block-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        content: titleContent,
        type: 'heading',
        level
      });
    }
    // 处理代码块
    else if (line.match(/^```/)) {
      if (currentBlock && currentBlock.type === 'code') {
        // 结束代码块
        currentBlock.content += `\n${line}`;
        blocks.push(currentBlock);
        currentBlock = null;
      } else {
        // 开始代码块
        if (currentBlock) {
          blocks.push(currentBlock);
        }
        currentBlock = {
          id: `block-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          content: line,
          type: 'code'
        };
      }
    }
    // 处理公式块
    else if (line.match(/^\$\$/)) {
      if (currentBlock && currentBlock.type === 'formula') {
        // 结束公式块
        currentBlock.content += `\n${line}`;
        blocks.push(currentBlock);
        currentBlock = null;
      } else {
        // 开始公式块
        if (currentBlock) {
          blocks.push(currentBlock);
        }
        currentBlock = {
          id: `block-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          content: line,
          type: 'formula'
        };
      }
    }
    // 处理引用
    else if (line.match(/^>\s/)) {
      if (currentBlock && currentBlock.type === 'blockquote') {
        // 继续引用块
        currentBlock.content += `\n${line}`;
      } else {
        // 开始引用块
        if (currentBlock) {
          blocks.push(currentBlock);
        }
        currentBlock = {
          id: `block-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          content: line,
          type: 'blockquote'
        };
      }
    }
    // 处理列表项
    else if (line.match(/^[-*+]\s|^\d+\.\s/)) {
      if (currentBlock && currentBlock.type === 'list') {
        // 继续列表
        currentBlock.content += `\n${line}`;
      } else {
        // 开始列表
        if (currentBlock) {
          blocks.push(currentBlock);
        }
        currentBlock = {
          id: `block-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          content: line,
          type: 'list'
        };
      }
    }
    // 处理空行（分隔块）
    else if (line.trim() === '') {
      if (currentBlock) {
        blocks.push(currentBlock);
        currentBlock = null;
      }
    }
    // 处理普通段落
    else {
      if (currentBlock && currentBlock.type === 'paragraph') {
        // 继续段落
        currentBlock.content += `\n${line}`;
      } else {
        // 开始段落
        if (currentBlock) {
          blocks.push(currentBlock);
        }
        currentBlock = {
          id: `block-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          content: line,
          type: 'paragraph'
        };
      }
    }
  }

  // 添加最后一个块
  if (currentBlock) {
    blocks.push(currentBlock);
  }

  return blocks;
}

// 合并相邻的相同类型内容块
export function mergeAdjacentBlocks(blocks: ContentBlock[]): ContentBlock[] {
  if (blocks.length <= 1) return blocks;

  const merged: ContentBlock[] = [blocks[0]];

  for (let i = 1; i < blocks.length; i++) {
    const current = blocks[i];
    const last = merged[merged.length - 1];

    // 合并相邻的相同类型块（除了标题和组件）
    if (current.type === last.type && current.type !== 'heading' && current.type !== 'component') {
      last.content += `\n\n${current.content}`;
    } else {
      merged.push(current);
    }
  }

  return merged;
}

// 最终的内容分析函数，返回最佳匹配的组件
export function analyzeContent(content: string): ContentBlock[] {
  // 1. 预处理：将行内代码块中的组件插入语法转换为普通的组件插入语法
  // 匹配所有被反引号包裹的组件插入语法：`[component:ComponentName](props)`
  const processedContent = content.replace(/`(\[component:[^\]]+\]\(([^)]*)\))`/g, '$1');
  
  // 2. 将内容分割成块
  let blocks = splitContentIntoBlocks(processedContent);
  
  // 去重：确保每个组件只出现一次
  const uniqueBlocks: ContentBlock[] = [];
  const componentMap = new Map<string, boolean>();
  
  for (const block of blocks) {
    if (block.type === 'component' && block.componentName) {
      // 只添加一次组件
      if (!componentMap.has(block.componentName)) {
        componentMap.set(block.componentName, true);
        uniqueBlocks.push(block);
      }
    } else {
      // 非组件块直接添加
      uniqueBlocks.push(block);
    }
  }
  
  // 3. 合并相邻块（仅针对非组件块）
  let finalBlocks: ContentBlock[] = [];
  if (uniqueBlocks.length > 0) {
    finalBlocks = [uniqueBlocks[0]];
    for (let i = 1; i < uniqueBlocks.length; i++) {
      const current = uniqueBlocks[i];
      const last = finalBlocks[finalBlocks.length - 1];
      
      // 只合并相邻的相同类型非组件块
      if (current.type === last.type && current.type !== 'heading' && current.type !== 'component') {
        last.content += `\n\n${current.content}`;
      } else {
        finalBlocks.push(current);
      }
    }
  }

  return finalBlocks;
}
