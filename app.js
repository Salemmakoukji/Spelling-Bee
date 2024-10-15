document.getElementById('startGameBtn').addEventListener('click', startGame);

let playerName = '';
let score = 0;

function startGame() {
    playerName = document.getElementById('playerNameInput').value.trim();
    if (playerName === '') {
        alert('Please enter your name.');
        return;
    }
    
    document.querySelector('.player-name-block').style.display = 'none';
    document.getElementById('gameBox').classList.remove('hidden');
}

document.getElementById('submitBtn').addEventListener('click', submitAnswer);

function submitAnswer() {
    // Assume answer verification and word playing logic exists here.
    // For now, just update score and result message for example.
    
    const userAnswer = document.getElementById('answerInput').value.trim().toLowerCase();
    const correctAnswer = 'example';  // Replace this with actual logic to get the correct word
    
    if (userAnswer === correctAnswer) {
        document.getElementById('resultMessage').innerText = 'Correct!';
        score += 1;
    } else {
        document.getElementById('resultMessage').innerText = `Wrong! The correct word was ${correctAnswer}.`;
    }
    
    document.getElementById('nextWordBtn').classList.remove('hidden');
    updateScore();
}

function updateScore() {
    document.getElementById('scorePanel').innerText = `Score: ${score}`;
}

document.getElementById('nextWordBtn').addEventListener('click', function() {
    document.getElementById('answerInput').value = '';
    document.getElementById('resultMessage').innerText = '';
    this.classList.add('hidden');
});

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
