// app.js

let words = []; // Will store words from the JSON
let currentWord = {};
let userName = "";
let score = 0; // Initialize score
let userScores = []; // To store user data

// Fetch words from external JSON file
fetch('WordsData.json')
    .then(response => response.json())
    .then(data => {
        words = data;
    })
    .catch(error => console.error("Error loading words:", error));

// DOM Elements
const definition = document.getElementById('definition');
const sentence = document.getElementById('sentence');
const playWordBtn = document.getElementById('playWord');
const replayWordBtn = document.getElementById('replayWord');
const playDefinitionBtn = document.getElementById('playDefinition');
const playSentenceBtn = document.getElementById('playSentence');
const userInput = document.getElementById('userInput');
const checkWordBtn = document.getElementById('checkWord');
const feedback = document.getElementById('feedback');
const nameForm = document.getElementById('nameForm');
const gameArea = document.getElementById('gameArea');
const welcomeMessage = document.getElementById('welcomeMessage');
const startGameBtn = document.getElementById('startGame');
const scoreElement = document.getElementById('score');
const nextWordBtn = document.getElementById('nextWord'); // Next word button

// Start game after user enters their name
startGameBtn.addEventListener('click', () => {
    const nameInput = document.getElementById('userName').value.trim();
    if (nameInput) {
        userName = nameInput;
        welcomeMessage.textContent = `Welcome, ${userName}! Let's start the Spelling Bee.`;
        nameForm.style.display = 'none';
        gameArea.style.display = 'block';
        selectWord(1); // Start with level 1 word
    }
});

// Function to select a word based on the level (random selection)
function selectWord(level) {
    const wordsAtLevel = words.filter(word => word.level === level);
    const randomIndex = Math.floor(Math.random() * wordsAtLevel.length);
    currentWord = wordsAtLevel[randomIndex];

    // Display definition and sentence
    definition.textContent = `Definition: ${currentWord.definition}`;
    sentence.textContent = `Sentence: ${currentWord.sentence}`;

    // Enable buttons for the next word, reset their state
    playDefinitionBtn.disabled = false;
    playSentenceBtn.disabled = false;

    // Clear previous user input and feedback
    userInput.value = "";
    feedback.textContent = "";

    // Hide the "Next Word" button until they submit their answer
    nextWordBtn.style.display = 'none';
    checkWordBtn.style.display = 'inline-block'; // Show "Submit" button
}

// Play the word using Text-to-Speech API
function playWord() {
    const utterance = new SpeechSynthesisUtterance(currentWord.word);
    speechSynthesis.speak(utterance);
}

// Replay the word using Text-to-Speech API
function replayWord() {
    playWord();
}

// Play the definition using Text-to-Speech API (and disable after playing)
function playDefinition() {
    const utterance = new SpeechSynthesisUtterance(currentWord.definition);
    speechSynthesis.speak(utterance);

    // Disable the button after playing once
    playDefinitionBtn.disabled = true;
}

// Play the sentence using Text-to-Speech API (and disable after playing)
function playSentence() {
    const utterance = new SpeechSynthesisUtterance(currentWord.sentence);
    speechSynthesis.speak(utterance);

    // Disable the button after playing once
    playSentenceBtn.disabled = true;
}

// Check if the user's input matches the word
function checkWord() {
    const userAnswer = userInput.value.trim().toLowerCase();
    if (userAnswer === currentWord.word.toLowerCase()) {
        feedback.textContent = "Correct!";
        feedback.style.color = 'green';
        updateScore(10); // Increase score by 10 for correct answer
        saveUserData()
    } else {
        feedback.textContent = `Wrong! The correct word is: ${currentWord.word}`;
        feedback.style.color = 'red';
        updateScore(-5); // Decrease score by 5 for incorrect answer
        saveUserData()
    }

    // Hide "Submit" button and show "Next Word" button
    checkWordBtn.style.display = 'none';
    nextWordBtn.style.display = 'inline-block'; // Show "Next Word" button

    // Disable buttons until next word
    playDefinitionBtn.disabled = true;
    playSentenceBtn.disabled = true;
}

// Update score and display it
function updateScore(points) {
    score += points;
    scoreElement.textContent = score;
}

// Store the user’s name and score in a JSON-like object
function saveUserData() {
    const userData = {
        username: userName,
        points: score
    };

    userScores.push(userData); // Store it in an array (simulating JSON storage)
    console.log("User data saved:", userScores);
}

// Proceed to the next word
nextWordBtn.addEventListener('click', () => {
    // Select the next word (you can add logic here to choose different levels or criteria)
    selectWord(1); // For now, it keeps selecting from level 1
});

// Event listeners
playWordBtn.addEventListener('click', playWord);
replayWordBtn.addEventListener('click', replayWord);
playDefinitionBtn.addEventListener('click', playDefinition);
playSentenceBtn.addEventListener('click', playSentence);
checkWordBtn.addEventListener('click', checkWord);

// Load userScores from localStorage when the page loads
window.onload = function() {
    const savedScores = localStorage.getItem('userScores');
    if (savedScores) {
        userScores = JSON.parse(savedScores);
    }
}

// Store user data in localStorage after updating the userScores array
function saveUserData() {
    const userData = {
        username: userName,
        points: score
    };

    userScores.push(userData); // Add the new user data to the array
    localStorage.setItem('userScores', JSON.stringify(userScores)); // Save to localStorage

    console.log("User data saved:", userScores);
}

// Function to download the userScores array as a JSON file
function exportUserScores() {
    const dataStr = JSON.stringify(userScores, null, 2); // Convert to JSON string
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);

    // Create a temporary download link
    const a = document.createElement('a');
    a.href = url;
    a.download = 'userScores.json'; // The name of the exported file
    document.body.appendChild(a);
    a.click();

    // Clean up
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

// Add event listener to the export button
document.getElementById('exportData').addEventListener('click', exportUserScores);
