'use client';

import React, { useState } from 'react';

interface MathFormulaProps {
  formula: string;
  description?: string;
}

export function MathFormula({ formula, description }: MathFormulaProps) {
  return (
    <div className="my-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
      <div className="text-center text-lg font-mono my-4">
        {formula}
      </div>
      {description && (
        <div className="text-sm text-gray-600 text-center mt-2">
          {description}
        </div>
      )}
    </div>
  );
}

interface CrystalStructureProps {
  type?: 'silicon' | 'germanium' | 'diamond';
  showLattice?: boolean;
}

export function CrystalStructure({ type = 'silicon', showLattice = true }: CrystalStructureProps) {
  const [rotation, setRotation] = useState({ x: 0, y: 0 });
  const [showLabels, setShowLabels] = useState(true);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientY - rect.top) / rect.height - 0.5) * 180;
    const y = ((e.clientX - rect.left) / rect.width - 0.5) * 180;
    setRotation({ x, y });
  };

  const getTypeColor = () => {
    switch (type) {
      case 'silicon': return 'bg-blue-500';
      case 'germanium': return 'bg-gray-500';
      case 'diamond': return 'bg-cyan-500';
      default: return 'bg-blue-500';
    }
  };

  const getTypeName = () => {
    switch (type) {
      case 'silicon': return '硅';
      case 'germanium': return '锗';
      case 'diamond': return '金刚石';
      default: return '硅';
    }
  };

  return (
    <div className="my-6 p-6 bg-white rounded-lg border border-gray-200 shadow-sm">
      <h3 className="text-lg font-semibold mb-4 text-center">
        {getTypeName()}晶体结构
      </h3>
      
      <div 
        className="relative h-64 flex items-center justify-center cursor-move"
        onMouseMove={handleMouseMove}
      >
        <div 
          className="relative w-48 h-48"
          style={{
            transform: `rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)`,
            transformStyle: 'preserve-3d',
            transition: 'transform 0.1s'
          }}
        >
          {/* 中心原子 */}
          <div className={`absolute top-1/2 left-1/2 w-8 h-8 rounded-full ${getTypeColor()} transform -translate-x-1/2 -translate-y-1/2 z-20`}></div>
          
          {/* 四面体结构的四个顶点原子 */}
          <div className={`absolute top-0 left-1/2 w-6 h-6 rounded-full ${getTypeColor()} transform -translate-x-1/2 z-10`}></div>
          <div className={`absolute bottom-0 left-1/2 w-6 h-6 rounded-full ${getTypeColor()} transform -translate-x-1/2 z-10`}></div>
          <div className={`absolute top-1/2 left-0 w-6 h-6 rounded-full ${getTypeColor()} transform -translate-y-1/2 z-10`}></div>
          <div className={`absolute top-1/2 right-0 w-6 h-6 rounded-full ${getTypeColor()} transform -translate-y-1/2 z-10`}></div>
          
          {/* 共价键 */}
          <div className="absolute top-1/2 left-1/2 w-0.5 h-20 bg-gray-400 transform -translate-x-1/2 -translate-y-full origin-bottom z-0"></div>
          <div className="absolute top-1/2 left-1/2 w-0.5 h-20 bg-gray-400 transform -translate-x-1/2 origin-top z-0"></div>
          <div className="absolute top-1/2 left-1/2 w-20 h-0.5 bg-gray-400 transform -translate-y-1/2 -translate-x-full origin-right z-0"></div>
          <div className="absolute top-1/2 left-1/2 w-20 h-0.5 bg-gray-400 transform -translate-y-1/2 origin-left z-0"></div>
          
          {/* 晶格线 */}
          {showLattice && (
            <>
              <div className="absolute top-0 left-0 w-48 h-48 border border-gray-300 opacity-30"></div>
              <div className="absolute top-0 left-0 w-24 h-24 border border-gray-300 opacity-30"></div>
              <div className="absolute top-0 right-0 w-24 h-24 border border-gray-300 opacity-30"></div>
              <div className="absolute bottom-0 left-0 w-24 h-24 border border-gray-300 opacity-30"></div>
              <div className="absolute bottom-0 right-0 w-24 h-24 border border-gray-300 opacity-30"></div>
            </>
          )}
        </div>
        
        {showLabels && (
          <div className="absolute bottom-2 left-2 text-xs text-gray-500">
            拖动鼠标旋转晶体结构
          </div>
        )}
      </div>
      
      <div className="mt-4 flex justify-center space-x-4">
        <button
          onClick={() => setShowLabels(!showLabels)}
          className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded transition-colors"
        >
          {showLabels ? '隐藏' : '显示'}标签
        </button>
        <button
          onClick={() => setRotation({ x: 0, y: 0 })}
          className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded transition-colors"
        >
          重置视图
        </button>
      </div>
      
      <div className="mt-4 text-sm text-gray-600">
        {type === 'silicon' && '硅晶体具有金刚石结构，每个硅原子与四个相邻硅原子形成共价键，形成稳定的四面体结构。'}
        {type === 'germanium' && '锗晶体与硅具有相同的金刚石结构，但晶格常数更大，电子迁移率更高。'}
        {type === 'diamond' && '金刚石是典型的共价晶体，每个碳原子与四个相邻碳原子形成强共价键。'}
      </div>
    </div>
  );
}

