// ch0章节的组件映射配置

import { ChapterConfig } from '@/lib/contentMapping';

const ch0Config: ChapterConfig = {
  // 组件注册配置
  componentRegistry: {
    SemiconductorHistoryModule: {
      path: '@/components/custom/SemiconductorHistoryModule',
      type: 'client',
      exportName: 'SemiconductorHistoryModule'
    },
    ScaleDownChallengeModule: {
      path: '@/components/custom/ScaleDownChallengeModule',
      type: 'client'
    },
    ScaleDownChallengeBentoModule: {
      path: '@/components/custom/ScaleDownChallengeBentoModule',
      type: 'client',
      exportName: 'default'
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
  
  componentMappings: [
    {
      match: {
        type: 'heading',
        text: '一场从 "单个零件" 到 "亿万器件" 的革命'
      },
      component: 'SemiconductorHistoryModule',
      priority: 10
    },
    {
      match: {
        type: 'heading',
        text: `一场从 '单个零件' 到 '亿万器件' 的革命`
      },
      component: 'SemiconductorHistoryModule',
      priority: 10
    },
    {
      match: {
        type: 'keywords',
        values: ['晶体管', '集成电路', '摩尔定律', '半导体革命']
      },
      component: 'SemiconductorHistoryModule',
      priority: 9
    },
    {
      match: {
        type: 'keywords',
        values: ['挑战', '尺度微缩', '烦恼']
      },
      component: 'ScaleDownChallengeModule',
      props: {
        interactive: true
      },
      priority: 8
    },
    {
      match: {
        type: 'keywords',
        values: ['后摩尔时代', '新范式']
      },
      component: 'PostMooreEraModule',
      props: {
        visual: 'timeline'
      },
      priority: 7
    },
    {
      match: {
        type: 'keywords',
        values: ['概念', '定义', '本质', '原理', '核心', '理论', '定律']
      },
      component: 'ConceptExplanationModule',
      priority: 6
    },
    {
      match: {
        type: 'keywords',
        values: ['数据', '统计', '数量', '数字']
      },
      component: 'DataVisualizationModule',
      priority: 5
    },
    {
      match: {
        type: 'keywords',
        values: ['对比', '比较', '区别', '优势', '劣势', 'vs', 'VS']
      },
      component: 'ComparisonModule',
      priority: 4
    },
    {
      match: {
        type: 'contentType',
        value: 'list'
      },
      component: 'ListDisplayModule',
      priority: 3
    },
    {
      match: {
        type: 'contentType',
        value: 'blockquote'
      },
      component: 'StyledBlockquoteModule',
      priority: 2
    },
    {
      match: {
        type: 'contentType',
        value: 'code'
      },
      component: 'CodeDisplayModule',
      priority: 1
    },
    {
      match: {
        type: 'default'
      },
      component: 'DefaultContentModule',
      priority: 0
    }
  ]
};

export default ch0Config;
