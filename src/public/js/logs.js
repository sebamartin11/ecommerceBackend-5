const loginForm = document.getElementById("login-form");
const registerForm = document.getElementById("register-form");

// Events Listeners
loginForm?.addEventListener("submit", async (event) => {
  event.preventDefault();

  const loginFormData = new FormData(loginForm);
  const loginPayload = Object.fromEntries(loginFormData);

  try {
    await fetch("/api/sessions/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(loginPayload),
    });
    window.location.href = "/products";

    loginForm.reset();
  } catch (error) {
    console.log(error);
    window.location.href = "/";
  }
});

registerForm?.addEventListener("submit", async (event) => {
  event.preventDefault();

  const registerFormData = new FormData(registerForm);

  try {
    await fetch("/api/sessions/register", {
      method: "POST",
      body: registerFormData,
      redirect: "manual",
      headers: {
        type: "profile_image",
      },
    });
    window.location.href = "/";
    registerForm.reset();
  } catch (error) {
    console.log(error);
    window.location.href = "/register";
  }
});

const logout = () => {
  fetch("/api/sessions/logout");
  window.location.href = "/";
};
