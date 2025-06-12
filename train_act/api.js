const API_URL = 'http://localhost:5000';

async function apiFetch(endpoint, options = {}) {
    // ... (this function is unchanged)
    try {
        const response = await fetch(`${API_URL}${endpoint}`, {
            ...options,
            headers: {
                'Content-Type': 'application/json',
                ...options.headers
            },
            credentials: 'include'
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || `HTTP error! status: ${response.status}`);
        }

        return data;
    } catch (error) {
        console.error(`API Fetch Error (${endpoint}):`, error.message);
        throw error;
    }
}

const api = {
    startGame: (userName, userEmail) => apiFetch('/start', {
        method: 'POST',
        body: JSON.stringify({ user: userName, email: userEmail })
    }),

    getChoices: (userEmail) => apiFetch('/choices', {
        method: 'POST',
        body: JSON.stringify({ email: userEmail })
    }),

    getQuestion: (questionId) => apiFetch('/question', {
        method: 'POST',
        body: JSON.stringify({ question_id: questionId })
    }),

    submitAnswer: (userEmail, questionId, answerIndex) => apiFetch('/answer', {
        method: 'POST',
        body: JSON.stringify({ email: userEmail, question_id: questionId, answer: answerIndex })
    }),

    endGame: (userEmail) => apiFetch('/end', {
        method: 'POST',
        body: JSON.stringify({ email: userEmail })
    }),
    getProfile: (userEmail) => apiFetch('/profile', {
        method: 'POST',
        body: JSON.stringify({ email: userEmail })
    })
};