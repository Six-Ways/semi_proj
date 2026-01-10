// 内容映射类型定义

import { ContentBlock } from '../contentAnalyzer';

// 匹配类型
export type MatchType = 'heading' | 'keywords' | 'contentType' | 'regex' | 'default' | 'paragraph' | 'list' | 'blockquote' | 'code' | 'formula';

// 匹配规则接口
export interface MatchRule {
  type: MatchType;
  text?: string;              // 标题匹配的文本
  values?: string[];          // 关键词匹配的关键词数组
  value?: string;             // 内容类型匹配的值
  pattern?: RegExp;           // 正则表达式匹配的模式
  start?: string;             // 范围匹配的起始标记
  end?: string;               // 范围匹配的结束标记
  AND?: MatchRule[];          // 组合AND规则
  OR?: MatchRule[];           // 组合OR规则
  NOT?: MatchRule;            // 否定规则
  context?: {                 // 上下文匹配
    previous?: MatchRule;
    next?: MatchRule;
  };
}

// 组件映射接口
export interface ComponentMapping {
  match: MatchRule;
  component: string;          // 组件名称
  props?: Record<string, any> | ((block: ContentBlock, context: MappingContext) => Record<string, any>); // 静态或动态组件属性
  priority?: number;          // 匹配优先级，默认0
  lazy?: boolean;             // 是否延迟加载组件
  condition?: (block: ContentBlock, context: MappingContext) => boolean; // 条件渲染函数
  fallback?: string;          // 加载失败时的备选组件
  cacheable?: boolean;        // 是否可缓存
  version?: string;           // 映射版本，用于缓存失效
  preload?: string[];         // 需要预加载的资源
  className?: string;         // 包装组件的额外className
}

// 组件注册配置
export interface ComponentRegistry {
  [componentName: string]: {
    path: string;              // 组件文件路径
    type: 'client' | 'server'; // 组件类型
    defaultProps?: Record<string, any>; // 默认属性
    exportName?: string;       // 组件导出名称
  };
}

// 章节主题配置
export interface ChapterThemeConfig {
  colors?: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    text: string;
  };
  typography?: {
    heading?: string;
    body?: string;
    monospace?: string;
  };
  spacing?: {
    small: string;
    medium: string;
    large: string;
    xlarge: string;
  };
  animations?: {
    enabled: boolean;
    duration: string;
  };
}

// 章节配置接口
export interface ChapterConfig {
  componentMappings: ComponentMapping[];  // 组件映射规则
  componentRegistry?: ComponentRegistry;  // 组件注册配置
  defaultComponent?: string;              // 默认组件
  theme?: ChapterThemeConfig;             // 章节主题配置
  globalProps?: Record<string, any>;      // 全局组件属性
  layout?: {
    type: 'default' | 'sidebar' | 'fullscreen' | 'custom';
    customLayout?: string;                 // 自定义布局组件
  };
  interactive?: boolean;                  // 是否启用交互功能
  analytics?: {
    enabled: boolean;
    events?: string[];
  };
  i18n?: {
    defaultLocale: string;
    supportedLocales: string[];
  };
  customLogic?: {
    contentProcessor?: string;            // 自定义内容处理器
    componentResolver?: string;           // 自定义组件解析器
  };
}

// 匹配结果接口
export interface MatchResult {
  mapping: ComponentMapping;
  block: ContentBlock;
  score: number;              // 匹配分数，用于优先级排序
}

// 内容块与组件映射的映射关系
export interface BlockComponentMap {
  [blockId: string]: ComponentMapping;
}

// 内容映射上下文
export interface MappingContext {
  chapterSlug: string;
  contentBlocks: ContentBlock[];
  config: ChapterConfig;
}
