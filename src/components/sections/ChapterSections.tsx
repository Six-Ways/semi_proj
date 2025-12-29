"use client";

import { ReactNode } from 'react';
import { motion } from 'framer-motion';

interface SectionProps {
  children: ReactNode;
  className?: string;
}

export function LogicalPosition({ children, className = "" }: SectionProps) {
  return (
    <motion.section 
      className={`mb-8 p-6 bg-blue-50 rounded-lg border border-blue-200 ${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="text-blue-800">{children}</div>
    </motion.section>
  );
}

export function ChapterObjectives({ children, className = "" }: SectionProps) {
  return (
    <motion.section 
      className={`mb-8 p-6 bg-green-50 rounded-lg border border-green-200 ${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
    >
      <div className="text-green-800">{children}</div>
    </motion.section>
  );
}

export function CoreContent({ children, className = "" }: SectionProps) {
  return (
    <motion.section 
      className={`mb-8 p-6 bg-amber-50 rounded-lg border border-amber-200 ${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <div className="text-amber-800">{children}</div>
    </motion.section>
  );
}

export function Keywords({ children, className = "" }: SectionProps) {
  return (
    <motion.section 
      className={`mb-8 p-6 bg-yellow-50 rounded-lg border border-yellow-200 ${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
    >
      <div className="text-yellow-800">{children}</div>
    </motion.section>
  );
}

export function PrerequisitePrompt({ children, className = "" }: SectionProps) {
  return (
    <motion.section 
      className={`mb-8 p-6 bg-red-50 rounded-lg border border-red-200 ${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
    >
      <div className="text-red-800">{children}</div>
    </motion.section>
  );
}

export function OpeningLine({ children, className = "" }: SectionProps) {
  return (
    <motion.section 
      className={`mb-8 p-6 bg-indigo-50 rounded-lg border border-indigo-200 ${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.5 }}
    >
      <div className="text-indigo-800">{children}</div>
    </motion.section>
  );
}