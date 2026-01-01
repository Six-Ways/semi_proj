"use client";

import React, { useState, useEffect, useRef } from "react";
import { Search as SearchIcon, X, ChevronRight } from "lucide-react";
import { useAnalytics } from "@/hooks/useAnalytics";

interface SearchResult {
  slug: string;
  title: string;
  content: string;
  score: number;
  part: string;
  chapter: string;
}

interface SearchProps {
  className?: string;
  placeholder?: string;
}

export function Search({ className = "", placeholder = "搜索章节内容..." }: SearchProps) {
  const { trackSearch, trackButtonClick } = useAnalytics();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  // 搜索功能
  const performSearch = async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setResults([]);
      return;
    }

    setIsLoading(true);
    try {
      // 在客户端执行搜索，避免API调用
      // 由于fs模块在客户端不可用，我们需要使用模拟数据或API调用
      // 这里我们使用一个简单的模拟搜索功能
      // 实际项目中，应该通过API调用后端搜索服务
      const searchResults: SearchResult[] = [];
      
      // 模拟搜索结果 - 实际项目中应该从API获取
      const mockChapters = [
        {
          slug: 'part0/ch0',
          title: '硅基文明的基石与演进',
          content: '半导体技术的发展历程与摩尔定律...',
          part: 'part0',
          chapter: 'ch0',
          tags: ['半导体', '摩尔定律', '发展历程']
        },
        {
          slug: 'part1/ch1',
          title: '半导体材料与晶体结构',
          content: '半导体材料与晶体结构：原子如何搭建 "电子舞台"...',
          part: 'part1',
          chapter: 'ch1',
          tags: ['半导体材料', '晶体结构', '原子排列']
        },
        {
          slug: 'part1/ch2',
          title: '量子力学基础与固体能带',
          content: '量子力学基础与固体能带理论...',
          part: 'part1',
          chapter: 'ch2',
          tags: ['量子力学', '能带理论', '固体物理']
        },
        {
          slug: 'part1/ch3',
          title: '载流子统计与热平衡',
          content: '载流子统计与热平衡状态...',
          part: 'part1',
          chapter: 'ch3',
          tags: ['载流子', '统计物理', '热平衡']
        },
        {
          slug: 'part3/ch4',
          title: '载流子输运',
          content: '载流子输运：漂移与扩散...',
          part: 'part3',
          chapter: 'ch4',
          tags: ['载流子', '输运现象', '漂移扩散']
        }
      ];
      
      for (const chapter of mockChapters) {
        const { slug, title, content, part, chapter: chapterNum, tags } = chapter;
        const lowerQuery = searchQuery.toLowerCase();
        const lowerTitle = title.toLowerCase();
        const lowerContent = content.toLowerCase();
        
        let score = 0;
        
        // 标题匹配
        if (lowerTitle.includes(lowerQuery)) {
          score += 2;
        }
        
        // 内容匹配
        if (lowerContent.includes(lowerQuery)) {
          score += 1;
        }
        
        // 标签匹配
        if (tags.some(tag => tag.toLowerCase().includes(lowerQuery))) {
          score += 1.5;
        }
        
        if (score > 0) {
          // 提取匹配的片段
          let matchIndex = lowerContent.indexOf(lowerQuery);
          if (matchIndex === -1) {
            matchIndex = 0;
          }
          const start = Math.max(0, matchIndex - 50);
          const end = Math.min(content.length, matchIndex + lowerQuery.length + 50);
          const snippet = content.slice(start, end);
          
          searchResults.push({
            slug,
            title,
            content: snippet,
            score,
            part,
            chapter: chapterNum
          });
        }
      }
      
      // 按分数排序
      searchResults.sort((a, b) => b.score - a.score);
      
      setResults(searchResults);
      
      // 跟踪搜索事件
      trackSearch(searchQuery, searchResults.length);
    } catch (error) {
      console.error("搜索失败:", error);
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  // 监听搜索输入变化，延迟搜索
  useEffect(() => {
    const timer = setTimeout(() => {
      performSearch(query);
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  // 点击外部关闭搜索
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsSearchOpen(false);
        setResults([]);
        setQuery("");
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={searchRef} className={`relative ${className}`}>
      {/* 搜索触发按钮 */}
      <button
        onClick={() => setIsSearchOpen(!isSearchOpen)}
        className="flex items-center justify-center p-2 rounded-full text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500"
        aria-label="打开搜索"
      >
        <SearchIcon size={20} />
      </button>

      {/* 搜索面板 */}
      {isSearchOpen && (
        <div className="absolute right-0 mt-2 w-96 bg-white dark:bg-gray-900 rounded-lg shadow-lg ring-1 ring-black ring-opacity-5 z-50 overflow-hidden">
          {/* 搜索输入框 */}
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <div className="relative">
              <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={placeholder}
                className="w-full pl-10 pr-10 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400"
                autoFocus
                aria-label="搜索章节内容"
              />
              {query && (
                <button
                  onClick={() => {
                    setQuery("");
                    setResults([]);
                  }}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300"
                  aria-label="清除搜索"
                >
                  <X size={16} />
                </button>
              )}
            </div>
          </div>

          {/* 搜索结果 */}
          <div className="max-h-96 overflow-y-auto">
            {isLoading ? (
              <div className="p-4 text-center text-gray-500 dark:text-gray-400">搜索中...</div>
            ) : results.length > 0 ? (
              results.map((result, index) => (
                <a
                  key={`${result.slug}-${index}`}
                  href={`/chapters/${result.slug}`}
                  className="block p-4 border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                  onClick={() => {
                    setIsSearchOpen(false);
                    setResults([]);
                    setQuery("");
                  }}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        {result.title}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        {result.part} - {result.chapter}
                      </div>
                      <div className="mt-1 text-sm text-gray-600 dark:text-gray-300 line-clamp-2">
                        ...{result.content}...
                      </div>
                    </div>
                    <ChevronRight size={16} className="text-gray-400 mt-1" />
                  </div>
                </a>
              ))
            ) : query ? (
              <div className="p-4 text-center text-gray-500 dark:text-gray-400">未找到匹配结果</div>
            ) : (
              <div className="p-4 text-center text-gray-500 dark:text-gray-400">开始输入搜索内容</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
