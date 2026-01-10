// 匹配引擎 - 用于根据配置规则匹配内容和组件

import { ContentBlock } from '../contentAnalyzer';
import { ComponentMapping, MatchRule, MatchResult, BlockComponentMap } from './types';

// 匹配单个内容块与组件映射规则
export function matchContentBlock(
  block: ContentBlock,
  mappings: ComponentMapping[]
): ComponentMapping | null {
  // 按优先级排序映射规则
  const sortedMappings = [...mappings].sort((a, b) => (b.priority || 0) - (a.priority || 0));

  for (const mapping of sortedMappings) {
    if (matchesRule(block, mapping.match)) {
      return mapping;
    }
  }

  return null;
}

// 检查内容块是否匹配规则
export function matchesRule(block: ContentBlock, rule: MatchRule): boolean {
  // 处理组合AND规则
  if (rule.AND && rule.AND.length > 0) {
    return rule.AND.every(subRule => matchesRule(block, subRule));
  }
  
  // 处理组合OR规则
  if (rule.OR && rule.OR.length > 0) {
    return rule.OR.some(subRule => matchesRule(block, subRule));
  }
  
  // 处理否定规则
  if (rule.NOT) {
    return !matchesRule(block, rule.NOT);
  }
  
  // 基础匹配规则
  let baseMatch = false;
  const ruleType = rule.type;
  
  switch (ruleType) {
    case 'heading':
      // 支持精确匹配和包含匹配
      if (block.type === 'heading' && rule.text) {
        baseMatch = block.content === rule.text || block.content.includes(rule.text);
      }
      break;
    
    case 'keywords':
      if (!rule.values || rule.values.length === 0) return false;
      const keywordMatches = rule.values.filter(keyword => block.content.includes(keyword));
      baseMatch = keywordMatches.length > 0;
      break;
    
    case 'contentType':
      baseMatch = block.type === rule.value;
      break;
    
    case 'regex':
      if (!rule.pattern) return false;
      baseMatch = rule.pattern.test(block.content);
      break;
    
    case 'default':
      baseMatch = true;
      break;
    
    default:
      baseMatch = false;
  }
  
  return baseMatch;
}

// 为多个内容块生成组件映射
export function generateBlockComponentMap(
  blocks: ContentBlock[],
  mappings: ComponentMapping[]
): BlockComponentMap {
  const blockMap: BlockComponentMap = {};

  blocks.forEach(block => {
    const mapping = matchContentBlock(block, mappings);
    if (mapping) {
      blockMap[block.id] = mapping;
    }
  });

  return blockMap;
}

// 计算匹配分数
export function calculateMatchScore(
  block: ContentBlock,
  mapping: ComponentMapping
): number {
  let score = mapping.priority || 0;

  const rule = mapping.match;
  switch (rule.type) {
    case 'heading':
      if (block.type === 'heading' && rule.text) {
        if (block.content === rule.text) {
          score += 100;
        } else if (block.content.includes(rule.text)) {
          score += 80;
        }
      }
      break;
    
    case 'keywords':
      if (rule.values && rule.values.length > 0) {
        const matchingKeywords = rule.values.filter(keyword => block.content.includes(keyword));
        score += matchingKeywords.length * 10;
      }
      break;
    
    case 'contentType':
      if (block.type === rule.value) {
        score += 50;
      }
      break;
    
    case 'regex':
      if (rule.pattern && rule.pattern.test(block.content)) {
        score += 80;
      }
      break;
    
    case 'default':
      score += 0;
      break;
  }

  return score;
}

// 获取所有匹配结果
export function getAllMatchResults(
  blocks: ContentBlock[],
  mappings: ComponentMapping[]
): MatchResult[] {
  const results: MatchResult[] = [];

  blocks.forEach(block => {
    mappings.forEach(mapping => {
      if (matchesRule(block, mapping.match)) {
        results.push({
          mapping,
          block,
          score: calculateMatchScore(block, mapping)
        });
      }
    });
  });

  // 按分数降序排序
  return results.sort((a, b) => b.score - a.score);
}

// 获取最佳匹配结果（每个内容块最多一个匹配）
export function getBestMatchResults(
  blocks: ContentBlock[],
  mappings: ComponentMapping[]
): MatchResult[] {
  const blockMap: Record<string, MatchResult> = {};
  const results = getAllMatchResults(blocks, mappings);

  results.forEach(result => {
    const blockId = result.block.id;
    if (!blockMap[blockId] || result.score > blockMap[blockId].score) {
      blockMap[blockId] = result;
    }
  });

  return Object.values(blockMap);
}
