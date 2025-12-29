"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion } from "framer-motion";
import { Play, Pause, RotateCcw, Settings, Info, Maximize2, Download } from "lucide-react";
import { BlockMath } from "@/components/math/MathFormula";

// 模拟器类型
export type SimulatorType = 
  | "timeline" 
  | "crystal" 
  | "dopant" 
  | "current" 
  | "voltage" 
  | "capacitance" 
  | "transistor" 
  | "cmos" 
  | "scaling" 
  | "lithography" 
  | "etching" 
  | "deposition" 
  | "metallization" 
  | "packaging" 
  | "testing" 
  | "asic" 
  | "fpga" 
  | "verification" 
  | "emerging"
  | "band-structure"
  | "energy-gap"
  | "carrier-mobility"
  | "drift-velocity"
  | "pn-junction"
  | "diode-iv"
  | "crystal-structure"
  | "band-formation"
  | "band-comparison";

// 滑块属性接口
interface SliderProps {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  unit?: string;
  onChange: (value: number) => void;
  disabled?: boolean;
}

// 精密滑块组件
export function LabSlider({ 
  label, 
  value, 
  min, 
  max, 
  step = 0.1, 
  unit = "", 
  onChange, 
  disabled = false 
}: SliderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const sliderRef = useRef<HTMLDivElement>(null);
  
  // 处理滑块值变化
  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(parseFloat(e.target.value));
  }, [onChange]);
  
  // 处理鼠标按下
  const handleMouseDown = () => {
    setIsDragging(true);
  };
  
  // 处理鼠标释放
  const handleMouseUp = () => {
    setIsDragging(false);
  };
  
  // 计算滑块轨道的填充百分比
  const fillPercentage = ((value - min) / (max - min)) * 100;
  
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-gray-700">{label}</label>
        <span className="text-sm font-mono text-gray-500">
          {value.toFixed(1)} {unit}
        </span>
      </div>
      
      <div 
        ref={sliderRef}
        className={`relative h-8 bg-gray-100 rounded-lg border ${isDragging ? 'border-[#007AFF]' : 'border-gray-200'} transition-colors`}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        {/* 滑块轨道填充 */}
        <div 
          className="absolute top-0 left-0 h-full bg-gradient-to-r from-[#007AFF] to-blue-400 rounded-lg"
          style={{ width: `${fillPercentage}%` }}
        ></div>
        
        {/* 刻度线 */}
        <div className="absolute inset-0 flex items-center justify-between px-2">
          {[...Array(5)].map((_, i) => (
            <div 
              key={i} 
              className="w-0.5 h-4 bg-gray-300"
            ></div>
          ))}
        </div>
        
        {/* 滑块手柄 */}
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={handleChange}
          disabled={disabled}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />
        
        <div 
          className="absolute top-1/2 -translate-y-1/2 w-6 h-6 bg-white border-2 border-[#007AFF] rounded-full shadow-md"
          style={{ left: `calc(${fillPercentage}% - 12px)` }}
        ></div>
      </div>
    </div>
  );
}

// 图表组件
interface ChartProps {
  data: Array<{ x: number; y: number }>;
  width?: number;
  height?: number;
  xLabel?: string;
  yLabel?: string;
  color?: string;
}

export function LabChart({ 
  data, 
  width = 300, 
  height = 200, 
  xLabel = "", 
  yLabel = "", 
  color = "#007AFF" 
}: ChartProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  
  // 计算数据范围
  const xMin = Math.min(...data.map(d => d.x));
  const xMax = Math.max(...data.map(d => d.x));
  const yMin = Math.min(...data.map(d => d.y));
  const yMax = Math.max(...data.map(d => d.y));
  
  // 计算缩放比例
  const xScale = (width - 40) / (xMax - xMin);
  const yScale = (height - 40) / (yMax - yMin);
  
  // 生成路径
  const path = data.map((d, i) => {
    const x = 20 + (d.x - xMin) * xScale;
    const y = height - 20 - (d.y - yMin) * yScale;
    return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
  }).join(' ');
  
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4">
      <svg 
        ref={svgRef}
        width={width} 
        height={height} 
        className="w-full h-auto"
      >
        {/* 网格线 */}
        <g className="text-gray-200">
          {[...Array(5)].map((_, i) => (
            <line
              key={`h-${i}`}
              x1="20"
              y1={20 + (height - 40) * i / 4}
              x2={width - 20}
              y2={20 + (height - 40) * i / 4}
              stroke="currentColor"
              strokeWidth="0.5"
            />
          ))}
          
          {[...Array(5)].map((_, i) => (
            <line
              key={`v-${i}`}
              x1={20 + (width - 40) * i / 4}
              y1="20"
              x2={20 + (width - 40) * i / 4}
              y2={height - 20}
              stroke="currentColor"
              strokeWidth="0.5"
            />
          ))}
        </g>
        
        {/* 坐标轴 */}
        <g className="text-gray-500">
          <line x1="20" y1={height - 20} x2={width - 20} y2={height - 20} stroke="currentColor" strokeWidth="1" />
          <line x1="20" y1="20" x2="20" y2={height - 20} stroke="currentColor" strokeWidth="1" />
        </g>
        
        {/* 数据线 */}
        <path
          d={path}
          fill="none"
          stroke={color}
          strokeWidth="2"
        />
        
        {/* 数据点 */}
        {data.map((d, i) => {
          const x = 20 + (d.x - xMin) * xScale;
          const y = height - 20 - (d.y - yMin) * yScale;
          return (
            <circle
              key={i}
              cx={x}
              cy={y}
              r="3"
              fill={color}
            />
          );
        })}
        
        {/* 轴标签 */}
        <g className="text-xs fill-gray-500">
          <text x={width / 2} y={height - 5} textAnchor="middle">{xLabel}</text>
          <text x="10" y={height / 2} textAnchor="middle" transform={`rotate(-90 10 ${height / 2})`}>{yLabel}</text>
        </g>
      </svg>
    </div>
  );
}

