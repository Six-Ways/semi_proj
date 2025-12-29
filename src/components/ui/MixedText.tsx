'use client';

import React from 'react';
import { processMixedText } from '@/utils/textSpacing';

interface MixedTextProps {
  children: React.ReactNode;
  className?: string;
  markTerms?: boolean;
  as?: React.ElementType;
  'aria-label'?: string;
  'aria-describedby'?: string;
  role?: string;
  tabIndex?: number;
  onKeyDown?: (event: React.KeyboardEvent) => void;
}

/**
 * 中英文混排文本组件
 * 自动处理中英文之间的间距，提升可读性
 */
export const MixedText: React.FC<MixedTextProps> = ({ 
  children, 
  className = '', 
  markTerms = true,
  as: Component = 'span',
  'aria-label': ariaLabel,
  'aria-describedby': ariaDescribedBy,
  role: roleProp,
  tabIndex,
  onKeyDown
}) => {
  // 获取文本内容
  const getTextContent = (node: React.ReactNode): string => {
    if (typeof node === 'string') return node;
    if (typeof node === 'number') return node.toString();
    if (typeof node === 'boolean') return '';
    if (node === null || node === undefined) return '';
    
    if (Array.isArray(node)) {
      return node.map(getTextContent).join('');
    }
    
    if (React.isValidElement(node)) {
      return getTextContent((node.props as any).children);
    }
    
    return '';
  };

  const textContent = getTextContent(children);
  const processedHtml = markTerms 
    ? processMixedText(textContent, className)
    : `<span class="text-mixed ${className}">${textContent}</span>`;

  // 构建无障碍属性
  const accessibilityProps: React.HTMLAttributes<HTMLElement> = {};
  
  if (ariaLabel) accessibilityProps['aria-label'] = ariaLabel;
  if (ariaDescribedBy) accessibilityProps['aria-describedby'] = ariaDescribedBy;
  if (roleProp) accessibilityProps.role = roleProp;
  if (tabIndex !== undefined) accessibilityProps.tabIndex = tabIndex;
  if (onKeyDown) accessibilityProps.onKeyDown = onKeyDown;

  return React.createElement(
    Component,
    {
      dangerouslySetInnerHTML: { __html: processedHtml },
      className: `text-mixed ${className}`,
      ...accessibilityProps
    }
  );
};

/**
 * 段落组件，自动处理中英文混排
 */
export const MixedParagraph: React.FC<{
  children: React.ReactNode, 
  className?: string,
  id?: string,
  'aria-label'?: string,
  'aria-describedby'?: string,
  tabIndex?: number
}> = ({ 
  children, 
  className = '',
  id,
  'aria-label': ariaLabel,
  'aria-describedby': ariaDescribedBy,
  tabIndex
}) => {
  return (
    <p 
      id={id}
      className={`text-mixed ${className}`}
      aria-label={ariaLabel}
      aria-describedby={ariaDescribedBy}
      tabIndex={tabIndex}
    >
      <MixedText>{children}</MixedText>
    </p>
  );
};

/**
 * 标题组件，自动处理中英文混排
 */
export const MixedHeading: React.FC<{
  children: React.ReactNode, 
  level: 1 | 2 | 3 | 4 | 5 | 6,
  className?: string,
  id?: string,
  'aria-label'?: string,
  'aria-describedby'?: string,
  tabIndex?: number
}> = ({ 
  children, 
  level, 
  className = '',
  id,
  'aria-label': ariaLabel,
  'aria-describedby': ariaDescribedBy,
  tabIndex
}) => {
  const headingClasses = {
    1: 'text-3xl md:text-4xl',
    2: 'text-2xl md:text-3xl',
    3: 'text-xl md:text-2xl',
    4: 'text-lg md:text-xl',
    5: 'text-base md:text-lg',
    6: 'text-sm md:text-base'
  };

  const HeadingTag = `h${level}` as 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';

  return React.createElement(
    HeadingTag,
    {
      id: id,
      className: `font-serif ${headingClasses[level]} ${className}`,
      'aria-label': ariaLabel,
      'aria-describedby': ariaDescribedBy,
      tabIndex: tabIndex
    },
    <MixedText>{children}</MixedText>
  );
};

export default MixedText;