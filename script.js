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
        document.getElementById('playerNameLabel').innerText = `Hello ${playerName}!`;
        document.getElementById('playerName').style.display = 'none';
        document.getElementById('startGame').style.display = 'none';
        document.querySelector('.game-box').style.display = 'flex';
        loadNextWord();
    }
}

function loadNextWord() {
    if (words.length) {
        currentWord = words.pop();
        document.querySelector('.word-box').innerText = '';
        document.getElementById('answer').value = '';
        enableButtons();
    }
}

function enableButtons() {
    document.getElementById('playWord').disabled = false;
    document.getElementById('replayWord').disabled = true;
    document.getElementById('playDefinition').disabled = true;
    document.getElementById('playSentence').disabled = true;
    document.getElementById('nextWord').disabled = true;
    document.getElementById('result').innerText = '';
}

document.getElementById('playWord').addEventListener('click', playWord);
document.getElementById('replayWord').addEventListener('click', replayWord);
document.getElementById('playDefinition').addEventListener('click', playDefinition);
document.getElementById('playSentence').addEventListener('click', playSentence);
document.getElementById('submitAnswer').addEventListener('click', submitAnswer);
document.getElementById('nextWord').addEventListener('click', loadNextWord);
document.getElementById('downloadScore').addEventListener('click', downloadScore);

function playWord() {
    speakText(currentWord.word);
    enableWordOptions();
}

function replayWord() {
    speakText(currentWord.word);
}

function playDefinition() {
    speakText(currentWord.definition);
}

function playSentence() {
    speakText(currentWord.sentence);
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
        document.getElementById('result').innerText = 'Correct!';
    } else {
        document.getElementById('result').innerText = `Incorrect! The correct spelling is ${currentWord.word}`;
    }
    document.getElementById('score').innerText = score;
    document.getElementById('nextWord').disabled = false;
    document.getElementById('answer').value = '';
}

function downloadScore() {
    const playerName = document.getElementById('playerNameLabel').innerText.split(': ')[1];
    const scoreData = { player: playerName, score: score };
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(scoreData));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", playerName + "_score.json");
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
}

function speakText(text) {
    const speech = new SpeechSynthesisUtterance(text);
    window.speechSynthesis.speak(speech);
}
