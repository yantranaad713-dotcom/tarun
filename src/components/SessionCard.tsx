import React from 'react';
import { Clock, Users, Volume2, Sparkles, Layers, Check, Calendar } from 'lucide-react';
import { YantraSession } from '../types';

interface SessionCardProps {
  session: YantraSession;
  onBook: (session: YantraSession) => void;
  onExplore: (session: YantraSession) => void;
  onToggleCompare?: (session: YantraSession) => void;
  isCompared?: boolean;
}

export const SessionCard: React.FC<SessionCardProps> = ({
  session,
  onBook,
  onExplore,
  onToggleCompare,
  isCompared = false
}) => {
  return (
    <article className="bg-white rounded-3xl border border-[#E8E1D5] overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col justify-between group">
      <div>
        {/* Card Image */}
        <div className="relative h-48 w-full overflow-hidden bg-[#24211D]">
          <img
            src={session.image}
            alt={session.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#1C1A17]/80 via-transparent to-transparent" />

          <div className="absolute top-3 left-3">
            <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-[#FAF8F5]/90 backdrop-blur-xs text-[#24211D] border border-white/40 shadow-xs">
              {session.price}
            </span>
          </div>

          <div className="absolute top-3 right-3">
            <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-black/40 backdrop-blur-xs text-white capitalize border border-white/20">
              {session.intensity}
            </span>
          </div>

          <div className="absolute bottom-3 left-3 right-3 text-white">
            <h3 className="text-lg font-serif-heading font-semibold text-white leading-tight">
              {session.name}
            </h3>
          </div>
        </div>

        {/* Content */}
        <div className="p-5 space-y-4">
          <p className="text-xs text-[#635D53] leading-relaxed line-clamp-3">
            {session.shortDescription}
          </p>

          <div className="flex items-center justify-between text-xs text-[#7A7369] py-2 border-y border-[#F3EDE2]">
            <div className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-[#8C6D3B]" />
              <span>{session.duration}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5 text-[#8C6D3B]" />
              <span className="capitalize">{session.sessionType.join(', ')}</span>
            </div>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-1.5">
            {session.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-[#F6F1E8] text-[#70582B]"
              >
                #{tag.replace(/-/g, ' ')}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Footer CTAs */}
      <div className="p-5 pt-0 flex items-center justify-between gap-2 border-t border-transparent">
        <button
          type="button"
          onClick={() => onExplore(session)}
          className="text-xs font-semibold text-[#1A1815] hover:text-[#8C6D3B] underline underline-offset-2 transition-colors"
        >
          Details
        </button>

        <div className="flex items-center gap-2">
          {onToggleCompare && (
            <button
              type="button"
              onClick={() => onToggleCompare(session)}
              title="Add to comparison"
              className={`p-2 rounded-lg border text-xs transition-colors ${
                isCompared
                  ? 'bg-[#8C6D3B] text-white border-[#8C6D3B]'
                  : 'bg-[#F9F6F0] text-[#736B5F] border-[#E3D7C5] hover:bg-[#F0EAE1]'
              }`}
            >
              {isCompared ? <Check className="w-3.5 h-3.5" /> : <Layers className="w-3.5 h-3.5" />}
            </button>
          )}

          <button
            type="button"
            onClick={() => onBook(session)}
            className="px-3.5 py-2 rounded-xl bg-[#24211D] text-white text-xs font-medium hover:bg-[#38332D] transition-colors flex items-center gap-1.5"
          >
            <Calendar className="w-3.5 h-3.5 text-[#D4B98B]" />
            <span>Book</span>
          </button>
        </div>
      </div>
    </article>
  );
};
