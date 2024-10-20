let imageIndex = 0;
let correctWord = '';
let score = 0;
let userData = JSON.parse(localStorage.getItem('user')) || { name: "Player", score: 0 };

// Load the player name and score when the page loads
document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('playerNameInput').value = userData.name;
    document.getElementById('playerScore').textContent = `Score: ${userData.score}`;
    document.getElementById('playerNameInput').addEventListener('input', updatePlayerName);
    loadNewImage();
});

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
        score += 10;
        userData.score += 10;
    } else {
        document.getElementById('gameMessage').textContent = `Incorrect! The correct word was "${correctWord}". -5 points`;
        score -= 5;
        userData.score -= 5;
    }

    updateScore();
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