// 模拟器属性接口
interface InteractiveSimulatorProps {
  type: SimulatorType;
  title: string;
  description?: string;
  initialState?: Record<string, any>;
  onStateChange?: (state: Record<string, any>) => void;
  className?: string;
  config?: Record<string, any>;
}

// 交互式模拟器组件
export function InteractiveSimulator({
  type,
  title,
  description = "",
  initialState = {},
  onStateChange,
  className = "",
  config = {},
}: InteractiveSimulatorProps) {
  const [state, setState] = useState({...initialState, ...config});
  const [isPlaying, setIsPlaying] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showInfo, setShowInfo] = useState(false);
  
  const containerRef = useRef<HTMLDivElement>(null);
  
  // 更新状态
  const updateState = useCallback((key: string, value: any) => {
    const newState = { ...state, [key]: value };
    setState(newState);
    onStateChange?.(newState);
  }, [state, onStateChange]);
  
  // 处理播放/暂停
  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };
  
  // 处理重置
  const handleReset = () => {
    setState(initialState);
    setIsPlaying(false);
    onStateChange?.(initialState);
  };
  
  // 处理全屏
  const handleFullscreen = () => {
    if (!isFullscreen && containerRef.current) {
      containerRef.current.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
    setIsFullscreen(!isFullscreen);
  };
  
  // 处理导出
  const handleExport = () => {
    // 这里可以添加导出功能
    console.log("Export simulator data:", state);
  };
  
  // 根据模拟器类型渲染不同的内容
  const renderSimulatorContent = () => {
    switch (type) {
      case "timeline":
        return <TimelineSimulator state={state} updateState={updateState} />;
      case "crystal":
        return <CrystalSimulator state={state} updateState={updateState} />;
      case "dopant":
        return <DopantSimulator state={state} updateState={updateState} />;
      case "current":
        return <CurrentSimulator state={state} updateState={updateState} />;
      case "voltage":
        return <VoltageSimulator state={state} updateState={updateState} />;
      case "capacitance":
        return <CapacitanceSimulator state={state} updateState={updateState} />;
      case "transistor":
        return <TransistorSimulator state={state} updateState={updateState} />;
      case "cmos":
        return <CmosSimulator state={state} updateState={updateState} />;
      case "scaling":
        return <ScalingSimulator state={state} updateState={updateState} />;
      case "lithography":
        return <LithographySimulator state={state} updateState={updateState} />;
      case "etching":
        return <EtchingSimulator state={state} updateState={updateState} />;
      case "deposition":
        return <DepositionSimulator state={state} updateState={updateState} />;
      case "metallization":
        return <MetallizationSimulator state={state} updateState={updateState} />;
      case "packaging":
        return <PackagingSimulator state={state} updateState={updateState} />;
      case "testing":
        return <TestingSimulator state={state} updateState={updateState} />;
      case "asic":
        return <AsicSimulator state={state} updateState={updateState} />;
      case "fpga":
        return <FpgaSimulator state={state} updateState={updateState} />;
      case "verification":
        return <VerificationSimulator state={state} updateState={updateState} />;
      case "emerging":
        return <EmergingSimulator state={state} updateState={updateState} />;
      case "band-structure":
        return <BandStructureSimulator state={state} updateState={updateState} />;
      case "energy-gap":
        return <EnergyGapSimulator state={state} updateState={updateState} />;
      case "carrier-mobility":
        return <CarrierMobilitySimulator state={state} updateState={updateState} />;
      case "drift-velocity":
        return <DriftVelocitySimulator state={state} updateState={updateState} />;
      case "pn-junction":
        return <PnJunctionSimulator state={state} updateState={updateState} />;
      case "diode-iv":
          return <DiodeIVSimulator state={state} updateState={updateState} />;
        case "crystal-structure":
          return <CrystalStructureSimulator state={state} updateState={updateState} />;
        case "band-formation":
          return <BandFormationSimulator state={state} updateState={updateState} />;
        case "band-comparison":
          return <BandComparisonSimulator state={state} updateState={updateState} />;
        default:
          return <div className="text-center text-gray-500 py-8">模拟器开发中...</div>;
    }
  };
  
  return (
    <div 
      ref={containerRef}
      className={`bg-white rounded-lg border border-gray-200 overflow-hidden ${className}`}
    >
      {/* 模拟器标题栏 */}
      <div className="flex items-center justify-between p-3 border-b border-gray-100 bg-gray-50">
        <div>
          <h3 className="font-sans text-sm font-medium text-gray-700">{title}</h3>
          <p className="text-xs text-gray-500">{description}</p>
        </div>
        
        <div className="flex items-center space-x-1">
          <button
            onClick={handlePlayPause}
            className="p-1.5 rounded hover:bg-gray-200 transition-colors"
            aria-label={isPlaying ? "暂停" : "播放"}
          >
            {isPlaying ? (
              <Pause className="h-4 w-4 text-gray-600" />
            ) : (
              <Play className="h-4 w-4 text-gray-600" />
            )}
          </button>
          
          <button
            onClick={handleReset}
            className="p-1.5 rounded hover:bg-gray-200 transition-colors"
            aria-label="重置"
          >
            <RotateCcw className="h-4 w-4 text-gray-600" />
          </button>
          
          <div className="w-px h-6 bg-gray-300"></div>
          
          <button
            onClick={() => setShowSettings(!showSettings)}
            className={`p-1.5 rounded transition-colors ${showSettings ? 'bg-gray-200' : 'hover:bg-gray-200'}`}
            aria-label="设置"
          >
            <Settings className="h-4 w-4 text-gray-600" />
          </button>
          
          <button
            onClick={() => setShowInfo(!showInfo)}
            className={`p-1.5 rounded transition-colors ${showInfo ? 'bg-gray-200' : 'hover:bg-gray-200'}`}
            aria-label="信息"
          >
            <Info className="h-4 w-4 text-gray-600" />
          </button>
          
          <button
            onClick={handleFullscreen}
            className="p-1.5 rounded hover:bg-gray-200 transition-colors"
            aria-label="全屏"
          >
            <Maximize2 className="h-4 w-4 text-gray-600" />
          </button>
          
          <button
            onClick={handleExport}
            className="p-1.5 rounded hover:bg-gray-200 transition-colors"
            aria-label="导出"
          >
            <Download className="h-4 w-4 text-gray-600" />
          </button>
        </div>
      </div>
      
      {/* 设置面板 */}
      {showSettings && (
        <motion.div
          className="p-3 border-b border-gray-100 bg-gray-50"
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <div className="text-sm text-gray-600">
            <p>模拟器设置</p>
            <p className="text-xs mt-1">这里可以添加各种设置选项</p>
          </div>
        </motion.div>
      )}
      
      {/* 信息面板 */}
      {showInfo && (
        <motion.div
          className="p-3 border-b border-gray-100 bg-blue-50"
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <div className="text-sm text-blue-800">
            <p>模拟器说明</p>
            <p className="text-xs mt-1">这里可以添加模拟器的使用说明和相关信息</p>
          </div>
        </motion.div>
      )}
      
      {/* 模拟器内容区域 */}
      <div className="p-4">
        {renderSimulatorContent()}
      </div>
    </div>
  );
}

