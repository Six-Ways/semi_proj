"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import { motion, useInView, useDragControls, AnimatePresence } from "framer-motion";
import { 
  Play, 
  Pause, 
  RotateCcw, 
  ZoomIn, 
  ZoomOut, 
  Maximize2, 
  Download, 
  Settings,
  Grid,
  List,
  Eye,
  Edit,
  Trash2,
  Plus,
  GripVertical
} from "lucide-react";

// Bento Grid 项类型定义
export type BentoItemType = 
  | "text" 
  | "simulator" 
  | "chart" 
  | "formula" 
  | "image" 
  | "video" 
  | "interactive"
  | "data"
  | "control";

// Bento Grid 项接口
export interface BentoItem {
  id: string;
  title: string;
  type: BentoItemType;
  content: React.ReactNode;
  width?: number; // 占用的列数 (1-12)
  height?: number; // 占用的行数 (1-8)
  order?: number; // 排序顺序
  category?: string; // 分类标签
  metadata?: Record<string, any>; // 额外元数据
  locked?: boolean; // 是否锁定位置
  hidden?: boolean; // 是否隐藏
  resizable?: boolean; // 是否可调整大小
  draggable?: boolean; // 是否可拖拽
}

// Bento Grid 布局配置接口
export interface BentoGridLayout {
  cols: number;
  rows: number;
  gap: number;
  padding: number;
  background?: string;
  aspectRatio?: string;
}

// Bento Grid 视图模式
export type BentoViewMode = "grid" | "list" | "masonry";

// Bento Grid 组件属性
interface BentoGridProps {
  // 布局配置
  layout?: Partial<BentoGridLayout>;
  
  // 内容项
  items: BentoItem[];
  
  // 交互配置
  enableDrag?: boolean;
  enableResize?: boolean;
  enableZoom?: boolean;
  enableReorder?: boolean;
  enableEdit?: boolean;
  enableDelete?: boolean;
  
  // 视图配置
  viewMode?: BentoViewMode;
  showToolbar?: boolean;
  showGridLines?: boolean;
  
  // 事件处理
  onItemUpdate?: (item: BentoItem) => void;
  onItemDelete?: (itemId: string) => void;
  onItemReorder?: (items: BentoItem[]) => void;
  onLayoutChange?: (layout: BentoGridLayout) => void;
  
  // 样式配置
  className?: string;
  itemClassName?: string;
}

// 默认布局配置
const defaultLayout: BentoGridLayout = {
  cols: 12,
  rows: 8,
  gap: 16,
  padding: 24,
  background: "#f8fafc",
  aspectRatio: "auto"
};

// Bento Grid 项组件
interface BentoGridItemProps {
  item: BentoItem;
  index: number;
  layout: BentoGridLayout;
  viewMode: BentoViewMode;
  isDragging?: boolean;
  isEditing?: boolean;
  isSelected?: boolean;
  showGridLines?: boolean;
  enableDrag?: boolean;
  enableResize?: boolean;
  enableEdit?: boolean;
  enableDelete?: boolean;
  onSelect?: (itemId: string) => void;
  onUpdate?: (item: BentoItem) => void;
  onDelete?: (itemId: string) => void;
  onDragStart?: (id: string) => void;
  onDragEnd?: (id: string, x: number, y: number) => void;
  itemClassName?: string;
}

