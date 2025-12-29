"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion, useInView, useDragControls } from "framer-motion";
import { Play, Pause, RotateCcw, ZoomIn, ZoomOut, Maximize2, Download } from "lucide-react";

// 本托网格画布的属性接口
interface BentoGridCanvasProps {
  // 网格配置
  gridCols?: number; // 网格列数
  gridRows?: number; // 网格行数
  gap?: number; // 网格间距
  
  // 内容项配置
  items: Array<{
    id: string;
    title: string;
    type: "text" | "simulator" | "chart" | "formula" | "image" | "video";
    content: React.ReactNode;
    width?: number; // 占用的列数
    height?: number; // 占用的行数
    order?: number; // 排序顺序
  }>;
  
  // 交互配置
  enableDrag?: boolean; // 是否启用拖拽
  enableResize?: boolean; // 是否启用调整大小
  enableZoom?: boolean; // 是否启用缩放
  
  // 样式配置
  background?: string; // 背景色
  className?: string; // 自定义类名
}

// 网格项组件
interface GridItemProps {
  item: any;
  index: number;
  isDragging?: boolean;
  onDragStart?: (id: string) => void;
  onDragEnd?: (id: string, x: number, y: number) => void;
}

function GridItem({ item, index, isDragging, onDragStart, onDragEnd }: GridItemProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });
  const dragControls = useDragControls();
  
  // 根据类型设置不同的背景样式
  const getItemBackground = (type: string) => {
    switch (type) {
      case "text":
        return "bg-white";
      case "simulator":
        return "bg-gradient-to-br from-blue-50 to-indigo-50";
      case "chart":
        return "bg-gradient-to-br from-green-50 to-emerald-50";
      case "formula":
        return "bg-gradient-to-br from-purple-50 to-pink-50";
      case "image":
        return "bg-gradient-to-br from-yellow-50 to-orange-50";
      case "video":
        return "bg-gradient-to-br from-red-50 to-rose-50";
      default:
        return "bg-white";
    }
  };
  
  // 根据类型设置不同的边框样式
  const getItemBorder = (type: string) => {
    switch (type) {
      case "text":
        return "border-gray-200";
      case "simulator":
        return "border-blue-200";
      case "chart":
        return "border-green-200";
      case "formula":
        return "border-purple-200";
      case "image":
        return "border-yellow-200";
      case "video":
        return "border-red-200";
      default:
        return "border-gray-200";
    }
  };
  
  return (
    <motion.div
      ref={ref}
      className={`relative rounded-lg shadow-sm border ${getItemBackground(item.type)} ${getItemBorder(item.type)} overflow-hidden`}
      style={{
        gridColumn: `span ${item.width || 1}`,
        gridRow: `span ${item.height || 1}`,
        order: item.order || index,
      }}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ 
        opacity: isInView ? 1 : 0, 
        scale: isInView ? 1 : 0.9,
        zIndex: isDragging ? 50 : 1
      }}
      transition={{ 
        duration: 0.5,
        delay: index * 0.1,
        type: "spring",
        stiffness: 100
      }}
      whileHover={{ 
        y: -5, 
        boxShadow: "0 10px 30px rgba(0, 0, 0, 0.1)",
        transition: { duration: 0.2 }
      }}
      drag={isDragging ? true : false}
      dragControls={dragControls}
      dragElastic={0.1}
      onDragStart={() => onDragStart?.(item.id)}
      onDragEnd={(event, info) => {
        if (ref.current) {
          const rect = ref.current.getBoundingClientRect();
          onDragEnd?.(item.id, info.point.x, info.point.y);
        }
      }}
    >
      {/* 项标题栏 */}
      <div className="flex items-center justify-between p-3 border-b border-gray-100">
        <h3 className="font-sans text-sm font-medium text-gray-700">{item.title}</h3>
        
        {/* 根据类型显示不同的图标 */}
        <div className="flex items-center space-x-1">
          {item.type === "simulator" && (
            <button className="p-1 rounded hover:bg-gray-100 transition-colors">
              <Play className="h-3 w-3 text-gray-500" />
            </button>
          )}
          
          {item.type === "chart" && (
            <button className="p-1 rounded hover:bg-gray-100 transition-colors">
              <ZoomIn className="h-3 w-3 text-gray-500" />
            </button>
          )}
          
          <button className="p-1 rounded hover:bg-gray-100 transition-colors">
            <Maximize2 className="h-3 w-3 text-gray-500" />
          </button>
        </div>
      </div>
      
      {/* 项内容区域 */}
      <div className="p-4 h-full">
        {item.content}
      </div>
    </motion.div>
  );
}