// 以下是各种类型的模拟器组件的简化实现
// 在实际项目中，每个模拟器都应该有自己完整的实现

function TimelineSimulator({ state, updateState }: { state: any; updateState: (key: string, value: any) => void }) {
  const [year, setYear] = useState(state.year || 1970);
  const [milestone, setMilestone] = useState(state.milestone || "");
  
  useEffect(() => {
    updateState('year', year);
    updateState('milestone', milestone);
  }, [year, milestone, updateState]);
  
  return (
    <div className="space-y-4">
      <LabSlider
        label="年份"
        value={year}
        min={1970}
        max={2020}
        step={1}
        unit="年"
        onChange={setYear}
      />
      
      <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
        <p className="text-sm font-medium text-gray-700">里程碑事件</p>
        <p className="text-sm text-gray-600 mt-1">
          {year < 1980 && "微处理器时代开始"}
          {year >= 1980 && year < 1990 && "个人计算机革命"}
          {year >= 1990 && year < 2000 && "互联网时代"}
          {year >= 2000 && year < 2010 && "移动计算时代"}
          {year >= 2010 && "人工智能与物联网时代"}
        </p>
      </div>
    </div>
  );
}

function CrystalSimulator({ state, updateState }: { state: any; updateState: (key: string, value: any) => void }) {
  const [latticeConstant, setLatticeConstant] = useState(state.latticeConstant || 5.43);
  const [temperature, setTemperature] = useState(state.temperature || 300);
  
  useEffect(() => {
    updateState('latticeConstant', latticeConstant);
    updateState('temperature', temperature);
  }, [latticeConstant, temperature, updateState]);
  
  return (
    <div className="space-y-4">
      <LabSlider
        label="晶格常数"
        value={latticeConstant}
        min={5.0}
        max={6.0}
        step={0.01}
        unit="Å"
        onChange={setLatticeConstant}
      />
      
      <LabSlider
        label="温度"
        value={temperature}
        min={0}
        max={1000}
        step={10}
        unit="K"
        onChange={setTemperature}
      />
      
      <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
        <p className="text-sm font-medium text-gray-700">晶体结构</p>
        <div className="mt-2 flex justify-center">
          <div className="w-32 h-32 bg-blue-100 rounded-lg flex items-center justify-center">
            <span className="text-xs text-blue-600">晶体结构图</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// 其他模拟器组件的简化实现
function DopantSimulator({ state, updateState }: { state: any; updateState: (key: string, value: any) => void }) {
  return <div className="text-center text-gray-500 py-8">Dopant 模拟器开发中...</div>;
}

function CurrentSimulator({ state, updateState }: { state: any; updateState: (key: string, value: any) => void }) {
  return <div className="text-center text-gray-500 py-8">Current 模拟器开发中...</div>;
}

function VoltageSimulator({ state, updateState }: { state: any; updateState: (key: string, value: any) => void }) {
  return <div className="text-center text-gray-500 py-8">Voltage 模拟器开发中...</div>;
}

function CapacitanceSimulator({ state, updateState }: { state: any; updateState: (key: string, value: any) => void }) {
  return <div className="text-center text-gray-500 py-8">Capacitance 模拟器开发中...</div>;
}

function TransistorSimulator({ state, updateState }: { state: any; updateState: (key: string, value: any) => void }) {
  return <div className="text-center text-gray-500 py-8">Transistor 模拟器开发中...</div>;
}

function CmosSimulator({ state, updateState }: { state: any; updateState: (key: string, value: any) => void }) {
  return <div className="text-center text-gray-500 py-8">CMOS 模拟器开发中...</div>;
}

function ScalingSimulator({ state, updateState }: { state: any; updateState: (key: string, value: any) => void }) {
  return <div className="text-center text-gray-500 py-8">Scaling 模拟器开发中...</div>;
}

function LithographySimulator({ state, updateState }: { state: any; updateState: (key: string, value: any) => void }) {
  return <div className="text-center text-gray-500 py-8">Lithography 模拟器开发中...</div>;
}

function EtchingSimulator({ state, updateState }: { state: any; updateState: (key: string, value: any) => void }) {
  return <div className="text-center text-gray-500 py-8">Etching 模拟器开发中...</div>;
}

function DepositionSimulator({ state, updateState }: { state: any; updateState: (key: string, value: any) => void }) {
  return <div className="text-center text-gray-500 py-8">Deposition 模拟器开发中...</div>;
}

function MetallizationSimulator({ state, updateState }: { state: any; updateState: (key: string, value: any) => void }) {
  return <div className="text-center text-gray-500 py-8">Metallization 模拟器开发中...</div>;
}

function PackagingSimulator({ state, updateState }: { state: any; updateState: (key: string, value: any) => void }) {
  return <div className="text-center text-gray-500 py-8">Packaging 模拟器开发中...</div>;
}

function TestingSimulator({ state, updateState }: { state: any; updateState: (key: string, value: any) => void }) {
  return <div className="text-center text-gray-500 py-8">Testing 模拟器开发中...</div>;
}

function AsicSimulator({ state, updateState }: { state: any; updateState: (key: string, value: any) => void }) {
  return <div className="text-center text-gray-500 py-8">ASIC 模拟器开发中...</div>;
}

function FpgaSimulator({ state, updateState }: { state: any; updateState: (key: string, value: any) => void }) {
  return <div className="text-center text-gray-500 py-8">FPGA 模拟器开发中...</div>;
}

function VerificationSimulator({ state, updateState }: { state: any; updateState: (key: string, value: any) => void }) {
  return <div className="text-center text-gray-500 py-8">Verification 模拟器开发中...</div>;
}

function EmergingSimulator({ state, updateState }: { state: any; updateState: (key: string, value: any) => void }) {
  return <div className="text-center text-gray-500 py-8">Emerging 模拟器开发中...</div>;
}

// 新增的半导体物理模拟器
function BandStructureSimulator({ state, updateState }: { state: any; updateState: (key: string, value: any) => void }) {
  const [material, setMaterial] = useState(state.material || "silicon");
  const [temperature, setTemperature] = useState(state.temperature || 300);
  
  useEffect(() => {
    updateState("material", material);
    updateState("temperature", temperature);
  }, [material, temperature, updateState]);
  
  // 材料参数
  const materialParams = {
    silicon: { bandgap: 1.12, color: "#3B82F6", label: "硅 (Si)" },
    germanium: { bandgap: 0.66, color: "#10B981", label: "锗 (Ge)" },
    galliumArsenide: { bandgap: 1.42, color: "#F59E0B", label: "砷化镓 (GaAs)" }
  };
  
  const currentMaterial = materialParams[material as keyof typeof materialParams];
  
  // 生成能带数据点
  const generateBandData = () => {
    const points = 50;
    const kValues = Array.from({ length: points }, (_, i) => -Math.PI + (2 * Math.PI * i) / (points - 1));
    
    // 导带 (简化抛物线模型)
    const conductionBand = kValues.map(k => ({
      x: k,
      y: currentMaterial.bandgap + 0.5 * k * k
    }));
    
    // 价带 (简化抛物线模型)
    const valenceBand = kValues.map(k => ({
      x: k,
      y: -0.5 * k * k
    }));
    
    return { conductionBand, valenceBand };
  };
  
  const { conductionBand, valenceBand } = generateBandData();
  
  // SVG参数
  const width = 500;
  const height = 300;
  const padding = 40;
  const xScale = (width - 2 * padding) / (2 * Math.PI);
  const yScale = 40; // 能量缩放因子
  
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <label className="text-sm font-medium text-gray-700">材料:</label>
          <select 
            value={material} 
            onChange={(e) => setMaterial(e.target.value)}
            className="px-3 py-1 border border-gray-300 rounded-md text-sm"
          >
            <option value="silicon">硅 (Si)</option>
            <option value="germanium">锗 (Ge)</option>
            <option value="galliumArsenide">砷化镓 (GaAs)</option>
          </select>
        </div>
        
        <div className="text-sm text-gray-600">
          禁带宽度: {currentMaterial.bandgap} eV
        </div>
      </div>
      
      <div className="bg-white p-4 rounded border border-gray-200">
        <svg width={width} height={height} className="w-full h-auto">
          {/* 网格线 */}
          <g className="text-gray-300">
            {Array.from({ length: 5 }, (_, i) => (
              <line
                key={`h-${i}`}
                x1={padding}
                y1={padding + i * (height - 2 * padding) / 4}
                x2={width - padding}
                y2={padding + i * (height - 2 * padding) / 4}
                stroke="currentColor"
                strokeWidth="0.5"
              />
            ))}
            {Array.from({ length: 5 }, (_, i) => (
              <line
                key={`v-${i}`}
                x1={padding + i * (width - 2 * padding) / 4}
                y1={padding}
                x2={padding + i * (width - 2 * padding) / 4}
                y2={height - padding}
                stroke="currentColor"
                strokeWidth="0.5"
              />
            ))}
          </g>
          
          {/* 坐标轴 */}
          <g className="text-gray-500">
            <line x1={padding} y1={height - padding} x2={width - padding} y2={height - padding} stroke="currentColor" strokeWidth="1" />
            <line x1={padding} y1={padding} x2={padding} y2={height - padding} stroke="currentColor" strokeWidth="1" />
            
            {/* 轴标签 */}
            <text x={width / 2} y={height - 10} textAnchor="middle" className="text-xs">波矢 k</text>
            <text x="15" y={height / 2} textAnchor="middle" transform={`rotate(-90 15 ${height / 2})`} className="text-xs">能量 E</text>
          </g>
          
          {/* 费米能级 */}
          <line
            x1={padding}
            y1={height / 2}
            x2={width - padding}
            y2={height / 2}
            stroke="#EF4444"
            strokeWidth="1"
            strokeDasharray="5,5"
          />
          <text x={width - padding + 5} y={height / 2} className="text-xs fill-red-500">E<sub>F</sub></text>
          
          {/* 价带 */}
          <path
            d={`M ${valenceBand.map(p => `${padding + (p.x + Math.PI) * xScale},${height / 2 + p.y * yScale}`).join(' L ')}`}
            fill="none"
            stroke={currentMaterial.color}
            strokeWidth="2"
          />
          
          {/* 导带 */}
          <path
            d={`M ${conductionBand.map(p => `${padding + (p.x + Math.PI) * xScale},${height / 2 - p.y * yScale}`).join(' L ')}`}
            fill="none"
            stroke={currentMaterial.color}
            strokeWidth="2"
          />
          
          {/* 禁带宽度标记 */}
          <line
            x1={width / 2}
            y1={height / 2}
            x2={width / 2}
            y2={height / 2 - currentMaterial.bandgap * yScale}
            stroke="#6B7280"
            strokeWidth="1"
          />
          <text x={width / 2 + 5} y={height / 2 - currentMaterial.bandgap * yScale / 2} className="text-xs fill-gray-500">
            E<sub>g</sub>
          </text>
        </svg>
      </div>
      
      <div className="text-sm text-gray-600">
        <p>能带结构展示了电子能量与波矢k的关系，是理解半导体电子特性的基础。</p>
        <p className="mt-1">红色虚线表示费米能级，蓝色曲线表示导带和价带。</p>
      </div>
    </div>
  );
}

function EnergyGapSimulator({ state, updateState }: { state: any; updateState: (key: string, value: any) => void }) {
  const [temperature, setTemperature] = useState(state.temperature || 300);
  
  useEffect(() => {
    updateState("temperature", temperature);
  }, [temperature, updateState]);
  
  // 计算禁带宽度 (简化模型)
  const calculateEnergyGap = () => {
    const Eg0 = 1.12; // 硅在0K时的禁带宽度 (eV)
    const alpha = 4.73e-4; // 温度系数
    const beta = 636; // 温度参数
    return Eg0 - (alpha * temperature * temperature) / (temperature + beta);
  };
  
  const energyGap = calculateEnergyGap();
  
  return (
    <div className="space-y-4">
      <LabSlider
        label="温度"
        value={temperature}
        min={0}
        max={500}
        unit="K"
        onChange={setTemperature}
      />
      
      <div className="bg-gray-50 p-4 rounded border-l-4 border-blue-500">
        <p className="font-mono text-center text-lg">
          E<sub>g</sub>({temperature}K) = {energyGap.toFixed(3)} eV
        </p>
      </div>
      
      <div className="h-64 bg-white rounded border border-gray-200 flex items-center justify-center">
        <p className="text-gray-500">禁带宽度随温度变化曲线</p>
      </div>
      
      <div className="text-sm text-gray-600">
        <p>禁带宽度随温度升高而减小，这是由于晶格振动加剧导致原子间距增大。</p>
      </div>
    </div>
  );
}

function CarrierMobilitySimulator({ state, updateState }: { state: any; updateState: (key: string, value: any) => void }) {
  const [dopingConcentration, setDopingConcentration] = useState(state.dopingConcentration || 1e15);
  const [carrierType, setCarrierType] = useState(state.carrierType || "electron");
  
  useEffect(() => {
    updateState("dopingConcentration", dopingConcentration);
    updateState("carrierType", carrierType);
  }, [dopingConcentration, carrierType, updateState]);
  
  // 计算载流子迁移率 (简化模型)
  const calculateMobility = () => {
    const mu0 = carrierType === "electron" ? 1400 : 450; // 本征迁移率 (cm²/V·s)
    const Nref = 1e17; // 参考掺杂浓度
    const alpha = carrierType === "electron" ? 0.72 : 0.76; // 经验参数
    
    return mu0 / (1 + Math.pow(dopingConcentration / Nref, alpha));
  };
  
  const mobility = calculateMobility();
  
  return (
    <div className="space-y-4">
      <div className="flex space-x-4">
        <button
          className={`px-3 py-1 rounded ${carrierType === "electron" ? "bg-blue-500 text-white" : "bg-gray-200"}`}
          onClick={() => setCarrierType("electron")}
        >
          电子
        </button>
        <button
          className={`px-3 py-1 rounded ${carrierType === "hole" ? "bg-blue-500 text-white" : "bg-gray-200"}`}
          onClick={() => setCarrierType("hole")}
        >
          空穴
        </button>
      </div>
      
      <LabSlider
        label="掺杂浓度"
        value={Math.log10(dopingConcentration)}
        min={14}
        max={19}
        step={0.1}
        unit="log(cm⁻³)"
        onChange={(value) => setDopingConcentration(Math.pow(10, value))}
      />
      
      <div className="bg-gray-50 p-4 rounded border-l-4 border-blue-500">
        <p className="font-mono text-center text-lg">
          μ<sub>{carrierType === "electron" ? "n" : "p"}</sub> = {mobility.toFixed(1)} cm²/V·s
        </p>
      </div>
      
      <div className="h-64 bg-white rounded border border-gray-200 flex items-center justify-center">
        <p className="text-gray-500">载流子迁移率随掺杂浓度变化曲线</p>
      </div>
      
      <div className="text-sm text-gray-600">
        <p>载流子迁移率随掺杂浓度增加而降低，主要由于杂质散射效应增强。</p>
      </div>
    </div>
  );
}

function DriftVelocitySimulator({ state, updateState }: { state: any; updateState: (key: string, value: any) => void }) {
  const [electricField, setElectricField] = useState(state.electricField || 1000);
  const [carrierType, setCarrierType] = useState(state.carrierType || "electron");
  
  useEffect(() => {
    updateState("electricField", electricField);
    updateState("carrierType", carrierType);
  }, [electricField, carrierType, updateState]);
  
  // 计算漂移速度 (简化模型)
  const calculateDriftVelocity = () => {
    const mu0 = carrierType === "electron" ? 1400 : 450; // 低场迁移率 (cm²/V·s)
    const vsat = carrierType === "electron" ? 1e7 : 0.8e7; // 饱和速度 (cm/s)
    const Ec = vsat / mu0; // 临界电场
    
    if (electricField < Ec) {
      return mu0 * electricField; // 低场区
    } else {
      return vsat; // 高场饱和区
    }
  };
  
  const driftVelocity = calculateDriftVelocity();
  
  return (
    <div className="space-y-4">
      <div className="flex space-x-4">
        <button
          className={`px-3 py-1 rounded ${carrierType === "electron" ? "bg-blue-500 text-white" : "bg-gray-200"}`}
          onClick={() => setCarrierType("electron")}
        >
          电子
        </button>
        <button
          className={`px-3 py-1 rounded ${carrierType === "hole" ? "bg-blue-500 text-white" : "bg-gray-200"}`}
          onClick={() => setCarrierType("hole")}
        >
          空穴
        </button>
      </div>
      
      <LabSlider
        label="电场强度"
        value={electricField}
        min={0}
        max={10000}
        step={100}
        unit="V/cm"
        onChange={setElectricField}
      />
      
      <div className="bg-gray-50 p-4 rounded border-l-4 border-blue-500">
        <p className="font-mono text-center text-lg">
          v<sub>drift</sub> = {driftVelocity.toExponential(2)} cm/s
        </p>
      </div>
      
      <div className="h-64 bg-white rounded border border-gray-200 flex items-center justify-center">
        <p className="text-gray-500">漂移速度随电场强度变化曲线</p>
      </div>
      
      <div className="text-sm text-gray-600">
        <p>在低电场下，漂移速度与电场成正比；在高电场下，漂移速度趋于饱和。</p>
      </div>
    </div>
  );
}

function PnJunctionSimulator({ state, updateState }: { state: any; updateState: (key: string, value: any) => void }) {
  const [pDoping, setPDoping] = useState(state.pDoping || 1e16);
  const [nDoping, setNDoping] = useState(state.nDoping || 1e16);
  const [temperature, setTemperature] = useState(state.temperature || 300);
  
  useEffect(() => {
    updateState("pDoping", pDoping);
    updateState("nDoping", nDoping);
    updateState("temperature", temperature);
  }, [pDoping, nDoping, temperature, updateState]);
  
  // 计算内建电势 (简化模型)
  const calculateBuiltInPotential = () => {
    const k = 8.617e-5; // 玻尔兹曼常数 (eV/K)
    const ni = 1.5e10; // 硅的本征载流子浓度 (cm⁻³)
    
    return k * temperature * Math.log((pDoping * nDoping) / (ni * ni));
  };
  
  const builtInPotential = calculateBuiltInPotential();
  
  return (
    <div className="space-y-4">
      <LabSlider
        label="P型掺杂浓度"
        value={Math.log10(pDoping)}
        min={14}
        max={19}
        step={0.1}
        unit="log(cm⁻³)"
        onChange={(value) => setPDoping(Math.pow(10, value))}
      />
      
      <LabSlider
        label="N型掺杂浓度"
        value={Math.log10(nDoping)}
        min={14}
        max={19}
        step={0.1}
        unit="log(cm⁻³)"
        onChange={(value) => setNDoping(Math.pow(10, value))}
      />
      
      <LabSlider
        label="温度"
        value={temperature}
        min={200}
        max={400}
        unit="K"
        onChange={setTemperature}
      />
      
      <div className="bg-gray-50 p-4 rounded border-l-4 border-blue-500">
        <p className="font-mono text-center text-lg">
          V<sub>bi</sub> = {builtInPotential.toFixed(3)} V
        </p>
      </div>
      
      <div className="h-64 bg-white rounded border border-gray-200 flex items-center justify-center">
        <p className="text-gray-500">PN结能带图</p>
      </div>
      
      <div className="text-sm text-gray-600">
        <p>PN结的内建电势由两侧掺杂浓度和温度决定，它阻止了载流子的进一步扩散。</p>
      </div>
    </div>
  );
}

function DiodeIVSimulator({ state, updateState }: { state: any; updateState: (key: string, value: any) => void }) {
  const [voltage, setVoltage] = useState(state.voltage || 0.5);
  const [temperature, setTemperature] = useState(state.temperature || 300);
  const [saturationCurrent, setSaturationCurrent] = useState(state.saturationCurrent || 1e-12);
  
  useEffect(() => {
    updateState("voltage", voltage);
    updateState("temperature", temperature);
    updateState("saturationCurrent", saturationCurrent);
  }, [voltage, temperature, saturationCurrent, updateState]);
  
  // 计算二极管电流 (肖克利方程)
  const calculateDiodeCurrent = () => {
    const k = 1.38e-23; // 玻尔兹曼常数 (J/K)
    const q = 1.602e-19; // 电子电荷 (C)
    const n = 1; // 理想因子
    
    const thermalVoltage = k * temperature / q; // 热电压
    
    if (voltage < -5) {
      // 反向击穿简化处理
      return -saturationCurrent * 100;
    } else {
      return saturationCurrent * (Math.exp(voltage / (n * thermalVoltage)) - 1);
    }
  };
  
  const current = calculateDiodeCurrent();
  
  return (
    <div className="space-y-4">
      <LabSlider
        label="电压"
        value={voltage}
        min={-2}
        max={0.8}
        step={0.05}
        unit="V"
        onChange={setVoltage}
      />
      
      <LabSlider
        label="温度"
        value={temperature}
        min={200}
        max={400}
        unit="K"
        onChange={setTemperature}
      />
      
      <LabSlider
        label="反向饱和电流"
        value={Math.log10(saturationCurrent)}
        min={-15}
        max={-9}
        step={0.1}
        unit="log(A)"
        onChange={(value) => setSaturationCurrent(Math.pow(10, value))}
      />
      
      <div className="bg-gray-50 p-4 rounded border-l-4 border-blue-500">
        <p className="font-mono text-center text-lg">
          I = {current.toExponential(2)} A
        </p>
      </div>
      
      <div className="h-64 bg-white rounded border border-gray-200 flex items-center justify-center">
        <p className="text-gray-500">二极管I-V特性曲线</p>
      </div>
      
      <div className="text-sm text-gray-600">
        <p>二极管电流随正向电压指数增长，反向电流基本恒定等于反向饱和电流。</p>
      </div>
    </div>
  );
}

// 晶体结构模拟器
function CrystalStructureSimulator({ state, updateState }: { state: any; updateState: (key: string, value: any) => void }) {
  const [latticeType, setLatticeType] = useState("diamond");
  const [latticeConstant, setLatticeConstant] = useState(5.43);
  const [rotation, setRotation] = useState({ x: 30, y: 45 });

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-2">晶体类型</label>
          <select 
            className="w-full p-2 border border-gray-300 rounded"
            value={latticeType}
            onChange={(e) => setLatticeType(e.target.value)}
          >
            <option value="diamond">金刚石结构</option>
            <option value="zincblende">闪锌矿结构</option>
            <option value="wurtzite">纤锌矿结构</option>
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-2">晶格常数 (Å)</label>
          <input 
            type="number" 
            className="w-full p-2 border border-gray-300 rounded"
            value={latticeConstant}
            onChange={(e) => setLatticeConstant(parseFloat(e.target.value))}
            step="0.01"
            min="3"
            max="10"
          />
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <LabSlider
          label="X轴旋转"
          value={rotation.x}
          min={0}
          max={360}
          unit="°"
          onChange={(value) => setRotation({ ...rotation, x: value })}
        />
        
        <LabSlider
          label="Y轴旋转"
          value={rotation.y}
          min={0}
          max={360}
          unit="°"
          onChange={(value) => setRotation({ ...rotation, y: value })}
        />
      </div>
      
      <div className="bg-gray-50 p-4 rounded border-l-4 border-blue-500">
        <p className="font-mono text-center text-lg">
          {latticeType === "diamond" && "硅 (Si) - 金刚石结构"}
          {latticeType === "zincblende" && "砷化镓 (GaAs) - 闪锌矿结构"}
          {latticeType === "wurtzite" && "氮化镓 (GaN) - 纤锌矿结构"}
        </p>
        <p className="font-mono text-center text-sm">
          a = {latticeConstant.toFixed(2)} Å
        </p>
      </div>
      
      <div className="h-64 bg-white rounded border border-gray-200 flex items-center justify-center">
        <p className="text-gray-500">晶体结构3D可视化</p>
      </div>
      
      <div className="text-sm text-gray-600">
        <p>晶体结构决定了半导体材料的基本物理性质，包括能带结构和载流子迁移率。</p>
      </div>
    </div>
  );
}

