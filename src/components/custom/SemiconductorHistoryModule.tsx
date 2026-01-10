import { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronRight, Clock, Sparkles, Cpu, Zap } from 'lucide-react';
import { SectionComponentProps } from '@/components/MDXContentRenderer';

interface TimelineEvent {
  year: string;
  title: string;
  description: string;
  icon?: React.ReactNode;
  highlight?: boolean;
}

const timelineData: TimelineEvent[] = [
  {
    year: '1947',
    title: '点接触晶体管诞生',
    description: '贝尔实验室发明点接触晶体管，终结真空管主导的电子设备时代，为集成电路的诞生奠定核心器件基础。',
    icon: <Sparkles className="w-4 h-4" />,
    highlight: true
  },
  {
    year: '1958-1959',
    title: '集成电路问世',
    description: '杰克·基尔比（1958年）与罗伯特·诺伊斯（1959年）分别独立研制出集成电路（IC），实现"多元件集成于单硅片"的技术突破，开启电子器件微型化与集成化序幕。',
    icon: <Cpu className="w-4 h-4" />,
    highlight: true
  },
  {
    year: '1961',
    title: '平面型集成电路',
    description: '仙童半导体推出平面型集成电路，确立光刻工艺在器件制备中的核心地位，为后续尺度微缩技术的发展提供了关键支撑。'
  },
  {
    year: '1965.04.19',
    title: '摩尔定律诞生',
    description: '戈登·摩尔在《电子学》杂志发表文章提出"摩尔定律"，预判硅片上的晶体管数量每18-24个月翻倍、成本减半，成为指导半导体行业发展的核心范式。',
    icon: <Zap className="w-4 h-4" />,
    highlight: true
  },
  {
    year: '1960s',
    title: 'MOSFET 发明',
    description: '金属-氧化物-半导体场效应晶体管（MOSFET）被发明，其低功耗、易集成的特性使其成为现代集成电路的核心基础器件。'
  },
  {
    year: '1971',
    title: '首款微处理器',
    description: 'Intel推出全球首款通用可编程微处理器4004，集成2300个晶体管，标志着集成电路从专用器件向通用计算器件转型，开启量产普及时代。'
  },
  {
    year: '1990s',
    title: '深亚微米时代',
    description: 'CMOS工艺进入深亚微米时代，集成电路集成度实现量级提升，为高性能计算与消费电子器件的发展提供了工艺保障。'
  },
  {
    year: '1999',
    title: 'FinFET 结构提出',
    description: '美籍华人科学家胡正明提出鳍式场效应晶体管（FinFET）结构，为纳米尺度器件突破平面结构瓶颈提供了核心解决方案。'
  },
  {
    year: '2000s',
    title: '应变硅与高k栅极',
    description: '应变硅技术与高k/金属栅极结构被引入CMOS工艺，有效缓解了传统MOSFET尺寸缩小过程中出现的漏电与性能衰减问题。'
  },
  {
    year: '2011',
    title: 'FinFET 量产',
    description: 'Intel量产22nm FinFET工艺，标志着集成电路正式进入3D器件结构时代，实现平面微缩瓶颈后的关键工艺突破。'
  },
  {
    year: '2010s',
    title: '3D 技术商业化',
    description: 'FinFET结构成为主流逻辑器件工艺，3D NAND闪存技术实现商业化量产，大幅提升存储器件集成密度；同时3D集成、先进封装技术逐步兴起，推动半导体行业向"后摩尔时代"转型。'
  },
  {
    year: '2020s',
    title: 'GAA FET 与芯粒时代',
    description: '全环绕栅极（GAA FET）结构开始商业化应用，芯粒（Chiplet）技术成为提升集成度、降低研发成本的核心方向；当前最先进工艺已演进至2nm级别，主流技术包括台积电2nm（N2）纳米片晶体管工艺、三星2nm GAA FET工艺，核心集成度分别达500亿个晶体管/芯片、1.7亿个/mm²；先进封装领域的CoWoS-R技术可实现逻辑芯片、HBM内存与I/O芯片的系统级集成，单封装集成度突破万亿级晶体管，为高性能AI芯片提供核心支撑。',
    highlight: true
  }
];

