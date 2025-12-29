"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { motion, AnimatePresence, Variants } from "framer-motion";
import { useRouter } from "next/navigation";

// 章节过渡动画类型
export type TransitionType = 
  | "slide" 
  | "fade" 
  | "flip" 
  | "scale" 
  | "wipe" 
  | "dissolve";

// 章节过渡方向
export type TransitionDirection = 
  | "forward" 
  | "backward" 
  | "up" 
  | "down";

// 章节过渡配置接口
interface ChapterTransitionConfig {
  type: TransitionType;
  direction: TransitionDirection;
  duration: number;
  easing: string;
  stagger?: number;
}

// 章节过渡上下文接口
interface ChapterTransitionContextType {
  isTransitioning: boolean;
  transitionConfig: ChapterTransitionConfig;
  startTransition: (fromChapter: number, toChapter: number, onComplete?: () => void) => void;
  setTransitionConfig: (config: Partial<ChapterTransitionConfig>) => void;
}

// 创建章节过渡上下文
const ChapterTransitionContext = createContext<ChapterTransitionContextType | undefined>(undefined);

// 默认过渡配置
const defaultTransitionConfig: ChapterTransitionConfig = {
  type: "slide",
  direction: "forward",
  duration: 0.8,
  easing: "easeInOut",
  stagger: 0.1
};

// 章节过渡提供者组件
export function ChapterTransitionProvider({ children }: { children: ReactNode }) {
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [transitionConfig, setTransitionConfigState] = useState<ChapterTransitionConfig>(defaultTransitionConfig);
  const router = useRouter();
  
  // 设置过渡配置
  const setTransitionConfig = (config: Partial<ChapterTransitionConfig>) => {
    setTransitionConfigState(prev => ({ ...prev, ...config }));
  };
  
  // 开始章节过渡
  const startTransition = (fromChapter: number, toChapter: number, onComplete?: () => void) => {
    setIsTransitioning(true);
    
    // 根据章节顺序确定过渡方向
    const direction = toChapter > fromChapter ? "forward" : "backward";
    setTransitionConfigState(prev => ({ ...prev, direction }));
    
    // 设置延迟以完成过渡动画
    setTimeout(() => {
      setIsTransitioning(false);
      if (onComplete) onComplete();
    }, transitionConfig.duration * 1000);
  };
  
  return (
    <ChapterTransitionContext.Provider value={{
      isTransitioning,
      transitionConfig,
      startTransition,
      setTransitionConfig
    }}>
      {children}
    </ChapterTransitionContext.Provider>
  );
}

// 自定义Hook获取章节过渡上下文
export function useChapterTransition() {
  const context = useContext(ChapterTransitionContext);
  if (context === undefined) {
    throw new Error("useChapterTransition must be used within a ChapterTransitionProvider");
  }
  return context;
}

// 章节过渡动画变体
const slideVariants: Variants = {
  enter: (direction: TransitionDirection) => ({
    x: direction === "forward" ? "100%" : direction === "backward" ? "-100%" : 0,
    y: direction === "down" ? "100%" : direction === "up" ? "-100%" : 0,
    opacity: 0
  }),
  center: {
    x: 0,
    y: 0,
    opacity: 1
  },
  exit: (direction: TransitionDirection) => ({
    x: direction === "forward" ? "-100%" : direction === "backward" ? "100%" : 0,
    y: direction === "down" ? "-100%" : direction === "up" ? "100%" : 0,
    opacity: 0
  })
};

const fadeVariants: Variants = {
  enter: {
    opacity: 0
  },
  center: {
    opacity: 1
  },
  exit: {
    opacity: 0
  }
};

const scaleVariants: Variants = {
  enter: {
    scale: 0.8,
    opacity: 0
  },
  center: {
    scale: 1,
    opacity: 1
  },
  exit: {
    scale: 1.2,
    opacity: 0
  }
};

const flipVariants: Variants = {
  enter: {
    rotateY: -90,
    opacity: 0
  },
  center: {
    rotateY: 0,
    opacity: 1
  },
  exit: {
    rotateY: 90,
    opacity: 0
  }
};

const wipeVariants: Variants = {
  enter: (direction: TransitionDirection) => ({
    clipPath: direction === "forward" 
      ? "inset(0 100% 0 0)" 
      : direction === "backward" 
      ? "inset(0 0 0 100%)" 
      : direction === "down" 
      ? "inset(100% 0 0 0)" 
      : "inset(0 0 100% 0)",
    opacity: 0
  }),
  center: {
    clipPath: "inset(0 0 0 0)",
    opacity: 1
  },
  exit: (direction: TransitionDirection) => ({
    clipPath: direction === "forward" 
      ? "inset(0 0 0 100%)" 
      : direction === "backward" 
      ? "inset(0 100% 0 0)" 
      : direction === "down" 
      ? "inset(0 0 100% 0)" 
      : "inset(100% 0 0 0)",
    opacity: 0
  })
};

const dissolveVariants: Variants = {
  enter: {
    filter: "blur(20px)",
    opacity: 0
  },
  center: {
    filter: "blur(0px)",
    opacity: 1
  },
  exit: {
    filter: "blur(20px)",
    opacity: 0
  }
};

// 获取对应类型的动画变体
function getVariants(type: TransitionType): Variants {
  switch (type) {
    case "slide": return slideVariants;
    case "fade": return fadeVariants;
    case "scale": return scaleVariants;
    case "flip": return flipVariants;
    case "wipe": return wipeVariants;
    case "dissolve": return dissolveVariants;
    default: return slideVariants;
  }
}

// 章节过渡容器组件
interface ChapterTransitionContainerProps {
  children: ReactNode;
  chapterKey: string;
  direction?: TransitionDirection;
}

