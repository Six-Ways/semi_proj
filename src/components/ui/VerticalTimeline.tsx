"use client";

import { useState, useEffect, useRef } from "react";

interface VerticalTimelineProps {
  sectionRefs: React.MutableRefObject<(HTMLElement | null)[]>;
  totalSections: number;
  totalChapters: number;
}

export function VerticalTimeline({ 
  sectionRefs, 
  totalSections = 7, 
  totalChapters = 20 
}: VerticalTimelineProps) {
  const [currentSection, setCurrentSection] = useState(0);
  const [currentChapter, setCurrentChapter] = useState(0);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      // 计算整体滚动进度
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight - windowHeight;
      const scrollTop = window.scrollY;
      const progress = Math.min(scrollTop / documentHeight, 1);
      setScrollProgress(progress);

      // 确定当前可见的区块
      for (let i = sectionRefs.current.length - 1; i >= 0; i--) {
        const ref = sectionRefs.current[i];
        if (ref) {
          const rect = ref.getBoundingClientRect();
          if (rect.top <= windowHeight / 2 && rect.bottom >= windowHeight / 2) {
            setCurrentSection(i + 1);
            
            // 计算当前区块内的章节进度
            const sectionProgress = (windowHeight / 2 - rect.top) / rect.height;
            const chaptersInSection = Math.ceil(totalChapters / totalSections);
            const chapterInSection = Math.floor(sectionProgress * chaptersInSection);
            setCurrentChapter(Math.min(i * chaptersInSection + chapterInSection + 1, totalChapters));
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // 初始调用

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [sectionRefs, totalSections, totalChapters]);

  return (
    <div className="fixed left-8 top-1/2 transform -translate-y-1/2 z-30 hidden lg:block">
      <div className="bg-white rounded-full shadow-lg p-4">
        {/* 进度条 */}
        <div className="relative h-64 w-2 bg-gray-200 rounded-full overflow-hidden">
          <div 
            className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-indigo-500 to-purple-500 rounded-full transition-all duration-300"
            style={{ height: `${scrollProgress * 100}%` }}
          ></div>
        </div>
        
        {/* 区块标记 */}
        <div className="absolute inset-0 flex flex-col justify-between py-4">
          {Array.from({ length: totalSections }, (_, i) => (
            <div
              key={i}
              className={`w-4 h-4 rounded-full border-2 transition-all duration-300 ${
                i < currentSection 
                  ? "bg-indigo-500 border-indigo-500" 
                  : "bg-white border-gray-300"
              } ${
                i === currentSection - 1 
                  ? "ring-2 ring-indigo-300 scale-125" 
                  : ""
              }`}
            />
          ))}
        </div>
        
        {/* 当前位置指示器 */}
        <div className="mt-4 text-center">
          <div className="text-xs font-mono text-gray-600">
            {String(currentSection).padStart(2, '0')}/{String(totalSections).padStart(2, '0')} Sections
          </div>
          <div className="text-xs font-mono text-gray-600">
            {String(currentChapter).padStart(2, '0')}/{String(totalChapters).padStart(2, '0')} Chapters
          </div>
        </div>
      </div>
    </div>
  );
}

// 底部知识链进度指示器
export function KnowledgeChainProgress({ 
  currentChapter, 
  totalChapters = 20 
}: { 
  currentChapter: number; 
  totalChapters?: number; 
}) {
  return (
    <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-30 hidden lg:block">
      <div className="bg-white rounded-full shadow-lg px-6 py-3">
        <div className="flex items-center space-x-2">
          {Array.from({ length: totalChapters }, (_, i) => {
            const isActive = i < currentChapter;
            const isCurrent = i === currentChapter - 1;
            
            return (
              <div
                key={i}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  isActive 
                    ? "bg-indigo-500" 
                    : "bg-gray-300"
                } ${
                  isCurrent 
                    ? "w-3 h-3 ring-2 ring-indigo-300" 
                    : ""
                }`}
              />
            );
          })}
        </div>
        <div className="text-xs font-mono text-gray-600 text-center mt-2">
          {String(currentChapter).padStart(2, '0')}/{String(totalChapters).padStart(2, '0')} Chapters
        </div>
      </div>
    </div>
  );
}