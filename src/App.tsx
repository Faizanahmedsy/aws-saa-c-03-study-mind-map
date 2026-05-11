import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Shield, 
  RefreshCw, 
  Zap, 
  DollarSign, 
  ArrowRight,
  Database,
  Globe,
  HardDrive,
  MessageSquare,
  Activity,
  Box,
  LayoutGrid,
  ClipboardList
} from 'lucide-react';
import { BOARDS, DECISION_TREES } from './data';
import { ServiceCard, ServiceCategory } from './types';

const CATEGORY_STYLES: Record<ServiceCategory, { bg: string; border: string; icon: any; label: string }> = {
  Compute: { bg: 'bg-[#FFF7ED]', border: 'border-l-[#F97316]', icon: Zap, label: 'COMPUTE' },
  Networking: { bg: 'bg-[#EFF6FF]', border: 'border-l-[#3B82F6]', icon: Globe, label: 'NETWORKING' },
  Storage: { bg: 'bg-[#F0FDF4]', border: 'border-l-[#22C55E]', icon: HardDrive, label: 'STORAGE' },
  Database: { bg: 'bg-[#FEFCE8]', border: 'border-l-[#EAB308]', icon: Database, label: 'DATABASE' },
  Security: { bg: 'bg-[#FEF2F2]', border: 'border-l-[#EF4444]', icon: Shield, label: 'SECURITY' },
  Integration: { bg: 'bg-[#FAF5FF]', border: 'border-l-[#A855F7]', icon: MessageSquare, label: 'INTEGRATION' },
  Monitoring: { bg: 'bg-white', border: 'border-l-[#64748b]', icon: Activity, label: 'MONITORING' },
};

const CompactNote = ({ service }: { service: ServiceCard }) => {
  const style = CATEGORY_STYLES[service.category];
  
  return (
    <motion.div
      layoutId={service.id}
      whileHover={{ y: -2, scale: 1.01 }}
      className={`${style.bg} ${style.border} border-l-4 p-4 shadow-sm min-h-[320px] w-full flex flex-col rounded-sm transition-shadow hover:shadow-md cursor-default`}
    >
      <div className="flex items-center justify-between border-b border-black/5 pb-2 mb-3">
        <span className="font-bold text-[11px] flex items-center gap-1.5 truncate pr-2">
           <style.icon size={12} className="opacity-70" />
           {service.name}
        </span>
        <span className="text-[8px] font-black opacity-30 tracking-wider shrink-0">
          {style.label}
        </span>
      </div>
      
      <div className="space-y-4 flex-grow overflow-hidden">
        <section>
          <div className="text-[8px] font-extrabold uppercase tracking-widest text-slate-500 mb-1 leading-none">What it is</div>
          <p className="text-[10px] font-medium leading-tight text-slate-800">{service.whatItIs}</p>
        </section>

        <section>
          <div className="text-[8px] font-extrabold uppercase tracking-widest text-slate-500 mb-1 leading-none">Use When</div>
          <ul className="text-[10px] space-y-1 text-slate-700">
            {service.useWhen.map((point, i) => (
              <li key={i} className="flex gap-1 leading-tight">
                <span className="opacity-40 select-none">•</span> {point}
              </li>
            ))}
          </ul>
        </section>

        <section>
          <div className="text-[8px] font-extrabold uppercase tracking-widest text-slate-500 mb-1 leading-none">Avoid When</div>
          <ul className="text-[10px] space-y-1 text-slate-700">
            {service.avoidWhen.map((point, i) => (
              <li key={i} className="flex gap-1 leading-tight italic opacity-90">
                <span className="opacity-40 select-none">→</span> {point}
              </li>
            ))}
          </ul>
        </section>
      </div>

      <div className="mt-4 pt-3 border-t border-black/5">
        <div className="text-[8px] font-extrabold uppercase tracking-widest text-slate-500 mb-1 leading-none">Key Facts</div>
        <ul className="text-[9px] font-mono grid grid-cols-1 gap-1">
          {service.keyFacts.map((fact, i) => (
            <li key={i} className="truncate opacity-70">
              # {fact}
            </li>
          ))}
        </ul>
      </div>
    </motion.div>
  );
};

