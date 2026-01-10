"use client";

import React, { useState, useEffect } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useAnalytics } from "@/hooks/useAnalytics";

interface FontSizeToggleProps {
  className?: string;
}

// 字体大小选项，单位为像素
const FONT_SIZES = [14, 16, 18, 20, 22];

// 默认字体大小索引
const DEFAULT_FONT_SIZE_INDEX = 1;

export function FontSizeToggle({ className = "" }: FontSizeToggleProps) {
  const { trackSettingChange } = useAnalytics();
  
  // 字体大小索引状态
  // 初始值使用DEFAULT_FONT_SIZE_INDEX确保服务器和客户端初始渲染一致
  const [fontSizeIndex, setFontSizeIndex] = useState<number>(DEFAULT_FONT_SIZE_INDEX);

  // 在客户端水合完成后，从localStorage读取保存的字体大小偏好
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedFontSize = localStorage.getItem("font_size_index");
      if (savedFontSize) {
        const index = parseInt(savedFontSize);
        setFontSizeIndex(FONT_SIZES.includes(FONT_SIZES[index]) ? index : DEFAULT_FONT_SIZE_INDEX);
      }
    }
  }, []);

  // 当前字体大小
  const currentFontSize = FONT_SIZES[fontSizeIndex];

  // 监听字体大小变化，更新CSS变量
  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty('--font-size', `${currentFontSize}px`);
    
    // 保存字体大小偏好到localStorage
    if (typeof window !== 'undefined') {
      localStorage.setItem("font_size_index", fontSizeIndex.toString());
    }
    
    // 跟踪字体大小变化
    trackSettingChange('font_size', currentFontSize);
  }, [fontSizeIndex, currentFontSize, trackSettingChange]);

  // 增加字体大小
  const increaseFontSize = () => {
    setFontSizeIndex((prev) => Math.min(prev + 1, FONT_SIZES.length - 1));
  };

  // 减小字体大小
  const decreaseFontSize = () => {
    setFontSizeIndex((prev) => Math.max(prev - 1, 0));
  };

  return (
    <div className={`flex items-center space-x-2 ${className}`} aria-label="字体大小调节">
      <button
        onClick={decreaseFontSize}
        className="flex items-center justify-center p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500"
        aria-label="减小字体大小"
        disabled={fontSizeIndex === 0}
        title="减小字体大小"
      >
        <ChevronDown className="h-4 w-4" />
      </button>
      
      <span className="text-sm font-medium min-w-[2.5rem] text-center">
        {currentFontSize}px
      </span>
      
      <button
        onClick={increaseFontSize}
        className="flex items-center justify-center p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500"
        aria-label="增大字体大小"
        disabled={fontSizeIndex === FONT_SIZES.length - 1}
        title="增大字体大小"
      >
        <ChevronUp className="h-4 w-4" />
      </button>
    </div>
  );
}
