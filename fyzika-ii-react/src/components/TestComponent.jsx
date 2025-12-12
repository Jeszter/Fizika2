import React, { useState, useEffect, useCallback } from 'react';
import '../TestComponent.css';

const TestComponent = ({ topicId }) => {
    const [questions, setQuestions] = useState([]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [selectedAnswers, setSelectedAnswers] = useState({});
    const [score, setScore] = useState(0);
    const [testCompleted, setTestCompleted] = useState(false);
    const [loading, setLoading] = useState(true);
    const [timeLeft, setTimeLeft] = useState(900);
    const [timeSpent, setTimeSpent] = useState(0);
    const [showResults, setShowResults] = useState(false);
    const [testConfig] = useState({
        questionsCount: 10,
        randomize: true
    });

    useEffect(() => {
        loadQuestions();
    }, [topicId]);

    useEffect(() => {
        let timer;
        if (!testCompleted && timeLeft > 0) {
            timer = setInterval(() => {
                setTimeLeft(prev => {
                    if (prev <= 1) {
                        finishTest();
                        return 0;
                    }
                    return prev - 1;
                });
                setTimeSpent(prev => prev + 1);
            }, 1000);
        }
        return () => clearInterval(timer);
    }, [testCompleted, timeLeft]);

    const loadQuestions = async () => {
        setLoading(true);
        try {
            const response = await fetch(`/tests/${topicId}-test.json`);
            if (!response.ok) throw new Error('Test file not found');
            const data = await response.json();

            let selectedQuestions = [...data.questions];
            if (testConfig.randomize) {
                selectedQuestions = selectedQuestions
                    .sort(() => Math.random() - 0.5)
                    .slice(0, testConfig.questionsCount);
            }

            setQuestions(selectedQuestions);
            setSelectedAnswers({});
            setCurrentQuestionIndex(0);
            setTimeLeft(900);
            setTimeSpent(0);
            setTestCompleted(false);
            setShowResults(false);
        } catch (error) {
            console.error('Error loading questions:', error);
            createMockQuestions();
        } finally {
            setLoading(false);
        }
    };

    const createMockQuestions = () => {
        const mockQuestions = [];
        const topicName = topicId.replace('-', ' ');

        for (let i = 0; i < 10; i++) {
            mockQuestions.push({
                id: i + 1,
                question: `Príkladová otázka ${i + 1} pre ${topicName}: Aká je hlavná vlastnosť tejto témy?`,
                options: [
                    "A) Prvá možnosť",
                    "B) Druhá možnosť",
                    "C) Tretia možnosť",
                    "D) Štvrtá možnosť"
                ],
                correctAnswer: Math.floor(Math.random() * 4),
                explanation: `Toto je príkladové vysvetlenie pre otázku ${i + 1}.`,
                difficulty: ['easy', 'medium', 'hard'][i % 3]
            });
        }

        setQuestions(mockQuestions);
    };

    const handleAnswerSelect = (questionIndex, answerIndex) => {
        setSelectedAnswers({
            ...selectedAnswers,
            [questionIndex]: answerIndex
        });
    };

    const nextQuestion = () => {
        if (currentQuestionIndex < questions.length - 1) {
            setCurrentQuestionIndex(prev => prev + 1);
        }
    };

    const prevQuestion = () => {
        if (currentQuestionIndex > 0) {
            setCurrentQuestionIndex(prev => prev - 1);
        }
    };

    const jumpToQuestion = (index) => {
        setCurrentQuestionIndex(index);
    };

    const finishTest = () => {
        let correctCount = 0;
        questions.forEach((question, index) => {
            if (selectedAnswers[index] === question.correctAnswer) {
                correctCount++;
            }
        });

        setScore(correctCount);
        setTestCompleted(true);
        saveResult(correctCount, questions.length, topicId);
    };

    const saveResult = (score, total, topic) => {
        const results = JSON.parse(localStorage.getItem('testResults') || '[]');
        const percentage = Math.round((score / total) * 100);

        results.push({
            date: new Date().toISOString(),
            topic: topic.replace('-', ' '),
            score,
            total,
            percentage,
            timeSpent: 900 - timeLeft,
            timestamp: Date.now()
        });

        localStorage.setItem('testResults', JSON.stringify(results.slice(-50)));
    };

    const restartTest = () => {
        setCurrentQuestionIndex(0);
        setSelectedAnswers({});
        setScore(0);
        setTestCompleted(false);
        setShowResults(false);
        setTimeLeft(900);
        setTimeSpent(0);
        setLoading(true);
        loadQuestions();
    };

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    const getTestHistory = () => {
        const results = JSON.parse(localStorage.getItem('testResults') || '[]');
        return results.filter(r => r.topic === topicId.replace('-', ' '));
    };

    if (loading) {
        return (
            <div className="test-loading">
                <div className="spinner"></div>
                <p>Načítavam otázky...</p>
            </div>
        );
    }

    if (questions.length === 0) {
        return (
            <div className="test-error">
                <i className="fas fa-exclamation-triangle"></i>
                <p>Nie sú k dispozícii otázky pre túto tému.</p>
                <button onClick={loadQuestions} className="btn btn-primary mt-4">
                    Skúsiť znova
                </button>
            </div>
        );
    }

    if (testCompleted && showResults) {
        const percentage = Math.round((score / questions.length) * 100);
        const passed = percentage >= 51;
        const history = getTestHistory();
        const previousBest = history.length > 1
            ? Math.max(...history.slice(0, -1).map(r => r.percentage))
            : percentage;

        return (
            <div className="section active" id="test-section">
                <div className="test-results-header">
                    <h2><i className="fas fa-poll"></i> Výsledky testu</h2>
                </div>

                <div className="results-container">
                    <div className="results-summary">
                        <div className="score-circle">
                            <div
                                className="score-circle-fill"
                                style={{
                                    background: `conic-gradient(var(--primary-blue) 0% ${percentage}%, var(--border) ${percentage}% 100%)`
                                }}
                            ></div>
                            <div className="score-inner">
                                <div className="score-value">{percentage}%</div>
                                <div className="score-text">Úspešnosť</div>
                            </div>
                        </div>

                        <div className="results-details">
                            <div className="result-card">
                                <div className="result-value">{score}/{questions.length}</div>
                                <div className="result-label">Správne odpovede</div>
                            </div>
                            <div className="result-card">
                                <div className="result-value">{formatTime(timeSpent)}</div>
                                <div className="result-label">Čas</div>
                            </div>
                            <div className="result-card">
                                <div className="result-value">{passed ? 'Áno' : 'Nie'}</div>
                                <div className="result-label">Test prejdený</div>
                            </div>
                        </div>

                        {previousBest > percentage && history.length > 1 && (
                            <div className="previous-best">
                                <i className="fas fa-trophy"></i>
                                <span>Najlepší výsledok: {previousBest}%</span>
                            </div>
                        )}
                    </div>

                    <div className="answers-review">
                        <h3><i className="fas fa-list-check"></i> Prehľad odpovedí</h3>

                        <div className="review-stats">
                            <div className="stat correct">
                                <i className="fas fa-check-circle"></i>
                                <span>Správne: {score}</span>
                            </div>
                            <div className="stat incorrect">
                                <i className="fas fa-times-circle"></i>
                                <span>Nesprávne: {questions.length - score}</span>
                            </div>
                            <div className="stat skipped">
                                <i className="fas fa-minus-circle"></i>
                                <span>Nezodpovedané: {questions.length - Object.keys(selectedAnswers).length}</span>
                            </div>
                        </div>

                        <div className="review-questions">
                            {questions.map((question, index) => {
                                const userAnswer = selectedAnswers[index];
                                const isCorrect = userAnswer === question.correctAnswer;
                                const isAnswered = userAnswer !== undefined;

                                return (
                                    <div key={index} className={`review-question ${isCorrect ? 'correct' : 'incorrect'}`}>
                                        <div className="review-question-header">
                                            <div className="question-number">
                                                Otázka {index + 1}
                                                {isAnswered ? (
                                                    isCorrect ? (
                                                        <i className="fas fa-check correct-icon"></i>
                                                    ) : (
                                                        <i className="fas fa-times incorrect-icon"></i>
                                                    )
                                                ) : (
                                                    <i className="fas fa-minus skipped-icon"></i>
                                                )}
                                            </div>
                                            <span className={`difficulty-badge ${question.difficulty}`}>
                        {question.difficulty === 'easy' ? 'Ľahká' :
                            question.difficulty === 'medium' ? 'Stredná' : 'Ťažká'}
                      </span>
                                        </div>

                                        <div className="review-question-text">{question.question}</div>

                                        <div className="review-answers">
                                            <div className="user-answer">
                                                <strong>Tvoja odpoveď:</strong>
                                                <span className={`answer ${isCorrect ? 'correct' : 'incorrect'}`}>
                          {isAnswered ? question.options[userAnswer] : 'Nezodpovedané'}
                        </span>
                                            </div>

                                            {(!isCorrect || !isAnswered) && (
                                                <div className="correct-answer">
                                                    <strong>Správna odpoveď:</strong>
                                                    <span className="answer correct">{question.options[question.correctAnswer]}</span>
                                                </div>
                                            )}
                                        </div>

                                        {question.explanation && (
                                            <div className="explanation">
                                                <i className="fas fa-lightbulb"></i>
                                                <span>{question.explanation}</span>
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    <div className="results-actions">
                        {!passed ? (
                            <>
                                <button className="btn btn-retry" onClick={restartTest}>
                                    <i className="fas fa-redo"></i> Skúsiť znova
                                </button>
                                <button className="btn btn-secondary" onClick={() => setShowResults(false)}>
                                    <i className="fas fa-arrow-left"></i> Späť na teóriu
                                </button>
                            </>
                        ) : (
                            <>
                                <button className="btn btn-primary" onClick={restartTest}>
                                    <i className="fas fa-redo"></i> Skúsiť znova
                                </button>
                                <button
                                    className="btn btn-secondary"
                                    onClick={() => window.dispatchEvent(new CustomEvent('closeTest'))}
                                >
                                    <i className="fas fa-check"></i> Dokončiť
                                </button>
                            </>
                        )}
                    </div>
                </div>
            </div>
        );
    }

    const currentQuestion = questions[currentQuestionIndex];
    const progressPercentage = ((currentQuestionIndex + 1) / questions.length) * 100;
    const answeredCount = Object.keys(selectedAnswers).length;

    return (
        <div className="section active" id="test-section">
            <div className="test-header">
                <div className="test-header-top">
                    <div className="test-info">
                        <div className="test-timer">
                            <i className="fas fa-clock"></i>
                            <span>{formatTime(timeLeft)}</span>
                        </div>

                        <div className="questions-dots">
                            {questions.map((_, index) => {
                                const isCurrent = index === currentQuestionIndex;
                                const isAnswered = selectedAnswers[index] !== undefined;

                                return (
                                    <button
                                        key={index}
                                        className={`question-dot ${isCurrent ? 'current' : ''} ${isAnswered ? 'answered' : ''}`}
                                        onClick={() => jumpToQuestion(index)}
                                        title={`Otázka ${index + 1}`}
                                    >
                                        {index + 1}
                                    </button>
                                );
                            })}
                        </div>

                        <div className="test-progress">
                            <span className="progress-text">Otázka {currentQuestionIndex + 1} z {questions.length}</span>
                            <div className="progress-bar">
                                <div
                                    className="progress-fill"
                                    style={{ width: `${progressPercentage}%` }}
                                ></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="question active">
                <div className="question-header">
                    <h3>Otázka {currentQuestionIndex + 1}</h3>
                    <div className={`difficulty-badge ${currentQuestion.difficulty}`}>
                        {currentQuestion.difficulty === 'easy' ? 'Ľahká' :
                            currentQuestion.difficulty === 'medium' ? 'Stredná' : 'Ťažká'}
                    </div>
                </div>

                <div className="question-text">{currentQuestion.question}</div>

                <div className="options">
                    {currentQuestion.options.map((option, index) => {
                        const isSelected = selectedAnswers[currentQuestionIndex] === index;

                        return (
                            <div
                                key={index}
                                className={`option ${isSelected ? 'selected' : ''}`}
                                onClick={() => handleAnswerSelect(currentQuestionIndex, index)}
                            >
                                <div className="option-letter">
                                    {String.fromCharCode(65 + index)}
                                </div>
                                <div className="option-text">{option}</div>
                                {isSelected && (
                                    <div className="selection-indicator">
                                        <i className="fas fa-check"></i>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>

                <div className="question-hint">
                    <i className="fas fa-info-circle"></i>
                    <span>Vyberte správnu odpoveď kliknutím na možnosť. Môžete sa k otázke vrátiť neskôr.</span>
                </div>
            </div>

            <div className="test-navigation">
                <div className="nav-buttons">
                    <button
                        className="btn btn-secondary"
                        onClick={prevQuestion}
                        disabled={currentQuestionIndex === 0}
                    >
                        <i className="fas fa-arrow-left"></i> Predchádzajúca
                    </button>

                    {currentQuestionIndex === questions.length - 1 ? (
                        <button
                            className="btn btn-finish"
                            onClick={() => {
                                finishTest();
                                setShowResults(true);
                            }}
                        >
                            <i className="fas fa-flag-checkered"></i> Ukončiť test
                        </button>
                    ) : (
                        <button
                            className="btn btn-primary"
                            onClick={nextQuestion}
                        >
                            Ďalšia <i className="fas fa-arrow-right"></i>
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default TestComponent;