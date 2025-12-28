"use client";

import React from "react";

interface SliderProps {
  label: string;
  min: number;
  max: number;
  step?: number;
  value: number;
  onChange: (value: number) => void;
  unit?: string;
  description?: string;
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
}: SliderProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(parseFloat(e.target.value));
  };

  return (
    <div className="slider-container">
      <div className="flex justify-between items-center mb-2">
        <label className="slider-label">{label}</label>
        <span className="text-sm text-secondary">
          {value.toFixed(step < 1 ? 1 : 0)}{unit}
        </span>
      </div>
      {description && (
        <p className="text-sm text-secondary mb-2">{description}</p>
      )}
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={handleChange}
        className="slider"
      />
    </div>
  );
}