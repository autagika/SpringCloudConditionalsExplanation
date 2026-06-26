import { useState } from 'react';
import { Play, RotateCcw, ArrowRight, Server, FileCode2, Database, ShieldCheck, Cpu } from 'lucide-react';

interface VisualizerStep {
  title: string;
  description: string;
  badge: string;
  details: string[];
}

const steps: VisualizerStep[] = [
  {
    title: "1. SpringApplication.run() Launched",
    description: "The main method is executed. Spring Boot instantiates a SpringApplication runner, logging the famous ASCII banner and creating the initial empty ApplicationContext.",
    badge: "BOOTSTRAP",
    details: [
      "Initializes active profiles",
      "Registers default listeners",
      "Prepares the environment sandbox"
    ]
  },
  {
    title: "2. Load & Merge 17 Property Sources",
    description: "Spring Boot searches 17 distinct locations for key-value configurations, merging them with decreasing priority. Environment variables and application.properties are resolved here.",
    badge: "ENVIRONMENT",
    details: [
      "Reads command line arguments (--port=3000)",
      "Fetches OS environment variables",
      "Parses src/main/resources/application.properties"
    ]
  },
  {
    title: "3. Scan META-INF/spring.factories",
    description: "Spring Boot scans all imported jars for META-INF/spring.factories. It parses the 'EnableAutoConfiguration' key to index every available Autoconfiguration class.",
    badge: "REGISTRY SCAN",
    details: [
      "Finds DataSourceAutoConfiguration",
      "Finds ServletWebServerFactoryAutoConfiguration",
      "Finds RabbitAutoConfiguration",
      "Finds 120+ potential autoconfigs"
    ]
  },
  {
    title: "4. Evaluate Conditional Matchers",
    description: "Spring Boot executes custom boolean Condition matchers. It checks Classpath availability (Is Tomcat on classpath?), properties matching, and missing-bean back-offs.",
    badge: "CONDITIONAL ENGINE",
    details: [
      "@ConditionalOnClass: checks Tomcat/Hikari",
      "@ConditionalOnProperty: checks spring.datasource.url",
      "@ConditionalOnMissingBean: ensures no duplicate user Beans exist"
    ]
  },
  {
    title: "5. Spin up Tomcat & Register Beans",
    description: "Satisified autoconfigurations are registered in the ApplicationContext. Tomcat embedded server is spun up on port 3000, and the application is fully live!",
    badge: "READY & ACTIVE",
    details: [
      "Starts EmbeddedTomcatWebServer",
      "Registers Spring MVC DispatcherServlet",
      "Pre-wires and injects active Datasource"
    ]
  }
];

