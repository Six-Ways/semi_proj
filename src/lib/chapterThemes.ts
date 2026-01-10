// 正文内容样式配置接口
export interface ContentStyles {
  // 标题样式
  h1?: {
    color?: string;
    fontSize?: string;
    fontWeight?: string;
    borderBottom?: string;
    borderColor?: string;
    marginBottom?: string;
  };
  h2?: {
    color?: string;
    fontSize?: string;
    fontWeight?: string;
    borderBottom?: string;
    borderColor?: string;
    marginBottom?: string;
  };
  h3?: {
    color?: string;
    fontSize?: string;
    fontWeight?: string;
    marginBottom?: string;
  };
  
  // 段落样式
  paragraph?: {
    color?: string;
    fontSize?: string;
    lineHeight?: string;
    marginBottom?: string;
  };
  
  // 列表样式
  list?: {
    color?: string;
    markerColor?: string;
    marginBottom?: string;
    paddingLeft?: string;
  };
  
  // 引用样式
  blockquote?: {
    color?: string;
    backgroundColor?: string;
    borderLeft?: string;
    padding?: string;
    margin?: string;
    fontStyle?: string;
  };
  
  // 强调文本样式
  emphasis?: {
    color?: string;
    fontWeight?: string;
    fontStyle?: string;
  };
  
  // 代码块样式
  codeBlock?: {
    backgroundColor?: string;
    color?: string;
    borderRadius?: string;
    padding?: string;
    fontSize?: string;
    marginBottom?: string;
  };
  
  // 内联代码样式
  inlineCode?: {
    backgroundColor?: string;
    color?: string;
    padding?: string;
    borderRadius?: string;
    fontSize?: string;
  };
  
  // 公式样式
  formula?: {
    color?: string;
    fontSize?: string;
    margin?: string;
  };
}

// 内容布局配置接口
export interface ContentLayout {
  maxWidth?: string;
  align?: 'left' | 'center' | 'justify';
  padding?: string;
  margin?: string;
}

// 章节主题配置接口
export interface ChapterTheme {
  // 主题名称
  name: string;
  
  // 主色调配置
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  
  // 背景配置
  backgroundColor: string;
  cardBackgroundColor: string;
  borderColor: string;
  
  // 文本颜色配置
  textColor: string;
  textSecondaryColor: string;
  headingColor: string;
  
  // 阴影配置
  shadow: string;
  shadowHover: string;
  
  // 动画配置
  animation: 'slide' | 'fade' | 'scale' | 'flip' | 'wipe' | 'none';
  animationDuration: number;
  
  // 卡片样式变体
  cardVariant: 'default' | 'rounded' | 'outlined' | 'shadowed' | 'gradient';
  
  // 正文内容样式
  contentStyles?: ContentStyles;
  
  // 内容布局配置
  contentLayout?: ContentLayout;
  
  // 装饰元素
  decorations?: {
    borderPattern?: 'none' | 'dashed' | 'dotted' | 'solid';
    backgroundPattern?: 'none' | 'gradient' | 'dots' | 'stripes';
    dividerStyle?: string;
  };
  
  // 特定章节的自定义样式
  customStyles?: {
    [key: string]: string;
  };
}

