import { YantraSession, ConcernCategory, PersonalGoalOption } from '../types';

export const INITIAL_SESSIONS: YantraSession[] = [
  {
    id: "deep-relaxation-sound-bath",
    slug: "deep-relaxation-sound-bath",
    name: "Deep Relaxation Sound Bath",
    shortDescription: "A calming sound experience designed to encourage deep relaxation, mental unwinding and restorative rest.",
    fullDescription: "Immerse yourself in gentle resonant acoustic waves produced by handcrafted Himalayan singing bowls, soft bronze gongs, and quartz crystal vessels. This session creates an ambient acoustic blanket that slows brainwave patterns from active beta states into serene alpha and theta frequencies, facilitating natural body decompression and ease.",
    image: "https://images.unsplash.com/photo-1545205597-3d9d02c29597?auto=format&fit=crop&w=1200&q=80",
    duration: "60 minutes",
    price: "$95 / participant",
    sessionType: ["individual", "group"],
    intensity: "gentle",
    tags: [
      "stress",
      "relaxation",
      "physical-relaxation",
      "mental-reset",
      "sleep",
      "gentle",
      "individual",
      "group"
    ],
    goals: [
      "deep-relaxation",
      "stress-release",
      "mental-reset",
      "physical-relaxation",
      "restful-sleep"
    ],
    suitableFor: [
      "Visitors feeling overwhelmed or carrying muscular stiffness",
      "Anyone experiencing restless sleep or bedtime tension",
      "First-time sound bath participants seeking a gentle introduction",
      "Professionals seeking a complete mental pause"
    ],
    precautions: [
      "Please inform the facilitator if you have sound-triggered epilepsy or hyperacusis",
      "Comfortable blankets and bolsters are provided; lie flat or slightly elevated as comfortable",
      "Gentle sound levels calibrated well within therapeutic, relaxing thresholds"
    ],
    bookingUrl: "/book/deep-relaxation",
    active: true,
    instruments: ["Handmade Himalayan Singing Bowls", "Chau Gong", "Ocean Drum", "Koshi Chimes"]
  },
  {
    id: "emotional-balance-session",
    slug: "emotional-balance-session",
    name: "Emotional Balance Sound Experience",
    shortDescription: "A guided sound-based wellness experience intended to support relaxation, grounding and emotional reflection.",
    fullDescription: "A contemplative, sacred sanctuary of sound crafted to help diffuse emotional heaviness, grief, anxiety, or internal stagnation. Utilizing warm harmonic intervals, grounding root-frequency bronze bowls, and gentle breath cues, this journey encourages gentle emotional release and an authentic return to your personal centre.",
    image: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=1200&q=80",
    duration: "60 minutes",
    price: "$135 / private session",
    sessionType: ["individual"],
    intensity: "gentle",
    tags: [
      "emotional-wellness",
      "grounding",
      "relaxation",
      "mindfulness",
      "individual",
      "gentle"
    ],
    goals: [
      "emotional-balance",
      "grounding",
      "mindfulness",
      "stress-release"
    ],
    suitableFor: [
      "Those processing major life transitions, grief, or emotional fatigue",
      "Visitors feeling ungrounded, scattered, or holding internal tension",
      "Individuals desiring a quiet, confidential private healing container"
    ],
    precautions: [
      "This is a supportive wellness space and does not replace psychiatric psychotherapy or grief counselling",
      "Emotional responses (such as tears or deep sighs) are normal and welcomed in this safe environment"
    ],
    bookingUrl: "/book/emotional-balance",
    active: true,
    instruments: ["Heavy Tibetan Root Bowls", "Tubular Sound Chimes", "Rainstick", "Soft Tingshas"]
  },
  {
    id: "yoga-sound-alignment",
    slug: "yoga-sound-alignment",
    name: "Yoga & Sound Alignment",
    shortDescription: "A combined movement, mindful breathing and sound experience supporting body awareness and relaxation.",
    fullDescription: "Harmonize physical movement with acoustic vibration. This session pairs gentle, restorative somatic yoga postures and conscious diaphragmatic breathwork with live singing bowl acoustic resonances, easing muscle fascial holding and awakening vitality without physical strain.",
    image: "https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=1200&q=80",
    duration: "75 minutes",
    price: "$110 / session",
    sessionType: ["individual", "group"],
    intensity: "moderate",
    tags: [
      "yoga",
      "energy",
      "mindfulness",
      "physical-relaxation",
      "grounding",
      "individual",
      "group"
    ],
    goals: [
      "energy-balancing",
      "mindfulness",
      "physical-relaxation",
      "overall-wellbeing"
    ],
    suitableFor: [
      "Individuals experiencing postural stiffness from desk work",
      "Those who enjoy gentle yoga alongside acoustic sound baths",
      "Visitors wanting to cultivate grounded somatic awareness"
    ],
    precautions: [
      "Modifications offered for all poses; please move only within pain-free ranges of motion",
      "Not recommended during acute joint sprains or immediately following surgery"
    ],
    bookingUrl: "/book/yoga-sound",
    active: true,
    instruments: ["Chakra-Tuned Crystal Bowls", "Harmonium", "Tingsha Cymbals", "Wind Gong"]
  },
  {
    id: "meditative-sound-journey",
    slug: "meditative-sound-journey",
    name: "Meditative Sound Journey",
    shortDescription: "An immersive meditative experience combining guided awareness with therapeutic sound instruments.",
    fullDescription: "A profound journey into inner stillness. Through complex acoustic layers of resonant overtone-rich gongs, drone shruti boxes, and ancient singing bowls, this session gently suspends linear thought chatter, guiding the consciousness toward deep meditative absorption and expanded peace.",
    image: "https://images.unsplash.com/photo-1517021897933-0e0319cfbc28?auto=format&fit=crop&w=1200&q=80",
    duration: "60 minutes",
    price: "$95 / participant",
    sessionType: ["individual", "group"],
    intensity: "immersive",
    tags: [
      "meditation",
      "inner-stillness",
      "mental-reset",
      "mindfulness",
      "grounding",
      "immersive",
      "individual",
      "group"
    ],
    goals: [
      "meditation",
      "mental-reset",
      "inner-stillness",
      "grounding"
    ],
    suitableFor: [
      "Meditators wishing to deepen contemplation or overcome mental restlessness",
      "Creative thinkers seeking clarity, perspective, and renewed focus",
      "Visitors ready for a rich, overtone-dense acoustic environment"
    ],
    precautions: [
      "Features dynamic volume swells and overtone-rich acoustic instruments",
      "May not be suitable for people sensitive to sound immersion or with severe tinnitus"
    ],
    bookingUrl: "/book/sound-journey",
    active: true,
    instruments: ["Paiste Planetary Symphonic Gong", "Quartz Crystal Harps", "Tibetan Singing Bowls", "Monochord"]
  },
  {
    id: "yoga-nidra-sound-sanctuary",
    slug: "yoga-nidra-sound-sanctuary",
    name: "Yoga Nidra & Harmonic Rest Sanctuary",
    shortDescription: "A deeply restorative yogic sleep immersion layered with soothing sound vibrations for nervous system reset.",
    fullDescription: "Experience the profound restorative power of conscious relaxation. Guided systematically through physical body scans and subtle breath visualizations while supported by low-frequency, heart-opening singing bowls, you hover peacefully on the threshold between waking consciousness and dreamless sleep.",
    image: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=1200&q=80",
    duration: "75 minutes",
    price: "$105 / participant",
    sessionType: ["individual", "group"],
    intensity: "gentle",
    tags: [
      "sleep",
      "relaxation",
      "stress",
      "gentle",
      "mindfulness",
      "restful-sleep"
    ],
    goals: [
      "restful-sleep",
      "deep-relaxation",
      "stress-release",
      "mental-reset"
    ],
    suitableFor: [
      "People suffering from prolonged fatigue, burnout, or insomnia",
      "Those who struggle to meditate while sitting upright",
      "Anyone needing deep nervous system recuperation"
    ],
    precautions: [
      "You will be resting horizontally for approximately 60-70 minutes; warm layers are recommended",
      "Extremely gentle acoustic levels"
    ],
    bookingUrl: "/book/yoga-nidra-sound",
    active: true,
    instruments: ["Low F# Tibetan Earth Bowl", "Wave Drum", "Crystal Lyre", "Acoustic Chimes"]
  }
];

