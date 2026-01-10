'use client';

import React, { ReactNode, useState, useEffect, createContext, useContext } from 'react';
import dynamic from 'next/dynamic';
import { ChapterTheme } from '@/lib/chapterThemes';
import { ContentBlock, analyzeContent } from '@/lib/contentAnalyzer';
import { getComponentMappingForBlock, getChapterConfig } from '@/lib/contentMapping';

// 章节配置上下文
interface ChapterConfigContextType {
  config: any;
  loading: boolean;
  error: Error | null;
}

const ChapterConfigContext = createContext<ChapterConfigContextType>({
  config: null,
  loading: true,
  error: null
});

// 预定义的动态组件映射，使用顶层dynamic()函数
const DynamicComponents: Record<string, React.ComponentType<any>> = {
  SemiconductorHistoryModule: dynamic(() => import('@/components/custom/SemiconductorHistoryModule').then(mod => {
    return mod.SemiconductorHistoryModule;
  }), {
    loading: () => <div className="p-4 text-gray-500">加载组件中...</div>,
    ssr: true
  }),
  ScaleDownChallengeBentoModule: dynamic(() => import('@/components/custom/ScaleDownChallengeBentoModule'), {
    loading: () => <div className="p-4 text-gray-500">加载组件中...</div>,
    ssr: true
  }),
  PostMooreEraModule: dynamic(() => import('@/components/custom/PostMooreEraModule').then(mod => {
    return mod.PostMooreEraModule;
  }), {
    loading: () => <div className="p-4 text-gray-500">加载组件中...</div>,
    ssr: true
  })
};

// 默认内容组件，用于处理未找到的组件
const DefaultContentModule = (props: any) => {
  return <div className="bg-white p-6 rounded-lg shadow-sm text-gray-600">未找到对应的组件</div>;
};

// 动态组件加载函数，支持从章节配置中获取组件路径
const loadDynamicComponent = async (
  componentName: string, 
  componentRegistry: Record<string, any>
): Promise<React.ComponentType<any> | null> => {
  try {
    // 只从预定义映射中获取组件
    if (DynamicComponents[componentName]) {
      return DynamicComponents[componentName];
    }
    
    // 对于未在预定义映射中的组件，返回null，不渲染
    return null;
  } catch (error) {
    console.error(`❌ Failed to load component ${componentName}:`, error);
    return null;
  }
};

// 定义组件props接口
export interface SectionComponentProps {
  content: string;
  theme: ChapterTheme;
  [key: string]: any; // 允许自定义props
}

// 定义节类型
export interface Section {
  title: string;
  content: string;
  component: string;
  props?: Record<string, any>;
  chapterSlug?: string; // 添加章节slug，用于获取章节配置
}

// 渲染内容块 - 简化版本，只使用默认渲染，不添加额外容器
async function renderContentBlock(block: ContentBlock, theme: ChapterTheme, chapterSlug: string): Promise<ReactNode> {
  try {
    // 特殊处理组件类型的内容块
    if (block.type === 'component') {
      return await renderComponentBlock(block, theme, chapterSlug);
    }
    
    // 直接使用默认渲染，不使用内容映射系统，避免添加额外容器
    return renderDefaultContent(block, theme);
  } catch (error) {
    console.error(`❌ Error in renderContentBlock:`, error);
    return renderDefaultContent(block, theme);
  }
}

// 渲染组件块
async function renderComponentBlock(block: ContentBlock, theme: ChapterTheme, chapterSlug: string): Promise<ReactNode> {
  if (!block.componentName) {
    return <div className="text-red-600">组件名称缺失</div>;
  }
  
  try {
    // 检查组件是否在预定义的DynamicComponents映射中
    if (DynamicComponents[block.componentName]) {
      const Component = DynamicComponents[block.componentName];
      // 合并组件属性
      const componentProps = {
        ...block.componentProps,
        theme,
        chapterSlug
      };
      
      return <Component {...componentProps} />;
    } else {
      // 如果组件不在预定义映射中，不渲染任何内容，避免显示"组件未找到"的提示
      return null;
    }
  } catch (error) {
    console.error(`❌ Failed to render component ${block.componentName}:`, error);
    return null;
  }
}