function BentoGridItem({
  item,
  index,
  layout,
  viewMode,
  isDragging = false,
  isEditing = false,
  isSelected = false,
  showGridLines = false,
  enableDrag = true,
  enableResize = true,
  enableEdit = true,
  enableDelete = true,
  onSelect,
  onUpdate,
  onDelete,
  onDragStart,
  onDragEnd,
  itemClassName = ""
}: BentoGridItemProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });
  const dragControls = useDragControls();
  const [isHovered, setIsHovered] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [resizeDirection, setResizeDirection] = useState<"horizontal" | "vertical" | "both" | null>(null);
  
  // 根据类型设置不同的背景样式
  const getItemBackground = (type: BentoItemType) => {
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
      case "interactive":
        return "bg-gradient-to-br from-cyan-50 to-blue-50";
      case "data":
        return "bg-gradient-to-br from-gray-50 to-slate-50";
      case "control":
        return "bg-gradient-to-br from-amber-50 to-orange-50";
      default:
        return "bg-white";
    }
  };
  
  // 根据类型设置不同的边框样式
  const getItemBorder = (type: BentoItemType) => {
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
      case "interactive":
        return "border-cyan-200";
      case "data":
        return "border-gray-300";
      case "control":
        return "border-amber-200";
      default:
        return "border-gray-200";
    }
  };
  
  // 根据类型获取图标
  const getItemIcon = (type: BentoItemType) => {
    switch (type) {
      case "simulator":
        return <Play className="h-3 w-3" />;
      case "chart":
        return <ZoomIn className="h-3 w-3" />;
      case "formula":
        return <span className="text-xs font-mono">f(x)</span>;
      case "image":
        return <Eye className="h-3 w-3" />;
      case "video":
        return <Play className="h-3 w-3" />;
      case "interactive":
        return <Settings className="h-3 w-3" />;
      case "data":
        return <Grid className="h-3 w-3" />;
      case "control":
        return <Settings className="h-3 w-3" />;
      default:
        return null;
    }
  };
  
  // 计算网格样式
  const getGridStyle = () => {
    if (viewMode === "list") {
      return {
        gridColumn: `span ${layout.cols}`,
        gridRow: `span 1`,
      };
    }
    
    return {
      gridColumn: `span ${item.width || Math.ceil(layout.cols / 4)}`,
      gridRow: `span ${item.height || 2}`,
      order: item.order || index,
    };
  };
  
  // 处理拖拽开始
  const handleDragStart = () => {
    if (enableDrag && item.draggable !== false) {
      onDragStart?.(item.id);
    }
  };
  
  // 处理拖拽结束
  const handleDragEnd = (event: any, info: any) => {
    if (enableDrag && item.draggable !== false) {
      if (ref.current) {
        const rect = ref.current.getBoundingClientRect();
        onDragEnd?.(item.id, info.point.x, info.point.y);
      }
    }
  };
  
  // 处理选择
  const handleSelect = () => {
    onSelect?.(item.id);
  };
  
  // 处理删除
  const handleDelete = () => {
    if (enableDelete) {
      onDelete?.(item.id);
    }
  };
  
  // 处理编辑
  const handleEdit = () => {
    if (enableEdit) {
      // 这里可以打开编辑对话框
      console.log("Edit item:", item.id);
    }
  };
  
  return (
    <motion.div
      ref={ref}
      className={`relative rounded-lg shadow-sm border overflow-hidden ${getItemBackground(item.type)} ${getItemBorder(item.type)} ${itemClassName} ${
        isSelected ? "ring-2 ring-blue-500 ring-offset-2" : ""
      } ${showGridLines ? "border-dashed" : ""}`}
      style={getGridStyle()}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ 
        opacity: isInView ? 1 : 0, 
        scale: isInView ? 1 : 0.9,
        zIndex: isDragging ? 50 : isSelected ? 30 : 1
      }}
      transition={{ 
        duration: 0.5,
        delay: index * 0.05,
        type: "spring",
        stiffness: 100
      }}
      whileHover={{ 
        y: viewMode === "list" ? 0 : -5, 
        boxShadow: viewMode === "list" ? "0 2px 8px rgba(0, 0, 0, 0.05)" : "0 10px 30px rgba(0, 0, 0, 0.1)",
        transition: { duration: 0.2 }
      }}
      drag={enableDrag && item.draggable !== false ? "x" : false}
      dragControls={dragControls}
      dragElastic={0.1}
      dragMomentum={false}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onClick={handleSelect}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      layout
    >
      {/* 项标题栏 */}
      <div className="flex items-center justify-between p-3 border-b border-gray-100 bg-white bg-opacity-50">
        <div className="flex items-center space-x-2">
          {enableDrag && item.draggable !== false && (
            <div className="cursor-grab active:cursor-grabbing">
              <GripVertical className="h-3 w-3 text-gray-400" />
            </div>
          )}
          
          <h3 className="font-sans text-sm font-medium text-gray-700 truncate">{item.title}</h3>
          
          {item.category && (
            <span className="text-xs px-1.5 py-0.5 bg-gray-100 text-gray-600 rounded">
              {item.category}
            </span>
          )}
        </div>
        
        <div className="flex items-center space-x-1">
          {getItemIcon(item.type)}
          
          {(isHovered || isSelected) && (
            <>
              {enableEdit && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleEdit();
                  }}
                  className="p-1 rounded hover:bg-gray-100 transition-colors"
                  aria-label="编辑"
                >
                  <Edit className="h-3 w-3 text-gray-500" />
                </button>
              )}
              
              {enableDelete && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete();
                  }}
                  className="p-1 rounded hover:bg-red-100 transition-colors"
                  aria-label="删除"
                >
                  <Trash2 className="h-3 w-3 text-red-500" />
                </button>
              )}
              
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  // 这里可以打开全屏视图
                  console.log("Fullscreen item:", item.id);
                }}
                className="p-1 rounded hover:bg-gray-100 transition-colors"
                aria-label="全屏"
              >
                <Maximize2 className="h-3 w-3 text-gray-500" />
              </button>
            </>
          )}
        </div>
      </div>
      
      {/* 项内容区域 */}
      <div className="p-4 h-full overflow-auto">
        {item.content}
      </div>
      
      {/* 调整大小手柄 */}
      {enableResize && item.resizable !== false && viewMode !== "list" && (isHovered || isSelected) && (
        <>
          {/* 右下角调整大小手柄 */}
          <div
            className="absolute bottom-0 right-0 w-4 h-4 cursor-se-resize"
            onMouseDown={(e) => {
              e.stopPropagation();
              setIsResizing(true);
              setResizeDirection("both");
            }}
          >
            <div className="absolute bottom-1 right-1 w-2 h-2 border-r-2 border-b-2 border-gray-400 transform rotate-45"></div>
          </div>
          
          {/* 右边调整大小手柄 */}
          <div
            className="absolute top-0 right-0 bottom-0 w-2 cursor-e-resize"
            onMouseDown={(e) => {
              e.stopPropagation();
              setIsResizing(true);
              setResizeDirection("horizontal");
            }}
          ></div>
          
          {/* 底边调整大小手柄 */}
          <div
            className="absolute left-0 right-0 bottom-0 h-2 cursor-s-resize"
            onMouseDown={(e) => {
              e.stopPropagation();
              setIsResizing(true);
              setResizeDirection("vertical");
            }}
          ></div>
        </>
      )}
    </motion.div>
  );
}

