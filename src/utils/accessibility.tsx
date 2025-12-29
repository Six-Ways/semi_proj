'use client';

import { useEffect, useRef, useState } from 'react';

/**
 * 无障碍工具函数和自定义钩子
 */

// 键盘导航常量
export const KEYBOARD_NAVIGATION = {
  ENTER: 'Enter',
  SPACE: ' ',
  ESCAPE: 'Escape',
  ARROW_UP: 'ArrowUp',
  ARROW_DOWN: 'ArrowDown',
  ARROW_LEFT: 'ArrowLeft',
  ARROW_RIGHT: 'ArrowRight',
  TAB: 'Tab',
  HOME: 'Home',
  END: 'End'
} as const;

// ARIA 角色常量
export const ARIA_ROLES = {
  BUTTON: 'button',
  NAVIGATION: 'navigation',
  MAIN: 'main',
  COMPLEMENTARY: 'complementary',
  CONTENTINFO: 'contentinfo',
  REGION: 'region',
  ARTICLE: 'article',
  HEADING: 'heading',
  LIST: 'list',
  LISTITEM: 'listitem',
  TAB: 'tab',
  TABLIST: 'tablist',
  TABPANEL: 'tabpanel',
  DIALOG: 'dialog',
  ALERT: 'alert',
  STATUS: 'status',
  TIMER: 'timer',
  PROGRESSBAR: 'progressbar',
  TOOLTIP: 'tooltip'
} as const;

// 焦点管理钩子
export function useFocusManagement(initialFocusRef?: React.RefObject<HTMLElement>) {
  const [isFocused, setIsFocused] = useState(false);
  const elementRef = useRef<HTMLElement>(null);

  const handleFocus = () => setIsFocused(true);
  const handleBlur = () => setIsFocused(false);

  const setFocus = () => {
    if (elementRef.current) {
      elementRef.current.focus();
    } else if (initialFocusRef?.current) {
      initialFocusRef.current.focus();
    }
  };

  const trapFocus = (containerRef: React.RefObject<HTMLElement>) => {
    if (!containerRef.current) return;

    const focusableElements = containerRef.current.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );

    if (focusableElements.length === 0) return;

    const firstElement = focusableElements[0] as HTMLElement;
    const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

    const handleTabKey = (e: KeyboardEvent) => {
      if (e.key === 'Tab') {
        if (e.shiftKey) {
          if (document.activeElement === firstElement) {
            lastElement.focus();
            e.preventDefault();
          }
        } else {
          if (document.activeElement === lastElement) {
            firstElement.focus();
            e.preventDefault();
          }
        }
      }
    };

    containerRef.current.addEventListener('keydown', handleTabKey);
    return () => containerRef.current?.removeEventListener('keydown', handleTabKey);
  };

  return {
    isFocused,
    elementRef,
    handleFocus,
    handleBlur,
    setFocus,
    trapFocus
  };
}

// 键盘导航钩子
export function useKeyboardNavigation(
  items: Array<{ id: string; element?: HTMLElement }>,
  onSelect?: (id: string) => void,
  orientation: 'vertical' | 'horizontal' = 'vertical'
) {
  const [activeIndex, setActiveIndex] = useState(0);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    const { key } = e;
    let newIndex = activeIndex;

    switch (key) {
      case KEYBOARD_NAVIGATION.ARROW_DOWN:
      case KEYBOARD_NAVIGATION.ARROW_RIGHT:
        if (orientation === 'vertical' && key === KEYBOARD_NAVIGATION.ARROW_RIGHT) return;
        if (orientation === 'horizontal' && key === KEYBOARD_NAVIGATION.ARROW_DOWN) return;
        
        e.preventDefault();
        newIndex = (activeIndex + 1) % items.length;
        break;
        
      case KEYBOARD_NAVIGATION.ARROW_UP:
      case KEYBOARD_NAVIGATION.ARROW_LEFT:
        if (orientation === 'vertical' && key === KEYBOARD_NAVIGATION.ARROW_LEFT) return;
        if (orientation === 'horizontal' && key === KEYBOARD_NAVIGATION.ARROW_UP) return;
        
        e.preventDefault();
        newIndex = activeIndex === 0 ? items.length - 1 : activeIndex - 1;
        break;
        
      case KEYBOARD_NAVIGATION.HOME:
        e.preventDefault();
        newIndex = 0;
        break;
        
      case KEYBOARD_NAVIGATION.END:
        e.preventDefault();
        newIndex = items.length - 1;
        break;
        
      case KEYBOARD_NAVIGATION.ENTER:
      case KEYBOARD_NAVIGATION.SPACE:
        e.preventDefault();
        if (onSelect && items[activeIndex]) {
          onSelect(items[activeIndex].id);
        }
        return;
        
      default:
        return;
    }

    setActiveIndex(newIndex);
    
    // 聚焦到新元素
    const item = items[newIndex];
    if (item?.element) {
      item.element.focus();
    }
  };

  return {
    activeIndex,
    setActiveIndex,
    handleKeyDown
  };
}