// 默认内容渲染
function renderDefaultContent(block: ContentBlock, theme: ChapterTheme): ReactNode {
  const { content, type, level = 2 } = block;
  
  switch (type) {
    case 'heading':
      const headingClassName = `
        font-serif 
        ${level === 1 ? `text-[${theme.headingColor}] text-3xl font-bold mb-8` : 
         level === 2 ? `text-[${theme.primaryColor}] text-2xl font-semibold border-b-2 border-[${theme.primaryColor}] mb-6` :
         level === 3 ? `text-[${theme.headingColor}] text-xl font-semibold mb-4` :
         `text-[${theme.textColor}] text-lg font-medium mb-3`}
      `;
      
      return React.createElement(
        `h${level}`,
        { className: headingClassName },
        content
      );
      
    case 'paragraph':
      return (
        <p className={`
          mb-${theme.contentStyles?.paragraph?.marginBottom || '4'} 
          text-[${theme.contentStyles?.paragraph?.color || theme.textColor}] 
          text-${theme.contentStyles?.paragraph?.fontSize || 'base'} 
          leading-${theme.contentStyles?.paragraph?.lineHeight || 'relaxed'}
        `}>
          {content}
        </p>
      );
      
    case 'list':
      const isOrdered = content.trim().startsWith('1. ');
      const listItems = content.split('\n').filter(item => item.trim());
      const listClassName = `
        ${isOrdered ? 'list-decimal' : 'list-disc'} 
        list-inside 
        mb-${theme.contentStyles?.list?.marginBottom || '4'} 
        space-y-2 
        pl-${theme.contentStyles?.list?.paddingLeft || '0'}
      `;
      
      return React.createElement(
        isOrdered ? 'ol' : 'ul',
        { className: listClassName },
        listItems.map((item, index) => React.createElement(
          'li',
          { 
            key: index, 
            className: `text-[${theme.contentStyles?.list?.color || theme.textColor}]`
          },
          item.replace(isOrdered ? /^\d+\s*\.\s*/ : /^[-*+]\s*/, '').trim()
        ))
      );
      
    case 'blockquote':
      return (
        <blockquote className={`
          border-l-4 
          border-[${theme.primaryColor}] 
          pl-${theme.contentStyles?.blockquote?.padding?.split(' ')[1] || '4'} 
          py-${theme.contentStyles?.blockquote?.padding?.split(' ')[0] || '2'} 
          my-${theme.contentStyles?.blockquote?.margin || '4'} 
          italic 
          text-[${theme.contentStyles?.blockquote?.color || theme.textSecondaryColor}] 
          bg-[${theme.contentStyles?.blockquote?.backgroundColor || 'transparent'}]
        `}>
          {content.replace(/^>\s*/gm, '')}
        </blockquote>
      );
      
    case 'code':
      return (
        <pre className={`
          bg-[${theme.contentStyles?.codeBlock?.backgroundColor || '#f3f4f6'}] 
          text-[${theme.contentStyles?.codeBlock?.color || '#1f2937'}] 
          p-${theme.contentStyles?.codeBlock?.padding || '4'} 
          rounded-${theme.contentStyles?.codeBlock?.borderRadius || 'md'} 
          overflow-x-auto 
          mb-${theme.contentStyles?.codeBlock?.marginBottom || '4'} 
          text-${theme.contentStyles?.codeBlock?.fontSize || 'sm'}
        `}>
          <code>{content.replace(/^```[\w]*\n|```$/g, '')}</code>
        </pre>
      );
      
    case 'formula':
      return (
        <div className={`
          text-center 
          my-${theme.contentStyles?.formula?.margin || '6'} 
          text-[${theme.contentStyles?.formula?.color || theme.textColor}] 
          text-${theme.contentStyles?.formula?.fontSize || 'lg'}
        `}>
          {content.replace(/^\$\$|\$\$/g, '')}
        </div>
      );
      
    case 'component':
      // 组件类型由renderContentBlock单独处理
      return null;
      
    default:
      return (
        <div className={`
          mb-${theme.contentStyles?.paragraph?.marginBottom || '4'} 
          text-[${theme.contentStyles?.paragraph?.color || theme.textColor}]
        `}>
          {content}
        </div>
      );
  }
}

