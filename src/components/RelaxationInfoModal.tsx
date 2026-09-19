import React from 'react';
import { X, BookOpen, Heart, Waves, Moon, Sun, Wind } from 'lucide-react';
import { soundEngine } from '../utils/soundEngine';

interface RelaxationInfoModalProps {
  onClose: () => void;
  onTalkToPractitioner: () => void;
}

export const RelaxationInfoModal: React.FC<RelaxationInfoModalProps> = ({
  onClose,
  onTalkToPractitioner
}) => {
  const handleStrike = () => {
    soundEngine.playSingingBowl(216, 5.0);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in"
      role="dialog"
      aria-modal="true"
      aria-labelledby="relaxation-info-title"
    >
      <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-[#E8E1D5] relative p-6 sm:p-8">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full text-[#7A7369] hover:text-[#1A1815] hover:bg-[#F3EDE2] transition-colors"
          aria-label="Close relaxation information"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-[#F6F1E8] border border-[#E3D7C5] flex items-center justify-center text-[#8C6D3B]">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] uppercase tracking-wider font-semibold text-[#8C6D3B]">
              Yantra Naad Wellness Knowledge
            </span>
            <h2 id="relaxation-info-title" className="text-xl sm:text-2xl font-serif-heading font-semibold text-[#1A1815]">
              Foundations of Sound & Gentle Relaxation
            </h2>
          </div>
        </div>

        <p className="text-xs sm:text-sm text-[#615A50] leading-relaxed mb-6">
          Sound vibrational healing is an ancient restorative practice that utilizes harmonious, acoustic frequencies to support the body’s natural relaxation response. It works alongside your lifestyle to nurture calm and mental stillness.
        </p>

        {/* Informational Cards */}
        <div className="space-y-3.5 mb-6">
          <div className="p-4 rounded-2xl bg-[#FAF7F2] border border-[#EFE7D8]">
            <div className="flex items-center gap-2 mb-1.5 text-xs font-semibold text-[#1A1815]">
              <Waves className="w-4 h-4 text-[#8C6D3B]" />
              <span>How Acoustic Vibration Supports Stillness</span>
            </div>
            <p className="text-xs text-[#6B6358] leading-relaxed">
              When listening to pure tones from handcrafted Himalayan singing bowls, the auditory cortex responds to steady rhythmic resonance. This can help quiet the autonomic nervous system’s sympathetic (fight-or-flight) responses and encourage alpha-wave relaxation.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-[#FAF7F2] border border-[#EFE7D8]">
            <div className="flex items-center gap-2 mb-1.5 text-xs font-semibold text-[#1A1815]">
              <Wind className="w-4 h-4 text-[#8C6D3B]" />
              <span>Breath & Sound Alignment</span>
            </div>
            <p className="text-xs text-[#6B6358] leading-relaxed">
              Pairing slow diaphragmatic breathing with low-frequency acoustic bowls signals safety to your nervous system. Inhale naturally, exhale slowly, and allow the fading harmonic ring of the bowl to ground your attention.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-[#FAF7F2] border border-[#EFE7D8]">
            <div className="flex items-center gap-2 mb-1.5 text-xs font-semibold text-[#1A1815]">
              <Moon className="w-4 h-4 text-[#8C6D3B]" />
              <span>Evening Unwinding Without Pressure</span>
            </div>
            <p className="text-xs text-[#6B6358] leading-relaxed">
              If sleep feels restless, reduce harsh artificial light 45 minutes before bedtime. Listening to soft resonant chimes or lying flat with a bolster beneath the knees allows the spine and neck muscles to release accumulated postural stress.
            </p>
          </div>
        </div>

        {/* Sound Test */}
        <div className="p-4 rounded-2xl bg-[#F6F1E8] border border-[#E3D7C5] flex items-center justify-between mb-6">
          <div>
            <span className="text-xs font-semibold text-[#1A1815] block">
              Experience a Moment of Stillness
            </span>
            <span className="text-[11px] text-[#7A7369]">
              Tap to strike a 216Hz grounding singing bowl tone
            </span>
          </div>
          <button
            onClick={handleStrike}
            className="px-3.5 py-1.5 rounded-full bg-[#8C6D3B] text-white text-xs font-medium hover:bg-[#785C2E] transition-colors"
          >
            🔔 Listen Now
          </button>
        </div>

        {/* Footer CTAs */}
        <div className="pt-4 border-t border-[#E8E1D5] flex flex-col sm:flex-row gap-3">
          <button
            type="button"
            onClick={() => {
              onClose();
              onTalkToPractitioner();
            }}
            className="flex-1 py-2.5 px-4 rounded-xl bg-[#24211D] text-white text-xs font-semibold hover:bg-[#38332D] transition-colors"
          >
            Speak With a Yantra Naad Practitioner
          </button>

          <button
            type="button"
            onClick={onClose}
            className="py-2.5 px-5 rounded-xl border border-[#D9CABA] text-xs font-medium text-[#4A453E] hover:bg-[#F3EDE2] transition-colors"
          >
            Close Guide
          </button>
        </div>
      </div>
    </div>
  );
};
