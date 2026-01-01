import React, { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform, useSpring, MotionValue } from "framer-motion";

interface ScrollAnimationProps {
  children: React.ReactNode;
  className?: string;
}

// 滚动驱动的动画容器组件
export function ScrollAnimationContainer({ children, className = "" }: ScrollAnimationProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  // 创建平滑的动画值
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 400,
    damping: 40,
    restDelta: 0.001
  });

  // 根据滚动进度计算各种动画值
  const opacity = useTransform(smoothProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);
  const scale = useTransform(smoothProgress, [0, 0.2, 0.8, 1], [0.8, 1, 1, 0.8]);
  const y = useTransform(smoothProgress, [0, 0.2, 0.8, 1], [50, 0, 0, -50]);
  const rotateX = useTransform(smoothProgress, [0, 0.5, 1], [15, 0, -15]);

  return (
    <motion.div
      ref={containerRef}
      className={className}
      style={{
        opacity,
        scale,
        y,
        rotateX,
        transformPerspective: 1000
      }}
    >
      {children}
    </motion.div>
  );
}

// 视差滚动组件
interface ParallaxProps {
  children: React.ReactNode;
  speed?: number;
  className?: string;
}

export function Parallax({ children, speed = 0.5, className = "" }: ParallaxProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], [0, speed * 300]);

  return (
    <div ref={ref} className={className}>
      <motion.div style={{ y }}>
        {children}
      </motion.div>
    </div>
  );
}

// 滚动指示器组件
interface ScrollIndicatorProps {
  totalSections: number;
  currentSection: number;
  sectionLabels?: string[];
}

export function ScrollIndicator({ 
  totalSections, 
  currentSection, 
  sectionLabels = [] 
}: ScrollIndicatorProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsVisible(window.scrollY > 100);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <motion.div
      className="fixed right-8 top-1/2 transform -translate-y-1/2 z-50"
      initial={{ opacity: 0, x: 20 }}
      animate={{ 
        opacity: isVisible ? 1 : 0, 
        x: isVisible ? 0 : 20 
      }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex flex-col items-center space-y-3">
        {Array.from({ length: totalSections }).map((_, index) => (
          <button
            key={index}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              index === currentSection
                ? "bg-[#007AFF] scale-150"
                : "bg-gray-300 hover:bg-gray-400"
            }`}
            onClick={() => {
              // 滚动到对应章节
              const element = document.getElementById(`section-${index}`);
              if (element) {
                element.scrollIntoView({ behavior: "smooth" });
              }
            }}
            aria-label={`跳转到第 ${index + 1} 部分`}
          >
            {sectionLabels[index] && (
              <div className="absolute right-6 top-1/2 transform -translate-y-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                {sectionLabels[index]}
              </div>
            )}
          </button>
        ))}
      </div>
    </motion.div>
  );
}

// 滚动进度条组件
interface ScrollProgressBarProps {
  color?: string;
  height?: number;
  totalWords?: number;
  currentWordCount?: number;
  showPercentage?: boolean;
  showWordCount?: boolean;
}

export function ScrollProgressBar({ 
  color = "#007AFF", 
  height = 4, 
  totalWords = 0,
  currentWordCount = 0,
  showPercentage = true,
  showWordCount = false
}: ScrollProgressBarProps) {
  const { scrollYProgress } = useScroll();
  const [progress, setProgress] = useState(0);

  // 更新进度值
  useEffect(() => {
    const unsubscribe = scrollYProgress.onChange((latest) => {
      setProgress(latest);
    });
    return () => unsubscribe();
  }, [scrollYProgress]);

  // 处理点击事件，跳转到对应位置
  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const percentage = clickX / rect.width;
    const documentHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrollTo = percentage * documentHeight;
    
    window.scrollTo({ 
      top: scrollTo, 
      behavior: "smooth" 
    });
  };

  // 格式化字数显示
  const formatWordCount = (count: number) => {
    return count.toLocaleString();
  };

  return (
    <div 
      className="fixed top-0 left-0 right-0 z-50 cursor-pointer"
      onClick={handleProgressClick}
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(progress * 100)}
    >
      {/* 背景轨道 */}
      <div className="absolute inset-0 bg-gray-200 dark:bg-gray-700" style={{ height }} />
      
      {/* 进度条 */}
      <motion.div
        className="absolute inset-0"
        style={{
          backgroundColor: color,
          scaleX: scrollYProgress,
          transformOrigin: "left",
          height
        }}
      />
      
      {/* 进度指示器 */}
      <div className="absolute right-0 top-0 transform -translate-y-full mt-2 mr-4 flex items-center space-x-2">
        {showPercentage && (
          <span className="text-xs font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 px-2 py-1 rounded shadow-md">
            {Math.round(progress * 100)}%
          </span>
        )}
        {showWordCount && totalWords > 0 && (
          <span className="text-xs font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 px-2 py-1 rounded shadow-md">
            {formatWordCount(currentWordCount)} / {formatWordCount(totalWords)}
          </span>
        )}
      </div>
    </div>
  );
}

// 滚动触发的文本动画
interface ScrollTextProps {
  children: React.ReactNode;
  delay?: number;
  duration?: number;
  className?: string;
}

export function ScrollText({ 
  children, 
  delay = 0, 
  duration = 0.5, 
  className = "" 
}: ScrollTextProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 0.9", "end 0.1"]
  });

  const opacity = useTransform(scrollYProgress, [0, 0.5, 1], [0, 1, 0]);
  const y = useTransform(scrollYProgress, [0, 0.5, 1], [30, 0, -30]);

  return (
    <motion.div
      ref={ref}
      className={className}
      style={{
        opacity,
        y,
        transition: `opacity ${duration}s ease-out ${delay}s`
      }}
    >
      {children}
    </motion.div>
  );
}

// 滚动触发的图片动画
import { ResponsiveImage } from "@/components/ui/ResponsiveImage";

interface ScrollImageProps {
  src: string;
  alt: string;
  className?: string;
  aspectRatio?: number;
  priority?: boolean;
  lazy?: boolean;
}

export function ScrollImage({ src, alt, className = "", aspectRatio = 16/9, priority = false, lazy = true }: ScrollImageProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });

  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.8, 1, 1.2]);
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);

  return (
    <motion.div
      ref={ref}
      className={`overflow-hidden ${className}`}
      style={{ opacity }}
    >
      <motion.div style={{ scale }}>
        <ResponsiveImage
          src={src}
          alt={alt}
          className="w-full h-full"
          aspectRatio={aspectRatio}
          priority={priority}
          lazy={lazy}
        />
      </motion.div>
    </motion.div>
  );
}