// 内容块渲染组件 - 用于处理异步渲染
function ContentBlockRenderer({ 
  block, 
  theme, 
  chapterSlug 
}: { 
  block: ContentBlock; 
  theme: ChapterTheme; 
  chapterSlug: string;
}) {
  const [renderedContent, setRenderedContent] = useState<ReactNode>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function render() {
      try {
        setIsLoading(true);
        setError(null);
        const content = await renderContentBlock(block, theme, chapterSlug);
        setRenderedContent(content);
      } catch (error) {
        console.error(`❌ ContentBlockRenderer error:`, error);
        setError(error instanceof Error ? error : new Error('渲染失败'));
        setRenderedContent(renderDefaultContent(block, theme));
      } finally {
        setIsLoading(false);
      }
    }

    render();
  }, [block, theme, chapterSlug]);

  if (isLoading) {
    return <div className="mb-8 text-gray-500">加载内容中...</div>;
  }

  if (error) {
    return (
      <div className="mb-8 p-4 bg-red-50 border border-red-200 rounded-md">
        <p className="text-red-600">内容渲染出现问题，已自动恢复默认显示</p>
        {renderDefaultContent(block, theme)}
      </div>
    );
  }

  return renderedContent;
}

// 章节配置提供者组件
function ChapterConfigProvider({ 
  children, 
  chapterSlug 
}: { 
  children: ReactNode; 
  chapterSlug: string;
}) {
  const [config, setConfig] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function loadConfig() {
      try {
        setLoading(true);
        setError(null);
        const loadedConfig = await getChapterConfig(chapterSlug);
        setConfig(loadedConfig);
      } catch (err) {
        const error = err instanceof Error ? err : new Error('加载配置失败');
        setError(error);
        console.error('❌ Failed to load chapter config:', error);
      } finally {
        setLoading(false);
      }
    }

    loadConfig();
  }, [chapterSlug]);

  return (
    <ChapterConfigContext.Provider value={{ config, loading, error }}>
      {children}
    </ChapterConfigContext.Provider>
  );
}

// 为每个二级标题组件创建对应的组件
const LogicalPosition = ({ content, title, theme }: SectionComponentProps) => {
  return (
    <div className="mb-8 bg-white border-2 border-gray-200 rounded-2xl p-8 shadow-sm hover:shadow-md transition-shadow">
      <div className="mb-6">
        <h2 className="text-3xl font-semibold mb-3 text-gray-900 leading-tight">{title}</h2>
        <div className="h-1 w-24 bg-gradient-to-r from-[#007AFF] to-[#60A5FA] rounded-full"></div>
      </div>
      <div className="prose prose-lg max-w-none font-serif text-gray-600 leading-relaxed">
        <div className="text-justify">{content}</div>
      </div>
    </div>
  );
};

const Keywords = ({ content, title, theme }: SectionComponentProps) => {
  const keywords = content.split(',').map(keyword => keyword.trim()).filter(Boolean);
  return (
    <div className="mb-8 bg-white border-2 border-gray-200 rounded-2xl p-8 shadow-sm hover:shadow-md transition-shadow">
      <div className="mb-6">
        <h2 className="text-3xl font-semibold mb-3 text-gray-900 leading-tight">{title}</h2>
        <div className="h-1 w-24 bg-gradient-to-r from-[#007AFF] to-[#60A5FA] rounded-full"></div>
      </div>
      <div className="flex flex-wrap gap-3">
        {keywords.map((keyword, index) => (
          <span key={index} className="px-4 py-2 bg-[#007AFF]-10 text-[#007AFF] rounded-full text-sm font-medium border border-[#007AFF]-200 hover:border-[#007AFF] transition-colors">
            {keyword}
          </span>
        ))}
      </div>
    </div>
  );
};

