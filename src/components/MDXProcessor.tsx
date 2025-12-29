'use client';

import { ReactNode, useEffect, useState } from 'react';
import { processMDXContent } from '@/lib/mdxProcessor';

interface MDXProcessorProps {
  source: string;
  components?: any;
}

// MDX处理器，用于在渲染前处理内容
export function MDXProcessor({ source, components }: MDXProcessorProps) {
  const [processedContent, setProcessedContent] = useState<ReactNode>(null);

  useEffect(() => {
    // 处理MDX内容
    const content = processMDXContent(source, components);
    setProcessedContent(<>{content}</>);
  }, [source, components]);

  return <>{processedContent}</>;
}