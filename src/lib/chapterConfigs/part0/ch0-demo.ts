// ch0章节的组件映射配置 - 演示版
// 展示新的内容映射系统的各种功能

import { ChapterConfig } from '@/lib/contentMapping';

const ch0Config: ChapterConfig = {
  // 组件注册配置
  componentRegistry: {
    SemiconductorRevolutionTimeline: {
      path: '@/components/custom/SemiconductorRevolutionTimeline',
      type: 'client'
    },
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
    },
    ComparisonModule: {
      path: '@/components/custom/ComparisonModule',
      type: 'client'
    },
    ListDisplayModule: {
      path: '@/components/custom/ListDisplayModule',
      type: 'client'
    },
    StyledBlockquoteModule: {
      path: '@/components/custom/StyledBlockquoteModule',
      type: 'client'
    },
    CodeDisplayModule: {
      path: '@/components/custom/CodeDisplayModule',
      type: 'client'
    },
    DefaultContentModule: {
      path: '@/components/custom/DefaultContentModule',
      type: 'client'
    }
  },

  // 章节主题配置
  theme: {
    colors: {
      primary: '#2563eb', // 蓝色主题
      secondary: '#64748b',
      accent: '#10b981',
      background: '#ffffff',
      text: '#1e293b'
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

  // 全局组件属性
  globalProps: {
    siteName: '半导体技术百科',
    chapterTitle: '从晶体管到芯片：半导体产业的演进',
    analyticsEnabled: true
  },

  // 布局配置
  layout: {
    type: 'default'
  },

  // 组件映射规则
  componentMappings: [
    // 1. 使用基础标题匹配 - 半导体革命时间线
    {
      match: {
        type: 'heading',
        text: '一场从 "单个零件" 到 "亿万器件" 的革命'
      },
      component: 'SemiconductorRevolutionTimeline',
      priority: 20,
      className: 'mb-12'
    },

    // 2. 使用AND规则匹配多个关键词
    {
      match: {
        type: 'keywords',
        values: ['挑战', '尺度微缩'],
        AND: [
          {
            type: 'contentType',
            value: 'paragraph'
          }
        ]
      },
      component: 'ScaleDownChallengeModule',
      props: {
        interactive: true,
        showData: true
      },
      priority: 15,
      className: 'mb-10'
    },

    // 3. 使用OR规则匹配多个标题
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
        visual: 'timeline',
        showChallenges: true,
        showOpportunities: true
      },
      priority: 18,
      className: 'mb-12'
    },

    // 4. 使用关键词匹配和NOT规则
    {
      match: {
        type: 'keywords',
        values: ['里程碑', '演进脉络', '发展历程'],
        NOT: {
          type: 'heading'
        }
      },
      component: 'SemiconductorHistoryModule',
      props: {
        showTimeline: true,
        interactive: false
      },
      priority: 7
    },

    // 5. 使用动态props
    {
      match: {
        type: 'keywords',
        values: ['概念', '定义', '原理', '定律']
      },
      component: 'ConceptExplanationModule',
      props: (block, context) => {
        // 动态计算props，根据内容自动调整
        const hasFormula = block.content.includes('=') || block.content.includes('公式');
        const hasExample = block.content.includes('例如') || block.content.includes('示例');
        
        return {
          showDefinition: true,
          showFormula: hasFormula,
          showExample: hasExample,
          blockId: block.id,
          chapterSlug: context.chapterSlug
        };
      },
      priority: 6,
      className: 'mb-8'
    },

    // 6. 使用条件渲染
    {
      match: {
        type: 'paragraph'
      },
      component: 'DataVisualizationModule',
      props: {
        chartType: 'bar',
        showLegend: true
      },
      condition: (block) => {
        // 只在包含特定数据模式的段落中渲染数据可视化组件
        return block.content.includes('数据') && 
               (block.content.includes('增长') || 
                block.content.includes('比例') || 
                block.content.includes('趋势'));
      },
      priority: 5,
      className: 'mb-8'
    },

    // 7. 使用内容类型匹配
    {
      match: {
        type: 'list'
      },
      component: 'ListDisplayModule',
      props: {
        showNumbers: false,
        style: 'modern'
      },
      priority: 3,
      className: 'mb-6'
    },

    // 8. 使用引用块匹配
    {
      match: {
        type: 'blockquote'
      },
      component: 'StyledBlockquoteModule',
      props: {
        style: 'modern',
        showAuthor: false
      },
      priority: 2,
      className: 'mb-6'
    },

    // 9. 使用代码块匹配
    {
      match: {
        type: 'code'
      },
      component: 'CodeDisplayModule',
      props: {
        showLineNumbers: true,
        language: 'python'
      },
      priority: 1,
      className: 'mb-6'
    },

    // 10. 使用正则表达式匹配
    {
      match: {
        type: 'regex',
        pattern: /\d{4}年.*[事件|突破|发展]/
      },
      component: 'SemiconductorHistoryModule',
      props: {
        showTimeline: true,
        interactive: false
      },
      priority: 8,
      className: 'mb-8'
    },

    // 11. 使用上下文匹配
    {
      match: {
        type: 'paragraph',
        context: {
          previous: {
            type: 'heading',
            text: '摩尔定律的局限性'
          }
        }
      },
      component: 'PostMooreEraModule',
      props: {
        visual: 'cards',
        showChallenges: true
      },
      priority: 12,
      className: 'mb-10'
    },

    // 12. 默认组件
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

  // 交互功能配置
  interactive: true,

  // 分析配置
  analytics: {
    enabled: true,
    events: ['page_view', 'component_interaction', 'content_scroll']
  }
};

export default ch0Config;