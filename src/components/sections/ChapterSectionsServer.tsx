import { ReactNode } from 'react';

interface SectionProps {
  children: ReactNode;
  className?: string;
}

export function LogicalPositionServer({ children, className = "" }: SectionProps) {
  return (
    <section className={`mb-8 p-6 bg-blue-50 rounded-lg border border-blue-200 ${className}`}>
      <div className="text-blue-800">{children}</div>
    </section>
  );
}

export function ChapterObjectivesServer({ children, className = "" }: SectionProps) {
  return (
    <section className={`mb-8 p-6 bg-green-50 rounded-lg border border-green-200 ${className}`}>
      <div className="text-green-800">{children}</div>
    </section>
  );
}

export function CoreContentServer({ children, className = "" }: SectionProps) {
  return (
    <section className={`mb-8 p-6 bg-amber-50 rounded-lg border border-amber-200 ${className}`}>
      <div className="text-amber-800">{children}</div>
    </section>
  );
}

export function KeywordsServer({ children, className = "" }: SectionProps) {
  return (
    <section className={`mb-8 p-6 bg-yellow-50 rounded-lg border border-yellow-200 ${className}`}>
      <div className="text-yellow-800">{children}</div>
    </section>
  );
}

export function PrerequisitePromptServer({ children, className = "" }: SectionProps) {
  return (
    <section className={`mb-8 p-6 bg-red-50 rounded-lg border border-red-200 ${className}`}>
      <div className="text-red-800">{children}</div>
    </section>
  );
}

export function OpeningLineServer({ children, className = "" }: SectionProps) {
  return (
    <section className={`mb-8 p-6 bg-indigo-50 rounded-lg border border-indigo-200 ${className}`}>
      <div className="text-indigo-800">{children}</div>
    </section>
  );
}