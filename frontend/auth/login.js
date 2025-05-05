import { apiFetch } from "../script/api.js";

document.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.getElementById("loginForm");
  //const registerForm = document.getElementById("registerForm");

  if (loginForm) {
    loginForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const email = loginForm.email.value;
      const password = loginForm.password.value;

      const res = await apiFetch("/login", "POST", { email, password });
      if (res.access_token) {
        localStorage.setItem("token", res.access_token);
        window.location.href = "dashboard.html";
      } else {
        alert(res.msg);
      }
    });
  }

});

  