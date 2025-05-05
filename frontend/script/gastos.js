import { apiFetch } from "./api.js";

document.addEventListener("DOMContentLoaded", () => {
  const token = localStorage.getItem("token");

  async function cargarGastos() {
    const gastos = await apiFetch("/gastos", "GET", null, token);
    const contenedor = document.getElementById("gastos");
    contenedor.innerHTML = gastos.map(g =>
      `<p>${g.descripcion}: $${g.monto} (cat: ${g.categoria_id})</p>`).join("");
  }

  document.getElementById("agregarGasto").addEventListener("click", async () => {
    const monto = parseFloat(document.getElementById("monto").value);
    const descripcion = document.getElementById("descripcion").value;
    const categoria_id = document.getElementById("categoriaId").value;
    await apiFetch("/gastos", "POST", { monto, descripcion, categoria_id }, token);
    cargarGastos();
  });

  document.getElementById("logout").addEventListener("click", () => {
    localStorage.removeItem("token");
    window.location.href = "index.html";
  });

  cargarGastos();
});
