import { Transaccion } from "./classes/transaccion.js";

const formulario = document.getElementById("formulario");

const tabla = document.getElementById("tabla");

const totalIngresos = document.getElementById("totalIngresos");

const totalGastos = document.getElementById("totalGastos");

const balanceNeto = document.getElementById("balanceNeto");

const resumenCategorias = document.getElementById("resumenCategorias");

const btnVaciarTodo = document.getElementById("btnVaciarTodo");

const datosGuardados = localStorage.getItem("transacciones");

if (datosGuardados) {
    try {
        Transaccion.historial = JSON.parse(datosGuardados);
    } catch (error) {
        console.error("Error al recuperar las transacciones:", error);
        Transaccion.historial = [];
    }
}


function guardarDatos() {
  localStorage.setItem(
    "transacciones",
    JSON.stringify(Transaccion.historial)
  );
}

formulario.addEventListener("submit", function (e) {
  e.preventDefault();

  const descripcion = document.getElementById("descripcion").value;

  const monto = Number(document.getElementById("monto").value);

  const fechaInput = document.getElementById("fecha").value; 
  const [anio, mes, dia] = fechaInput.split("-");
  const fecha = `${dia}/${mes}/${anio}`; 

  const tipo = document.getElementById("tipo").value;

  const categoria = document.getElementById("categoria").value;


if (!descripcion.trim() || !Number.isFinite(monto) || monto <= 0) {
    Swal.fire({
        title: "Datos incorrectos",
        text: "Ingrese una descripción y un monto mayor que cero.",
        icon: "warning"
    });
    return;
}

  const nuevaTransaccion = new Transaccion(
    Date.now(),
    descripcion,
    monto,
    fecha,
    tipo,
    categoria,
  );

  Transaccion.historial.push(nuevaTransaccion);

  guardarDatos();

  renderizarTabla();

  actualizarBalance();

  mostrarResumenCategorias();

  crearGraficoCategorias();

  crearGraficoEvolucion();

  formulario.reset();

});

function renderizarTabla() {
  tabla.innerHTML = "";

  Transaccion.historial.forEach((transaccion) => {
    tabla.innerHTML += `

        <tr >

            <td class="p-2 text-center"> ${transaccion.descripcion} </td>

            <td class="p-2 text-center"> ${transaccion.categoria} </td>

            <td class="p-2 text-center ${
              transaccion.tipo === "ingreso" ? "text-green-600" : "text-red-600"
            }">${transaccion.tipo}

            </td>

            <td class="p-2 text-center">$${transaccion.monto.toLocaleString("es-AR")}</td>
            
            <td class="p-2 text-center">${transaccion.fecha}</td>

          <td class="p-2 text-center">

          <button onclick="eliminarTransaccion(${transaccion.id})" class="hover:scale-110 transition" aria-label="Eliminar transacción">
              <img src="./icons8-delete-trash-48.png"alt="Eliminar" class="w-5 h-5"/>
          </button>

            </td>

        </tr>

        `;
  });
}


function actualizarBalance() {

  const ingresos = Transaccion.historial
    .filter((t) => t.tipo === "ingreso")
    .reduce((acc, t) => acc + t.monto, 0);

  const gastos = Transaccion.historial
    .filter((t) => t.tipo === "gasto")
    .reduce((acc, t) => acc + t.monto, 0);

  const balance = ingresos - gastos;

    totalIngresos.textContent =
    `$${ingresos.toLocaleString("es-AR")}`;

    totalGastos.textContent =
    `$${gastos.toLocaleString("es-AR")}`;

    balanceNeto.textContent =
    `$${balance.toLocaleString("es-AR")}`;

}


function mostrarResumenCategorias() {
    resumenCategorias.innerHTML = "";

    const categorias = {};

    Transaccion.historial.forEach((transaccion) => {
        const clave = `${transaccion.tipo}-${transaccion.categoria}`;

        if (!categorias[clave]) {
            categorias[clave] = 0;
        }

        categorias[clave] += transaccion.monto;
        
    });

    for (const clave in categorias) {
        const [tipo, categoria] = clave.split("-");

        resumenCategorias.innerHTML += `
            <div class="p-2 border-b">
                <strong>${categoria}</strong>
                (${tipo}):$${categorias[clave].toLocaleString("es-AR")}
            </div>
        `;
    }
}


