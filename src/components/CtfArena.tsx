import React, { useState } from 'react';
import { 
  Trophy, 
  Flag, 
  HelpCircle, 
  CheckCircle2, 
  AlertCircle, 
  Flame, 
  ShieldCheck, 
  ChevronDown, 
  ChevronUp,
  Sparkles,
  Award
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { ctfChallengesData } from '../data/ctfChallengesData';
import { CTFChallenge } from '../types';

export const CtfArena: React.FC = () => {
  const [solvedIds, setSolvedIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('yyyh_ctf_solved');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [inputFlags, setInputFlags] = useState<{ [id: string]: string }>({});
  const [openHints, setOpenHints] = useState<{ [id: string]: boolean }>({});
  const [feedback, setFeedback] = useState<{ [id: string]: { success: boolean; message: string } | null }>({});

  const totalPoints = solvedIds.reduce((acc, id) => {
    const chal = ctfChallengesData.find(c => c.id === id);
    return acc + (chal?.points || 0);
  }, 0);

  const maxPoints = ctfChallengesData.reduce((acc, c) => acc + c.points, 0);

  const handleFlagSubmit = (challenge: CTFChallenge, e: React.FormEvent) => {
    e.preventDefault();
    const entered = (inputFlags[challenge.id] || '').trim();
    if (!entered) return;

    if (entered === challenge.flag || entered.toLowerCase() === challenge.flag.toLowerCase()) {
      if (!solvedIds.includes(challenge.id)) {
        const updated = [...solvedIds, challenge.id];
        setSolvedIds(updated);
        localStorage.setItem('yyyh_ctf_solved', JSON.stringify(updated));

        // Trigger celebratory confetti
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 }
        });
      }

      setFeedback(prev => ({
        ...prev,
        [challenge.id]: { success: true, message: `[+] Correct! +${challenge.points} Points earned.` }
      }));
    } else {
      setFeedback(prev => ({
        ...prev,
        [challenge.id]: { success: false, message: '[-] Incorrect flag. Try again or check the hints.' }
      }));
    }
  };

  return (
    <section id="ctf-arena-view" className="space-y-6">
      {/* Masthead */}
      <div className="bg-[#090d16] border border-purple-900/40 rounded-2xl p-6 sm:p-8 shadow-sm relative">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-purple-500/20 text-purple-300 border border-purple-500/40 flex items-center gap-1.5">
                <Trophy className="w-3.5 h-3.5 text-purple-400" />
                CAPTURE THE FLAG ARENA
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-mono">
              Test Your <span className="text-purple-400">Cyber Knowledge</span>
            </h1>
            <p className="text-sm text-slate-300 mt-1 max-w-xl">
              Solve hands-on security puzzles in cryptography, web exploitation, network analysis, and Linux privileges.
            </p>
          </div>

          {/* Scoreboard Card */}
          <div className="bg-[#050811] border border-purple-800/60 p-4 rounded-xl font-mono text-center shrink-0 w-full sm:w-56 shadow-lg">
            <span className="text-xs text-slate-400 block mb-1">Your Total Score:</span>
            <span className="text-2xl sm:text-3xl font-black text-purple-400">
              {totalPoints} <span className="text-xs text-slate-500 font-normal">/ {maxPoints} PTS</span>
            </span>
            <div className="w-full bg-slate-800 h-2 rounded-full mt-2 overflow-hidden">
              <div 
                className="bg-gradient-to-r from-purple-500 to-emerald-400 h-full transition-all duration-500"
                style={{ width: `${(totalPoints / maxPoints) * 100}%` }}
              />
            </div>
            <span className="text-[10px] text-slate-400 block mt-1">
              {solvedIds.length} of {ctfChallengesData.length} Challenges Solved
            </span>
          </div>
        </div>
      </div>

      {/* Challenges List */}
      <div className="grid grid-cols-1 gap-6">
        {ctfChallengesData.map((challenge, idx) => {
          const isSolved = solvedIds.includes(challenge.id);
          const hasFeedback = feedback[challenge.id];
          const isHintOpen = openHints[challenge.id];

          return (
            <div 
              key={challenge.id}
              className={`bg-[#090d16] border rounded-2xl p-6 shadow-xl transition-all ${
                isSolved 
                  ? 'border-emerald-800/60 bg-emerald-950/10' 
                  : 'border-slate-800 hover:border-purple-800/60'
              }`}
            >
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800/80 pb-4 mb-4">
                <div className="flex items-center gap-3">
                  <span className="w-8 h-8 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center font-mono font-bold text-sm text-purple-400">
                    0{idx + 1}
                  </span>
                  <div>
                    <h3 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                      {challenge.title}
                      {isSolved && (
                        <span className="flex items-center gap-1 text-xs font-mono font-bold text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-800">
                          <CheckCircle2 className="w-3 h-3" />
                          SOLVED
                        </span>
                      )}
                    </h3>
                    <div className="flex items-center gap-2 text-xs font-mono text-slate-400 mt-0.5">
                      <span className="text-purple-400">{challenge.category}</span>
                      <span>•</span>
                      <span className={
                        challenge.difficulty === 'Easy' ? 'text-emerald-400' :
                        challenge.difficulty === 'Medium' ? 'text-amber-400' : 'text-red-400'
                      }>
                        {challenge.difficulty}
                      </span>
                    </div>
                  </div>
                </div>

                <span className="text-sm font-mono font-bold text-purple-300 bg-purple-950/50 px-3 py-1 rounded-lg border border-purple-900/40">
                  +{challenge.points} PTS
                </span>
              </div>

              {/* Challenge Body */}
              <div className="space-y-4">
                <p className="text-sm text-slate-300 font-sans leading-relaxed">
                  {challenge.description}
                </p>

                <div className="bg-[#050811] p-4 rounded-xl border border-slate-800/80 font-mono text-xs text-slate-200">
                  <p className="text-slate-400 text-[11px] uppercase font-bold mb-1">Scenario / Evidence:</p>
                  <p className="text-emerald-300 select-all">{challenge.scenario}</p>
                </div>

                <p className="text-xs text-slate-400 font-mono">
                  <strong className="text-slate-300">Target Objective:</strong> {challenge.clue}
                </p>

                {/* Collapsible Hints */}
                <div className="pt-1">
                  <button
                    onClick={() => setOpenHints(prev => ({ ...prev, [challenge.id]: !prev[challenge.id] }))}
                    className="flex items-center gap-1.5 text-xs font-mono text-slate-400 hover:text-amber-400 transition-colors"
                  >
                    <HelpCircle className="w-3.5 h-3.5" />
                    <span>{isHintOpen ? 'Hide Hints' : 'View Hints (0 Penalty)'}</span>
                    {isHintOpen ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                  </button>

                  {isHintOpen && (
                    <div className="mt-2 p-3 bg-slate-900/70 border border-slate-800 rounded-lg text-xs font-mono text-amber-300/90 space-y-1">
                      {challenge.hints.map((hint, hIdx) => (
                        <p key={hIdx}>💡 Hint {hIdx + 1}: {hint}</p>
                      ))}
                    </div>
                  )}
                </div>

                {/* Flag Submission Form */}
                <form onSubmit={(e) => handleFlagSubmit(challenge, e)} className="space-y-2 pt-2">
                  <div className="flex flex-col sm:flex-row gap-2">
                    <div className="relative flex-1">
                      <Flag className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        placeholder="Enter flag e.g. YYYH{...}"
                        value={inputFlags[challenge.id] || ''}
                        onChange={(e) => setInputFlags(prev => ({ ...prev, [challenge.id]: e.target.value }))}
                        className="w-full pl-9 pr-3 py-2 bg-[#050811] border border-slate-700 rounded-lg text-xs font-mono text-slate-200 placeholder-slate-600 focus:outline-none focus:border-purple-500"
                      />
                    </div>

                    <button
                      type="submit"
                      className="px-5 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-lg text-xs font-mono font-bold transition-all shadow-[0_0_10px_rgba(168,85,247,0.3)] shrink-0"
                    >
                      Submit Flag
                    </button>
                  </div>

                  {hasFeedback && (
                    <div className={`p-3 rounded-lg border text-xs font-mono flex items-center gap-2 ${
                      hasFeedback.success 
                        ? 'bg-emerald-950/40 border-emerald-800 text-emerald-400' 
                        : 'bg-red-950/40 border-red-800 text-red-400'
                    }`}>
                      {hasFeedback.success ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
                      <span>{hasFeedback.message}</span>
                    </div>
                  )}
                </form>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
