import { apiFetch } from "./api.js";

document.addEventListener("DOMContentLoaded", () => {
  const token = localStorage.getItem("token");

  async function cargarCategorias() {
    const categorias = await apiFetch("/categorias", "GET", null, token);
    const contenedor = document.getElementById("categorias");
    contenedor.innerHTML = categorias.map(c => `<p>${c.nombre} (ID: ${c._id})</p>`).join("");
  }

  document.getElementById("agregarCategoria").addEventListener("click", async () => {
    const nombre = document.getElementById("nuevaCategoria").value;
    await apiFetch("/categorias", "POST", { nombre }, token);
    cargarCategorias();
  });

  cargarCategorias();
});
