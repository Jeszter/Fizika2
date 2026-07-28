import React, { useState, useEffect } from 'react';
import '../TestComponent.css';
import { getTeacherTests, saveTeacherTests, TESTS_STORAGE_KEY } from '../utils/courseCms';

const STUDENT_QUESTIONS_COUNT = 10;
const DEFAULT_TEST_CONFIG = {
    questionsCount: STUDENT_QUESTIONS_COUNT,
    randomize: true,
    timeLimitMinutes: 15,
};

const shuffled = items => {
    const result = [...items];
    for (let index = result.length - 1; index > 0; index--) {
        const randomIndex = Math.floor(Math.random() * (index + 1));
        [result[index], result[randomIndex]] = [result[randomIndex], result[index]];
    }
    return result;
};

const TestSettingsModal = ({ config, bankSize, onSave, onClose }) => {
    const [draft, setDraft] = useState(config);

    const apply = () => {
        onSave({
            questionsCount: Math.max(1, Math.min(bankSize, Number(draft.questionsCount) || 1)),
            timeLimitMinutes: Math.max(1, Math.min(180, Number(draft.timeLimitMinutes) || 1)),
            randomize: Boolean(draft.randomize),
        });
    };

    return (
        <div className="teacher-modal-backdrop" onMouseDown={event => event.target === event.currentTarget && onClose()}>
            <section className="teacher-test-settings-modal" role="dialog" aria-modal="true" aria-label="Nastavenia testu">
                <header className="teacher-modal-header">
                    <div><p>Správanie pre študenta</p><h2>Nastavenia testu</h2></div>
                    <button type="button" onClick={onClose} aria-label="Zavrieť nastavenia testu"><i className="fas fa-times"></i></button>
                </header>
                <div className="teacher-test-settings-grid">
                    <label>
                        <span className="teacher-setting-icon teacher-setting-icon--blue"><i className="fas fa-list-ol"></i></span>
                        <span className="teacher-setting-copy"><strong>Počet otázok pre študenta</strong><small>V banke je aktuálne {bankSize} otázok</small></span>
                        <input
                            type="number"
                            min="1"
                            max={Math.max(1, bankSize)}
                            value={draft.questionsCount}
                            onChange={event => setDraft({ ...draft, questionsCount: event.target.value })}
                            aria-label="Počet otázok pre študenta"
                        />
                    </label>
                    <label>
                        <span className="teacher-setting-icon teacher-setting-icon--amber"><i className="fas fa-clock"></i></span>
                        <span className="teacher-setting-copy"><strong>Časový limit</strong><small>Čas na dokončenie jedného pokusu</small></span>
                        <span className="teacher-setting-input-suffix">
                            <input
                                type="number"
                                min="1"
                                max="180"
                                value={draft.timeLimitMinutes}
                                onChange={event => setDraft({ ...draft, timeLimitMinutes: event.target.value })}
                                aria-label="Časový limit v minútach"
                            />
                            <span>min</span>
                        </span>
                    </label>
                    <label className="teacher-setting-toggle-row">
                        <span className="teacher-setting-icon teacher-setting-icon--green"><i className="fas fa-shuffle"></i></span>
                        <span className="teacher-setting-copy"><strong>Náhodný výber</strong><small>Pri každom pokuse vytvorí nový výber a poradie otázok</small></span>
                        <input
                            type="checkbox"
                            checked={draft.randomize}
                            onChange={event => setDraft({ ...draft, randomize: event.target.checked })}
                            aria-label="Náhodný výber otázok"
                        />
                    </label>
                </div>
                <footer className="teacher-modal-footer">
                    <span>Každá kapitola môže mať vlastný počet otázok a vlastný čas.</span>
                    <div>
                        <button type="button" className="teacher-modal-cancel" onClick={onClose}>Zrušiť</button>
                        <button type="button" className="teacher-modal-primary" onClick={apply}><i className="fas fa-check"></i> Použiť nastavenia</button>
                    </div>
                </footer>
            </section>
        </div>
    );
};

