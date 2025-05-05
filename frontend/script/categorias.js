import { apiFetch } from "./api.js";

document.addEventListener("DOMContentLoaded", () => {
  const token = localStorage.getItem("token");
  const input = document.getElementById("nuevaCategoria");
  const btn = document.getElementById("agregarCategoria");

  if (!token) {
    window.location.href = "index.html"; // Redirige si no hay token
  }

  async function cargarCategorias() {
    const categorias = await apiFetch("/categorias", "GET", null, token);
    const contenedor = document.getElementById("categorias");
    contenedor.innerHTML = categorias
      .map((c) => `<p>${c.nombre} (ID: ${c._id})</p>`)
      .join("");
  }

  btn.addEventListener("click", async () => {
    if (!input.value.trim()) return alert("Ingrese un nombre.");
    await apiFetch("/categorias", "POST", { nombre: input.value }, token);
    input.value = "";
    cargarCategorias();
  });

  cargarCategorias();
});
