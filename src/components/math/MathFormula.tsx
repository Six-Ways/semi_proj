"use client";

import React from "react";
import { InlineMath as KatexInlineMath, BlockMath as KatexBlockMath } from "react-katex";

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