const TeacherTestVisual = ({
    questions,
    currentQuestionIndex,
    setCurrentQuestionIndex,
    currentQuestion,
    saveState,
    updateQuestion,
    addQuestion,
    duplicateQuestion,
    deleteQuestion,
    saveTeacherTest,
    prevQuestion,
    nextQuestion,
    onExitEditor,
    markDirty,
    testConfig,
    updateTestConfig,
}) => {
    const [showSettings, setShowSettings] = useState(false);
    const progressPercentage = ((currentQuestionIndex + 1) / questions.length) * 100;

    return (
        <div className="section active teacher-test-editor" id="test-section">
            <div className="teacher-builder-toolbar" role="toolbar" aria-label="Vizuálny editor testu">
                <div className="teacher-builder-toolbar__inner">
                    <button type="button" className="teacher-tool teacher-tool--back" onClick={onExitEditor}>
                        <i className="fas fa-arrow-left"></i><span>Panel</span>
                    </button>
                    <span className="teacher-toolbar-divider"></span>
                    <button type="button" className="teacher-tool teacher-tool--text-editor" onClick={addQuestion} title="Pridať otázku">
                        <i className="fas fa-plus"></i><span>Otázka</span>
                    </button>
                    <button type="button" className="teacher-tool" onClick={duplicateQuestion} title="Duplikovať otázku"><i className="fas fa-copy"></i></button>
                    <button type="button" className="teacher-tool teacher-test-delete-tool" onClick={deleteQuestion} title="Odstrániť otázku"><i className="fas fa-trash"></i></button>
                    <button type="button" className="teacher-tool teacher-test-settings-tool" onClick={() => setShowSettings(true)} title="Nastavenia testu">
                        <i className="fas fa-sliders"></i><span>Nastavenia</span>
                    </button>
                    <div className="teacher-toolbar-save">
                        <span className={`teacher-save-state teacher-save-state--${saveState}`}>
                            {saveState === 'dirty' ? 'Neuložené zmeny' : 'Uložené'}
                        </span>
                        <button type="button" className="teacher-save-button" onClick={saveTeacherTest}>
                            <i className="fas fa-floppy-disk"></i> Uložiť test
                        </button>
                    </div>
                </div>
            </div>

            <div className="test-header">
                <div className="test-header-top">
                    <div className="test-info">
                        <div className="teacher-test-mode-badge"><i className="fas fa-pen-ruler"></i> Úprava testu</div>
                        <div className="teacher-test-bank-summary">
                            <span><strong>{questions.length}</strong> v banke</span>
                            <i className="fas fa-arrow-right"></i>
                            <span><strong>{Math.min(Number(testConfig.questionsCount) || 1, questions.length)}</strong> pre študenta</span>
                            <span className="teacher-test-time-summary"><i className="fas fa-clock"></i> {testConfig.timeLimitMinutes} min</span>
                        </div>
                        <div className="questions-dots">
                            {questions.map((_, index) => (
                                <button
                                    key={index}
                                    className={`question-dot ${index === currentQuestionIndex ? 'current' : ''}`}
                                    onClick={() => setCurrentQuestionIndex(index)}
                                    title={`Otázka ${index + 1}`}
                                >
                                    {index + 1}
                                </button>
                            ))}
                        </div>
                        <div className="test-progress">
                            <span className="progress-text">Otázka {currentQuestionIndex + 1} z {questions.length}</span>
                            <div className="progress-bar"><div className="progress-fill" style={{ width: `${progressPercentage}%` }}></div></div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="question active">
                <div className="question-header">
                    <h3>Otázka {currentQuestionIndex + 1}</h3>
                    <label className={`teacher-difficulty-select difficulty-badge ${currentQuestion.difficulty}`}>
                        <i className="fas fa-gauge-high"></i>
                        <select
                            value={currentQuestion.difficulty}
                            onChange={event => updateQuestion(currentQuestionIndex, { difficulty: event.target.value })}
                            aria-label="Obtiažnosť otázky"
                        >
                            <option value="easy">Ľahká</option>
                            <option value="medium">Stredná</option>
                            <option value="hard">Ťažká</option>
                        </select>
                    </label>
                </div>

                <div className="question-text teacher-test-editable">
                    <span
                        contentEditable
                        suppressContentEditableWarning
                        onInput={markDirty}
                        onBlur={event => updateQuestion(currentQuestionIndex, { question: event.currentTarget.textContent.trim() })}
                    >
                        {currentQuestion.question}
                    </span>
                    <i className="fas fa-pen teacher-test-pencil"></i>
                </div>

                <div className="options">
                    {currentQuestion.options.map((option, index) => {
                        const isCorrect = currentQuestion.correctAnswer === index;
                        return (
                            <div
                                key={index}
                                className={`option teacher-test-option ${isCorrect ? 'selected' : ''}`}
                                onClick={() => updateQuestion(currentQuestionIndex, { correctAnswer: index })}
                            >
                                <div className="option-letter">{String.fromCharCode(65 + index)}</div>
                                <div
                                    className="option-text"
                                    contentEditable
                                    suppressContentEditableWarning
                                    onClick={event => event.stopPropagation()}
                                    onInput={markDirty}
                                    onBlur={event => {
                                        const nextOptions = [...currentQuestion.options];
                                        nextOptions[index] = event.currentTarget.textContent.trim();
                                        updateQuestion(currentQuestionIndex, { options: nextOptions });
                                    }}
                                >
                                    {option}
                                </div>
                                <button
                                    type="button"
                                    className={`teacher-correct-answer ${isCorrect ? 'active' : ''}`}
                                    onClick={event => {
                                        event.stopPropagation();
                                        updateQuestion(currentQuestionIndex, { correctAnswer: index });
                                    }}
                                    title="Označiť ako správnu odpoveď"
                                    aria-label={`Odpoveď ${String.fromCharCode(65 + index)} je správna`}
                                >
                                    <i className="fas fa-check"></i>
                                </button>
                            </div>
                        );
                    })}
                </div>

                <div className="teacher-test-explanation">
                    <div className="teacher-test-explanation__label"><i className="fas fa-lightbulb"></i> Vysvetlenie po vyhodnotení</div>
                    <div
                        contentEditable
                        suppressContentEditableWarning
                        onInput={markDirty}
                        onBlur={event => updateQuestion(currentQuestionIndex, { explanation: event.currentTarget.textContent.trim() })}
                    >
                        {currentQuestion.explanation || 'Doplňte vysvetlenie správnej odpovede…'}
                    </div>
                    <i className="fas fa-pen teacher-test-pencil"></i>
                </div>
            </div>

            <div className="test-navigation">
                <div className={`nav-buttons ${currentQuestionIndex === 0 ? 'first-question' : ''}`}>
                    {currentQuestionIndex > 0 ? (
                        <button className="btn btn-secondary" onClick={prevQuestion}><i className="fas fa-arrow-left"></i> Predchádzajúca</button>
                    ) : (
                        <button className="btn btn-secondary" onClick={onExitEditor}><i className="fas fa-arrow-left"></i> Späť do panela</button>
                    )}
                    {currentQuestionIndex < questions.length - 1 ? (
                        <button className="btn btn-primary" onClick={nextQuestion}>Ďalšia <i className="fas fa-arrow-right"></i></button>
                    ) : (
                        <button className="btn btn-primary" onClick={addQuestion}><i className="fas fa-plus"></i> Pridať otázku</button>
                    )}
                </div>
            </div>
            {showSettings && (
                <TestSettingsModal
                    config={testConfig}
                    bankSize={questions.length}
                    onClose={() => setShowSettings(false)}
                    onSave={nextConfig => {
                        updateTestConfig(nextConfig);
                        setShowSettings(false);
                    }}
                />
            )}
        </div>
    );
};

