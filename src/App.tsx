import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { ProgressBar } from './components/ProgressBar';
import { Step1Concerns } from './components/Step1Concerns';
import { Step2Goals } from './components/Step2Goals';
import { Step3Background } from './components/Step3Background';
import { SafetyScreen } from './components/SafetyScreen';
import { RecommendationResult } from './components/RecommendationResult';
import { HomeHeroWidget } from './components/HomeHeroWidget';
import { ExploreSessions } from './components/ExploreSessions';
import { ComparisonWidget } from './components/ComparisonWidget';
import { BookingModal } from './components/BookingModal';
import { PractitionerModal } from './components/PractitionerModal';
import { SessionDetailModal } from './components/SessionDetailModal';
import { RelaxationInfoModal } from './components/RelaxationInfoModal';
import { FloatingButton } from './components/FloatingButton';
import { AdminPortal } from './components/AdminPortal';
import { INITIAL_SESSIONS } from './data/sessionsData';
import { calculateRecommendation } from './utils/matchingEngine';
import { soundEngine } from './utils/soundEngine';
import {
  YantraSession,
  BackgroundAnswers,
  RecommendationResponse,
  AssessmentPayload
} from './types';
import { Sparkles, Shield, HeartHandshake, Compass } from 'lucide-react';

export default function App() {
  // Navigation
  const [currentView, setCurrentView] = useState<'home' | 'assessment' | 'explore' | 'compare' | 'admin'>('home');

  // Database of sessions
  const [sessions, setSessions] = useState<YantraSession[]>(INITIAL_SESSIONS);

  // Assessment flow states
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [selectedConcerns, setSelectedConcerns] = useState<string[]>([]);
  const [selectedGoals, setSelectedGoals] = useState<string[]>([]);
  const [backgroundAnswers, setBackgroundAnswers] = useState<BackgroundAnswers>({});
  const [isLoadingRecommendation, setIsLoadingRecommendation] = useState(false);
  const [recommendationResult, setRecommendationResult] = useState<RecommendationResponse | null>(null);

  // Comparison drawer state (max 3)
  const [comparedSessionIds, setComparedSessionIds] = useState<string[]>([]);

  // Modals
  const [bookingSession, setBookingSession] = useState<YantraSession | null>(null);
  const [detailSession, setDetailSession] = useState<YantraSession | null>(null);
  const [practitionerModalSession, setPractitionerModalSession] = useState<YantraSession | null>(null);
  const [isPractitionerModalOpen, setIsPractitionerModalOpen] = useState(false);
  const [isRelaxationInfoOpen, setIsRelaxationInfoOpen] = useState(false);

  // Load sessions from API
  const fetchSessions = async () => {
    try {
      const res = await fetch('/api/sessions?all=true');
      if (res.ok) {
        const data = await res.json();
        if (data.sessions && Array.isArray(data.sessions)) {
          setSessions(data.sessions);
        }
      }
    } catch {
      // Keep initial sessions
    }
  };

  useEffect(() => {
    fetchSessions();
  }, []);

  // Handler for starting assessment from home or chips
  const handleStartAssessment = (preselectedChipId?: string) => {
    setCurrentView('assessment');
    setCurrentStep(1);
    setRecommendationResult(null);

    if (preselectedChipId) {
      setSelectedConcerns([preselectedChipId]);
    }
  };

  // Compare toggling
  const handleToggleCompare = (session: YantraSession) => {
    soundEngine.playChime(600);
    if (comparedSessionIds.includes(session.id)) {
      setComparedSessionIds((prev) => prev.filter((id) => id !== session.id));
    } else {
      if (comparedSessionIds.length >= 3) {
        alert('You can compare up to 3 experiences at a time. Please remove one first.');
        return;
      }
      setComparedSessionIds((prev) => [...prev, session.id]);
    }
  };

  const handleRemoveCompare = (sessionId: string) => {
    setComparedSessionIds((prev) => prev.filter((id) => id !== sessionId));
  };

  const handleClearCompare = () => {
    setComparedSessionIds([]);
  };

  // Submit assessment and generate recommendation
  const handleGenerateRecommendation = async () => {
    setIsLoadingRecommendation(true);
    soundEngine.playSingingBowl(216, 3.5);

    const payload: AssessmentPayload = {
      selectedConcerns,
      selectedGoals,
      backgroundAnswers,
      consentedToHealthDataStorage: false
    };

    try {
      const res = await fetch('/api/recommend', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        const data: RecommendationResponse = await res.json();
        setRecommendationResult(data);
      } else {
        // Fallback to client-side engine if server unreachable
        const fallback = calculateRecommendation(sessions, payload);
        setRecommendationResult(fallback);
      }
    } catch {
      const fallback = calculateRecommendation(sessions, payload);
      setRecommendationResult(fallback);
    } finally {
      setIsLoadingRecommendation(false);
      setCurrentStep(4);
    }
  };

  // Restart assessment
  const handleRestartAssessment = () => {
    soundEngine.playChime(520);
    setSelectedConcerns([]);
    setSelectedGoals([]);
    setBackgroundAnswers({});
    setRecommendationResult(null);
    setCurrentStep(1);
    setCurrentView('assessment');
  };

  // Open practitioner modal
  const handleOpenPractitioner = (session?: YantraSession) => {
    setPractitionerModalSession(session || null);
    setIsPractitionerModalOpen(true);
  };

  const comparedSessionsList = sessions.filter((s) => comparedSessionIds.includes(s.id));

  return (
    <div className="min-h-screen flex flex-col bg-[#FBF9F5] text-[#24211D]">
      {/* Top Header */}
      <Header
        currentView={currentView}
        onNavigate={(view) => {
          setCurrentView(view);
          if (view === 'assessment' && currentStep > 3 && !recommendationResult) {
            setCurrentStep(1);
          }
        }}
        compareCount={comparedSessionIds.length}
      />

      {/* Main Content Area */}
      <main className="flex-1 w-full pb-16">
        {/* VIEW 1: HOME */}
        {currentView === 'home' && (
          <HomeHeroWidget
            onStartAssessment={handleStartAssessment}
            onExploreAll={() => setCurrentView('explore')}
          />
        )}

        {/* VIEW 2: NAADPATH ASSESSMENT */}
        {currentView === 'assessment' && (
          <div className="pt-6">
            {/* Progress Bar (Visible across Steps 1 to 4) */}
            <ProgressBar
              currentStep={currentStep}
              onStepClick={(step) => {
                if (step < currentStep) {
                  setCurrentStep(step);
                }
              }}
            />

            {/* Step 1: Concerns */}
            {currentStep === 1 && (
              <Step1Concerns
                selectedConcerns={selectedConcerns}
                onChange={setSelectedConcerns}
                onNext={() => {
                  soundEngine.playChime(528);
                  setCurrentStep(2);
                }}
              />
            )}

            {/* Step 2: Personal Goals */}
            {currentStep === 2 && (
              <Step2Goals
                selectedGoals={selectedGoals}
                onChange={setSelectedGoals}
                onNext={() => {
                  soundEngine.playChime(528);
                  setCurrentStep(3);
                }}
                onBack={() => setCurrentStep(1)}
              />
            )}

            {/* Step 3: Background Questions */}
            {currentStep === 3 && (
              <>
                {isLoadingRecommendation ? (
                  <div className="py-20 text-center space-y-4">
                    <div className="w-16 h-16 rounded-full border-4 border-[#E2D5C3] border-t-[#8C6D3B] animate-spin mx-auto" />
                    <h3 className="text-2xl font-serif-heading font-medium text-[#1A1815]">
                      Harmonizing Your NaadPath...
                    </h3>
                    <p className="text-xs text-[#7A7369]">
                      Evaluating vibrational frequencies, acoustic pacing, and comfort tags.
                    </p>
                  </div>
                ) : (
                  <Step3Background
                    selectedConcerns={selectedConcerns}
                    selectedGoals={selectedGoals}
                    answers={backgroundAnswers}
                    onChange={setBackgroundAnswers}
                    onComplete={handleGenerateRecommendation}
                    onBackToStep2={() => setCurrentStep(2)}
                  />
                )}
              </>
            )}

            {/* Step 4: Safety Check Screen OR Recommendation Result */}
            {currentStep === 4 && recommendationResult && (
              <>
                {!recommendationResult.safetyStatus.isSafeToProceed ? (
                  <SafetyScreen
                    safetyStatus={recommendationResult.safetyStatus}
                    onRetake={() => setCurrentStep(3)}
                    onExploreGeneralRelaxation={() => setIsRelaxationInfoOpen(true)}
                    onTalkToPractitioner={() => handleOpenPractitioner()}
                  />
                ) : (
                  <RecommendationResult
                    result={recommendationResult}
                    onBook={(session) => setBookingSession(session)}
                    onExplore={(session) => setDetailSession(session)}
                    onTalkToPractitioner={(session) => handleOpenPractitioner(session)}
                    onCompare={handleToggleCompare}
                    onRestart={handleRestartAssessment}
                    isCompared={(id) => comparedSessionIds.includes(id)}
                  />
                )}
              </>
            )}
          </div>
        )}

        {/* VIEW 3: EXPLORE ALL EXPERIENCES */}
        {currentView === 'explore' && (
          <ExploreSessions
            sessions={sessions}
            onBook={(session) => setBookingSession(session)}
            onExplore={(session) => setDetailSession(session)}
            onToggleCompare={handleToggleCompare}
            isCompared={(id) => comparedSessionIds.includes(id)}
            onStartAssessment={() => {
              setCurrentView('assessment');
              setCurrentStep(1);
            }}
            onViewComparison={() => setCurrentView('compare')}
            compareCount={comparedSessionIds.length}
          />
        )}

        {/* VIEW 4: COMPARE SESSIONS */}
        {currentView === 'compare' && (
          <ComparisonWidget
            sessions={comparedSessionsList}
            onRemove={handleRemoveCompare}
            onClear={handleClearCompare}
            onBook={(session) => setBookingSession(session)}
            onExplore={(session) => setDetailSession(session)}
            onExploreMore={() => setCurrentView('explore')}
          />
        )}

        {/* VIEW 5: ADMIN PORTAL */}
        {currentView === 'admin' && (
          <AdminPortal
            sessions={sessions}
            onRefresh={fetchSessions}
            onClose={() => setCurrentView('home')}
          />
        )}
      </main>

      {/* Floating NaadPath Assistant Button */}
      <FloatingButton
        onOpenAssessment={() => {
          setCurrentView('assessment');
          setCurrentStep(1);
        }}
        isVisible={currentView !== 'assessment'}
      />

      {/* Modals */}
      <BookingModal
        session={bookingSession}
        onClose={() => setBookingSession(null)}
      />

      <SessionDetailModal
        session={detailSession}
        onClose={() => setDetailSession(null)}
        onBook={(s) => setBookingSession(s)}
        onTalkToPractitioner={(s) => handleOpenPractitioner(s)}
      />

      {isPractitionerModalOpen && (
        <PractitionerModal
          session={practitionerModalSession}
          onClose={() => setIsPractitionerModalOpen(false)}
        />
      )}

      {isRelaxationInfoOpen && (
        <RelaxationInfoModal
          onClose={() => setIsRelaxationInfoOpen(false)}
          onTalkToPractitioner={() => {
            setIsRelaxationInfoOpen(false);
            handleOpenPractitioner();
          }}
        />
      )}

      {/* Global Footer */}
      <footer className="mt-auto bg-[#F4EFE6] border-t border-[#E5DAC8] py-10 px-4 text-xs text-[#70685D]">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="font-serif-heading text-base font-semibold text-[#1A1815] uppercase tracking-wider">
                Yantra Naad
              </span>
              <span className="text-[10px] uppercase tracking-widest text-[#8C6D3B] font-bold">
                Sound Sanctuary
              </span>
            </div>
            <p className="text-[11px] text-[#7A7165]">
              Sound vibrational healing, Tibetan singing bowl baths & meditative restoration.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-xs font-medium text-[#574F44]">
            <button
              onClick={() => handleStartAssessment()}
              className="hover:text-[#1A1815] transition-colors"
            >
              NaadPath Guide
            </button>
            <span>•</span>
            <button
              onClick={() => setCurrentView('explore')}
              className="hover:text-[#1A1815] transition-colors"
            >
              Session Catalogue
            </button>
            <span>•</span>
            <button
              onClick={() => setIsRelaxationInfoOpen(true)}
              className="hover:text-[#1A1815] transition-colors"
            >
              Sound Science
            </button>
            <span>•</span>
            <button
              onClick={() => handleOpenPractitioner()}
              className="hover:text-[#1A1815] transition-colors"
            >
              Contact Facilitator
            </button>
            <span>•</span>
            <button
              onClick={() => setCurrentView('admin')}
              className="hover:text-[#1A1815] transition-colors"
            >
              Admin Portal
            </button>
          </div>

          <div className="text-[11px] text-[#8C8377] text-center md:text-right max-w-sm">
            Wellness Guidance System. Non-diagnostic. All rights reserved © {new Date().getFullYear()} Yantra Naad.
          </div>
        </div>
      </footer>
    </div>
  );
}
