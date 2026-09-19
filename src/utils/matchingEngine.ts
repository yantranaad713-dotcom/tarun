import {
  YantraSession,
  AssessmentPayload,
  RecommendationResponse,
  SafetyCheckResult,
  AlignmentLevel
} from '../types';

export function runSafetyCheck(payload: AssessmentPayload): SafetyCheckResult {
  const { backgroundAnswers } = payload;
  const isSevereIntensity = backgroundAnswers.intensity === 'Severe';
  const hasSignificantInjury = backgroundAnswers.recentInjuryOrSurgery === 'Yes';
  const hasRedFlags = backgroundAnswers.hasRedFlags === 'Yes';
  const conditions = backgroundAnswers.medicalConditions || [];

  const hasHighRiskCondition = conditions.some((c: string) =>
    ['sound-induced-seizures-or-epilepsy', 'pacemaker-or-implantable-device', 'severe-clinical-mental-distress'].includes(c)
  );

  // Check if red flags, severe distress, or high-risk medical contraindications are triggered
  if (hasRedFlags || hasHighRiskCondition || (isSevereIntensity && hasSignificantInjury)) {
    let specificGuidance = [
      "Sudden, severe, or rapidly changing symptoms require direct medical evaluation.",
      "Sound vibrational wellness sessions are supportive relaxation experiences and are not designed to evaluate, diagnose, or treat urgent medical conditions.",
      "Once cleared by your doctor or healthcare specialist, we welcome you to explore gentle restorative relaxation sessions."
    ];

    if (conditions.includes('sound-induced-seizures-or-epilepsy')) {
      specificGuidance = [
        "Acoustic vibrations and resonance frequencies can potentially trigger sensitivity in individuals with sound-induced seizures or epilepsy.",
        "We strongly advise consulting your neurologist or primary physician before participating in an acoustic sound bath.",
        "Our practitioners can discuss customized, ambient-volume private alternatives once cleared by your medical provider."
      ];
    } else if (conditions.includes('pacemaker-or-implantable-device')) {
      specificGuidance = [
        "Strong acoustic waves and bowls placed directly on or near the torso can interact with sensitive cardiac pacemakers or metallic implants.",
        "Please seek guidance from your cardiologist or surgeon regarding acoustic vibrational therapies.",
        "You may explore distant-listening ambient sessions or gentle breathing practices that do not use tactile bowl placement."
      ];
    }

    return {
      isSafeToProceed: false,
      safetyTitle: "Your well-being comes first.",
      safetyMessage: "Based on what you have shared, it may be more appropriate to speak with a qualified healthcare professional before participating in a wellness session.",
      guidancePoints: specificGuidance,
      allowsGeneralRelaxationExploration: true
    };
  }

  // Also warn if severe intensity alone is selected
  if (isSevereIntensity) {
    return {
      isSafeToProceed: false,
      safetyTitle: "Your well-being comes first.",
      safetyMessage: "Based on what you have shared, it may be more appropriate to speak with a qualified healthcare professional before participating in a wellness session.",
      guidancePoints: [
        "Experiencing severe discomfort or acute distress warrants medical guidance from a qualified physician.",
        "Sound therapy works best as a gentle adjunct for relaxation and stress management, not as acute care.",
        "You may still browse general relaxation principles and sound wellness knowledge below."
      ],
      allowsGeneralRelaxationExploration: true
    };
  }

  return {
    isSafeToProceed: true,
    safetyTitle: "Safety Assessment Clear",
    safetyMessage: "Your responses are compatible with gentle, non-invasive sound wellness experiences.",
    guidancePoints: [],
    allowsGeneralRelaxationExploration: true
  };
}

// Concern ID to matching tags mapping
const CONCERN_TAG_MAP: Record<string, string[]> = {
  'joint-discomfort': ['physical-relaxation', 'relaxation', 'gentle'],
  'muscle-tension': ['physical-relaxation', 'relaxation', 'yoga'],
  'body-stiffness': ['physical-relaxation', 'yoga', 'grounding'],
  'physical-fatigue': ['relaxation', 'sleep', 'restful-sleep', 'gentle'],
  'stress': ['stress', 'relaxation', 'mental-reset'],
  'overthinking': ['mental-reset', 'meditation', 'mindfulness'],
  'difficulty-relaxing': ['relaxation', 'gentle', 'mental-reset'],
  'mental-fatigue': ['mental-reset', 'inner-stillness', 'meditation'],
  'need-for-mental-reset': ['mental-reset', 'meditation', 'relaxation'],
  'feeling-overwhelmed': ['emotional-wellness', 'relaxation', 'grounding', 'gentle'],
  'emotional-heaviness': ['emotional-wellness', 'grounding', 'relaxation'],
  'need-for-grounding': ['grounding', 'mindfulness', 'energy'],
  'emotional-balance': ['emotional-wellness', 'grounding', 'mindfulness'],
  'difficulty-unwinding': ['sleep', 'relaxation', 'gentle'],
  'restless-sleep': ['sleep', 'restful-sleep', 'relaxation'],
  'bedtime-relaxation': ['sleep', 'relaxation', 'gentle'],
  'need-for-deeper-rest': ['sleep', 'relaxation', 'restful-sleep'],
  'low-energy': ['energy', 'yoga', 'grounding'],
  'feeling-drained': ['relaxation', 'energy', 'grounding'],
  'difficulty-feeling-centred': ['grounding', 'mindfulness', 'meditation'],
  'meditation-support': ['meditation', 'mindfulness', 'inner-stillness'],
  'inner-stillness': ['inner-stillness', 'meditation', 'mindfulness']
};

