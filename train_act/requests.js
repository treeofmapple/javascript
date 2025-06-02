const API_URL = 'http://127.0.0.1:5000';

/**
 * A centralized fetch wrapper to handle errors and include credentials.
 * The 'credentials: "include"' option is essential for Flask's session cookies to work.
 * @param {string} endpoint - The API endpoint to call (e.g., '/start').
 * @param {object} options - The options object for the fetch call (method, body, etc.).
 * @returns {Promise<any>} - The JSON response from the server.
 */
async function apiFetch(endpoint, options = {}) {
    try {
        const response = await fetch(`${API_URL}${endpoint}`, {
            ...options,
            headers: {
                'Content-Type': 'application/json',
                ...options.headers
            },
            credentials: 'include' // Crucial for sending session cookies
        });

        const data = await response.json();

        if (!response.ok) {
            // Throw an error with the message from the server's JSON response
            throw new Error(data.error || `HTTP error! status: ${response.status}`);
        }

        return data;
    } catch (error) {
        console.error(`API Fetch Error (${endpoint}):`, error.message);
        // Re-throw the error to stop the execution flow in the calling function
        throw error;
    }
}

/**
 * Checks if the API is online.
 */
async function checkApiStatus() {
    console.log("1. Checking API status...");
    const data = await apiFetch('/');
    console.log("API Status:", data.message);
}

/**
 * Starts a new game session.
 * @param {string} userName - The name of the user.
 * @param {string} userEmail - The email of the user.
 */
async function startGame(userName, userEmail) {
    console.log("2. Starting game for:", userEmail);
    const data = await apiFetch('/start', {
        method: 'POST',
        body: JSON.stringify({
            user: userName,
            email: userEmail
        })
    });
    console.log("Game started:", data.message);
}

/**
 * Fetches a batch of questions to choose from.
 * @returns {Promise<Array<object>>} A promise that resolves to an array of question objects.
 */
async function selectQuestions() {
    console.log("3. Selecting new questions...");
    const questions = await apiFetch('/select', {
        method: 'POST'
    });
    console.log(`Received ${questions.length} questions.`);
    return questions;
}

/**
 * Submits an answer for a specific question.
 * @param {number} questionId - The ID of the question being answered.
 * @param {number} answerIndex - The number of the chosen answer (e.g., 1, 2, 3, 4).
 * @returns {Promise<object>} A promise that resolves to the result object from the server.
 */
async function submitAnswer(questionId, answerIndex) {
    console.log(`4. Submitting answer '${answerIndex}' for question ID '${questionId}'...`);
    const result = await apiFetch(`/answer/${questionId}`, {
        method: 'POST',
        body: JSON.stringify({
            answer: answerIndex
        })
    });
    console.log("Answer Result:", result);
    return result;
}

/**
 * Manually ends the game and retrieves the final summary.
 * @returns {Promise<object>} A promise that resolves to the final game summary.
 */
async function endGame() {
    console.log("5. Ending game and getting summary...");
    const summary = await apiFetch('/end', {
        method: 'POST'
    });
    console.log("Final Summary:", summary);
    return summary;
}


// --- EXAMPLE USAGE ---
// This function demonstrates how to use the API calls in the correct sequence.
async function runGame() {
    try {
        // Step 1: Check if the API is online
        await checkApiStatus();

        // Step 2: Start the game with user details
        await startGame("Test Player", "test@example.com");

        // Step 3: Get the first batch of questions
        let questions = await selectQuestions();

        if (questions.length > 0) {
            // For demonstration, we'll automatically pick the first question
            const questionToAnswer = questions[0];
            const chosenAnswer = 1; // Let's pretend the user chose the first option

            // Step 4: Submit our answer
            const result = await submitAnswer(questionToAnswer.id, chosenAnswer);

             // You can add a loop here to answer more questions until game_over is true
             // For this example, we'll just end the game.
        }
        
        // Step 5: End the game and see the final score
        await endGame();

    } catch (error) {
        console.error("\n--- A critical error occurred during the game flow ---");
        // The error is already logged by apiFetch, but this indicates where the flow stopped.
    }
}

// To run the demonstration, you would call runGame() in a browser console
// or from a <script> tag in an HTML file.
// runGame();
