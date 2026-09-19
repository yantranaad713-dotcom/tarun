import React, { useState } from 'react';
import {
  Sparkles,
  Clock,
  Users,
  Volume2,
  CheckCircle2,
  AlertTriangle,
  Calendar,
  PhoneCall,
  Share2,
  RotateCcw,
  Layers,
  ChevronDown,
  ChevronUp,
  Bookmark,
  Check
} from 'lucide-react';
import { RecommendationResponse, YantraSession } from '../types';
import { soundEngine } from '../utils/soundEngine';

interface RecommendationResultProps {
  result: RecommendationResponse;
  onBook: (session: YantraSession) => void;
  onExplore: (session: YantraSession) => void;
  onTalkToPractitioner: (session?: YantraSession) => void;
  onCompare: (session: YantraSession) => void;
  onRestart: () => void;
  isCompared: (sessionId: string) => boolean;
}

export const RecommendationResult: React.FC<RecommendationResultProps> = ({
  result,
  onBook,
  onExplore,
  onTalkToPractitioner,
  onCompare,
  onRestart,
  isCompared
}) => {
  const [showAlternatives, setShowAlternatives] = useState(false);
  const [copiedNotification, setCopiedNotification] = useState(false);
  const [savedNotification, setSavedNotification] = useState(false);

  const primary = result.primaryRecommendation;
  if (!primary) return null;

  const handleStrikeBowl = () => {
    soundEngine.playSingingBowl(216, 5.0);
  };

  const handleSaveRecommendation = () => {
    soundEngine.playChime(660);
    // Save to localStorage
    try {
      const savedList = JSON.parse(localStorage.getItem('naadpath_saved_recommendations') || '[]');
      const item = {
        id: primary.id,
        name: primary.name,
        date: new Date().toLocaleDateString(),
        rationale: result.matchingReasons.summary
      };
      localStorage.setItem(
        'naadpath_saved_recommendations',
        JSON.stringify([item, ...savedList.filter((x: { id: string }) => x.id !== primary.id)].slice(0, 10))
      );
      setSavedNotification(true);
      setTimeout(() => setSavedNotification(false), 3000);
    } catch {
      // LocalStorage fallback
      setSavedNotification(true);
      setTimeout(() => setSavedNotification(false), 3000);
    }
  };

  const handleShareOrCopy = () => {
    soundEngine.playChime(528);
    const text = `NaadPath Sound Wellness Recommendation: ${primary.name} by Yantra Naad.\n${primary.shortDescription}\n\nExplore at Yantra Naad.`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopiedNotification(true);
      setTimeout(() => setCopiedNotification(false), 3000);
    }
  };

  return (
    <section className="w-full max-w-4xl mx-auto px-4 py-4" aria-labelledby="recommendation-heading">
      {/* Header */}
      <div className="text-center mb-8">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#EFE7D8] text-[#785C2E] uppercase tracking-wider mb-2">
          <Sparkles className="w-3.5 h-3.5 text-[#B38E5D]" />
          Personalized Alignment
        </span>
        <h2 id="recommendation-heading" className="text-3xl sm:text-4xl font-serif-heading font-medium text-[#1A1815] mb-2">
          Your NaadPath Recommendation
        </h2>
        <p className="text-sm sm:text-base text-[#6E675D] max-w-xl mx-auto">
          Crafted from your personal intentions, comfort preferences, and session pacing.
        </p>
      </div>

      {/* Primary Recommendation Card */}
      <div className="bg-white rounded-3xl border border-[#E8E1D5] overflow-hidden shadow-sm hover:shadow-md transition-all">
        {/* Top Visual Banner with Image & Alignment Indicator */}
        <div className="relative h-64 sm:h-80 w-full overflow-hidden bg-[#24211D]">
          <img
            src={primary.image}
            alt={primary.name}
            className="w-full h-full object-cover opacity-85 hover:scale-105 transition-transform duration-700"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#1C1A17] via-[#1C1A17]/40 to-transparent" />

          {/* Alignment Badge */}
          <div className="absolute top-4 left-4 sm:top-6 sm:left-6 flex items-center gap-2">
            <div className="px-3.5 py-1.5 rounded-full bg-[#FAF8F5]/90 backdrop-blur-md border border-white/40 shadow-xs flex items-center gap-1.5 text-xs font-semibold text-[#1A1815]">
              <span className="w-2 h-2 rounded-full bg-[#8C6D3B] animate-pulse" />
              <span>Alignment:</span>
              <span className="text-[#8C6D3B] font-bold">{result.alignmentLevel}</span>
            </div>

            <button
              onClick={handleStrikeBowl}
              title="Listen to Singing Bowl Harmonic Resonance"
              className="px-3 py-1.5 rounded-full bg-black/40 backdrop-blur-md border border-white/20 text-white text-xs hover:bg-black/60 transition-colors flex items-center gap-1.5"
            >
              <span>🔔</span>
              <span>Listen Resonance</span>
            </button>
          </div>

          {/* Top Right Save & Share CTAs */}
          <div className="absolute top-4 right-4 sm:top-6 sm:right-6 flex items-center gap-2">
            <button
              type="button"
              id="save-recommendation-btn"
              onClick={handleSaveRecommendation}
              title="Save recommendation to my guide"
              className="p-2.5 rounded-full bg-[#FAF8F5]/90 backdrop-blur-md border border-white/40 text-[#4A453E] hover:text-[#1A1815] transition-colors shadow-xs"
            >
              {savedNotification ? <Check className="w-4 h-4 text-emerald-600" /> : <Bookmark className="w-4 h-4" />}
            </button>

            <button
              type="button"
              id="share-recommendation-btn"
              onClick={handleShareOrCopy}
              title="Share or copy recommendation"
              className="p-2.5 rounded-full bg-[#FAF8F5]/90 backdrop-blur-md border border-white/40 text-[#4A453E] hover:text-[#1A1815] transition-colors shadow-xs"
            >
              {copiedNotification ? <Check className="w-4 h-4 text-emerald-600" /> : <Share2 className="w-4 h-4" />}
            </button>
          </div>

          {/* Banner bottom title details */}
          <div className="absolute bottom-4 left-4 right-4 sm:bottom-6 sm:left-6 sm:right-6 text-white">
            <h3 className="text-2xl sm:text-3xl font-serif-heading font-semibold tracking-wide text-white mb-1">
              {primary.name}
            </h3>
            <p className="text-xs sm:text-sm text-[#E2D8CC] line-clamp-2 max-w-2xl font-light">
              {primary.shortDescription}
            </p>
          </div>
        </div>

        {/* Card Content & Details */}
        <div className="p-6 sm:p-8 space-y-6">
          {/* Key Attributes Pills */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3 rounded-xl bg-[#FAF7F2] border border-[#EFE7D8] flex items-center gap-2.5">
              <Clock className="w-4 h-4 text-[#8C6D3B] shrink-0" />
              <div>
                <span className="text-[10px] uppercase tracking-wider text-[#8A8378] block">Duration</span>
                <span className="text-xs font-semibold text-[#1A1815]">{primary.duration}</span>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-[#FAF7F2] border border-[#EFE7D8] flex items-center gap-2.5">
              <Users className="w-4 h-4 text-[#8C6D3B] shrink-0" />
              <div>
                <span className="text-[10px] uppercase tracking-wider text-[#8A8378] block">Format</span>
                <span className="text-xs font-semibold text-[#1A1815] capitalize">
                  {primary.sessionType.join(' / ')}
                </span>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-[#FAF7F2] border border-[#EFE7D8] flex items-center gap-2.5">
              <Volume2 className="w-4 h-4 text-[#8C6D3B] shrink-0" />
              <div>
                <span className="text-[10px] uppercase tracking-wider text-[#8A8378] block">Intensity</span>
                <span className="text-xs font-semibold text-[#1A1815] capitalize">{primary.intensity}</span>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-[#FAF7F2] border border-[#EFE7D8] flex items-center gap-2.5">
              <Sparkles className="w-4 h-4 text-[#8C6D3B] shrink-0" />
              <div>
                <span className="text-[10px] uppercase tracking-wider text-[#8A8378] block">Session Fee</span>
                <span className="text-xs font-semibold text-[#1A1815]">{primary.price}</span>
              </div>
            </div>
          </div>

          {/* Alignment Tags */}
          <div>
            <span className="text-xs font-medium text-[#7A7369] block mb-2">
              Alignment Focus Tags:
            </span>
            <div className="flex flex-wrap gap-2">
              {primary.tags.slice(0, 4).map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 rounded-full text-xs font-medium bg-[#F4EFE6] text-[#634E24] border border-[#E5DAC8]"
                >
                  #{tag.replace(/-/g, ' ')}
                </span>
              ))}
            </div>
          </div>

          {/* "Why this was selected for you" Section */}
          <div className="p-5 rounded-2xl bg-[#FBF8F2] border border-[#EAE0D0]">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-4 h-4 text-[#8C6D3B]" />
              <h4 className="text-sm font-semibold text-[#1A1815] uppercase tracking-wider">
                Why this was selected for you
              </h4>
            </div>

            <p className="text-sm text-[#473F35] leading-relaxed mb-3">
              {result.matchingReasons.summary}
            </p>

            <ul className="space-y-1.5 text-xs text-[#5E5549]">
              {result.matchingReasons.details.map((reason, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#8C6D3B] shrink-0 mt-0.5" />
                  <span>{reason}</span>
                </li>
              ))}
            </ul>

            <div className="mt-3 pt-3 border-t border-[#EAE0D0] text-[11px] text-[#7A7165] italic">
              {result.matchingReasons.disclaimerSnippet}
            </div>
          </div>

          {/* Who it may be suitable for & Precautions Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-[#FFFFFF] border border-[#E8E1D5]">
              <h4 className="text-xs uppercase tracking-wider font-semibold text-[#1A1815] mb-2 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                Who it may be suitable for:
              </h4>
              <ul className="space-y-1.5 text-xs text-[#574E44]">
                {primary.suitableFor.map((item, i) => (
                  <li key={i} className="flex items-start gap-1.5">
                    <span className="text-[#8C6D3B] font-bold">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="p-4 rounded-xl bg-[#FFFFFF] border border-[#E8E1D5]">
              <h4 className="text-xs uppercase tracking-wider font-semibold text-[#1A1815] mb-2 flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 text-[#A87B2E]" />
                Important Considerations:
              </h4>
              <ul className="space-y-1.5 text-xs text-[#574E44]">
                {primary.precautions.map((item, i) => (
                  <li key={i} className="flex items-start gap-1.5">
                    <span className="text-[#A87B2E] font-bold">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Toast banners for Save/Share */}
          {savedNotification && (
            <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center justify-between">
              <span>Recommendation saved to your device session organizer.</span>
            </div>
          )}
          {copiedNotification && (
            <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-center justify-between">
              <span>Recommendation link & summary copied to your clipboard.</span>
            </div>
          )}

          {/* CTAs */}
          <div className="pt-4 border-t border-[#E8E1D5] flex flex-wrap gap-3">
            <button
              type="button"
              id="cta-book-recommendation-btn"
              onClick={() => onBook(primary)}
              className="flex-1 min-w-[200px] py-3 px-5 rounded-xl bg-[#24211D] text-white text-sm font-medium hover:bg-[#38332D] transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer"
            >
              <Calendar className="w-4 h-4 text-[#D4B98B]" />
              <span>Book This Experience</span>
            </button>

            <button
              type="button"
              id="cta-explore-session-btn"
              onClick={() => onExplore(primary)}
              className="py-3 px-5 rounded-xl border border-[#D9CABA] text-sm font-medium text-[#3A352F] hover:bg-[#F3EDE2] transition-colors flex items-center justify-center gap-2"
            >
              <span>Explore Details</span>
            </button>

            <button
              type="button"
              id="cta-speak-practitioner-btn"
              onClick={() => onTalkToPractitioner(primary)}
              className="py-3 px-5 rounded-xl border border-[#D9CABA] text-sm font-medium text-[#3A352F] hover:bg-[#F3EDE2] transition-colors flex items-center justify-center gap-2"
            >
              <PhoneCall className="w-4 h-4 text-[#8C6D3B]" />
              <span>Speak With a Practitioner</span>
            </button>

            <button
              type="button"
              id="cta-compare-btn"
              onClick={() => onCompare(primary)}
              className="py-3 px-4 rounded-xl border border-transparent text-sm font-medium text-[#7A7369] hover:text-[#1A1815] transition-colors flex items-center justify-center gap-1.5"
            >
              <Layers className="w-4 h-4" />
              <span>{isCompared(primary.id) ? 'Added to Compare' : 'Add to Compare'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Alternative Experiences Section (Max 2) */}
      {result.alternativeRecommendations.length > 0 && (
        <div className="mt-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-serif-heading font-semibold text-[#1A1815]">
              Alternative Experiences for You
            </h3>
            <button
              type="button"
              id="toggle-alternatives-btn"
              onClick={() => setShowAlternatives((prev) => !prev)}
              className="text-xs font-semibold text-[#8C6D3B] hover:text-[#6A5126] flex items-center gap-1"
            >
              <span>{showAlternatives ? 'Hide Alternatives' : 'See Alternative Experiences'}</span>
              {showAlternatives ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
          </div>

          {showAlternatives && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {result.alternativeRecommendations.map((alt) => (
                <div
                  key={alt.id}
                  className="bg-white rounded-2xl border border-[#E8E1D5] p-5 shadow-xs flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-[#EFE7D8] text-[#785C2E]">
                        Alternative Option
                      </span>
                      <span className="text-xs text-[#8A8378] capitalize">{alt.intensity}</span>
                    </div>

                    <h4 className="text-lg font-serif-heading font-semibold text-[#1A1815] mb-1">
                      {alt.name}
                    </h4>
                    <p className="text-xs text-[#6A6359] mb-3 line-clamp-2 leading-relaxed">
                      {alt.shortDescription}
                    </p>

                    <div className="flex items-center gap-3 text-xs text-[#7A7369] mb-4">
                      <span>⏱ {alt.duration}</span>
                      <span>•</span>
                      <span>Format: {alt.sessionType.join(', ')}</span>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-[#F0EAE1] flex items-center justify-between gap-2">
                    <button
                      type="button"
                      onClick={() => onExplore(alt)}
                      className="text-xs font-medium text-[#1A1815] hover:text-[#8C6D3B] underline underline-offset-2"
                    >
                      View Session
                    </button>

                    <button
                      type="button"
                      onClick={() => onBook(alt)}
                      className="px-4 py-1.5 rounded-lg bg-[#24211D] text-white text-xs font-medium hover:bg-[#38332D]"
                    >
                      Book Alternative
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Restart and Guidance Tools */}
      <div className="mt-8 pt-6 border-t border-[#E8E1D5] flex flex-col sm:flex-row items-center justify-between gap-4">
        <button
          type="button"
          id="restart-assessment-btn"
          onClick={onRestart}
          className="px-5 py-2.5 rounded-xl border border-[#D9CABA] text-xs sm:text-sm font-medium text-[#4A453E] hover:bg-[#F3EDE2] transition-colors flex items-center gap-2"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Restart Assessment</span>
        </button>

        <span className="text-xs text-[#8A8378]">
          Need advice? Our sound practitioners are available for personalized guidance.
        </span>
      </div>

      {/* REQUIRED FINAL DISCLAIMER */}
      <div className="mt-10 p-5 rounded-2xl bg-[#FAF6F0] border border-[#EADFCF] text-center">
        <p className="text-xs text-[#6E665A] leading-relaxed max-w-2xl mx-auto">
          {result.generalDisclaimer}
        </p>
      </div>
    </section>
  );
};
