import React from "react";

interface CardProps {
  title?: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
  onClick?: () => void;
}

interface CardHeaderProps {
  children: React.ReactNode;
  className?: string;
}

interface CardTitleProps {
  children: React.ReactNode;
  className?: string;
}

interface CardDescriptionProps {
  children: React.ReactNode;
  className?: string;
}

interface CardContentProps {
  children: React.ReactNode;
  className?: string;
}

export function Card({ title, description, children, className = "", onMouseEnter, onMouseLeave, onClick }: CardProps) {
  return (
    <div className={`card ${className}`} onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave} onClick={onClick}>
      {(title || description) && (
        <div className="card-header">
          {title && <h3 className="card-title">{title}</h3>}
          {description && <p className="card-description">{description}</p>}
        </div>
      )}
      <div className="card-content">
        {children}
      </div>
    </div>
  );
}

export function CardHeader({ children, className = "" }: CardHeaderProps) {
  return <div className={`card-header ${className}`}>{children}</div>;
}

export function CardTitle({ children, className = "" }: CardTitleProps) {
  return <h3 className={`card-title ${className}`}>{children}</h3>;
}

export function CardDescription({ children, className = "" }: CardDescriptionProps) {
  return <p className={`card-description ${className}`}>{children}</p>;
}

export function CardContent({ children, className = "" }: CardContentProps) {
  return <div className={`card-content ${className}`}>{children}</div>;
}