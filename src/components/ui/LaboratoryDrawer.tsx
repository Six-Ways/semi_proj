"use client";

import { useState, useRef, useEffect } from "react";
import { X, ChevronRight, Play, RotateCcw, Info } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { BlockMath } from "@/components/math/MathFormula";
import { 
  useFocusManagement, 
  useScreenReaderAnnouncement, 
  useKeyboardNavigation,
  ARIA_ROLES,
  KEYBOARD_NAVIGATION,
  generateId
} from "@/utils/accessibility";

interface Chapter {
  id: string;
  number: string;
  title: string;
  formula: string;
  description: string;
  corePoints: string[];
  simulator: string;
}

interface LaboratoryDrawerProps {
  chapter: Chapter;
  isOpen: boolean;
  onClose: () => void;
}

export function LaboratoryDrawer({ chapter, isOpen, onClose }: LaboratoryDrawerProps) {
  const [simulatorState, setSimulatorState] = useState<Record<string, any>>({});
  const drawerRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const { announce, AnnouncementComponent } = useScreenReaderAnnouncement();
  const { trapFocus } = useFocusManagement(closeButtonRef as React.RefObject<HTMLElement>);
  
  // 生成唯一的ID用于ARIA属性
  const drawerId = generateId('drawer');
  const drawerTitleId = generateId('drawer-title');
  const drawerDescId = generateId('drawer-desc');

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (drawerRef.current && !drawerRef.current.contains(event.target as Node)) {
        onClose();
        announce("实验室抽屉已关闭");
      }
    };

    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === KEYBOARD_NAVIGATION.ESCAPE && isOpen) {
        onClose();
        announce("实验室抽屉已关闭");
        closeButtonRef.current?.focus();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleEscapeKey);
      document.body.style.overflow = 'hidden';
      
      // 聚焦到关闭按钮
      setTimeout(() => {
        closeButtonRef.current?.focus();
      }, 100);
      
      // 陷阱焦点在抽屉内
              const cleanupFocusTrap = trapFocus(drawerRef as React.RefObject<HTMLElement>);
      
      // 公告抽屉已打开
      announce(`已打开章节${chapter.number}：${chapter.title}`);
      
      return () => {
        cleanupFocusTrap?.();
      };
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscapeKey);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose, chapter.number, chapter.title, announce, trapFocus]);

  useEffect(() => {
    // 重置模拟器状态
    setSimulatorState({});
  }, [chapter.id]);

  const updateSimulatorState = (key: string, value: any) => {
    setSimulatorState(prev => ({ ...prev, [key]: value }));
  };

  const renderSimulator = () => {
    switch (chapter.simulator) {
      case "timeline":
        return <TimelineSimulator state={simulatorState} updateState={updateSimulatorState} />;
      case "crystal":
        return <CrystalSimulator state={simulatorState} updateState={updateSimulatorState} />;
      case "band":
        return <BandSimulator state={simulatorState} updateState={updateSimulatorState} />;
      case "carrier":
        return <CarrierSimulator state={simulatorState} updateState={updateSimulatorState} />;
      case "junction":
        return <JunctionSimulator state={simulatorState} updateState={updateSimulatorState} />;
      case "mosfet":
        return <MOSFETSimulator state={simulatorState} updateState={updateSimulatorState} />;
      case "bjt":
        return <BJTSimulator state={simulatorState} updateState={updateSimulatorState} />;
      case "optoelectronic":
        return <OptoelectronicSimulator state={simulatorState} updateState={updateSimulatorState} />;
      case "substrate":
        return <SubstrateSimulator state={simulatorState} updateState={updateSimulatorState} />;
      case "lithography":
        return <LithographySimulator state={simulatorState} updateState={updateSimulatorState} />;
      case "etch":
        return <EtchSimulator state={simulatorState} updateState={updateSimulatorState} />;
      case "doping":
        return <DopingSimulator state={simulatorState} updateState={updateSimulatorState} />;
      case "cmos":
        return <CMOSSimulator state={simulatorState} updateState={updateSimulatorState} />;
      case "memory":
        return <MemorySimulator state={simulatorState} updateState={updateSimulatorState} />;
      case "analog":
        return <AnalogSimulator state={simulatorState} updateState={updateSimulatorState} />;
      case "rf":
        return <RFSimulator state={simulatorState} updateState={updateSimulatorState} />;
      case "power":
        return <PowerSimulator state={simulatorState} updateState={updateSimulatorState} />;
      case "sensor":
        return <SensorSimulator state={simulatorState} updateState={updateSimulatorState} />;
      case "quantum":
        return <QuantumSimulator state={simulatorState} updateState={updateSimulatorState} />;
      case "future":
        return <FutureSimulator state={simulatorState} updateState={updateSimulatorState} />;
      default:
        return <div className="text-center text-gray-500 py-8">模拟器开发中...</div>;
    }
  };

  return (
    <>
      <div 
        className={`fixed inset-y-0 right-0 w-full md:w-1/2 lg:w-2/5 bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
        ref={drawerRef}
        id={drawerId}
        role={ARIA_ROLES.DIALOG}
        aria-modal="true"
        aria-labelledby={drawerTitleId}
        aria-describedby={drawerDescId}
      >
        <div className="h-full flex flex-col">
          {/* 抽屉头部 */}
          <div className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white p-6">
            <div className="flex justify-between items-start">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-sm font-mono bg-white/20 px-2 py-1 rounded">
                    {chapter.number}
                  </span>
                  <h2 id={drawerTitleId} className="text-xl font-bold font-serif">{chapter.title}</h2>
                </div>
                <p id={drawerDescId} className="text-indigo-100 text-sm">{chapter.description}</p>
              </div>
              <Button 
                ref={closeButtonRef}
                variant="outline" 
                size="sm" 
                onClick={() => {
                  onClose();
                  announce("实验室抽屉已关闭");
                }}
                className="text-white hover:bg-white/20"
                aria-label="关闭实验室抽屉"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
          </div>

        {/* 抽屉内容 */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* 核心公式 */}
          <div className="bg-slate-50 p-4 rounded-lg mb-6" role="region" aria-label="核心公式">
            <div className="text-center">
              <BlockMath formula={chapter.formula} />
            </div>
          </div>

          {/* 核心要点 */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2" id="core-points-heading">
              <Info className="h-5 w-5 text-indigo-500" />
              核心要点
            </h3>
            <div className="space-y-3" role="list" aria-labelledby="core-points-heading">
              {chapter.corePoints.map((point, index) => (
                <div key={index} className="flex gap-3" role="listitem">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-sm font-medium" aria-hidden="true">
                    {index + 1}
                  </div>
                  <p className="text-gray-700">{point}</p>
                </div>
              ))}
            </div>
          </div>

          {/* 交互式模拟器 */}
          <div>
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2" id="simulator-heading">
              <Play className="h-5 w-5 text-indigo-500" />
              交互式模拟器
            </h3>
            <Card className="overflow-hidden" aria-labelledby="simulator-heading">
              <CardContent className="p-4">
                {renderSimulator()}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
    
    <AnnouncementComponent />
  </>
  );
}

// 模拟器组件
function TimelineSimulator({ state, updateState }: { state: any; updateState: (key: string, value: any) => void }) {
  const [year, setYear] = useState(state.year || 2025);
  const [transistorCount, setTransistorCount] = useState(state.transistorCount || 10000000000);

  useEffect(() => {
    updateState('year', year);
    updateState('transistorCount', transistorCount);
  }, [year, transistorCount, updateState]);

  const calculateTransistors = (year: number) => {
    // 摩尔定律：每18个月翻倍
    const baseYear = 1971;
    const baseCount = 2300;
    const yearsElapsed = (year - baseYear) / 1.5;
    return Math.floor(baseCount * Math.pow(2, yearsElapsed));
  };

  return (
    <div className="space-y-4">
      <div className="bg-slate-50 p-4 rounded-lg">
        <label className="block text-sm font-medium mb-2">年份: {year}</label>
        <input
          type="range"
          min="1971"
          max="2030"
          value={year}
          onChange={(e) => {
            const newYear = parseInt(e.target.value);
            setYear(newYear);
            setTransistorCount(calculateTransistors(newYear));
          }}
          className="w-full"
        />
      </div>
      
      <div className="bg-indigo-50 p-4 rounded-lg">
        <p className="text-sm font-medium text-indigo-900">预测晶体管数量:</p>
        <p className="text-2xl font-bold text-indigo-600">
          {transistorCount.toLocaleString()}
        </p>
        <p className="text-xs text-indigo-700 mt-1">
          基于摩尔定律预测
        </p>
      </div>
    </div>
  );
}

function CrystalSimulator({ state, updateState }: { state: any; updateState: (key: string, value: any) => void }) {
  const [rotation, setRotation] = useState(state.rotation || 0);
  const [zoom, setZoom] = useState(state.zoom || 1);

  useEffect(() => {
    updateState('rotation', rotation);
    updateState('zoom', zoom);
  }, [rotation, zoom, updateState]);

  return (
    <div className="space-y-4">
      <div className="bg-slate-50 p-4 rounded-lg">
        <label className="block text-sm font-medium mb-2">旋转角度: {rotation}°</label>
        <input
          type="range"
          min="0"
          max="360"
          value={rotation}
          onChange={(e) => setRotation(parseInt(e.target.value))}
          className="w-full"
        />
      </div>
      
      <div className="bg-slate-50 p-4 rounded-lg">
        <label className="block text-sm font-medium mb-2">缩放: {zoom.toFixed(1)}x</label>
        <input
          type="range"
          min="0.5"
          max="2"
          step="0.1"
          value={zoom}
          onChange={(e) => setZoom(parseFloat(e.target.value))}
          className="w-full"
        />
      </div>
      
      <div className="bg-indigo-50 p-4 rounded-lg flex justify-center items-center h-48">
        <div 
          className="w-24 h-24 border-2 border-indigo-500 relative"
          style={{
            transform: `rotate(${rotation}deg) scale(${zoom})`,
            transformOrigin: 'center'
          }}
        >
          <div className="absolute inset-0 flex items-center justify-center text-indigo-600 font-mono text-xs">
            Si
          </div>
          <div className="absolute -top-2 -left-2 w-4 h-4 bg-indigo-500 rounded-full"></div>
          <div className="absolute -top-2 -right-2 w-4 h-4 bg-indigo-500 rounded-full"></div>
          <div className="absolute -bottom-2 -left-2 w-4 h-4 bg-indigo-500 rounded-full"></div>
          <div className="absolute -bottom-2 -right-2 w-4 h-4 bg-indigo-500 rounded-full"></div>
        </div>
      </div>
    </div>
  );
}

function BandSimulator({ state, updateState }: { state: any; updateState: (key: string, value: any) => void }) {
  const [energy, setEnergy] = useState(state.energy || 1.12);
  const [temperature, setTemperature] = useState(state.temperature || 300);

  useEffect(() => {
    updateState('energy', energy);
    updateState('temperature', temperature);
  }, [energy, temperature, updateState]);

  return (
    <div className="space-y-4">
      <div className="bg-slate-50 p-4 rounded-lg">
        <label className="block text-sm font-medium mb-2">禁带宽度: {energy.toFixed(2)} eV</label>
        <input
          type="range"
          min="0.5"
          max="3"
          step="0.01"
          value={energy}
          onChange={(e) => setEnergy(parseFloat(e.target.value))}
          className="w-full"
        />
      </div>
      
      <div className="bg-slate-50 p-4 rounded-lg">
        <label className="block text-sm font-medium mb-2">温度: {temperature} K</label>
        <input
          type="range"
          min="0"
          max="500"
          value={temperature}
          onChange={(e) => setTemperature(parseInt(e.target.value))}
          className="w-full"
        />
      </div>
      
      <div className="bg-indigo-50 p-4 rounded-lg">
        <p className="text-sm font-medium text-indigo-900 mb-2">能带图</p>
        <div className="relative h-32 bg-white rounded border border-indigo-200">
          <div className="absolute top-4 left-0 right-0 h-1 bg-blue-500"></div>
          <div className="absolute bottom-4 left-0 right-0 h-1 bg-red-500"></div>
          <div 
            className="absolute left-1/2 transform -translate-x-1/2 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white text-xs"
            style={{ bottom: `${(energy / 3) * 100}%` }}
          >
            e⁻
          </div>
          <div className="absolute top-0 left-0 text-xs text-blue-600">导带</div>
          <div className="absolute bottom-0 left-0 text-xs text-red-600">价带</div>
        </div>
      </div>
    </div>
  );
}

function CarrierSimulator({ state, updateState }: { state: any; updateState: (key: string, value: any) => void }) {
  const [voltage, setVoltage] = useState(state.voltage || 1);
  const [mobility, setMobility] = useState(state.mobility || 1350);

  useEffect(() => {
    updateState('voltage', voltage);
    updateState('mobility', mobility);
  }, [voltage, mobility, updateState]);

  const current = (voltage * mobility) / 1000;

  return (
    <div className="space-y-4">
      <div className="bg-slate-50 p-4 rounded-lg">
        <label className="block text-sm font-medium mb-2">电压: {voltage} V</label>
        <input
          type="range"
          min="0"
          max="5"
          step="0.1"
          value={voltage}
          onChange={(e) => setVoltage(parseFloat(e.target.value))}
          className="w-full"
        />
      </div>
      
      <div className="bg-slate-50 p-4 rounded-lg">
        <label className="block text-sm font-medium mb-2">电子迁移率: {mobility} cm²/V·s</label>
        <input
          type="range"
          min="100"
          max="2000"
          step="10"
          value={mobility}
          onChange={(e) => setMobility(parseInt(e.target.value))}
          className="w-full"
        />
      </div>
      
      <div className="bg-indigo-50 p-4 rounded-lg">
        <p className="text-sm font-medium text-indigo-900">计算结果:</p>
        <p className="text-lg font-bold text-indigo-600">
          电流密度: {current.toFixed(2)} mA/cm²
        </p>
        <p className="text-xs text-indigo-700 mt-1">
          J = q · n · μ · E
        </p>
      </div>
    </div>
  );
}

function JunctionSimulator({ state, updateState }: { state: any; updateState: (key: string, value: any) => void }) {
  const [bias, setBias] = useState(state.bias || 0);
  const [doping, setDoping] = useState(state.doping || 1e16);

  useEffect(() => {
    updateState('bias', bias);
    updateState('doping', doping);
  }, [bias, doping, updateState]);

  const barrierHeight = 0.7 - bias * 0.1;

  return (
    <div className="space-y-4">
      <div className="bg-slate-50 p-4 rounded-lg">
        <label className="block text-sm font-medium mb-2">偏置电压: {bias.toFixed(1)} V</label>
        <input
          type="range"
          min="-2"
          max="2"
          step="0.1"
          value={bias}
          onChange={(e) => setBias(parseFloat(e.target.value))}
          className="w-full"
        />
      </div>
      
      <div className="bg-slate-50 p-4 rounded-lg">
        <label className="block text-sm font-medium mb-2">掺杂浓度: {doping.toExponential(2)} cm⁻³</label>
        <input
          type="range"
          min="1e14"
          max="1e18"
          step="1e15"
          value={doping}
          onChange={(e) => setDoping(parseFloat(e.target.value))}
          className="w-full"
        />
      </div>
      
      <div className="bg-indigo-50 p-4 rounded-lg">
        <p className="text-sm font-medium text-indigo-900 mb-2">PN结示意图</p>
        <div className="relative h-32 bg-white rounded border border-indigo-200">
          <div className="absolute top-0 bottom-0 left-0 w-1/2 bg-blue-100 flex items-center justify-center">
            <span className="text-blue-600 font-mono text-xs">N型</span>
          </div>
          <div className="absolute top-0 bottom-0 right-0 w-1/2 bg-red-100 flex items-center justify-center">
            <span className="text-red-600 font-mono text-xs">P型</span>
          </div>
          <div 
            className="absolute top-0 bottom-0 left-1/2 w-1 bg-gray-400 transform -translate-x-1/2"
            style={{ height: `${barrierHeight * 100}%`, top: `${(1 - barrierHeight) * 50}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
}

function MOSFETSimulator({ state, updateState }: { state: any; updateState: (key: string, value: any) => void }) {
  const [gateVoltage, setGateVoltage] = useState(state.gateVoltage || 0);
  const [drainVoltage, setDrainVoltage] = useState(state.drainVoltage || 1);

  useEffect(() => {
    updateState('gateVoltage', gateVoltage);
    updateState('drainVoltage', drainVoltage);
  }, [gateVoltage, drainVoltage, updateState]);

  const isOn = gateVoltage > 1;
  const current = isOn ? (gateVoltage - 1) * drainVoltage * 0.5 : 0;

  return (
    <div className="space-y-4">
      <div className="bg-slate-50 p-4 rounded-lg">
        <label className="block text-sm font-medium mb-2">栅极电压: {gateVoltage.toFixed(1)} V</label>
        <input
          type="range"
          min="0"
          max="5"
          step="0.1"
          value={gateVoltage}
          onChange={(e) => setGateVoltage(parseFloat(e.target.value))}
          className="w-full"
        />
      </div>
      
      <div className="bg-slate-50 p-4 rounded-lg">
        <label className="block text-sm font-medium mb-2">漏极电压: {drainVoltage.toFixed(1)} V</label>
        <input
          type="range"
          min="0"
          max="5"
          step="0.1"
          value={drainVoltage}
          onChange={(e) => setDrainVoltage(parseFloat(e.target.value))}
          className="w-full"
        />
      </div>
      
      <div className="bg-indigo-50 p-4 rounded-lg">
        <p className="text-sm font-medium text-indigo-900">MOSFET状态:</p>
        <p className={`text-lg font-bold ${isOn ? 'text-green-600' : 'text-red-600'}`}>
          {isOn ? '导通' : '截止'}
        </p>
        <p className="text-sm text-indigo-700 mt-1">
          漏极电流: {current.toFixed(2)} mA
        </p>
      </div>
    </div>
  );
}

function BJTSimulator({ state, updateState }: { state: any; updateState: (key: string, value: any) => void }) {
  const [baseCurrent, setBaseCurrent] = useState(state.baseCurrent || 0.01);
  const [beta, setBeta] = useState(state.beta || 100);

  useEffect(() => {
    updateState('baseCurrent', baseCurrent);
    updateState('beta', beta);
  }, [baseCurrent, beta, updateState]);

  const collectorCurrent = baseCurrent * beta;

  return (
    <div className="space-y-4">
      <div className="bg-slate-50 p-4 rounded-lg">
        <label className="block text-sm font-medium mb-2">基极电流: {baseCurrent.toFixed(3)} mA</label>
        <input
          type="range"
          min="0"
          max="0.1"
          step="0.001"
          value={baseCurrent}
          onChange={(e) => setBaseCurrent(parseFloat(e.target.value))}
          className="w-full"
        />
      </div>
      
      <div className="bg-slate-50 p-4 rounded-lg">
        <label className="block text-sm font-medium mb-2">电流放大系数 (β): {beta}</label>
        <input
          type="range"
          min="10"
          max="300"
          step="10"
          value={beta}
          onChange={(e) => setBeta(parseInt(e.target.value))}
          className="w-full"
        />
      </div>
      
      <div className="bg-indigo-50 p-4 rounded-lg">
        <p className="text-sm font-medium text-indigo-900">BJT工作状态:</p>
        <p className="text-lg font-bold text-indigo-600">
          集电极电流: {collectorCurrent.toFixed(2)} mA
        </p>
        <p className="text-xs text-indigo-700 mt-1">
          I<sub>C</sub> = β × I<sub>B</sub>
        </p>
      </div>
    </div>
  );
}

function OptoelectronicSimulator({ state, updateState }: { state: any; updateState: (key: string, value: any) => void }) {
  const [wavelength, setWavelength] = useState(state.wavelength || 650);
  const [intensity, setIntensity] = useState(state.intensity || 50);

  useEffect(() => {
    updateState('wavelength', wavelength);
    updateState('intensity', intensity);
  }, [wavelength, intensity, updateState]);

  const energy = 1240 / wavelength; // eV
  const getColor = (wavelength: number) => {
    if (wavelength < 450) return 'bg-blue-500';
    if (wavelength < 550) return 'bg-green-500';
    if (wavelength < 650) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <div className="space-y-4">
      <div className="bg-slate-50 p-4 rounded-lg">
        <label className="block text-sm font-medium mb-2">波长: {wavelength} nm</label>
        <input
          type="range"
          min="380"
          max="780"
          value={wavelength}
          onChange={(e) => setWavelength(parseInt(e.target.value))}
          className="w-full"
        />
      </div>
      
      <div className="bg-slate-50 p-4 rounded-lg">
        <label className="block text-sm font-medium mb-2">光强: {intensity}%</label>
        <input
          type="range"
          min="0"
          max="100"
          value={intensity}
          onChange={(e) => setIntensity(parseInt(e.target.value))}
          className="w-full"
        />
      </div>
      
      <div className="bg-indigo-50 p-4 rounded-lg">
        <p className="text-sm font-medium text-indigo-900">光子能量: {energy.toFixed(2)} eV</p>
        <div className="mt-2 h-16 bg-white rounded border border-indigo-200 flex items-center justify-center">
          <div 
            className={`w-12 h-12 rounded-full ${getColor(wavelength)}`}
            style={{ opacity: intensity / 100 }}
          ></div>
        </div>
      </div>
    </div>
  );
}

function SubstrateSimulator({ state, updateState }: { state: any; updateState: (key: string, value: any) => void }) {
  const [thickness, setThickness] = useState(state.thickness || 500);
  const [orientation, setOrientation] = useState(state.orientation || 100);

  useEffect(() => {
    updateState('thickness', thickness);
    updateState('orientation', orientation);
  }, [thickness, orientation, updateState]);

  return (
    <div className="space-y-4">
      <div className="bg-slate-50 p-4 rounded-lg">
        <label className="block text-sm font-medium mb-2">晶圆厚度: {thickness} μm</label>
        <input
          type="range"
          min="100"
          max="1000"
          step="10"
          value={thickness}
          onChange={(e) => setThickness(parseInt(e.target.value))}
          className="w-full"
        />
      </div>
      
      <div className="bg-slate-50 p-4 rounded-lg">
        <label className="block text-sm font-medium mb-2">晶向: ({orientation})</label>
        <select 
          value={orientation} 
          onChange={(e) => setOrientation(parseInt(e.target.value))}
          className="w-full p-2 border border-gray-300 rounded"
        >
          <option value="100">(100)</option>
          <option value="110">(110)</option>
          <option value="111">(111)</option>
        </select>
      </div>
      
      <div className="bg-indigo-50 p-4 rounded-lg">
        <p className="text-sm font-medium text-indigo-900">晶圆示意图</p>
        <div className="mt-2 flex justify-center">
          <div 
            className="bg-blue-200 rounded-full border-2 border-blue-500 flex items-center justify-center text-blue-600 font-mono text-xs"
            style={{ 
              width: `${Math.min(thickness / 5, 100)}px`, 
              height: `${Math.min(thickness / 5, 100)}px` 
            }}
          >
            ({orientation})
          </div>
        </div>
      </div>
    </div>
  );
}

function LithographySimulator({ state, updateState }: { state: any; updateState: (key: string, value: any) => void }) {
  const [wavelength, setWavelength] = useState(state.wavelength || 193);
  const [numericalAperture, setNumericalAperture] = useState(state.numericalAperture || 0.85);

  useEffect(() => {
    updateState('wavelength', wavelength);
    updateState('numericalAperture', numericalAperture);
  }, [wavelength, numericalAperture, updateState]);

  const resolution = (wavelength / (2 * numericalAperture)).toFixed(2);

  return (
    <div className="space-y-4">
      <div className="bg-slate-50 p-4 rounded-lg">
        <label className="block text-sm font-medium mb-2">光源波长: {wavelength} nm</label>
        <input
          type="range"
          min="193"
          max="365"
          value={wavelength}
          onChange={(e) => setWavelength(parseInt(e.target.value))}
          className="w-full"
        />
      </div>
      
      <div className="bg-slate-50 p-4 rounded-lg">
        <label className="block text-sm font-medium mb-2">数值孔径: {numericalAperture.toFixed(2)}</label>
        <input
          type="range"
          min="0.5"
          max="1.4"
          step="0.05"
          value={numericalAperture}
          onChange={(e) => setNumericalAperture(parseFloat(e.target.value))}
          className="w-full"
        />
      </div>
      
      <div className="bg-indigo-50 p-4 rounded-lg">
        <p className="text-sm font-medium text-indigo-900">理论分辨率:</p>
        <p className="text-lg font-bold text-indigo-600">{resolution} nm</p>
        <p className="text-xs text-indigo-700 mt-1">
          R = k₁ × λ / NA
        </p>
      </div>
    </div>
  );
}

function EtchSimulator({ state, updateState }: { state: any; updateState: (key: string, value: any) => void }) {
  const [etchRate, setEtchRate] = useState(state.etchRate || 100);
  const [time, setTime] = useState(state.time || 60);

  useEffect(() => {
    updateState('etchRate', etchRate);
    updateState('time', time);
  }, [etchRate, time, updateState]);

  const depth = (etchRate * time / 60).toFixed(1);

  return (
    <div className="space-y-4">
      <div className="bg-slate-50 p-4 rounded-lg">
        <label className="block text-sm font-medium mb-2">刻蚀速率: {etchRate} nm/min</label>
        <input
          type="range"
          min="10"
          max="500"
          step="10"
          value={etchRate}
          onChange={(e) => setEtchRate(parseInt(e.target.value))}
          className="w-full"
        />
      </div>
      
      <div className="bg-slate-50 p-4 rounded-lg">
        <label className="block text-sm font-medium mb-2">刻蚀时间: {time} s</label>
        <input
          type="range"
          min="10"
          max="300"
          step="10"
          value={time}
          onChange={(e) => setTime(parseInt(e.target.value))}
          className="w-full"
        />
      </div>
      
      <div className="bg-indigo-50 p-4 rounded-lg">
        <p className="text-sm font-medium text-indigo-900">刻蚀深度:</p>
        <p className="text-lg font-bold text-indigo-600">{depth} nm</p>
        <div className="mt-2 h-20 bg-white rounded border border-indigo-200 relative">
          <div 
            className="absolute bottom-0 left-0 right-0 bg-indigo-500"
            style={{ height: `${Math.min(parseFloat(depth) / 10, 100)}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
}

function DopingSimulator({ state, updateState }: { state: any; updateState: (key: string, value: any) => void }) {
  const [concentration, setConcentration] = useState(state.concentration || 1e16);
  const [temperature, setTemperature] = useState(state.temperature || 300);

  useEffect(() => {
    updateState('concentration', concentration);
    updateState('temperature', temperature);
  }, [concentration, temperature, updateState]);

  const conductivity = (concentration * 1.6e-19 * 1350 * temperature / 300).toExponential(2);

  return (
    <div className="space-y-4">
      <div className="bg-slate-50 p-4 rounded-lg">
        <label className="block text-sm font-medium mb-2">掺杂浓度: {concentration.toExponential(2)} cm⁻³</label>
        <input
          type="range"
          min="1e14"
          max="1e20"
          step="1e15"
          value={concentration}
          onChange={(e) => setConcentration(parseFloat(e.target.value))}
          className="w-full"
        />
      </div>
      
      <div className="bg-slate-50 p-4 rounded-lg">
        <label className="block text-sm font-medium mb-2">温度: {temperature} K</label>
        <input
          type="range"
          min="200"
          max="500"
          value={temperature}
          onChange={(e) => setTemperature(parseInt(e.target.value))}
          className="w-full"
        />
      </div>
      
      <div className="bg-indigo-50 p-4 rounded-lg">
        <p className="text-sm font-medium text-indigo-900">电导率:</p>
        <p className="text-lg font-bold text-indigo-600">{conductivity} S/cm</p>
        <p className="text-xs text-indigo-700 mt-1">
          σ = q · n · μ
        </p>
      </div>
    </div>
  );
}

function CMOSSimulator({ state, updateState }: { state: any; updateState: (key: string, value: any) => void }) {
  const [voltage, setVoltage] = useState(state.voltage || 1.8);
  const [transistorSize, setTransistorSize] = useState(state.transistorSize || 7);

  useEffect(() => {
    updateState('voltage', voltage);
    updateState('transistorSize', transistorSize);
  }, [voltage, transistorSize, updateState]);

  const power = (voltage * voltage * 0.001 * (100 / transistorSize)).toFixed(3);
  const delay = (transistorSize * voltage / 3.3).toFixed(2);

  return (
    <div className="space-y-4">
      <div className="bg-slate-50 p-4 rounded-lg">
        <label className="block text-sm font-medium mb-2">工作电压: {voltage.toFixed(1)} V</label>
        <input
          type="range"
          min="0.8"
          max="3.3"
          step="0.1"
          value={voltage}
          onChange={(e) => setVoltage(parseFloat(e.target.value))}
          className="w-full"
        />
      </div>
      
      <div className="bg-slate-50 p-4 rounded-lg">
        <label className="block text-sm font-medium mb-2">晶体管尺寸: {transistorSize} nm</label>
        <input
          type="range"
          min="7"
          max="28"
          step="1"
          value={transistorSize}
          onChange={(e) => setTransistorSize(parseInt(e.target.value))}
          className="w-full"
        />
      </div>
      
      <div className="bg-indigo-50 p-4 rounded-lg">
        <p className="text-sm font-medium text-indigo-900">CMOS性能:</p>
        <p className="text-sm text-indigo-700">功耗: {power} mW/MHz</p>
        <p className="text-sm text-indigo-700">延迟: {delay} ps</p>
      </div>
    </div>
  );
}

function MemorySimulator({ state, updateState }: { state: any; updateState: (key: string, value: any) => void }) {
  const [capacity, setCapacity] = useState(state.capacity || 8);
  const [interfaceSpeed, setInterfaceSpeed] = useState(state.interfaceSpeed || 3200);

  useEffect(() => {
    updateState('capacity', capacity);
    updateState('interfaceSpeed', interfaceSpeed);
  }, [capacity, interfaceSpeed, updateState]);

  const bandwidth = (capacity * interfaceSpeed / 8).toFixed(1);

  return (
    <div className="space-y-4">
      <div className="bg-slate-50 p-4 rounded-lg">
        <label className="block text-sm font-medium mb-2">内存容量: {capacity} GB</label>
        <input
          type="range"
          min="4"
          max="32"
          step="4"
          value={capacity}
          onChange={(e) => setCapacity(parseInt(e.target.value))}
          className="w-full"
        />
      </div>
      
      <div className="bg-slate-50 p-4 rounded-lg">
        <label className="block text-sm font-medium mb-2">接口速度: {interfaceSpeed} MT/s</label>
        <input
          type="range"
          min="2133"
          max="6400"
          step="266"
          value={interfaceSpeed}
          onChange={(e) => setInterfaceSpeed(parseInt(e.target.value))}
          className="w-full"
        />
      </div>
      
      <div className="bg-indigo-50 p-4 rounded-lg">
        <p className="text-sm font-medium text-indigo-900">理论带宽:</p>
        <p className="text-lg font-bold text-indigo-600">{bandwidth} GB/s</p>
      </div>
    </div>
  );
}

function AnalogSimulator({ state, updateState }: { state: any; updateState: (key: string, value: any) => void }) {
  const [frequency, setFrequency] = useState(state.frequency || 1000);
  const [amplitude, setAmplitude] = useState(state.amplitude || 1);

  useEffect(() => {
    updateState('frequency', frequency);
    updateState('amplitude', amplitude);
  }, [frequency, amplitude, updateState]);

  return (
    <div className="space-y-4">
      <div className="bg-slate-50 p-4 rounded-lg">
        <label className="block text-sm font-medium mb-2">频率: {frequency} Hz</label>
        <input
          type="range"
          min="20"
          max="20000"
          step="10"
          value={frequency}
          onChange={(e) => setFrequency(parseInt(e.target.value))}
          className="w-full"
        />
      </div>
      
      <div className="bg-slate-50 p-4 rounded-lg">
        <label className="block text-sm font-medium mb-2">幅度: {amplitude.toFixed(1)} V</label>
        <input
          type="range"
          min="0.1"
          max="5"
          step="0.1"
          value={amplitude}
          onChange={(e) => setAmplitude(parseFloat(e.target.value))}
          className="w-full"
        />
      </div>
      
      <div className="bg-indigo-50 p-4 rounded-lg">
        <p className="text-sm font-medium text-indigo-900">正弦波信号:</p>
        <div className="mt-2 h-20 bg-white rounded border border-indigo-200 relative overflow-hidden">
          <svg width="100%" height="100%" viewBox="0 0 200 50">
            <path
              d={`M 0,25 ${Array.from({ length: 200 }, (_, i) => {
                const x = i;
                const y = 25 - Math.sin((i / 200) * (frequency / 1000) * Math.PI * 4) * amplitude * 5;
                return `L ${x},${y}`;
              }).join(' ')}`}
              stroke="#4f46e5"
              strokeWidth="2"
              fill="none"
            />
          </svg>
        </div>
      </div>
    </div>
  );
}

function RFSimulator({ state, updateState }: { state: any; updateState: (key: string, value: any) => void }) {
  const [frequency, setFrequency] = useState(state.frequency || 2400);
  const [power, setPower] = useState(state.power || 20);

  useEffect(() => {
    updateState('frequency', frequency);
    updateState('power', power);
  }, [frequency, power, updateState]);

  const wavelength = (300000 / frequency).toFixed(1);
  const pathLoss = (20 * Math.log10(frequency) - 27.55).toFixed(1);

  return (
    <div className="space-y-4">
      <div className="bg-slate-50 p-4 rounded-lg">
        <label className="block text-sm font-medium mb-2">频率: {frequency} MHz</label>
        <input
          type="range"
          min="800"
          max="6000"
          step="100"
          value={frequency}
          onChange={(e) => setFrequency(parseInt(e.target.value))}
          className="w-full"
        />
      </div>
      
      <div className="bg-slate-50 p-4 rounded-lg">
        <label className="block text-sm font-medium mb-2">发射功率: {power} dBm</label>
        <input
          type="range"
          min="0"
          max="30"
          value={power}
          onChange={(e) => setPower(parseInt(e.target.value))}
          className="w-full"
        />
      </div>
      
      <div className="bg-indigo-50 p-4 rounded-lg">
        <p className="text-sm font-medium text-indigo-900">RF参数:</p>
        <p className="text-sm text-indigo-700">波长: {wavelength} cm</p>
        <p className="text-sm text-indigo-700">路径损耗(1m): {pathLoss} dB</p>
      </div>
    </div>
  );
}

function PowerSimulator({ state, updateState }: { state: any; updateState: (key: string, value: any) => void }) {
  const [voltage, setVoltage] = useState(state.voltage || 12);
  const [current, setCurrent] = useState(state.current || 5);

  useEffect(() => {
    updateState('voltage', voltage);
    updateState('current', current);
  }, [voltage, current, updateState]);

  const power = voltage * current;
  const efficiency = 85 - (power / 100);

  return (
    <div className="space-y-4">
      <div className="bg-slate-50 p-4 rounded-lg">
        <label className="block text-sm font-medium mb-2">电压: {voltage} V</label>
        <input
          type="range"
          min="1.2"
          max="48"
          step="0.1"
          value={voltage}
          onChange={(e) => setVoltage(parseFloat(e.target.value))}
          className="w-full"
        />
      </div>
      
      <div className="bg-slate-50 p-4 rounded-lg">
        <label className="block text-sm font-medium mb-2">电流: {current} A</label>
        <input
          type="range"
          min="0.1"
          max="20"
          step="0.1"
          value={current}
          onChange={(e) => setCurrent(parseFloat(e.target.value))}
          className="w-full"
        />
      </div>
      
      <div className="bg-indigo-50 p-4 rounded-lg">
        <p className="text-sm font-medium text-indigo-900">功率参数:</p>
        <p className="text-lg font-bold text-indigo-600">{power.toFixed(1)} W</p>
        <p className="text-sm text-indigo-700">效率: {efficiency.toFixed(1)}%</p>
      </div>
    </div>
  );
}

function SensorSimulator({ state, updateState }: { state: any; updateState: (key: string, value: any) => void }) {
  const [sensitivity, setSensitivity] = useState(state.sensitivity || 100);
  const [signal, setSignal] = useState(state.signal || 50);

  useEffect(() => {
    updateState('sensitivity', sensitivity);
    updateState('signal', signal);
  }, [sensitivity, signal, updateState]);

  const output = (signal * sensitivity / 100).toFixed(1);
  const noise = (Math.random() * 10).toFixed(1);
  const snr = (signal / parseFloat(noise)).toFixed(1);

  return (
    <div className="space-y-4">
      <div className="bg-slate-50 p-4 rounded-lg">
        <label className="block text-sm font-medium mb-2">灵敏度: {sensitivity}%</label>
        <input
          type="range"
          min="10"
          max="200"
          step="10"
          value={sensitivity}
          onChange={(e) => setSensitivity(parseInt(e.target.value))}
          className="w-full"
        />
      </div>
      
      <div className="bg-slate-50 p-4 rounded-lg">
        <label className="block text-sm font-medium mb-2">输入信号: {signal}%</label>
        <input
          type="range"
          min="0"
          max="100"
          value={signal}
          onChange={(e) => setSignal(parseInt(e.target.value))}
          className="w-full"
        />
      </div>
      
      <div className="bg-indigo-50 p-4 rounded-lg">
        <p className="text-sm font-medium text-indigo-900">传感器输出:</p>
        <p className="text-lg font-bold text-indigo-600">{output} mV</p>
        <p className="text-sm text-indigo-700">信噪比: {snr} dB</p>
      </div>
    </div>
  );
}

function QuantumSimulator({ state, updateState }: { state: any; updateState: (key: string, value: any) => void }) {
  const [quantumState, setQuantumState] = useState(state.quantumState || 0.5);
  const [coherence, setCoherence] = useState(state.coherence || 0.8);

  useEffect(() => {
    updateState('quantumState', quantumState);
    updateState('coherence', coherence);
  }, [quantumState, coherence, updateState]);

  const probability0 = Math.cos(quantumState * Math.PI / 2) ** 2;
  const probability1 = Math.sin(quantumState * Math.PI / 2) ** 2;

  return (
    <div className="space-y-4">
      <div className="bg-slate-50 p-4 rounded-lg">
        <label className="block text-sm font-medium mb-2">量子态参数: {quantumState.toFixed(2)}</label>
        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={quantumState}
          onChange={(e) => setQuantumState(parseFloat(e.target.value))}
          className="w-full"
        />
      </div>
      
      <div className="bg-slate-50 p-4 rounded-lg">
        <label className="block text-sm font-medium mb-2">相干性: {coherence.toFixed(2)}</label>
        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={coherence}
          onChange={(e) => setCoherence(parseFloat(e.target.value))}
          className="w-full"
        />
      </div>
      
      <div className="bg-indigo-50 p-4 rounded-lg">
        <p className="text-sm font-medium text-indigo-900">量子态概率:</p>
        <div className="mt-2 space-y-2">
          <div>
            <div className="flex justify-between text-sm">
              <span>|0⟩ 态:</span>
              <span>{(probability0 * 100).toFixed(1)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-500 h-2 rounded-full" 
                style={{ width: `${probability0 * 100}%` }}
              ></div>
            </div>
          </div>
          <div>
            <div className="flex justify-between text-sm">
              <span>|1⟩ 态:</span>
              <span>{(probability1 * 100).toFixed(1)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-red-500 h-2 rounded-full" 
                style={{ width: `${probability1 * 100}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function FutureSimulator({ state, updateState }: { state: any; updateState: (key: string, value: any) => void }) {
  const [year, setYear] = useState(state.year || 2030);
  const [technology, setTechnology] = useState(state.technology || "quantum");

  useEffect(() => {
    updateState('year', year);
    updateState('technology', technology);
  }, [year, technology, updateState]);

  const getTechDescription = (tech: string) => {
    switch (tech) {
      case "quantum": return "量子计算：利用量子叠加和纠缠实现指数级计算加速";
      case "neuromorphic": return "神经形态计算：模拟人脑神经元结构，实现高效AI处理";
      case "photonic": return "光子计算：使用光子代替电子，实现超高速低功耗计算";
      case "dna": return "DNA计算：利用分子生物反应进行并行计算";
      default: return "新兴计算范式探索";
    }
  };

  return (
    <div className="space-y-4">
      <div className="bg-slate-50 p-4 rounded-lg">
        <label className="block text-sm font-medium mb-2">预测年份: {year}</label>
        <input
          type="range"
          min="2025"
          max="2050"
          step="1"
          value={year}
          onChange={(e) => setYear(parseInt(e.target.value))}
          className="w-full"
        />
      </div>
      
      <div className="bg-slate-50 p-4 rounded-lg">
        <label className="block text-sm font-medium mb-2">技术方向</label>
        <select 
          value={technology} 
          onChange={(e) => setTechnology(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded"
        >
          <option value="quantum">量子计算</option>
          <option value="neuromorphic">神经形态计算</option>
          <option value="photonic">光子计算</option>
          <option value="dna">DNA计算</option>
        </select>
      </div>
      
      <div className="bg-indigo-50 p-4 rounded-lg">
        <p className="text-sm font-medium text-indigo-900">{year}年技术展望:</p>
        <p className="text-sm text-indigo-700 mt-2">{getTechDescription(technology)}</p>
      </div>
    </div>
  );
}