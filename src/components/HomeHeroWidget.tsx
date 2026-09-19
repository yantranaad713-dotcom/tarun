import React, { useState } from 'react';
import { Sparkles, ArrowRight, Compass, ShieldCheck, Volume2 } from 'lucide-react';
import { SoundWaveAnimation } from './SoundWaveAnimation';
import { soundEngine } from '../utils/soundEngine';

interface HomeHeroWidgetProps {
  onStartAssessment: (preselectedChip?: string) => void;
  onExploreAll: () => void;
}

export const HomeHeroWidget: React.FC<HomeHeroWidgetProps> = ({
  onStartAssessment,
  onExploreAll
}) => {
  const [activeChip, setActiveChip] = useState<string | null>(null);

  const chips = [
    { label: 'Stress', id: 'stress', icon: '🍃' },
    { label: 'Sleep', id: 'restless-sleep', icon: '🌙' },
    { label: 'Relaxation', id: 'difficulty-relaxing', icon: '✨' },
    { label: 'Emotional Balance', id: 'emotional-balance', icon: '🤍' },
    { label: 'Physical Relaxation', id: 'muscle-tension', icon: '🌿' },
    { label: 'Meditation', id: 'meditation-support', icon: '🪷' },
    { label: 'Mental Reset', id: 'need-for-mental-reset', icon: '🌊' },
    { label: 'Grounding', id: 'need-for-grounding', icon: '🪨' }
  ];

  const handleChipClick = (chip: typeof chips[0]) => {
    setActiveChip(chip.id);
    soundEngine.playChime(580);
    setTimeout(() => {
      onStartAssessment(chip.id);
    }, 280);
  };

  const handleStrike = () => {
    soundEngine.playSingingBowl(216, 5.0);
  };

  return (
    <section className="w-full max-w-5xl mx-auto px-4 pt-8 pb-16 text-center">
      {/* Brand Sub-Badge */}
      <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#EFE7D8] text-[#7A5C28] text-xs font-semibold uppercase tracking-widest mb-6 border border-[#E0D3C1]">
        <Sparkles className="w-3.5 h-3.5 text-[#B38E5D]" />
        <span>Yantra Naad • Acoustic Wellness Science</span>
      </div>

      {/* Main Header */}
      <h1 className="text-4xl sm:text-6xl font-serif-heading font-medium text-[#1A1815] tracking-tight mb-4 max-w-3xl mx-auto leading-tight">
        NaadPath
      </h1>
      <p className="text-xl sm:text-2xl font-serif-heading text-[#755D37] italic mb-6">
        Your Personalized Sound Wellness Guide
      </p>

      {/* Supporting Text */}
      <p className="text-base sm:text-lg text-[#5A5348] max-w-2xl mx-auto leading-relaxed mb-8">
        Tell us how you are feeling and discover a Yantra Naad experience aligned with your wellness needs.
      </p>

      {/* Primary and Secondary CTAs */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-14">
        <button
          type="button"
          id="hero-find-session-cta"
          onClick={() => onStartAssessment()}
          className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-[#24211D] text-white text-base font-semibold hover:bg-[#38332D] transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2.5 cursor-pointer group"
        >
          <Sparkles className="w-5 h-5 text-[#D4B98B] group-hover:rotate-12 transition-transform" />
          <span>Find My Session</span>
          <ArrowRight className="w-4 h-4 text-white/80 group-hover:translate-x-1 transition-transform" />
        </button>

        <button
          type="button"
          id="hero-explore-experiences-cta"
          onClick={onExploreAll}
          className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-white border border-[#D9CABA] text-[#24211D] text-base font-medium hover:bg-[#F3EDE2] transition-colors flex items-center justify-center gap-2"
        >
          <Compass className="w-5 h-5 text-[#8C6D3B]" />
          <span>Explore All Experiences</span>
        </button>
      </div>

      {/* Acoustic Sound Wave Visualizer Banner */}
      <div className="mb-14 py-4 px-6 rounded-3xl bg-white/70 backdrop-blur-sm border border-[#E8E1D5] max-w-xl mx-auto flex items-center justify-between shadow-xs">
        <div className="text-left">
          <span className="text-[10px] uppercase tracking-wider text-[#8A8378] font-bold block">
            Harmonic 432Hz Resonance
          </span>
          <span className="text-xs text-[#574F44]">
            Calibrated acoustic waves for somatic ease
          </span>
        </div>
        <SoundWaveAnimation intensity="moderate" />
        <button
          onClick={handleStrike}
          title="Strike singing bowl"
          className="px-3 py-1.5 rounded-full bg-[#FAF7F2] text-[#8C6D3B] text-xs font-semibold hover:bg-[#EFE7D8] border border-[#E3D7C5] transition-colors"
        >
          🔔 Strike
        </button>
      </div>

      {/* WIDGET 2: Homepage Assessment Widget ("How are you feeling today?") */}
      <div className="bg-white rounded-3xl p-6 sm:p-10 border border-[#E8E1D5] shadow-sm max-w-3xl mx-auto text-left relative overflow-hidden">
        {/* Subtle decorative background circle */}
        <div className="absolute -right-12 -bottom-12 w-48 h-48 rounded-full bg-[#F7F1E6] opacity-60 pointer-events-none" />

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
          <div>
            <span className="text-xs uppercase tracking-widest font-bold text-[#8C6D3B] block mb-1">
              Quick Self-Check
            </span>
            <h2 className="text-2xl sm:text-3xl font-serif-heading font-semibold text-[#1A1815]">
              How are you feeling today?
            </h2>
          </div>
          <span className="text-xs text-[#7A7369]">
            Tap any wellness focus to start
          </span>
        </div>

        {/* WIDGET 3: Quick-Select Wellness Chips */}
        <div className="flex flex-wrap gap-2.5 mb-6">
          {chips.map((chip) => {
            const isActive = activeChip === chip.id;
            return (
              <button
                key={chip.id}
                type="button"
                id={`chip-${chip.id}`}
                onClick={() => handleChipClick(chip)}
                className={`px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-medium transition-all duration-200 flex items-center gap-2 cursor-pointer ${
                  isActive
                    ? 'bg-[#8C6D3B] text-white shadow-xs scale-105'
                    : 'bg-[#FAF7F2] text-[#3D372F] border border-[#E5DACB] hover:border-[#B38E5D] hover:bg-[#F3EDE2]'
                }`}
              >
                <span>{chip.icon}</span>
                <span>{chip.label}</span>
              </button>
            );
          })}
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-[#F0EAE1] text-xs text-[#7A7369]">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-[#8C6D3B]" />
            <span>Private & confidential wellness exploration</span>
          </div>
          <button
            type="button"
            onClick={() => onStartAssessment()}
            className="font-semibold text-[#1A1815] hover:text-[#8C6D3B] underline underline-offset-2 flex items-center gap-1"
          >
            <span>Full Consultation (3 mins)</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </section>
  );
};
