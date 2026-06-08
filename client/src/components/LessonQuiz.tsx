import React, { useState } from "react";
import axios from "axios";
import type { ToastType } from "./Toast";
import QuizLoading from "./QuizLoading";

interface QuizQuestion {
    question: string;
    options: string[];
    correctAnswerIndex: number;
    explanation: string;
}

interface LessonQuizProps {
    courseId?: string;
    lessonId: string;
    showToast?: (message: string, type: ToastType) => void;
}

export const LessonQuiz: React.FC<LessonQuizProps> = ({ courseId, lessonId, showToast }) => {
    const [quizData, setQuizData] = useState<QuizQuestion[] | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
    const [selectedOption, setSelectedOption] = useState<number | null>(null);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [score, setScore] = useState(0);
    const [quizComplete, setQuizComplete] = useState(false);

    // Fetch the AI-generated quiz from backend endpoint
    const handleFetchQuiz = async () => {
        try {
            setIsLoading(true);
            setQuizData(null);
            setCurrentQuestionIdx(0);
            setSelectedOption(null);
            setIsSubmitted(false);
            setScore(0);
            setQuizComplete(false);

            const response = await axios.post(import.meta.env.VITE_BACKEND_URL + `/courses/${courseId}/lessons/${lessonId}/quiz`, {}, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`
                },
            });
            setQuizData(response.data.quiz);
        } catch (error) {
            console.error("Failed to load quiz asset:", error);
            if (showToast) {
                showToast("Could not generate a quiz for this module right now.", "error");
            }
        } finally {
            setIsLoading(false);
        }
    };

    if (!quizData) {
        return (
            <div className="bg-white border border-gray-200 rounded-xl p-6 text-center shadow-sm">
                <h3 className="font-bold text-gray-800 text-base mb-1">🧠 Test Your Understanding</h3>
                <p className="text-xs text-gray-500 mb-4">Generate an instant, AI-powered 3-question evaluation micro-quiz customized to this lesson topic.</p>
                <button
                    onClick={handleFetchQuiz}
                    disabled={isLoading}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs py-2.5 px-4 rounded-lg transition-colors disabled:bg-blue-300"
                >
                    {isLoading ?
                        <QuizLoading />
                        : "Launch Knowledge Quiz"}
                </button>
            </div>
        );
    }

    if (quizComplete) {
        return (
            <div className="bg-white border border-gray-200 rounded-xl p-6 text-center shadow-sm max-w-md mx-auto">
                <span className="text-3xl">🎉</span>
                <h3 className="font-bold text-gray-800 text-lg mt-2">Quiz Completed!</h3>
                <p className="text-sm text-gray-600 mt-1">
                    Your Score: <span className="font-bold text-blue-600">{score}</span> / {quizData.length}
                </p>
                <div className="mt-4 flex gap-2 justify-center">
                    <button
                        onClick={handleFetchQuiz}
                        className="border border-gray-300 text-gray-700 font-medium text-xs py-2 px-3 rounded-lg hover:bg-gray-50 transition"
                    >
                        Retry New Quiz
                    </button>
                </div>
            </div>
        );
    }

    const currentQuiz = quizData[currentQuestionIdx];

    const handleSubmitAnswer = () => {
        if (selectedOption === null) return;
        setIsSubmitted(true);
        if (selectedOption === currentQuiz.correctAnswerIndex) {
            setScore((prev) => prev + 1);
        }
    };

    const handleNextQuestion = () => {
        setSelectedOption(null);
        setIsSubmitted(false);
        if (currentQuestionIdx + 1 < quizData.length) {
            setCurrentQuestionIdx((prev) => prev + 1);
        } else {
            setQuizComplete(true);
        }
    };

    const handleCloseQuiz = () => {
        setQuizData(null);
        setCurrentQuestionIdx(0);
        setSelectedOption(null);
        setIsSubmitted(false);
        setScore(0);
        setQuizComplete(false);
    };

    return (
        <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm mx-auto flex flex-col gap-4">
            {/* Header / Progress Tracking */}
            <div className="flex justify-between items-center border-b border-gray-100 pb-2.5">
                <span className="text-xs font-bold text-blue-600 tracking-wider uppercase">
                    Question {currentQuestionIdx + 1} of {quizData.length}
                </span>
                <span className="text-xs text-gray-400 font-medium">Topic Checkpoint</span>
            </div>

            {/* Question Text */}
            <h4 className="text-sm font-semibold text-gray-800 leading-snug">
                {currentQuiz.question}
            </h4>

            {/* Multiple Choice Option Rows */}
            <div className="flex flex-col gap-2">
                {currentQuiz.options.map((option, idx) => {
                    let optionStyles = "border-gray-200 hover:bg-gray-50";

                    if (!isSubmitted && selectedOption === idx) {
                        optionStyles = "border-blue-500 bg-blue-50/50 text-blue-700 font-medium";
                    } else if (isSubmitted) {
                        if (idx === currentQuiz.correctAnswerIndex) {
                            optionStyles = "border-green-500 bg-green-50 text-green-800 font-semibold";
                        } else if (selectedOption === idx && selectedOption !== currentQuiz.correctAnswerIndex) {
                            optionStyles = "border-red-300 bg-red-50 text-red-800";
                        } else {
                            optionStyles = "border-gray-100 opacity-60";
                        }
                    }

                    return (
                        <button
                            key={idx}
                            disabled={isSubmitted}
                            onClick={() => setSelectedOption(idx)}
                            className={`border text-left p-3 text-xs rounded-lg transition-all flex items-start gap-2.5 ${optionStyles}`}
                        >
                            <span className="bg-gray-100 rounded-md w-5 h-5 flex items-center justify-center shrink-0 font-mono text-[10px] text-gray-500 font-bold">
                                {String.fromCharCode(65 + idx)}
                            </span>
                            <span className="leading-tight text-gray-950">{option}</span>
                        </button>
                    );
                })}
            </div>

            {/* Explanatory Dropdown Box Container */}
            {isSubmitted && (
                <div className={`p-3 rounded-lg border text-xs leading-relaxed ${selectedOption === currentQuiz.correctAnswerIndex
                    ? "bg-green-50/50 border-green-200 text-green-900"
                    : "bg-amber-50/50 border-amber-200 text-amber-900"
                    }`}>
                    <p className="font-bold mb-0.5">
                        {selectedOption === currentQuiz.correctAnswerIndex ? "✨ Correct!" : "💡 Concept Summary:"}
                    </p>
                    <p>{currentQuiz.explanation}</p>
                </div>
            )}

            <div className="flex items-center justify-between mt-6 border-t border-gray-100 pt-4">
                <button
                    onClick={handleCloseQuiz}
                    className="text-xs font-semibold text-gray-400 hover:text-gray-600 px-3 py-2 rounded-lg hover:bg-gray-50 transition duration-150 select-none"
                >
                    Cancel & Close
                </button>

                <div className="flex items-center space-x-2">
                    {!isSubmitted ? (
                        <button
                            onClick={handleSubmitAnswer}
                            disabled={selectedOption === null}
                            className="bg-gray-900 text-white font-bold text-xs py-2 px-4 rounded-lg hover:bg-gray-800 transition disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed shadow-sm"
                        >
                            Submit Answer
                        </button>
                    ) : (
                        <button
                            onClick={handleNextQuestion}
                            className="bg-blue-600 text-white font-bold text-xs py-2 px-5 rounded-lg hover:bg-blue-700 transition shadow-md shadow-blue-500/10 active:scale-95 duration-150"
                        >
                            {currentQuestionIdx + 1 === quizData.length ? "Finish Quiz" : "Next Question →"}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};
