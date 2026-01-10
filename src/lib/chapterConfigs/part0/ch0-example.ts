// 第0章 示例配置文件
import { ChapterConfig } from '@/lib/contentMapping';

const ch0Config: ChapterConfig = {
  // 章节主题配置
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

  // 组件注册配置
  componentRegistry: {
    SemiconductorHistoryModule: {
      path: '@/components/custom/SemiconductorHistoryModule',
      type: 'client',
      defaultProps: {
        interactive: true,
        showTimeline: true
      }
    },
    ScaleDownChallengeModule: {
      path: '@/components/custom/ScaleDownChallengeModule',
      type: 'client'
    },
    PostMooreEraModule: {
      path: '@/components/custom/PostMooreEraModule',
      type: 'client'
    },
    ConceptExplanationModule: {
      path: '@/components/custom/ConceptExplanationModule',
      type: 'client'
    },
    DataVisualizationModule: {
      path: '@/components/custom/DataVisualizationModule',
      type: 'client'
    }
  },

  // 组件映射规则
  componentMappings: [
    // 章节标题特殊处理
    {
      match: {
        type: 'heading',
        text: '一场从 "单个零件" 到 "亿万器件" 的革命'
      },
      component: 'SemiconductorHistoryModule',
      props: {
        interactive: true,
        theme: 'blue',
        showTimeline: true,
        animation: 'fadeIn'
      },
      priority: 20,
      className: 'mb-12'
    },

    // 使用AND规则匹配多个关键词
    {
      match: {
        type: 'keywords',
        values: ['摩尔定律', '极限', '挑战'],
        AND: [
          {
            type: 'contentType',
            value: 'paragraph'
          }
        ]
      },
      component: 'ScaleDownChallengeModule',
      props: {
        showData: true,
        interactive: true
      },
      priority: 15,
      className: 'mb-10'
    },

    // 使用OR规则匹配多个标题
    {
      match: {
        type: 'heading',
        OR: [
          { type: 'heading', text: '后摩尔时代的挑战与机遇' },
          { type: 'heading', text: '超越摩尔定律' }
        ]
      },
      component: 'PostMooreEraModule',
      props: {
        showChallenges: true,
        showOpportunities: true
      },
      priority: 18,
      className: 'mb-12'
    },

    // 关键词匹配，用于概念解释
    {
      match: {
        type: 'keywords',
        values: ['晶体管', '集成电路', '晶圆', '光刻'],
        NOT: {
          type: 'heading'
        }
      },
      component: 'ConceptExplanationModule',
      props: {
        showDefinition: true,
        showExamples: true
      },
      priority: 10,
      className: 'mb-8'
    },

    // 数据可视化组件
    {
      match: {
        type: 'contentType',
        value: 'code',
        context: {
          previous: {
            type: 'heading',
            text: '数据可视化示例'
          }
        }
      },
      component: 'DataVisualizationModule',
      props: {
        chartType: 'line',
        showLegend: true
      },
      priority: 12,
      className: 'mb-10'
    },

    // 动态props示例
    {
      match: {
        type: 'keywords',
        values: ['动态', '交互式', '实时']
      },
      component: 'DefaultContentModule',
      props: (block, context) => {
        // 动态计算props
        return {
          content: block.content,
          isInteractive: true,
          chapterSlug: context.chapterSlug,
          customProp: `动态生成的值: ${Math.random().toFixed(2)}`
        };
      },
      priority: 8,
      className: 'mb-8'
    },

    // 条件渲染示例
    {
      match: {
        type: 'paragraph'
      },
      component: 'DefaultContentModule',
      props: {
        showExtraContent: true
      },
      condition: (block) => {
        // 只渲染包含特定关键词的段落
        return block.content.includes('重要') || block.content.includes('关键');
      },
      priority: 5,
      className: 'mb-8'
    },

    // 默认组件
    {
      match: {
        type: 'default'
      },
      component: 'DefaultContentModule',
      props: {
        showExtraContent: false
      },
      priority: 0,
      className: 'mb-8'
    }
  ],

  // 全局组件属性
  globalProps: {
    siteName: '半导体技术百科',
    environment: 'development',
    analyticsEnabled: true
  },

  // 布局配置
  layout: {
    type: 'default'
  },

  // 交互功能配置
  interactive: true,

  // 分析配置
  analytics: {
    enabled: true,
    events: ['page_view', 'component_interaction', 'content_scroll']
  }
};

export default ch0Config;