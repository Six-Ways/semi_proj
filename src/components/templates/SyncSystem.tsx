"use client";

import React, { createContext, useContext, useState, useCallback, ReactNode } from "react";

// 定义同步项的类型
export interface SyncItem {
  id: string;
  type: "formula" | "text" | "visualization" | "keyword";
  content: string;
  relatedIds: string[]; // 关联的其他元素ID
  section?: string; // 所属章节/部分
}

// 定义同步状态的类型
interface SyncState {
  activeId: string | null;
  hoveredId: string | null;
  relatedIds: string[];
}

// 定义同步上下文的类型
interface SyncContextType {
  syncState: SyncState;
  syncItems: Map<string, SyncItem>;
  
  // 注册同步项
  registerSyncItem: (item: SyncItem) => void;
  
  // 取消注册同步项
  unregisterSyncItem: (id: string) => void;
  
  // 设置活动项（点击或聚焦）
  setActiveItem: (id: string | null) => void;
  
  // 设置悬停项
  setHoveredItem: (id: string | null) => void;
  
  // 清除所有状态
  clearSyncState: () => void;
  
  // 检查某个ID是否处于活动/高亮状态
  isItemActive: (id: string) => boolean;
  
  // 获取某个ID的相关项
  getRelatedItems: (id: string) => SyncItem[];
}

// 创建同步上下文
const SyncContext = createContext<SyncContextType | undefined>(undefined);

// 同步提供者组件的属性
interface SyncProviderProps {
  children: ReactNode;
}

// 同步提供者组件
export function SyncProvider({ children }: SyncProviderProps) {
  const [syncState, setSyncState] = useState<SyncState>({
    activeId: null,
    hoveredId: null,
    relatedIds: []
  });
  
  const [syncItems, setSyncItems] = useState<Map<string, SyncItem>>(new Map());

  // 注册同步项
  const registerSyncItem = useCallback((item: SyncItem) => {
    setSyncItems(prev => new Map(prev).set(item.id, item));
  }, []);

  // 取消注册同步项
  const unregisterSyncItem = useCallback((id: string) => {
    setSyncItems(prev => {
      const newMap = new Map(prev);
      newMap.delete(id);
      return newMap;
    });
    
    // 如果删除的是当前活动项或悬停项，清除状态
    setSyncState(prev => {
      if (prev.activeId === id || prev.hoveredId === id) {
        return {
          activeId: null,
          hoveredId: null,
          relatedIds: []
        };
      }
      return prev;
    });
  }, []);

  // 设置活动项
  const setActiveItem = useCallback((id: string | null) => {
    if (!id) {
      setSyncState({
        activeId: null,
        hoveredId: null,
        relatedIds: []
      });
      return;
    }

    const item = syncItems.get(id);
    if (item) {
      setSyncState({
        activeId: id,
        hoveredId: null,
        relatedIds: item.relatedIds
      });
    }
  }, [syncItems]);

  // 设置悬停项
  const setHoveredItem = useCallback((id: string | null) => {
    if (!id) {
      setSyncState(prev => ({
        ...prev,
        hoveredId: null,
        relatedIds: prev.activeId ? 
          (syncItems.get(prev.activeId)?.relatedIds || []) : 
          []
      }));
      return;
    }

    const item = syncItems.get(id);
    if (item) {
      setSyncState(prev => ({
        ...prev,
        hoveredId: id,
        relatedIds: item.relatedIds
      }));
    }
  }, [syncItems]);

  // 清除所有状态
  const clearSyncState = useCallback(() => {
    setSyncState({
      activeId: null,
      hoveredId: null,
      relatedIds: []
    });
  }, []);

  // 检查某个ID是否处于活动/高亮状态
  const isItemActive = useCallback((id: string) => {
    return (
      syncState.activeId === id || 
      syncState.hoveredId === id || 
      syncState.relatedIds.includes(id)
    );
  }, [syncState]);

  // 获取某个ID的相关项
  const getRelatedItems = useCallback((id: string) => {
    const item = syncItems.get(id);
    if (!item) return [];
    
    return item.relatedIds
      .map(relatedId => syncItems.get(relatedId))
      .filter(Boolean) as SyncItem[];
  }, [syncItems]);

  const value: SyncContextType = {
    syncState,
    syncItems,
    registerSyncItem,
    unregisterSyncItem,
    setActiveItem,
    setHoveredItem,
    clearSyncState,
    isItemActive,
    getRelatedItems
  };

  return (
    <SyncContext.Provider value={value}>
      {children}
    </SyncContext.Provider>
  );
}

// 使用同步上下文的Hook
export function useSync() {
  const context = useContext(SyncContext);
  if (context === undefined) {
    throw new Error("useSync must be used within a SyncProvider");
  }
  return context;
}

// 可同步组件的属性
interface SyncableProps {
  id: string;
  type: "formula" | "text" | "visualization" | "keyword";
  relatedIds?: string[];
  section?: string;
  className?: string;
  children: ReactNode;
  onClick?: () => void;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
}

