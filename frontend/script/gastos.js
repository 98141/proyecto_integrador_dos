import { apiFetch } from "./api.js";

document.addEventListener("DOMContentLoaded", () => {
  const token = localStorage.getItem("token");
  const monto = document.getElementById("monto");
  const descripcion = document.getElementById("descripcion");
  const categoria_id = document.getElementById("categoriaId");

  if (!token) {
    window.location.href = "index.html"; // Redirige si no hay token
  }

  async function cargarGastos() {
    const gastos = await apiFetch("/gastos", "GET", null, token);
    const contenedor = document.getElementById("gastos");
    contenedor.innerHTML = gastos.map(g =>
      `<p>${g.descripcion}: $${g.monto} (cat: ${g.categoria_id})</p>`).join("");
  }

  document.getElementById("agregarGasto").addEventListener("click", async () => {
    if (!monto.value || !descripcion.value || !categoria_id.value) {
      return alert("Por favor llena todos los campos");
    }

    await apiFetch("/gastos", "POST", {
      monto: parseFloat(monto.value),
      descripcion: descripcion.value,
      categoria_id: categoria_id.value
    }, token);

    // 🔴 limpiar campos
    monto.value = "";
    descripcion.value = "";
    categoria_id.value = "";

    cargarGastos();
  });

  cargarGastos();
});
