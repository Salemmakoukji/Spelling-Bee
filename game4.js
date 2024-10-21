let imageIndex = 0;
let correctWord = '';
let score = 0;
let userData = JSON.parse(localStorage.getItem('user')) || { name: "Player", score: 0, gameScores: {} };

// Load player name and total score on page load
document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('playerNameInput').value = userData.name;
    document.getElementById('playerScore').textContent = `Score: ${userData.score}`;
    document.getElementById('playerNameInput').addEventListener('input', updatePlayerName);
    loadNewImage();
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

// Example of how a game might call the update function
// Call updateGameScore('spelling', 10) for the spelling game, for example.

// Function to load the next image and correct word
function loadNewImage() {
    fetch('Game4Words.json')
        .then(response => response.json())
        .then(data => {
            // Randomly choose an image from the list
            const randomIndex = Math.floor(Math.random() * data.words.length);
            imageIndex = randomIndex;
            correctWord = data.words[randomIndex].word.toLowerCase();

            // Update image source
            const imagePath = data.words[randomIndex].imagePath;
            document.getElementById('guessImage').src = imagePath;

            // Clear any previous messages or guesses
            document.getElementById('guessInput').value = '';
            document.getElementById('gameMessage').textContent = '';
        })
        .catch(error => console.error('Error loading image words:', error));
}

// Function to submit the player's guess
function submitGuess() {
    const guess = document.getElementById('guessInput').value.toLowerCase();
    if (guess === '') {
        document.getElementById('gameMessage').textContent = 'Please enter a guess!';
        return;
    }

    if (guess === correctWord) {
        document.getElementById('gameMessage').textContent = 'Correct! +10 points';
        updateGameScore('whatisit', 10);
    } else {
        document.getElementById('gameMessage').textContent = `Incorrect! The correct word was "${correctWord}". -10 points`;
        updateGameScore('whatisit', -10);
    }

    updateScore();
    loadNewImage();
}

// Function to update the player's score and save it in localStorage
function updateScore() {
    document.getElementById('playerScore').textContent = `Score: ${userData.score}`;
    localStorage.setItem('user', JSON.stringify(userData));
}

// Function to reset the game for the next image
function resetGame() {
    loadNewImage();
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
