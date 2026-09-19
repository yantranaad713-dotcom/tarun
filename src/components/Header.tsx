import React, { useState } from 'react';
import { Sparkles, Volume2, VolumeX, ShieldCheck, Layers, Settings, Compass } from 'lucide-react';
import { soundEngine } from '../utils/soundEngine';

interface HeaderProps {
  currentView: 'home' | 'assessment' | 'explore' | 'compare' | 'admin';
  onNavigate: (view: 'home' | 'assessment' | 'explore' | 'compare' | 'admin') => void;
  compareCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  currentView,
  onNavigate,
  compareCount
}) => {
  const [isMuted, setIsMuted] = useState(soundEngine.getMuted());
  const [bowlStruck, setBowlStruck] = useState(false);

  const handleToggleSound = () => {
    const muted = soundEngine.toggleMute();
    setIsMuted(muted);
    if (!muted) {
      soundEngine.playSingingBowl(216, 4.0);
      setBowlStruck(true);
      setTimeout(() => setBowlStruck(false), 1500);
    }
  };

  const handleStrikeBowl = () => {
    soundEngine.playSingingBowl(216, 5.0);
    setBowlStruck(true);
    setTimeout(() => setBowlStruck(false), 2000);
  };

  return (
    <header className="sticky top-0 z-40 bg-[#FBF9F5]/90 backdrop-blur-md border-b border-[#E8E1D5] transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Brand identity */}
        <button
          onClick={() => onNavigate('home')}
          className="flex items-center gap-3 text-left group focus:outline-none"
          id="brand-header-logo-btn"
        >
          <div className="relative w-11 h-11 rounded-full bg-[#F3EDE2] border border-[#D9CABA] flex items-center justify-center text-[#8C6D3B] shadow-xs group-hover:border-[#B38E5D] transition-colors">
            {/* Sacred geometry sound ripple */}
            <div className={`absolute inset-0 rounded-full border border-[#B38E5D]/30 ${bowlStruck ? 'animate-ping' : ''}`} />
            <svg
              viewBox="0 0 24 24"
              className="w-6 h-6 stroke-[#8C6D3B] fill-none stroke-[1.5]"
              aria-hidden="true"
            >
              <circle cx="12" cy="12" r="9" />
              <circle cx="12" cy="12" r="5" />
              <circle cx="12" cy="12" r="2" />
              <path d="M12 3v18M3 12h18" strokeDasharray="1 3" />
            </svg>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl font-serif-heading font-semibold tracking-wider text-[#1A1815] uppercase">
                Yantra Naad
              </span>
              <span className="text-[10px] tracking-widest uppercase px-2 py-0.5 rounded-full bg-[#EFE7D8] text-[#7A5C28] font-medium">
                NaadPath
              </span>
            </div>
            <p className="text-xs text-[#7A7369] font-light tracking-wide">
              Sound Vibrational Healing & Wellness
            </p>
          </div>
        </button>

        {/* Navigation links & actions */}
        <nav className="flex items-center gap-1 sm:gap-3">
          <button
            onClick={() => onNavigate('assessment')}
            id="nav-naadpath-btn"
            className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors flex items-center gap-1.5 ${
              currentView === 'assessment'
                ? 'bg-[#24211D] text-[#FBF9F5]'
                : 'text-[#4A453E] hover:text-[#1A1815] hover:bg-[#F0EAE1]'
            }`}
          >
            <Sparkles className="w-4 h-4 text-[#C9A96E]" />
            <span className="hidden sm:inline">NaadPath Guide</span>
            <span className="sm:hidden">Guide</span>
          </button>

          <button
            onClick={() => onNavigate('explore')}
            id="nav-explore-btn"
            className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors flex items-center gap-1.5 ${
              currentView === 'explore'
                ? 'bg-[#24211D] text-[#FBF9F5]'
                : 'text-[#4A453E] hover:text-[#1A1815] hover:bg-[#F0EAE1]'
            }`}
          >
            <Compass className="w-4 h-4" />
            <span className="hidden sm:inline">All Experiences</span>
            <span className="sm:hidden">Sessions</span>
          </button>

          <button
            onClick={() => onNavigate('compare')}
            id="nav-compare-btn"
            className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors flex items-center gap-1.5 ${
              currentView === 'compare'
                ? 'bg-[#24211D] text-[#FBF9F5]'
                : 'text-[#4A453E] hover:text-[#1A1815] hover:bg-[#F0EAE1]'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>Compare</span>
            {compareCount > 0 && (
              <span className="w-5 h-5 rounded-full bg-[#B38E5D] text-white text-xs flex items-center justify-center font-bold">
                {compareCount}
              </span>
            )}
          </button>

          {/* Sound Bowl Strike Ambient Action */}
          <button
            onClick={handleStrikeBowl}
            id="header-strike-bowl-btn"
            title="Strike Himalayan Singing Bowl (Harmonic 216Hz Resonance)"
            className="hidden md:flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-full bg-[#EFE7D8] text-[#6E552C] hover:bg-[#E5DAC6] transition-colors border border-[#D8C7B0]"
          >
            <span className="text-sm">🔔</span>
            <span>Singing Bowl</span>
          </button>

          {/* Mute/Sound toggle */}
          <button
            onClick={handleToggleSound}
            id="header-sound-toggle-btn"
            title={isMuted ? 'Unmute Sound Experience' : 'Mute Sound'}
            aria-label={isMuted ? 'Unmute Sound' : 'Mute Sound'}
            className="p-2 rounded-lg text-[#6E675D] hover:text-[#1A1815] hover:bg-[#F0EAE1] transition-colors"
          >
            {isMuted ? (
              <VolumeX className="w-5 h-5 text-[#9A9388]" />
            ) : (
              <Volume2 className="w-5 h-5 text-[#8C6D3B]" />
            )}
          </button>

          {/* Admin portal */}
          <button
            onClick={() => onNavigate('admin')}
            id="nav-admin-btn"
            title="Yantra Naad Session Management Portal"
            className={`p-2 rounded-lg transition-colors ${
              currentView === 'admin'
                ? 'bg-[#24211D] text-[#FBF9F5]'
                : 'text-[#8A8378] hover:text-[#1A1815] hover:bg-[#F0EAE1]'
            }`}
          >
            <Settings className="w-5 h-5" />
          </button>
        </nav>
      </div>
    </header>
  );
};