// 可同步组件 - 包装任何需要同步的内容
export function Syncable({
  id,
  type,
  relatedIds = [],
  section,
  className = "",
  children,
  onClick,
  onMouseEnter,
  onMouseLeave
}: SyncableProps) {
  const { registerSyncItem, unregisterSyncItem, setActiveItem, setHoveredItem, isItemActive } = useSync();
  const [content, setContent] = useState("");

  // 注册同步项
  React.useEffect(() => {
    // 提取内容文本
    const extractContent = () => {
      if (typeof children === "string") return children;
      if (React.isValidElement(children)) {
        // 如果是React元素，尝试获取其文本内容
        const element = children as React.ReactElement<any>;
        if (element.props.children) {
          if (typeof element.props.children === "string") {
            return element.props.children;
          }
          // 递归提取子元素的文本
          return extractTextFromNode(element.props.children);
        }
      }
      return "";
    };

    const extractTextFromNode = (node: any): string => {
      if (typeof node === "string") return node;
      if (Array.isArray(node)) {
        return node.map(extractTextFromNode).join("");
      }
      if (React.isValidElement(node) && (node.props as any)?.children) {
        return extractTextFromNode((node.props as any).children);
      }
      return "";
    };

    const textContent = extractContent();
    setContent(textContent);

    registerSyncItem({
      id,
      type,
      content: textContent,
      relatedIds,
      section
    });

    return () => {
      unregisterSyncItem(id);
    };
  }, [id, type, relatedIds, section, children, registerSyncItem, unregisterSyncItem]);

  const isActive = isItemActive(id);

  const handleClick = () => {
    setActiveItem(id);
    if (onClick) onClick();
  };

  const handleMouseEnter = () => {
    setHoveredItem(id);
    if (onMouseEnter) onMouseEnter();
  };

  const handleMouseLeave = () => {
    setHoveredItem(null);
    if (onMouseLeave) onMouseLeave();
  };

  // 根据类型和状态添加样式
  const getClassName = () => {
    let baseClassName = className;
    
    if (isActive) {
      // 根据类型添加不同的高亮样式
      switch (type) {
        case "formula":
          baseClassName += " bg-blue-100 border-blue-300 border-l-4 pl-2 transition-all duration-300";
          break;
        case "text":
          baseClassName += " bg-yellow-50 rounded px-1 transition-all duration-300";
          break;
        case "visualization":
          baseClassName += " ring-2 ring-blue-400 rounded transition-all duration-300";
          break;
        case "keyword":
          baseClassName += " text-blue-600 font-semibold transition-all duration-300";
          break;
      }
    }

    // 添加交互样式
    if (type === "keyword" || type === "formula") {
      baseClassName += " cursor-pointer hover:text-blue-500";
    }

    return baseClassName;
  };

  return (
    <span
      className={getClassName()}
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      data-sync-id={id}
      data-sync-type={type}
    >
      {children}
    </span>
  );
}

// 公式同步组件
interface SyncableFormulaProps {
  id: string;
  relatedIds?: string[];
  section?: string;
  className?: string;
  children: ReactNode;
}

export function SyncableFormula({
  id,
  relatedIds,
  section,
  className = "",
  children
}: SyncableFormulaProps) {
  return (
    <Syncable
      id={id}
      type="formula"
      relatedIds={relatedIds}
      section={section}
      className={`inline-block ${className}`}
    >
      {children}
    </Syncable>
  );
}

// 文本同步组件
interface SyncableTextProps {
  id: string;
  relatedIds?: string[];
  section?: string;
  className?: string;
  children: ReactNode;
}

export function SyncableText({
  id,
  relatedIds,
  section,
  className = "",
  children
}: SyncableTextProps) {
  return (
    <Syncable
      id={id}
      type="text"
      relatedIds={relatedIds}
      section={section}
      className={`inline ${className}`}
    >
      {children}
    </Syncable>
  );
}

// 可视化同步组件
interface SyncableVisualizationProps {
  id: string;
  relatedIds?: string[];
  section?: string;
  className?: string;
  children: ReactNode;
}

export function SyncableVisualization({
  id,
  relatedIds,
  section,
  className = "",
  children
}: SyncableVisualizationProps) {
  return (
    <Syncable
      id={id}
      type="visualization"
      relatedIds={relatedIds}
      section={section}
      className={`block ${className}`}
    >
      {children}
    </Syncable>
  );
}

// 关键词同步组件
interface SyncableKeywordProps {
  id: string;
  term?: string;
  definition?: ReactNode;
  relatedIds?: string[];
  section?: string;
  className?: string;
  children?: ReactNode;
  tooltip?: string;
}

export function SyncableKeyword({
  id,
  term,
  definition,
  relatedIds,
  section,
  className = "",
  children,
  tooltip
}: SyncableKeywordProps) {
  const [showTooltip, setShowTooltip] = useState(false);

  // 使用term作为children，如果children未提供
  const displayChildren = children || term;

  return (
    <span className="relative inline-block">
      <Syncable
        id={id}
        type="keyword"
        relatedIds={relatedIds}
        section={section}
        className={`border-b border-dotted border-gray-400 ${className}`}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
      >
        {displayChildren}
      </Syncable>
      
      {(definition || tooltip) && showTooltip && (
        <div className="absolute z-10 w-48 p-2 mt-1 text-sm text-white bg-gray-900 rounded shadow-lg">
          {definition || tooltip}
        </div>
      )}
    </span>
  );
}