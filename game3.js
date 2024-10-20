let selectedWord = '';
let hiddenWordArray = [];
let incorrectGuesses = [];
let maxMistakes = 6;
let userData = JSON.parse(localStorage.getItem('user'));

// Load player name and score on page load
document.addEventListener('DOMContentLoaded', function () {
  document.getElementById('playerNameInput').value = userData.name;
  document.getElementById('playerScore').textContent = `Score: ${userData.score}`;
  document.getElementById('hangmanImageSrc').src = 'images/hangman0.png';  // Reset image on load
  document.getElementById('playerNameInput').addEventListener('input', updatePlayerName);

  loadNewWord();
});

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
    document.getElementById('gameMessage').textContent = 'You won! +20 points';
    userData.score += 20;
    updateScore();
  } else if (incorrectGuesses.length >= 6) {
    document.getElementById('gameMessage').textContent = `You lost! The word was "${selectedWord}". -10 points`;
    userData.score -= 10;
    updateScore();
  }
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
