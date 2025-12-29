"use client";

import { useEffect, useRef, useState } from "react";

interface ConnectionLineProps {
  fromElement: HTMLElement | null;
  toElement: HTMLElement | null;
  isActive?: boolean;
  isHighlighted?: boolean;
}

function ConnectionLine({ fromElement, toElement, isActive = false, isHighlighted = false }: ConnectionLineProps) {
  const pathRef = useRef<SVGPathElement>(null);
  const [pathData, setPathData] = useState("");

  useEffect(() => {
    if (!fromElement || !toElement) return;

    const updatePath = () => {
      const fromRect = fromElement.getBoundingClientRect();
      const toRect = toElement.getBoundingClientRect();

      const fromX = fromRect.left + fromRect.width / 2;
      const fromY = fromRect.top + fromRect.height / 2;
      const toX = toRect.left + toRect.width / 2;
      const toY = toRect.top + toRect.height / 2;

      // 创建贝塞尔曲线路径
      const midX = (fromX + toX) / 2;
      const midY = (fromY + toY) / 2;
      const controlOffset = Math.abs(toX - fromX) * 0.2;
      
      const path = `M ${fromX} ${fromY} Q ${midX} ${midY - controlOffset} ${toX} ${toY}`;
      setPathData(path);
    };

    updatePath();
    window.addEventListener('resize', updatePath);
    window.addEventListener('scroll', updatePath);

    return () => {
      window.removeEventListener('resize', updatePath);
      window.removeEventListener('scroll', updatePath);
    };
  }, [fromElement, toElement]);

  return (
    <path
      ref={pathRef}
      d={pathData}
      stroke={isHighlighted ? "#007AFF" : "#e2e8f0"}
      strokeWidth={isHighlighted ? "2" : "1"}
      fill="none"
      strokeDasharray={isHighlighted ? "0" : "5,5"}
      className={`transition-all duration-500 ${isHighlighted ? "animate-pulse" : ""}`}
      opacity={isActive ? 1 : 0.3}
    />
  );
}

interface ChapterConnectionMapProps {
  hoveredChapter: string | null;
  chapterRefs: React.MutableRefObject<Map<string, HTMLElement>>;
}

export function ChapterConnectionMap({ 
  hoveredChapter, 
  chapterRefs 
}: ChapterConnectionMapProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  
  // 获取相关章节
  const getRelatedChapters = (chapterId: string): string[] => {
    const connections: Record<string, string[]> = {
      "preface": ["ch1"],
      "ch1": ["preface", "ch2"],
      "ch2": ["ch1", "ch3"],
      "ch3": ["ch2", "ch4"],
      "ch4": ["ch3", "ch5"],
      "ch5": ["ch4", "ch6"],
      "ch6": ["ch5", "ch7"],
      "ch7": ["ch6", "ch8"],
      "ch8": ["ch7", "ch9"],
      "ch9": ["ch8", "ch10"],
      "ch10": ["ch9", "ch11"],
      "ch11": ["ch10", "ch12"],
      "ch12": ["ch11", "ch13"],
      "ch13": ["ch12", "ch14"],
      "ch14": ["ch13", "ch15"],
      "ch15": ["ch14", "ch16"],
      "ch16": ["ch15", "ch17"],
      "ch17": ["ch16", "ch18"],
      "ch18": ["ch17", "ch19"],
      "ch19": ["ch18", "ch20"],
      "ch20": ["ch19"]
    };
    
    return connections[chapterId] || [];
  };

  // 定义章节之间的连接关系
  const chapterConnections: [string, string][] = [
    // 序言到第一部分
    ["preface", "ch1"],
    
    // 第一部分内部连接
    ["ch1", "ch2"],
    ["ch2", "ch3"],
    
    // 第一部分到第二部分
    ["ch3", "ch4"],
    
    // 第二部分内部连接
    ["ch4", "ch5"],
    ["ch5", "ch6"],
    
    // 第二部分到第三部分
    ["ch6", "ch7"],
    
    // 第三部分内部连接
    ["ch7", "ch8"],
    ["ch8", "ch9"],
    
    // 第三部分到第四部分
    ["ch9", "ch10"],
    
    // 第四部分内部连接
    ["ch10", "ch11"],
    ["ch11", "ch12"],
    
    // 第四部分到第五部分
    ["ch12", "ch13"],
    
    // 第五部分内部连接
    ["ch13", "ch14"],
    ["ch14", "ch15"],
    
    // 第五部分到第六部分
    ["ch15", "ch16"],
    
    // 第六部分内部连接
    ["ch16", "ch17"],
    ["ch17", "ch18"],
    
    // 第六部分到第七部分
    ["ch18", "ch19"],
    
    // 第七部分内部连接
    ["ch19", "ch20"]
  ];

  return (
    <svg
      ref={svgRef}
      className="fixed inset-0 pointer-events-none z-10"
      width="100%"
      height="100%"
      style={{ overflow: 'visible' }}
    >
      <defs>
        <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
          <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#e2e8f0" strokeWidth="0.5" />
        </pattern>
        
        {/* 发光效果滤镜 */}
        <filter id="glow">
          <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
          <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>
      
      <rect width="100%" height="100%" fill="url(#grid)" />
      
      {chapterConnections.map(([from, to], index) => {
        const fromElement = chapterRefs.current.get(from);
        const toElement = chapterRefs.current.get(to);
        const relatedChapters = hoveredChapter ? getRelatedChapters(hoveredChapter) : [];
        const isRelatedToHovered = hoveredChapter && 
          (relatedChapters.includes(from) || relatedChapters.includes(to));
        const isActive = hoveredChapter === from || hoveredChapter === to || isRelatedToHovered;
        
        return (
          <g key={index}>
            <ConnectionLine
              fromElement={fromElement || null}
              toElement={toElement || null}
              isActive={isActive || false}
              isHighlighted={isRelatedToHovered || false}
            />
          </g>
        );
      })}
    </svg>
  );
}

// 知识链条组件 - 显示章节之间的逻辑关系
export function KnowledgeChain({ 
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