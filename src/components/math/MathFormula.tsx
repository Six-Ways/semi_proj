"use client";

import React from "react";
// 使用动态导入，仅在需要时加载katex组件，实现代码分割
import dynamic from 'next/dynamic';

// 动态导入katex组件，禁用SSR以避免服务端渲染问题
const KatexInlineMath = dynamic(() => import('react-katex').then(mod => mod.InlineMath), { 
  ssr: false,
  loading: () => <span className="text-gray-500 italic">Loading formula...</span>
});
const KatexBlockMath = dynamic(() => import('react-katex').then(mod => mod.BlockMath), { 
  ssr: false,
  loading: () => <div className="h-16 w-full bg-gray-100 animate-pulse"></div>
});

interface MathFormulaProps {
  formula: string;
  display?: boolean; // true for block math, false for inline math
  className?: string;
}

export function MathFormula({
  formula,
  display = false,
  className = "",
}: MathFormulaProps) {
  const MathComponent = display ? KatexBlockMath : KatexInlineMath;
  
  return (
    <div className={`formula-container ${display ? "block-math" : "inline-math"} ${className}`}>
      <MathComponent math={formula} />
    </div>
  );
}

// Convenience components for inline and block math
export function InlineMath({ formula, className }: { formula: string; className?: string }) {
  return <MathFormula formula={formula} display={false} className={className} />;
}

export function BlockMath({ formula, className }: { formula: string; className?: string }) {
  return <MathFormula formula={formula} display={true} className={className} />;
}