"use client";

import React, { useState, useRef, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Zap, 
  Activity, 
  Gauge, 
  Thermometer, 
  Clock, 
  Volume2,
  Power,
  Settings,
  RotateCcw,
  Play,
  Pause
} from "lucide-react";

// 实验室风格滑块组件
interface LabSliderProps {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  unit?: string;
  precision?: number;
  color?: "blue" | "green" | "red" | "purple" | "yellow";
  size?: "sm" | "md" | "lg";
  onChange: (value: number) => void;
  disabled?: boolean;
  showScale?: boolean;
  description?: string;
}

export function LabSlider({
  label,
  value,
  min,
  max,
  step = 0.1,
  unit = "",
  precision = 1,
  color = "blue",
  size = "md",
  onChange,
  disabled = false,
  showScale = true,
  description,
}: LabSliderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const sliderRef = useRef<HTMLDivElement>(null);
  
  // 颜色映射
  const colorMap = {
    blue: "from-blue-400 to-blue-600 border-blue-500",
    green: "from-green-400 to-green-600 border-green-500",
    red: "from-red-400 to-red-600 border-red-500",
    purple: "from-purple-400 to-purple-600 border-purple-500",
    yellow: "from-yellow-400 to-yellow-600 border-yellow-500",
  };
  
  // 尺寸映射
  const sizeMap = {
    sm: "h-6",
    md: "h-8",
    lg: "h-10",
  };
  
  // 处理值变化
  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(parseFloat(e.target.value));
  }, [onChange]);
  
  // 计算填充百分比
  const fillPercentage = ((value - min) / (max - min)) * 100;
  
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-gray-700">{label}</label>
        <div className="flex items-center space-x-1">
          <span className={`font-mono text-sm ${
            isDragging ? "text-gray-900" : "text-gray-500"
          } transition-colors`}>
            {value.toFixed(precision)}
          </span>
          {unit && <span className="text-xs text-gray-500">{unit}</span>}
        </div>
      </div>
      
      {description && (
        <p className="text-xs text-gray-500">{description}</p>
      )}
      
      <div 
        ref={sliderRef}
        className={`relative ${sizeMap[size]} bg-gray-100 rounded-lg border-2 ${
          isDragging ? colorMap[color] : "border-gray-300"
        } transition-all duration-200 overflow-hidden`}
      >
        {/* 背景网格 */}
        {showScale && (
          <div className="absolute inset-0 flex items-center justify-between px-2">
            {[...Array(5)].map((_, i) => (
              <div 
                key={i} 
                className="w-0.5 h-3/4 bg-gray-300 opacity-50"
              ></div>
            ))}
          </div>
        )}
        
        {/* 填充区域 */}
        <motion.div 
          className={`absolute top-0 left-0 h-full bg-gradient-to-r ${colorMap[color]} opacity-70`}
          style={{ width: `${fillPercentage}%` }}
          transition={{ duration: 0.2 }}
        ></motion.div>
        
        {/* 滑块输入 */}
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={handleChange}
          disabled={disabled}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          onMouseDown={() => setIsDragging(true)}
          onMouseUp={() => setIsDragging(false)}
          onMouseLeave={() => setIsDragging(false)}
        />
        
        {/* 滑块手柄 */}
        <motion.div 
          className={`absolute top-1/2 -translate-y-1/2 w-5 h-5 bg-white border-2 rounded-full shadow-md ${
            isDragging ? colorMap[color] : "border-gray-400"
          } transition-all duration-200`}
          style={{ left: `calc(${fillPercentage}% - 10px)` }}
          whileHover={{ scale: 1.2 }}
          whileTap={{ scale: 0.9 }}
        ></motion.div>
      </div>
      
      {/* 刻度标签 */}
      {showScale && (
        <div className="flex justify-between text-xs text-gray-500 font-mono">
          <span>{min.toFixed(precision)}</span>
          <span>{((min + max) / 2).toFixed(precision)}</span>
          <span>{max.toFixed(precision)}</span>
        </div>
      )}
    </div>
  );
}