export const CONCERN_CATEGORIES: ConcernCategory[] = [
  {
    id: "physical-comfort",
    title: "Physical Comfort",
    subtitle: "Body stiffness, tension & fatigue",
    iconName: "Activity",
    concerns: [
      { id: "joint-discomfort", label: "Joint discomfort", description: "Sensations of tightness or sensitivity in joints" },
      { id: "muscle-tension", label: "Muscle tension", description: "Holding tension in shoulders, neck, or back" },
      { id: "body-stiffness", label: "Body stiffness", description: "General bodily tightness from posture or activity" },
      { id: "physical-fatigue", label: "Physical fatigue", description: "Exhaustion and heavy physical energy" }
    ]
  },
  {
    id: "mental-wellness",
    title: "Mental Wellness",
    subtitle: "Stress, overthinking & mental reset",
    iconName: "Brain",
    concerns: [
      { id: "stress", label: "Stress", description: "Daily nervous tension and pressure" },
      { id: "overthinking", label: "Overthinking", description: "Persistent spinning thoughts and busy mind" },
      { id: "difficulty-relaxing", label: "Difficulty relaxing", description: "Struggling to downshift into stillness" },
      { id: "mental-fatigue", label: "Mental fatigue", description: "Cognitive cloudiness or mental burnout" },
      { id: "need-for-mental-reset", label: "Need for a mental reset", description: "Desire to refresh focus and clarity" }
    ]
  },
  {
    id: "emotional-wellness",
    title: "Emotional Wellness",
    subtitle: "Balance, heaviness & grounding",
    iconName: "Heart",
    concerns: [
      { id: "feeling-overwhelmed", label: "Feeling overwhelmed", description: "Sensory or emotional overload" },
      { id: "emotional-heaviness", label: "Emotional heaviness", description: "Weight of recent events, sorrow or fatigue" },
      { id: "need-for-grounding", label: "Need for grounding", description: "Feeling unanchored or disconnected" },
      { id: "emotional-balance", label: "Emotional balance", description: "Seeking calm equilibrium in feelings" }
    ]
  },
  {
    id: "sleep-rest",
    title: "Sleep & Rest",
    subtitle: "Restless nights & bedtime unwinding",
    iconName: "Moon",
    concerns: [
      { id: "difficulty-unwinding", label: "Difficulty unwinding", description: "Unable to switch off after the day ends" },
      { id: "restless-sleep", label: "Restless sleep", description: "Waking frequently or light interrupted sleep" },
      { id: "bedtime-relaxation", label: "Bedtime relaxation", description: "Preparing the body for deep slumber" },
      { id: "need-for-deeper-rest", label: "Need for deeper rest", description: "Yearning for genuine, restorative downtime" }
    ]
  },
  {
    id: "energy-mindfulness",
    title: "Energy & Mindfulness",
    subtitle: "Vitality, meditation & inner stillness",
    iconName: "Sparkles",
    concerns: [
      { id: "low-energy", label: "Low energy", description: "Depleted vitality and sluggishness" },
      { id: "feeling-drained", label: "Feeling drained", description: "Subtle drain from modern digital demands" },
      { id: "difficulty-feeling-centred", label: "Difficulty feeling centred", description: "Finding it hard to inhabit your center" },
      { id: "meditation-support", label: "Meditation support", description: "Assistance holding mindful presence" },
      { id: "inner-stillness", label: "Inner stillness", description: "Connecting with quiet inner sanctuary" }
    ]
  }
];

