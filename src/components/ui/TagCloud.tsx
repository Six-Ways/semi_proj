"use client";

import React from "react";

interface TagCloudProps {
  tags: { tag: string; count: number }[];
  onTagClick?: (tag: string) => void;
  className?: string;
  maxTags?: number;
}

export function TagCloud({ 
  tags, 
  onTagClick, 
  className = "",
  maxTags = 20
}: TagCloudProps) {
  // 根据使用频率计算字体大小
  const getFontSize = (count: number) => {
    const minCount = Math.min(...tags.map(t => t.count));
    const maxCount = Math.max(...tags.map(t => t.count));
    const range = maxCount - minCount || 1;
    
    // 字体大小范围：0.8rem 到 1.4rem
    const fontSize = 0.8 + (count - minCount) / range * 0.6;
    return `${fontSize.toFixed(2)}rem`;
  };

  // 限制显示的标签数量
  const displayTags = tags.slice(0, maxTags);

  return (
    <div className={`flex flex-wrap gap-2 ${className}`} aria-label="标签云">
      {displayTags.map(({ tag, count }) => (
        <button
          key={tag}
          onClick={() => onTagClick?.(tag)}
          className="px-3 py-1 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-indigo-100 dark:hover:bg-indigo-900 hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500"
          style={{ fontSize: getFontSize(count) }}
          aria-label={`查看包含标签 ${tag} 的章节，共 ${count} 个`}
        >
          {tag}
          <span className="ml-1 text-xs text-gray-500 dark:text-gray-400">({count})</span>
        </button>
      ))}
    </div>
  );
}