interface FermiDistributionProps {
  initialTemperature?: number;
  fermiLevel?: number;
  showClassical?: boolean;
}

export function FermiDistribution({ 
  initialTemperature = 300, 
  fermiLevel = 5.5, 
  showClassical = true 
}: FermiDistributionProps) {
  const [temperature, setTemperature] = useState(initialTemperature);
  const [showClassicalDist, setShowClassicalDist] = useState(showClassical);
  
  // 费米-狄拉克分布函数
  const fermiDirac = (E: number) => {
    const kT = 8.617e-5 * temperature; // kT in eV
    return 1 / (Math.exp((E - fermiLevel) / kT) + 1);
  };
  
  // 经典玻尔兹曼分布
  const boltzmann = (E: number) => {
    const kT = 8.617e-5 * temperature; // kT in eV
    return Math.exp(-(E - fermiLevel) / kT);
  };
  
  // 生成分布曲线数据点
  const generateCurve = (func: (E: number) => number) => {
    const points = [];
    for (let E = 0; E <= 10; E += 0.1) {
      points.push({ x: E, y: func(E) });
    }
    return points;
  };
  
  const fermiPoints = generateCurve(fermiDirac);
  const classicalPoints = showClassicalDist ? generateCurve(boltzmann) : [];
  
  // 生成SVG路径
  const generatePath = (points: { x: number; y: number }[]) => {
    return points.map((point, i) => 
      `${i === 0 ? 'M' : 'L'} ${point.x * 40} ${(1 - point.y) * 200}`
    ).join(' ');
  };
  
  return (
    <div className="my-6 p-6 bg-white rounded-lg border border-gray-200 shadow-sm">
      <h3 className="text-lg font-semibold mb-4 text-center">
        费米-狄拉克分布
      </h3>
      
      <div className="mb-4">
        <div className="flex items-center justify-center mb-2">
          <label className="mr-2 text-sm">温度:</label>
          <input
            type="range"
            min="0"
            max="1000"
            value={temperature}
            onChange={(e) => setTemperature(Number(e.target.value))}
            className="w-48 mr-2"
          />
          <span className="text-sm w-12">{temperature} K</span>
        </div>
        
        <div className="flex items-center justify-center">
          <input
            type="checkbox"
            id="showClassical"
            checked={showClassicalDist}
            onChange={(e) => setShowClassicalDist(e.target.checked)}
            className="mr-2"
          />
          <label htmlFor="showClassical" className="text-sm">显示经典玻尔兹曼分布</label>
        </div>
      </div>
      
      <div className="relative h-64 bg-gray-50 rounded border border-gray-200 overflow-hidden">
        <svg className="w-full h-full" viewBox="0 0 400 240">
          {/* 坐标轴 */}
          <line x1="40" y1="200" x2="380" y2="200" stroke="#666" strokeWidth="1" />
          <line x1="40" y1="200" x2="40" y2="20" stroke="#666" strokeWidth="1" />
          
          {/* 坐标轴标签 */}
          <text x="210" y="230" fontSize="12" textAnchor="middle" fill="#666">能量 (eV)</text>
          <text x="20" y="110" fontSize="12" textAnchor="middle" fill="#666" transform="rotate(-90 20 110)">占据概率</text>
          
          {/* 费米能级线 */}
          <line 
            x1="40" 
            y1={(1 - 0.5) * 200} 
            x2="380" 
            y2={(1 - 0.5) * 200} 
            stroke="#888" 
            strokeWidth="1" 
            strokeDasharray="5,5"
          />
          <text x="385" y={(1 - 0.5) * 200 + 4} fontSize="10" fill="#888">E_F</text>
          
          {/* 费米-狄拉克分布曲线 */}
          <path
            d={generatePath(fermiPoints)}
            stroke="#3b82f6"
            strokeWidth="2"
            fill="none"
          />
          
          {/* 经典玻尔兹曼分布曲线 */}
          {showClassicalDist && (
            <path
              d={generatePath(classicalPoints)}
              stroke="#ef4444"
              strokeWidth="2"
              fill="none"
              strokeDasharray="5,5"
            />
          )}
          
          {/* 图例 */}
          <g transform="translate(300, 30)">
            <rect x="0" y="0" width="80" height="50" fill="white" stroke="#ddd" rx="3" />
            <line x1="5" y1="15" x2="25" y2="15" stroke="#3b82f6" strokeWidth="2" />
            <text x="30" y="19" fontSize="10" fill="#666">费米-狄拉克</text>
            
            {showClassicalDist && (
              <>
                <line x1="5" y1="30" x2="25" y2="30" stroke="#ef4444" strokeWidth="2" strokeDasharray="5,5" />
                <text x="30" y="34" fontSize="10" fill="#666">玻尔兹曼</text>
              </>
            )}
          </g>
        </svg>
      </div>
      
      <div className="mt-4 text-sm text-gray-600">
        <p>费米-狄拉克分布描述了费米子在能级上的占据概率。在绝对零度时，所有低于费米能级的态都被占据，而高于费米能级的态都是空的。随着温度升高，分布逐渐平滑。</p>
        <p className="mt-2">当前温度: {temperature} K，费米能级: {fermiLevel} eV</p>
      </div>
    </div>
  );
}