export function ChapterTransitionContainer({ 
  children, 
  chapterKey, 
  direction = "forward" 
}: ChapterTransitionContainerProps) {
  const { transitionConfig } = useChapterTransition();
  const variants = getVariants(transitionConfig.type);
  
  return (
    <AnimatePresence mode="wait" custom={direction}>
      <motion.div
        key={chapterKey}
        custom={direction}
        variants={variants}
        initial="enter"
        animate="center"
        exit="exit"
        transition={{
          duration: transitionConfig.duration,
          ease: transitionConfig.easing as any,
          staggerChildren: transitionConfig.stagger
        }}
        className="w-full h-full"
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}

// 章节过渡覆盖层组件
export function ChapterTransitionOverlay() {
  const { isTransitioning, transitionConfig } = useChapterTransition();
  
  return (
    <AnimatePresence>
      {isTransitioning && (
        <motion.div
          className="fixed inset-0 z-50 bg-[#f8fafc] flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: transitionConfig.duration / 2 }}
        >
          <motion.div
            className="w-16 h-16 border-4 border-[#007AFF] border-t-transparent rounded-full"
            animate={{ rotate: 360 }}
            transition={{
              duration: 1,
              repeat: Infinity,
              ease: "linear"
            }}
          />
          <div className="absolute bottom-10 text-[#1e293b] font-mono text-sm">
            正在加载章节...
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// 章节过渡导航组件
interface ChapterTransitionNavigationProps {
  currentChapter: number;
  totalChapters: number;
  onPreviousChapter?: () => void;
  onNextChapter?: () => void;
  onChapterSelect?: (chapter: number) => void;
}

export function ChapterTransitionNavigation({
  currentChapter,
  totalChapters,
  onPreviousChapter,
  onNextChapter,
  onChapterSelect
}: ChapterTransitionNavigationProps) {
  const { isTransitioning, startTransition } = useChapterTransition();
  
  const handlePreviousChapter = () => {
    if (isTransitioning || currentChapter <= 1) return;
    
    startTransition(currentChapter, currentChapter - 1, () => {
      if (onPreviousChapter) onPreviousChapter();
    });
  };
  
  const handleNextChapter = () => {
    if (isTransitioning || currentChapter >= totalChapters) return;
    
    startTransition(currentChapter, currentChapter + 1, () => {
      if (onNextChapter) onNextChapter();
    });
  };
  
  const handleChapterSelect = (chapter: number) => {
    if (isTransitioning || chapter === currentChapter) return;
    
    startTransition(currentChapter, chapter, () => {
      if (onChapterSelect) onChapterSelect(chapter);
    });
  };
  
  return (
    <div className="flex items-center justify-between">
      <button
        onClick={handlePreviousChapter}
        disabled={currentChapter <= 1 || isTransitioning}
        className={`px-4 py-2 rounded-lg font-mono text-sm transition-all ${
          currentChapter <= 1 || isTransitioning
            ? "bg-gray-100 text-gray-400 cursor-not-allowed"
            : "bg-white text-[#1e293b] border border-gray-200 hover:bg-[#f8fafc] hover:border-[#007AFF]"
        }`}
      >
        ← 上一章
      </button>
      
      <div className="flex items-center space-x-2">
        <span className="font-mono text-sm text-[#1e293b]">
          {currentChapter} / {totalChapters}
        </span>
        
        <div className="flex space-x-1">
          {Array.from({ length: totalChapters }, (_, i) => i + 1).map(chapter => (
            <button
              key={chapter}
              onClick={() => handleChapterSelect(chapter)}
              disabled={isTransitioning}
              className={`w-2 h-2 rounded-full transition-all ${
                chapter === currentChapter
                  ? "bg-[#007AFF] w-6"
                  : "bg-gray-300 hover:bg-gray-400"
              }`}
              aria-label={`跳转到第${chapter}章`}
            />
          ))}
        </div>
      </div>
      
      <button
        onClick={handleNextChapter}
        disabled={currentChapter >= totalChapters || isTransitioning}
        className={`px-4 py-2 rounded-lg font-mono text-sm transition-all ${
          currentChapter >= totalChapters || isTransitioning
            ? "bg-gray-100 text-gray-400 cursor-not-allowed"
            : "bg-white text-[#1e293b] border border-gray-200 hover:bg-[#f8fafc] hover:border-[#007AFF]"
        }`}
      >
        下一章 →
      </button>
    </div>
  );
}

// 章节过渡设置组件
export function ChapterTransitionSettings() {
  const { transitionConfig, setTransitionConfig } = useChapterTransition();
  
  const transitionTypes: { value: TransitionType; label: string }[] = [
    { value: "slide", label: "滑动" },
    { value: "fade", label: "淡入淡出" },
    { value: "flip", label: "翻转" },
    { value: "scale", label: "缩放" },
    { value: "wipe", label: "擦除" },
    { value: "dissolve", label: "溶解" }
  ];
  
  return (
    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
      <h3 className="font-sans text-sm font-semibold mb-3">章节过渡设置</h3>
      
      <div className="space-y-3">
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">
            过渡类型
          </label>
          <select
            value={transitionConfig.type}
            onChange={(e) => setTransitionConfig({ type: e.target.value as TransitionType })}
            className="w-full px-2 py-1 text-xs border border-gray-300 rounded"
          >
            {transitionTypes.map(type => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
        </div>
        
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">
            过渡时长: {transitionConfig.duration}s
          </label>
          <input
            type="range"
            min="0.2"
            max="2"
            step="0.1"
            value={transitionConfig.duration}
            onChange={(e) => setTransitionConfig({ duration: parseFloat(e.target.value) })}
            className="w-full"
          />
        </div>
      </div>
    </div>
  );
}