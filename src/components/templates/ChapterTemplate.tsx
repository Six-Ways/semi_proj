"use client";

import React, { useState, useEffect, useRef } from "react";
import { ChapterTheme, getChapterTheme } from '@/lib/chapterThemes';
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import { ChevronLeft, ChevronRight, BookOpen, Target, Lightbulb, CheckCircle, ArrowRight, Brain, Zap, Link as LinkIcon, X } from "lucide-react";
import Link from "next/link";
import { ChapterNavigation } from "./ChapterNavigation";
import { 
  ScrollAnimationContainer, 
  ScrollText, 
  ScrollIndicator,
  ScrollProgressBar
} from "./ScrollAnimation";
import { SyncProvider, SyncableFormula, SyncableText, SyncableVisualization, SyncableKeyword } from "./SyncSystem";
import { 
  ChapterTransitionProvider, 
  ChapterTransitionContainer, 
  ChapterTransitionNavigation,
  useChapterTransition 
} from "./ChapterTransition";
import { DefaultSkipLinks } from "@/components/ui/SkipLink";
import { 
  useFocusManagement, 
  useKeyboardNavigation, 
  useScreenReaderAnnouncement, 
  useReducedMotion,
  ARIA_ROLES,
  generateId,
  generateHeadingId
} from "@/utils/accessibility";

// 目录项类型
interface TocItem {
  level: number;
  text: string;
  id: string;
}

// 章节主题类型


// 章节模板组件的属性接口
interface ChapterTemplateProps {
  // 标题
  title: string;
  chapterNumber: string;
  
  // 本章逻辑位
  logicalPosition: string;
  
  // 章节目标
  objectives: string[];
  
  // 核心内容
  coreContent: string[];
  
  // 关键词
  keywords: string[];
  
  // 前置认知提示
  prerequisitePrompt: string;
  
  // 起手式
  openingLine: string;
  
  // 正文
  mainContent: Array<{
    title?: string;
    content: string;
    visualIndex?: string;
  }>;
  
  // 章节逻辑链
  logicalChain: string;
  
  // 本章小结
  chapterSummary: string;
  
  // 欲知后事如何且听下回分解
  nextChapterPreview: string;
  
  // 宗门心法
  sectMentality: {
    overview: string;
    breakthrough: string[];
    corePrinciple: string;
  };
  
  // 目录
  toc: TocItem[];
  
  // 子组件（用于MDX内容）
  children?: React.ReactNode;
  
  // 导航回调
  onPreviousChapter?: () => void;
  onNextChapter?: () => void;
  onChapterSelect?: (chapter: number) => void;
  
  // 章节主题
  theme?: ChapterTheme;
}

