'use client';

import { motion } from 'framer-motion';
import { SectionComponentProps } from '@/components/MDXContentRenderer';

export function ScaleDownChallengeModule({ content, theme, interactive = false }: SectionComponentProps) {
  return (
    <div className="bg-white border-2 border-gray-200 rounded-2xl p-8 shadow-sm hover:shadow-md transition-shadow">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h2 className="text-3xl font-semibold mb-3 text-gray-900 leading-tight">
          越小越好？<span className="text-[#FF6B6B]">尺度微缩</span> 的甜蜜与烦恼
        </h2>
        <div className="h-1 w-24 bg-gradient-to-r from-[#FF6B6B] to-[#EE5A24] rounded-full"></div>
      </motion.div>

      {interactive && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-yellow-50 border-l-4 border-[#FF6B6B] p-5 my-6 rounded-r-xl"
        >
          <p className="text-base mb-2">
            <span className="font-mono text-[#FF6B6B] font-semibold">交互模式</span>：点击下方卡片查看详细挑战
          </p>
        </motion.div>
      )}

      <div className="prose prose-lg max-w-none mb-10 font-serif text-gray-700 leading-relaxed">
        <p className="text-justify">
          {content}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {[
          {
            title: '短沟道效应',
            description: '晶体管沟道太短时，漏极电场会穿透到源极，导致开关关不严，出现漏电',
            color: 'bg-red-50 border-red-200',
            icon: '⚡'
          },
          {
            title: '功耗墙',
            description: '开关太小，电流通过时电阻变大，发热剧增，芯片可能像灯泡一样发烫甚至烧毁',
            color: 'bg-orange-50 border-orange-200',
            icon: '🔥'
          },
          {
            title: '物理极限',
            description: '晶体管不能无限小，最终会触及原子尺度的物理规律',
            color: 'bg-purple-50 border-purple-200',
            icon: '⚛️'
          }
        ].map((item, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 + index * 0.1 }}
            className={`${item.color} border-2 rounded-xl p-5 shadow-sm hover:shadow-md transition-all`}
          >
            <div className="text-4xl mb-3">{item.icon}</div>
            <h3 className="text-xl font-semibold mb-2 text-gray-900">{item.title}</h3>
            <p className="text-sm text-gray-700">{item.description}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
