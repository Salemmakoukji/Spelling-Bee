document.addEventListener('DOMContentLoaded', function() {

});

function checkUserStatus(data) {
  const signInBtn = document.getElementById('signInBtn');
  const playerDetails = document.getElementById('playerDetails');
  const playerName = document.getElementById('playerName');
  const playerScore = document.getElementById('playerScore');

  const loggedInUser = data.user;  // Assuming 'user' contains the logged-in user's info

  if (loggedInUser && loggedInUser.name && loggedInUser.score) {
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

  // Fetch user data from JSON
  fetch('userScores.json')
    .then(response => response.json())
    .then(data => {
      const user = data.user;

      // Validate the entered username and password
      if (username === user.name && password === user.password) {
        message.style.color = 'green';
        message.textContent = 'Sign in successful!';
        closeModal();

        // Display the player info dynamically
        const signInBtn = document.getElementById('signInBtn');
        const playerDetails = document.getElementById('playerDetails');
        const playerName = document.getElementById('playerName');
        const playerScore = document.getElementById('playerScore');

        signInBtn.style.display = 'none';
        playerDetails.style.display = 'flex';
        playerName.textContent = `Player: ${user.name}`;
        playerScore.textContent = `Score: ${user.score}`;
        checkUserStatus(data);

      } else {
        message.style.color = 'red';
        message.textContent = 'Invalid username or password!';
      }
    })
    .catch(error => {
      console.error('Error during sign in:', error);
    });
}
