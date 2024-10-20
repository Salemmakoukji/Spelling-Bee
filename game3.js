let selectedWord = '';
let hiddenWordArray = [];
let incorrectGuesses = [];
let maxMistakes = 6;
let userData = JSON.parse(localStorage.getItem('user'));

// Load player name and score on page load
document.addEventListener('DOMContentLoaded', function () {
  // Set the player name and score from localStorage
  document.getElementById('playerNameInput').value = userData.name;
  document.getElementById('playerScore').textContent = `Score: ${userData.score}`;

  // Listen for changes to the player name input
  document.getElementById('playerNameInput').addEventListener('input', updatePlayerName);

  // Load the first word and initialize the game
  loadNewWord();
});

function loadNewWord() {
  // Fetch a random word from Words.json
  fetch('HangmanWords.json')
    .then(response => response.json())
    .then(data => {
      const randomIndex = Math.floor(Math.random() * data.words.length);
      selectedWord = data.words[randomIndex].word.toLowerCase();

      // Initialize the hidden word with underscores
      hiddenWordArray = Array(selectedWord.length).fill('_');
      document.getElementById('hiddenWord').textContent = hiddenWordArray.join(' ');
      document.getElementById('incorrectGuesses').textContent = 'Incorrect guesses: ';
      document.getElementById('gameMessage').textContent = '';
      document.getElementById('letterGuess').value = '';
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
    // Correct guess, reveal the letter(s)
    for (let i = 0; i < selectedWord.length; i++) {
      if (selectedWord[i] === guessedLetter) {
        hiddenWordArray[i] = guessedLetter;
      }
    }
    document.getElementById('hiddenWord').textContent = hiddenWordArray.join(' ');
  } else {
    // Incorrect guess, add to the incorrect guesses array
    if (!incorrectGuesses.includes(guessedLetter)) {
      incorrectGuesses.push(guessedLetter);
      document.getElementById('incorrectGuesses').textContent = `Incorrect guesses: ${incorrectGuesses.join(', ')}`;
    }
  }

  // Check for win/loss condition
  checkGameStatus();
  document.getElementById('letterGuess').value = '';
}

function checkGameStatus() {
  if (hiddenWordArray.join('') === selectedWord) {
    // Player wins
    document.getElementById('gameMessage').textContent = 'You won! +20 points';
    userData.score += 20;
    updateScore();
  } else if (incorrectGuesses.length >= maxMistakes) {
    // Player loses
    document.getElementById('gameMessage').textContent = `You lost! The word was "${selectedWord}". -10 points`;
    userData.score -= 10;
    updateScore();
  }
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

function resetGame() {
  incorrectGuesses = [];
  loadNewWord();
}
