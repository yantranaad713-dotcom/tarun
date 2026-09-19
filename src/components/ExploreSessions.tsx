import React, { useState } from 'react';
import { Compass, Filter, Search, Sparkles, Layers, ArrowLeft } from 'lucide-react';
import { YantraSession } from '../types';
import { SessionCard } from './SessionCard';

interface ExploreSessionsProps {
  sessions: YantraSession[];
  onBook: (session: YantraSession) => void;
  onExplore: (session: YantraSession) => void;
  onToggleCompare: (session: YantraSession) => void;
  isCompared: (sessionId: string) => boolean;
  onStartAssessment: () => void;
  onViewComparison: () => void;
  compareCount: number;
}

export const ExploreSessions: React.FC<ExploreSessionsProps> = ({
  sessions,
  onBook,
  onExplore,
  onToggleCompare,
  isCompared,
  onStartAssessment,
  onViewComparison,
  compareCount
}) => {
  const [selectedIntensity, setSelectedIntensity] = useState<string>('all');
  const [selectedFormat, setSelectedFormat] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const filteredSessions = sessions.filter((s) => {
    if (s.active === false) return false;

    if (selectedIntensity !== 'all' && s.intensity !== selectedIntensity) {
      return false;
    }

    if (selectedFormat !== 'all' && !s.sessionType.includes(selectedFormat)) {
      return false;
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = s.name.toLowerCase().includes(q);
      const matchDesc = s.shortDescription.toLowerCase().includes(q);
      const matchTags = s.tags.some((t) => t.toLowerCase().includes(q));
      if (!matchName && !matchDesc && !matchTags) return false;
    }

    return true;
  });

  return (
    <section className="w-full max-w-6xl mx-auto px-4 py-6" aria-labelledby="explore-title">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <div>
          <span className="text-xs uppercase tracking-wider font-semibold text-[#8C6D3B]">
            Yantra Naad Sanctuary Catalogue
          </span>
          <h2 id="explore-title" className="text-3xl font-serif-heading font-medium text-[#1A1815]">
            Explore All Experiences
          </h2>
          <p className="text-xs sm:text-sm text-[#706A5F] mt-1">
            Sound vibrational healing, Tibetan singing bowl baths, yoga-aligned journeys and deep restorative stillness.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {compareCount > 0 && (
            <button
              type="button"
              onClick={onViewComparison}
              className="px-4 py-2 rounded-xl bg-[#8C6D3B] text-white text-xs font-semibold hover:bg-[#735728] transition-colors flex items-center gap-1.5 shadow-xs"
            >
              <Layers className="w-4 h-4" />
              <span>Compare Selected ({compareCount})</span>
            </button>
          )}

          <button
            type="button"
            onClick={onStartAssessment}
            className="px-4 py-2 rounded-xl bg-[#24211D] text-white text-xs font-medium hover:bg-[#38332D] transition-colors flex items-center gap-1.5"
          >
            <Sparkles className="w-4 h-4 text-[#D4B98B]" />
            <span>Need Guidance? Try NaadPath</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl p-4 border border-[#E8E1D5] shadow-xs mb-8 flex flex-col md:flex-row items-stretch md:items-center gap-4 justify-between">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-[#8C857B] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by keywords (e.g. sleep, yoga, stress, bowl)..."
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-[#D9CABA] bg-[#FAF8F5] text-xs text-[#1A1815] focus:outline-none focus:border-[#8C6D3B]"
          />
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1 text-xs text-[#7A7369] mr-2">
            <Filter className="w-3.5 h-3.5 text-[#8C6D3B]" />
            <span>Filters:</span>
          </div>

          {/* Intensity selector */}
          <select
            value={selectedIntensity}
            onChange={(e) => setSelectedIntensity(e.target.value)}
            className="px-3 py-1.5 rounded-xl border border-[#D9CABA] bg-[#FAF8F5] text-xs text-[#1A1815] focus:outline-none focus:border-[#8C6D3B]"
          >
            <option value="all">All Intensities</option>
            <option value="gentle">Gentle</option>
            <option value="moderate">Moderate</option>
            <option value="immersive">Immersive</option>
          </select>

          {/* Format selector */}
          <select
            value={selectedFormat}
            onChange={(e) => setSelectedFormat(e.target.value)}
            className="px-3 py-1.5 rounded-xl border border-[#D9CABA] bg-[#FAF8F5] text-xs text-[#1A1815] focus:outline-none focus:border-[#8C6D3B]"
          >
            <option value="all">All Formats</option>
            <option value="individual">Private Individual</option>
            <option value="group">Group Sound Bath</option>
          </select>

          {(selectedIntensity !== 'all' || selectedFormat !== 'all' || searchQuery) && (
            <button
              type="button"
              onClick={() => {
                setSelectedIntensity('all');
                setSelectedFormat('all');
                setSearchQuery('');
              }}
              className="text-xs text-[#8C857B] hover:text-[#1A1815] ml-2 underline"
            >
              Reset
            </button>
          )}
        </div>
      </div>

      {/* Grid of Session Cards */}
      {filteredSessions.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-3xl border border-[#E8E1D5] p-8">
          <Compass className="w-10 h-10 text-[#8C857B] mx-auto mb-3" />
          <h3 className="text-lg font-serif-heading font-semibold text-[#1A1815] mb-1">
            No matching experiences found
          </h3>
          <p className="text-xs text-[#706A5F] max-w-sm mx-auto mb-4">
            Try adjusting your search terms or filters to discover available sound wellness sessions.
          </p>
          <button
            type="button"
            onClick={() => {
              setSelectedIntensity('all');
              setSelectedFormat('all');
              setSearchQuery('');
            }}
            className="px-4 py-2 rounded-xl bg-[#24211D] text-white text-xs font-medium"
          >
            Show All Sessions
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSessions.map((session) => (
            <SessionCard
              key={session.id}
              session={session}
              onBook={onBook}
              onExplore={onExplore}
              onToggleCompare={onToggleCompare}
              isCompared={isCompared(session.id)}
            />
          ))}
        </div>
      )}
    </section>
  );
};
