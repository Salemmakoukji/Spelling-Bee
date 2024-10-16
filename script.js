document.addEventListener('DOMContentLoaded', () => {
    fetch('Menu.html')
        .then(response => response.text())
        .then(data => {
            document.getElementById('navbar').innerHTML = data;
            initializePlayerInfo();
        });

    function initializePlayerInfo() {
        const playerNameElement = document.getElementById('player-name');
        const playerScoreElement = document.getElementById('player-score');

        // Function to get a cookie value by name
        function getCookie(name) {
            const value = `; ${document.cookie}`;
            const parts = value.split(`; ${name}=`);
            if (parts.length === 2) return parts.pop().split(';').shift();
        }

        // Initialize player name and score from cookies
        let playerName = getCookie('playerName') || "Guest";
        let playerScore = getCookie('playerScore') || 0;

        // Update player info
        playerNameElement.textContent = `Player: ${playerName}`;
        playerScoreElement.textContent = `Score: ${playerScore}`;
    }

    function navigateToGame(gameId) {
        window.location.href = `${gameId}/index.html`;
    }
});
//tbc