const PrerequisitePrompt = ({ content, title, theme }: SectionComponentProps) => {
  return (
    <div className="mb-8 bg-white border-2 border-gray-200 rounded-2xl p-8 shadow-sm hover:shadow-md transition-shadow">
      <div className="mb-6">
        <h2 className="text-3xl font-semibold mb-3 text-gray-900 leading-tight">{title}</h2>
        <div className="h-1 w-24 bg-gradient-to-r from-[#007AFF] to-[#60A5FA] rounded-full"></div>
      </div>
      <div className="bg-gradient-to-r from-[#007AFF]-50 to-[#60A5FA]-50 border-l-4 border-[#007AFF] p-5 rounded-r-xl">
        <div className="flex items-start">
          <div className="text-[#007AFF] mr-3 mt-1">ℹ️</div>
          <div className="text-gray-700 text-justify">{content}</div>
        </div>
      </div>
    </div>
  );
};

const OpeningLine = ({ content, title, theme }: SectionComponentProps) => {
  return (
    <div className="mb-8 bg-white border-2 border-gray-200 rounded-2xl p-8 shadow-sm hover:shadow-md transition-shadow">
      <div className="mb-6">
        <h2 className="text-3xl font-semibold mb-3 text-gray-900 leading-tight">{title}</h2>
        <div className="h-1 w-24 bg-gradient-to-r from-[#007AFF] to-[#60A5FA] rounded-full"></div>
      </div>
      <blockquote className="italic text-lg leading-relaxed font-serif text-gray-600 bg-gradient-to-r from-[#007AFF]-50 to-[#60A5FA]-50 border-l-4 border-[#007AFF] p-5 rounded-r-xl">
        {content}
      </blockquote>
    </div>
  );
};

