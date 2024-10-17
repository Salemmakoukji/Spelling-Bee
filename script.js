document.addEventListener('DOMContentLoaded', function() {
  // Simulate fetching user data from a JSON file
  fetch('userScores.json')
    .then(response => response.json())
    .then(data => {
      checkUserStatus(data);
    })
    .catch(error => {
      console.error('Error loading user data:', error);
    });
});

function checkUserStatus(data) {
  const signInBtn = document.getElementById('signInBtn');
  const playerDetails = document.getElementById('playerDetails');
  const playerName = document.getElementById('playerName');
  const playerScore = document.getElementById('playerScore');

  const loggedInUser = data.user;  // Assuming 'user' contains the logged-in user's info

  if (loggedInUser && loggedInUser.name && loggedInUser.score && loggedInUser.password) {
    // If user is found in the data, hide sign-in button and display player info
    signInBtn.style.display = 'none';
    playerDetails.style.display = 'flex';
    playerName.textContent = `Player: ${loggedInUser.name}`;
    playerScore.textContent = `Score: ${loggedInUser.score}`;
  } else {
    // If no user is logged in, display the sign-in button
    signInBtn.style.display = 'block';
    playerDetails.style.display = 'none';
  }
}

function openModal() {
  document.getElementById('signInModal').style.display = 'flex';
}

function closeModal() {
  document.getElementById('signInModal').style.display = 'none';
}

function signIn() {
  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;
  const message = document.getElementById('signInMessage');

  // Simulate sign-in (simple hardcoded logic for demo purposes)
  if (username === data.name && password === data.password) {
    message.style.color = 'green';
    message.textContent = 'Sign in successful!';
    closeModal();
    // Optionally, you could update the userScores.json dynamically, if possible
    alert('Welcome, ' + username + '!');
    // Call the function to display the player info after sign-in
    fetch('userScores.json') // Refresh the data
      .then(response => response.json())
      .then(data => {
        checkUserStatus(data);
      });
  } else {
    message.style.color = 'red';
    message.textContent = 'Invalid username or password!';
  }
}