export function SemiconductorHistoryModule({ theme }: SectionComponentProps) {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  return (
    <div className="bg-white border-2 border-gray-200 rounded-2xl p-8 shadow-sm hover:shadow-md transition-shadow">
      {/* 主标题 */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h2 className="text-3xl font-semibold mb-3 text-gray-900 leading-tight">
          一场从 <span className="text-[#8B5CF6]">"单个零件"</span> 到{' '}
          <span className="text-[#8B5CF6]">"亿万器件"</span> 的革命
        </h2>
        <div className="h-1 w-24 bg-gradient-to-r from-[#8B5CF6] to-[#A78BFA] rounded-full"></div>
      </motion.div>

      {/* 引言段落 */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="prose prose-lg max-w-none mb-10 font-serif text-gray-600 leading-relaxed"
      >
        <p className="mb-4 text-justify">
          <span className="font-mono text-[#8B5CF6] font-semibold">70 多年前</span>，当贝尔实验室的科学家发明第一只晶体管时，没人想到这个指甲盖大小的元件，会开启一场技术革命。在此之前，电子设备靠笨重的真空管工作 —— 一台收音机比冰箱还大，一台计算机需要一间屋子才能装下。晶体管的出现，第一次让 "控制电流" 变得小巧又可靠。
        </p>
        
        <p className="mb-4 text-justify">
          但真正的飞跃，来自 <strong className="text-gray-900">"集成电路"</strong> 的诞生。就像把分散的零件组装成一台完整的机器，科学家们把成千上万的晶体管、电阻、电容 "刻" 在同一块硅片上，让它们协同工作。这一下，电子设备的体积越做越小，性能却越来越强。
        </p>

        <div className="bg-gradient-to-r from-[#8B5CF6]-50 to-[#A78BFA]-50 border-l-4 border-[#8B5CF6] p-5 my-6 rounded-r-xl">
          <p className="text-base mb-2">
            <span className="font-mono text-[#8B5CF6] font-semibold">1965 年</span>，戈登·摩尔（Intel 创始人之一）做了个大胆预测：每隔 <span className="font-mono text-gray-900 font-semibold">18-24 个月</span>，一块硅片上的晶体管数量会翻倍，而成本会减半。
          </p>
          <p className="text-base italic text-gray-600">
            这就是著名的 <strong className="text-[#8B5CF6]">"摩尔定律"</strong> —— 它不是物理定律，却成了技术演进的 "指南针"，驱动着半导体行业狂奔了半个多世纪。
          </p>
        </div>

        <p className="mb-4 text-justify">
          从 <span className="font-mono text-gray-900">1971 年</span>第一颗微处理器只有 <span className="font-mono text-[#8B5CF6] font-semibold">2,300 个</span>晶体管，到如今一块高端芯片的晶体管数量突破 <span className="font-mono text-[#8B5CF6] font-semibold">1,000 亿个</span>；从早期电脑每秒运算几千次，到现在超级计算机每秒运算百亿亿次 —— 摩尔定律的本质，是 <strong className="text-gray-900">"尺度微缩"</strong> 的艺术：把晶体管越做越小，让更多器件挤在同一块硅片上。
        </p>
      </motion.div>

      {/* 时间线标题 */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.4 }}
        className="flex items-center gap-3 mb-6 pb-3 border-b-2 border-gray-200"
      >
        <Clock className="w-6 h-6 text-[#8B5CF6]" />
        <h3 className="text-xl font-semibold text-gray-900">
          关键技术里程碑与工艺演进脉络
        </h3>
      </motion.div>

      {/* 时间线 */}
      <div className="space-y-3 mb-8">
        {timelineData.map((event, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 + index * 0.05 }}
            className={`relative transition-all duration-300 ${event.highlight ? 'bg-gradient-to-r from-[#8B5CF6]-50 to-transparent' : 'hover:bg-gray-50'}`}
          >
            <div
              className="flex items-start gap-4 p-4 rounded-xl cursor-pointer border-2 border-transparent hover:border-[#8B5CF6] transition-all"
              onClick={() => setExpandedIndex(expandedIndex === index ? null : index)}
            >
              {/* 年份标记 */}
              <div className="flex-shrink-0">
                <div className={`
                  font-mono text-sm font-bold px-3 py-1.5 rounded-lg text-white
                  ${event.highlight ? 'bg-[#8B5CF6]' : 'bg-gray-600'}
                  min-w-[90px] text-center shadow-sm
                `}>
                  {event.year}
                </div>
              </div>

              {/* 内容 */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  {event.icon && (
                    <span className="text-[#8B5CF6]">{event.icon}</span>
                  )}
                  <h4 className="font-semibold text-gray-900 text-base">
                    {event.title}
                  </h4>
                </div>                
                <motion.div
                  initial={false}
                  animate={{
                    height: expandedIndex === index ? 'auto' : '0px',
                    opacity: expandedIndex === index ? 1 : 0
                  }}
                  className="overflow-hidden"
                >
                  <p className="text-sm text-gray-600 font-serif leading-relaxed mt-2 text-justify">
                    {event.description}
                  </p>
                </motion.div>
              </div>

              {/* 展开图标 */}
              <motion.div
                animate={{ rotate: expandedIndex === index ? 90 : 0 }}
                className="flex-shrink-0 text-gray-600"
              >
                <ChevronRight className="w-5 h-5" />
              </motion.div>
            </div>

            {/* 连接线 */}
            {index < timelineData.length - 1 && (
              <div className="absolute left-[57px] top-full w-0.5 h-3 bg-gray-200"></div>
            )}
          </motion.div>
        ))}
      </div>

      {/* 总结段落 */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="bg-gradient-to-br from-gray-50 to-[#8B5CF6]-50 border-2 border-gray-200 rounded-xl p-6"
      >
        <p className="text-sm text-gray-600 font-serif leading-relaxed text-justify">
          <strong className="text-gray-900">上述里程碑事件</strong>串联起从器件发明、工艺升级到系统集成的完整演进链条，反映了半导体行业 <span className="font-mono text-[#8B5CF6] font-semibold">"尺度微缩 — 结构创新 — 协同集成"</span> 的核心发展逻辑。
        </p>
      </motion.div>

      {/* 提示信息 */}
      <div className="mt-4 flex items-start gap-2 text-xs text-gray-600">
        <ChevronRight className="w-4 h-4 flex-shrink-0 mt-0.5 text-[#8B5CF6]" />
        <p className="font-serif leading-relaxed">
          点击任意时间线项目可展开查看详细信息
        </p>
      </div>
    </div>
  );
}
