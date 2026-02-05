require('dotenv').config();
const express = require('express');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
const multer = require('multer');
const mammoth = require('mammoth');
const { v4: uuidv4 } = require('uuid');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const admin = require('firebase-admin');
const { GoogleGenerativeAI } = require('@google/generative-ai');

// ================== INITIAL SETUP ==================
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
});
const upload = multer({ storage: multer.memoryStorage() });
const PORT = 3000;

const serviceAccount = {
  type: process.env.FIREBASE_TYPE,
  project_id: process.env.FIREBASE_PROJECT_ID,
  private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
  private_key: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'), // fix newlines
  client_email: process.env.FIREBASE_CLIENT_EMAIL,
  client_id: process.env.FIREBASE_CLIENT_ID,
  token_uri: process.env.FIREBASE_TOKEN_URI,
};
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});


// Google Generative AI Setup
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({
  model: 'models/gemini-2.5-flash',
});

// Middleware
app.use(express.json());
app.use(cors());
app.use(bodyParser.json());

// ================== CONSTANTS ==================
const BASE_PROMPT = `
You are a professional CV evaluator and recruiter. Analyze CVs objectively and like a real hiring manager.

Rules:
- Return ONLY valid JSON in a single line with no spaces or line breaks.
- Escape all double quotes inside strings with backslash (\").
- Include all relevant experience/projects as separate objects in the "experience" array.
- If a field is missing, return null for text fields and empty array for lists.
- Use cv_score.rating as one of: "Outstanding", "Strong", "Average", "Weak".
- Do NOT include explanations, markdown, or text outside JSON.

Follow this exact JSON structure:

{ "candidate": { "full_name": null, "email": null, "phone": null, "location": null, "linkedin": null, "portfolio": null }, "target_role": null, "summary": null, "skills": { "technical": [], "soft": [], "tools": [] }, "experience": [ { "job_title": null, "company": null, "duration": null, "key_points": [] } ], "education": [ { "degree": null, "institution": null, "year": null } ], "certifications": [], "strengths": [], "weaknesses": [], "improvement_suggestions": [], "cv_score": { "score": 0, "rating": null } }
`;

// ================== ROUTES ==================

// --- Health Check ---
app.get('/', (req, res) => {
  res.json({ message: 'Express server running', timestamp: new Date() });
});

// --- Authentication / Login ---
app.post('/login', async (req, res) => {
  const { token } = req.body;
  try {
    const decoded = await admin.auth().verifyIdToken(token);
    res.status(200).json({
      message: 'Login verified',
      uid: decoded.uid,
      email: decoded.email,
    });
  } catch {
    res.status(401).json({ error: 'Unauthorized' });
  }
});

// --- File Upload & CV Processing ---
app.post('/upload', upload.array('cvs'), async (req, res) => {
  try {
    const results = [];

    for (const file of req.files) {
      const candidateId = uuidv4();

      const { value: resumeText } = await mammoth.extractRawText({ buffer: file.buffer });

      const geminiResponse = await model.generateContent([{ text: `${BASE_PROMPT}\n\nRESUME:\n${resumeText}` }]);
      const aiText = geminiResponse.response.text();

      let aiAnalysis;
      try {
        aiAnalysis = JSON.parse(aiText);
      } catch {
        aiAnalysis = { raw: aiText };
      }

      await admin.firestore().collection('candidates').doc(candidateId).set({
        fileName: file.originalname,
        aiAnalysis,
        uploadedAt: new Date(),
      });

      results.push({ candidateId, fileName: file.originalname });
    }

    res.json({ success: true, results });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Bulk upload failed' });
  }
});

// --- Fetch Candidates ---
app.get('/candidates', async (req, res) => {
  try {
    const snapshot = await admin.firestore()
      .collection('candidates')
      .orderBy('uploadedAt', 'desc')
      .get();

    const candidates = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.json(candidates);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch candidates' });
  }
});

// --- Schedule Interview & Send Email ---
app.post('/schedule', async (req, res) => {
  const { candidateEmail, candidateName, date, candidateId } = req.body;

  if (!candidateEmail || !date) return res.status(400).json({ error: 'Email and date are required' });

  const id = uuidv4();
  const password = uuidv4().slice(0, 8);

  // Save schedule to Firestore
  await admin.firestore().collection('schedules').doc(candidateId).set({
    candidateName,
    date,
    scheduledAt: date,
    interviewId: id,
    interviewPassword: password,
    code: id + password,
  });

  try {
    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      secure: false,
      auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
      family: 4,
    });

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: candidateEmail,
      subject: 'Interview Scheduled',
      text: `Hello ${candidateName || ""},\n\nYour interview has been scheduled for ${new Date(date).toLocaleString()}.
      Join using:
      username: ${id}
      password: ${password}
      
      Best regards,
      HR Team`,
    });

    res.json({ message: 'Interview scheduled and email sent successfully!' });
  } catch (error) {
    console.error('Email error:', error);
    res.status(500).json({ error: 'Failed to send email' });
  }
});

// --- Fetch Schedules ---
app.get('/schedule', async (req, res) => {
  try {
    const snapshot = await admin.firestore()
      .collection('schedules')
      .orderBy('scheduledAt', 'desc')
      .get();

    const schedules = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.json(schedules);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch schedules' });
  }
});

// ================== SOCKET.IO ==================
io.on('connection', (socket) => {
  console.log(' User connected:', socket.id);

  socket.on('join-room', (roomId) => {
    socket.join(roomId);
    console.log(`User joined room ${roomId}`);
  });

  socket.on('offer', ({ roomId, offer }) => socket.to(roomId).emit('offer', offer));
  socket.on('answer', ({ roomId, answer }) => socket.to(roomId).emit('answer', answer));
  socket.on('ice-candidate', ({ roomId, candidate }) => socket.to(roomId).emit('ice-candidate', candidate));

  socket.on('disconnect', () => console.log(' User disconnected:', socket.id));
});

// ================== START SERVER ==================
server.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