export const GOAL_OPTIONS: PersonalGoalOption[] = [
  { id: "deep-relaxation", label: "Deep relaxation", tagEquivalent: "relaxation", description: "Gentle acoustic immersion to soothe somatic holding", iconName: "Feather" },
  { id: "stress-release", label: "Stress release", tagEquivalent: "stress", description: "Diffuse nervous system tension and racing thoughts", iconName: "Wind" },
  { id: "mental-reset", label: "Mental reset", tagEquivalent: "mental-reset", description: "Clear cognitive clutter and restore tranquil clarity", iconName: "RotateCcw" },
  { id: "emotional-balance", label: "Emotional balance", tagEquivalent: "emotional-wellness", description: "Nurturing reflection to soften emotional weight", iconName: "Heart" },
  { id: "mindfulness", label: "Mindfulness", tagEquivalent: "mindfulness", description: "Cultivate present-moment awareness through sound", iconName: "Eye" },
  { id: "grounding", label: "Grounding", tagEquivalent: "grounding", description: "Anchor yourself with low-frequency resonance", iconName: "Anchor" },
  { id: "restful-sleep", label: "Restful sleep support", tagEquivalent: "sleep", description: "Invite deep unwinding suitable for nighttime replenishment", iconName: "Moon" },
  { id: "physical-relaxation", label: "Physical relaxation", tagEquivalent: "physical-relaxation", description: "Ease muscle stiffness and postural tension", iconName: "Sparkle" },
  { id: "energy-balancing", label: "Energy balancing", tagEquivalent: "energy", description: "Harmonize vital pranic flow through conscious tone", iconName: "Zap" },
  { id: "meditation", label: "Meditation", tagEquivalent: "meditation", description: "Enter serene, sustained contemplative stillness", iconName: "Compass" },
  { id: "overall-wellbeing", label: "Overall well-being", tagEquivalent: "relaxation", description: "Holistic, nourishing realignment for body and mind", iconName: "Sun" }
];
