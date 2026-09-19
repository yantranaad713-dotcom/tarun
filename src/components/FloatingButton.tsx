import React, { useState } from 'react';
import { Sparkles, ArrowRight, X } from 'lucide-react';
import { soundEngine } from '../utils/soundEngine';

interface FloatingButtonProps {
  onOpenAssessment: () => void;
  isVisible?: boolean;
}

export const FloatingButton: React.FC<FloatingButtonProps> = ({
  onOpenAssessment,
  isVisible = true
}) => {
  const [isDismissed, setIsDismissed] = useState(false);

  if (!isVisible || isDismissed) return null;

  const handleClick = () => {
    soundEngine.playChime(580);
    onOpenAssessment();
  };

  return (
    <aside
      aria-label="NaadPath Guide Assistant"
      className="fixed bottom-6 right-4 sm:right-6 z-40 max-w-sm animate-in slide-in-from-bottom duration-300"
    >
      <div className="bg-[#24211D] text-white rounded-2xl p-3.5 sm:p-4 shadow-xl border border-[#D4B98B]/30 flex items-center gap-3 relative group">
        {/* Dismiss button */}
        <button
          type="button"
          onClick={() => setIsDismissed(true)}
          className="absolute -top-2 -left-2 w-5 h-5 rounded-full bg-[#3D372F] text-[#A69E92] hover:text-white flex items-center justify-center text-xs transition-colors"
          title="Dismiss banner"
          aria-label="Dismiss banner"
        >
          <X className="w-3 h-3" />
        </button>

        {/* Singing bowl pulse indicator */}
        <div className="w-9 h-9 rounded-xl bg-[#38332D] border border-[#B38E5D]/50 flex items-center justify-center shrink-0 text-[#D4B98B]">
          <Sparkles className="w-4 h-4 animate-pulse" />
        </div>

        {/* Content & Action */}
        <div className="flex-1 min-w-0 pr-1">
          <p className="text-xs text-[#E5DCD0] font-normal leading-snug">
            Not sure which session is for you?
          </p>
          <button
            type="button"
            id="floating-naadpath-btn"
            onClick={handleClick}
            className="text-xs font-semibold text-[#D4B98B] hover:text-white flex items-center gap-1 mt-0.5 transition-colors cursor-pointer"
          >
            <span>Find Your NaadPath</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>
      </div>
    </aside>
  );
};
