document.addEventListener('DOMContentLoaded', (event) => {
  document.getElementById('create-user-button').addEventListener('click', createUser);
  document.getElementById('auth-user-button').addEventListener('click', authenticateUser);
  document.getElementById('update-status-button').addEventListener('click', updateUserStatus);
  document.getElementById('get-users-button').addEventListener('click', () => {
    window.location.href = 'users.html';
  });
  document.getElementById('get-user-button').addEventListener('click', getUserByNfcId);


  async function createUser() {
    const nfc_id = document.getElementById('create-nfc_id').value;
    const name = document.getElementById('create-name').value;
    const email = document.getElementById('create-email').value;
    const role = document.getElementById('create-role').value;
    const expiration_date = document.getElementById('create-expiration_date').value;
    const isActive = document.getElementById('create-isActive').checked;

    try {
      const response = await fetch('/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ nfc_id, name, email, role, expiration_date, isActive })
      });

      const result = await response.json();
      showNotification(result.message, 'bg-green-500');
    } catch (error) {
      console.error('Error creating user:', error);
      showNotification('Error creating user', 'bg-red-500');
    }
  }
  
  async function authenticateUser() {
    const nfc_id = document.getElementById('auth-nfc_id').value;

    try {
      const response = await fetch('/api/authenticate/nfc/' + nfc_id, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      const result = await response.json();
      if (result.token) {
        showNotification('User authenticated successfully', 'bg-green-500');
      } else {
        showNotification(result.error, 'bg-red-500');
      }
    } catch (error) {
      console.error('Error authenticating user:', error);
      showNotification('Error authenticating user', 'bg-red-500');
    }
  }

  async function updateUserStatus() {
    const nfc_id = document.getElementById('update-id').value;
    const isActive = document.getElementById('update-status').value === 'true';

    try {
      const response = await fetch('/api/user/status', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ nfc_id, isActive })
      });

      const result = await response.json();
      showNotification(result.message, 'bg-green-500');
    } catch (error) {
      console.error('Error updating user status:', error);
      showNotification('Error updating user status', 'bg-red-500');
    }
  }

  async function getUserByNfcId() {
    const nfc_id = document.getElementById('get-nfc_id').value;
  
    try {
      const response = await fetch('/api/authenticate/nfc/' + nfc_id, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });
  
      console.log(`Response status: ${response.status}`); // Log du statut de la réponse
  
      if (response.status === 200) {
        console.log('Redirection vers auth-success.html');
        window.location.href = 'auth-success.html';
      } else {
        console.log('Redirection vers auth-failed.html');
        window.location.href = 'auth-failed.html';
      }
    } catch (error) {
      console.error('Error getting user:', error.message);
      showNotification('Error getting user', 'bg-red-500');
      window.location.href = 'auth-failed.html'; // Rediriger vers la page d'échec en cas d'erreur
    }
  }
  
  



  function showNotification(message, className) {
    const notification = document.getElementById('notification');
    notification.className = `block ${className} p-4 mb-4 rounded-lg`;
    notification.innerText = message;
    setTimeout(() => {
      notification.className = 'hidden';
    }, 3000);
  }
});
