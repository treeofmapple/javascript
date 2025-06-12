document.addEventListener('DOMContentLoaded', () => {
    let currentQuestion = null;
    let currentUserEmail = null;
    let answeredCount = 0;

    const views = {
        start: document.getElementById('start-view'),
        choice: document.getElementById('choice-view'),
        question: document.getElementById('question-view'),
        feedback: document.getElementById('feedback-view'),
        summary: document.getElementById('summary-view'),
        loading: document.getElementById('loading-indicator'),
        error: document.getElementById('error-message'),
        // Add new views
        profileLookup: document.getElementById('profile-lookup-view'),
        profile: document.getElementById('profile-view'),
    };

    // --- Add new element selectors ---
    const showProfileLookupBtn = document.getElementById('show-profile-lookup-btn');
    const profileLookupForm = document.getElementById('profile-lookup-form');
    const backToStartFromLookupBtn = document.getElementById('back-to-start-from-lookup-btn');
    const profileNameEl = document.getElementById('profile-name');
    const profileBestScoreEl = document.getElementById('profile-best-score');
    const backToStartFromProfileBtn = document.getElementById('back-to-start-from-profile-btn');

    // --- (Other element selectors are the same) ---
    const startForm = document.getElementById('start-form');
    const answerForm = document.getElementById('answer-form');
    const choicesContainer = document.getElementById('choices-container');
    const questionText = document.getElementById('question-text');
    const optionsContainer = document.getElementById('options-container');
    const questionNumberEl = document.getElementById('question-number');
    const currentScoreEl = document.getElementById('current-score');
    const feedbackTitle = document.getElementById('feedback-title');
    const feedbackExplanation = document.getElementById('feedback-explanation');
    const nextQuestionBtn = document.getElementById('next-question-btn');
    const showSummaryBtn = document.getElementById('show-summary-btn');
    const finalScore = document.getElementById('final-score');
    const summaryTableContainer = document.getElementById('summary-table');
    const playAgainBtn = document.getElementById('play-again-btn');

    // --- (showView and showError are the same) ---
    function showView(viewName) {
        Object.values(views).forEach(view => view.style.display = 'none');
        views.error.style.display = 'none';
        if (views[viewName]) {
            views[viewName].style.display = 'block';
        }
    }
    
    function showError(message) {
        views.error.textContent = `Error: ${message}`;
        views.error.style.display = 'block';
    }

    // --- (Game logic functions are the same) ---
    async function handleStartGame(event) {
        event.preventDefault();
        showView('loading');
        const name = event.target.elements.name.value;
        const email = event.target.elements.email.value;
        try {
            const response = await api.startGame(name, email);
            currentUserEmail = response.email;
            resetUI();
            await fetchChoices();
        } catch (error) {
            showView('start');
            showError(error.message);
        }
    }

    async function fetchChoices() {
        showView('loading');
        try {
            const result = await api.getChoices(currentUserEmail);
            if (result.message && result.message.includes("Game over")) {
                displaySummary(result);
            } else {
                answeredCount = result.answered_count;
                displayChoices(result.choices);
            }
        } catch (error) {
            showError(error.message);
            showView('choice');
        }
    }

    function displayChoices(choices) {
        choicesContainer.innerHTML = '';
        choices.forEach(choice => {
            const button = document.createElement('button');
            button.innerHTML = choice.question_text;
            button.dataset.questionId = choice.id;
            button.addEventListener('click', handleChoiceSelection);
            choicesContainer.appendChild(button);
        });
        showView('choice');
    }

    async function handleChoiceSelection(event) {
        const questionId = event.target.dataset.questionId;
        showView('loading');
        try {
            questionNumberEl.textContent = answeredCount + 1;
            currentQuestion = await api.getQuestion(questionId);
            displayQuestion(currentQuestion);
        } catch (error) {
            showError(error.message);
            showView('choice');
        }
    }

    function displayQuestion(question) {
        questionText.textContent = question.question_text;
        optionsContainer.innerHTML = '';
        answerForm.reset();
        question.options.forEach(option => {
            const label = document.createElement('label');
            const input = document.createElement('input');
            input.type = 'radio';
            input.name = 'answer';
            input.value = option.number;
            input.required = true;
            label.appendChild(input);
            label.appendChild(document.createTextNode(` ${option.text}`));
            optionsContainer.appendChild(label);
        });
        showView('question');
    }

    async function handleAnswerSubmit(event) {
        event.preventDefault();
        const selectedOption = answerForm.querySelector('input[name="answer"]:checked');
        if (!selectedOption) {
            showError("Please select an answer.");
            return;
        }
        
        showView('loading');
        try {
            const result = await api.submitAnswer(currentUserEmail, currentQuestion.id, parseInt(selectedOption.value));
            displayFeedback(result);
            currentScoreEl.textContent = result.current_score;
        } catch (error) {
            showView('question');
            showError(error.message);
        }
    }

    function displayFeedback(result) {
        if (result.result === 'correct') {
            feedbackTitle.textContent = "Correto! 🎉";
            feedbackTitle.style.color = 'var(--pico-color-green-500)';
        } else {
            feedbackTitle.textContent = "Incorreto 😟";
            feedbackTitle.style.color = 'var(--pico-color-red-500)';
        }
        feedbackExplanation.textContent = result.explanation;
        
        if (result.game_over) {
            nextQuestionBtn.style.display = 'none';
            showSummaryBtn.style.display = 'block';
        } else {
            nextQuestionBtn.style.display = 'block';
            showSummaryBtn.style.display = 'none';
        }
        showView('feedback');
    }

    async function handleShowSummary() {
        showView('loading');
        try {
            const summaryData = await api.endGame(currentUserEmail);
            displaySummary(summaryData);
        } catch(error) {
            showView('feedback');
            showError(error.message);
        }
    }

    function displaySummary(summaryData) {
        finalScore.textContent = `Sua pontuação final: ${summaryData.final_score}`;
        let tableHTML = `
            <table>
                <thead>
                    <tr>
                        <th>Questão</th>
                        <th>Sua Resposta</th>
                        <th>Resposta Correta</th>
                    </tr>
                </thead>
                <tbody>
        `;
        summaryData.summary.forEach(item => {
            const yourAnswerText = item.options[item.user_answer] || "N/A";
            const correctAnswerText = item.options[item.correct_answer] || "N/A";
            const isCorrect = item.user_answer === item.correct_answer;
            tableHTML += `
                <tr>
                    <td>${item.question_text}</td>
                    <td style="color: ${isCorrect ? 'green' : 'red'};">${yourAnswerText}</td>
                    <td>${correctAnswerText}</td>
                </tr>
            `;
        });
        tableHTML += `</tbody></table>`;
        summaryTableContainer.innerHTML = tableHTML;
        showView('summary');
    }
    // --- NEW FUNCTIONS FOR PROFILE VIEW ---

    async function handleProfileLookup(event) {
        event.preventDefault();
        const email = event.target.elements.email.value;
        showView('loading');
        try {
            const profileData = await api.getProfile(email);
            displayProfile(profileData);
        } catch (error) {
            showView('profileLookup'); // Go back to lookup on error
            showError(error.message);
        }
    }

    function displayProfile(profileData) {
        profileNameEl.textContent = profileData.name;
        profileBestScoreEl.textContent = profileData.best_score;
        showView('profile');
    }

    function resetUI() {
        currentQuestion = null;
        answeredCount = 0;
        currentScoreEl.textContent = '0';
        questionNumberEl.textContent = '1';
    }

    function handlePlayAgain() {
        currentUserEmail = null;
        resetUI();
        showView('start');
    }

    showProfileLookupBtn.addEventListener('click', () => showView('profileLookup'));
    profileLookupForm.addEventListener('submit', handleProfileLookup);
    backToStartFromLookupBtn.addEventListener('click', () => showView('start'));
    backToStartFromProfileBtn.addEventListener('click', () => showView('start'));

    startForm.addEventListener('submit', handleStartGame);
    answerForm.addEventListener('submit', handleAnswerSubmit);
    nextQuestionBtn.addEventListener('click', fetchChoices);
    showSummaryBtn.addEventListener('click', handleShowSummary);
    playAgainBtn.addEventListener('click', handlePlayAgain);
});