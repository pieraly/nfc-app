document.addEventListener('DOMContentLoaded', async (event) => {
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
            <p>Email: ${user.email}</p>
            <p>Role: ${user.role}</p>
            <p>Active: ${user.isActive}</p>
            <p>Created At: ${new Date(user.created_at).toLocaleString()}</p>
            <p>Expiration Date: ${new Date(user.expiration_date).toLocaleString()}</p>
            <p>Last Login: ${new Date(user.last_login).toLocaleString()}</p>
            <p>IP Address: ${user.ip_address}</p>
          `;
          userList.appendChild(userCard);
        });
      } catch (error) {
        console.error('Error loading users:', error.message);
        const notification = document.createElement('div');
        notification.className = 'bg-red-500 text-white p-4 mb-4 rounded-lg';
        notification.innerText = 'Error loading users';
        document.body.insertBefore(notification, document.body.firstChild);
        setTimeout(() => {
          notification.remove();
        }, 3000);
      }
    }
  
    loadUsers();
  });
  