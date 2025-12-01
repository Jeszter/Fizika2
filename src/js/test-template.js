
class TestTemplate {
    constructor(testData) {
        this.testData = testData;
        this.currentQuestion = 1;
        this.totalQuestions = testData.questions.length;
        this.timerInterval = null;
        this.seconds = 0;
        this.timeLimit = testData.timeLimit || 15 * 60;
        this.userAnswers = {};
    }

    generateHTML() {
        return `
            <div class="section active" id="test-section">
                <div class="test-header">
                    <h2><i class="fas fa-file-pen"></i> Test: ${this.testData.title}</h2>
                    <div class="test-info">
                        <div class="test-timer">
                            <i class="fas fa-clock"></i>
                            <span id="timer">${this.formatTime(this.timeLimit)}</span>
                        </div>
                        <div class="test-progress">
                            <span>Pokrok:</span>
                            <div class="progress-bar">
                                <div class="progress-fill" id="test-progress" style="width: ${(1/this.totalQuestions)*100}%"></div>
                            </div>
                            <span id="progress-text">1/${this.totalQuestions}</span>
                        </div>
                    </div>
                </div>

                ${this.generateQuestions()}

                <div class="test-actions">
                    <button class="btn btn-secondary" id="prev-question" disabled>
                        <i class="fas fa-arrow-left"></i> Predchádzajúca
                    </button>
                    <button class="btn btn-primary" id="next-question">
                        Ďalšia <i class="fas fa-arrow-right"></i>
                    </button>
                    <button class="btn btn-finish" id="finish-test" style="display: none;">
                        <i class="fas fa-flag-checkered"></i> Ukončiť test
                    </button>
                </div>
            </div>

            <div class="section" id="results-section" style="display: none;">
                <div class="results-container">
                    <h2><i class="fas fa-poll"></i> Výsledky testu: ${this.testData.title}</h2>

                    <div class="score-circle">
                        <div class="score-inner">
                            <div class="score-value" id="score-value">0%</div>
                            <div class="score-text" id="score-text">Úspešnosť</div>
                        </div>
                    </div>

                    <div class="results-details">
                        <div class="result-card">
                            <div class="result-value" id="correct-answers">0</div>
                            <div class="result-label">Správne odpovede</div>
                        </div>
                        <div class="result-card">
                            <div class="result-value" id="total-questions">${this.totalQuestions}</div>
                            <div class="result-label">Celkom otázok</div>
                        </div>
                        <div class="result-card">
                            <div class="result-value" id="time-spent">00:00</div>
                            <div class="result-label">Čas</div>
                        </div>
                    </div>

                    <div id="retry-message" class="retry-message" style="display: none;">
                        <h3><i class="fas fa-exclamation-triangle"></i> Test ste neprešli</h3>
                        <p>Váš výsledok je pod 51%. Musíte test prejsť znova.</p>
                        <button class="btn btn-retry" id="retry-test">
                            <i class="fas fa-redo"></i> Skúsiť znova
                        </button>
                    </div>

                    <div id="success-message" class="success-message" style="display: none;">
                        <h3><i class="fas fa-check-circle"></i> Gratulujeme!</h3>
                        <p>Úspešne ste prešli testom. Môžete pokračovať na ďalšiu tému.</p>
                        <button class="btn btn-primary" id="next-topic">
                            <i class="fas fa-arrow-right"></i> Ďalšia téma
                        </button>
                    </div>

                    <div class="back-to-theory">
                        <button class="btn btn-secondary" onclick="loadSection('${this.testData.backToTheory}')">
                            <i class="fas fa-book"></i> Späť k teórii
                        </button>
                    </div>
                </div>
            </div>
        `;
    }

    generateQuestions() {
        return this.testData.questions.map((question, index) => `
            <div class="question" id="question-${index + 1}">
                <div class="question-header">
                    <h3>${question.type === 'theory' ? 'Teoretická otázka' : 'Praktická otázka'} ${index + 1}</h3>
                    <div class="question-type">${question.type === 'theory' ? 'Teória' : 'Prax'}</div>
                </div>
                <div class="question-text">${question.text}</div>

                <div class="options">
                    ${question.options.map((option, optIndex) => `
                        <div class="option" data-correct="${option.correct}">
                            <span class="option-letter">${String.fromCharCode(65 + optIndex)}</span>
                            <span class="option-text">${option.text}</span>
                        </div>
                    `).join('')}
                </div>
            </div>
        `).join('');
    }