// 能带形成模拟器
function BandFormationSimulator({ state, updateState }: { state: any; updateState: (key: string, value: any) => void }) {
  const [atomSpacing, setAtomSpacing] = useState(2.5);
  const [electronCount, setElectronCount] = useState(4);
  const [showFormation, setShowFormation] = useState(false);

  return (
    <div className="space-y-4">
      <LabSlider
        label="原子间距"
        value={atomSpacing}
        min={1}
        max={5}
        step={0.1}
        unit="Å"
        onChange={setAtomSpacing}
      />
      
      <LabSlider
        label="价电子数"
        value={electronCount}
        min={1}
        max={8}
        step={1}
        unit="个"
        onChange={setElectronCount}
      />
      
      <div className="flex items-center space-x-4">
        <button
          className={`px-4 py-2 rounded ${
            showFormation 
              ? "bg-blue-500 text-white" 
              : "bg-gray-200 text-gray-700"
          }`}
          onClick={() => setShowFormation(!showFormation)}
        >
          {showFormation ? "显示能带形成过程" : "显示单个原子能级"}
        </button>
      </div>
      
      <div className="bg-gray-50 p-4 rounded border-l-4 border-blue-500">
        <p className="font-mono text-center text-lg">
          {showFormation ? "能带结构" : "孤立原子能级"}
        </p>
        <p className="font-mono text-center text-sm">
          原子间距: {atomSpacing.toFixed(1)} Å | 价电子: {electronCount}
        </p>
      </div>
      
      <div className="h-64 bg-white rounded border border-gray-200 flex items-center justify-center">
        <p className="text-gray-500">
          {showFormation ? "能带形成动画" : "原子能级图"}
        </p>
      </div>
      
      <div className="text-sm text-gray-600">
        <p>当原子相互靠近形成晶体时，原子轨道重叠，分立的能级扩展成连续的能带。</p>
      </div>
    </div>
  );
}

