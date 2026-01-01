"use client";

import { useState, useEffect, useRef } from "react";

interface ReadingProgressProps {
  chapterId: string;
  contentRef: React.RefObject<HTMLElement>;
  onProgressChange?: (progress: number) => void;
}

export function useReadingProgress({ chapterId, contentRef, onProgressChange }: ReadingProgressProps) {
  const [progress, setProgress] = useState<number>(0);
  const lastSavedProgress = useRef<number>(0);
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // 从localStorage加载保存的进度
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedProgress = localStorage.getItem(`reading_progress_${chapterId}`);
      if (savedProgress) {
        setProgress(parseFloat(savedProgress));
        lastSavedProgress.current = parseFloat(savedProgress);
      }
    }
  }, [chapterId]);

  // 监听滚动事件，更新进度
  useEffect(() => {
    const updateProgress = () => {
      if (!contentRef.current) return;

      const { scrollTop, scrollHeight, clientHeight } = contentRef.current;
      const totalScrollableHeight = scrollHeight - clientHeight;
      const newProgress = totalScrollableHeight > 0 ? scrollTop / totalScrollableHeight : 0;
      
      setProgress(newProgress);
      
      // 调用回调函数
      if (onProgressChange) {
        onProgressChange(newProgress);
      }

      // 防抖保存进度，避免频繁写入localStorage
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }

      // 只有当进度变化超过5%时才保存
      if (Math.abs(newProgress - lastSavedProgress.current) > 0.05) {
        saveTimeoutRef.current = setTimeout(() => {
          if (typeof window !== 'undefined') {
            localStorage.setItem(`reading_progress_${chapterId}`, newProgress.toString());
            lastSavedProgress.current = newProgress;
          }
        }, 500);
      }
    };

    const contentElement = contentRef.current;
    if (contentElement) {
      contentElement.addEventListener('scroll', updateProgress);
    }

    return () => {
      if (contentElement) {
        contentElement.removeEventListener('scroll', updateProgress);
      }
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, [chapterId, contentRef, onProgressChange]);

  // 保存当前进度
  const saveProgress = () => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(`reading_progress_${chapterId}`, progress.toString());
      lastSavedProgress.current = progress;
    }
  };

  // 重置进度
  const resetProgress = () => {
    setProgress(0);
    lastSavedProgress.current = 0;
    if (typeof window !== 'undefined') {
      localStorage.removeItem(`reading_progress_${chapterId}`);
    }
  };

  return {
    progress,
    saveProgress,
    resetProgress
  };
}
