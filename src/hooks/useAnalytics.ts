"use client";

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';

// 定义分析事件类型
type AnalyticsEvent = {
  name: string;
  category: string;
  label?: string;
  value?: number;
  [key: string]: any;
};

/**
 * 自定义分析钩子，用于跟踪用户行为
 * 集成了Sentry，并提供了灵活的事件跟踪API
 */
export function useAnalytics() {
  const pathname = usePathname();
  const searchParamsRef = useRef<string>('');

  // 页面视图跟踪 - 移除useSearchParams以避免Suspense错误
  useEffect(() => {
    // 跟踪页面访问
    trackPageView(pathname, searchParamsRef.current);
  }, [pathname]);

  /**
   * 跟踪页面视图
   */
  const trackPageView = (page: string, search = '') => {
    const fullPath = search ? `${page}?${search}` : page;
    
    // 使用Sentry的性能监控 - 添加类型断言
    const win = typeof window !== 'undefined' ? window as any : null;
    if (win && win.Sentry) {
      try {
        win.Sentry.setContext('page', {
          pathname: page,
          search,
          fullPath
        });
        
        // 记录页面加载时间（如果Sentry性能监控已启用）
        if (win.Sentry.startTransaction) {
          const transaction = win.Sentry.startTransaction({
            name: `page-load: ${page}`,
            op: 'navigation'
          });
          transaction.finish();
        }
      } catch (error) {
        console.error('Sentry page view tracking error:', error);
      }
    }
    
    // 自定义事件跟踪
    trackEvent({
      name: 'page_view',
      category: 'navigation',
      label: page,
      path: fullPath
    });
  };

  /**
   * 跟踪自定义事件
   */
  const trackEvent = (event: AnalyticsEvent) => {
    try {
      // 基本的控制台日志（用于开发环境）
      if (process.env.NODE_ENV === 'development') {
        console.log('[Analytics Event]', event);
      }
      
      // 使用Sentry的自定义事件 - 添加类型断言
      const win = typeof window !== 'undefined' ? window as any : null;
      if (win && win.Sentry) {
        win.Sentry.captureMessage(`Analytics Event: ${event.name}`, {
          level: 'info',
          extra: {
            ...event
          }
        });
      }
      
      // 未来可以在这里添加其他分析服务集成，如Google Analytics、Mixpanel等
      // 例如：window.gtag?.('event', event.name, event);
    } catch (error) {
      console.error('Analytics tracking error:', error);
    }
  };

  /**
   * 跟踪用户行为：按钮点击
   */
  const trackButtonClick = (buttonName: string, context?: any) => {
    trackEvent({
      name: 'button_click',
      category: 'interaction',
      label: buttonName,
      ...context
    });
  };

  /**
   * 跟踪用户行为：链接点击
   */
  const trackLinkClick = (linkUrl: string, linkText?: string) => {
    trackEvent({
      name: 'link_click',
      category: 'navigation',
      label: linkText || linkUrl,
      url: linkUrl
    });
  };

  /**
   * 跟踪学习进度
   */
  const trackLearningProgress = (chapter: string, progress: number, context?: any) => {
    trackEvent({
      name: 'learning_progress',
      category: 'education',
      label: chapter,
      value: progress,
      ...context
    });
  };

  /**
   * 跟踪搜索行为
   */
  const trackSearch = (query: string, resultsCount: number) => {
    trackEvent({
      name: 'search',
      category: 'interaction',
      label: query,
      value: resultsCount
    });
  };

  /**
   * 跟踪设置更改
   */
  const trackSettingChange = (settingName: string, newValue: any) => {
    trackEvent({
      name: 'setting_change',
      category: 'preferences',
      label: settingName,
      value: newValue
    });
  };

  return {
    trackEvent,
    trackPageView,
    trackButtonClick,
    trackLinkClick,
    trackLearningProgress,
    trackSearch,
    trackSettingChange
  };
}
