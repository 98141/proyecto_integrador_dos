document.getElementById("loginForm").addEventListener("submit", async (e) => {
    e.preventDefault();
    const email = e.target.email.value;
    const password = e.target.password.value;
  
    const res = await fetch("http://127.0.0.1:5000/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
  
    const data = await res.json();
    if (data.token) {
      alert("Login exitoso. Token: " + data.token);
      // Puedes guardarlo en localStorage
    } else {
      alert(data.msg);
    }
  });
  