export default function App() {
  const [activeTab, setActiveTab] = useState<number | 'trees'>(1);

  const tabs = [
    { id: 1, label: 'D1: Secure Architectures', weight: '30%', icon: Shield },
    { id: 2, label: 'D2: Resilient Architectures', weight: '26%', icon: RefreshCw },
    { id: 3, label: 'D3: High Performance', weight: '24%', icon: Zap },
    { id: 4, label: 'D4: Cost Optimized', weight: '20%', icon: DollarSign },
  ];

  const currentBoard = useMemo(() => 
    typeof activeTab === 'number' ? BOARDS.find(b => b.id === activeTab) : null
  , [activeTab]);

  return (
    <div className="flex bg-[#F4F4F2] h-screen overflow-hidden">
      {/* High Density Sidebar */}
      <aside className="w-[220px] h-full bg-white border-r border-slate-200 flex flex-col p-5 z-20 shrink-0">
        <div className="mb-10">
          <h1 className="font-black text-xl leading-[0.9] tracking-tighter">
            AWS SAA-C03<br/>
            <span className="text-orange-500 font-medium text-sm tracking-normal">Study Mind Map</span>
          </h1>
        </div>

        <nav className="flex-grow space-y-8 overflow-y-auto pr-2 custom-scrollbar">
          <div>
            <div className="text-[10px] uppercase font-black text-slate-400 mb-3 tracking-widest">Exam Domains</div>
            <div className="space-y-1">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full text-left px-3 py-2.5 rounded-lg text-xs font-bold transition-all border border-transparent ${
                    activeTab === tab.id 
                    ? 'bg-[#111827] text-white shadow-sm' 
                    : 'bg-[#F9FAFB] text-slate-500 border-[#F3F4F6] hover:bg-slate-100'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <tab.icon size={12} className={activeTab === tab.id ? 'opacity-100' : 'opacity-40'} />
                    <span className="truncate whitespace-nowrap overflow-hidden">{tab.id}: {tab.label.split(': ')[1] || tab.label}</span>
                  </div>
                  <div className={`text-[9px] mt-1 font-mono ${activeTab === tab.id ? 'opacity-60' : 'opacity-40'}`}>
                    Weight: {tab.weight}
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div>
            <div className="text-[10px] uppercase font-black text-slate-400 mb-3 tracking-widest">Mastery Tools</div>
            <div className="space-y-1">
              <button
                onClick={() => setActiveTab('trees')}
                className={`w-full text-left px-3 py-2.5 rounded-lg text-xs font-bold transition-all border border-transparent ${
                  activeTab === 'trees'
                  ? 'bg-[#111827] text-white shadow-sm'
                  : 'bg-[#F9FAFB] text-slate-500 border-[#F3F4F6] hover:bg-slate-100'
                }`}
              >
                <div className="flex items-center gap-2">
                  <LayoutGrid size={12} className={activeTab === 'trees' ? 'opacity-100' : 'opacity-40'} />
                  <span>Decision Trees</span>
                </div>
              </button>
              <button disabled className="w-full text-left px-3 py-2.5 rounded-lg text-xs font-bold bg-[#F9FAFB] text-slate-400 border-[#F3F4F6] opacity-50 cursor-not-allowed">
                <div className="flex items-center gap-2">
                  <ClipboardList size={12} className="opacity-40" />
                  <span>Cheat Sheets</span>
                </div>
              </button>
            </div>
          </div>
        </nav>

        {/* Readiness Widget */}
        <div className="mt-8 p-4 bg-orange-50 rounded-xl border border-orange-100 shrink-0">
          <div className="text-xs font-black text-orange-800 uppercase tracking-tight">Exam Readiness</div>
          <div className="w-full bg-orange-200 h-1.5 rounded-full mt-2 overflow-hidden shadow-inner">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: '65%' }}
              className="bg-orange-500 h-1.5 rounded-full"
            />
          </div>
          <div className="text-[9px] text-orange-600 mt-1.5 flex justify-between font-bold">
            <span>65% Syllabus Mastery</span>
          </div>
        </div>
      </aside>

      {/* Main Content Area (Dot Grid Canvas) */}
      <main className="flex-grow h-full overflow-y-auto canvas-grid relative select-none">
        <div className="p-10 min-h-full">
          <AnimatePresence mode="wait">
            {activeTab === 'trees' ? (
              <motion.div
                key="trees"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="max-w-7xl mx-auto"
              >
                <div className="mb-12">
                  <h1 className="text-4xl font-black text-slate-900 leading-none">MASTER<br/><span className="text-indigo-600">DECISION TREES</span></h1>
                  <p className="text-sm text-slate-500 mt-2 font-medium">Logical decision gates for rapid exam response.</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {DECISION_TREES.map((tree, i) => (
                    <div key={i} className="bg-white/80 backdrop-blur-sm p-6 rounded-sm border border-slate-200 shadow-sm relative overflow-hidden group">
                      <div className="absolute top-0 left-0 w-1 h-full bg-indigo-600"></div>
                      <h3 className="text-xl font-black text-slate-800 mb-6 flex items-center gap-2 border-b border-slate-100 pb-3">
                         <Box size={16} className="text-indigo-600" />
                         {tree.title}
                      </h3>
                      <div className="space-y-6">
                        {tree.nodes.map((node, ni) => (
                          <div key={ni}>
                            <h4 className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-3 leading-none">{node.question}</h4>
                            <div className="space-y-2">
                              {node.options.map((opt, oi) => (
                                <div key={oi} className="flex items-center group/opt">
                                  <div className="w-full flex items-center justify-between p-3 rounded-lg bg-white group-hover/opt:bg-indigo-600 group-hover/opt:text-white transition-all border border-slate-100 shadow-[0_1px_2px_rgba(0,0,0,0.05)]">
                                    <span className="text-xs font-bold pr-4">{opt.label}</span>
                                    <div className="flex items-center gap-2 shrink-0">
                                      <ArrowRight size={12} className="opacity-20 group-hover/opt:opacity-60" />
                                      <span className="text-xs font-black tracking-tight">{opt.result}</span>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            ) : currentBoard && (
              <motion.div
                key={currentBoard.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="max-w-7xl mx-auto"
              >
                <div className="flex items-end justify-between mb-12">
                  <div>
                    <h1 className="text-4xl font-black text-slate-900 leading-none">
                      DOMAIN 0{currentBoard.id}<br/>
                      <span className="text-blue-600 uppercase">{currentBoard.title.split(': ')[1] || currentBoard.title}</span>
                    </h1>
                    <p className="text-sm text-slate-500 mt-2 font-medium">
                      {currentBoard.weight} of Exam Score • Focus on Core Patterns
                    </p>
                  </div>
                  
                  {currentBoard.comparisons && currentBoard.comparisons.length > 0 && (
                    <div className="hidden lg:flex flex-col items-end gap-2 shrink-0">
                      <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Decision Logic</div>
                      <div className="flex gap-2">
                        {currentBoard.comparisons.map((comp, i) => (
                          <div 
                            key={i} 
                            className="bg-white border border-slate-200 px-3 py-1.5 rounded-lg shadow-sm group hover:border-blue-400 transition-colors"
                            title={comp.label}
                          >
                            <span className="text-[10px] font-bold text-slate-800 flex items-center gap-2">
                              {BOARDS.flatMap(b => b.services).find(s => s.id === comp.fromId)?.name}
                              <ArrowRight size={10} className="text-slate-300" />
                              {BOARDS.flatMap(b => b.services).find(s => s.id === comp.toId)?.name}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Grid of Compact Notes */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 content-start items-start">
                  {currentBoard.services.map((service) => (
                    <CompactNote key={service.id} service={service} />
                  ))}
                </div>

                {/* Floating Decision Rule Indicators */}
                <div className="fixed bottom-10 right-10 flex gap-4 z-10 pointer-events-none opacity-0 lg:opacity-100 transition-opacity">
                  <div className="bg-white border border-slate-200 p-3 rounded-lg shadow-xl flex items-center gap-3">
                    <div className="w-7 h-7 rounded-full bg-green-500 flex items-center justify-center text-white text-xs font-bold">✓</div>
                    <div className="text-[10px] font-black">RECOVERY TIME (RTO)<br/><span className="text-slate-400 font-normal">Target: &lt; 15 mins</span></div>
                  </div>
                  <div className="bg-white border border-slate-200 p-3 rounded-lg shadow-xl flex items-center gap-3">
                    <div className="w-7 h-7 rounded-full bg-blue-500 flex items-center justify-center text-white text-xs font-bold">i</div>
                    <div className="text-[10px] font-black">MULTI-AZ STATUS<br/><span className="text-slate-400 font-normal">Active Configuration</span></div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>

      {/* Internal Custom Scrollbar Styles */}
      <style dangerouslySetInnerHTML={{ __html: `
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #E5E7EB;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #D1D5DB;
        }
      `}} />
    </div>
  );
}
