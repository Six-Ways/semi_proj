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
}

export function ScrollProgressBar({ 
  color = "#007AFF", 
  height = 4 
}: ScrollProgressBarProps) {
  const { scrollYProgress } = useScroll();

  return (
    <motion.div
      className="fixed top-0 left-0 right-0 z-50"
      style={{ height }}
    >
      <motion.div
        className="h-full"
        style={{
          backgroundColor: color,
          scaleX: scrollYProgress,
          transformOrigin: "left"
        }}
      />
    </motion.div>
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
interface ScrollImageProps {
  src: string;
  alt: string;
  className?: string;
}

export function ScrollImage({ src, alt, className = "" }: ScrollImageProps) {
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
      <motion.img
        src={src}
        alt={alt}
        className="w-full h-full object-cover"
        style={{ scale }}
      />
    </motion.div>
  );
}