let currentWord = {};
let currentScore = 0;
let playerName = '';

document.addEventListener('DOMContentLoaded', function () {
  // Fetch user score and name from userScores.json and display
  fetch('userScores.json')
    .then(response => response.json())
    .then(data => {
      playerName = data.user.name;
      currentScore = data.user.score;

      // Set initial player name and score
      document.getElementById('playerNameInput').value = playerName;
      document.getElementById('playerScore').textContent = `Score: ${currentScore}`;

      // Add listener to update the player name in the JSON file when it changes
      document.getElementById('playerNameInput').addEventListener('input', updatePlayerName);
    })
    .catch(error => console.error('Error loading user data:', error));
});

function playWord() {
  // Fetch a random word from the Words.json file
  fetch('Words.json')
    .then(response => response.json())
    .then(data => {
      const randomIndex = Math.floor(Math.random() * data.words.length);
      currentWord = data.words[randomIndex];

      // Use Text-to-Speech (TTS) to pronounce the word
      const utterance = new SpeechSynthesisUtterance(currentWord.word);
      window.speechSynthesis.speak(utterance);

      // Display the word definition as a hint
      document.getElementById('wordDefinition').textContent = `Definition: ${currentWord.definition}`;
    })
    .catch(error => console.error('Error loading words:', error));
}

function submitGuess() {
  const userGuess = document.getElementById('guess').value.trim().toLowerCase();
  const messageElement = document.getElementById('gameMessage');

  if (userGuess === currentWord.word.toLowerCase()) {
    // Correct guess, add 10 points
    currentScore += 10;
    messageElement.textContent = 'Correct! You earned 10 points.';
  } else {
    // Incorrect guess, deduct 5 points
    currentScore -= 5;
    messageElement.textContent = `Incorrect! The correct word was "${currentWord.word}". You lost 5 points.`;
  }

  // Update the score in userScores.json
  updateScore();

  // Clear the input field for the next word
  document.getElementById('guess').value = '';
}

function updateScore() {
  // Update the user's score in userScores.json
  fetch('userScores.json', {
    method: 'POST', // Should be PUT or PATCH for a real backend
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      user: {
        name: playerName,
        score: currentScore
      }
    })
  })
    .then(() => {
      // Update the displayed score
      document.getElementById('playerScore').textContent = `Score: ${currentScore}`;
    })
    .catch(error => console.error('Error updating score:', error));
}

function updatePlayerName() {
  playerName = document.getElementById('playerNameInput').value;

  // Update the player's name in userScores.json
  fetch('userScores.json', {
    method: 'POST', // Should be PUT or PATCH for a real backend
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      user: {
        name: playerName,
        score: currentScore
      }
    })
  })
    .then(() => {
      console.log('Player name updated successfully');
    })
    .catch(error => console.error('Error updating player name:', error));
}
