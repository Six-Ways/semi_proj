"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { BentoGrid, BentoItem, BentoItemType } from "@/components/ui/BentoGrid";
import { 
  LabSlider, 
  LabSwitch, 
  LabButtonGroup, 
  LabGauge, 
  LabControlPanel, 
  LabStatusIndicator 
} from "@/components/ui/LaboratoryControls";
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Activity, 
  Zap, 
  Thermometer,
  Cpu,
  Battery,
  Wifi,
  TrendingUp,
  BarChart3,
  PieChart,
  LineChart,
  Power
} from "lucide-react";

// 示例内容组件
function TextContent({ title, content }: { title: string; content: string }) {
  return (
    <div className="h-full flex flex-col">
      <h4 className="text-lg font-semibold mb-2">{title}</h4>
      <p className="text-sm text-gray-600 flex-1">{content}</p>
    </div>
  );
}

function ChartContent({ type, title }: { type: string; title: string }) {
  return (
    <div className="h-full flex flex-col items-center justify-center">
      <div className="w-16 h-16 mb-4 flex items-center justify-center bg-blue-100 rounded-lg">
        {type === "line" && <LineChart className="h-8 w-8 text-blue-600" />}
        {type === "bar" && <BarChart3 className="h-8 w-8 text-blue-600" />}
        {type === "pie" && <PieChart className="h-8 w-8 text-blue-600" />}
        {type === "trend" && <TrendingUp className="h-8 w-8 text-blue-600" />}
      </div>
      <h4 className="text-sm font-medium text-center">{title}</h4>
      <p className="text-xs text-gray-500 text-center mt-1">图表数据可视化</p>
    </div>
  );
}

function SimulatorContent({ title }: { title: string }) {
  const [value, setValue] = useState(50);
  
  return (
    <div className="h-full flex flex-col">
      <h4 className="text-sm font-medium mb-3">{title}</h4>
      <div className="flex-1 flex items-center justify-center">
        <LabSlider
          label="参数"
          value={value}
          min={0}
          max={100}
          onChange={setValue}
          size="sm"
        />
      </div>
    </div>
  );
}

function FormulaContent({ title, formula }: { title: string; formula: string }) {
  return (
    <div className="h-full flex flex-col">
      <h4 className="text-sm font-medium mb-3">{title}</h4>
      <div className="flex-1 flex items-center justify-center bg-gray-50 rounded p-4">
        <div className="text-center">
          <div className="text-lg font-mono">{formula}</div>
          <div className="text-xs text-gray-500 mt-2">数学公式</div>
        </div>
      </div>
    </div>
  );
}

function ControlContent({ title }: { title: string }) {
  const [isOn, setIsOn] = useState(false);
  const [value, setValue] = useState(25);
  
  return (
    <div className="h-full flex flex-col space-y-3">
      <h4 className="text-sm font-medium">{title}</h4>
      
      <LabSwitch
        label="电源"
        checked={isOn}
        onChange={setIsOn}
        size="sm"
        icon={<Power className="w-3 h-3" />}
      />
      
      <LabSlider
        label="强度"
        value={value}
        min={0}
        max={100}
        onChange={setValue}
        disabled={!isOn}
        size="sm"
      />
      
      <LabStatusIndicator
        status={isOn ? "active" : "inactive"}
        label="状态"
        value={isOn ? "运行中" : "已停止"}
        size="sm"
      />
    </div>
  );
}

