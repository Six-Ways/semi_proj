"use client";

import React, { useState, useEffect } from "react";
import { MathVisualization } from "./MathVisualization";

interface FermiDiracProps {
  className?: string;
}

export function FermiDiracVisualization({ className = "" }: FermiDiracProps) {
  const [data, setData] = useState<{ x: number[]; y: number[] } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [Ef, setEf] = useState(0.0);
  const [kT, setKT] = useState(0.025);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch("http://localhost:8000/api/math/fermi-function", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            function_type: "fermi_dirac",
            parameters: {
              Ef,
              kT,
              x_min: -0.5,
              x_max: 0.5,
              num_points: 100,
            },
          }),
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        setData(result);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [Ef, kT]);

  const handleEfChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEf(parseFloat(e.target.value));
  };

  const handleKTChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setKT(parseFloat(e.target.value));
  };

  // 创建函数对象用于MathVisualization
  const createFunction = () => {
    if (!data) return [];

    return [
      {
        fn: (x: number) => {
          // 找到最接近的x值并返回对应的y值
          const index = data.x.findIndex(
            (val, idx) => val >= x || idx === data.x.length - 1
          );
          return data.y[index] || 0;
        },
        color: "#3b82f6",
      },
    ];
  };

  return (
    <div className={`fermi-dirac-container ${className}`}>
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">费米-狄拉克分布函数</h2>
        
        <div className="mb-4 space-y-4">
          <div>
            <label htmlFor="Ef" className="block text-sm font-medium text-gray-700 mb-1">
              费米能级 (Ef): {Ef.toFixed(3)} eV
            </label>
            <input
              type="range"
              id="Ef"
              min="-0.5"
              max="0.5"
              step="0.01"
              value={Ef}
              onChange={handleEfChange}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
          </div>
          
          <div>
            <label htmlFor="kT" className="block text-sm font-medium text-gray-700 mb-1">
              热能 (kT): {kT.toFixed(3)} eV
            </label>
            <input
              type="range"
              id="kT"
              min="0.01"
              max="0.1"
              step="0.001"
              value={kT}
              onChange={handleKTChange}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
          </div>
        </div>

        <div className="h-64 mb-4">
          {loading ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-gray-500">加载中...</div>
            </div>
          ) : error ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-red-500">错误: {error}</div>
            </div>
          ) : (
            <MathVisualization
              functions={createFunction()}
              xRange={[-0.5, 0.5]}
              yRange={[-0.1, 1.1]}
              showGrid={true}
              showAxes={true}
            />
          )}
        </div>

        <div className="text-sm text-gray-600">
          <p>费米-狄拉克分布函数描述了在热平衡状态下，能量为E的态被电子占据的概率。</p>
          <p className="mt-2">公式: f(E) = 1 / (1 + exp((E-Ef)/kT))</p>
        </div>
      </div>
    </div>
  );
}