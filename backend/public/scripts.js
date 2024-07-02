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
            alert(result.message);
            loadUsers();
        } catch (error) {
            console.error('Error creating user:', error);
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
                alert('User authenticated successfully');
            } else {
                alert(result.error);
            }
        } catch (error) {
            console.error('Error authenticating user:', error);
        }
    }

    async function updateUserStatus() {
        const nfc_id = document.getElementById('update-id').value;
        const isActive = document.getElementById('update-status').value === 'true';

        try {
            const response = await fetch('/api/userstatus', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ nfc_id, isActive })
            });

            const result = await response.json();
            alert(result.message);
            loadUsers();
        } catch (error) {
            console.error('Error updating user status:', error);
        }
    }

    async function loadUsers() {
        try {
            const response = await fetch('/api/users');
            const users = await response.json();
            const userList = document.getElementById('user-list');
            userList.innerHTML = '';
            users.forEach(user => {
                const userDiv = document.createElement('div');
                userDiv.className = 'user';
                userDiv.innerText = `${user.name} (NFC ID: ${user.nfc_id}) - Active: ${user.isActive}`;
                userList.appendChild(userDiv);
            });
        } catch (error) {
            console.error('Error loading users:', error);
        }
    }

    loadUsers();
});
