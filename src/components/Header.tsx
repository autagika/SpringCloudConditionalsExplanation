import { BookOpen, Play, CheckCircle2, Award, ExternalLink } from 'lucide-react';

interface HeaderProps {
  readingProgress: number;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  quizScore: number | null;
}

export default function Header({ readingProgress, activeTab, setActiveTab, quizScore }: HeaderProps) {
  return (
    <header id="app-header" className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Branding & Logo */}
        <div className="flex items-center space-x-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-600 text-white shadow-sm shadow-indigo-600/20">
            <svg className="h-5 w-5 fill-current" viewBox="0 0 24 24">
              <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
            </svg>
          </div>
          <div>
            <span className="font-sans font-bold text-slate-900 tracking-tight sm:text-base text-sm">
              Spring Boot Deep-Dive
            </span>
            <span className="hidden sm:inline-block ml-2 rounded-full bg-indigo-100 px-2 py-0.5 text-xs font-medium text-indigo-800">
              Interactive Guide
            </span>
          </div>
        </div>

        {/* Tab Controls for Responsive Views */}
        <div className="flex items-center space-x-1 sm:space-x-2">
          <button
            id="tab-article"
            onClick={() => setActiveTab('article')}
            className={`flex items-center space-x-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-all sm:text-sm ${
              activeTab === 'article'
                ? 'bg-slate-100 text-slate-900'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            <BookOpen className="h-4 w-4" />
            <span>Article</span>
          </button>
          <button
            id="tab-sandbox"
            onClick={() => setActiveTab('sandbox')}
            className={`flex items-center space-x-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-all sm:text-sm ${
              activeTab === 'sandbox'
                ? 'bg-slate-100 text-slate-900'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            <Play className="h-4 w-4 text-indigo-600" />
            <span>Sandbox & Visuals</span>
          </button>
          <button
            id="tab-quiz"
            onClick={() => setActiveTab('quiz')}
            className={`flex items-center space-x-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-all sm:text-sm ${
              activeTab === 'quiz'
                ? 'bg-slate-100 text-slate-900'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            {quizScore !== null ? (
              <Award className="h-4 w-4 text-amber-500 animate-pulse" />
            ) : (
              <CheckCircle2 className="h-4 w-4" />
            )}
            <span>Quiz {quizScore !== null && `(${quizScore}/5)`}</span>
          </button>
        </div>

        {/* External Link/Author Bio */}
        <div className="hidden md:flex items-center space-x-4">
          <a
            href="https://www.marcobehler.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center space-x-1 text-xs text-slate-500 hover:text-slate-900 transition-colors"
          >
            <span>Original by Marco Behler</span>
            <ExternalLink className="h-3.5 w-3.5" />
          </a>
        </div>
      </div>

      {/* Reading Progress Bar */}
      <div className="h-1 w-full bg-slate-100">
        <div
          className="h-full bg-indigo-600 transition-all duration-300 ease-out"
          style={{ width: `${readingProgress}%` }}
        />
      </div>
    </header>
  );
}