export function ChapterTemplate({
  title,
  chapterNumber,
  logicalPosition,
  objectives,
  coreContent,
  keywords,
  prerequisitePrompt,
  openingLine,
  mainContent,
  logicalChain,
  chapterSummary,
  nextChapterPreview,
  sectMentality,
  toc,
  children,
  onPreviousChapter,
  onNextChapter,
  onChapterSelect,
  theme: customTheme
}: ChapterTemplateProps) {
  // 使用传入的自定义主题或默认主题
  const theme = customTheme || getChapterTheme('default');
  // 状态管理
  const [activeKeyword, setActiveKeyword] = useState<string | null>(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isContentFocused, setIsContentFocused] = useState(false);
  // 目录显示状态
  const [isTocOpen, setIsTocOpen] = useState(false);
  // 滚动方向和位置状态
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isHeaderVisible, setIsHeaderVisible] = useState(true);
  const [scrollDirection, setScrollDirection] = useState<'up' | 'down'>('down');
  // 字数统计状态
  const [totalWords, setTotalWords] = useState(0);
  const [currentWordCount, setCurrentWordCount] = useState(0);
  // 内容引用，用于计算字数
  const contentRef = useRef<HTMLDivElement>(null);
  // 滑动状态
  const [swipeProgress, setSwipeProgress] = useState(0);
  const [isSwiping, setIsSwiping] = useState(false);
  // 目录位置状态 - 靠近页面顶部，间距不超过20px
  const [tocTop, setTocTop] = useState(20); // 默认靠近顶部，间距20px
  
  // 无障碍功能
  const prefersReducedMotion = useReducedMotion();
  const { announce, AnnouncementComponent } = useScreenReaderAnnouncement();
  const { elementRef: mainContentRef, trapFocus } = useFocusManagement();
  
  // 滚动相关
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollY } = useScroll();
  const scrollYProgress = useTransform(scrollY, [0, 1000], [0, 1]);
  
  // 计算总字数
  useEffect(() => {
    if (contentRef.current) {
      const textContent = contentRef.current.textContent || '';
      // 简单的字数统计，实际项目中可能需要更精确的算法
      const wordCount = textContent.trim().split(/\s+/).length;
      setTotalWords(wordCount);
    }
  }, [children]);

  // 滚动进度更新和header显示控制
  useEffect(() => {
    const unsubscribe = scrollY.onChange((latest) => {
      // 计算滚动方向
      const direction = latest > lastScrollY ? 'down' : 'up';
      setScrollDirection(direction);
      
      // 计算滚动进度
      const progress = Math.min(latest / 1000, 1);
      setScrollProgress(progress);
      
      // 当滚动到正文区域时，让固定模板略微半透明
      setIsContentFocused(progress > 0.2 && progress < 0.8);
      
      // 计算当前阅读字数
      if (contentRef.current && totalWords > 0) {
        const currentWord = Math.round(progress * totalWords);
        setCurrentWordCount(currentWord);
      }
      
      // 为屏幕阅读器公告当前阅读进度
      if (Math.round(progress * 100) % 25 === 0) { // 每25%公告一次
        const progressPercent = Math.round(progress * 100);
        announce(`章节阅读进度：${progressPercent}%`);
      }
      
      // 控制header显示/隐藏
      // 只有当滚动距离超过50px且方向向下时才隐藏
      // 当方向向上时显示
      if (direction === 'down' && latest - lastScrollY > 2 && latest > 50) {
        setIsHeaderVisible(false);
      } else if (direction === 'up' && lastScrollY - latest > 2) {
        setIsHeaderVisible(true);
      }
      
      // 固定目录位置在靠近顶部区域，间距不超过20px
      // 移除根据滚动位置调整top值的逻辑，确保目录始终靠近顶部
      setTocTop(20); // 固定距离顶部20px
      
      // 阅读正文时自动隐藏目录
      // 当滚动时隐藏目录
      if (Math.abs(latest - lastScrollY) > 10) {
        setIsTocOpen(false);
      }
      
      // 更新上次滚动位置
      setLastScrollY(latest);
    });
    
    return unsubscribe;
  }, [scrollY, lastScrollY, announce, contentRef, totalWords]);
  
  // 点击正文区域时隐藏目录
  const handleMainContentClick = () => {
    setIsTocOpen(false);
  };
  
  // 生成唯一ID
  const mainContentId = generateId('main-content');
  const navigationId = generateId('navigation');

  // 处理拖拽开始
  const handleDragStart = () => {
    setIsSwiping(true);
  };
  
  // 处理拖拽中
  const handleDrag = (event: any, info: any) => {
    // 只有水平滑动才响应，避免干扰垂直滚动
    if (Math.abs(info.delta.x) > Math.abs(info.delta.y * 2)) {
      // 限制滑动距离在 -100 到 100 之间
      const progress = Math.max(-100, Math.min(100, info.delta.x));
      setSwipeProgress(progress);
    }
  };
  
  // 处理拖拽结束
  const handleDragEnd = (event: any, info: any) => {
    setIsSwiping(false);
    
    // 如果滑动距离超过阈值，触发导航
    const threshold = 50;
    if (info.offset.x < -threshold && onNextChapter) {
      // 向左滑动，下一章
      onNextChapter();
    } else if (info.offset.x > threshold && onPreviousChapter) {
      // 向右滑动，上一章
      onPreviousChapter();
    }
    
    // 重置滑动进度
    setSwipeProgress(0);
  };
  
  return <ChapterTransitionProvider>
      <ChapterTransitionContainer chapterKey={`chapter-${chapterNumber}`}>
        <SyncProvider>
          {/* 只渲染从MD文件中提取的内容 */}
          <div className="container mx-auto px-4 py-8 max-w-4xl">
            {children && children}
          </div>
        </SyncProvider>
      </ChapterTransitionContainer>
    </ChapterTransitionProvider>
}

export default ChapterTemplate;