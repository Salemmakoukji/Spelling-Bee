let selectedWord = '';
let hiddenWordArray = [];
let incorrectGuesses = [];
let maxMistakes = 6;
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

// Example of how a game might call the update function
// Call updateGameScore('spelling', 10) for the spelling game, for example.


function loadNewWord() {
  fetch('HangmanWords.json')
    .then(response => response.json())
    .then(data => {
      const randomIndex = Math.floor(Math.random() * data.words.length);
      selectedWord = data.words[randomIndex].word.toLowerCase();
      hiddenWordArray = Array(selectedWord.length).fill('▢');
      document.getElementById('hiddenWord').textContent = hiddenWordArray.join(' ');
      document.getElementById('incorrectGuesses').textContent = 'Incorrect guesses: ';
      document.getElementById('gameMessage').textContent = '';
      incorrectGuesses = [];
      updateHangmanImage();  // Reset hangman image
    })
    .catch(error => console.error('Error loading words:', error));
}

function submitGuess() {
  const guessedLetter = document.getElementById('letterGuess').value.toLowerCase();
  if (guessedLetter === '' || guessedLetter.length !== 1) {
    document.getElementById('gameMessage').textContent = 'Please enter a valid letter.';
    return;
  }

  if (selectedWord.includes(guessedLetter)) {
    for (let i = 0; i < selectedWord.length; i++) {
      if (selectedWord[i] === guessedLetter) {
        hiddenWordArray[i] = guessedLetter;
      }
    }
    document.getElementById('hiddenWord').textContent = hiddenWordArray.join(' ');
  } else {
    if (!incorrectGuesses.includes(guessedLetter)) {
      incorrectGuesses.push(guessedLetter);
      document.getElementById('incorrectGuesses').textContent = `Incorrect guesses: ${incorrectGuesses.join(', ')}`;
      updateHangmanImage();  // Update hangman image after incorrect guess
    }
  }

  checkGameStatus();
  document.getElementById('letterGuess').value = '';
}

function updateHangmanImage() {
  const mistakes = incorrectGuesses.length;
  document.getElementById('hangmanImageSrc').src = `images/hangman${mistakes}.png`;
}

function checkGameStatus() {
  if (hiddenWordArray.join('') === selectedWord) {
    document.getElementById('gameMessage').textContent = 'You won! +10 points';
    updateGameScore('hangman', 10);
  } else if (incorrectGuesses.length >= 6) {
    document.getElementById('gameMessage').textContent = `You lost! The word was "${selectedWord}". -10 points`;
    updateGameScore('hangman', -10);
  }
  updateScore();
  resetGame();
}

function updateScore() {
  localStorage.setItem('user', JSON.stringify(userData));
  document.getElementById('playerScore').textContent = `Score: ${userData.score}`;
}

function updatePlayerName() {
  userData.name = document.getElementById('playerNameInput').value;
  localStorage.setItem('user', JSON.stringify(userData));
}

function resetGame() {
  incorrectGuesses = [];
  loadNewWord();
}
