import React from "react";

interface ChapterContainerProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}

export function ChapterContainer({
  title,
  subtitle,
  children,
}: ChapterContainerProps) {
  return (
    <div className="chapter-container">
      <h1 className="chapter-title">{title}</h1>
      {subtitle && <p className="chapter-subtitle">{subtitle}</p>}
      <div className="chapter-content">
        {children}
      </div>
    </div>
  );
}