export function calculateRecommendation(
  sessions: YantraSession[],
  payload: AssessmentPayload
): RecommendationResponse {
  const safetyStatus = runSafetyCheck(payload);

  if (!safetyStatus.isSafeToProceed) {
    return {
      safetyStatus,
      primaryRecommendation: null,
      alternativeRecommendations: [],
      matchingReasons: {
        summary: "Medical assessment prioritized",
        details: ["Consultation with a healthcare professional recommended prior to booking."],
        disclaimerSnippet: "NaadPath prioritizes your safety above all else."
      },
      alignmentLevel: 'Alternative Experience',
      generalDisclaimer: "NaadPath is a wellness guidance tool designed to help you explore Yantra Naad experiences according to your preferences and wellness goals. It does not provide medical diagnosis, medical treatment or medical advice. If you have persistent, severe or unexplained symptoms, please consult an appropriate healthcare professional."
    };
  }

  const activeSessions = sessions.filter(s => s.active !== false);

  // Score each session
  const scored = activeSessions.map(session => {
    let score = 0;
    const matchDetails: string[] = [];

    // 1. Match Goals (High Weight: 5 points per match)
    payload.selectedGoals.forEach(goalId => {
      if (session.goals.includes(goalId)) {
        score += 5;
        matchDetails.push(`Directly addresses your goal of "${goalId.replace(/-/g, ' ')}"`);
      }
    });

    // 2. Match Concerns (Weight: 3 points per tag overlap)
    payload.selectedConcerns.forEach(concernId => {
      const relevantTags = CONCERN_TAG_MAP[concernId] || [];
      relevantTags.forEach(tag => {
        if (session.tags.includes(tag)) {
          score += 2;
        }
      });
    });

    // 3. Match Preferred Session Environment/Type
    const prefEnv = payload.backgroundAnswers.preferredEnvironment;
    if (prefEnv) {
      if (prefEnv.includes('individual') && session.sessionType.includes('individual')) {
        score += 4;
        matchDetails.push('Available as a private individual experience');
      } else if (prefEnv.includes('group') && session.sessionType.includes('group')) {
        score += 4;
        matchDetails.push('Available in a supportive group sound bath format');
      } else if (prefEnv.includes('Yoga') && session.tags.includes('yoga')) {
        score += 6;
        matchDetails.push('Integrates mindful yoga movement and sound');
      }
    }

    // 4. Match Intensity
    const prefIntensity = payload.backgroundAnswers.preferredIntensity;
    if (prefIntensity) {
      const normalized = prefIntensity.toLowerCase();
      if (normalized.includes('gentle') && session.intensity === 'gentle') {
        score += 4;
        matchDetails.push('Matches your preference for gentle, soothing acoustic volume');
      } else if (normalized.includes('immersive') && session.intensity === 'immersive') {
        score += 4;
        matchDetails.push('Matches your desire for an immersive acoustic journey');
      }
    }

    // 5. Background first time experience
    if (payload.backgroundAnswers.firstTimeExperience === 'Yes') {
      if (session.intensity === 'gentle') {
        score += 3;
        matchDetails.push('Gentle introductory pace well-suited for first-time sound explorers');
      }
    }

    return {
      session: {
        ...session,
        alignmentScore: score,
        matchReasons: Array.from(new Set(matchDetails))
      },
      score
    };
  });

  // Sort descending by score
  scored.sort((a, b) => b.score - a.score);

  const primary = scored[0]?.session || activeSessions[0];
  const alternatives = scored.slice(1, 3).map(item => item.session);

  // Generate personalized "Why this was selected for you" explanation
  const concernsList = payload.selectedConcerns.map(c => c.replace(/-/g, ' ')).join(', ');
  const goalsList = payload.selectedGoals.map(g => g.replace(/-/g, ' ')).join(' and ');

  let rationale = `You shared an intention for ${goalsList || 'restorative balance'}`;
  if (concernsList) {
    rationale += ` alongside support with ${concernsList}`;
  }
  rationale += `. This experience uses a ${primary.intensity} sound environment designed to encourage relaxation, mental unwinding and restorative rest.`;

  const alignmentLevel: AlignmentLevel = primary.alignmentScore && primary.alignmentScore >= 12
    ? 'Strong Alignment'
    : 'Good Alignment';

  return {
    safetyStatus,
    primaryRecommendation: primary,
    alternativeRecommendations: alternatives,
    matchingReasons: {
      summary: rationale,
      details: primary.matchReasons && primary.matchReasons.length > 0
        ? primary.matchReasons.slice(0, 4)
        : [
            "Harmonizes with your preferred session atmosphere and intensity",
            "Utilizes therapeutic sound instruments calibrated for mental ease",
            "Supports natural physical relaxation without strain"
          ],
      disclaimerSnippet: `This recommendation relates to your wellness goals and is not a diagnosis or treatment recommendation for the underlying cause of ${concernsList || 'any condition'}.`
    },
    alignmentLevel,
    generalDisclaimer: "NaadPath is a wellness guidance tool designed to help you explore Yantra Naad experiences according to your preferences and wellness goals. It does not provide medical diagnosis, medical treatment or medical advice. If you have persistent, severe or unexplained symptoms, please consult an appropriate healthcare professional."
  };
}
