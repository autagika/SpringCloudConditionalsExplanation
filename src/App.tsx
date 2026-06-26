import { useState } from 'react';
import Header from './components/Header';
import ArticleReader from './components/ArticleReader';
import BootstrappingVisualizer from './components/BootstrappingVisualizer';
import SandboxSimulator from './components/SandboxSimulator';
import QuizSection from './components/QuizSection';
import { SimulatorState } from './types';
import { Play, Layers, Award, Info, HelpCircle } from 'lucide-react';

export default function App() {
  const [readingProgress, setReadingProgress] = useState(0);
  const [activeTab, setActiveTab] = useState('article'); // 'article', 'sandbox', 'quiz'
  const [quizScore, setQuizScore] = useState<number | null>(null);

  // Sub-tabs for the desktop visual/sandbox column
  const [rightPanelTab, setRightPanelTab] = useState<'bootstrap' | 'sandbox' | 'quiz'>('sandbox');

  // Unified Simulator State
  const [simulatorState, setSimulatorState] = useState<SimulatorState>({
    classpath: {
      oracleDriver: false,
      hikariCP: true,
      tomcat: true,
      springWebMvc: true,
      flyway: false
    },
    properties: {
      datasourceUrl: '',
      datasourceType: 'com.zaxxer.hikari.HikariDataSource',
      excludeDataSourceAutoConfig: false
    },
    customBeans: {
      userDataSource: false,
      userFlywayClone: false
    }
  });

  const handleApplySandboxConfig = (newConfig: Partial<SimulatorState>) => {
    setSimulatorState((prev) => {
      const updated = { ...prev };
      if (newConfig.classpath) updated.classpath = { ...prev.classpath, ...newConfig.classpath };
      if (newConfig.properties) updated.properties = { ...prev.properties, ...newConfig.properties };
      if (newConfig.customBeans) updated.customBeans = { ...prev.customBeans, ...newConfig.customBeans };
      return updated;
    });

    // On mobile, switch views to the sandbox so they can see results. On desktop, switch the right pane sub-tab
    setActiveTab('sandbox');
    setRightPanelTab('sandbox');
  };

  const handleHeaderTabSwitch = (tab: string) => {
    setActiveTab(tab);
    if (tab === 'sandbox') {
      setRightPanelTab('sandbox');
    } else if (tab === 'quiz') {
      setRightPanelTab('quiz');
    }
  };

  return (
    <div id="app-root" className="min-h-screen bg-slate-50 flex flex-col selection:bg-indigo-100">
      {/* Top sticky editorial bar */}
      <Header
        readingProgress={readingProgress}
        activeTab={activeTab}
        setActiveTab={handleHeaderTabSwitch}
        quizScore={quizScore}
      />

      {/* Main Responsive Grid Layout */}
      <main className="flex-1 w-full max-w-7xl mx-auto flex flex-col lg:grid lg:grid-cols-12 overflow-hidden">
        
        {/* LEFT COLUMN: Deep-Dive Article (Visible on mobile active-tab: 'article', always on desktop) */}
        <div className={`lg:col-span-6 flex flex-col bg-white border-r border-slate-100 ${
          activeTab === 'article' ? 'block' : 'hidden lg:block'
        }`}>
          <ArticleReader
            onApplySandboxConfig={handleApplySandboxConfig}
            onSectionVisible={setReadingProgress}
          />
        </div>

        {/* RIGHT COLUMN: Interactive Companion Workspace (Visible on mobile when active-tab is NOT 'article') */}
        <div className={`lg:col-span-6 flex flex-col p-4 sm:p-6 lg:p-8 h-[calc(100vh-4.25rem)] overflow-y-auto ${
          activeTab !== 'article' ? 'block' : 'hidden lg:block'
        }`}>
          
          {/* Desktop Right Column Nav Header */}
          <div className="hidden lg:flex items-center justify-between pb-6 border-b border-slate-200/60 mb-6">
            <span className="font-sans font-bold text-xs uppercase tracking-wider text-slate-400 flex items-center space-x-2">
              <Layers className="h-4 w-4 text-indigo-600" />
              <span>Interactive Workspace</span>
            </span>

            {/* Desktop right column tabs */}
            <div className="flex space-x-1.5 bg-slate-200/50 p-1 rounded-lg">
              <button
                onClick={() => setRightPanelTab('bootstrap')}
                className={`px-3 py-1 text-xs font-semibold rounded-md transition-all cursor-pointer ${
                  rightPanelTab === 'bootstrap'
                    ? 'bg-white text-slate-900 shadow-sm'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                Bootstrap Flow
              </button>
              <button
                onClick={() => setRightPanelTab('sandbox')}
                className={`px-3 py-1 text-xs font-semibold rounded-md transition-all cursor-pointer ${
                  rightPanelTab === 'sandbox'
                    ? 'bg-white text-slate-900 shadow-sm'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                Autoconfig Sandbox
              </button>
              <button
                onClick={() => setRightPanelTab('quiz')}
                className={`px-3 py-1 text-xs font-semibold rounded-md transition-all cursor-pointer ${
                  rightPanelTab === 'quiz'
                    ? 'bg-white text-slate-900 shadow-sm'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                Mastery Quiz
              </button>
            </div>
          </div>

          {/* Mobile Tab Fallbacks and Direct Module Displays */}
          <div className="space-y-6">
            
            {/* If Mobile, show exactly the active tab component. If Desktop, follow rightPanelTab */}
            <div className="lg:hidden">
              {activeTab === 'sandbox' && (
                <div className="space-y-6">
                  <BootstrappingVisualizer />
                  <SandboxSimulator
                    state={simulatorState}
                    onChangeState={setSimulatorState}
                  />
                </div>
              )}
              {activeTab === 'quiz' && (
                <QuizSection onQuizCompleted={setQuizScore} />
              )}
            </div>

            {/* If Desktop, render based on rightPanelTab selection */}
            <div className="hidden lg:block">
              {rightPanelTab === 'bootstrap' && <BootstrappingVisualizer />}
              {rightPanelTab === 'sandbox' && (
                <SandboxSimulator
                  state={simulatorState}
                  onChangeState={setSimulatorState}
                />
              )}
              {rightPanelTab === 'quiz' && (
                <QuizSection onQuizCompleted={setQuizScore} />
              )}
            </div>
            
            {/* Context Help Alert (Only shown on Sandbox view) */}
            {((activeTab === 'sandbox' && window.innerWidth < 1024) || rightPanelTab === 'sandbox') && (
              <div className="rounded-xl border border-slate-200 bg-white p-4 flex items-start space-x-3 shadow-sm">
                <HelpCircle className="h-5 w-5 text-indigo-600 shrink-0 mt-0.5" />
                <div className="text-xs">
                  <span className="block font-bold text-slate-900 mb-0.5">Understanding Spring Boot's Opinionated Magic</span>
                  <p className="text-slate-500 leading-relaxed">
                    By bundling libraries like Hikari or Tomcat, starter dependencies automatically satisfy <code className="text-rose-600 font-mono text-[10px]">@ConditionalOnClass</code>. Specifying properties fulfills <code className="text-rose-600 font-mono text-[10px]">@ConditionalOnProperty</code>. When you register custom beans, Spring Boot backs off through <code className="text-rose-600 font-mono text-[10px]">@ConditionalOnMissingBean</code>. Play with the controls above to see this in real-time!
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
