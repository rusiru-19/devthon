require('dotenv').config();
const express = require('express');
const cors = require('cors');
const admin = require('firebase-admin');
const http = require('http');
const { Server } = require('socket.io');
const multer = require('multer');
const mammoth = require('mammoth');
const { v4: uuidv4 } = require('uuid');
const app = express();
const { GoogleGenerativeAI } = require("@google/generative-ai");
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const model = genAI.getGenerativeModel({
  model: "models/gemini-1.5-flash-001",
});
app.use(express.json());
app.use(cors());

const BASE_PROMPT = `
  You are a professional CV evaluator and recruiter with experience in hiring across technical and non-technical roles.

Your task:
- Analyze the given CV content professionally and objectively
- Extract key information
- Evaluate overall quality, clarity, relevance, and completeness
- Assign a final score out of 100
- Identify strengths, weaknesses, and improvement suggestions

Rules:
1. Always respond ONLY in valid JSON
2. Do NOT include explanations outside JSON
3. Follow the exact JSON structure provided below
4. If a field is missing in the CV, return null or an empty array
5. Be consistent and unbiased
6. Think like a real hiring manager

Evaluation criteria (used internally for scoring):
- Clarity & formatting
- Role relevance
- Skills quality & relevance
- Experience & achievements
- Education & certifications
- Professionalism (email, language, structure)
- Overall impact

---

### REQUIRED OUTPUT FORMAT (DO NOT CHANGE)

{
  "candidate": {
    "full_name": null,
    "email": null,
    "phone": null,
    "location": null,
    "linkedin": null,
    "portfolio": null
  },
  "target_role": null,
  "summary": null,
  "skills": {
    "technical": [],
    "soft": [],
    "tools": []
  },
  "experience": [
    {
      "job_title": null,
      "company": null,
      "duration": null,
      "key_points": []
    }
  ],
  "education": [
    {
      "degree": null,
      "institution": null,
      "year": null
    }
  ],
  "certifications": [],
  "strengths": [],
  "weaknesses": [],
  "improvement_suggestions": [],
  "cv_score": {
    "score": 0,
    "rating": null
  }
}


`;


const server = http.createServer(app);
const upload = multer({ storage: multer.memoryStorage() });

const io = new Server(server, {
  cors: {
    origin: '*', 
    methods: ['GET', 'POST']
  }
});

const PORT = 3000;

admin.initializeApp({
  credential: admin.credential.cert(require('./serviceAccountKey.json')),
});


app.get('/', (req, res) => {
  res.json({ message: 'Express server running', timestamp: new Date() });
});

// Login route
app.post('/login', async (req, res) => {
  const { token } = req.body;

  try {
    const decoded = await admin.auth().verifyIdToken(token);
    res.status(200).json({
      message: 'Login verified',
      uid: decoded.uid,
      email: decoded.email
    });
  } catch {
    res.status(401).json({ error: 'Unauthorized' });
  }
});

// ================== SOCKET.IO ==================

io.on('connection', (socket) => {
  console.log('🟢 User connected:', socket.id);

  socket.on('join-room', (roomId) => {
    socket.join(roomId);
    console.log(`User joined room ${roomId}`);
  });

  socket.on('offer', ({ roomId, offer }) => {
    socket.to(roomId).emit('offer', offer);
  });

  socket.on('answer', ({ roomId, answer }) => {
    socket.to(roomId).emit('answer', answer);
  });

  socket.on('ice-candidate', ({ roomId, candidate }) => {
    socket.to(roomId).emit('ice-candidate', candidate);
  });

  socket.on('disconnect', () => {
    console.log('🔴 User disconnected:', socket.id);
  });
});

// ================== FILE UPLOAD & PROCESSING ==================
app.post('/upload', upload.array('cvs'), async (req, res) => {
  try {
    const results = [];

    for (const file of req.files) {
      const candidateId = uuidv4();

      // 1. Extract text from DOCX
      const { value: resumeText } = await mammoth.extractRawText({
        buffer: file.buffer
      });

      // 2. Send to Gemini
      const geminiResponse = await model.generateContent([
        {
          text: `${BASE_PROMPT}\n\nRESUME:\n${resumeText}`
        }
      ]);

      const aiText = geminiResponse.response.text();

      // 3. Parse AI JSON safely
      let aiAnalysis = null;
      try {
        aiAnalysis = JSON.parse(aiText);
      } catch {
        aiAnalysis = { raw: aiText };
      }

      // 4. Save everything to Firestore
      await admin.firestore().collection('candidates').doc(candidateId).set({
        fileName: file.originalname,
        resumeText,
        aiAnalysis,
        uploadedAt: new Date(),
      });

      results.push({
        candidateId,
        fileName: file.originalname,
      });
    }

    res.json({ success: true, results });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Bulk upload failed' });
  }
});



// ================== START SERVER ==================

server.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