export function BentoGridCanvas({
  gridCols = 12,
  gridRows = 8,
  gap = 16,
  items,
  enableDrag = true,
  enableResize = true,
  enableZoom = true,
  background = "#f8fafc",
  className = "",
}: BentoGridCanvasProps) {
  const [zoomLevel, setZoomLevel] = useState(1);
  const [isDragging, setIsDragging] = useState(false);
  const [draggedItemId, setDraggedItemId] = useState<string | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  
  const canvasRef = useRef<HTMLDivElement>(null);
  
  // 处理拖拽开始
  const handleDragStart = (id: string) => {
    if (enableDrag) {
      setIsDragging(true);
      setDraggedItemId(id);
    }
  };
  
  // 处理拖拽结束
  const handleDragEnd = (id: string, x: number, y: number) => {
    if (enableDrag) {
      setIsDragging(false);
      setDraggedItemId(null);
      // 这里可以添加逻辑来更新项目的位置
    }
  };
  
  // 处理缩放
  const handleZoomIn = () => {
    if (enableZoom) {
      setZoomLevel(prev => Math.min(prev + 0.1, 2));
    }
  };
  
  const handleZoomOut = () => {
    if (enableZoom) {
      setZoomLevel(prev => Math.max(prev - 0.1, 0.5));
    }
  };
  
  const handleResetZoom = () => {
    if (enableZoom) {
      setZoomLevel(1);
    }
  };
  
  // 处理全屏
  const handleFullscreen = () => {
    if (!isFullscreen && canvasRef.current) {
      canvasRef.current.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
    setIsFullscreen(!isFullscreen);
  };
  
  // 处理导出
  const handleExport = () => {
    // 这里可以添加导出功能
    console.log("Export canvas");
  };
  
  return (
    <div 
      ref={canvasRef}
      className={`relative w-full h-full ${className}`}
      style={{ backgroundColor: background }}
    >
      {/* 工具栏 */}
      <div className="absolute top-4 right-4 z-10 flex items-center space-x-2 bg-white rounded-lg shadow-md p-2">
        {enableZoom && (
          <>
            <button
              onClick={handleZoomOut}
              className="p-2 rounded hover:bg-gray-100 transition-colors"
              aria-label="缩小"
            >
              <ZoomOut className="h-4 w-4" />
            </button>
            
            <div className="px-2 text-sm font-mono">
              {Math.round(zoomLevel * 100)}%
            </div>
            
            <button
              onClick={handleZoomIn}
              className="p-2 rounded hover:bg-gray-100 transition-colors"
              aria-label="放大"
            >
              <ZoomIn className="h-4 w-4" />
            </button>
            
            <button
              onClick={handleResetZoom}
              className="p-2 rounded hover:bg-gray-100 transition-colors"
              aria-label="重置缩放"
            >
              <RotateCcw className="h-4 w-4" />
            </button>
          </>
        )}
        
        <div className="w-px h-6 bg-gray-200"></div>
        
        <button
          onClick={handleFullscreen}
          className="p-2 rounded hover:bg-gray-100 transition-colors"
          aria-label="全屏"
        >
          <Maximize2 className="h-4 w-4" />
        </button>
        
        <button
          onClick={handleExport}
          className="p-2 rounded hover:bg-gray-100 transition-colors"
          aria-label="导出"
        >
          <Download className="h-4 w-4" />
        </button>
      </div>
      
      {/* 网格容器 */}
      <div 
        className="w-full h-full p-6 overflow-auto"
        style={{ 
          transform: `scale(${zoomLevel})`,
          transformOrigin: "center center",
          transition: "transform 0.3s ease-out"
        }}
      >
        <div 
          className="grid w-full h-full"
          style={{
            gridTemplateColumns: `repeat(${gridCols}, minmax(0, 1fr))`,
            gridTemplateRows: `repeat(${gridRows}, minmax(0, 1fr))`,
            gap: `${gap}px`
          }}
        >
          {items.map((item, index) => (
            <GridItem
              key={item.id}
              item={item}
              index={index}
              isDragging={draggedItemId === item.id}
              onDragStart={handleDragStart}
              onDragEnd={handleDragEnd}
            />
          ))}
        </div>
      </div>
      
      {/* 拖拽时的遮罩 */}
      {isDragging && (
        <div className="absolute inset-0 bg-black bg-opacity-10 z-40 pointer-events-none"></div>
      )}
    </div>
  );
}