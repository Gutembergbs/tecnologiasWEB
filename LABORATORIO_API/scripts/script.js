// Evento que é acionado quando o DOM é carregado
window.addEventListener('DOMContentLoaded', getUsers);

// Função para buscar os usuários da API
function getUsers() {
  fetch('https://reqres.in/api/users')
    .then(response => response.json())
    .then(data => {
      const userData = document.getElementById('userData');
      let lastId = 0;

      // Encontrar o último ID na tabela
      const rows = userData.getElementsByTagName('tr');
      if (rows.length > 0) {
        const lastRow = rows[rows.length - 1];
        const lastIdCell = lastRow.getElementsByTagName('td')[0];
        lastId = parseInt(lastIdCell.textContent);
      }

      // Iterar sobre os usuários retornados pela API
      data.data.forEach(user => {
        lastId++;
        const row = document.createElement('tr');
        row.innerHTML = `
          <td>${lastId}</td>
          <td>${user.first_name}</td>
          <td>${user.last_name}</td>
          <td>${user.email}</td>
          <td><img src="${user.avatar}" alt="Avatar" width="50" height="50"></td>
        `;
        userData.appendChild(row);
      });
    })
    .catch(error => {
      console.error('Erro:', error);
    });
}

// Adicionar Usuário - Evento de envio do formulário
const addUserForm = document.getElementById('addUserForm');
addUserForm.addEventListener('submit', addUser);

function addUser(event) {
  event.preventDefault();

  // Obter os valores dos campos do formulário
  const firstName = document.getElementById('firstName').value;
  const lastName = document.getElementById('lastName').value;
  const email = document.getElementById('email').value;

  // Criar um novo objeto de usuário
  const newUser = {
    first_name: firstName,
    last_name: lastName,
    email: email
  };

  // Enviar uma solicitação POST para adicionar o usuário
  fetch('https://reqres.in/api/users', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(newUser)
  })
    .then(response => response.json())
    .then(data => {
      const userData = document.getElementById('userData');
      const lastRow = userData.getElementsByTagName('tr')[userData.rows.length - 1];
      const lastIdCell = lastRow.getElementsByTagName('td')[0];
      const lastId = parseInt(lastIdCell.textContent);

      // Criar uma nova linha na tabela com os dados do usuário adicionado
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${lastId + 1}</td>
        <td>${data.first_name}</td>
        <td>${data.last_name}</td>
        <td>${data.email}</td>
        <td><img src="${data.avatar}" alt="Avatar" width="50" height="50"></td>
      `;
      userData.appendChild(row);

      // Limpar o formulário após adicionar o usuário
      addUserForm.reset();
    })
    .catch(error => {
      console.error('Erro:', error);
    });
}

// Atualizar Usuário - Evento de envio do formulário
const updateUserForm = document.getElementById('updateUserForm');
updateUserForm.addEventListener('submit', updateUser);

function updateUser(event) {
  event.preventDefault();

  // Obter os valores dos campos do formulário
  const userId = document.getElementById('userId').value;
  const newFirstName = document.getElementById('newFirstName').value;
  const newLastName = document.getElementById('newLastName').value;
  const newEmail = document.getElementById('newEmail').value;

  // Criar um objeto com os dados atualizados do usuário
  const updatedUser = {
    first_name: newFirstName,
    last_name: newLastName,
    email: newEmail
  };

  // Enviar uma solicitação PUT para atualizar o usuário
  fetch(`https://reqres.in/api/users/${userId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(updatedUser)
  })
    .then(response => response.json())
    .then(data => {
      const userData = document.getElementById('userData');

      // Encontrar a linha correspondente ao ID do usuário atualizado
      const rows = userData.getElementsByTagName('tr');
      for (let i = 0; i < rows.length; i++) {
        const idCell = rows[i].getElementsByTagName('td')[0];
        if (idCell.textContent === userId) {
          const oldIconCell = rows[i].getElementsByTagName('td')[4];
          const oldIcon = oldIconCell.innerHTML;

          // Atualizar os dados na linha da tabela
          rows[i].innerHTML = `
            <td>${userId}</td>
            <td>${data.first_name}</td>
            <td>${data.last_name}</td>
            <td>${data.email}</td>
            <td>${oldIcon}</td>
          `;
          break;
        }
      }

      // Limpar o formulário após atualizar o usuário
      updateUserForm.reset();
    })
    .catch(error => {
      console.error('Erro:', error);
    });
}

// Deletar Usuário - Evento de envio do formulário
const deleteUserForm = document.getElementById('deleteUserForm');
deleteUserForm.addEventListener('submit', deleteUser);

function deleteUser(event) {
  event.preventDefault();

  // Obter o ID do usuário a ser deletado
  const deleteUserId = document.getElementById('deleteUserId').value;

  // Enviar uma solicitação DELETE para deletar o usuário
  fetch(`https://reqres.in/api/users/${deleteUserId}`, {
    method: 'DELETE'
  })
    .then(response => {
      if (response.status === 204) {
        const userData = document.getElementById('userData');

        // Encontrar a linha correspondente ao ID do usuário a ser deletado
        const rows = userData.getElementsByTagName('tr');
        for (let i = 0; i < rows.length; i++) {
          const idCell = rows[i].getElementsByTagName('td')[0];
          if (idCell.textContent === deleteUserId) {
            // Remover a linha da tabela
            userData.removeChild(rows[i]);
            break;
          }
        }

        // Limpar o formulário após deletar o usuário
        deleteUserForm.reset();
      } else {
        console.error('Erro ao deletar usuário:', response.status);
      }
    })
    .catch(error => {
      console.error('Erro:', error);
    });
}

