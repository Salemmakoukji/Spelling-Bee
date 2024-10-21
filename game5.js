let wordIndex = 0;
let correctWord = '';
let maskedWord = '';
let userData = JSON.parse(localStorage.getItem('user')) || { name: "Player", score: 0, gameScores: {} };

// Load player name and total score on page load
document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('playerNameInput').value = userData.name;
    document.getElementById('playerScore').textContent = `Score: ${userData.score}`;
    document.getElementById('playerNameInput').addEventListener('input', updatePlayerName);
    loadNewWord();
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


// Function to load a new word with missing letters
function loadNewWord() {
    fetch('Game5Words.json')
        .then(response => response.json())
        .then(data => {
            // Randomly choose a word from the list
            const randomIndex = Math.floor(Math.random() * data.words.length);
            wordIndex = randomIndex;
            correctWord = data.words[randomIndex].word.toLowerCase();

            // Mask a part of the word with underscores (e.g., "ap_le" for "apple")
            maskedWord = maskWord(correctWord);
            document.getElementById('missingWord').textContent = maskedWord;

            // Clear any previous input or messages
            document.getElementById('letterGuessInput').value = '';
            document.getElementById('gameMessage').textContent = '';
        })
        .catch(error => console.error('Error loading missing words:', error));
}

// Function to mask letters in a word with underscores
function maskWord(word) {
    // For simplicity, replace a few random letters with "_"
    const missingLetterIndices = [1, 3]; // Choose letters to replace
    let masked = word.split('');

    missingLetterIndices.forEach(index => {
        if (index < word.length) {
            masked[index] = '▢';
        }
    });

    return masked.join('');
}

// Function to submit the player's guess
function submitGuess() {
    const guess = document.getElementById('letterGuessInput').value.toLowerCase();
    if (guess === '') {
        document.getElementById('gameMessage').textContent = 'Please enter your guess!';
        return;
    }

    // Compare the player's guess with the correct missing letters
    const correctLetters = correctWord.split('').filter((letter, index) => maskedWord[index] === '▢').join('');
    
    if (guess === correctLetters) {
        document.getElementById('gameMessage').textContent = 'Correct! +10 points';
        updateGameScore('missingletters', 10);
    } else {
        document.getElementById('gameMessage').textContent = `Incorrect! The correct word was "${correctWord}". -10 points`;
        updateGameScore('missingletters', -10);
    }

    updateScore();
    loadNewWord();
}

// Function to update the player's score and save it in localStorage
function updateScore() {
    document.getElementById('playerScore').textContent = `Score: ${userData.score}`;
    document.getElementById('missingLettersScore').textContent = userData.gameScores.missingLetters;
    localStorage.setItem('user', JSON.stringify(userData));
}

// Function to reset the game for the next word
function resetGame() {
    loadNewWord();
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
