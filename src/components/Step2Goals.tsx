import React from 'react';
import {
  Feather,
  Wind,
  RotateCcw,
  Heart,
  Eye,
  Anchor,
  Moon,
  Sparkles,
  Zap,
  Compass,
  Sun,
  ArrowRight,
  ArrowLeft,
  Check
} from 'lucide-react';
import { GOAL_OPTIONS } from '../data/sessionsData';
import { soundEngine } from '../utils/soundEngine';

interface Step2GoalsProps {
  selectedGoals: string[];
  onChange: (goals: string[]) => void;
  onNext: () => void;
  onBack: () => void;
}

export const Step2Goals: React.FC<Step2GoalsProps> = ({
  selectedGoals,
  onChange,
  onNext,
  onBack
}) => {
  const getGoalIcon = (iconName: string) => {
    const props = { className: 'w-5 h-5 text-[#8C6D3B]' };
    switch (iconName) {
      case 'Feather':
        return <Feather {...props} />;
      case 'Wind':
        return <Wind {...props} />;
      case 'RotateCcw':
        return <RotateCcw {...props} />;
      case 'Heart':
        return <Heart {...props} />;
      case 'Eye':
        return <Eye {...props} />;
      case 'Anchor':
        return <Anchor {...props} />;
      case 'Moon':
        return <Moon {...props} />;
      case 'Sparkle':
        return <Sparkles {...props} />;
      case 'Zap':
        return <Zap {...props} />;
      case 'Compass':
        return <Compass {...props} />;
      case 'Sun':
      default:
        return <Sun {...props} />;
    }
  };

  const toggleGoal = (id: string) => {
    soundEngine.playChime(580);
    if (selectedGoals.includes(id)) {
      onChange(selectedGoals.filter((g) => g !== id));
    } else {
      // Allow up to 3 goals for fine-grained alignment
      if (selectedGoals.length < 3) {
        onChange([...selectedGoals, id]);
      } else {
        // Replace oldest or shift
        onChange([...selectedGoals.slice(1), id]);
      }
    }
  };

  return (
    <section className="w-full max-w-4xl mx-auto px-4 py-4" aria-labelledby="step2-title">
      <div className="text-center mb-8">
        <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-[#EFE7D8] text-[#785C2E] uppercase tracking-wider mb-2">
          Step 2 • Personal Goal
        </span>
        <h2 id="step2-title" className="text-3xl sm:text-4xl font-serif-heading font-medium text-[#1A1815] mb-3">
          What would you most like to experience?
        </h2>
        <p className="text-sm sm:text-base text-[#6E675D] max-w-xl mx-auto leading-relaxed">
          Choose your desired outcome. This directs the acoustic frequencies and guidance format of your session.
        </p>
      </div>

      <div className="flex items-center justify-between mb-6 px-1">
        <span className="text-xs uppercase tracking-wider font-semibold text-[#8C857B]">
          Selected Aspirations ({selectedGoals.length}/3)
        </span>
        <span className="text-xs text-[#8C6D3B]">
          Select 1 to 3 intentions
        </span>
      </div>

      {/* Goal Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
        {GOAL_OPTIONS.map((goal) => {
          const isSelected = selectedGoals.includes(goal.id);
          const selectionIndex = selectedGoals.indexOf(goal.id);

          return (
            <button
              key={goal.id}
              type="button"
              id={`goal-btn-${goal.id}`}
              onClick={() => toggleGoal(goal.id)}
              className={`text-left p-4 rounded-2xl border transition-all duration-200 relative flex flex-col justify-between cursor-pointer ${
                isSelected
                  ? 'bg-[#F9F5EE] border-[#B38E5D] ring-1 ring-[#B38E5D] shadow-xs'
                  : 'bg-[#FFFFFF] border-[#E8E1D5] hover:border-[#D1C2AD] hover:bg-[#FAF7F2]'
              }`}
              aria-pressed={isSelected}
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="w-10 h-10 rounded-xl bg-[#F6F1E8] border border-[#E3D7C5] flex items-center justify-center">
                    {getGoalIcon(goal.iconName)}
                  </div>
                  {isSelected && (
                    <span className="w-6 h-6 rounded-full bg-[#8C6D3B] text-white text-xs flex items-center justify-center font-bold">
                      {selectionIndex === 0 ? '★' : selectionIndex + 1}
                    </span>
                  )}
                </div>

                <h3 className="text-base font-semibold text-[#1A1815] mb-1">
                  {goal.label}
                </h3>
                <p className="text-xs text-[#70695E] leading-relaxed">
                  {goal.description}
                </p>
              </div>

              {isSelected && (
                <div className="mt-3 pt-2 border-t border-[#E8DFC0] flex items-center gap-1.5 text-[11px] font-medium text-[#785C2E]">
                  <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                  <span>{selectionIndex === 0 ? 'Primary Intention' : 'Supporting Intention'}</span>
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Navigation Footer */}
      <div className="mt-10 flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-[#E8E1D5]">
        <button
          type="button"
          onClick={onBack}
          className="w-full sm:w-auto px-6 py-2.5 rounded-xl border border-[#D9CABA] text-xs sm:text-sm font-medium text-[#4A453E] hover:bg-[#F3EDE2] transition-colors flex items-center justify-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Needs</span>
        </button>

        <button
          type="button"
          id="step2-continue-btn"
          disabled={selectedGoals.length === 0}
          onClick={onNext}
          className={`w-full sm:w-auto px-7 py-3 rounded-xl font-medium text-sm transition-all flex items-center justify-center gap-2 ${
            selectedGoals.length > 0
              ? 'bg-[#24211D] text-white hover:bg-[#38332D] shadow-xs cursor-pointer'
              : 'bg-[#E5DDCF] text-[#9A9184] cursor-not-allowed'
          }`}
        >
          <span>Continue to Wellness Check</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </section>
  );
};
