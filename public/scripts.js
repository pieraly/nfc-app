document.addEventListener('DOMContentLoaded', (event) => {
    document.getElementById('create-user-button').addEventListener('click', createUser);
    document.getElementById('auth-user-button').addEventListener('click', authenticateUser);
    document.getElementById('update-status-button').addEventListener('click', updateUserStatus);
    document.getElementById('get-users-button').addEventListener('click', loadUsers);
  
    async function createUser() {
      const nfc_id = document.getElementById('create-nfc_id').value;
      const name = document.getElementById('create-name').value;
      const password = document.getElementById('create-password').value;
      const isActive = document.getElementById('create-isActive').checked;
  
      try {
        const response = await fetch('/api/users', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ nfc_id, name, password, isActive })
        });
  
        const result = await response.json();
        showNotification(result.message, 'bg-green-500');
        loadUsers();
      } catch (error) {
        console.error('Error creating user:', error);
        showNotification('Error creating user', 'bg-red-500');
      }
    }
  
    async function authenticateUser() {
      const nfc_id = document.getElementById('auth-nfc_id').value;
  
      try {
        const response = await fetch('/api/authenticate', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ nfc_id })
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
        loadUsers();
      } catch (error) {
        console.error('Error updating user status:', error);
        showNotification('Error updating user status', 'bg-red-500');
      }
    }
  
    async function loadUsers() {
        try {
          const response = await fetch('/api/users');
          
          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }
      
          const users = await response.json();
          const userList = document.getElementById('user-list');
          userList.innerHTML = '';
          users.forEach(user => {
            const userCard = document.createElement('div');
            userCard.className = 'user bg-white p-4 rounded-lg shadow-lg';
            userCard.innerHTML = `
              <h3 class="text-xl font-bold">${user.name}</h3>
              <p>NFC ID: ${user.nfc_id}</p>
              <p>Active: ${user.isActive}</p>
            `;
            userList.appendChild(userCard);
          });
        } catch (error) {
          console.error('Error loading users:', error.message);
          showNotification('Error loading users', 'bg-red-500');
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
    loadUsers();
  });
  