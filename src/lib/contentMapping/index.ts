// 内容映射核心逻辑入口文件

// 导出类型
export * from './types';

// 导出配置加载器
export * from './configLoader';

// 导出匹配引擎
export * from './matcherEngine';

// 导出便捷工具函数
import { ContentBlock } from '../contentAnalyzer';
import { ComponentMapping, MatchResult } from './types';
import { getChapterConfig } from './configLoader';
import { matchContentBlock, getBestMatchResults } from './matcherEngine';

// 获取章节的内容映射配置并匹配内容块
export async function getContentMapping(
  chapterSlug: string,
  contentBlocks: ContentBlock[]
): Promise<MatchResult[]> {
  // 获取章节配置
  const config = await getChapterConfig(chapterSlug);
  
  // 获取最佳匹配结果
  return getBestMatchResults(contentBlocks, config.componentMappings);
}

// 为单个内容块获取匹配的组件映射
export async function getComponentMappingForBlock(
  chapterSlug: string,
  block: ContentBlock
): Promise<ComponentMapping | null> {
  // 获取章节配置
  const config = await getChapterConfig(chapterSlug);
  
  // 匹配内容块
  return matchContentBlock(block, config.componentMappings);
}