function crearGraficoCategorias() {
    const categorias = {};

    Transaccion.historial.forEach((transaccion) => {

        const clave = `${transaccion.categoria}|${transaccion.tipo}`;

        if (!categorias[clave]) {
            categorias[clave] = 0;
        }

        categorias[clave] += transaccion.monto;
    });

    const datos = Object.entries(categorias).map(([clave, monto]) => {

        const [categoria, tipo] = clave.split("|");

        return {
            categoria,
            tipo,
            monto
        };
    });

    const nombres = datos.map((dato) =>
        `${dato.categoria} (${dato.tipo})`
    );

    const valores = datos.map((dato) => dato.monto);

    const colores = datos.map((dato) =>
        dato.tipo === "ingreso" ? "#22C55E" : "#EF4444"
    );

    const options = {

        chart: {
            type: "bar",
            height: 350,
            toolbar: {
                show: false
            }
        },

        series: [
            {
                name: "Monto Total",
                data: valores
            }
        ],

        colors: colores,

        plotOptions: {
            bar: {
                distributed: true
            }
        },

        xaxis: {
            categories: nombres
        },

        legend: {
            show: false
        },

        dataLabels: {
         enabled: true,
         formatter: function (val) {
          return val.toLocaleString("es-AR");
       }
       },
       yaxis: {
        labels: {
         formatter: function (value) {
            return value.toLocaleString("es-AR");
         }
        }
        },

        tooltip: {
            enabled: true,

            custom: function({ series, seriesIndex, dataPointIndex }) {

                const movimientoActual = datos[dataPointIndex];

                return `
                    <div class="p-3 bg-white shadow-lg rounded-lg border border-gray-200 text-sm">

                        <div class="font-bold text-gray-800 border-b pb-1 mb-1">
                            ${movimientoActual.categoria} (${movimientoActual.tipo})
                        </div>

                        <div class="text-gray-600 mb-1">
                            <strong>Total:</strong>
                            $${series[seriesIndex][dataPointIndex].toLocaleString("es-AR")}
                        </div>

                    </div>
                `;
            }
        }
    };

    document.querySelector("#graficoCategorias").innerHTML = "";

    const chart = new ApexCharts(
        document.querySelector("#graficoCategorias"),
        options
    );
    chart.render();

}

function crearGraficoEvolucion() {

  const fechas = [...new Set(
    Transaccion.historial.map(t => t.fecha)
  )];

  const ingresos = [];
  const gastos = [];
  const balances = [];

  let balanceAcumulado = 0;

  fechas.forEach(fecha => {

    const ingresoDia = Transaccion.historial
      .filter(
        t => t.fecha === fecha &&
             t.tipo === "ingreso"
      )
      .reduce((acc, t) => acc + t.monto, 0);

    const gastoDia = Transaccion.historial
      .filter(
        t => t.fecha === fecha &&
             t.tipo === "gasto"
      )
      .reduce((acc, t) => acc + t.monto, 0);

    balanceAcumulado += ingresoDia - gastoDia;

    ingresos.push(ingresoDia);
    gastos.push(gastoDia);
    balances.push(balanceAcumulado);

  });

  const options = {

    chart: {
      type: "line",
      height: 350
    },

    series: [
      {
        name: "Ingresos",
        data: ingresos
      },
      {
        name: "Gastos",
        data: gastos
      },
      {
        name: "Balance Neto",
        data: balances
      }
    ],

    colors: [
      "#22C55E",
      "#EF4444",
      "#3B82F6"
    ],

    stroke: {
      width: 4
    },

    dataLabels: {
    enabled: true,
    formatter: function (val) {
        return val.toLocaleString("es-AR");
    }
    },

    yaxis: {
    labels: {
        formatter: function (value) {
            return value.toLocaleString("es-AR");
        }
    }
    },

    xaxis: {
      categories: fechas
    },

    markers: {
      size: 5
    }
  };

  document.querySelector("#graficoEvolucion").innerHTML = "";

  const chart = new ApexCharts(
    document.querySelector("#graficoEvolucion"),
    options
  );

  chart.render();
}

window.eliminarTransaccion = function (id) {

  Swal.fire({
    title: "🗑️ Confirmar eliminación",
    text: "¿Está seguro de eliminar este movimiento?",
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Sí, eliminar",                     
    cancelButtonText: "Cancelar",
    confirmButtonColor: "#ef4444",
  }).then((result) => {

    if (result.isConfirmed) {

      Transaccion.historial = Transaccion.historial.filter(
        (transaccion) => transaccion.id !== id,
      );

      guardarDatos();
      renderizarTabla();
      actualizarBalance();
      mostrarResumenCategorias();
      crearGraficoCategorias();
      crearGraficoEvolucion();

      Swal.fire({
        title: "✅ Eliminado",
        text: "El movimiento fue eliminado correctamente.",
        icon: "success",
        timer: 1500,
        showConfirmButton: false,
      });
    }
  });
};
// Aquí pusimos la lógica para el botón Vaciar Todo
btnVaciarTodo.addEventListener("click", function () {
  if (Transaccion.historial.length === 0) {
    Swal.fire({
      title: "Historial vacío",
      text: "No hay movimientos registrados para eliminar.",
      icon: "info",
      confirmButtonColor: "#ca8a04",
    });
    return;
  }

  Swal.fire({
    title: "⚠️ ¿Eliminar todo el historial?",
    text: "Esta acción borrará permanentemente todos tus ingresos y gastos registrados. ¡No se puede deshacer!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Sí, borrar todo",
    cancelButtonText: "Cancelar",
    confirmButtonColor: "#ef4444",
    cancelButtonColor: "#6e7881",
  }).then((result) => {
    if (result.isConfirmed) {
      Transaccion.historial = [];
     
     
      guardarDatos();
      renderizarTabla();
      actualizarBalance();
      mostrarResumenCategorias();
      crearGraficoCategorias();
      crearGraficoEvolucion();

      Swal.fire({
        title: "🗑️ Historial vaciado",
        text: "Todos los datos del localStorage fueron eliminados.",
        icon: "success",
        timer: 2000,
        showConfirmButton: false,
      });
    }
  });
});


renderizarTabla();
actualizarBalance();
mostrarResumenCategorias();
crearGraficoCategorias();
crearGraficoEvolucion();