const SeekKnowledgeModule = ({ content, title, theme }: SectionComponentProps) => {
  return (
    <div className="mb-8 bg-white border-2 border-gray-200 rounded-2xl p-8 shadow-sm hover:shadow-md transition-shadow">
      <div className="mb-6">
        <h2 className="text-3xl font-semibold mb-3 text-gray-900 leading-tight">{title}</h2>
        <div className="h-1 w-24 bg-gradient-to-r from-[#007AFF] to-[#60A5FA] rounded-full"></div>
      </div>
      <h3 className="text-xl font-serif font-semibold mb-4 text-gray-900">上下求索</h3>
      <ul className="space-y-3 text-gray-700 leading-relaxed">
        {content.split('\n').filter(line => line.trim()).map((item, index) => (
          <li key={index} className="flex items-start">
            <span className="mr-3 text-[#007AFF] font-bold">•</span>
            <span className="text-justify">{item.replace(/^-\s*/, '')}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

const ChapterSummary = ({ content, title, theme }: SectionComponentProps) => {
  return (
    <div className="mb-8 bg-white border-2 border-gray-200 rounded-2xl p-8 shadow-sm hover:shadow-md transition-shadow">
      <div className="mb-6">
        <h2 className="text-3xl font-semibold mb-3 text-gray-900 leading-tight">{title}</h2>
        <div className="h-1 w-24 bg-gradient-to-r from-[#007AFF] to-[#60A5FA] rounded-full"></div>
      </div>
      <div className="prose prose-lg max-w-none font-serif text-gray-600 leading-relaxed">
        <div className="text-justify">{content}</div>
      </div>
    </div>
  );
};

const LogicalChain = ({ content, title, theme }: SectionComponentProps) => {
  return (
    <div className="mb-8 bg-white border-2 border-gray-200 rounded-2xl p-8 shadow-sm hover:shadow-md transition-shadow">
      <div className="mb-6">
        <h2 className="text-3xl font-semibold mb-3 text-gray-900 leading-tight">{title}</h2>
        <div className="h-1 w-24 bg-gradient-to-r from-[#007AFF] to-[#60A5FA] rounded-full"></div>
      </div>
      <div className="prose prose-lg max-w-none font-serif text-gray-600 leading-relaxed">
        <div className="text-justify">{content}</div>
      </div>
    </div>
  );
};

const NextChapterPreview = ({ content, title, theme }: SectionComponentProps) => {
  return (
    <div className="mb-8 bg-white border-2 border-gray-200 rounded-2xl p-8 shadow-sm hover:shadow-md transition-shadow">
      <div className="mb-6">
        <h2 className="text-3xl font-semibold mb-3 text-gray-900 leading-tight">{title}</h2>
        <div className="h-1 w-24 bg-gradient-to-r from-[#007AFF] to-[#60A5FA] rounded-full"></div>
      </div>
      <div className="prose prose-lg max-w-none font-serif text-gray-600 leading-relaxed italic">
        <div className="text-justify">{content}</div>
      </div>
    </div>
  );
};

const SectMentality = ({ content, title, theme }: SectionComponentProps) => {
  return (
    <div className="mb-8 bg-white border-2 border-gray-200 rounded-2xl p-8 shadow-sm hover:shadow-md transition-shadow">
      <div className="mb-6">
        <h2 className="text-3xl font-semibold mb-3 text-gray-900 leading-tight">{title}</h2>
        <div className="h-1 w-24 bg-gradient-to-r from-[#007AFF] to-[#60A5FA] rounded-full"></div>
      </div>
      <div className="prose prose-lg max-w-none font-serif text-gray-600 leading-relaxed">
        <div className="text-justify">{content}</div>
      </div>
    </div>
  );
};

const MainContentStart = ({ content, title, theme, chapterSlug }: SectionComponentProps) => {
  const contentBlocks = analyzeContent(content);
  return (
    <div className="mb-8 bg-white border-2 border-gray-200 rounded-2xl p-8 shadow-sm hover:shadow-md transition-shadow">
      <div className="mb-6">
        <h2 className="text-3xl font-semibold mb-3 text-gray-900 leading-tight">{title}</h2>
        <div className="h-1 w-24 bg-gradient-to-r from-[#007AFF] to-[#60A5FA] rounded-full"></div>
      </div>
      <div className="prose prose-lg max-w-none font-serif text-gray-600 leading-relaxed">
        {contentBlocks.map((block) => (
          <ContentBlockRenderer 
            key={block.id} 
            block={block} 
            theme={theme} 
            chapterSlug={chapterSlug} 
          />
        ))}
      </div>
    </div>
  );
};

// 章节标题组件
const ChapterTitle = ({ content, title, theme, metadata }: SectionComponentProps & { metadata?: any }) => {
  // 从metadata中获取chapterNumber，如果没有则从slug中提取
  const chapterNumber = metadata?.chapterNumber || '00';
  return (
    <div className="mb-8 text-center bg-white border-2 border-gray-200 rounded-2xl p-8 shadow-sm hover:shadow-md transition-shadow">
      <div className="inline-block px-6 py-3 bg-[#007AFF]/10 text-[#007AFF] rounded-full text-lg font-medium mb-6">
        CH.{chapterNumber.padStart(2, '0')}
      </div>
      <h1 className="text-5xl font-serif font-bold mb-4 text-gray-900">
        {title}
      </h1>
    </div>
  );
};

// 组件映射
const sectionComponentMap: Record<string, React.ComponentType<SectionComponentProps>> = {
  ChapterTitle,
  LogicalPosition,
  Keywords,
  PrerequisitePrompt,
  OpeningLine,
  SeekKnowledgeModule,
  ChapterSummary,
  LogicalChain,
  NextChapterPreview,
  SectMentality,
  MainContentStart
};

// 处理MDX内容并返回React节点
export function MDXContentRenderer({ sections, theme, chapterSlug = 'default', metadata }: { 
  sections: Section[];
  theme: ChapterTheme;
  chapterSlug?: string;
  metadata?: any;
}) {
  if (!sections || sections.length === 0) {
    return <div className={`text-[${theme.textColor}]`}>没有找到内容</div>;
  }
  
  return (
    <ChapterConfigProvider chapterSlug={chapterSlug}>
      <div className="mdx-content prose max-w-none bg-[#f8fafc] py-8">
        {sections.map((section, index) => {
          // 获取当前section对应的组件
          const Component = sectionComponentMap[section.component] || DefaultContentModule;
          
          // 渲染组件
          return (
            <Component 
              key={index} 
              content={section.content} 
              title={section.title} 
              theme={theme} 
              chapterSlug={chapterSlug} 
              metadata={metadata} 
              {...section.props} 
            />
          );
        })}
      </div>
    </ChapterConfigProvider>
  );
}