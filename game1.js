let currentWord = {};
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


function playWord() {
  // Use Text-to-Speech (TTS) to pronounce the current word
  const utterance = new SpeechSynthesisUtterance(currentWord.word);
  window.speechSynthesis.speak(utterance);
}

function loadNewWord() {
  // Fetch a random word from Words.json
  fetch('Words.json')
    .then(response => response.json())
    .then(data => {
      const randomIndex = Math.floor(Math.random() * data.words.length);
      currentWord = data.words[randomIndex];

      // Display the word definition as a hint
      document.getElementById('wordDefinition').textContent = `Definition: ${currentWord.definition}`;

      // Reset game message and guess input
      document.getElementById('gameMessage').textContent = '';
      document.getElementById('guess').value = '';
    })
    .catch(error => console.error('Error loading words:', error));
}

function submitGuess() {
  const userGuess = document.getElementById('guess').value.trim().toLowerCase();
  const messageElement = document.getElementById('gameMessage');

  if (userGuess === currentWord.word.toLowerCase()) {
    // Correct guess, add 10 points
    updateGameScore('spelling', 10);
    messageElement.textContent = 'Correct! You earned 10 points.';
  } else {
    // Incorrect guess, subtract 10 points
    updateGameScore('spelling', -10);
    messageElement.textContent = `Incorrect! The correct word was "${currentWord.word}". You lost 10 points.`;
  }
  updateScore();
  loadNewWord();
}

function updateScore() {
  // Save the updated score to localStorage
  localStorage.setItem('user', JSON.stringify(userData));

  // Update the displayed score
  document.getElementById('playerScore').textContent = `Score: ${userData.score}`;
}

function updatePlayerName() {
  // Update the player name and save it in localStorage
  userData.name = document.getElementById('playerNameInput').value;
  localStorage.setItem('user', JSON.stringify(userData));
}
