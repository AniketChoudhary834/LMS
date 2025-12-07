import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { generateQuizAPI, saveQuizResultAPI } from "../utils/api";

export default function QuizPage() {
  const { user } = useAuth();
  const [topic, setTopic] = useState("");
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [loading, setLoading] = useState(false);

  const handleGenerateQuiz = async (e) => {
    e.preventDefault();
    if (!topic.trim()) return;

    setLoading(true);
    const result = await generateQuizAPI(topic);
    if (result.success && result.data.questions) {
      setQuestions(result.data.questions);
      setCurrentQuestion(0);
      setAnswers({});
      setSubmitted(false);
    }
    setLoading(false);
  };

  const handleAnswerSelect = (questionIndex, answer) => {
    setAnswers({ ...answers, [questionIndex]: answer });
  };

  const handleSubmit = async () => {
    let correct = 0;
    questions.forEach((q, index) => {
      if (answers[index] === q.correctAnswer) {
        correct++;
      }
    });

    setScore(correct);
    setSubmitted(true);

    // Save result
    await saveQuizResultAPI({
      topic,
      score: correct,
      totalQuestions: questions.length,
      answers
    });
  };

  if (questions.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
          <h1 className="text-2xl font-bold mb-6">Generate Quiz</h1>
          <form onSubmit={handleGenerateQuiz}>
            <input
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="Enter topic (e.g., JavaScript, React, Python)"
              className="w-full mb-4 p-3 border rounded"
              required
            />
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:bg-gray-400"
            >
              {loading ? "Generating..." : "Generate Quiz"}
            </button>
          </form>
          <Link to="/" className="block text-center mt-4 text-blue-600">
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  const currentQ = questions[currentQuestion];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-md p-8">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">Quiz: {topic}</h1>
            <span className="text-gray-600">
              Question {currentQuestion + 1} of {questions.length}
            </span>
          </div>

          {!submitted ? (
            <>
              <div className="mb-6">
                <h2 className="text-xl font-semibold mb-4">{currentQ.question}</h2>
                <div className="space-y-3">
                  {currentQ.options.map((option, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleAnswerSelect(currentQuestion, option)}
                      className={`w-full text-left p-4 rounded border-2 ${
                        answers[currentQuestion] === option
                          ? "border-blue-500 bg-blue-50"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex justify-between">
                <button
                  onClick={() => setCurrentQuestion(Math.max(0, currentQuestion - 1))}
                  disabled={currentQuestion === 0}
                  className="bg-gray-500 text-white px-6 py-2 rounded hover:bg-gray-600 disabled:bg-gray-300"
                >
                  Previous
                </button>
                {currentQuestion < questions.length - 1 ? (
                  <button
                    onClick={() => setCurrentQuestion(currentQuestion + 1)}
                    className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
                  >
                    Next
                  </button>
                ) : (
                  <button
                    onClick={handleSubmit}
                    className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700"
                  >
                    Submit Quiz
                  </button>
                )}
              </div>

              <div className="mt-6 grid grid-cols-10 gap-2">
                {questions.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentQuestion(idx)}
                    className={`p-2 rounded text-sm ${
                      currentQuestion === idx
                        ? "bg-blue-500 text-white"
                        : answers[idx]
                        ? "bg-green-200"
                        : "bg-gray-200"
                    }`}
                  >
                    {idx + 1}
                  </button>
                ))}
              </div>
            </>
          ) : (
            <div className="text-center">
              <h2 className="text-3xl font-bold mb-4">Quiz Completed!</h2>
              <p className="text-xl mb-4">
                Your Score: {score} / {questions.length}
              </p>
              <p className="text-gray-600 mb-6">
                {((score / questions.length) * 100).toFixed(1)}% Correct
              </p>
              <button
                onClick={() => {
                  setQuestions([]);
                  setTopic("");
                  setAnswers({});
                  setSubmitted(false);
                }}
                className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
              >
                Take Another Quiz
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}


