import { apiFetch } from "../script/api.js";

document.addEventListener("DOMContentLoaded", () => {
  //const loginForm = document.getElementById("loginForm");
  const registerForm = document.getElementById("registerForm");

  if (registerForm) {
    registerForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const email = registerForm.email.value;
      const password = registerForm.password.value;

      const res = await apiFetch("/register", "POST", { email, password });
      if (res.msg.includes("registrado")) {
        window.location.href = "index.html";
      } else {
        alert(res.msg);
      }
    });
  }
});