// Bento Grid 工具栏组件
interface BentoGridToolbarProps {
  viewMode: BentoViewMode;
  zoomLevel: number;
  showGridLines: boolean;
  isFullscreen: boolean;
  enableZoom: boolean;
  enableReorder: boolean;
  enableEdit: boolean;
  onViewModeChange: (mode: BentoViewMode) => void;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onResetZoom: () => void;
  onToggleGridLines: () => void;
  onFullscreen: () => void;
  onExport: () => void;
  onAddItem: () => void;
}

function BentoGridToolbar({
  viewMode,
  zoomLevel,
  showGridLines,
  isFullscreen,
  enableZoom,
  enableReorder,
  enableEdit,
  onViewModeChange,
  onZoomIn,
  onZoomOut,
  onResetZoom,
  onToggleGridLines,
  onFullscreen,
  onExport,
  onAddItem
}: BentoGridToolbarProps) {
  return (
    <div className="absolute top-4 right-4 z-10 flex items-center space-x-2 bg-white rounded-lg shadow-md p-2">
      {/* 视图模式切换 */}
      <div className="flex items-center border-r border-gray-200 pr-2 mr-2">
        <button
          onClick={() => onViewModeChange("grid")}
          className={`p-2 rounded transition-colors ${
            viewMode === "grid" ? "bg-blue-100 text-blue-600" : "hover:bg-gray-100"
          }`}
          aria-label="网格视图"
        >
          <Grid className="h-4 w-4" />
        </button>
        
        <button
          onClick={() => onViewModeChange("list")}
          className={`p-2 rounded transition-colors ${
            viewMode === "list" ? "bg-blue-100 text-blue-600" : "hover:bg-gray-100"
          }`}
          aria-label="列表视图"
        >
          <List className="h-4 w-4" />
        </button>
      </div>
      
      {/* 缩放控制 */}
      {enableZoom && (
        <>
          <button
            onClick={onZoomOut}
            className="p-2 rounded hover:bg-gray-100 transition-colors"
            aria-label="缩小"
          >
            <ZoomOut className="h-4 w-4" />
          </button>
          
          <div className="px-2 text-sm font-mono min-w-[3rem] text-center">
            {Math.round(zoomLevel * 100)}%
          </div>
          
          <button
            onClick={onZoomIn}
            className="p-2 rounded hover:bg-gray-100 transition-colors"
            aria-label="放大"
          >
            <ZoomIn className="h-4 w-4" />
          </button>
          
          <button
            onClick={onResetZoom}
            className="p-2 rounded hover:bg-gray-100 transition-colors"
            aria-label="重置缩放"
          >
            <RotateCcw className="h-4 w-4" />
          </button>
        </>
      )}
      
      <div className="w-px h-6 bg-gray-200"></div>
      
      {/* 网格线切换 */}
      <button
        onClick={onToggleGridLines}
        className={`p-2 rounded transition-colors ${
          showGridLines ? "bg-blue-100 text-blue-600" : "hover:bg-gray-100"
        }`}
        aria-label="切换网格线"
      >
        <Grid className="h-4 w-4" />
      </button>
      
      {/* 添加项目 */}
      {enableEdit && (
        <button
          onClick={onAddItem}
          className="p-2 rounded hover:bg-gray-100 transition-colors"
          aria-label="添加项目"
        >
          <Plus className="h-4 w-4" />
        </button>
      )}
      
      <div className="w-px h-6 bg-gray-200"></div>
      
      {/* 全屏和导出 */}
      <button
        onClick={onFullscreen}
        className="p-2 rounded hover:bg-gray-100 transition-colors"
        aria-label="全屏"
      >
        <Maximize2 className="h-4 w-4" />
      </button>
      
      <button
        onClick={onExport}
        className="p-2 rounded hover:bg-gray-100 transition-colors"
        aria-label="导出"
      >
        <Download className="h-4 w-4" />
      </button>
    </div>
  );
}

