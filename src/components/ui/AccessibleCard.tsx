'use client';

import React, { forwardRef } from 'react';
import { cn } from '@/lib/utils';
import { useFocusManagement, useScreenReaderAnnouncement, generateId } from '@/utils/accessibility';

interface AccessibleCardProps extends React.HTMLAttributes<HTMLDivElement> {
  interactive?: boolean;
  selected?: boolean;
  expanded?: boolean;
  level?: number;
  heading?: React.ReactNode;
  headingLevel?: 1 | 2 | 3 | 4 | 5 | 6;
  description?: string;
  announceSelection?: boolean;
  selectionAnnouncement?: string;
  onSelectionChange?: (selected: boolean) => void;
  onExpansionToggle?: (expanded: boolean) => void;
}

const AccessibleCard = forwardRef<HTMLDivElement, AccessibleCardProps>(
  (
    {
      className,
      children,
      interactive = false,
      selected = false,
      expanded = false,
      level,
      heading,
      headingLevel = 3,
      description,
      announceSelection = false,
      selectionAnnouncement,
      onSelectionChange,
      onExpansionToggle,
      onClick,
      onKeyDown,
      id,
      ...props
    },
    ref
  ) => {
    const { isFocused, handleFocus, handleBlur, setFocus } = useFocusManagement();
    const { announce, AnnouncementComponent } = useScreenReaderAnnouncement();
    
    const cardId = id || generateId('card');
    const headingId = heading ? generateId('heading') : undefined;
    const descriptionId = description ? generateId('description') : undefined;

    const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
      if (interactive) {
        if (onSelectionChange) {
          onSelectionChange(!selected);
        }
        
        if (announceSelection && selectionAnnouncement) {
          announce(selected ? `已取消选择：${selectionAnnouncement}` : `已选择：${selectionAnnouncement}`);
        }
      }
      
      if (onClick) {
        onClick(e);
      }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
      if (onKeyDown) {
        onKeyDown(e);
      }
      
      if (interactive) {
        // 处理空格键和回车键，模拟按钮行为
        if (e.key === ' ' || e.key === 'Enter') {
          e.preventDefault();
          if (onSelectionChange) {
            onSelectionChange(!selected);
          }
          
          if (announceSelection && selectionAnnouncement) {
            announce(selected ? `已取消选择：${selectionAnnouncement}` : `已选择：${selectionAnnouncement}`);
          }
        }
        
        // 处理展开/收起
        if (e.key === 'ArrowRight' && !expanded) {
          e.preventDefault();
          if (onExpansionToggle) {
            onExpansionToggle(true);
          }
        }
        
        if (e.key === 'ArrowLeft' && expanded) {
          e.preventDefault();
          if (onExpansionToggle) {
            onExpansionToggle(false);
          }
        }
      }
    };

    const HeadingTag = `h${headingLevel}` as 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';

  return (
    <>
      <div
        id={cardId}
        className={cn(
          'rounded-lg border bg-card text-card-foreground shadow-sm',
          interactive && 'cursor-pointer focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
          selected && 'ring-2 ring-ring ring-offset-2',
          isFocused && 'ring-2 ring-ring ring-offset-2',
          className
        )}
        ref={ref}
        role={interactive ? 'button' : level ? `heading-level-${level}` : undefined}
        aria-pressed={interactive ? selected : undefined}
        aria-expanded={interactive ? expanded : undefined}
        aria-describedby={cn(
          headingId,
          descriptionId
        ).trim() || undefined}
        tabIndex={interactive ? 0 : undefined}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        onFocus={handleFocus}
        onBlur={handleBlur}
        {...props}
      >
        {heading && (
          <HeadingTag
            id={headingId}
            className="px-6 pt-6 pb-2 font-semibold leading-none tracking-tight"
          >
            {heading}
          </HeadingTag>
        )}
        
        <div className="px-6 pb-6">
          {children}
        </div>
        
        {description && (
          <div id={descriptionId} className="sr-only">
            {description}
          </div>
        )}
      </div>
      
      <AnnouncementComponent />
    </>
  );
});

AccessibleCard.displayName = 'AccessibleCard';

export { AccessibleCard };