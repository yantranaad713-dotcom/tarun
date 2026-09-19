import React from 'react';
import { ShieldAlert, HeartHandshake, PhoneCall, RotateCcw, BookOpen, ExternalLink } from 'lucide-react';
import { SafetyCheckResult } from '../types';

interface SafetyScreenProps {
  safetyStatus: SafetyCheckResult;
  onRetake: () => void;
  onExploreGeneralRelaxation: () => void;
  onTalkToPractitioner: () => void;
}

export const SafetyScreen: React.FC<SafetyScreenProps> = ({
  safetyStatus,
  onRetake,
  onExploreGeneralRelaxation,
  onTalkToPractitioner
}) => {
  return (
    <section className="w-full max-w-3xl mx-auto px-4 py-8" aria-labelledby="safety-title">
      <div className="bg-white rounded-3xl border border-[#EAC4B8] p-6 sm:p-10 shadow-sm">
        {/* Safety Badge */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-[#FDF2F0] border border-[#F5C2B8] flex items-center justify-center text-[#B3402C]">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs uppercase tracking-widest font-bold text-[#B3402C]">
              Safety Prioritized
            </span>
            <h2 id="safety-title" className="text-2xl sm:text-3xl font-serif-heading font-semibold text-[#1A1815]">
              {safetyStatus.safetyTitle}
            </h2>
          </div>
        </div>

        {/* Primary Safety Statement */}
        <div className="p-5 rounded-2xl bg-[#FAF5F2] border border-[#F0DDD6] mb-6">
          <p className="text-base text-[#3D332F] font-medium leading-relaxed">
            {safetyStatus.safetyMessage}
          </p>
        </div>

        {/* Guidance points */}
        <div className="space-y-3 mb-8">
          <h3 className="text-xs uppercase tracking-wider font-semibold text-[#7A7165]">
            Important Considerations:
          </h3>
          <ul className="space-y-2 text-sm text-[#574E45] list-disc list-inside">
            {safetyStatus.guidancePoints.map((point, idx) => (
              <li key={idx} className="leading-relaxed pl-1">
                {point}
              </li>
            ))}
            <li className="leading-relaxed pl-1">
              Sound baths and vibrational therapies are designed for ambient relaxation and mindfulness; they are never a replacement for acute emergency medicine or specialized physician care.
            </li>
          </ul>
        </div>

        {/* Gentle supportive actions */}
        <div className="pt-6 border-t border-[#F0E6DD] flex flex-col sm:flex-row gap-3">
          <button
            type="button"
            id="safety-explore-relaxation-btn"
            onClick={onExploreGeneralRelaxation}
            className="flex-1 py-3 px-5 rounded-xl bg-[#24211D] text-white text-sm font-medium hover:bg-[#38332D] transition-colors flex items-center justify-center gap-2"
          >
            <BookOpen className="w-4 h-4" />
            <span>Explore General Relaxation Knowledge</span>
          </button>

          <button
            type="button"
            id="safety-talk-practitioner-btn"
            onClick={onTalkToPractitioner}
            className="py-3 px-5 rounded-xl border border-[#D9CABA] text-sm font-medium text-[#4A453E] hover:bg-[#F3EDE2] transition-colors flex items-center justify-center gap-2"
          >
            <HeartHandshake className="w-4 h-4 text-[#8C6D3B]" />
            <span>Speak With a Practitioner</span>
          </button>

          <button
            type="button"
            id="safety-retake-btn"
            onClick={onRetake}
            className="py-3 px-4 rounded-xl border border-transparent text-sm font-medium text-[#7A7369] hover:text-[#1A1815] transition-colors flex items-center justify-center gap-1.5"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Review Answers</span>
          </button>
        </div>
      </div>
    </section>
  );
};
