let wordIndex = 0;
let correctWord = '';
let maskedWord = '';
let userData = JSON.parse(localStorage.getItem('user')) || { 
    name: "Player", 
    score: 0, 
    gameScores: {
        spellingGame: 0,
        whoAmI: 0,
        hangman: 0,
        whatIsIt: 0,
        missingLetters: 0,
        tenWords: 0
    }
};

// Load the player name and score when the page loads
document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('playerNameInput').value = userData.name;
    document.getElementById('playerScore').textContent = `Score: ${userData.score}`;
    document.getElementById('playerNameInput').addEventListener('input', updatePlayerName);

    // Display individual game scores in the tooltip
    document.getElementById('spellingScore').textContent = userData.gameScores.spellingGame;
    document.getElementById('whoAmIScore').textContent = userData.gameScores.whoAmI;
    document.getElementById('hangmanScore').textContent = userData.gameScores.hangman;
    document.getElementById('whatIsItScore').textContent = userData.gameScores.whatIsIt;
    document.getElementById('missingLettersScore').textContent = userData.gameScores.missingLetters;
    document.getElementById('tenWordsScore').textContent = userData.gameScores.tenWords;

    loadNewWord();
});

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
            masked[index] = '_';
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
    const correctLetters = correctWord.split('').filter((letter, index) => maskedWord[index] === '_').join('');
    
    if (guess === correctLetters) {
        document.getElementById('gameMessage').textContent = 'Correct! +10 points';
        userData.score += 10;
        userData.gameScores.missingLetters += 10;
    } else {
        document.getElementById('gameMessage').textContent = `Incorrect! The correct word was "${correctWord}". -5 points`;
        userData.score -= 5;
        userData.gameScores.missingLetters -= 5;
    }

    updateScore();
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
