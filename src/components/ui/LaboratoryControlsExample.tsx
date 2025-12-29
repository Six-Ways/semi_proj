"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { 
  LabSlider, 
  LabSwitch, 
  LabButtonGroup, 
  LabGauge, 
  LabControlPanel, 
  LabStatusIndicator 
} from "@/components/ui/LaboratoryControls";
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
  Pause,
  Cpu,
  Battery,
  Wifi
} from "lucide-react";

// 实验室控制示例组件
export function LaboratoryControlsExample() {
  // 状态管理
  const [voltage, setVoltage] = useState(3.3);
  const [current, setCurrent] = useState(1.2);
  const [temperature, setTemperature] = useState(25);
  const [frequency, setFrequency] = useState(1000);
  const [power, setPower] = useState(voltage * current);
  const [isPowerOn, setIsPowerOn] = useState(true);
  const [isAutoMode, setIsAutoMode] = useState(false);
  const [isCoolingOn, setIsCoolingOn] = useState(false);
  const [deviceType, setDeviceType] = useState("diode");
  const [measurementMode, setMeasurementMode] = useState("voltage");
  const [systemStatus, setSystemStatus] = useState<"active" | "inactive" | "warning" | "error">("active");
  
  // 更新功率
  React.useEffect(() => {
    setPower(voltage * current);
  }, [voltage, current]);
  
  // 更新系统状态
  React.useEffect(() => {
    if (temperature > 80) {
      setSystemStatus("error");
    } else if (temperature > 60) {
      setSystemStatus("warning");
    } else if (isPowerOn) {
      setSystemStatus("active");
    } else {
      setSystemStatus("inactive");
    }
  }, [temperature, isPowerOn]);
  
  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-8"
      >
        <h1 className="text-2xl font-bold text-gray-900 mb-2">半导体实验室控制面板</h1>
        <p className="text-gray-600">交互式实验室仪器风格组件演示</p>
      </motion.div>
      
      {/* 状态指示器 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <LabStatusIndicator
          status={systemStatus}
          label="系统状态"
          value={systemStatus === "active" ? "运行中" : systemStatus === "inactive" ? "已停止" : systemStatus === "warning" ? "警告" : "错误"}
          description="半导体测试系统"
          animated
        />
        
        <LabStatusIndicator
          status={isPowerOn ? "active" : "inactive"}
          label="电源状态"
          value={isPowerOn ? "开启" : "关闭"}
          description="主电源供应"
          animated
        />
        
        <LabStatusIndicator
          status={temperature > 60 ? "warning" : "active"}
          label="温度监控"
          value={`${temperature.toFixed(1)}°C`}
          description="设备温度"
          animated
        />
      </div>
      
      {/* 主要控制面板 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 电气参数控制 */}
        <LabControlPanel title="电气参数控制">
          <LabSlider
            label="电压"
            value={voltage}
            min={0}
            max={5}
            step={0.1}
            unit="V"
            precision={1}
            color="blue"
            onChange={setVoltage}
            disabled={!isPowerOn}
            description="调整测试电压"
          />
          
          <LabSlider
            label="电流"
            value={current}
            min={0}
            max={3}
            step={0.1}
            unit="A"
            precision={1}
            color="green"
            onChange={setCurrent}
            disabled={!isPowerOn}
            description="调整测试电流"
          />
          
          <LabSlider
            label="频率"
            value={frequency}
            min={100}
            max={10000}
            step={100}
            unit="Hz"
            precision={0}
            color="purple"
            onChange={setFrequency}
            disabled={!isPowerOn}
            description="信号频率设置"
          />
          
          <LabGauge
            label="功率"
            value={power}
            min={0}
            max={15}
            unit="W"
            precision={2}
            color="yellow"
            thresholds={[
              { value: 5, color: "green", label: "低功耗" },
              { value: 10, color: "yellow", label: "中功耗" },
              { value: 12, color: "red", label: "高功耗" }
            ]}
            description="实时功率监控"
          />
        </LabControlPanel>
        
        {/* 设备控制 */}
        <LabControlPanel title="设备控制">
          <LabSwitch
            label="主电源"
            checked={isPowerOn}
            onChange={setIsPowerOn}
            icon={<Power className="w-4 h-4" />}
            description="控制设备主电源"
            color="blue"
          />
          
          <LabSwitch
            label="自动模式"
            checked={isAutoMode}
            onChange={setIsAutoMode}
            disabled={!isPowerOn}
            icon={<Settings className="w-4 h-4" />}
            description="启用自动测试模式"
            color="green"
          />
          
          <LabSwitch
            label="冷却系统"
            checked={isCoolingOn}
            onChange={setIsCoolingOn}
            disabled={!isPowerOn}
            icon={<Thermometer className="w-4 h-4" />}
            description="启用设备冷却"
            color="blue"
          />
          
          <LabSlider
            label="温度设置"
            value={temperature}
            min={20}
            max={100}
            step={1}
            unit="°C"
            precision={1}
            color="red"
            onChange={setTemperature}
            disabled={!isPowerOn}
            description="目标温度设置"
          />
        </LabControlPanel>
      </div>
      
      {/* 测试模式选择 */}
      <LabControlPanel title="测试模式选择">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <LabButtonGroup
              label="器件类型"
              value={deviceType}
              onChange={setDeviceType}
              options={[
                { value: "diode", label: "二极管", icon: <Zap className="w-4 h-4" /> },
                { value: "transistor", label: "晶体管", icon: <Cpu className="w-4 h-4" /> },
                { value: "capacitor", label: "电容器", icon: <Battery className="w-4 h-4" /> },
                { value: "resistor", label: "电阻器", icon: <Activity className="w-4 h-4" /> }
              ]}
              disabled={!isPowerOn}
              color="blue"
              description="选择要测试的器件类型"
            />
          </div>
          
          <div>
            <LabButtonGroup
              label="测量模式"
              value={measurementMode}
              onChange={setMeasurementMode}
              options={[
                { value: "voltage", label: "电压", icon: <Zap className="w-4 h-4" /> },
                { value: "current", label: "电流", icon: <Activity className="w-4 h-4" /> },
                { value: "resistance", label: "电阻", icon: <Gauge className="w-4 h-4" /> },
                { value: "frequency", label: "频率", icon: <Wifi className="w-4 h-4" /> }
              ]}
              disabled={!isPowerOn}
              color="green"
              description="选择测量参数"
            />
          </div>
        </div>
      </LabControlPanel>
      
      {/* 实时监控面板 */}
      <LabControlPanel title="实时监控">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">{voltage.toFixed(1)}V</div>
            <div className="text-sm text-blue-800">电压</div>
          </div>
          
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <div className="text-2xl font-bold text-green-600">{current.toFixed(1)}A</div>
            <div className="text-sm text-green-800">电流</div>
          </div>
          
          <div className="text-center p-4 bg-yellow-50 rounded-lg">
            <div className="text-2xl font-bold text-yellow-600">{power.toFixed(2)}W</div>
            <div className="text-sm text-yellow-800">功率</div>
          </div>
          
          <div className="text-center p-4 bg-red-50 rounded-lg">
            <div className="text-2xl font-bold text-red-600">{temperature.toFixed(1)}°C</div>
            <div className="text-sm text-red-800">温度</div>
          </div>
        </div>
      </LabControlPanel>
    </div>
  );
}

