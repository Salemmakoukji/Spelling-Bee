document.getElementById('startGameBtn').addEventListener('click', startGame);

let playerName = '';
let score = 0;
let wordIndex = 0;
let currentWordData = {};
let wordPlayed = false;
let definitionPlayed = false;
let sentencePlayed = false;

// Simulated list of words from your WordsData.json
const wordsList = [
    { word: 'example', definition: 'A thing characteristic of its kind.', sentence: 'This is an example.', level: 1 },
    { word: 'bee', definition: 'An insect known for producing honey.', sentence: 'The bee flew to the flower.', level: 1 },
    { word: 'spelling', definition: 'The process of writing words correctly.', sentence: 'She won the spelling bee.', level: 2 },
    // Add more words here...
];

function startGame() {
    playerName = document.getElementById('playerNameInput').value.trim();
    if (playerName === '') {
        alert('Please enter your name.');
        return;
    }

    document.querySelector('.player-name-block').style.display = 'none';
    document.getElementById('gameBox').classList.remove('hidden');
    loadWord();
}

function loadWord() {
    currentWordData = wordsList[wordIndex];
    document.getElementById('wordDisplay').innerText = `Word: (level ${currentWordData.level})`;
    document.getElementById('answerInput').value = '';
    document.getElementById('resultMessage').innerText = '';

    wordPlayed = false;
    definitionPlayed = false;
    sentencePlayed = false;

    // Disable buttons until word is played
    document.getElementById('playDefinitionBtn').disabled = true;
    document.getElementById('playSentenceBtn').disabled = true;
}

document.getElementById('playWordBtn').addEventListener('click', function() {
    wordPlayed = true;
    document.getElementById('playDefinitionBtn').disabled = false;
    document.getElementById('playSentenceBtn').disabled = false;
    alert(`Playing word: ${currentWordData.word}`);
});

document.getElementById('replayWordBtn').addEventListener('click', function() {
    if (wordPlayed) {
        alert(`Replaying word: ${currentWordData.word}`);
    } else {
        alert('Please play the word first.');
    }
});

document.getElementById('playDefinitionBtn').addEventListener('click', function() {
    if (!definitionPlayed) {
        alert(`Definition: ${currentWordData.definition}`);
        definitionPlayed = true;
        this.disabled = true;
    }
});

document.getElementById('playSentenceBtn').addEventListener('click', function() {
    if (!sentencePlayed) {
        alert(`Sentence: ${currentWordData.sentence}`);
        sentencePlayed = true;
        this.disabled = true;
    }
});

document.getElementById('submitBtn').addEventListener('click', function() {
    const userAnswer = document.getElementById('answerInput').value.trim().toLowerCase();
    const correctAnswer = currentWordData.word.toLowerCase();

    if (userAnswer === correctAnswer) {
        document.getElementById('resultMessage').innerText = 'Correct!';
        score++;
    } else {
        document.getElementById('resultMessage').innerText = `Wrong! The correct word was ${correctAnswer}.`;
    }

    document.getElementById('nextWordBtn').classList.remove('hidden');
    updateScore();
});

document.getElementById('nextWordBtn').addEventListener('click', function() {
    wordIndex++;
    if (wordIndex >= wordsList.length) {
        wordIndex = 0;  // Reset for now
    }

    loadWord();
    this.classList.add('hidden');
});

function updateScore() {
    document.getElementById('scorePanel').innerText = `Score: ${score}`;
}

document.getElementById('downloadScoreBtn').addEventListener('click', function() {
    const userScoreData = {
        player: playerName,
        score: score
    };

    const blob = new Blob([JSON.stringify(userScoreData, null, 2)], { type: 'application/json' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${playerName}_score.json`;
    link.click();
});