// Bento Grid 示例组件
export function BentoGridExample() {
  const [items, setItems] = useState<BentoItem[]>([
    {
      id: "1",
      title: "半导体物理基础",
      type: "text",
      content: <TextContent title="半导体物理基础" content="半导体材料是现代电子技术的基石，其独特的电学性质使其成为制造各种电子器件的理想材料。半导体的导电性介于导体和绝缘体之间，可以通过掺杂、温度、光照等方式进行调控。" />,
      width: 4,
      height: 3,
      category: "基础理论"
    },
    {
      id: "2",
      title: "能带结构模拟器",
      type: "simulator",
      content: <SimulatorContent title="能带结构模拟器" />,
      width: 4,
      height: 3,
      category: "交互模拟"
    },
    {
      id: "3",
      title: "I-V特性曲线",
      type: "chart",
      content: <ChartContent type="line" title="二极管I-V特性曲线" />,
      width: 4,
      height: 3,
      category: "数据可视化"
    },
    {
      id: "4",
      title: "载流子浓度公式",
      type: "formula",
      content: <FormulaContent title="载流子浓度公式" formula="n = NC * exp(-(EC-EF)/kT)" />,
      width: 6,
      height: 2,
      category: "数学公式"
    },
    {
      id: "5",
      title: "PN结形成过程",
      type: "video",
      content: (
        <div className="h-full flex flex-col items-center justify-center">
          <div className="w-16 h-16 mb-4 flex items-center justify-center bg-red-100 rounded-lg">
            <Play className="h-8 w-8 text-red-600" />
          </div>
          <h4 className="text-sm font-medium text-center">PN结形成动画</h4>
          <p className="text-xs text-gray-500 text-center mt-1">点击播放动画演示</p>
        </div>
      ),
      width: 6,
      height: 2,
      category: "视频内容"
    },
    {
      id: "6",
      title: "器件参数控制",
      type: "control",
      content: <ControlContent title="器件参数控制" />,
      width: 3,
      height: 4,
      category: "交互控制"
    },
    {
      id: "7",
      title: "材料性能对比",
      type: "chart",
      content: <ChartContent type="bar" title="不同半导体材料性能对比" />,
      width: 5,
      height: 4,
      category: "数据可视化"
    },
    {
      id: "8",
      title: "温度特性曲线",
      type: "chart",
      content: <ChartContent type="trend" title="半导体器件温度特性" />,
      width: 4,
      height: 4,
      category: "数据可视化"
    },
    {
      id: "9",
      title: "市场占有率分析",
      type: "chart",
      content: <ChartContent type="pie" title="半导体器件市场占有率" />,
      width: 3,
      height: 3,
      category: "数据可视化"
    },
    {
      id: "10",
      title: "载流子输运方程",
      type: "formula",
      content: <FormulaContent title="载流子输运方程" formula="J = qnμE + qD∇n" />,
      width: 4,
      height: 2,
      category: "数学公式"
    },
    {
      id: "11",
      title: "器件测试结果",
      type: "data",
      content: (
        <div className="h-full flex flex-col">
          <h4 className="text-sm font-medium mb-3">器件测试结果</h4>
          <div className="flex-1 overflow-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-1">参数</th>
                  <th className="text-right py-1">数值</th>
                  <th className="text-right py-1">单位</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b">
                  <td className="py-1">正向电压</td>
                  <td className="text-right">0.7</td>
                  <td className="text-right">V</td>
                </tr>
                <tr className="border-b">
                  <td className="py-1">反向电流</td>
                  <td className="text-right">1.2</td>
                  <td className="text-right">μA</td>
                </tr>
                <tr className="border-b">
                  <td className="py-1">结电容</td>
                  <td className="text-right">15</td>
                  <td className="text-right">pF</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      ),
      width: 4,
      height: 3,
      category: "数据表格"
    },
    {
      id: "12",
      title: "工艺流程控制",
      type: "control",
      content: <ControlContent title="工艺流程控制" />,
      width: 4,
      height: 3,
      category: "交互控制"
    }
  ]);
  
  // 处理项目更新
  const handleItemUpdate = (item: BentoItem) => {
    setItems(prevItems => 
      prevItems.map(i => i.id === item.id ? item : i)
    );
  };
  
  // 处理项目删除
  const handleItemDelete = (itemId: string) => {
    setItems(prevItems => prevItems.filter(i => i.id !== itemId));
  };
  
  // 处理项目重排序
  const handleItemReorder = (newItems: BentoItem[]) => {
    setItems(newItems);
  };
  
  return (
    <div className="w-full h-screen">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="h-full flex flex-col"
      >
        {/* 标题区域 */}
        <div className="bg-white border-b border-gray-200 px-6 py-4">
          <h1 className="text-2xl font-bold text-gray-900">Bento Grid 布局系统演示</h1>
          <p className="text-gray-600 mt-1">交互式网格布局，支持拖拽、调整大小和多种视图模式</p>
        </div>
        
        {/* Bento Grid 容器 */}
        <div className="flex-1">
          <BentoGrid
            layout={{
              cols: 12,
              rows: 8,
              gap: 16,
              padding: 24,
              background: "#f8fafc"
            }}
            items={items}
            enableDrag={true}
            enableResize={true}
            enableZoom={true}
            enableReorder={true}
            enableEdit={true}
            enableDelete={true}
            viewMode="grid"
            showToolbar={true}
            showGridLines={false}
            onItemUpdate={handleItemUpdate}
            onItemDelete={handleItemDelete}
            onItemReorder={handleItemReorder}
            className="h-full"
          />
        </div>
      </motion.div>
    </div>
  );
}