// 半导体特性测试组件
export function SemiconductorCharacterizationTest() {
  const [biasVoltage, setBiasVoltage] = useState(0);
  const [temperature, setTemperature] = useState(300);
  const [lightIntensity, setLightIntensity] = useState(0);
  const [isLightOn, setIsLightOn] = useState(false);
  const [measurementType, setMeasurementType] = useState("IV");
  const [isAutoSweep, setIsAutoSweep] = useState(false);
  
  // 计算理论电流 (简化的二极管方程)
  const calculateCurrent = () => {
    const Is = 1e-12; // 反向饱和电流
    const n = 1.5; // 理想因子
    const q = 1.602e-19; // 电子电荷
    const k = 1.381e-23; // 玻尔兹曼常数
    const T = temperature; // 温度(K)
    const V = biasVoltage; // 电压(V)
    
    // 简化的二极管方程
    const I = Is * (Math.exp(q * V / (n * k * T)) - 1);
    
    // 添加光生电流
    if (isLightOn) {
      const Iph = lightIntensity * 1e-6; // 光生电流与光强度成正比
      return I + Iph;
    }
    
    return I;
  };
  
  const current = calculateCurrent();
  
  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-8"
      >
        <h1 className="text-2xl font-bold text-gray-900 mb-2">半导体器件特性测试</h1>
        <p className="text-gray-600">PN结二极管I-V特性曲线测试</p>
      </motion.div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 测试参数控制 */}
        <LabControlPanel title="测试参数控制">
          <LabSlider
            label="偏置电压"
            value={biasVoltage}
            min={-2}
            max={2}
            step={0.1}
            unit="V"
            precision={2}
            color="blue"
            onChange={setBiasVoltage}
            description="施加在二极管两端的电压"
          />
          
          <LabSlider
            label="温度"
            value={temperature}
            min={200}
            max={400}
            step={10}
            unit="K"
            precision={0}
            color="red"
            onChange={setTemperature}
            description="器件温度"
          />
          
          <LabSwitch
            label="光照"
            checked={isLightOn}
            onChange={setIsLightOn}
            icon={<Zap className="w-4 h-4" />}
            description="模拟光照条件"
            color="yellow"
          />
          
          {isLightOn && (
            <LabSlider
              label="光强度"
              value={lightIntensity}
              min={0}
              max={1000}
              step={10}
              unit="W/m²"
              precision={0}
              color="yellow"
              onChange={setLightIntensity}
              description="入射光强度"
            />
          )}
          
          <LabSwitch
            label="自动扫描"
            checked={isAutoSweep}
            onChange={setIsAutoSweep}
            icon={<Play className="w-4 h-4" />}
            description="自动扫描电压范围"
            color="green"
          />
        </LabControlPanel>
        
        {/* 测试结果显示 */}
        <LabControlPanel title="测试结果">
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">{biasVoltage.toFixed(2)}V</div>
                <div className="text-sm text-blue-800">偏置电压</div>
              </div>
              
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">
                  {current > 1e-3 ? `${(current * 1000).toFixed(2)}mA` : `${(current * 1e6).toFixed(2)}μA`}
                </div>
                <div className="text-sm text-green-800">电流</div>
              </div>
            </div>
            
            <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
              <div className="text-center text-gray-500">
                <div className="text-lg font-medium mb-2">I-V 特性曲线</div>
                <div className="text-sm">电压: {biasVoltage.toFixed(2)}V</div>
                <div className="text-sm">电流: {current > 1e-3 ? `${(current * 1000).toFixed(2)}mA` : `${(current * 1e6).toFixed(2)}μA`}</div>
                <div className="text-sm">温度: {temperature}K</div>
                {isLightOn && <div className="text-sm">光照: {lightIntensity}W/m²</div>}
              </div>
            </div>
            
            <LabButtonGroup
              label="测量类型"
              value={measurementType}
              onChange={setMeasurementType}
              options={[
                { value: "IV", label: "I-V特性" },
                { value: "CV", label: "C-V特性" },
                { value: "temp", label: "温度特性" },
                { value: "light", label: "光响应" }
              ]}
              color="purple"
            />
          </div>
        </LabControlPanel>
      </div>
    </div>
  );
}