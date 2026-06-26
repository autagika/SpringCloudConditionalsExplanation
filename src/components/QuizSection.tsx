import { useState } from 'react';
import { quizQuestions } from '../data/articleData';
import { Award, CheckCircle2, AlertCircle, ArrowRight, RefreshCw, Sparkles, BookOpen } from 'lucide-react';

interface QuizSectionProps {
  onQuizCompleted: (score: number) => void;
}

export default function QuizSection({ onQuizCompleted }: QuizSectionProps) {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);

  const activeQuestion = quizQuestions[currentIdx];

  const handleOptionSelect = (idx: number) => {
    if (isSubmitted) return;
    setSelectedOption(idx);
  };

  const submitAnswer = () => {
    if (selectedOption === null || isSubmitted) return;
    
    setIsSubmitted(true);
    const isCorrect = selectedOption === activeQuestion.correctIndex;
    if (isCorrect) {
      setScore((prev) => prev + 1);
    }
  };

  const nextQuestion = () => {
    setSelectedOption(null);
    setIsSubmitted(false);

    if (currentIdx < quizQuestions.length - 1) {
      setCurrentIdx((prev) => prev + 1);
    } else {
      setQuizFinished(true);
      onQuizCompleted(score + (selectedOption === activeQuestion.correctIndex ? 1 : 0));
    }
  };

  const restartQuiz = () => {
    setCurrentIdx(0);
    setSelectedOption(null);
    setIsSubmitted(false);
    setScore(0);
    setQuizFinished(false);
  };

  // Custom feedback messages based on score
  const getFeedbackMessage = () => {
    const finalScore = score;
    if (finalScore === 5) {
      return {
        title: "Spring Boot Grandmaster! 🏆",
        desc: "Phenomenal job! You fully grasp Autoconfigurations, classpath conditional matchers, and how Spring Boot avoids bean duplication."
      };
    } else if (finalScore >= 3) {
      return {
        title: "Autoconfiguration Specialist 🌟",
        desc: "Great score! You understand how @Conditionals work and the role of spring.factories. Re-read the DataSource case study to get 5/5!"
      };
    } else {
      return {
        title: "Spring Boot Apprentice 📚",
        desc: "A solid attempt! Spring Boot can be tricky with its 'magic' behind the scenes. Review Chapter 2 and Chapter 4 of the article to boost your knowledge!"
      };
    }
  };

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between border-b border-slate-100 pb-4">
        <div>
          <h3 className="font-sans font-bold text-base text-slate-900">Concept Understanding Quiz</h3>
          <p className="font-sans text-xs text-slate-500">Test your mastery of Spring Boot's internal autoconfiguration mechanics.</p>
        </div>
        {!quizFinished && (
          <span className="font-mono text-xs font-bold text-slate-400">
            Q {currentIdx + 1} of {quizQuestions.length}
          </span>
        )}
      </div>

      {!quizFinished ? (
        <div className="mt-6 space-y-6">
          {/* Question Text */}
          <h4 className="font-sans text-sm font-semibold text-slate-950 leading-relaxed">
            {activeQuestion.question}
          </h4>

          {/* Options List */}
          <div className="space-y-3">
            {activeQuestion.options.map((option, idx) => {
              const isSelected = selectedOption === idx;
              let optionStyle = "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50";

              if (isSubmitted) {
                if (idx === activeQuestion.correctIndex) {
                  optionStyle = "border-emerald-500 bg-emerald-50/50 text-emerald-950 font-medium";
                } else if (isSelected) {
                  optionStyle = "border-red-500 bg-red-50/50 text-red-950";
                } else {
                  optionStyle = "border-slate-100 bg-white opacity-60";
                }
              } else if (isSelected) {
                optionStyle = "border-indigo-600 bg-indigo-50/30 ring-1 ring-indigo-600 text-indigo-900 font-medium";
              }

              return (
                <button
                  key={idx}
                  onClick={() => handleOptionSelect(idx)}
                  disabled={isSubmitted}
                  className={`flex w-full items-start space-x-3 rounded-lg border p-4 text-left text-xs transition-all cursor-pointer ${optionStyle}`}
                >
                  <span className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border text-[10px] font-semibold ${
                    isSelected 
                      ? 'bg-indigo-600 border-indigo-600 text-white' 
                      : 'border-slate-300 text-slate-500'
                  }`}>
                    {String.fromCharCode(65 + idx)}
                  </span>
                  <span>{option}</span>
                </button>
              );
            })}
          </div>

          {/* Explanation Callout */}
          {isSubmitted && (
            <div className={`rounded-xl border p-4 text-xs leading-relaxed ${
              selectedOption === activeQuestion.correctIndex
                ? 'bg-emerald-50/40 border-emerald-100 text-emerald-800'
                : 'bg-slate-50 border-slate-200/60 text-slate-700'
            }`}>
              <div className="flex items-center space-x-1.5 font-bold mb-1.5">
                {selectedOption === activeQuestion.correctIndex ? (
                  <>
                    <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                    <span className="uppercase tracking-wider text-[10px]">CORRECT ANSWER!</span>
                  </>
                ) : (
                  <>
                    <AlertCircle className="h-4 w-4 text-slate-500 shrink-0" />
                    <span className="uppercase tracking-wider text-[10px]">EXPLANATION</span>
                  </>
                )}
              </div>
              <p>{activeQuestion.explanation}</p>
            </div>
          )}

          {/* Submit / Next button action bar */}
          <div className="flex justify-end pt-2">
            {!isSubmitted ? (
              <button
                onClick={submitAnswer}
                disabled={selectedOption === null}
                className="flex items-center space-x-1.5 rounded-lg bg-indigo-600 px-5 py-2 text-xs font-bold text-white hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer shadow-sm shadow-indigo-600/10"
              >
                <span>Submit Answer</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            ) : (
              <button
                onClick={nextQuestion}
                className="flex items-center space-x-1.5 rounded-lg bg-slate-900 px-5 py-2 text-xs font-bold text-white hover:bg-slate-800 transition-colors cursor-pointer shadow-sm"
              >
                <span>
                  {currentIdx === quizQuestions.length - 1 ? "Finish Quiz" : "Next Question"}
                </span>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            )}
          </div>
        </div>
      ) : (
        /* SCORE CARD REPORT VIEW */
        <div className="mt-8 text-center max-w-md mx-auto py-4">
          <div className="relative inline-block">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-indigo-50 text-indigo-600 border border-indigo-100 mx-auto">
              <Award className="h-10 w-10 animate-pulse" />
            </div>
            <span className="absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-amber-500 text-white text-[11px] font-bold border border-white shadow">
              {score}
            </span>
          </div>

          <h4 className="mt-5 font-sans font-bold text-base text-slate-900">
            {getFeedbackMessage().title}
          </h4>
          <p className="mt-2.5 font-sans text-xs text-slate-500 leading-relaxed">
            {getFeedbackMessage().desc}
          </p>

          <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={restartQuiz}
              className="flex items-center justify-center space-x-1.5 rounded-lg border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer w-full sm:w-auto"
            >
              <RefreshCw className="h-3.5 w-3.5" />
              <span>Retry Quiz</span>
            </button>
            <button
              onClick={() => {
                const element = document.getElementById('article-container');
                if (element) {
                  element.scrollTop = 0;
                }
              }}
              className="flex items-center justify-center space-x-1.5 rounded-lg bg-indigo-600 px-4 py-2 text-xs font-bold text-white hover:bg-indigo-700 transition-colors cursor-pointer w-full sm:w-auto"
            >
              <BookOpen className="h-3.5 w-3.5" />
              <span>Re-read Chapters</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
