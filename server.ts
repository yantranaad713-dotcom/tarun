import express, { Request, Response } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import { INITIAL_SESSIONS } from './src/data/sessionsData.ts';
import { calculateRecommendation, runSafetyCheck } from './src/utils/matchingEngine.ts';
import { YantraSession, AssessmentPayload } from './src/types.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// In-memory persistent session database
let sessionDatabase: YantraSession[] = JSON.parse(JSON.stringify(INITIAL_SESSIONS));

// Temporary in-memory storage for contact, intake, and booking interest (anonymized/minimized)
const intakeRecords: Array<Record<string, unknown>> = [];
const contactInquiries: Array<Record<string, unknown>> = [];
const bookingInterests: Array<Record<string, unknown>> = [];

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // 1. Health check
  app.get('/api/health', (req: Request, res: Response) => {
    res.json({ status: 'ok', service: 'NaadPath REST API', timestamp: new Date().toISOString() });
  });

  // 2. GET /api/sessions
  app.get('/api/sessions', (req: Request, res: Response) => {
    const includeInactive = req.query.all === 'true';
    const sessions = includeInactive
      ? sessionDatabase
      : sessionDatabase.filter((s) => s.active !== false);
    res.json({ sessions, total: sessions.length });
  });

  // 3. GET /api/sessions/:id
  app.get('/api/sessions/:id', (req: Request, res: Response) => {
    const idOrSlug = req.params.id;
    const session = sessionDatabase.find((s) => s.id === idOrSlug || s.slug === idOrSlug);
    if (!session) {
      return res.status(404).json({ error: 'Session not found in Yantra Naad database' });
    }
    res.json({ session });
  });

  // 4. POST /api/recommend
  app.post('/api/recommend', (req: Request, res: Response) => {
    try {
      const payload: AssessmentPayload = req.body;
      if (!payload || !payload.selectedConcerns) {
        return res.status(400).json({ error: 'Invalid assessment payload' });
      }

      const recommendation = calculateRecommendation(sessionDatabase, payload);

      // Respect privacy: Only record anonymous metric if user consented
      if (payload.consentedToHealthDataStorage) {
        intakeRecords.push({
          id: `intake-${Date.now()}`,
          timestamp: new Date().toISOString(),
          concernsCount: payload.selectedConcerns.length,
          primaryRecommendationId: recommendation.primaryRecommendation?.id,
          safetyApproved: recommendation.safetyStatus.isSafeToProceed
        });
      }

      res.json(recommendation);
    } catch (err) {
      console.error('Error generating recommendation:', err);
      res.status(500).json({ error: 'Internal recommendation calculation error' });
    }
  });

  // 5. POST /api/intake
  app.post('/api/intake', (req: Request, res: Response) => {
    const { name, email, consent, responses } = req.body;
    if (!consent) {
      return res.status(200).json({
        success: true,
        message: 'Intake processed anonymously. Health responses were not permanently stored.',
        stored: false
      });
    }

    const record = {
      id: `intake-${Date.now()}`,
      clientName: name || 'Anonymous Guest',
      email: email || null,
      submittedAt: new Date().toISOString(),
      responsesSummary: responses
    };
    intakeRecords.push(record);

    res.status(201).json({
      success: true,
      message: 'Intake saved with explicit consent for your upcoming session consultation.',
      intakeId: record.id
    });
  });

  // 6. POST /api/contact
  app.post('/api/contact', (req: Request, res: Response) => {
    const { name, email, phone, preferredContact, concernSummary, recommendedSessionId, message } = req.body;
    if (!name || (!email && !phone)) {
      return res.status(400).json({ error: 'Please provide a name and at least one contact method (email or phone).' });
    }

    const inquiry = {
      id: `inquiry-${Date.now()}`,
      name,
      email,
      phone,
      preferredContact: preferredContact || 'email',
      concernSummary,
      recommendedSessionId,
      message,
      status: 'pending_practitioner_review',
      receivedAt: new Date().toISOString()
    };
    contactInquiries.push(inquiry);

    res.status(201).json({
      success: true,
      message: 'Thank you. A Yantra Naad sound practitioner will contact you shortly.',
      inquiryId: inquiry.id
    });
  });

  // 7. POST /api/booking-interest
  app.post('/api/booking-interest', (req: Request, res: Response) => {
    const { sessionId, sessionName, format, visitorName, email, phone, preferredTiming, specialRequests } = req.body;
    if (!sessionId || !visitorName || (!email && !phone)) {
      return res.status(400).json({ error: 'Missing required booking information.' });
    }

    const interest = {
      id: `booking-${Date.now()}`,
      sessionId,
      sessionName,
      format,
      visitorName,
      email,
      phone,
      preferredTiming,
      specialRequests,
      status: 'provisional',
      createdAt: new Date().toISOString()
    };
    bookingInterests.push(interest);

    res.status(201).json({
      success: true,
      message: `Your booking interest for "${sessionName || sessionId}" has been recorded. Our studio team will reach out with confirmed availability.`,
      bookingId: interest.id
    });
  });

  // 8. Admin Endpoints for Session Database Management
  app.post('/api/admin/sessions', (req: Request, res: Response) => {
    const newSession: YantraSession = req.body;
    if (!newSession.name || !newSession.id) {
      return res.status(400).json({ error: 'Session must have a name and id' });
    }
    // ensure unique id
    const existingIndex = sessionDatabase.findIndex((s) => s.id === newSession.id);
    if (existingIndex >= 0) {
      return res.status(400).json({ error: 'A session with this ID already exists' });
    }
    sessionDatabase.push({
      ...newSession,
      active: newSession.active ?? true
    });
    res.status(201).json({ success: true, session: newSession, total: sessionDatabase.length });
  });

  app.put('/api/admin/sessions/:id', (req: Request, res: Response) => {
    const id = req.params.id;
    const index = sessionDatabase.findIndex((s) => s.id === id);
    if (index === -1) {
      return res.status(404).json({ error: 'Session not found to update' });
    }
    sessionDatabase[index] = {
      ...sessionDatabase[index],
      ...req.body,
      id // preserve ID integrity
    };
    res.json({ success: true, session: sessionDatabase[index] });
  });

  app.delete('/api/admin/sessions/:id', (req: Request, res: Response) => {
    const id = req.params.id;
    const initialLen = sessionDatabase.length;
    sessionDatabase = sessionDatabase.filter((s) => s.id !== id);
    if (sessionDatabase.length === initialLen) {
      return res.status(404).json({ error: 'Session not found to delete' });
    }
    res.json({ success: true, message: `Session ${id} removed successfully`, remaining: sessionDatabase.length });
  });

  app.post('/api/admin/reset', (req: Request, res: Response) => {
    sessionDatabase = JSON.parse(JSON.stringify(INITIAL_SESSIONS));
    res.json({ success: true, message: 'Sessions reset to pristine factory catalog', sessions: sessionDatabase });
  });

  // Vite middleware setup
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`NaadPath server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
});
