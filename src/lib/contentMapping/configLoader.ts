// 配置加载器 - 用于动态加载章节的组件映射配置

import { ChapterConfig } from './types';

// 默认配置
export const defaultConfig: ChapterConfig = {
  componentMappings: [
    // 移除default规则，避免所有内容块都被匹配
  ],
  componentRegistry: {
    // 移除DefaultContentModule，避免非组件块被错误映射
  },
  defaultComponent: undefined,
  theme: {
    colors: {
      primary: '#3b82f6',
      secondary: '#6b7280',
      accent: '#10b981',
      background: '#ffffff',
      text: '#111827'
    },
    typography: {
      heading: 'Inter, sans-serif',
      body: 'Inter, sans-serif',
      monospace: 'Fira Code, monospace'
    },
    spacing: {
      small: '0.5rem',
      medium: '1rem',
      large: '1.5rem',
      xlarge: '2rem'
    },
    animations: {
      enabled: true,
      duration: '0.3s'
    }
  },
  layout: {
    type: 'default'
  },
  interactive: true,
  analytics: {
    enabled: false
  }
};

// 简化的深度合并函数，专门用于配置对象
function deepMerge(target: Record<string, any>, source: Partial<Record<string, any>>): Record<string, any> {
  const result = { ...target };
  
  for (const key in source) {
    if (source.hasOwnProperty(key)) {
      const targetValue = result[key];
      const sourceValue = source[key];
      
      // 如果两者都是对象且不是数组，递归合并
      if (typeof targetValue === 'object' && typeof sourceValue === 'object' && 
          targetValue !== null && sourceValue !== null && 
          !Array.isArray(targetValue) && !Array.isArray(sourceValue)) {
        result[key] = deepMerge(targetValue, sourceValue);
      } 
      // 如果是数组，合并数组
      else if (Array.isArray(targetValue) && Array.isArray(sourceValue)) {
        // 对于组件映射，我们将章节特定配置放在前面，默认配置放在后面
        if (key === 'componentMappings') {
          result[key] = [...sourceValue, ...targetValue];
        } else {
          result[key] = [...targetValue, ...sourceValue];
        }
      } 
      // 否则直接替换
      else if (sourceValue !== undefined) {
        result[key] = sourceValue;
      }
    }
  }
  
  return result;
}

// 动态加载章节配置
export async function loadChapterConfig(chapterSlug: string): Promise<ChapterConfig> {
  try {
    // 尝试加载章节特定配置
    // 格式：@/lib/chapterConfigs/[part]/[chapter].ts
    const configPath = `@/lib/chapterConfigs/${chapterSlug}`;
    const module = await import(configPath);
    const chapterConfig = module.default || {};
    
    // 深度合并默认配置和章节特定配置
    return deepMerge(defaultConfig, chapterConfig) as ChapterConfig;
  } catch (error) {
    console.warn(`Failed to load config for chapter ${chapterSlug}, using default config:`, error);
    // 如果加载失败，返回默认配置
    return defaultConfig;
  }
}

// 配置缓存，避免重复加载
const configCache: Record<string, ChapterConfig> = {};

// 获取章节配置（带缓存）
export async function getChapterConfig(chapterSlug: string): Promise<ChapterConfig> {
  // 检查缓存
  if (configCache[chapterSlug]) {
    return configCache[chapterSlug];
  }
  
  // 加载配置
  const config = await loadChapterConfig(chapterSlug);
  
  // 缓存配置
  configCache[chapterSlug] = config;
  
  return config;
}
