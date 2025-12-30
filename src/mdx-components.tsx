import type { MDXComponents } from 'mdx/types';
import { MathFormula } from '@/components/math/MathFormula';
// import { CrystalStructure } from '@/components/interactive/CrystalStructure';
// import { FermiDistribution } from '@/components/interactive/FermiDistribution';
// import { InteractiveSimulator } from '@/components/templates/InteractiveSimulator';
import {
  LogicalPosition,
  ChapterObjectives,
  CoreContent,
  Keywords,
  PrerequisitePrompt,
  OpeningLine
} from '@/components/sections';

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    // 覆盖默认HTML元素
    h1: ({ children }) => <h1 className="text-3xl font-bold mt-8 mb-4">{children}</h1>,
    h2: ({ children, ...props }) => {
      const title = typeof children === 'string' ? children : '';
      
      // 自动识别特定标题并应用对应组件
      // 这些组件需要通过MDX结构来接收内容，而不是直接替换标题
      // 所以我们返回带有特殊标识的标题，然后在MDX处理流程中处理
      if (title === '本章逻辑位') {
        return <h2 className="text-2xl font-semibold mt-6 mb-3 text-blue-900" {...props}>{children}</h2>;
      }
      if (title === '章节目标') {
        return <h2 className="text-2xl font-semibold mt-6 mb-3 text-green-900" {...props}>{children}</h2>;
      }
      if (title === '核心内容') {
        return <h2 className="text-2xl font-semibold mt-6 mb-3 text-amber-900" {...props}>{children}</h2>;
      }
      if (title === '关键词') {
        return <h2 className="text-2xl font-semibold mt-6 mb-3 text-purple-900" {...props}>{children}</h2>;
      }
      if (title === '前置认知提示') {
        return <h2 className="text-2xl font-semibold mt-6 mb-3 text-gray-900" {...props}>{children}</h2>;
      }
      if (title === '起手式') {
        return <h2 className="text-2xl font-semibold mt-6 mb-3 text-indigo-900" {...props}>{children}</h2>;
      }
      
      // 默认标题样式
      return <h2 className="text-2xl font-semibold mt-6 mb-3" {...props}>{children}</h2>;
    },
    h3: ({ children, ...props }) => (
      <h3 className="text-xl font-medium mt-4 mb-2" {...props}>{children}</h3>
    ),
    p: ({ children }) => <p className="mb-4 leading-7">{children}</p>,
    ul: ({ children }) => <ul className="list-disc pl-6 mb-4 space-y-1">{children}</ul>,
    ol: ({ children }) => <ol className="list-decimal pl-6 mb-4 space-y-1">{children}</ol>,
    li: ({ children }) => <li>{children}</li>,
    strong: ({ children }) => <strong className="font-semibold">{children}</strong>,
    em: ({ children }) => <em className="italic">{children}</em>,
    code: ({ children }) => <code className="bg-gray-100 px-1 py-0.5 rounded text-sm">{children}</code>,
    pre: ({ children }) => <pre className="bg-gray-100 p-4 rounded-md overflow-x-auto mb-4">{children}</pre>,
    blockquote: ({ children }) => (
      <blockquote className="border-l-4 border-gray-300 pl-4 italic my-4">{children}</blockquote>
    ),
    
    // 添加自定义组件
    MathFormula,
    // CrystalStructure,
    // FermiDistribution,
    // InteractiveSimulator,
    LogicalPosition,
    ChapterObjectives,
    CoreContent,
    Keywords,
    PrerequisitePrompt,
    OpeningLine,
    ...components,
  };
}