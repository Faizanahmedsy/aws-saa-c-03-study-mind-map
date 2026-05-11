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
  ClipboardList,
  Menu,
  X,
  Search,
  CheckCircle2,
  AlertCircle,
  Server
} from 'lucide-react';
import { BOARDS, DECISION_TREES, ALL_SERVICES } from './data';
import { ServiceCard, ServiceCategory, DecisionTree, DecisionNode } from './types';

const CATEGORY_STYLES: Record<ServiceCategory, { bg: string; border: string; icon: any; label: string }> = {
  Compute: { bg: 'bg-[#FFF7ED]', border: 'border-l-[#F97316]', icon: Zap, label: 'COMPUTE' },
  Networking: { bg: 'bg-[#EFF6FF]', border: 'border-l-[#3B82F6]', icon: Globe, label: 'NETWORKING' },
  Storage: { bg: 'bg-[#F0FDF4]', border: 'border-l-[#22C55E]', icon: HardDrive, label: 'STORAGE' },
  Database: { bg: 'bg-[#FEFCE8]', border: 'border-l-[#EAB308]', icon: Database, label: 'DATABASE' },
  Security: { bg: 'bg-[#FEF2F2]', border: 'border-l-[#EF4444]', icon: Shield, label: 'SECURITY' },
  Integration: { bg: 'bg-[#FAF5FF]', border: 'border-l-[#A855F7]', icon: MessageSquare, label: 'INTEGRATION' },
  Monitoring: { bg: 'bg-white', border: 'border-l-[#64748b]', icon: Activity, label: 'MONITORING' },
  Analytics: { bg: 'bg-[#f0f9ff]', border: 'border-l-[#0ea5e9]', icon: LayoutGrid, label: 'ANALYTICS' },
  Migration: { bg: 'bg-[#f0fdfa]', border: 'border-l-[#14b8a6]', icon: RefreshCw, label: 'MIGRATION' },
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
  const [activeTab, setActiveTab] = useState<number | 'trees' | 'all'>(1);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [quizState, setQuizState] = useState<Record<string, { currentNodeId: string; history: string[]; isComplete: boolean; selectedOptionIndex: number | null; feedback: string | null }>>({});

  const tabs = [
    { id: 1, label: 'D1: Secure Architectures', weight: '30%', icon: Shield },
    { id: 2, label: 'D2: Resilient Architectures', weight: '26%', icon: RefreshCw },
    { id: 3, label: 'D3: High Performance', weight: '24%', icon: Zap },
    { id: 4, label: 'D4: Cost Optimized', weight: '20%', icon: DollarSign },
  ];

  const handleQuizOption = (treeId: string, node: DecisionNode, optionIndex: number) => {
    const option = node.options[optionIndex];
    const isCorrect = option.isCorrect ?? false;
    const feedback = isCorrect ? "Correct! This is the AWS best practice." : "Incorrect. Try another logic path.";

    setQuizState(prev => ({
      ...prev,
      [treeId]: {
        ...prev[treeId],
        selectedOptionIndex: optionIndex,
        feedback: feedback
      }
    }));

    if (isCorrect) {
      setTimeout(() => {
        if (option.nextId) {
          setQuizState(prev => ({
            ...prev,
            [treeId]: {
              currentNodeId: option.nextId!,
              history: [...(prev[treeId]?.history || []), node.id],
              isComplete: false,
              selectedOptionIndex: null,
              feedback: null
            }
          }));
        } else if (option.result) {
          setQuizState(prev => ({
            ...prev,
            [treeId]: {
              ...prev[treeId],
              isComplete: true,
              feedback: `Result: ${option.result}`
            }
          }));
        }
      }, 1000);
    }
  };

  const resetQuiz = (treeId: string, startId: string) => {
    setQuizState(prev => ({
      ...prev,
      [treeId]: {
        currentNodeId: startId,
        history: [],
        isComplete: false,
        selectedOptionIndex: null,
        feedback: null
      }
    }));
  };

  const [searchTerm, setSearchTerm] = useState('');
  const filteredServices = useMemo(() => {
    return ALL_SERVICES.filter(s => 
      s.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      s.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.examFocus.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm]);

  const currentBoard = useMemo(() => 
    typeof activeTab === 'number' ? BOARDS.find(b => b.id === activeTab) : null
  , [activeTab]);

  return (
    <div className="flex bg-[#F4F4F2] h-screen overflow-hidden relative">
      {/* Mobile Menu Trigger */}
      <div className="lg:hidden fixed top-4 left-4 z-40">
        <button 
          onClick={() => setIsSidebarOpen(true)}
          className="p-3 bg-white shadow-lg rounded-xl border border-slate-200"
        >
          <Menu size={20} className="text-slate-700" />
        </button>
      </div>

      {/* High Density Sidebar */}
      <aside 
        className={`fixed lg:relative top-0 left-0 h-full w-[240px] lg:w-[220px] bg-white border-r border-slate-200 flex flex-col p-5 z-50 shrink-0 transition-transform duration-300 ease-in-out ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="mb-10 flex items-center justify-between">
          <h1 className="font-black text-xl leading-[0.9] tracking-tighter">
            AWS SAA-C03<br/>
            <span className="text-orange-500 font-medium text-sm tracking-normal">Study Mind Map</span>
          </h1>
          <button 
            onClick={() => setIsSidebarOpen(false)}
            className="lg:hidden p-1 hover:bg-slate-100 rounded-full"
          >
            <X size={20} />
          </button>
        </div>

        <nav className="flex-grow space-y-8 overflow-y-auto pr-2 custom-scrollbar">
          <div>
            <div className="text-[10px] uppercase font-black text-slate-400 mb-3 tracking-widest">Exam Domains</div>
            <div className="space-y-1">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveTab(tab.id);
                    setIsSidebarOpen(false);
                  }}
                  className={`w-full text-left px-3 py-2.5 rounded-lg text-xs font-bold transition-all border border-transparent ${
                    activeTab === tab.id 
                    ? 'bg-[#111827] text-white shadow-sm' 
                    : 'bg-[#F9FAFB] text-slate-500 border-[#F3F4F6] hover:bg-slate-100'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <tab.icon size={12} className={activeTab === tab.id ? 'opacity-100' : 'opacity-40'} />
                    <span className="truncate whitespace-nowrap overflow-hidden pr-2">{tab.id}: {tab.label.split(': ')[1] || tab.label}</span>
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
                onClick={() => {
                  setActiveTab('trees');
                  setIsSidebarOpen(false);
                }}
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
            </div>
          </div>

          <div>
            <div className="text-[10px] uppercase font-black text-slate-400 mb-3 tracking-widest">Library</div>
            <div className="space-y-1">
              <button
                onClick={() => {
                  setActiveTab('all');
                  setIsSidebarOpen(false);
                }}
                className={`w-full text-left px-3 py-2.5 rounded-lg text-xs font-bold transition-all border border-transparent ${
                  activeTab === 'all'
                  ? 'bg-[#111827] text-white shadow-sm'
                  : 'bg-[#F9FAFB] text-slate-500 border-[#F3F4F6] hover:bg-slate-100'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Server size={12} className={activeTab === 'all' ? 'opacity-100' : 'opacity-40'} />
                  <span>All Servers</span>
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

      {/* Sidebar Overlay for Mobile */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsSidebarOpen(false)}
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Main Content Area (Dot Grid Canvas) */}
      <main className="flex-grow h-full overflow-y-auto canvas-grid relative select-none">
        <div className="p-6 md:p-10 min-h-full">
          <AnimatePresence mode="wait">
            {activeTab === 'trees' ? (
              <motion.div
                key="trees"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="max-w-7xl mx-auto"
              >
                <div className="mb-12 mt-12 lg:mt-0">
                  <h1 className="text-3xl md:text-4xl font-black text-slate-900 leading-none">MASTER<br/><span className="text-indigo-600">DECISION TREES</span></h1>
                  <p className="text-sm text-slate-500 mt-2 font-medium">Logical decision gates for rapid exam response. Follow the path to the correct solution.</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 pb-20">
                  {DECISION_TREES.map((tree) => {
                    const state = quizState[tree.id] || { currentNodeId: tree.startNodeId, history: [], isComplete: false, selectedOptionIndex: null, feedback: null };
                    const currentNode = tree.nodes.find(n => n.id === state.currentNodeId);

                    return (
                      <div key={tree.id} className="bg-white/80 backdrop-blur-sm p-6 rounded-xl border border-slate-200 shadow-sm relative overflow-hidden flex flex-col min-h-[450px]">
                        <div className="absolute top-0 left-0 w-1.5 h-full bg-indigo-600"></div>
                        
                        <div className="flex justify-between items-start mb-6 border-b border-slate-100 pb-4">
                          <div>
                            <h3 className="text-lg font-black text-slate-800 flex items-center gap-2">
                              <Box size={18} className="text-indigo-600" />
                              {tree.title}
                            </h3>
                            <p className="text-[10px] font-medium text-slate-500 uppercase tracking-wider mt-1">{tree.description}</p>
                          </div>
                          <button 
                            onClick={() => resetQuiz(tree.id, tree.startNodeId)}
                            className="text-[10px] font-bold text-indigo-600 hover:bg-indigo-50 px-2 py-1 rounded"
                          >
                            RESET
                          </button>
                        </div>

                        <div className="flex-grow flex flex-col justify-center">
                          {currentNode && !state.isComplete ? (
                            <motion.div 
                              key={currentNode.id}
                              initial={{ x: 20, opacity: 0 }}
                              animate={{ x: 0, opacity: 1 }}
                              className="space-y-6"
                            >
                              <div className="space-y-1">
                                <span className="text-[10px] font-black text-indigo-400 uppercase tracking-widest leading-none">Decision Gate</span>
                                <h4 className="text-xl font-bold text-slate-800 leading-tight">{currentNode.question}</h4>
                              </div>

                              <div className="space-y-2">
                                {currentNode.options.map((opt, oi) => {
                                  const isSelected = state.selectedOptionIndex === oi;
                                  const isCorrect = opt.isCorrect;
                                  
                                  return (
                                    <button
                                      key={oi}
                                      disabled={state.selectedOptionIndex !== null}
                                      onClick={() => handleQuizOption(tree.id, currentNode, oi)}
                                      className={`w-full text-left p-4 rounded-xl border transition-all flex items-center justify-between group ${
                                        isSelected 
                                          ? (isCorrect ? 'bg-green-50 border-green-200 ring-2 ring-green-100' : 'bg-red-50 border-red-200 ring-2 ring-red-100')
                                          : 'bg-white border-slate-100 hover:border-indigo-300 hover:bg-indigo-50/30'
                                      }`}
                                    >
                                      <div>
                                        <div className="text-sm font-bold text-slate-800 group-hover:text-indigo-700">{opt.label}</div>
                                        {opt.description && <div className="text-[10px] text-slate-500 mt-0.5">{opt.description}</div>}
                                      </div>
                                      {isSelected && (
                                        isCorrect ? <CheckCircle2 className="text-green-500" size={18} /> : <AlertCircle className="text-red-500" size={18} />
                                      )}
                                    </button>
                                  );
                                })}
                              </div>

                              {state.feedback && (
                                <motion.div 
                                  initial={{ opacity: 0, y: 5 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  className={`text-xs font-bold p-3 rounded-lg flex items-center gap-2 ${
                                    state.feedback.includes('Correct') ? 'text-green-700 bg-green-50' : 'text-red-700 bg-red-50'
                                  }`}
                                >
                                  {state.feedback.includes('Correct') ? <CheckCircle2 size={14} /> : <AlertCircle size={14} />}
                                  {state.feedback}
                                </motion.div>
                              )}
                            </motion.div>
                          ) : (
                            <motion.div 
                              initial={{ scale: 0.9, opacity: 0 }}
                              animate={{ scale: 1, opacity: 1 }}
                              className="text-center py-8 space-y-4"
                            >
                              <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-2">
                                <CheckCircle2 size={32} />
                              </div>
                              <h3 className="text-2xl font-black text-slate-800">PATH COMPLETE</h3>
                              <p className="text-slate-500 text-sm max-w-[250px] mx-auto font-medium">Recommended Service Pattern Architecture:</p>
                              <div className="bg-white border-2 border-dashed border-indigo-200 p-6 rounded-2xl">
                                <div className="text-indigo-600 font-black text-2xl tracking-tight">{state.feedback?.replace('Result: ', '')}</div>
                              </div>
                              <button 
                                onClick={() => resetQuiz(tree.id, tree.startNodeId)}
                                className="mt-4 text-xs font-bold text-white bg-indigo-600 px-6 py-3 rounded-full hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-200"
                              >
                                START NEW ANALYSIS
                              </button>
                            </motion.div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </motion.div>
            ) : activeTab === 'all' ? (
              <motion.div
                key="all"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="max-w-7xl mx-auto"
              >
                <div className="mb-12 mt-12 lg:mt-0 flex flex-col md:flex-row md:items-end justify-between gap-6">
                  <div>
                    <h1 className="text-3xl md:text-4xl font-black text-slate-900 leading-none">ALL<br/><span className="text-emerald-600">AWS SERVICES</span></h1>
                    <p className="text-sm text-slate-500 mt-2 font-medium">Comprehensive encyclopedia of exam-relevant services.</p>
                  </div>
                  
                  <div className="relative w-full md:w-80">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input 
                      type="text" 
                      placeholder="Search services, patterns, focus..." 
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-2xl shadow-sm focus:ring-2 focus:ring-emerald-100 focus:border-emerald-300 transition-all outline-none text-sm font-medium"
                    />
                  </div>
                </div>

                <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden mb-20">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead className="bg-slate-50 border-b border-slate-100">
                        <tr>
                          <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Service Name</th>
                          <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Category</th>
                          <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">What It Is</th>
                          <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Exam Focus / Key Pattern</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-50">
                        {filteredServices.map((service, i) => {
                          const style = CATEGORY_STYLES[service.category];
                          return (
                            <tr key={i} className="hover:bg-slate-50 transition-colors group">
                              <td className="px-6 py-4">
                                <div className="flex items-center gap-3">
                                  <div className={`p-2 rounded-lg ${style.bg}`}>
                                    <style.icon size={16} className={style.border.replace('border-l-', 'text-')} />
                                  </div>
                                  <span className="font-bold text-slate-900 group-hover:text-emerald-600 transition-colors">{service.name}</span>
                                </div>
                              </td>
                              <td className="px-6 py-4">
                                <span className={`text-[10px] font-black px-2 py-1 rounded w-fit ${style.bg} ${style.border.replace('border-l-', 'text-')}`}>
                                  {service.category.toUpperCase()}
                                </span>
                              </td>
                              <td className="px-6 py-4 text-sm text-slate-600 font-medium">{service.description}</td>
                              <td className="px-6 py-4">
                                <div className="flex items-center gap-2">
                                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0"></div>
                                  <span className="text-xs font-bold text-slate-700">{service.examFocus}</span>
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                  {filteredServices.length === 0 && (
                    <div className="p-20 text-center">
                      <div className="w-16 h-16 bg-slate-50 text-slate-300 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Search size={32} />
                      </div>
                      <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">No services matched your query</p>
                    </div>
                  )}
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
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 mt-12 lg:mt-0 gap-6">
                  <div>
                    <h1 className="text-3xl md:text-4xl font-black text-slate-900 leading-[0.9] tracking-tight">
                      DOMAIN 0{currentBoard.id}<br/>
                      <span className="text-blue-600 uppercase text-2xl md:text-4xl">{currentBoard.title.split(': ')[1] || currentBoard.title}</span>
                    </h1>
                    <p className="text-sm text-slate-500 mt-2 font-medium">
                      {currentBoard.weight} of Exam Score • Focus on Core Patterns
                    </p>
                  </div>
                  
                  {currentBoard.comparisons && currentBoard.comparisons.length > 0 && (
                    <div className="flex flex-col md:items-end gap-2 shrink-0 overflow-x-auto">
                      <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Decision Logic</div>
                      <div className="flex gap-2 pb-2 md:pb-0">
                        {currentBoard.comparisons.map((comp, i) => (
                          <div 
                            key={i} 
                            className="bg-white border border-slate-200 px-3 py-1.5 rounded-lg shadow-sm group hover:border-blue-400 transition-colors shrink-0"
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
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 content-start items-start">
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
