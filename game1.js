let currentWord = {};
let currentScore = 0;

document.addEventListener('DOMContentLoaded', function() {
  // Fetch user score from userScores.json and display
  fetch('userScores.json')
    .then(response => response.json())
    .then(data => {
      document.getElementById('playerName').textContent = `Player: ${data.user.name}`;
      document.getElementById('playerScore').textContent = `Score: ${data.user.score}`;
      currentScore = data.user.score;  // Store the score for updating later
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
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      user: {
        name: document.getElementById('playerName').textContent.split(': ')[1],
        score: currentScore
      }
    })
  })
  .then(() => {
    document.getElementById('playerScore').textContent = `Score: ${currentScore}`;
  })
  .catch(error => console.error('Error updating score:', error));
}