// 主 Bento Grid 组件
export function BentoGrid({
  layout = {},
  items,
  enableDrag = true,
  enableResize = true,
  enableZoom = true,
  enableReorder = true,
  enableEdit = true,
  enableDelete = true,
  viewMode = "grid",
  showToolbar = true,
  showGridLines = false,
  onItemUpdate,
  onItemDelete,
  onItemReorder,
  onLayoutChange,
  className = "",
  itemClassName = ""
}: BentoGridProps) {
  const [currentLayout, setCurrentLayout] = useState<BentoGridLayout>({ ...defaultLayout, ...layout });
  const [zoomLevel, setZoomLevel] = useState(1);
  const [isDragging, setIsDragging] = useState(false);
  const [draggedItemId, setDraggedItemId] = useState<string | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [currentViewMode, setCurrentViewMode] = useState<BentoViewMode>(viewMode);
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
  const [currentShowGridLines, setCurrentShowGridLines] = useState(showGridLines);
  const [currentItems, setCurrentItems] = useState<BentoItem[]>(items);
  
  const canvasRef = useRef<HTMLDivElement>(null);
  
  // 当传入的 items 变化时，更新内部状态
  useEffect(() => {
    setCurrentItems(items);
  }, [items]);
  
  // 当传入的 layout 变化时，更新内部状态
  useEffect(() => {
    setCurrentLayout({ ...defaultLayout, ...layout });
  }, [layout]);
  
  // 处理拖拽开始
  const handleDragStart = useCallback((id: string) => {
    if (enableDrag) {
      setIsDragging(true);
      setDraggedItemId(id);
    }
  }, [enableDrag]);
  
  // 处理拖拽结束
  const handleDragEnd = useCallback((id: string, x: number, y: number) => {
    if (enableDrag) {
      setIsDragging(false);
      setDraggedItemId(null);
      
      // 这里可以添加逻辑来更新项目的位置
      const itemIndex = currentItems.findIndex(item => item.id === id);
      if (itemIndex !== -1) {
        // 简化的重排序逻辑
        const newItems = [...currentItems];
        const draggedItem = newItems[itemIndex];
        
        // 根据拖拽位置计算新的顺序
        // 这里需要更复杂的计算来确定新的位置
        // 简化示例：只是触发重新排序事件
        onItemReorder?.(newItems);
      }
    }
  }, [enableDrag, currentItems, onItemReorder]);
  
  // 处理项目选择
  const handleItemSelect = useCallback((id: string) => {
    setSelectedItemId(id === selectedItemId ? null : id);
  }, [selectedItemId]);
  
  // 处理项目更新
  const handleItemUpdate = useCallback((item: BentoItem) => {
    const itemIndex = currentItems.findIndex(i => i.id === item.id);
    if (itemIndex !== -1) {
      const newItems = [...currentItems];
      newItems[itemIndex] = item;
      setCurrentItems(newItems);
      onItemUpdate?.(item);
    }
  }, [currentItems, onItemUpdate]);
  
  // 处理项目删除
  const handleItemDelete = useCallback((id: string) => {
    const newItems = currentItems.filter(item => item.id !== id);
    setCurrentItems(newItems);
    onItemDelete?.(id);
    
    // 如果删除的是当前选中的项目，取消选择
    if (selectedItemId === id) {
      setSelectedItemId(null);
    }
  }, [currentItems, onItemDelete, selectedItemId]);
  
  // 处理缩放
  const handleZoomIn = useCallback(() => {
    if (enableZoom) {
      setZoomLevel(prev => Math.min(prev + 0.1, 2));
    }
  }, [enableZoom]);
  
  const handleZoomOut = useCallback(() => {
    if (enableZoom) {
      setZoomLevel(prev => Math.max(prev - 0.1, 0.5));
    }
  }, [enableZoom]);
  
  const handleResetZoom = useCallback(() => {
    if (enableZoom) {
      setZoomLevel(1);
    }
  }, [enableZoom]);
  
  // 处理视图模式切换
  const handleViewModeChange = useCallback((mode: BentoViewMode) => {
    setCurrentViewMode(mode);
  }, []);
  
  // 处理网格线切换
  const handleToggleGridLines = useCallback(() => {
    setCurrentShowGridLines(prev => !prev);
  }, []);
  
  // 处理全屏
  const handleFullscreen = useCallback(() => {
    if (!isFullscreen && canvasRef.current) {
      canvasRef.current.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
    setIsFullscreen(!isFullscreen);
  }, [isFullscreen]);
  
  // 处理导出
  const handleExport = useCallback(() => {
    // 这里可以添加导出功能
    console.log("Export canvas with items:", currentItems);
  }, [currentItems]);
  
  // 处理添加项目
  const handleAddItem = useCallback(() => {
    // 这里可以打开添加项目对话框
    console.log("Add new item");
  }, []);
  
  // 计算网格样式
  const getGridStyle = () => {
    if (currentViewMode === "list") {
      return {
        display: "flex",
        flexDirection: "column" as const,
        gap: `${currentLayout.gap}px`,
        padding: `${currentLayout.padding}px`,
      };
    }
    
    return {
      display: "grid",
      gridTemplateColumns: `repeat(${currentLayout.cols}, minmax(0, 1fr))`,
      gridTemplateRows: `repeat(${currentLayout.rows}, minmax(0, 1fr))`,
      gap: `${currentLayout.gap}px`,
      padding: `${currentLayout.padding}px`,
    };
  };
  
  return (
    <div 
      ref={canvasRef}
      className={`relative w-full h-full overflow-hidden ${className}`}
      style={{ backgroundColor: currentLayout.background }}
    >
      {/* 工具栏 */}
      {showToolbar && (
        <BentoGridToolbar
          viewMode={currentViewMode}
          zoomLevel={zoomLevel}
          showGridLines={currentShowGridLines}
          isFullscreen={isFullscreen}
          enableZoom={enableZoom}
          enableReorder={enableReorder}
          enableEdit={enableEdit}
          onViewModeChange={handleViewModeChange}
          onZoomIn={handleZoomIn}
          onZoomOut={handleZoomOut}
          onResetZoom={handleResetZoom}
          onToggleGridLines={handleToggleGridLines}
          onFullscreen={handleFullscreen}
          onExport={handleExport}
          onAddItem={handleAddItem}
        />
      )}
      
      {/* 网格容器 */}
      <div 
        className="w-full h-full overflow-auto"
        style={{ 
          transform: `scale(${zoomLevel})`,
          transformOrigin: "center center",
          transition: "transform 0.3s ease-out"
        }}
      >
        <div style={getGridStyle()}>
          <AnimatePresence>
            {currentItems.map((item, index) => (
              <BentoGridItem
                key={item.id}
                item={item}
                index={index}
                layout={currentLayout}
                viewMode={currentViewMode}
                isDragging={draggedItemId === item.id}
                isSelected={selectedItemId === item.id}
                showGridLines={currentShowGridLines}
                enableDrag={enableDrag}
                enableResize={enableResize}
                enableEdit={enableEdit}
                enableDelete={enableDelete}
                onSelect={handleItemSelect}
                onUpdate={handleItemUpdate}
                onDelete={handleItemDelete}
                onDragStart={handleDragStart}
                onDragEnd={handleDragEnd}
                itemClassName={itemClassName}
              />
            ))}
          </AnimatePresence>
        </div>
      </div>
      
      {/* 拖拽时的遮罩 */}
      {isDragging && (
        <div className="absolute inset-0 bg-black bg-opacity-10 z-40 pointer-events-none"></div>
      )}
    </div>
  );
}