//Sweet alert for Get User by ID
document
  .getElementById("userById-form")
  .addEventListener("submit", getUserById);

function getUserById(event) {
  event.preventDefault();

  const userIdInput = document.getElementById("userIdInput");
  const uid = userIdInput.value.trim();

  fetch(`/api/users/${uid}`, {
    method: "GET",
  })
    .then((response) => {
      if (response.status === 400) {
        throw new Error(response.statusText);
      }
      if (response.status === 404) {
        throw new Error(response.statusText);
      }
      if (!response.ok) {
        throw new Error("Failed to retrieve user information");
      }
      return response.json();
    })
    .then((data) => {
      const user = data.payload;
      Swal.fire({
        title: `User ID ${user._id}`,
        html: `
            <p>First Name: ${user.first_name}</p>
            <p>Last Name: ${user.last_name}</p>
            <p>Email: ${user.email}</p>
            <p>Age: ${user.age}</p>
            <p>Password: ${user.password}</p>
            <div><img class="imgLogo" src="../../static/assets/profiles/${user.profile_image}" alt="profile image"></div>
            <p>GitHub Username: ${user.github_username}</p>
            <p>Role: ${user.role}</p>
            <p>Cart: ${user.cart}</p>
            <p>Documents: ${user.documents}</p>
            <p>Last Connection: ${user.last_connection}</p>
            <p>Update Status: ${user.update_status}</p>
          `,
        icon: "success",
        showCancelButton: false,
        cancelButtonColor: false,
        confirmButtonText: false,
        showConfirmButton: false,
        showCloseButton: true,
      });
    })
    .catch((error) => {
      console.error(error);
      Swal.fire({
        title: "Error",
        text: error.message,
        icon: "error",
      });
    });
}

//Sweet alert for Change User Role

document
  .getElementById("changeRole-form")
  .addEventListener("submit", changeUserRole);

function changeUserRole(event) {
  event.preventDefault();

  const userIdRoleInput = document.getElementById("userIdRole");
  const selectedRole = document.getElementById("selectedRole");

  const uid = userIdRoleInput.value.trim();
  const role = selectedRole.value;

  Swal.fire({
    title: "Change User Role by ID",
    text: `Do you want to change the role of the User with ID ${uid}?`,
    icon: "info",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Yes, proceed!",
  }).then((result) => {
    if (result.isConfirmed) {
      const payload = { payload: { role } };

      fetch(`/api/users/${uid}`, {
        method: "PUT",
        body: JSON.stringify(payload),
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((response) => {
          if (response.status === 400) {
            throw new Error(response.statusText);
          }
          if (response.status === 404) {
            throw new Error(response.statusText);
          }
          if (!response.ok) {
            throw new Error("Failed to update User information");
          }
          return response.json();
        })
        .then(() => {
          Swal.fire({
            title: `User with ID ${uid} has been updated`,
            icon: "success",
            showCancelButton: false,
            cancelButtonColor: false,
            confirmButtonText: false,
            showConfirmButton: false,
            showCloseButton: true,
          });
        })
        .catch((error) => {
          console.error(error);
          Swal.fire({
            title: "Error",
            text: error.message,
            icon: "error",
          });
        });
    }
  });
}

//Sweet alert for Delete User

document
  .getElementById("deleteUser-form")
  .addEventListener("submit", deleteUser);

function deleteUser(event) {
  event.preventDefault();

  const userIdDeleteInput = document.getElementById("userIdDeleteInput");
  const uid = userIdDeleteInput.value.trim();

  Swal.fire({
    title: "Delete User by ID",
    text: `Do you want to delete the User with ID ${uid}?`,
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Yes, proceed!",
  }).then((result) => {
    if (result.isConfirmed) {
      fetch(`/api/users/${uid}`, {
        method: "DELETE",
      })
        .then((response) => {
          if (response.status === 400) {
            throw new Error(response.statusText);
          }
          if (response.status === 404) {
            throw new Error(response.statusText);
          }
          if (!response.ok) {
            throw new Error("Failed to retrieve user information");
          }
          return response.json();
        })
        .then(() => {
          Swal.fire({
            title: `User with ID ${uid} has been deleted`,
            icon: "success",
            showCancelButton: false,
            cancelButtonColor: false,
            confirmButtonText: false,
            showConfirmButton: false,
            showCloseButton: true,
          });
        })
        .catch((error) => {
          console.error(error);
          Swal.fire({
            title: "Error",
            text: error.message,
            icon: "error",
          });
        });
    }
  });
}

function clearForm(formId) {
  document.getElementById(formId).reset();
}
