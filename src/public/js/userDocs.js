// Sweet alert definition
const Toast = Swal.mixin({
  toast: true,
  position: "top-end",
  showConfirmButton: false,
  timer: 4000,
  timerProgressBar: true,
});

const userDocumentForm = document.getElementById("userDocument-form");
const uidInput = userDocumentForm.querySelector('input[name="uid"]');

const uid = uidInput.value;

userDocumentForm?.addEventListener("submit", async (event) => {
  event.preventDefault();

  const documentsFormData = new FormData(userDocumentForm);

  try {
    const response = await fetch(
      `/api/users/${uid}/documents`,
      {
        method: "POST",
        body: documentsFormData,
        headers: {
          type: "documents",
        },
      }
    );

    if (response.ok) {
      Toast.fire({
        icon: "success",
        title: "All documents have been successfully uploaded",
      }).then(() => {
        location.reload();
      });
    } else {
      Toast.fire({
        icon: "error",
        title:
          "Ups, something happend. Please try again. If the error persist, please contact with the Administrator",
      });
    }
  } catch (error) {
    console.log(error);
    window.location.href = "/becomePremium";
  }
});

const becomePremiumButton = document.getElementById("becomePremiumButton");
becomePremiumButton.addEventListener("click", becomePremium);

async function becomePremium() {
  try {
    const response = await fetch(
      `/api/users/premium/${uid}`,
      {
        method: "PUT",
      }
    );

    if (response.ok) {
      Toast.fire({
        icon: "success",
        title: "Congratulations! You are now a Premium User!",
        text: "Please log in again to access your premium features.",
        timer: 6000,
      }).then(() => {
        fetch("/api/sessions/logout")
          .then(() => {
            window.location.href = "/";
          })
          .catch((error) => {
            console.log(error);
            window.location.href = "/becomePremium";
          });
      });
    } else {
      Toast.fire({
        icon: "error",
        title:
          "Ups, something happened. Please try again. If the error persists, please contact the Administrator",
      });
    }
  } catch (error) {
    console.log(error);
    window.location.href = "/becomePremium";
  }
}
