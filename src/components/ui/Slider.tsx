"use client";

import React, { useRef, useEffect } from "react";
import { generateId } from "@/utils/accessibility";

interface SliderProps {
  label: string;
  min: number;
  max: number;
  step?: number;
  value: number;
  onChange: (value: number) => void;
  unit?: string;
  description?: string;
  ariaLabel?: string;
}

export function Slider({
  label,
  min,
  max,
  step = 0.1,
  value,
  onChange,
  unit = "",
  description,
  ariaLabel,
}: SliderProps) {
  const sliderId = useRef(generateId("slider"));
  const labelId = useRef(generateId("label"));
  const descriptionId = useRef(generateId("description"));
  const valueId = useRef(generateId("value"));

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(parseFloat(e.target.value));
  };

  // 确保滑块值在有效范围内
  useEffect(() => {
    if (value < min || value > max) {
      onChange(Math.max(min, Math.min(max, value)));
    }
  }, [value, min, max, onChange]);

  return (
    <div className="slider-container" role="group" aria-labelledby={labelId.current}>
      <div className="flex justify-between items-center mb-2">
        <label 
          id={labelId.current} 
          htmlFor={sliderId.current} 
          className="slider-label font-medium"
        >
          {label}
        </label>
        <span 
          id={valueId.current} 
          className="text-sm text-secondary font-medium"
          aria-live="polite"
        >
          {value.toFixed(step < 1 ? 1 : 0)}{unit}
        </span>
      </div>
      {description && (
        <p 
          id={descriptionId.current} 
          className="text-sm text-secondary mb-2"
        >
          {description}
        </p>
      )}
      <input
        id={sliderId.current}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={handleChange}
        className="slider"
        aria-label={ariaLabel || label}
        aria-describedby={`${descriptionId.current} ${valueId.current}`}
        aria-valuemin={min}
        aria-valuemax={max}
        aria-valuenow={value}
        aria-valuetext={`${value.toFixed(step < 1 ? 1 : 0)} ${unit}`.trim()}
      />
    </div>
  );
}