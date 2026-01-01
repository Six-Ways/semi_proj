"use client";

import React, { useState, useEffect } from "react";
import { Sun, Moon } from "lucide-react";
import { useAnalytics } from "@/hooks/useAnalytics";

interface ThemeToggleProps {
  className?: string;
}

export function ThemeToggle({ className = "" }: ThemeToggleProps) {
  const { trackSettingChange } = useAnalytics();
  
  // 主题状态：light, dark, system
  // SSR安全的初始状态
  const [theme, setTheme] = useState<string>("system");

  // 客户端初始化
  useEffect(() => {
    // 从localStorage获取主题偏好
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) {
      setTheme(savedTheme);
    }
  }, []);

  // 监听主题变化，更新document
  useEffect(() => {
    const root = document.documentElement;
    
    // 移除之前的主题类
    root.classList.remove("light", "dark");
    
    if (theme === "system") {
      // 系统主题检测
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
      root.classList.add(systemTheme);
    } else {
      // 手动主题
      root.classList.add(theme);
    }
    
    // 保存主题偏好
    localStorage.setItem("theme", theme);
    
    // 跟踪主题变化
    trackSettingChange('theme', theme);
  }, [theme, trackSettingChange]);

  // 切换主题
  const toggleTheme = () => {
    setTheme((prev) => {
      if (prev === "light") return "dark";
      if (prev === "dark") return "system";
      return "light";
    });
  };

  // 获取当前显示的主题图标
  const getCurrentTheme = () => {
    if (theme === "system") {
      // 确保只在客户端环境中访问window
      if (typeof window !== 'undefined') {
        return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
      }
      // 服务器端默认返回light
      return "light";
    }
    return theme;
  };

  return (
    <button
      onClick={toggleTheme}
      className={`flex items-center justify-center p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors ${className}`}
      aria-label={`切换到${getCurrentTheme() === "light" ? "深色" : "浅色"}模式`}
      title={`切换到${getCurrentTheme() === "light" ? "深色" : "浅色"}模式`}
    >
      {getCurrentTheme() === "light" ? (
        <Moon className="h-5 w-5" />
      ) : (
        <Sun className="h-5 w-5" />
      )}
    </button>
  );
}
