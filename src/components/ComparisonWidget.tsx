import React from 'react';
import { X, Layers, Clock, Users, Volume2, Sparkles, Check, AlertTriangle, Calendar } from 'lucide-react';
import { YantraSession } from '../types';

interface ComparisonWidgetProps {
  sessions: YantraSession[];
  onRemove: (sessionId: string) => void;
  onClear: () => void;
  onBook: (session: YantraSession) => void;
  onExplore: (session: YantraSession) => void;
  onExploreMore: () => void;
}

export const ComparisonWidget: React.FC<ComparisonWidgetProps> = ({
  sessions,
  onRemove,
  onClear,
  onBook,
  onExplore,
  onExploreMore
}) => {
  if (sessions.length === 0) {
    return (
      <section className="w-full max-w-4xl mx-auto px-4 py-12 text-center">
        <div className="w-16 h-16 rounded-3xl bg-[#F4EDE2] border border-[#E3D7C5] flex items-center justify-center mx-auto mb-4 text-[#8C6D3B]">
          <Layers className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-serif-heading font-semibold text-[#1A1815] mb-2">
          Compare Yantra Naad Sessions
        </h2>
        <p className="text-sm text-[#706A5F] max-w-md mx-auto mb-6">
          You have not selected any experiences to compare yet. Add up to three sessions from our catalogue or recommendation to compare duration, format, and vibrational intensity side by side.
        </p>
        <button
          type="button"
          onClick={onExploreMore}
          className="px-6 py-2.5 rounded-xl bg-[#24211D] text-white text-sm font-medium hover:bg-[#38332D] transition-colors"
        >
          Explore All Experiences
        </button>
      </section>
    );
  }

  return (
    <section className="w-full max-w-6xl mx-auto px-4 py-6" aria-labelledby="comparison-title">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div>
          <span className="text-xs uppercase tracking-wider font-semibold text-[#8C6D3B]">
            Side-by-Side Evaluation
          </span>
          <h2 id="comparison-title" className="text-2xl sm:text-3xl font-serif-heading font-medium text-[#1A1815]">
            Session Comparison ({sessions.length}/3)
          </h2>
        </div>

        <div className="flex items-center gap-3">
          {sessions.length < 3 && (
            <button
              type="button"
              onClick={onExploreMore}
              className="text-xs font-semibold text-[#8C6D3B] hover:text-[#6E552C] underline underline-offset-2"
            >
              + Add another session
            </button>
          )}
          <button
            type="button"
            onClick={onClear}
            className="text-xs text-[#8A8378] hover:text-[#24211D] transition-colors"
          >
            Clear comparison
          </button>
        </div>
      </div>

      {/* Comparison Grid Table */}
      <div className="overflow-x-auto pb-4">
        <div className={`grid gap-4 min-w-[700px] ${
          sessions.length === 1 ? 'grid-cols-1 max-w-md mx-auto' : sessions.length === 2 ? 'grid-cols-2' : 'grid-cols-3'
        }`}>
          {sessions.map((session) => (
            <div
              key={session.id}
              className="bg-white rounded-3xl border border-[#E8E1D5] overflow-hidden shadow-xs flex flex-col justify-between"
            >
              {/* Header Image with Remove button */}
              <div className="relative h-40 w-full bg-[#24211D]">
                <img
                  src={session.image}
                  alt={session.name}
                  className="w-full h-full object-cover opacity-85"
                  referrerPolicy="no-referrer"
                />
                <button
                  type="button"
                  onClick={() => onRemove(session.id)}
                  title="Remove from comparison"
                  className="absolute top-3 right-3 p-1.5 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
                <div className="absolute bottom-3 left-3 right-3 text-white">
                  <h3 className="text-lg font-serif-heading font-semibold text-white leading-tight">
                    {session.name}
                  </h3>
                </div>
              </div>

              {/* Rows */}
              <div className="p-5 space-y-4 text-xs">
                {/* Duration & Fee */}
                <div className="grid grid-cols-2 gap-2 pb-3 border-b border-[#F0EAE1]">
                  <div>
                    <span className="text-[10px] uppercase tracking-wider text-[#8A8378] block">Duration</span>
                    <span className="font-semibold text-[#1A1815]">{session.duration}</span>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase tracking-wider text-[#8A8378] block">Session Fee</span>
                    <span className="font-semibold text-[#1A1815]">{session.price}</span>
                  </div>
                </div>

                {/* Intensity & Format */}
                <div className="grid grid-cols-2 gap-2 pb-3 border-b border-[#F0EAE1]">
                  <div>
                    <span className="text-[10px] uppercase tracking-wider text-[#8A8378] block">Intensity</span>
                    <span className="font-semibold text-[#1A1815] capitalize">{session.intensity}</span>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase tracking-wider text-[#8A8378] block">Format</span>
                    <span className="font-semibold text-[#1A1815] capitalize">{session.sessionType.join(', ')}</span>
                  </div>
                </div>

                {/* Short Description */}
                <div>
                  <span className="text-[10px] uppercase tracking-wider text-[#8A8378] block mb-1">Focus</span>
                  <p className="text-[#574F44] line-clamp-3 leading-relaxed">
                    {session.shortDescription}
                  </p>
                </div>

                {/* Suitable For */}
                <div>
                  <span className="text-[10px] uppercase tracking-wider text-[#8A8378] block mb-1">Best For</span>
                  <ul className="space-y-1 text-[#574F44]">
                    {session.suitableFor.slice(0, 2).map((item, idx) => (
                      <li key={idx} className="flex items-start gap-1">
                        <span className="text-[#8C6D3B]">•</span>
                        <span className="line-clamp-2">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Key Precautions */}
                <div>
                  <span className="text-[10px] uppercase tracking-wider text-[#8A8378] block mb-1">Precautions</span>
                  <p className="text-[#7A7165] line-clamp-2 italic">
                    {session.precautions[0] || 'Standard gentle acoustic session'}
                  </p>
                </div>
              </div>

              {/* CTAs */}
              <div className="p-5 pt-0 space-y-2">
                <button
                  type="button"
                  onClick={() => onBook(session)}
                  className="w-full py-2.5 rounded-xl bg-[#24211D] text-white text-xs font-semibold hover:bg-[#38332D] transition-colors flex items-center justify-center gap-1.5"
                >
                  <Calendar className="w-3.5 h-3.5 text-[#D4B98B]" />
                  <span>Book This Experience</span>
                </button>
                <button
                  type="button"
                  onClick={() => onExplore(session)}
                  className="w-full py-2 rounded-xl border border-[#D9CABA] text-[#4A453E] text-xs font-medium hover:bg-[#F3EDE2] transition-colors"
                >
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