// 实验室风格开关组件
interface LabSwitchProps {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
  size?: "sm" | "md" | "lg";
  color?: "blue" | "green" | "red" | "purple" | "yellow";
  description?: string;
  icon?: React.ReactNode;
}

export function LabSwitch({
  label,
  checked,
  onChange,
  disabled = false,
  size = "md",
  color = "blue",
  description,
  icon,
}: LabSwitchProps) {
  const [isAnimating, setIsAnimating] = useState(false);
  
  // 颜色映射
  const colorMap = {
    blue: "bg-blue-500 border-blue-600",
    green: "bg-green-500 border-green-600",
    red: "bg-red-500 border-red-600",
    purple: "bg-purple-500 border-purple-600",
    yellow: "bg-yellow-500 border-yellow-600",
  };
  
  // 尺寸映射
  const sizeMap = {
    sm: { width: "w-10", height: "h-5", dot: "w-3 h-3" },
    md: { width: "w-12", height: "h-6", dot: "w-4 h-4" },
    lg: { width: "w-14", height: "h-7", dot: "w-5 h-5" },
  };
  
  const currentSize = sizeMap[size];
  
  const handleToggle = () => {
    if (disabled) return;
    setIsAnimating(true);
    onChange(!checked);
    setTimeout(() => setIsAnimating(false), 300);
  };
  
  return (
    <div className="flex items-center space-x-3">
      {icon && (
        <div className={`text-gray-600 ${disabled ? "opacity-50" : ""}`}>
          {icon}
        </div>
      )}
      
      <div className="flex-1">
        <div className="flex items-center justify-between">
          <label className={`text-sm font-medium ${
            disabled ? "text-gray-400" : "text-gray-700"
          }`}>
            {label}
          </label>
          
          <button
            type="button"
            onClick={handleToggle}
            disabled={disabled}
            className={`relative ${currentSize.width} ${currentSize.height} rounded-full border-2 ${
              checked ? colorMap[color] : "bg-gray-200 border-gray-300"
            } transition-all duration-300 ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
            aria-pressed={checked}
            role="switch"
          >
            <motion.div
              className={`absolute top-1/2 -translate-y-1/2 ${currentSize.dot} bg-white rounded-full shadow-md border ${
                checked ? "border-gray-200" : "border-gray-400"
              }`}
              animate={{ x: checked ? (size === "sm" ? 20 : size === "md" ? 24 : 28) : 0 }}
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
            ></motion.div>
          </button>
        </div>
        
        {description && (
          <p className="text-xs text-gray-500 mt-1">{description}</p>
        )}
      </div>
    </div>
  );
}

// 实验室风格按钮组组件
interface LabButtonGroupProps {
  label: string;
  options: Array<{
    value: string;
    label: string;
    icon?: React.ReactNode;
    description?: string;
  }>;
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  size?: "sm" | "md" | "lg";
  color?: "blue" | "green" | "red" | "purple" | "yellow";
  description?: string;
}

export function LabButtonGroup({
  label,
  options,
  value,
  onChange,
  disabled = false,
  size = "md",
  color = "blue",
  description,
}: LabButtonGroupProps) {
  // 颜色映射
  const colorMap = {
    blue: "bg-blue-500 border-blue-600 text-white",
    green: "bg-green-500 border-green-600 text-white",
    red: "bg-red-500 border-red-600 text-white",
    purple: "bg-purple-500 border-purple-600 text-white",
    yellow: "bg-yellow-500 border-yellow-600 text-white",
  };
  
  // 尺寸映射
  const sizeMap = {
    sm: "px-2 py-1 text-xs",
    md: "px-3 py-1.5 text-sm",
    lg: "px-4 py-2 text-base",
  };
  
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className={`text-sm font-medium ${
          disabled ? "text-gray-400" : "text-gray-700"
        }`}>
          {label}
        </label>
      </div>
      
      {description && (
        <p className="text-xs text-gray-500">{description}</p>
      )}
      
      <div className="flex flex-wrap gap-2">
        {options.map((option) => (
          <button
            key={option.value}
            onClick={() => onChange(option.value)}
            disabled={disabled}
            className={`flex items-center space-x-1 border-2 rounded-md transition-all duration-200 ${
              value === option.value
                ? colorMap[color]
                : "bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
            } ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"} ${sizeMap[size]}`}
          >
            {option.icon && <span>{option.icon}</span>}
            <span>{option.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

// 实验室仪表盘组件
interface LabGaugeProps {
  label: string;
  value: number;
  min: number;
  max: number;
  unit?: string;
  precision?: number;
  color?: "blue" | "green" | "red" | "purple" | "yellow";
  size?: "sm" | "md" | "lg";
  thresholds?: Array<{ value: number; color: string; label?: string }>;
  description?: string;
}

export function LabGauge({
  label,
  value,
  min,
  max,
  unit = "",
  precision = 1,
  color = "blue",
  size = "md",
  thresholds,
  description,
}: LabGaugeProps) {
  // 尺寸映射
  const sizeMap = {
    sm: { width: 120, height: 60, strokeWidth: 8 },
    md: { width: 160, height: 80, strokeWidth: 10 },
    lg: { width: 200, height: 100, strokeWidth: 12 },
  };
  
  const currentSize = sizeMap[size];
  const percentage = ((value - min) / (max - min)) * 100;
  const angle = -90 + (percentage * 180) / 100;
  
  // 确定颜色
  let gaugeColor = color;
  if (thresholds) {
    for (const threshold of thresholds) {
      if (value >= threshold.value) {
        gaugeColor = threshold.color as any;
        break;
      }
    }
  }
  
  // 颜色映射
  const colorMap = {
    blue: "#3B82F6",
    green: "#10B981",
    red: "#EF4444",
    purple: "#8B5CF6",
    yellow: "#F59E0B",
  };
  
  return (
    <div className="flex flex-col items-center space-y-2">
      <div className="flex items-center justify-between w-full">
        <label className="text-sm font-medium text-gray-700">{label}</label>
        <div className="flex items-center space-x-1">
          <span className="font-mono text-sm text-gray-900">
            {value.toFixed(precision)}
          </span>
          {unit && <span className="text-xs text-gray-500">{unit}</span>}
        </div>
      </div>
      
      {description && (
        <p className="text-xs text-gray-500 text-center">{description}</p>
      )}
      
      <div className="relative">
        <svg
          width={currentSize.width}
          height={currentSize.height}
          viewBox={`0 0 ${currentSize.width} ${currentSize.height}`}
          className="overflow-visible"
        >
          {/* 背景弧 */}
          <path
            d={`M ${currentSize.width * 0.1} ${currentSize.height} A ${currentSize.width * 0.4} ${currentSize.width * 0.4} 0 0 1 ${currentSize.width * 0.9} ${currentSize.height}`}
            fill="none"
            stroke="#E5E7EB"
            strokeWidth={currentSize.strokeWidth}
            strokeLinecap="round"
          />
          
          {/* 值弧 */}
          <motion.path
            d={`M ${currentSize.width * 0.1} ${currentSize.height} A ${currentSize.width * 0.4} ${currentSize.width * 0.4} 0 0 1 ${currentSize.width * 0.9} ${currentSize.height}`}
            fill="none"
            stroke={colorMap[gaugeColor]}
            strokeWidth={currentSize.strokeWidth}
            strokeLinecap="round"
            strokeDasharray={`${percentage * 2.5} 250`}
            initial={{ strokeDasharray: "0 250" }}
            animate={{ strokeDasharray: `${percentage * 2.5} 250` }}
            transition={{ duration: 1, ease: "easeInOut" }}
          />
          
          {/* 指针 */}
          <motion.g
            transformOrigin={`${currentSize.width / 2} ${currentSize.height}`}
            animate={{ rotate: angle }}
            transition={{ duration: 1, ease: "easeInOut" }}
          >
            <circle
              cx={currentSize.width / 2}
              cy={currentSize.height}
              r="4"
              fill={colorMap[gaugeColor]}
            />
            <line
              x1={currentSize.width / 2}
              y1={currentSize.height}
              x2={currentSize.width / 2}
              y2={currentSize.height * 0.3}
              stroke={colorMap[gaugeColor]}
              strokeWidth="2"
            />
          </motion.g>
        </svg>
        
        {/* 刻度标签 */}
        <div className="flex justify-between w-full mt-1 px-4">
          <span className="text-xs text-gray-500 font-mono">{min.toFixed(precision)}</span>
          <span className="text-xs text-gray-500 font-mono">{max.toFixed(precision)}</span>
        </div>
      </div>
      
      {/* 阈值指示器 */}
      {thresholds && (
        <div className="flex flex-wrap justify-center gap-2 mt-1">
          {thresholds.map((threshold, index) => (
            <div key={index} className="flex items-center space-x-1">
              <div
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: colorMap[threshold.color as keyof typeof colorMap] }}
              ></div>
              <span className="text-xs text-gray-600">
                {threshold.label || `≥ ${threshold.value.toFixed(precision)}`}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// 实验室控制面板组件
interface LabControlPanelProps {
  title: string;
  children: React.ReactNode;
  isExpanded?: boolean;
  onToggle?: () => void;
  className?: string;
}

export function LabControlPanel({
  title,
  children,
  isExpanded = true,
  onToggle,
  className = "",
}: LabControlPanelProps) {
  return (
    <div className={`bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden ${className}`}>
      <div
        className="flex items-center justify-between px-4 py-3 bg-gray-50 border-b border-gray-200 cursor-pointer"
        onClick={onToggle}
      >
        <h3 className="text-sm font-medium text-gray-900">{title}</h3>
        <motion.div
          animate={{ rotate: isExpanded ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronRight className="h-4 w-4 text-gray-500" />
        </motion.div>
      </div>
      
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="p-4 space-y-4">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// 实验室状态指示器组件
interface LabStatusIndicatorProps {
  status: "active" | "inactive" | "warning" | "error";
  label: string;
  value?: string;
  description?: string;
  size?: "sm" | "md" | "lg";
  animated?: boolean;
}

export function LabStatusIndicator({
  status,
  label,
  value,
  description,
  size = "md",
  animated = true,
}: LabStatusIndicatorProps) {
  // 状态映射
  const statusMap = {
    active: { bg: "bg-green-100", text: "text-green-800", dot: "bg-green-500", icon: Activity },
    inactive: { bg: "bg-gray-100", text: "text-gray-800", dot: "bg-gray-400", icon: Power },
    warning: { bg: "bg-yellow-100", text: "text-yellow-800", dot: "bg-yellow-500", icon: Gauge },
    error: { bg: "bg-red-100", text: "text-red-800", dot: "bg-red-500", icon: Zap },
  };
  
  const currentStatus = statusMap[status];
  const Icon = currentStatus.icon;
  
  // 尺寸映射
  const sizeMap = {
    sm: { dot: "w-2 h-2", icon: "w-3 h-3", text: "text-xs" },
    md: { dot: "w-3 h-3", icon: "w-4 h-4", text: "text-sm" },
    lg: { dot: "w-4 h-4", icon: "w-5 h-5", text: "text-base" },
  };
  
  const currentSize = sizeMap[size];
  
  return (
    <div className={`flex items-center space-x-2 p-2 rounded-lg ${currentStatus.bg}`}>
      <div className="flex items-center space-x-2">
        <div className={`relative ${currentSize.dot} ${currentStatus.dot} rounded-full ${
          animated && status === "active" ? "animate-pulse" : ""
        }`}></div>
        <Icon className={`${currentSize.icon} ${currentStatus.text}`} />
      </div>
      
      <div className="flex-1">
        <div className={`font-medium ${currentStatus.text} ${currentSize.text}`}>
          {label}
        </div>
        
        {value && (
          <div className={`font-mono ${currentStatus.text} ${currentSize.text}`}>
            {value}
          </div>
        )}
        
        {description && (
          <div className={`text-xs ${currentStatus.text} opacity-75`}>
            {description}
          </div>
        )}
      </div>
    </div>
  );
}

// 导出所有组件
export { ChevronRight } from "lucide-react";