export default function BootstrappingVisualizer() {
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [intervalId, setIntervalId] = useState<NodeJS.Timeout | null>(null);

  const startAnimation = () => {
    if (isPlaying) return;
    setIsPlaying(true);
    let step = currentStep === 4 ? 0 : currentStep;
    setCurrentStep(step);

    const id = setInterval(() => {
      step += 1;
      if (step < 5) {
        setCurrentStep(step);
      } else {
        clearInterval(id);
        setIsPlaying(false);
      }
    }, 3000);

    setIntervalId(id);
  };

  const stopAnimation = () => {
    if (intervalId) {
      clearInterval(intervalId);
    }
    setIsPlaying(false);
  };

  const resetAnimation = () => {
    stopAnimation();
    setCurrentStep(0);
  };

  const setStepManually = (index: number) => {
    stopAnimation();
    setCurrentStep(index);
  };

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-slate-100 pb-4">
        <div>
          <h3 className="font-sans font-bold text-base text-slate-900">Spring Boot Bootstrapping Flow</h3>
          <p className="font-sans text-xs text-slate-500">Interactive step-by-step trace of what happens when you hit Run</p>
        </div>
        <div className="mt-3 sm:mt-0 flex items-center space-x-2">
          {isPlaying ? (
            <button
              onClick={stopAnimation}
              className="flex items-center space-x-1.5 rounded-lg border border-red-200 bg-red-50 px-3 py-1.5 text-xs font-semibold text-red-700 hover:bg-red-100 transition-all cursor-pointer"
            >
              <Cpu className="h-3.5 w-3.5 animate-spin" />
              <span>Pause</span>
            </button>
          ) : (
            <button
              onClick={startAnimation}
              className="flex items-center space-x-1.5 rounded-lg border border-indigo-200 bg-indigo-50 px-3 py-1.5 text-xs font-semibold text-indigo-800 hover:bg-indigo-100 transition-all cursor-pointer"
            >
              <Play className="h-3.5 w-3.5 fill-indigo-800" />
              <span>{currentStep === 4 ? "Restart Flow" : "Play Bootstrap"}</span>
            </button>
          )}
          <button
            onClick={resetAnimation}
            className="flex items-center space-x-1.5 rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition-all cursor-pointer"
          >
            <RotateCcw className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {/* Progress visual pills */}
      <div className="mt-6 grid grid-cols-5 gap-1.5">
        {steps.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setStepManually(idx)}
            className={`h-2.5 rounded-full transition-all cursor-pointer ${
              idx === currentStep
                ? 'bg-indigo-600 shadow-md shadow-indigo-600/20'
                : idx < currentStep
                ? 'bg-indigo-200'
                : 'bg-slate-100'
            }`}
          />
        ))}
      </div>

      <div className="mt-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left pane: Active Step details */}
        <div className="lg:col-span-7 flex flex-col justify-between rounded-xl bg-slate-50 p-5 border border-slate-100">
          <div>
            <span className="rounded-full bg-indigo-100 px-2.5 py-0.5 text-[10px] font-bold tracking-wider uppercase text-indigo-800">
              {steps[currentStep].badge}
            </span>
            <h4 className="mt-2.5 font-sans font-bold text-sm text-slate-900">
              {steps[currentStep].title}
            </h4>
            <p className="mt-2 font-sans text-xs leading-relaxed text-slate-600">
              {steps[currentStep].description}
            </p>
          </div>

          <div className="mt-6 border-t border-slate-200/60 pt-4">
            <h5 className="font-sans text-[11px] font-bold uppercase tracking-wider text-slate-400">Under the Hood Execution</h5>
            <ul className="mt-2.5 space-y-2">
              {steps[currentStep].details.map((detail, idx) => (
                <li key={idx} className="flex items-center space-x-2 text-xs text-slate-700">
                  <ArrowRight className="h-3.5 w-3.5 text-indigo-500 shrink-0" />
                  <span className="font-mono text-[11px]">{detail}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Right pane: Visual Diagram Map */}
        <div className="lg:col-span-5 flex flex-col items-center justify-center p-4 border border-slate-100 rounded-xl bg-slate-50/50 relative overflow-hidden">
          <div className="w-full space-y-3 relative z-10">
            {/* Diagram Step 1 */}
            <div className={`flex items-center space-x-3 rounded-lg border p-3 transition-all ${
              currentStep === 0 ? 'bg-white border-indigo-500 shadow-sm scale-102' : 'bg-white/60 border-slate-200 opacity-60'
            }`}>
              <div className={`flex h-8 w-8 items-center justify-center rounded bg-slate-950 text-slate-50 font-bold text-xs ${currentStep === 0 && 'animate-pulse'}`}>
                1
              </div>
              <div>
                <span className="block font-sans text-xs font-semibold text-slate-900">Main Entry Class</span>
                <span className="block font-mono text-[9px] text-slate-500">MySpringBootApp.main()</span>
              </div>
            </div>

            {/* Diagram Step 2 */}
            <div className={`flex items-center space-x-3 rounded-lg border p-3 transition-all ${
              currentStep === 1 ? 'bg-white border-indigo-500 shadow-sm scale-102' : 'bg-white/60 border-slate-200 opacity-60'
            }`}>
              <div className="flex h-8 w-8 items-center justify-center rounded bg-indigo-50 text-indigo-600">
                <FileCode2 className="h-4 w-4" />
              </div>
              <div>
                <span className="block font-sans text-xs font-semibold text-slate-900">17 Property Sources Loaded</span>
                <span className="block font-mono text-[9px] text-slate-500">application.properties, Env vars...</span>
              </div>
            </div>

            {/* Diagram Step 3 */}
            <div className={`flex items-center space-x-3 rounded-lg border p-3 transition-all ${
              currentStep === 2 ? 'bg-white border-indigo-500 shadow-sm scale-102' : 'bg-white/60 border-slate-200 opacity-60'
            }`}>
              <div className="flex h-8 w-8 items-center justify-center rounded bg-indigo-100 text-indigo-700">
                <Database className="h-4 w-4" />
              </div>
              <div>
                <span className="block font-sans text-xs font-semibold text-slate-900">spring.factories Scanned</span>
                <span className="block font-mono text-[9px] text-slate-500">120+ AutoConfigurations Indexed</span>
              </div>
            </div>

            {/* Diagram Step 4 */}
            <div className={`flex items-center space-x-3 rounded-lg border p-3 transition-all ${
              currentStep === 3 ? 'bg-white border-indigo-500 shadow-sm scale-102' : 'bg-white/60 border-slate-200 opacity-60'
            }`}>
              <div className="flex h-8 w-8 items-center justify-center rounded bg-indigo-200 text-indigo-800">
                <ShieldCheck className="h-4 w-4" />
              </div>
              <div>
                <span className="block font-sans text-xs font-semibold text-slate-900">Conditional Checks</span>
                <span className="block font-mono text-[9px] text-slate-500">Matches @Conditional conditions</span>
              </div>
            </div>

            {/* Diagram Step 5 */}
            <div className={`flex items-center space-x-3 rounded-lg border p-3 transition-all ${
              currentStep === 4 ? 'bg-white border-indigo-500 shadow-sm scale-102' : 'bg-white/60 border-slate-200 opacity-60'
            }`}>
              <div className="flex h-8 w-8 items-center justify-center rounded bg-indigo-600 text-white animate-pulse">
                <Server className="h-4 w-4" />
              </div>
              <div>
                <span className="block font-sans text-xs font-semibold text-slate-900">Active Beans & Tomcat Live</span>
                <span className="block font-mono text-[9px] text-slate-500">Tomcat running on port 3000!</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
