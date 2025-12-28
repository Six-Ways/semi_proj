"use client";

import React, { useRef, useEffect } from "react";

interface MathVisualizationProps {
  functions?: Array<{
    fn: (x: number) => number;
    color?: string;
    domain?: [number, number];
  }>;
  xRange?: [number, number];
  yRange?: [number, number];
  showGrid?: boolean;
  showAxes?: boolean;
  className?: string;
}

export function MathVisualization({
  functions = [],
  xRange = [-10, 10],
  yRange = [-10, 10],
  showGrid = true,
  showAxes = true,
  className = "",
}: MathVisualizationProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // 设置画布大小
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width;
    canvas.height = rect.height;

    // 清空画布
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // 绘制背景
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // 坐标转换函数
    const xToCanvas = (x: number) => {
      return ((x - xRange[0]) / (xRange[1] - xRange[0])) * canvas.width;
    };

    const yToCanvas = (y: number) => {
      return canvas.height - ((y - yRange[0]) / (yRange[1] - yRange[0])) * canvas.height;
    };

    // 绘制网格
    if (showGrid) {
      ctx.strokeStyle = "#e5e7eb";
      ctx.lineWidth = 1;

      // 垂直线
      for (let x = Math.ceil(xRange[0]); x <= Math.floor(xRange[1]); x++) {
        const canvasX = xToCanvas(x);
        ctx.beginPath();
        ctx.moveTo(canvasX, 0);
        ctx.lineTo(canvasX, canvas.height);
        ctx.stroke();
      }

      // 水平线
      for (let y = Math.ceil(yRange[0]); y <= Math.floor(yRange[1]); y++) {
        const canvasY = yToCanvas(y);
        ctx.beginPath();
        ctx.moveTo(0, canvasY);
        ctx.lineTo(canvas.width, canvasY);
        ctx.stroke();
      }
    }

    // 绘制坐标轴
    if (showAxes) {
      ctx.strokeStyle = "#374151";
      ctx.lineWidth = 2;

      // X轴
      if (yRange[0] <= 0 && yRange[1] >= 0) {
        const y = yToCanvas(0);
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
      }

      // Y轴
      if (xRange[0] <= 0 && xRange[1] >= 0) {
        const x = xToCanvas(0);
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
      }
    }

    // 绘制函数
    functions.forEach((func) => {
      ctx.strokeStyle = func.color || "#22c55e";
      ctx.lineWidth = 2;
      ctx.beginPath();

      const domain = func.domain || xRange;
      const step = (domain[1] - domain[0]) / 500;

      let firstPoint = true;
      for (let x = domain[0]; x <= domain[1]; x += step) {
        const y = func.fn(x);
        if (!isNaN(y) && isFinite(y)) {
          const canvasX = xToCanvas(x);
          const canvasY = yToCanvas(y);

          if (firstPoint) {
            ctx.moveTo(canvasX, canvasY);
            firstPoint = false;
          } else {
            ctx.lineTo(canvasX, canvasY);
          }
        } else {
          firstPoint = true;
        }
      }

      ctx.stroke();
    });
  }, [functions, xRange, yRange, showGrid, showAxes]);

  return (
    <div className={`visualization-container ${className}`}>
      <canvas
        ref={canvasRef}
        className="w-full h-full"
        style={{ width: "100%", height: "100%" }}
      />
    </div>
  );
}