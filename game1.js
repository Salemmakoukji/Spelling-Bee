let currentWord = {};
let userData = JSON.parse(localStorage.getItem('user'));

document.addEventListener('DOMContentLoaded', function () {
  // Set the player name and score from localStorage
  document.getElementById('playerNameInput').value = userData.name;
  document.getElementById('playerScore').textContent = `Score: ${userData.score}`;

  // Listen for changes to the player name input
  document.getElementById('playerNameInput').addEventListener('input', updatePlayerName);
});

function playWord() {
  // Fetch a random word from Words.json
  fetch('Words.json')
    .then(response => response.json())
    .then(data => {
      const randomIndex = Math.floor(Math.random() * data.words.length);
      currentWord = data.words[randomIndex];

      // Use Text-to-Speech (TTS) to speak the word
      const utterance = new SpeechSynthesisUtterance(currentWord.word);
      window.speechSynthesis.speak(utterance);

      // Display the definition as a hint
      document.getElementById('wordDefinition').textContent = `Definition: ${currentWord.definition}`;
    })
    .catch(error => console.error('Error loading words:', error));
}

function submitGuess() {
  const userGuess = document.getElementById('guess').value.trim().toLowerCase();
  const messageElement = document.getElementById('gameMessage');

  if (userGuess === currentWord.word.toLowerCase()) {
    // Correct guess, add 10 points
    userData.score += 10;
    messageElement.textContent = 'Correct! You earned 10 points.';
  } else {
    // Incorrect guess, subtract 5 points
    userData.score -= 5;
    messageElement.textContent = `Incorrect! The correct word was "${currentWord.word}". You lost 5 points.`;
  }

  // Update the score in localStorage
  updateScore();

  // Clear the input field for the next guess
  document.getElementById('guess').value = '';
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