// 章节内容 Bento Grid 示例
export function ChapterContentBentoGrid() {
  const [items, setItems] = useState<BentoItem[]>([
    {
      id: "1",
      title: "章节概述",
      type: "text",
      content: <TextContent title="章节概述" content="本章介绍半导体器件的基本原理和特性，包括PN结的形成、二极管的I-V特性、晶体管的工作原理等核心内容。通过理论学习和实验模拟，帮助读者深入理解半导体器件的工作机制。" />,
      width: 8,
      height: 2,
      category: "概述"
    },
    {
      id: "2",
      title: "学习目标",
      type: "text",
      content: (
        <div className="h-full">
          <h4 className="text-lg font-semibold mb-2">学习目标</h4>
          <ul className="text-sm text-gray-600 space-y-1">
            <li>• 理解PN结的形成原理和平衡状态</li>
            <li>• 掌握二极管的电流-电压特性</li>
            <li>• 了解晶体管的基本工作原理</li>
            <li>• 掌握半导体器件的参数测量方法</li>
          </ul>
        </div>
      ),
      width: 4,
      height: 2,
      category: "目标"
    },
    {
      id: "3",
      title: "PN结形成模拟",
      type: "simulator",
      content: <SimulatorContent title="PN结形成模拟" />,
      width: 6,
      height: 4,
      category: "交互模拟"
    },
    {
      id: "4",
      title: "二极管方程",
      type: "formula",
      content: <FormulaContent title="二极管方程" formula="I = IS * (e^(qV/nkT) - 1)" />,
      width: 6,
      height: 2,
      category: "数学公式"
    },
    {
      id: "5",
      title: "I-V特性曲线",
      type: "chart",
      content: <ChartContent type="line" title="二极管I-V特性曲线" />,
      width: 6,
      height: 2,
      category: "数据可视化"
    },
    {
      id: "6",
      title: "实验参数控制",
      type: "control",
      content: <ControlContent title="实验参数控制" />,
      width: 4,
      height: 4,
      category: "交互控制"
    },
    {
      id: "7",
      title: "晶体管工作原理",
      type: "video",
      content: (
        <div className="h-full flex flex-col items-center justify-center">
          <div className="w-16 h-16 mb-4 flex items-center justify-center bg-red-100 rounded-lg">
            <Play className="h-8 w-8 text-red-600" />
          </div>
          <h4 className="text-sm font-medium text-center">晶体管工作原理动画</h4>
          <p className="text-xs text-gray-500 text-center mt-1">点击播放动画演示</p>
        </div>
      ),
      width: 8,
      height: 3,
      category: "视频内容"
    },
    {
      id: "8",
      title: "章节小结",
      type: "text",
      content: <TextContent title="章节小结" content="本章介绍了半导体器件的基本原理和特性，包括PN结的形成、二极管的I-V特性、晶体管的工作原理等核心内容。通过理论学习和实验模拟，读者应该能够理解半导体器件的工作机制，并掌握基本的参数测量方法。" />,
      width: 12,
      height: 2,
      category: "总结"
    }
  ]);
  
  // 处理项目更新
  const handleItemUpdate = (item: BentoItem) => {
    setItems(prevItems => 
      prevItems.map(i => i.id === item.id ? item : i)
    );
  };
  
  // 处理项目删除
  const handleItemDelete = (itemId: string) => {
    setItems(prevItems => prevItems.filter(i => i.id !== itemId));
  };
  
  // 处理项目重排序
  const handleItemReorder = (newItems: BentoItem[]) => {
    setItems(newItems);
  };
  
  return (
    <div className="w-full h-screen">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="h-full flex flex-col"
      >
        {/* 标题区域 */}
        <div className="bg-white border-b border-gray-200 px-6 py-4">
          <h1 className="text-2xl font-bold text-gray-900">章节内容 Bento Grid 布局</h1>
          <p className="text-gray-600 mt-1">使用 Bento Grid 布局系统展示章节内容</p>
        </div>
        
        {/* Bento Grid 容器 */}
        <div className="flex-1">
          <BentoGrid
            layout={{
              cols: 12,
              rows: 8,
              gap: 16,
              padding: 24,
              background: "#f8fafc"
            }}
            items={items}
            enableDrag={true}
            enableResize={true}
            enableZoom={true}
            enableReorder={true}
            enableEdit={false}
            enableDelete={false}
            viewMode="grid"
            showToolbar={true}
            showGridLines={false}
            onItemUpdate={handleItemUpdate}
            onItemDelete={handleItemDelete}
            onItemReorder={handleItemReorder}
            className="h-full"
          />
        </div>
      </motion.div>
    </div>
  );
}