'use client';

import React from 'react';
import { createSkipLinkProps, generateId } from '@/utils/accessibility';

interface SkipLinkProps {
  targetId?: string;
  children?: React.ReactNode;
  className?: string;
}

/**
 * 跳转链接组件，帮助键盘用户快速导航到主要内容
 */
export function SkipLink({ 
  targetId = 'main-content', 
  children = '跳转到主要内容',
  className = ''
}: SkipLinkProps) {
  const skipLinkProps = createSkipLinkProps(targetId);
  
  return (
    <a
      {...skipLinkProps}
      className={`sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-blue-600 text-white px-4 py-2 rounded z-50 ${className}`}
    >
      {children}
    </a>
  );
}

interface SkipLinksProps {
  links: Array<{
    id: string;
    label: string;
  }>;
  className?: string;
}

/**
 * 多个跳转链接组件
 */
export function SkipLinks({ links, className = '' }: SkipLinksProps) {
  return (
    <div className={`sr-only focus-within:not-sr-only focus-within:absolute focus-within:top-4 focus-within:left-4 focus-within:z-50 focus-within:flex focus-within:flex-col focus-within:gap-2 ${className}`}>
      {links.map((link) => (
        <SkipLink
          key={link.id}
          targetId={link.id}
          children={link.label}
        />
      ))}
    </div>
  );
}

/**
 * 默认的跳转链接集合，包含常见的页面区域
 */
export function DefaultSkipLinks() {
  const defaultLinks = [
    { id: 'main-content', label: '跳转到主要内容' },
    { id: 'navigation', label: '跳转到导航' },
    { id: 'chapter-index', label: '跳转到章节索引' },
    { id: 'search', label: '跳转到搜索' },
    { id: 'footer', label: '跳转到页脚' }
  ];
  
  return <SkipLinks links={defaultLinks} />;
}