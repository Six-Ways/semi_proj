'use client';

import React, { forwardRef } from 'react';
import { cn } from '@/lib/utils';
import { useFocusManagement, useScreenReaderAnnouncement, KEYBOARD_NAVIGATION, generateId } from '@/utils/accessibility';

interface AccessibleButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  loading?: boolean;
  loadingText?: string;
  announceClick?: boolean;
  clickAnnouncement?: string;
  description?: string;
  pressed?: boolean;
  expanded?: boolean;
  hasPopup?: boolean | 'false' | 'true' | 'menu' | 'listbox' | 'tree' | 'grid' | 'dialog';
  includeAnnouncement?: boolean; // 是否包含AnnouncementComponent
}

const AccessibleButton = forwardRef<HTMLButtonElement, AccessibleButtonProps>(
  (
    {
      className,
      variant = 'default',
      size = 'default',
      children,
      disabled = false,
      loading = false,
      loadingText = '加载中...',
      announceClick = false,
      clickAnnouncement,
      description,
      pressed,
      expanded,
      hasPopup,
      includeAnnouncement = true,
      onClick,
      onKeyDown,
      id,
      ...props
    },
    ref
  ) => {
    const { isFocused, handleFocus, handleBlur, setFocus } = useFocusManagement();
    const { announce, AnnouncementComponent } = useScreenReaderAnnouncement();
    const buttonId = id || generateId('button');
    const descriptionId = description ? generateId('desc') : undefined;

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      if (loading || disabled) return;
      
      if (onClick) {
        onClick(e);
      }
      
      if (announceClick && clickAnnouncement) {
        announce(clickAnnouncement);
      }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
      if (onKeyDown) {
        onKeyDown(e);
      }
      
      // 处理空格键，因为按钮默认只响应回车键
      if (e.key === KEYBOARD_NAVIGATION.SPACE) {
        e.preventDefault();
        if (!loading && !disabled && onClick) {
          onClick(e as any);
        }
      }
    };

    const variants = {
      default: 'bg-primary text-primary-foreground hover:bg-primary/90',
      destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/90',
      outline: 'border border-input bg-background hover:bg-accent hover:text-accent-foreground',
      secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
      ghost: 'hover:bg-accent hover:text-accent-foreground',
      link: 'text-primary underline-offset-4 hover:underline',
    };

    const sizes = {
      default: 'h-10 px-4 py-2',
      sm: 'h-9 rounded-md px-3',
      lg: 'h-11 rounded-md px-8',
      icon: 'h-10 w-10',
    };

    if (includeAnnouncement) {
      return (
        <>
          <button
            id={buttonId}
            className={cn(
              'inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
              variants[variant],
              sizes[size],
              isFocused && 'ring-2 ring-ring ring-offset-2',
              className
            )}
            ref={ref}
            disabled={disabled || loading}
            aria-disabled={disabled || loading}
            aria-busy={loading}
            aria-describedby={descriptionId}
            aria-pressed={pressed}
            aria-expanded={expanded}
            aria-haspopup={hasPopup}
            onClick={handleClick}
            onKeyDown={handleKeyDown}
            onFocus={handleFocus}
            onBlur={handleBlur}
            {...props}
          >
            {loading ? (
              <>
                <svg
                  className="mr-2 h-4 w-4 animate-spin"
                  fill="none"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                <span className="sr-only">{loadingText}</span>
                <span aria-hidden="true">{loadingText}</span>
              </>
            ) : (
              children
            )}
          </button>
          
          {description && (
            <div id={descriptionId} className="sr-only">
              {description}
            </div>
          )}
          
          <AnnouncementComponent />
        </>
      );
    } else {
      return (
        <button
          id={buttonId}
          className={cn(
            'inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
            variants[variant],
            sizes[size],
            isFocused && 'ring-2 ring-ring ring-offset-2',
            className
          )}
          ref={ref}
          disabled={disabled || loading}
          aria-disabled={disabled || loading}
          aria-busy={loading}
          aria-describedby={descriptionId}
          aria-pressed={pressed}
          aria-expanded={expanded}
          aria-haspopup={hasPopup}
          onClick={handleClick}
          onKeyDown={handleKeyDown}
          onFocus={handleFocus}
          onBlur={handleBlur}
          {...props}
        >
          {loading ? (
            <>
              <svg
                className="mr-2 h-4 w-4 animate-spin"
                fill="none"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              <span className="sr-only">{loadingText}</span>
              <span aria-hidden="true">{loadingText}</span>
            </>
          ) : (
            children
          )}
        </button>
      );
    }
  }
);

AccessibleButton.displayName = 'AccessibleButton';

export { AccessibleButton };