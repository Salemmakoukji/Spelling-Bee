document.addEventListener('DOMContentLoaded', () => {
    const playerNameElement = document.getElementById('player-name');
    const playerScoreElement = document.getElementById('player-score');
    const signinBtn = document.getElementById('signin-btn');
    const popup = document.getElementById('popup');
    const closeBtn = document.querySelector('.close-btn');
    const popupSubmitBtn = document.getElementById('popup-submit-btn');
    const playerNameInput = document.getElementById('player-name-input');
    const apiKey = 'BAZdSkMJLz3WU5fIhrrOtGExA1q8CgzU'; // Replace with your actual API key
    const apiUrl = 'https://api.baserow.io/api/database/'; // Adjust URL to your Baserow instance
    const tableId = '373691'; // Replace with your actual table ID

    fetch('Menu.html')
        .then(response => response.text())
        .then(data => {document.getElementById('navbar').innerHTML = data;})

    // Function to get a cookie value by name
    function getCookie(name) {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop().split(';').shift();
    }

    // Function to set a cookie
    function setCookie(name, value, days) {
        const d = new Date();
        d.setTime(d.getTime() + (days * 24 * 60 * 60 * 1000));
        const expires = "expires=" + d.toUTCString();
        document.cookie = name + "=" + value + ";" + expires + ";path=/";
    }

    // Initialize player name and score from cookies
    let playerName = getCookie('playerName') || "Guest";
    let playerScore = getCookie('playerScore') || 0;

    // Function to update player info
    function updatePlayerInfo(name, score) {
        playerName = name;
        playerScore = score;
        playerNameElement.textContent = `Player: ${playerName}`;
        playerScoreElement.textContent = `Score: ${playerScore}`;
        setCookie('playerName', name, 7);
        setCookie('playerScore', score, 7);
        playerNameElement.style.display = 'inline';
        playerScoreElement.style.display = 'inline';
        signinBtn.style.display = 'none';
    }

    // Fetch player info from Baserow
    async function fetchPlayerInfo(playerName) {
        try {
            const response = await fetch(`${apiUrl}tables/${tableId}/rows/`, {
                headers: {
                    'Authorization': `Token ${apiKey}`,
                    'Content-Type': 'application/json'
                }
            });
            if (response.ok) {
                const data = await response.json();
                // Find the player data by name
                const playerData = data.results.find(row => row.name === playerName);
                if (playerData) {
                    updatePlayerInfo(playerData.name, playerData.score);
                } else {
                    console.error('Player not found in database');
                }
            } else {
                console.error('Error fetching player info:', response.status);
            }
        } catch (error) {
            console.error('Error fetching player info:', error);
        }
    }

    // Show popup for sign-in
    signinBtn.addEventListener('click', () => {
        popup.style.display = 'block';
    });

    closeBtn.addEventListener('click', () => {
        popup.style.display = 'none';
    });

    window.addEventListener('click', (event) => {
        if (event.target == popup) {
            popup.style.display = 'none';
        }
    });

    // Handle sign-in
    popupSubmitBtn.addEventListener('click', () => {
        const playerNameInputValue = playerNameInput.value.trim();
        if (playerNameInputValue) {
            fetchPlayerInfo(playerNameInputValue);
            popup.style.display = 'none';
        } else {
            alert('Please enter your player name');
        }
    });

    // Initialize player info on page load
    updatePlayerInfo(playerName, playerScore);

    function navigateToGame(gameId) {
        window.location.href = `/${gameId}/SpellingApp/index.html`;
    }
});
