import React from 'react';
import { X, Clock, Users, Volume2, Sparkles, AlertTriangle, CheckCircle2, Calendar, PhoneCall } from 'lucide-react';
import { YantraSession } from '../types';
import { soundEngine } from '../utils/soundEngine';

interface SessionDetailModalProps {
  session: YantraSession | null;
  onClose: () => void;
  onBook: (session: YantraSession) => void;
  onTalkToPractitioner: (session: YantraSession) => void;
}

export const SessionDetailModal: React.FC<SessionDetailModalProps> = ({
  session,
  onClose,
  onBook,
  onTalkToPractitioner
}) => {
  if (!session) return null;

  const handleStrikeBowl = () => {
    soundEngine.playSingingBowl(216, 4.5);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in"
      role="dialog"
      aria-modal="true"
      aria-labelledby="session-detail-modal-title"
    >
      <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-[#E8E1D5] relative flex flex-col">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 rounded-full bg-black/40 text-white hover:bg-black/60 transition-colors"
          aria-label="Close session details"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Hero header */}
        <div className="relative h-60 sm:h-72 w-full shrink-0 bg-[#24211D]">
          <img
            src={session.image}
            alt={session.name}
            className="w-full h-full object-cover opacity-85"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#1A1815] via-[#1A1815]/30 to-transparent" />

          <div className="absolute bottom-5 left-5 right-5 text-white">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-[#EFE7D8] text-[#785C2E] uppercase tracking-wider mb-2 inline-block">
              {session.intensity} Intensity • {session.sessionType.join(' & ')}
            </span>
            <h2 id="session-detail-modal-title" className="text-2xl sm:text-3xl font-serif-heading font-semibold text-white">
              {session.name}
            </h2>
          </div>
        </div>

        {/* Modal body */}
        <div className="p-6 sm:p-8 space-y-6">
          {/* Quick specs */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3 rounded-xl bg-[#FAF7F2] border border-[#EFE7D8]">
              <span className="text-[10px] uppercase tracking-wider text-[#8A8378] block">Duration</span>
              <span className="text-xs font-semibold text-[#1A1815]">{session.duration}</span>
            </div>
            <div className="p-3 rounded-xl bg-[#FAF7F2] border border-[#EFE7D8]">
              <span className="text-[10px] uppercase tracking-wider text-[#8A8378] block">Format</span>
              <span className="text-xs font-semibold text-[#1A1815] capitalize">{session.sessionType.join(', ')}</span>
            </div>
            <div className="p-3 rounded-xl bg-[#FAF7F2] border border-[#EFE7D8]">
              <span className="text-[10px] uppercase tracking-wider text-[#8A8378] block">Intensity</span>
              <span className="text-xs font-semibold text-[#1A1815] capitalize">{session.intensity}</span>
            </div>
            <div className="p-3 rounded-xl bg-[#FAF7F2] border border-[#EFE7D8]">
              <span className="text-[10px] uppercase tracking-wider text-[#8A8378] block">Fee</span>
              <span className="text-xs font-semibold text-[#1A1815]">{session.price}</span>
            </div>
          </div>

          {/* Singing bowl strike sound tester */}
          <div className="flex items-center justify-between p-3.5 rounded-2xl bg-[#F6F1E8] border border-[#E3D7C5]">
            <div className="flex items-center gap-2.5">
              <span className="text-xl">🔔</span>
              <div>
                <span className="text-xs font-semibold text-[#1A1815] block">Acoustic Resonance Tone</span>
                <span className="text-[11px] text-[#7A7369]">Tibetan handcrafted bowl frequency sample</span>
              </div>
            </div>
            <button
              onClick={handleStrikeBowl}
              className="px-3 py-1.5 rounded-full bg-[#8C6D3B] text-white text-xs font-medium hover:bg-[#785C2E] transition-colors"
            >
              Strike Bowl
            </button>
          </div>

          {/* Descriptions */}
          <div>
            <h3 className="text-xs font-semibold text-[#8C857B] uppercase tracking-wider mb-2">About The Experience</h3>
            <p className="text-sm text-[#473F35] leading-relaxed mb-3">
              {session.fullDescription || session.shortDescription}
            </p>
          </div>

          {/* Instruments */}
          {session.instruments && session.instruments.length > 0 && (
            <div>
              <h3 className="text-xs font-semibold text-[#8C857B] uppercase tracking-wider mb-2">Acoustic Instruments</h3>
              <div className="flex flex-wrap gap-2">
                {session.instruments.map((inst, i) => (
                  <span key={i} className="px-3 py-1 rounded-full text-xs bg-[#F4EFE6] text-[#5C451D] border border-[#E2D5C0]">
                    {inst}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Who it is suitable for */}
          <div>
            <h3 className="text-xs font-semibold text-[#1A1815] uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              Who it may be suitable for
            </h3>
            <ul className="space-y-1 text-xs text-[#574E44]">
              {session.suitableFor.map((item, i) => (
                <li key={i} className="flex items-start gap-1.5">
                  <span className="text-[#8C6D3B] font-bold">•</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Precautions */}
          <div>
            <h3 className="text-xs font-semibold text-[#1A1815] uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4 text-[#A87B2E]" />
              Important Considerations & Precautions
            </h3>
            <ul className="space-y-1 text-xs text-[#574E44]">
              {session.precautions.map((item, i) => (
                <li key={i} className="flex items-start gap-1.5">
                  <span className="text-[#A87B2E] font-bold">•</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Actions */}
          <div className="pt-4 border-t border-[#E8E1D5] flex flex-col sm:flex-row gap-3">
            <button
              type="button"
              onClick={() => {
                onClose();
                onBook(session);
              }}
              className="flex-1 py-3 px-5 rounded-xl bg-[#24211D] text-white text-sm font-medium hover:bg-[#38332D] transition-colors flex items-center justify-center gap-2"
            >
              <Calendar className="w-4 h-4 text-[#D4B98B]" />
              <span>Book This Experience</span>
            </button>

            <button
              type="button"
              onClick={() => {
                onClose();
                onTalkToPractitioner(session);
              }}
              className="py-3 px-5 rounded-xl border border-[#D9CABA] text-sm font-medium text-[#4A453E] hover:bg-[#F3EDE2] transition-colors flex items-center justify-center gap-2"
            >
              <PhoneCall className="w-4 h-4 text-[#8C6D3B]" />
              <span>Ask a Practitioner</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
