const { GoogleGenerativeAI } = require("@google/generative-ai");
const QuizResult = require("../models/QuizResult");

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GENAI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

// Generate quiz
exports.generateQuiz = async (req, res) => {
  try {
    const { prompt } = req.body;
    if (!prompt) {
      return res.status(400).json({ success: false, message: "Topic required" });
    }

    const systemPrompt = `
      Generate exactly 30 multiple-choice questions on the topic: "${prompt}".
      Return ONLY a JSON object in this format:
      {
        "questions": [
          {
            "question": "Question text?",
            "options": ["Option A", "Option B", "Option C", "Option D"],
            "correctAnswer": "Option A"
          }
        ]
      }
      Each question must have exactly 4 options. The correctAnswer must match one of the options exactly.
    `;

    const response = await model.generateContent(systemPrompt);
    const text = response.response.text();
    const cleaned = text.replace(/```json|```/g, "").trim();
    const jsonMatch = cleaned.match(/\{[\s\S]*\}/);
    
    if (!jsonMatch) {
      return res.status(500).json({ success: false, message: "Failed to generate quiz" });
    }

    const quizData = JSON.parse(jsonMatch[0]);
    res.json({ success: true, data: quizData });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Save quiz result
exports.saveQuizResult = async (req, res) => {
  try {
    const { topic, score, totalQuestions, answers } = req.body;
    const result = new QuizResult({
      userId: req.user._id,
      topic,
      score,
      totalQuestions,
      answers
    });
    await result.save();
    res.json({ success: true, data: result });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get quiz results
exports.getQuizResults = async (req, res) => {
  try {
    const results = await QuizResult.find({ userId: req.user._id }).sort({ createdAt: -1 });
    res.json({ success: true, data: results });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

