// 内容特征类型定义
export type ContentFeatureType = 
  | 'timeline'           // 时间线/历史演进
  | 'challenge'         // 挑战与解决方案
  | 'concept'           // 核心概念解释
  | 'data'              // 数据统计
  | 'comparison'        // 对比分析
  | 'list'              // 列表内容
  | 'narrative'         // 叙事性内容
  | 'blockquote'        // 引用内容
  | 'code'              // 代码示例
  | 'formula'           // 公式
  | 'default';          // 默认类型

// 内容特征规则接口
export interface ContentFeatureRule {
  type: ContentFeatureType;
  // 匹配规则：可以是关键词列表或自定义函数
  matchers: {
    // 基于关键词的匹配
    keywords?: string[];
    // 基于内容结构的匹配
    structure?: {
      hasList?: boolean;
      hasDates?: boolean;
      hasNumbers?: boolean;
      minLength?: number;
      maxLength?: number;
    };
    // 注意：移除了regex属性，避免正则表达式导致的问题
  };
  // 对应的组件名称
  component: string;
  // 组件优先级（用于处理多个规则匹配的情况）
  priority: number;
  // 组件默认属性
  defaultProps?: Record<string, any>;
}

// 内容特征映射配置
export const contentFeatureMappings: ContentFeatureRule[] = [
  {
    type: 'timeline',
    matchers: {
      keywords: ['一场从 "单个零件" 到 "亿万器件" 的革命'],
      structure: {
        minLength: 100
      }
    },
    component: 'SemiconductorHistoryModule',
    priority: 12
  },
  {
    type: 'timeline',
    matchers: {
      keywords: ['里程碑', '演进脉络', '发展历程', '时间线', '历史'],
      structure: {
        hasDates: true,
        hasList: true
      }
    },
    component: 'SemiconductorHistoryModule',
    priority: 10
  },
  {
    type: 'challenge',
    matchers: {
      keywords: ['挑战', '问题', '困境', '瓶颈', '解决方案', '突破'],
      structure: {
        minLength: 100
      }
    },
    component: 'ScaleDownChallengeModule',
    priority: 9
  },
  {
    type: 'concept',
    matchers: {
      keywords: ['概念', '定义', '本质', '原理', '核心', '理论', '定律'],
      structure: {
        hasList: true,
        minLength: 50
      }
    },
    component: 'ConceptExplanationModule',
    priority: 8
  },
  {
    type: 'data',
    matchers: {
      structure: {
        hasNumbers: true
      }
    },
    component: 'DataVisualizationModule',
    priority: 7
  },
  {
    type: 'comparison',
    matchers: {
      keywords: ['对比', '比较', '区别', '优势', '劣势', 'vs', 'VS'],
      structure: {
        minLength: 80
      }
    },
    component: 'ComparisonModule',
    priority: 6
  },
  {
    type: 'list',
    matchers: {
      structure: {
        hasList: true,
        maxLength: 200
      }
    },
    component: 'ListDisplayModule',
    priority: 5
  },
  {
    type: 'blockquote',
    matchers: {
      structure: {
        minLength: 10
      }
    },
    component: 'StyledBlockquoteModule',
    priority: 4
  },
  {
    type: 'code',
    matchers: {
      structure: {
        minLength: 20
      }
    },
    component: 'CodeDisplayModule',
    priority: 3
  },
  {
    type: 'formula',
    matchers: {
      structure: {
        minLength: 10
      }
    },
    component: 'FormulaDisplayModule',
    priority: 2
  },
  {
    type: 'narrative',
    matchers: {
      structure: {
        minLength: 150
      }
    },
    component: 'NarrativeContentModule',
    priority: 1
  },
  {
    type: 'default',
    matchers: {},
    component: 'DefaultContentModule',
    priority: 0
  }
];

// 内容特征分析结果接口
export interface ContentFeatureAnalysis {
  type: ContentFeatureType;
  component: string;
  props: Record<string, any>;
  score: number;
}

// 组件注册表
export const componentRegistry: Record<string, string> = {
  SemiconductorHistoryModule: '@/components/custom/SemiconductorHistoryModule',
  SemiconductorRevolutionTimeline: '@/components/custom/SemiconductorRevolutionTimeline',
  ScaleDownChallengeModule: '@/components/custom/ScaleDownChallengeModule',
  PostMooreEraModule: '@/components/custom/PostMooreEraModule',
  ConceptExplanationModule: '@/components/custom/ConceptExplanationModule',
  DataVisualizationModule: '@/components/custom/DataVisualizationModule',
  ComparisonModule: '@/components/custom/ComparisonModule',
  ListDisplayModule: '@/components/custom/ListDisplayModule',
  StyledBlockquoteModule: '@/components/custom/StyledBlockquoteModule',
  CodeDisplayModule: '@/components/custom/CodeDisplayModule',
  FormulaDisplayModule: '@/components/custom/FormulaDisplayModule',
  NarrativeContentModule: '@/components/custom/NarrativeContentModule',
  DefaultContentModule: '@/components/custom/DefaultContentModule',
  SeekKnowledgeModule: '@/components/custom/SeekKnowledgeModule'
};