    initializeTest() {
        console.log('🚀 Inicializujem test pomocou šablóny...');
        this.showQuestion(1);
        this.startTimer();
        document.querySelectorAll('.option').forEach(option => {
            option.addEventListener('click', () => this.handleAnswerSelection(option));
        });

        const nextBtn = document.getElementById('next-question');
        const prevBtn = document.getElementById('prev-question');
        const finishBtn = document.getElementById('finish-test');

        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                if (this.currentQuestion < this.totalQuestions) {
                    this.showQuestion(this.currentQuestion + 1);
                }
            });
        }

        if (prevBtn) {
            prevBtn.addEventListener('click', () => {
                if (this.currentQuestion > 1) {
                    this.showQuestion(this.currentQuestion - 1);
                }
            });
        }

        if (finishBtn) {
            finishBtn.addEventListener('click', () => {
                this.finishTest();
            });
        }

        const retryBtn = document.getElementById('retry-test');
        const nextTopicBtn = document.getElementById('next-topic');

        if (retryBtn) {
            retryBtn.addEventListener('click', () => {
                this.resetTest();
            });
        }

        if (nextTopicBtn && this.testData.nextTopic) {
            nextTopicBtn.addEventListener('click', () => {
                loadSection(this.testData.nextTopic);
            });
        }

        console.log(`✅ Test šablóna inicializovaná! Počet otázok: ${this.totalQuestions}`);
    }

    showQuestion(questionNumber) {

        document.querySelectorAll('.question').forEach(question => {
            question.style.display = 'none';
        });

        const currentQuestionElem = document.getElementById(`question-${questionNumber}`);
        if (currentQuestionElem) {
            currentQuestionElem.style.display = 'block';
            this.currentQuestion = questionNumber;
        }

        this.updateNavigationButtons();
        this.updateProgress();
    }

    updateNavigationButtons() {
        const prevBtn = document.getElementById('prev-question');
        const nextBtn = document.getElementById('next-question');
        const finishBtn = document.getElementById('finish-test');

        if (prevBtn) {
            prevBtn.disabled = this.currentQuestion === 1;
        }

        if (nextBtn && finishBtn) {
            if (this.currentQuestion === this.totalQuestions) {
                nextBtn.style.display = 'none';
                finishBtn.style.display = 'inline-flex';
            } else {
                nextBtn.style.display = 'inline-flex';
                finishBtn.style.display = 'none';
            }
        }
    }

    updateProgress() {
        const progressBar = document.getElementById('test-progress');
        const progressText = document.getElementById('progress-text');

        if (progressBar && progressText) {
            const progress = (this.currentQuestion / this.totalQuestions) * 100;
            progressBar.style.width = `${progress}%`;
            progressText.textContent = `${this.currentQuestion}/${this.totalQuestions}`;
        }
    }

    startTimer() {
        this.updateTimerDisplay();
        this.timerInterval = setInterval(() => {
            this.seconds++;
            this.updateTimerDisplay();

            const timeLeft = this.timeLimit - this.seconds;
            if (timeLeft <= 0) {
                this.finishTest();
            } else if (timeLeft <= 60) {
                const timerElement = document.getElementById('timer');
                if (timerElement) {
                    timerElement.style.color = '#ef4444';
                }
            }
        }, 1000);
    }

    updateTimerDisplay() {
        const timerElement = document.getElementById('timer');
        if (timerElement) {
            const timeLeft = this.timeLimit - this.seconds;
            timerElement.textContent = this.formatTime(timeLeft);
        }
    }

    handleAnswerSelection(option) {
        const question = option.closest('.question');
        question.querySelectorAll('.option').forEach(opt => {
            opt.classList.remove('selected');
        });

        option.classList.add('selected');

        const questionId = question.id;
        const answer = option.querySelector('.option-letter').textContent;
        this.userAnswers[questionId] = answer;
    }

    calculateScore() {
        let correct = 0;

        for (let i = 1; i <= this.totalQuestions; i++) {
            const question = document.getElementById(`question-${i}`);
            if (!question) continue;

            const selectedOption = question.querySelector('.option.selected');
            if (selectedOption && selectedOption.dataset.correct === 'true') {
                correct++;
            }
        }

        return Math.round((correct / this.totalQuestions) * 100);
    }

    finishTest() {
        clearInterval(this.timerInterval);

        const score = this.calculateScore();
        const correctAnswers = Math.round((score / 100) * this.totalQuestions);
        const timeSpent = this.formatTime(this.seconds);

        document.getElementById('score-value').textContent = `${score}%`;
        document.getElementById('correct-answers').textContent = correctAnswers;
        document.getElementById('time-spent').textContent = timeSpent;

        if (score >= 51) {
            document.getElementById('success-message').style.display = 'block';
            document.getElementById('retry-message').style.display = 'none';
        } else {
            document.getElementById('success-message').style.display = 'none';
            document.getElementById('retry-message').style.display = 'block';
        }

        document.getElementById('test-section').style.display = 'none';
        document.getElementById('results-section').style.display = 'block';
    }

    resetTest() {

        document.querySelectorAll('.option').forEach(option => {
            option.classList.remove('selected');
        });

        this.currentQuestion = 1;
        this.seconds = 0;
        this.userAnswers = {};

        this.showQuestion(1);
        this.startTimer();

        document.getElementById('test-section').style.display = 'block';
        document.getElementById('results-section').style.display = 'none';
    }

    formatTime(totalSeconds) {
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;
        return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }
}

window.currentTest = null;