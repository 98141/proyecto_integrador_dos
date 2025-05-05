import { apiFetch } from "./api.js";

const token = localStorage.getItem("token");
if (!token) window.location.href = "index.html";

document.addEventListener("DOMContentLoaded", () => {
  const input = document.getElementById("nuevaCategoria");
  const btn = document.getElementById("agregarCategoria");

  async function cargarCategorias() {
    const categorias = await apiFetch("/categorias", "GET", null, token);
    const contenedor = document.getElementById("categorias");
    contenedor.innerHTML = `
      <table border="1">
        <thead>
          <tr><th>Nombre</th><th>Acciones</th></tr>
        </thead>
        <tbody>
          ${categorias.map(cat => `
            <tr data-id="${cat._id}">
              <td contenteditable="true">${cat.nombre}</td>
              <td>
                <button class="guardar">Editar</button>
                <button class="eliminar">Eliminar</button>
              </td>
            </tr>`).join("")}
        </tbody>
      </table>
    `;

    document.querySelectorAll(".guardar").forEach(btn => {
      btn.addEventListener("click", async e => {
        const fila = e.target.closest("tr");
        const id = fila.dataset.id;
        const nombre = fila.children[0].innerText;
        await apiFetch(`/categorias/${id}`, "PUT", { nombre }, token);
      });
    });

    document.querySelectorAll(".eliminar").forEach(btn => {
      btn.addEventListener("click", async e => {
        const fila = e.target.closest("tr");
        const id = fila.dataset.id;
        await apiFetch(`/categorias/${id}`, "DELETE", null, token);
        fila.remove();
      });
    });
  }

  btn.addEventListener("click", async () => {
    if (!input.value.trim()) return;
    await apiFetch("/categorias", "POST", { nombre: input.value }, token);
    input.value = "";
    cargarCategorias();
  });

  cargarCategorias();
});