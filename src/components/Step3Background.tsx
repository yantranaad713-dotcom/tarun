import React, { useState } from 'react';
import {
  ArrowRight,
  ArrowLeft,
  Clock,
  Gauge,
  Stethoscope,
  AlertCircle,
  Sparkles,
  Users,
  Volume2,
  CheckCircle2
} from 'lucide-react';
import { BackgroundAnswers } from '../types';
import { soundEngine } from '../utils/soundEngine';

interface Step3BackgroundProps {
  selectedConcerns: string[];
  selectedGoals: string[];
  answers: BackgroundAnswers;
  onChange: (answers: BackgroundAnswers) => void;
  onComplete: () => void;
  onBackToStep2: () => void;
}

interface QuestionConfig {
  id: keyof BackgroundAnswers;
  question: string;
  subtext: string;
  icon: React.ReactNode;
  options: { label: string; value: string; hint?: string }[];
  isDynamicHighlight?: boolean;
}

export const Step3Background: React.FC<Step3BackgroundProps> = ({
  selectedConcerns,
  answers,
  onChange,
  onComplete,
  onBackToStep2
}) => {
  const hasPhysicalConcerns = selectedConcerns.some((c) =>
    ['joint-discomfort', 'muscle-tension', 'body-stiffness', 'physical-fatigue'].includes(c)
  );

  // Conversational sequence of questions
  const questions: QuestionConfig[] = [
    {
      id: 'duration',
      question: 'How long have you been experiencing this?',
      subtext: 'Understanding timing helps us recommend either an acute unwinding or longer-term grounding approach.',
      icon: <Clock className="w-5 h-5 text-[#8C6D3B]" />,
      options: [
        { label: 'Today', value: 'Today', hint: 'Recent tension or busy day' },
        { label: 'A few days', value: 'A few days', hint: 'Short-term buildup' },
        { label: 'A few weeks', value: 'A few weeks', hint: 'Ongoing pattern' },
        { label: 'Longer term', value: 'Longer term', hint: 'Deep-seated or chronic habit' }
      ]
    },
    {
      id: 'intensity',
      question: 'How intense does it feel today?',
      subtext: 'This ensures the acoustic volume and vibrations remain supportive and gentle.',
      icon: <Gauge className="w-5 h-5 text-[#8C6D3B]" />,
      options: [
        { label: 'Mild', value: 'Mild', hint: 'Noticeable but manageable' },
        { label: 'Moderate', value: 'Moderate', hint: 'Affecting comfort or concentration' },
        { label: 'Severe', value: 'Severe', hint: 'Acute or intense discomfort' }
      ]
    },
    {
      id: 'receivingMedicalCare',
      question: 'Are you currently receiving medical care for this concern?',
      subtext: 'Sound sessions complement your lifestyle and do not replace clinical care.',
      icon: <Stethoscope className="w-5 h-5 text-[#8C6D3B]" />,
      options: [
        { label: 'Yes', value: 'Yes', hint: 'Under physician or therapeutic guidance' },
        { label: 'No', value: 'No', hint: 'General lifestyle wellness' },
        { label: 'Prefer not to say', value: 'Prefer not to say', hint: 'Keep confidential' }
      ]
    },
    {
      id: 'recentInjuryOrSurgery',
      question: hasPhysicalConcerns
        ? 'Have you recently experienced an injury, accident, surgery or significant physical change?'
        : 'Have you recently experienced a significant physical change, surgery or injury?',
      subtext: 'Helps ensure sound bowl placement on or near the body is safe and comfortable.',
      icon: <AlertCircle className="w-5 h-5 text-[#8C6D3B]" />,
      isDynamicHighlight: hasPhysicalConcerns,
      options: [
        { label: 'Yes', value: 'Yes', hint: 'Recent medical or physical event' },
        { label: 'No', value: 'No', hint: 'No recent trauma or surgery' }
      ]
    },
    {
      id: 'hasRedFlags',
      question: 'Are you experiencing unexplained severe pain, chest pain, difficulty breathing, or fainting?',
      subtext: 'Our safety protocol prioritizes your health above all else.',
      icon: <AlertCircle className="w-5 h-5 text-[#B3523B]" />,
      options: [
        { label: 'No, none of these', value: 'No', hint: 'Safe for wellness exploration' },
        { label: 'Yes, I am experiencing these', value: 'Yes', hint: 'Requires prompt medical evaluation' }
      ]
    },
    {
      id: 'firstTimeExperience',
      question: 'Is this your first sound wellness experience?',
      subtext: 'We pace our sessions so first-timers feel completely at ease and grounded.',
      icon: <Sparkles className="w-5 h-5 text-[#8C6D3B]" />,
      options: [
        { label: 'Yes, this is my first time', value: 'Yes', hint: 'New to sound healing' },
        { label: 'No, I have experienced sound sessions before', value: 'No', hint: 'Familiar with acoustic baths' }
      ]
    },
    {
      id: 'preferredEnvironment',
      question: 'What session environment would you prefer?',
      subtext: 'Whether you prefer individual privacy or community harmonic resonance.',
      icon: <Users className="w-5 h-5 text-[#8C6D3B]" />,
      options: [
        { label: 'Private individual session', value: 'Private individual session', hint: '1-on-1 personalized attention' },
        { label: 'Small group session', value: 'Small group session', hint: 'Intimate setting with up to 6 guests' },
        { label: 'Group sound bath', value: 'Group sound bath', hint: 'Shared community acoustic field' },
        { label: 'Yoga + sound experience', value: 'Yoga + sound experience', hint: 'Gentle movement blended with vibration' },
        { label: 'No preference', value: 'No preference', hint: 'Open to any format' }
      ]
    },
    {
      id: 'preferredIntensity',
      question: 'What session intensity sounds most comfortable?',
      subtext: 'From whispered gentle harmonics to resonant immersive overtone baths.',
      icon: <Volume2 className="w-5 h-5 text-[#8C6D3B]" />,
      options: [
        { label: 'Very gentle', value: 'Very gentle', hint: 'Soft, delicate acoustic cradling' },
        { label: 'Gentle', value: 'Gentle', hint: 'Balanced, deeply relaxing tones' },
        { label: 'Immersive', value: 'Immersive', hint: 'Rich, layered gong and bowl overtones' },
        { label: 'Not sure', value: 'Not sure', hint: 'Let the guide recommend' }
      ]
    }
  ];

  const [currentIdx, setCurrentIdx] = useState(0);
  const currentQ = questions[currentIdx];
  const currentValue = answers[currentQ.id];

  const handleSelectOption = (val: string) => {
    soundEngine.playChime(600);
    const updated = {
      ...answers,
      [currentQ.id]: val
    };
    onChange(updated);

    // Auto advance smoothly after selection
    if (currentIdx < questions.length - 1) {
      setTimeout(() => {
        setCurrentIdx((prev) => prev + 1);
      }, 240);
    }
  };

  const handlePrev = () => {
    if (currentIdx > 0) {
      setCurrentIdx((prev) => prev - 1);
    } else {
      onBackToStep2();
    }
  };

  const handleNext = () => {
    if (currentIdx < questions.length - 1) {
      setCurrentIdx((prev) => prev + 1);
    } else {
      onComplete();
    }
  };

  const isCurrentAnswered = Boolean(currentValue);
  const progressPercent = Math.round(((currentIdx + 1) / questions.length) * 100);

  return (
    <section className="w-full max-w-2xl mx-auto px-4 py-4" aria-labelledby="step3-title">
      {/* Header Context */}
      <div className="text-center mb-6">
        <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-[#EFE7D8] text-[#785C2E] uppercase tracking-wider mb-2">
          Step 3 • Wellness Consultation
        </span>
        <h2 id="step3-title" className="text-2xl sm:text-3xl font-serif-heading font-medium text-[#1A1815]">
          A Few Gentle Questions
        </h2>
        <p className="text-xs sm:text-sm text-[#706A5F] mt-1">
          Question {currentIdx + 1} of {questions.length} • Conversational Check-in
        </p>
      </div>

      {/* Mini Progress bar for sub-questions */}
      <div className="w-full bg-[#EAE2D5] h-1.5 rounded-full overflow-hidden mb-8">
        <div
          className="bg-[#B38E5D] h-full transition-all duration-300 rounded-full"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      {/* Active Question Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E8E1D5] shadow-sm relative transition-all duration-300">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-[#F6F1E8] border border-[#E3D7C5] flex items-center justify-center">
            {currentQ.icon}
          </div>
          {currentQ.isDynamicHighlight && (
            <span className="text-[11px] font-medium uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-[#F3E6D0] text-[#785C2E]">
              Relevant to your selected physical comfort
            </span>
          )}
        </div>

        <h3 className="text-xl sm:text-2xl font-serif-heading font-semibold text-[#1A1815] mb-2 leading-snug">
          {currentQ.question}
        </h3>
        <p className="text-xs sm:text-sm text-[#736B60] mb-6 leading-relaxed">
          {currentQ.subtext}
        </p>

        {/* Options List */}
        <div className="space-y-2.5">
          {currentQ.options.map((opt) => {
            const isSelected = currentValue === opt.value;
            return (
              <button
                key={opt.value}
                type="button"
                id={`bg-opt-${currentQ.id}-${opt.value.toLowerCase().replace(/[^a-z0-9]/g, '-')}`}
                onClick={() => handleSelectOption(opt.value)}
                className={`w-full text-left p-4 rounded-xl border transition-all duration-200 flex items-center justify-between cursor-pointer ${
                  isSelected
                    ? 'bg-[#F9F5EE] border-[#B38E5D] ring-1 ring-[#B38E5D] shadow-xs'
                    : 'bg-[#FCFAF7] border-[#E8E1D5] hover:border-[#D1C2AD] hover:bg-[#FAF6F0]'
                }`}
                aria-pressed={isSelected}
              >
                <div>
                  <div className="text-sm font-semibold text-[#1A1815]">
                    {opt.label}
                  </div>
                  {opt.hint && (
                    <div className="text-xs text-[#7A7369] mt-0.5">
                      {opt.hint}
                    </div>
                  )}
                </div>

                <div
                  className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 ml-3 ${
                    isSelected
                      ? 'bg-[#8C6D3B] text-white'
                      : 'border border-[#D1C6B8] bg-white'
                  }`}
                >
                  {isSelected && <CheckCircle2 className="w-3.5 h-3.5" />}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Navigation Footer */}
      <div className="mt-8 flex items-center justify-between gap-4">
        <button
          type="button"
          onClick={handlePrev}
          className="px-5 py-2.5 rounded-xl border border-[#D9CABA] text-xs sm:text-sm font-medium text-[#4A453E] hover:bg-[#F3EDE2] transition-colors flex items-center gap-1.5"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{currentIdx === 0 ? 'Back to Goals' : 'Previous Question'}</span>
        </button>

        {currentIdx < questions.length - 1 ? (
          <button
            type="button"
            disabled={!isCurrentAnswered}
            onClick={handleNext}
            className={`px-6 py-2.5 rounded-xl text-xs sm:text-sm font-medium transition-colors flex items-center gap-1.5 ${
              isCurrentAnswered
                ? 'bg-[#24211D] text-white hover:bg-[#38332D]'
                : 'bg-[#E5DDCF] text-[#9A9184] cursor-not-allowed'
            }`}
          >
            <span>Skip or Next</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        ) : (
          <button
            type="button"
            id="step3-finish-btn"
            disabled={!isCurrentAnswered}
            onClick={onComplete}
            className={`px-7 py-3 rounded-xl text-sm font-semibold transition-all flex items-center gap-2 ${
              isCurrentAnswered
                ? 'bg-[#8C6D3B] text-white hover:bg-[#785C2E] shadow-sm cursor-pointer'
                : 'bg-[#E5DDCF] text-[#9A9184] cursor-not-allowed'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>Generate My NaadPath</span>
          </button>
        )}
      </div>
    </section>
  );
};
