'use client';

import { motion } from 'framer-motion';
import { SectionComponentProps } from '@/components/MDXContentRenderer';

export function DefaultContentModule({ content, theme }: SectionComponentProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white border-2 border-gray-200 rounded-2xl p-8 shadow-sm hover:shadow-md transition-shadow"
    >
      <div className="prose prose-lg max-w-none font-serif text-gray-700 leading-relaxed">
        <p className="text-justify">
          {content}
        </p>
      </div>
    </motion.div>
  );
}
