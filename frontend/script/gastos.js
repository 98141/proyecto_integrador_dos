import { apiFetch } from "./api.js";

const token = localStorage.getItem("token");
if (!token) window.location.href = "index.html";

document.addEventListener("DOMContentLoaded", () => {
  const descripcion = document.getElementById("descripcion");
  const monto = document.getElementById("monto");
  const categoriaId = document.getElementById("categoriaId");
  const btn = document.getElementById("agregarGasto");
  const gastosBody = document.getElementById("gastosBody");
  const promedioSpan = document.getElementById("promedio");
  const mayorSpan = document.getElementById("mayor");

  async function cargarGastos() {
    const gastos = await apiFetch("/gastos", "GET", null, token);

    // Calcular promedio y mayor gasto
    const total = gastos.reduce((sum, g) => sum + g.monto, 0);
    const promedio = gastos.length ? (total / gastos.length).toFixed(2) : 0;
    const mayor = gastos.length ? Math.max(...gastos.map((g) => g.monto)) : 0;
    promedioSpan.textContent = promedio;
    mayorSpan.textContent = mayor;

    // Llenar la tabla
    gastosBody.innerHTML = gastos
      .map(
        (g) => `
      <tr data-id="${g._id}">
        <td contenteditable="true">${g.descripcion}</td>
        <td contenteditable="true">$ ${g.monto}</td>
        <td contenteditable="true">${g.categoria_id}</td>
        <td>
          <button class="editar">Editar</button>
          <button class="eliminar">Eliminar</button>
        </td>
      </tr>
    `
      )
      .join("");

    // Listeners para editar y eliminar
    document.querySelectorAll(".editar").forEach((btn) => {
      btn.addEventListener("click", async (e) => {
        const fila = e.target.closest("tr");
        const id = fila.dataset.id;
        const descripcion = fila.children[0].innerText;
        const monto = parseFloat(fila.children[1].innerText);
        const categoria_id = fila.children[2].innerText;
        await apiFetch(
          `/gastos/${id}`,
          "PUT",
          { descripcion, monto, categoria_id },
          token
        );
      });
    });

    document.querySelectorAll(".eliminar").forEach((btn) => {
      btn.addEventListener("click", async (e) => {
        const fila = e.target.closest("tr");
        const id = fila.dataset.id;
        await apiFetch(`/gastos/${id}`, "DELETE", null, token);
        fila.remove();
      });
    });
  }

  btn.addEventListener("click", async () => {
    if (!descripcion.value || !monto.value || !categoriaId.value) return;
    await apiFetch(
      "/gastos",
      "POST",
      {
        descripcion: descripcion.value,
        monto: parseFloat(monto.value),
        categoria_id: categoriaId.value,
      },
      token
    );
    descripcion.value = "";
    monto.value = "";
    categoriaId.value = "";
    cargarGastos();
  });

  cargarGastos();
});