// 屏幕阅读器公告钩子
export function useScreenReaderAnnouncement() {
  const [announcement, setAnnouncement] = useState('');
  const announcementRef = useRef<HTMLDivElement>(null);

  const announce = (message: string, priority: 'polite' | 'assertive' = 'polite') => {
    setAnnouncement(message);
    
    // 清除之前的定时器
    if (announcementRef.current?.dataset.timerId) {
      clearTimeout(parseInt(announcementRef.current.dataset.timerId));
    }
    
    // 设置新的定时器来清除公告
    const timerId = setTimeout(() => {
      setAnnouncement('');
    }, 1000);
    
    if (announcementRef.current) {
      announcementRef.current.dataset.timerId = timerId.toString();
    }
  };

  const AnnouncementComponent = () => (
    <div
      ref={announcementRef}
      className="sr-only"
      aria-live="polite"
      aria-atomic="true"
    >
      {announcement}
    </div>
  );

  return {
    announce,
    AnnouncementComponent
  };
}

// 减少动画偏好钩子
export function useReducedMotion() {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    
    const handleChange = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches);
    };
    
    // 设置初始值
    setPrefersReducedMotion(mediaQuery.matches);
    
    // 添加监听器
    mediaQuery.addEventListener('change', handleChange);
    
    return () => {
      mediaQuery.removeEventListener('change', handleChange);
    };
  }, []);

  return prefersReducedMotion;
}

// 高对比度偏好钩子
export function useHighContrast() {
  const [prefersHighContrast, setPrefersHighContrast] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-contrast: high)');
    
    const handleChange = (e: MediaQueryListEvent) => {
      setPrefersHighContrast(e.matches);
    };
    
    // 设置初始值
    setPrefersHighContrast(mediaQuery.matches);
    
    // 添加监听器
    mediaQuery.addEventListener('change', handleChange);
    
    return () => {
      mediaQuery.removeEventListener('change', handleChange);
    };
  }, []);

  return prefersHighContrast;
}

// 生成唯一ID的工具函数
export function generateId(prefix = 'id'): string {
  return `${prefix}-${Math.random().toString(36).substr(2, 9)}`;
}

// 为标题生成锚点ID
export function generateHeadingId(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\u4e00-\u9fa5a-z0-9\s-]/g, '') // 保留中文、英文、数字、空格和连字符
    .replace(/\s+/g, '-')
    .trim();
}

// 获取元素的文本内容（用于无障碍描述）
export function getElementTextContent(element: HTMLElement): string {
  return element.textContent || element.innerText || '';
}

// 检查元素是否在视口中
export function isElementInViewport(element: HTMLElement): boolean {
  const rect = element.getBoundingClientRect();
  
  return (
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
    rect.right <= (window.innerWidth || document.documentElement.clientWidth)
  );
}

// 跳转到指定元素
export function scrollToElement(elementId: string, options: ScrollIntoViewOptions = { behavior: 'smooth' }) {
  const element = document.getElementById(elementId);
  if (element) {
    element.scrollIntoView(options);
    element.focus();
  }
}

// 创建跳转链接组件的属性
export function createSkipLinkProps(targetId: string) {
  return {
    href: `#${targetId}`,
    className: 'sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-blue-600 text-white px-4 py-2 rounded z-50',
    onClick: (e: React.MouseEvent) => {
      e.preventDefault();
      scrollToElement(targetId);
    }
  };
}