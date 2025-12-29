'use client';

import { ChapterTemplate } from '@/components/templates/ChapterTemplate';
import { MDXRemote } from 'next-mdx-remote/rsc';
import { MathFormula, CrystalStructure, FermiDistribution } from '@/components/interactive';
import { MDXPostProcessor } from '@/components/MDXPostProcessor';
import { ReactNode, useEffect, useState } from 'react';

// MDX组件映射
const mdxComponents = {
  MathFormula,
  CrystalStructure,
  FermiDistribution,
};

// PrefacePage组件 - 客户端组件用于处理交互
export function PrefacePageClient({ chapterData }: { chapterData: any }) {
  const [processedContent, setProcessedContent] = useState<ReactNode>(null);

  useEffect(() => {
    // 处理MDX内容，将特定标题下的内容包装到对应的组件中
    const processContent = () => {
      return (
        <MDXPostProcessor>
          <MDXRemote 
            source={chapterData.mdxSource} 
            components={mdxComponents}
          />
        </MDXPostProcessor>
      );
    };

    setProcessedContent(processContent());
  }, [chapterData.mdxSource]);

  // 为ChapterTemplate提供默认值
  const defaultProps = {
    openingLine: chapterData.metadata.openingLine || "欢迎来到半导体的世界",
    mainContent: [], // 空数组，因为我们使用MDX内容
    logicalChain: chapterData.metadata.logicalChain || "从序言开始，逐步探索半导体的奥秘",
    chapterSummary: chapterData.metadata.chapterSummary || "本章介绍了半导体技术的基础知识",
    nextChapterPreview: chapterData.metadata.nextChapterPreview || "下一章将深入探讨半导体物理",
    sectMentality: {
      overview: chapterData.metadata.sectMentality?.overview || "半导体技术的核心理念",
      breakthrough: chapterData.metadata.sectMentality?.breakthrough || ["技术创新", "理论突破"],
      corePrinciple: chapterData.metadata.sectMentality?.corePrinciple || "理论与实践相结合"
    }
  };

  return (
    <ChapterTemplate
      title={chapterData.metadata.title}
      chapterNumber={`CH.${chapterData.metadata.chapterNumber.toString().padStart(2, '0')}`}
      logicalPosition={chapterData.metadata.logicalPosition || "序章：硅基文明的起源"}
      objectives={chapterData.metadata.objectives || []}
      coreContent={chapterData.metadata.coreContent || []}
      keywords={chapterData.metadata.keywords || []}
      prerequisitePrompt={chapterData.metadata.prerequisitePrompt || ""}
      openingLine={defaultProps.openingLine}
      mainContent={defaultProps.mainContent}
      logicalChain={defaultProps.logicalChain}
      chapterSummary={defaultProps.chapterSummary}
      nextChapterPreview={defaultProps.nextChapterPreview}
      sectMentality={defaultProps.sectMentality}
    >
      {processedContent}
    </ChapterTemplate>
  );
}