// 章节主题配置
export const chapterThemes: Record<string, ChapterTheme> = {
  // 序章 - 半导体技术的发展历程与摩尔定律
  'part0/ch0': {
    name: 'history',
    primaryColor: '#8B5CF6', // 紫色 - 代表历史与传统
    secondaryColor: '#A78BFA',
    accentColor: '#C4B5FD',
    backgroundColor: '#F9FAFB',
    cardBackgroundColor: '#FFFFFF',
    borderColor: '#E5E7EB',
    textColor: '#1F2937',
    textSecondaryColor: '#4B5563',
    headingColor: '#1F2937',
    shadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
    shadowHover: '0 4px 6px rgba(0, 0, 0, 0.1)',
    animation: 'slide',
    animationDuration: 0.6,
    cardVariant: 'gradient',
    contentStyles: {
      h2: {
        color: '#8B5CF6',
        fontSize: '1.75rem',
        fontWeight: '600',
        borderBottom: '2px solid #8B5CF6',
        marginBottom: '1.5rem'
      },
      h3: {
        color: '#7C3AED',
        fontSize: '1.5rem',
        fontWeight: '600',
        marginBottom: '1rem'
      },
      paragraph: {
        color: '#4B5563',
        fontSize: '1rem',
        lineHeight: '1.75',
        marginBottom: '1rem'
      },
      blockquote: {
        color: '#5B21B6',
        backgroundColor: '#F5F3FF',
        borderLeft: '4px solid #8B5CF6',
        padding: '1rem 1.5rem',
        margin: '1rem 0',
        fontStyle: 'italic'
      }
    },
    contentLayout: {
      maxWidth: '800px',
      align: 'left',
      padding: '0 1rem',
      margin: '0 auto'
    },
    decorations: {
      borderPattern: 'solid',
      backgroundPattern: 'gradient',
      dividerStyle: 'border-t border-purple-100 my-8'
    },
    customStyles: {
      'background': 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
    }
  },
  
  // 第1章 - 半导体材料与晶体结构
  'part1/ch1': {
    name: 'crystal',
    primaryColor: '#3B82F6', // 蓝色 - 代表晶体的有序结构
    secondaryColor: '#60A5FA',
    accentColor: '#93C5FD',
    backgroundColor: '#F0F9FF',
    cardBackgroundColor: '#FFFFFF',
    borderColor: '#BFDBFE',
    textColor: '#1E3A8A',
    textSecondaryColor: '#3B82F6',
    headingColor: '#1E3A8A',
    shadow: '0 1px 3px rgba(59, 130, 246, 0.1)',
    shadowHover: '0 4px 6px rgba(59, 130, 246, 0.15)',
    animation: 'scale',
    animationDuration: 0.5,
    cardVariant: 'shadowed',
    contentStyles: {
      h2: {
        color: '#3B82F6',
        fontSize: '1.75rem',
        fontWeight: '600',
        borderBottom: '2px solid #3B82F6',
        marginBottom: '1.5rem'
      },
      h3: {
        color: '#1E40AF',
        fontSize: '1.5rem',
        fontWeight: '600',
        marginBottom: '1rem'
      },
      paragraph: {
        color: '#3B82F6',
        fontSize: '1rem',
        lineHeight: '1.75',
        marginBottom: '1rem'
      },
      list: {
        color: '#1E40AF',
        markerColor: '#3B82F6',
        marginBottom: '1rem',
        paddingLeft: '1.5rem'
      },
      blockquote: {
        color: '#1E40AF',
        backgroundColor: '#EFF6FF',
        borderLeft: '4px solid #3B82F6',
        padding: '1rem 1.5rem',
        margin: '1rem 0',
        fontStyle: 'italic'
      }
    },
    contentLayout: {
      maxWidth: '800px',
      align: 'left',
      padding: '0 1rem',
      margin: '0 auto'
    },
    decorations: {
      borderPattern: 'solid',
      backgroundPattern: 'gradient',
      dividerStyle: 'border-t border-blue-100 my-8'
    },
    customStyles: {
      'background': 'radial-gradient(circle at 10% 20%, rgb(239, 246, 255) 0%, rgb(206, 239, 253) 90.1%)',
    }
  },
  
  // 第2章 - 量子力学基础与固体能带
  'part1/ch2': {
    name: 'quantum',
    primaryColor: '#EC4899', // 粉色 - 代表量子世界的神秘与不确定性
    secondaryColor: '#F472B6',
    accentColor: '#F9A8D4',
    backgroundColor: '#FFF1F2',
    cardBackgroundColor: '#FFFFFF',
    borderColor: '#FECACA',
    textColor: '#9D174D',
    textSecondaryColor: '#EC4899',
    headingColor: '#9D174D',
    shadow: '0 1px 3px rgba(236, 72, 153, 0.1)',
    shadowHover: '0 4px 6px rgba(236, 72, 153, 0.15)',
    animation: 'fade',
    animationDuration: 0.8,
    cardVariant: 'rounded',
    contentStyles: {
      h2: {
        color: '#EC4899',
        fontSize: '1.75rem',
        fontWeight: '600',
        borderBottom: '2px solid #EC4899',
        marginBottom: '1.5rem'
      },
      h3: {
        color: '#9D174D',
        fontSize: '1.5rem',
        fontWeight: '600',
        marginBottom: '1rem'
      },
      paragraph: {
        color: '#9D174D',
        fontSize: '1rem',
        lineHeight: '1.75',
        marginBottom: '1rem'
      },
      blockquote: {
        color: '#831843',
        backgroundColor: '#FEF2F2',
        borderLeft: '4px solid #EC4899',
        padding: '1rem 1.5rem',
        margin: '1rem 0',
        fontStyle: 'italic'
      }
    },
    contentLayout: {
      maxWidth: '800px',
      align: 'left',
      padding: '0 1rem',
      margin: '0 auto'
    },
    decorations: {
      borderPattern: 'dashed',
      backgroundPattern: 'none',
      dividerStyle: 'border-t border-pink-100 my-8'
    },
    customStyles: {
      'background': 'linear-gradient(120deg, #fdfbfb 0%, #ebedee 100%)',
    }
  },
  
  // 第3章 - 载流子统计与热平衡
  'part1/ch3': {
    name: 'statistics',
    primaryColor: '#10B981', // 绿色 - 代表平衡与稳定
    secondaryColor: '#34D399',
    accentColor: '#6EE7B7',
    backgroundColor: '#ECFDF5',
    cardBackgroundColor: '#FFFFFF',
    borderColor: '#A7F3D0',
    textColor: '#065F46',
    textSecondaryColor: '#10B981',
    headingColor: '#065F46',
    shadow: '0 1px 3px rgba(16, 185, 129, 0.1)',
    shadowHover: '0 4px 6px rgba(16, 185, 129, 0.15)',
    animation: 'wipe',
    animationDuration: 0.7,
    cardVariant: 'outlined',
    contentStyles: {
      h2: {
        color: '#10B981',
        fontSize: '1.75rem',
        fontWeight: '600',
        borderBottom: '2px solid #10B981',
        marginBottom: '1.5rem'
      },
      h3: {
        color: '#059669',
        fontSize: '1.5rem',
        fontWeight: '600',
        marginBottom: '1rem'
      },
      paragraph: {
        color: '#065F46',
        fontSize: '1rem',
        lineHeight: '1.75',
        marginBottom: '1rem'
      },
      list: {
        color: '#065F46',
        markerColor: '#10B981',
        marginBottom: '1rem',
        paddingLeft: '1.5rem'
      },
      blockquote: {
        color: '#065F46',
        backgroundColor: '#F0FDF4',
        borderLeft: '4px solid #10B981',
        padding: '1rem 1.5rem',
        margin: '1rem 0',
        fontStyle: 'italic'
      }
    },
    contentLayout: {
      maxWidth: '800px',
      align: 'left',
      padding: '0 1rem',
      margin: '0 auto'
    },
    decorations: {
      borderPattern: 'solid',
      backgroundPattern: 'gradient',
      dividerStyle: 'border-t border-green-100 my-8'
    },
    customStyles: {
      'background': 'linear-gradient(135deg, #d4fc79 0%, #96e6a1 100%)',
    }
  },
  
  // 第4章 - 载流子输运：漂移与扩散
  'part2/ch4': {
    name: 'transport',
    primaryColor: '#F59E0B', // 橙色 - 代表运动与能量
    secondaryColor: '#FBBF24',
    accentColor: '#FCD34D',
    backgroundColor: '#FFFBEB',
    cardBackgroundColor: '#FFFFFF',
    borderColor: '#FDE68A',
    textColor: '#92400E',
    textSecondaryColor: '#F59E0B',
    headingColor: '#92400E',
    shadow: '0 1px 3px rgba(245, 158, 11, 0.1)',
    shadowHover: '0 4px 6px rgba(245, 158, 11, 0.15)',
    animation: 'slide',
    animationDuration: 0.6,
    cardVariant: 'gradient',
    contentStyles: {
      h2: {
        color: '#F59E0B',
        fontSize: '1.75rem',
        fontWeight: '600',
        borderBottom: '2px solid #F59E0B',
        marginBottom: '1.5rem'
      },
      h3: {
        color: '#92400E',
        fontSize: '1.5rem',
        fontWeight: '600',
        marginBottom: '1rem'
      },
      paragraph: {
        color: '#92400E',
        fontSize: '1rem',
        lineHeight: '1.75',
        marginBottom: '1rem'
      },
      blockquote: {
        color: '#78350F',
        backgroundColor: '#FEF3C7',
        borderLeft: '4px solid #F59E0B',
        padding: '1rem 1.5rem',
        margin: '1rem 0',
        fontStyle: 'italic'
      }
    },
    contentLayout: {
      maxWidth: '800px',
      align: 'left',
      padding: '0 1rem',
      margin: '0 auto'
    },
    decorations: {
      borderPattern: 'dashed',
      backgroundPattern: 'gradient',
      dividerStyle: 'border-t border-orange-100 my-8'
    },
    customStyles: {
      'background': 'linear-gradient(120deg, #fccb90 0%, #d57eeb 100%)',
    }
  },
  
  // 第5章 - 非平衡载流子与复合动力学
  'part2/ch5': {
    name: 'nonequilibrium',
    primaryColor: '#EF4444', // 红色 - 代表非平衡与变化
    secondaryColor: '#F87171',
    accentColor: '#FCA5A5',
    backgroundColor: '#FEF2F2',
    cardBackgroundColor: '#FFFFFF',
    borderColor: '#FCA5A5',
    textColor: '#991B1B',
    textSecondaryColor: '#EF4444',
    headingColor: '#991B1B',
    shadow: '0 1px 3px rgba(239, 68, 68, 0.1)',
    shadowHover: '0 4px 6px rgba(239, 68, 68, 0.15)',
    animation: 'flip',
    animationDuration: 0.8,
    cardVariant: 'shadowed',
    contentStyles: {
      h2: {
        color: '#EF4444',
        fontSize: '1.75rem',
        fontWeight: '600',
        borderBottom: '2px solid #EF4444',
        marginBottom: '1.5rem'
      },
      h3: {
        color: '#991B1B',
        fontSize: '1.5rem',
        fontWeight: '600',
        marginBottom: '1rem'
      },
      paragraph: {
        color: '#991B1B',
        fontSize: '1rem',
        lineHeight: '1.75',
        marginBottom: '1rem'
      },
      list: {
        color: '#991B1B',
        markerColor: '#EF4444',
        marginBottom: '1rem',
        paddingLeft: '1.5rem'
      },
      blockquote: {
        color: '#991B1B',
        backgroundColor: '#FEE2E2',
        borderLeft: '4px solid #EF4444',
        padding: '1rem 1.5rem',
        margin: '1rem 0',
        fontStyle: 'italic'
      }
    },
    contentLayout: {
      maxWidth: '800px',
      align: 'left',
      padding: '0 1rem',
      margin: '0 auto'
    },
    decorations: {
      borderPattern: 'solid',
      backgroundPattern: 'none',
      dividerStyle: 'border-t border-red-100 my-8'
    },
    customStyles: {
      'background': 'linear-gradient(to top, #ff9a9e 0%, #fad0c4 99%, #fad0c4 100%)',
    }
  },
  
  // 第6章 - 高场与量子输运
  'part2/ch6': {
    name: 'highfield',
    primaryColor: '#6366F1', // 靛蓝色 - 代表高强度与极端条件
    secondaryColor: '#818CF8',
    accentColor: '#A5B4FC',
    backgroundColor: '#EEF2FF',
    cardBackgroundColor: '#FFFFFF',
    borderColor: '#C7D2FE',
    textColor: '#3730A3',
    textSecondaryColor: '#6366F1',
    headingColor: '#3730A3',
    shadow: '0 1px 3px rgba(99, 102, 241, 0.1)',
    shadowHover: '0 4px 6px rgba(99, 102, 241, 0.15)',
    animation: 'scale',
    animationDuration: 0.5,
    cardVariant: 'rounded',
    contentStyles: {
      h2: {
        color: '#6366F1',
        fontSize: '1.75rem',
        fontWeight: '600',
        borderBottom: '2px solid #6366F1',
        marginBottom: '1.5rem'
      },
      h3: {
        color: '#4F46E5',
        fontSize: '1.5rem',
        fontWeight: '600',
        marginBottom: '1rem'
      },
      paragraph: {
        color: '#3730A3',
        fontSize: '1rem',
        lineHeight: '1.75',
        marginBottom: '1rem'
      },
      blockquote: {
        color: '#4338CA',
        backgroundColor: '#EEF2FF',
        borderLeft: '4px solid #6366F1',
        padding: '1rem 1.5rem',
        margin: '1rem 0',
        fontStyle: 'italic'
      }
    },
    contentLayout: {
      maxWidth: '800px',
      align: 'left',
      padding: '0 1rem',
      margin: '0 auto'
    },
    decorations: {
      borderPattern: 'dotted',
      backgroundPattern: 'gradient',
      dividerStyle: 'border-t border-indigo-100 my-8'
    },
    customStyles: {
      'background': 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    }
  },
  
  // 默认主题
  default: {
    name: 'default',
    primaryColor: '#007AFF',
    secondaryColor: '#34C759',
    accentColor: '#FF9500',
    backgroundColor: '#f8fafc',
    cardBackgroundColor: '#FFFFFF',
    borderColor: '#E2E8F0',
    textColor: '#1e293b',
    textSecondaryColor: '#64748b',
    headingColor: '#0f172a',
    shadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
    shadowHover: '0 4px 6px rgba(0, 0, 0, 0.1)',
    animation: 'fade',
    animationDuration: 0.5,
    cardVariant: 'default',
    contentStyles: {
      h2: {
        color: '#007AFF',
        fontSize: '1.75rem',
        fontWeight: '600',
        borderBottom: '2px solid #007AFF',
        marginBottom: '1.5rem'
      },
      h3: {
        color: '#1e293b',
        fontSize: '1.5rem',
        fontWeight: '600',
        marginBottom: '1rem'
      },
      paragraph: {
        color: '#475569',
        fontSize: '1rem',
        lineHeight: '1.75',
        marginBottom: '1rem'
      },
      list: {
        color: '#475569',
        markerColor: '#007AFF',
        marginBottom: '1rem',
        paddingLeft: '1.5rem'
      },
      blockquote: {
        color: '#64748b',
        backgroundColor: '#f1f5f9',
        borderLeft: '4px solid #007AFF',
        padding: '1rem 1.5rem',
        margin: '1rem 0',
        fontStyle: 'italic'
      }
    },
    contentLayout: {
      maxWidth: '800px',
      align: 'left',
      padding: '0 1rem',
      margin: '0 auto'
    },
    decorations: {
      borderPattern: 'solid',
      backgroundPattern: 'none',
      dividerStyle: 'border-t border-gray-200 my-8'
    },
    customStyles: {}
  }
};

