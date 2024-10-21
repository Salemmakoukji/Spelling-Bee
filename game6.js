let userData = JSON.parse(localStorage.getItem('user')) || { name: "Player", score: 0, gameScores: {} };

// Load player name and total score on page load
document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('playerNameInput').value = userData.name;
    document.getElementById('playerScore').textContent = `Score: ${userData.score}`;
    document.getElementById('playerNameInput').addEventListener('input', updatePlayerName);
    loadRandomLetter();
});

// Function to show score breakdown
function showScoreDetails() {
    const scoreBreakdownDiv = document.getElementById('scoreBreakdown');
    const gameScores = userData.gameScores || {};

    let scoreDetails = '<strong>Game Scores:</strong><br>';
    scoreDetails += `Spelling Game: ${gameScores.spelling || 0} points<br>`;
    scoreDetails += `Who Am I?: ${gameScores.whoami || 0} points<br>`;
    scoreDetails += `Hangman: ${gameScores.hangman || 0} points<br>`;
    scoreDetails += `What Is It?: ${gameScores.whatisit || 0} points<br>`;
    scoreDetails += `Missing Letters: ${gameScores.missingletters || 0} points<br>`;
    scoreDetails += `10 Words: ${gameScores.tenwords || 0} points`;

    scoreBreakdownDiv.innerHTML = scoreDetails;
    scoreBreakdownDiv.classList.add('tooltip-visible');
}

// Function to hide score breakdown
function hideScoreDetails() {
    const scoreBreakdownDiv = document.getElementById('scoreBreakdown');
    scoreBreakdownDiv.classList.remove('tooltip-visible');
}

// Function to update player name
function updatePlayerName() {
    userData.name = document.getElementById('playerNameInput').value;
    localStorage.setItem('user', JSON.stringify(userData));
}

// Example function for a game to update the score
function updateGameScore(game, points) {
    if (!userData.gameScores) {
        userData.gameScores = {};
    }
    if (!userData.gameScores[game]) {
        userData.gameScores[game] = 0;
    }
    userData.gameScores[game] += points;
    userData.score += points;

    // Update total score display
    document.getElementById('playerScore').textContent = `Score: ${userData.score}`;

    // Save updated user data to localStorage
    localStorage.setItem('user', JSON.stringify(userData));
}

// Function to generate a random letter
function loadRandomLetter() {
    const alphabet = "abcdefghijklmnopqrstuvwxyz";
    const randomIndex = Math.floor(Math.random() * alphabet.length);
    const randomLetter = alphabet[randomIndex].toUpperCase();

    document.getElementById('randomLetter').textContent = `Your letter is: ${randomLetter}`;
}

// Function to submit the player's words
function submitWords() {
    const letter = document.getElementById('randomLetter').textContent.split(":")[1].trim().toLowerCase();
    const wordInputs = document.querySelectorAll('.wordInput');
    let correctWords = 0;
    let wordsChecked = 0;

    // Clear game message
    document.getElementById('gameMessage').textContent = 'Checking words...';

    // Iterate through all input words and validate them with the dictionary API
    wordInputs.forEach(input => {
        const word = input.value.trim().toLowerCase();

        if (word.startsWith(letter) && word.length > 1) {
            checkWordWithAPI(word)
                .then(isValid => {
                    wordsChecked++;
                    if (isValid) {
                        correctWords++;
                    }

                    // Once all words are checked, show results
                    if (wordsChecked === wordInputs.length) {
                        finalizeScore(correctWords);
                    }
                });
        } else {
            wordsChecked++;
            if (wordsChecked === wordInputs.length) {
                finalizeScore(correctWords);
            }
        }
    });
}

// Function to finalize the score after all words are validated
function finalizeScore(correctWords) {
    if (correctWords === 10) {
        document.getElementById('gameMessage').textContent = 'All words are correct! +10 points';
        updateGameScore('tenwords', +10);
    } else {
        const pointsEarned = correctWords * 1;
        document.getElementById('gameMessage').textContent = `${correctWords} out of 10 words are correct! +${pointsEarned} points`;
        updateGameScore('tenwords', -10);
    }

    updateScore();
}

// Function to update the player's score and save it in localStorage
function updateScore() {
    document.getElementById('playerScore').textContent = `Score: ${userData.score}`;
    document.getElementById('tenWordsScore').textContent = userData.gameScores.tenWords;
    localStorage.setItem('user', JSON.stringify(userData));
}

// Function to reset the game for the next random letter
function resetGame() {
    document.querySelectorAll('.wordInput').forEach(input => input.value = '');
    document.getElementById('gameMessage').textContent = '';
    loadRandomLetter();
}

// Function to update the player name in the localStorage
function updatePlayerName() {
    userData.name = document.getElementById('playerNameInput').value;
    localStorage.setItem('user', JSON.stringify(userData));
}

// Function to go back to the home page (index.html)
function goHome() {
    window.location.href = 'index.html';
}

// Function to check if a word exists using a dictionary API
function checkWordWithAPI(word) {
    const apiUrl = `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`;

    return fetch(apiUrl)
        .then(response => {
            if (!response.ok) {
                return false; // Word not found
            }
            return response.json();
        })
        .then(data => {
            // If the word has a valid definition, return true
            return data.length > 0;
        })
        .catch(error => {
            console.error(`Error checking word "${word}":`, error);
            return false; // In case of error, assume word is invalid
        });
}