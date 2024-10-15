document.getElementById('startGame').addEventListener('click', startGame);

let words = [];
let currentWord = {};
let score = 0;

fetch('words.json')
    .then(response => response.json())
    .then(data => {
        words = data;
    });

function startGame() {
    const playerName = document.getElementById('playerName').value;
    if (playerName) {
        document.querySelector('.game-box').style.display = 'flex';
        loadNextWord();
    }
}

function loadNextWord() {
    if (words.length) {
        currentWord = words.pop();
        document.querySelector('.word-box').innerText = '';
        enableButtons();
    }
}

function enableButtons() {
    document.getElementById('playWord').disabled = false;
    document.getElementById('replayWord').disabled = true;
    document.getElementById('playDefinition').disabled = true;
    document.getElementById('playSentence').disabled = true;
    document.getElementById('nextWord').disabled = true;
}

document.getElementById('playWord').addEventListener('click', playWord);
document.getElementById('replayWord').addEventListener('click', replayWord);
document.getElementById('playDefinition').addEventListener('click', playDefinition);
document.getElementById('playSentence').addEventListener('click', playSentence);
document.getElementById('submitAnswer').addEventListener('click', submitAnswer);
document.getElementById('nextWord').addEventListener('click', loadNextWord);
document.getElementById('downloadScore').addEventListener('click', downloadScore);

function playWord() {
    // play the word audio
    enableWordOptions();
}

function replayWord() {
    // replay the word audio
}

function playDefinition() {
    // play the word definition
}

function playSentence() {
    // play the word in a sentence
}

function enableWordOptions() {
    document.getElementById('replayWord').disabled = false;
    document.getElementById('playDefinition').disabled = false;
    document.getElementById('playSentence').disabled = false;
}

function submitAnswer() {
    const answer = document.getElementById('answer').value.trim();
    if (answer.toLowerCase() === currentWord.word.toLowerCase()) {
        score++;
        alert('Correct!');
    } else {
        alert(`Incorrect! The correct spelling is ${currentWord.word}`);
    }
    document.getElementById('score').innerText = score;
    document.getElementById('nextWord').disabled = false;
}

function downloadScore() {
    const playerName = document.getElementById('playerName').value;
    const scoreData = { player: playerName, score: score };
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(scoreData));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", playerName + "_score.json");
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
}