// 获取章节主题
export function getChapterTheme(chapterSlug: string): ChapterTheme {
  return chapterThemes[chapterSlug] || chapterThemes.default;
}

// 生成主题样式类名
export function generateThemeClasses(theme: ChapterTheme): Record<string, any> {
  return {
    // 容器样式
    container: `bg-${theme.backgroundColor.replace('#', '')} text-${theme.textColor.replace('#', '')}`,
    
    // 卡片样式
    card: `bg-${theme.cardBackgroundColor.replace('#', '')} border-${theme.borderColor.replace('#', '')} ${getCardVariantClass(theme.cardVariant)}`,
    
    // 标题样式
    heading: `text-${theme.headingColor.replace('#', '')}`,
    
    // 文本样式
    text: `text-${theme.textColor.replace('#', '')}`,
    textSecondary: `text-${theme.textSecondaryColor.replace('#', '')}`,
    
    // 按钮样式
    button: `bg-${theme.primaryColor.replace('#', '')} text-white hover:bg-${theme.secondaryColor.replace('#', '')}`,
    
    // 强调样式
    accent: `text-${theme.accentColor.replace('#', '')}`,
    
    // 阴影样式
    shadow: theme.shadow,
    shadowHover: theme.shadowHover,
    
    // 内容样式
    content: {
      h2: theme.contentStyles?.h2 ? `text-${theme.contentStyles.h2.color?.replace('#', '')} text-${theme.contentStyles.h2.fontSize} font-${theme.contentStyles.h2.fontWeight} border-b-2 border-${theme.contentStyles.h2.borderColor?.replace('#', '')} mb-${theme.contentStyles.h2.marginBottom}` : `text-${theme.primaryColor.replace('#', '')} text-2xl font-semibold border-b-2 border-${theme.primaryColor.replace('#', '')} mb-6`,
      h3: theme.contentStyles?.h3 ? `text-${theme.contentStyles.h3.color?.replace('#', '')} text-${theme.contentStyles.h3.fontSize} font-${theme.contentStyles.h3.fontWeight} mb-${theme.contentStyles.h3.marginBottom}` : `text-${theme.headingColor.replace('#', '')} text-xl font-semibold mb-4`,
      paragraph: theme.contentStyles?.paragraph ? `text-${theme.contentStyles.paragraph.color?.replace('#', '')} text-${theme.contentStyles.paragraph.fontSize} leading-${theme.contentStyles.paragraph.lineHeight} mb-${theme.contentStyles.paragraph.marginBottom}` : `text-${theme.textColor.replace('#', '')} leading-relaxed mb-4`,
      blockquote: theme.contentStyles?.blockquote ? `text-${theme.contentStyles.blockquote.color?.replace('#', '')} bg-${theme.contentStyles.blockquote.backgroundColor?.replace('#', '')} border-l-4 border-${theme.contentStyles.blockquote.borderLeft?.split(' ')[2]?.replace('#', '')} p-${theme.contentStyles.blockquote.padding?.split(' ')[1]} my-${theme.contentStyles.blockquote.margin?.split(' ')[1]} italic` : `text-${theme.textSecondaryColor.replace('#', '')} bg-gray-50 border-l-4 border-${theme.primaryColor.replace('#', '')} p-4 my-4 italic`
    },
    
    // 布局样式
    layout: {
      maxWidth: theme.contentLayout?.maxWidth || 'max-w-4xl',
      align: theme.contentLayout?.align || 'text-left',
      padding: theme.contentLayout?.padding || 'px-4',
      margin: theme.contentLayout?.margin || 'mx-auto'
    }
  };
}

// 获取卡片变体类名
function getCardVariantClass(variant: string): string {
  switch (variant) {
    case 'rounded':
      return 'rounded-2xl';
    case 'outlined':
      return 'border-2';
    case 'shadowed':
      return 'shadow-lg';
    case 'gradient':
      return 'bg-gradient-to-r';
    default:
      return 'rounded-lg';
  }
}