const TestComponent = ({ topicId, teacherEditMode = false, onExitEditor, onDirtyChange }) => {
    const [questions, setQuestions] = useState([]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [selectedAnswers, setSelectedAnswers] = useState({});
    const [score, setScore] = useState(0);
    const [testCompleted, setTestCompleted] = useState(false);
    const [loading, setLoading] = useState(true);
    const [timeLeft, setTimeLeft] = useState(DEFAULT_TEST_CONFIG.timeLimitMinutes * 60);
    const [timeSpent, setTimeSpent] = useState(0);
    const [showResults, setShowResults] = useState(false);
    const [saveState, setSaveState] = useState('saved');
    const [testConfig, setTestConfig] = useState(DEFAULT_TEST_CONFIG);

    useEffect(() => {
        loadQuestions();
    }, [topicId]);

    useEffect(() => {
        const refreshQuestions = event => {
            if (event.key === TESTS_STORAGE_KEY) loadQuestions();
        };
        window.addEventListener('storage', refreshQuestions);
        return () => window.removeEventListener('storage', refreshQuestions);
    }, [topicId]);

    useEffect(() => {
        let timer;

        if (!teacherEditMode && !testCompleted && timeLeft > 0) {
            timer = setInterval(() => {
                setTimeLeft(prev => {
                    if (prev <= 1) {
                        finishTest();
                        setShowResults(true);
                        return 0;
                    }

                    return prev - 1;
                });

                setTimeSpent(prev => prev + 1);
            }, 1000);
        }

        return () => clearInterval(timer);
    }, [testCompleted, timeLeft, selectedAnswers, questions, teacherEditMode]);

    const loadQuestions = async () => {
        setLoading(true);

        try {
            const teacherTest = getTeacherTests()[topicId];
            let data;
            if (teacherTest?.questions?.length) {
                data = teacherTest;
            } else {
                const response = await fetch(`/Fizika2/tests/${topicId}-test.json`);
                if (!response.ok) throw new Error('Test file not found');
                data = await response.json();
            }

            const effectiveConfig = {
                ...DEFAULT_TEST_CONFIG,
                ...(data.settings || {}),
            };
            let selectedQuestions = [...data.questions];

            if (effectiveConfig.randomize && !teacherEditMode) {
                selectedQuestions = shuffled(selectedQuestions)
                    .slice(0, effectiveConfig.questionsCount);
            } else if (!teacherEditMode) {
                selectedQuestions = selectedQuestions.slice(0, effectiveConfig.questionsCount);
            }

            setTestConfig(effectiveConfig);
            setQuestions(selectedQuestions);
            setSelectedAnswers({});
            setCurrentQuestionIndex(0);
            setScore(0);
            setTimeLeft(effectiveConfig.timeLimitMinutes * 60);
            setTimeSpent(0);
            setTestCompleted(false);
            setShowResults(false);
            setSaveState('saved');
            onDirtyChange?.(false);
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
                    'A) Prvá možnosť',
                    'B) Druhá možnosť',
                    'C) Tretia možnosť',
                    'D) Štvrtá možnosť'
                ],
                correctAnswer: Math.floor(Math.random() * 4),
                explanation: `Toto je príkladové vysvetlenie pre otázku ${i + 1}.`,
                difficulty: ['easy', 'medium', 'hard'][i % 3]
            });
        }

        setQuestions(mockQuestions);
        setSelectedAnswers({});
        setCurrentQuestionIndex(0);
        setScore(0);
        setTimeLeft(testConfig.timeLimitMinutes * 60);
        setTimeSpent(0);
        setTestCompleted(false);
        setShowResults(false);
    };

    const handleAnswerSelect = (questionIndex, answerIndex) => {
        if (teacherEditMode) {
            updateQuestion(questionIndex, { correctAnswer: answerIndex });
            return;
        }
        setSelectedAnswers(prev => ({
            ...prev,
            [questionIndex]: answerIndex
        }));
    };

    const markDirty = () => {
        setSaveState('dirty');
        onDirtyChange?.(true);
    };

    const updateQuestion = (questionIndex, patch) => {
        setQuestions(current => current.map((question, index) =>
            index === questionIndex ? { ...question, ...patch } : question
        ));
        markDirty();
    };

    const updateTestConfig = nextConfig => {
        setTestConfig(nextConfig);
        markDirty();
    };

    const addQuestion = () => {
        const question = {
            id: crypto.randomUUID?.() || Date.now(),
            question: 'Nová otázka',
            options: ['Prvá možnosť', 'Druhá možnosť', 'Tretia možnosť', 'Štvrtá možnosť'],
            correctAnswer: 0,
            explanation: 'Doplňte vysvetlenie správnej odpovede.',
            difficulty: 'medium',
        };
        const next = [...questions];
        next.splice(currentQuestionIndex + 1, 0, question);
        setQuestions(next);
        setCurrentQuestionIndex(currentQuestionIndex + 1);
        markDirty();
    };

    const duplicateQuestion = () => {
        const source = questions[currentQuestionIndex];
        const copy = {
            ...source,
            id: crypto.randomUUID?.() || Date.now(),
            options: [...source.options],
            question: `${source.question} – kópia`,
        };
        const next = [...questions];
        next.splice(currentQuestionIndex + 1, 0, copy);
        setQuestions(next);
        setCurrentQuestionIndex(currentQuestionIndex + 1);
        markDirty();
    };

    const deleteQuestion = () => {
        if (questions.length === 1) {
            window.alert('Test musí obsahovať aspoň jednu otázku.');
            return;
        }
        if (!window.confirm(`Odstrániť otázku ${currentQuestionIndex + 1}?`)) return;
        const next = questions.filter((_, index) => index !== currentQuestionIndex);
        setQuestions(next);
        setCurrentQuestionIndex(Math.min(currentQuestionIndex, next.length - 1));
        markDirty();
    };

    const saveTeacherTest = () => {
        const tests = getTeacherTests();
        saveTeacherTests({
            ...tests,
            [topicId]: {
                questions,
                settings: testConfig,
                updatedAt: new Date().toISOString(),
            },
        });
        setSaveState('saved');
        onDirtyChange?.(false);
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

    const jumpToQuestion = index => {
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

    const saveResult = (scoreValue, total, topic) => {
        const results = JSON.parse(localStorage.getItem('testResults') || '[]');
        const percentage = Math.round((scoreValue / total) * 100);

        results.push({
            date: new Date().toISOString(),
            topic: topic.replace('-', ' '),
            score: scoreValue,
            total,
            percentage,
            timeSpent,
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
        setTimeLeft(testConfig.timeLimitMinutes * 60);
        setTimeSpent(0);
        setLoading(true);
        loadQuestions();
    };

    const formatTime = seconds => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;

        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    const getTestHistory = () => {
        const results = JSON.parse(localStorage.getItem('testResults') || '[]');

        return results.filter(result => result.topic === topicId.replace('-', ' '));
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
            ? Math.max(...history.slice(0, -1).map(result => result.percentage))
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
                                    <div key={question.id || index} className={`review-question ${isCorrect ? 'correct' : 'incorrect'}`}>
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
                                <button
                                    className="btn btn-secondary"
                                    onClick={() => window.dispatchEvent(new CustomEvent('closeTest'))}
                                >
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

    if (teacherEditMode) {
        return (
            <TeacherTestVisual
                questions={questions}
                currentQuestionIndex={currentQuestionIndex}
                setCurrentQuestionIndex={setCurrentQuestionIndex}
                currentQuestion={currentQuestion}
                saveState={saveState}
                updateQuestion={updateQuestion}
                addQuestion={addQuestion}
                duplicateQuestion={duplicateQuestion}
                deleteQuestion={deleteQuestion}
                saveTeacherTest={saveTeacherTest}
                prevQuestion={prevQuestion}
                nextQuestion={nextQuestion}
                onExitEditor={onExitEditor}
                markDirty={markDirty}
                testConfig={testConfig}
                updateTestConfig={updateTestConfig}
            />
        );
    }

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

            </div>

            <div className="test-navigation">
                <div className={`nav-buttons ${currentQuestionIndex === 0 ? 'first-question' : ''}`}>
                    {currentQuestionIndex > 0 ? (
                        <button
                            className="btn btn-secondary"
                            onClick={prevQuestion}
                        >
                            <i className="fas fa-arrow-left"></i> Predchádzajúca
                        </button>
                    ) : (
                        <button
                            className="btn btn-secondary"
                            onClick={() => window.dispatchEvent(new CustomEvent('closeTest'))}
                        >
                            <i className="fas fa-arrow-left"></i> Späť k teórii
                        </button>
                    )}

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
