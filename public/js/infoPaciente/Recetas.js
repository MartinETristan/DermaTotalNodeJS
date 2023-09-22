// ========================================================================================================
// Función para cargar la vista Recetas.ejs
// ========================================================================================================
datosAlmacenadosReceta = [];
// Hacemos la peticoon ajax para obtener las recetas del paciente
$.ajax({
  url: "/InfoPaciente",
  method: "POST",
  dataType: "json",
  success: (data) => {
    // Guardamos los datos para eviar hacer la consulta AJAX nuevamente
    datosAlmacenadosReceta.push(data);
  },
});

function cargarRecetas() {
  const Recetas = document.querySelector("#infocontenido");
  var htmlString = `
    <h3>Historial de Recetas:</h3>
  `;
  Recetas.innerHTML = htmlString;

  setTimeout(() => {
    const recetas = datosAlmacenadosReceta[0].Recetas;
    const recetasPorId = {};
    if (recetas.length > 0) {
    // Agrupar recetas por idReceta
    recetas.forEach((receta) => {
      if (!recetasPorId[receta.idReceta]) {
        recetasPorId[receta.idReceta] = {
          idreceta: [],
          doctor: [],
          nota: [],
          fecha: [],
          medicamentos: [],
          indicaciones: [],
        };
      }
      // Realizar conversiones en la fecha para que se muestre correctamente:
      const fechaOriginal = receta.Fecha;
      // Parsear la fecha
      const fecha = new Date(fechaOriginal);
      // Obtener los componentes de la fecha (día, mes y año)
      const dia = fecha.getDate();
      const mes = fecha.getMonth() + 1; // Sumar 1 porque los meses comienzan en 0
      const año = fecha.getFullYear() % 100; // Obtener los últimos dos dígitos del año

      recetasPorId[receta.idReceta].idreceta = receta.idReceta;
      recetasPorId[receta.idReceta].nota = receta.Nota;
      recetasPorId[receta.idReceta].doctor = receta.Doctor;
      recetasPorId[receta.idReceta].fecha = `${dia}/${mes}/${año}`;
      recetasPorId[receta.idReceta].medicamentos.push(receta.Medicamento);
      recetasPorId[receta.idReceta].indicaciones.push(receta.Indicacion);
    });

    // Ordenar las recetas por fecha ascendente
    const recetasOrdenadas = Object.values(recetasPorId).sort((a, b) => {
      const fechaA = new Date(a.fecha);
      const fechaB = new Date(b.fecha);
      return fechaB - fechaA;
    });

    // Crear divs para cada grupo de idReceta
    recetasOrdenadas.forEach((receta) => {
      const divReceta = document.createElement("div");
      divReceta.className = "info__item";
      divReceta.id = `receta_${receta.idreceta}`; // Cambiar el ID a uno basado en el índice

      const contenidoReceta = document.createElement("div");
      contenidoReceta.className = "info__item__content";
      contenidoReceta.innerHTML = `
        <header class="info__item__header">
          <h2>Receta del día ${receta.fecha}:</h2>
          <button class="iconbtn--print" id="Print_${
            receta.idreceta
          }">Imprimir Receta</button>
        </header>
        <p>Doctor: <b>${receta.doctor}</b></p>
        <p>Medicamentos:</p>
        <b>${receta.medicamentos.join(", ")}</b>
        <p>${receta.nota ? `Nota: ${receta.nota}` : ''}</p>
      `;

      divReceta.appendChild(contenidoReceta);
      Recetas.appendChild(divReceta);

      // Función para manejar la acción al hacer clic en el botón
      function imprimirReceta() {
        // Acciones a realizar cuando se haga clic en el botón de imprimir
        // Acciones a realizar cuando se haga clic en el botón
        // Obtenemos el id del paciente con base a la URL
        const urlCompleta = window.location.href;
        const urlPaciente = "InfoPaciente/";
        const posision = urlCompleta.indexOf(urlPaciente);
        const idPaciente = urlCompleta.substring(posision + urlPaciente.length);

        // Obtenemos el id de la receta
        const idReceta = datosAlmacenados.Recetas[0].idReceta;
        // Abrimos la receta en una nueva pestaña
        window.open(`/Receta/${idPaciente}/${receta.idreceta}`, "_blank");
      }

      // Agregar el escuchador de eventos al botón de imprimir
      const botonImprimir = document.getElementById(`Print_${receta.idreceta}`);
      if (botonImprimir) {
        botonImprimir.addEventListener("click", imprimirReceta);
      }
    });
  } else {
    // Si no hay receta, muestra un mensaje
    Recetas.innerHTML =  `
    <div class="info">
    <h3>Historial de Recetas:</h3>
      <div class="info__item">
        <div class="info__item__content">
          <p>No hay recetas en el expediente</p>
        </div>
      </div>
    </div>
    `;
  }
  }, 100);

}