// 能带比较模拟器
function BandComparisonSimulator({ state, updateState }: { state: any; updateState: (key: string, value: any) => void }) {
  const [material1, setMaterial1] = useState("silicon");
  const [material2, setMaterial2] = useState("germanium");
  const [temperature, setTemperature] = useState(300);

  const materials = {
    silicon: { name: "硅 (Si)", bandGap: 1.12, color: "blue" },
    germanium: { name: "锗 (Ge)", bandGap: 0.66, color: "green" },
    galliumArsenide: { name: "砷化镓 (GaAs)", bandGap: 1.42, color: "red" },
    galliumNitride: { name: "氮化镓 (GaN)", bandGap: 3.4, color: "purple" }
  };

  const mat1 = materials[material1 as keyof typeof materials];
  const mat2 = materials[material2 as keyof typeof materials];

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-2">材料 1</label>
          <select 
            className="w-full p-2 border border-gray-300 rounded"
            value={material1}
            onChange={(e) => setMaterial1(e.target.value)}
          >
            <option value="silicon">硅 (Si)</option>
            <option value="germanium">锗 (Ge)</option>
            <option value="galliumArsenide">砷化镓 (GaAs)</option>
            <option value="galliumNitride">氮化镓 (GaN)</option>
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-2">材料 2</label>
          <select 
            className="w-full p-2 border border-gray-300 rounded"
            value={material2}
            onChange={(e) => setMaterial2(e.target.value)}
          >
            <option value="silicon">硅 (Si)</option>
            <option value="germanium">锗 (Ge)</option>
            <option value="galliumArsenide">砷化镓 (GaAs)</option>
            <option value="galliumNitride">氮化镓 (GaN)</option>
          </select>
        </div>
      </div>
      
      <LabSlider
        label="温度"
        value={temperature}
        min={0}
        max={500}
        unit="K"
        onChange={setTemperature}
      />
      
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-gray-50 p-4 rounded border-l-4 border-blue-500">
          <p className="font-mono text-center text-lg">{mat1.name}</p>
          <p className="font-mono text-center text-sm">
            E<sub>g</sub> = {mat1.bandGap.toFixed(2)} eV
          </p>
        </div>
        
        <div className="bg-gray-50 p-4 rounded border-l-4 border-green-500">
          <p className="font-mono text-center text-lg">{mat2.name}</p>
          <p className="font-mono text-center text-sm">
            E<sub>g</sub> = {mat2.bandGap.toFixed(2)} eV
          </p>
        </div>
      </div>
      
      <div className="h-64 bg-white rounded border border-gray-200 flex items-center justify-center">
        <p className="text-gray-500">能带结构对比图</p>
      </div>
      
      <div className="text-sm text-gray-600">
        <p>不同半导体材料的能带结构差异决定了它们在电子器件中的不同应用。</p>
      </div>
    </div>
  );
}