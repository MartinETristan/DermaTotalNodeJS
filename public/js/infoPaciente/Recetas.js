// ========================================================================================================
// Función para cargar la vista Recetas.ejs
// ========================================================================================================

function crearElementoMedicamento(item) {
  const divMedicamentos = document.createElement("div");
  const dt = document.createElement("dt");
  dt.innerHTML = `<b>${item.Medicamento}:</b>`;
  const dd = document.createElement("dd");
  dd.innerHTML = `<p>${item.Indicacion}</p><br>`;

  divMedicamentos.appendChild(dt);
  divMedicamentos.appendChild(dd);
  return divMedicamentos;
}

function crearElementoNota(nota) {
  const Nota = document.createElement("div");
  Nota.className = "RecetaNota";
  const NotaTitulo = document.createElement("h3");
  NotaTitulo.innerHTML = "Nota:";
  const NotaP = document.createElement("p");
  NotaP.innerHTML = nota;

  Nota.appendChild(NotaTitulo);
  Nota.appendChild(NotaP);
  return Nota;
}

function cargarRecetas() {
  const Recetas = document.querySelector("#infocontenido");
  Recetas.innerHTML = `<h3>Historial de Recetas:</h3>`;

  // Asignamos los datos guardados en el localStorage a una variable (recetas)
  const recetas = datosAlmacenados.Recetas;
  // Y los diagnosticos a otra variable (sesiones)
  const sesiones = datosAlmacenados.Seguimientos;

  if (recetas.length === 0) {
    Recetas.innerHTML = `
          <div class="info">
            <h3>Historial de Recetas:</h3>
            <div class="info__item">
              <div class="info__item__content">
                <p>No hay recetas en el expediente</p>
              </div>
            </div>
          </div>
      `;
    return;
  }

  const idRecetasUtilizadas = new Set();

  recetas.forEach((receta) => {
    const ultimareceta = receta.idReceta;
    if (idRecetasUtilizadas.has(ultimareceta)) return;
    idRecetasUtilizadas.add(ultimareceta);

    const { dia, mes, año } = formatearFecha(receta.Fecha);

    const divReceta = document.createElement("div");
    divReceta.className = "info__item";
    divReceta.id = `receta_${ultimareceta}`;

    // Este es el div que contiene la información de la receta
    const contenidoReceta = document.createElement("div");
    contenidoReceta.className = "info__item__content";

    // Solo buscar el diagnóstico si idSesion no es nulo
    if (receta.idSesion != null) {
      // Encontrar la sesión que corresponde al idSesion de la receta
      const sesionCorrespondiente = sesiones.find(
        (sesion) => sesion.idSesion == receta.idSesion
      );
      // Si encontramos una sesión correspondiente, añadimos el diagnóstico
      if (sesionCorrespondiente) {
        const diagnostico = sesionCorrespondiente.Diagnostico;
        const headerDiagnostico = document.createElement("header");
        headerDiagnostico.className = "info__item__header";

        const DoctorDiagnostico = document.createElement("p");
        DoctorDiagnostico.innerHTML = `Seguimiento por: <span>${sesionCorrespondiente.Doctor}</span>`;
        DoctorDiagnostico.classList.add("DoctorDiagnostico");
        headerDiagnostico.appendChild(DoctorDiagnostico);

        const contenedorDiagnostico = document.createElement("div");
        contenedorDiagnostico.classList.add("Cont_Diagnostico");
        const tituloDiagnostico = document.createElement("h2");
        tituloDiagnostico.innerHTML = "NOTA DE SEGUIMIENTO:";
        tituloDiagnostico.classList.add("DiagnosticoTitulo");
        contenedorDiagnostico.appendChild(tituloDiagnostico);

        const Diagnostico = document.createElement("p");
        Diagnostico.textContent = diagnostico;
        Diagnostico.classList.add("Diagnostico_Receta");
        contenedorDiagnostico.appendChild(Diagnostico);

        // Division para separar los diagnosticos de la receta
        const division = document.createElement("hr");
        contenidoReceta.appendChild(headerDiagnostico);
        contenidoReceta.appendChild(contenedorDiagnostico);
        contenidoReceta.appendChild(division);
      }
    }

    // Este es el header de la receta
    const headerReceta = document.createElement("header");
    headerReceta.className = "info__item__header";

    const TituloReceta = document.createElement("h2");
    TituloReceta.innerHTML = `Fecha <span>${dia}/${mes}/${año}</span>:`;
    TituloReceta.className = "FechaReceta";

    const botonImprimir = crearBotonImprimir(receta, ultimareceta);

    headerReceta.appendChild(TituloReceta);
    headerReceta.appendChild(botonImprimir);

    const Doctor = document.createElement("p");
    Doctor.innerHTML = `Recetado por: <b><span>${receta.Doctor}</span></b>`;
    Doctor.className = "DoctorReceta";

    contenidoReceta.appendChild(headerReceta);
    contenidoReceta.appendChild(Doctor);

    const datosFiltrados = recetas.filter(
      (item) => item.idReceta === ultimareceta
    );
    const dl = document.createElement("dl");
    datosFiltrados.forEach((item) => {
      const divMedicamentos = crearElementoMedicamento(item);
      dl.appendChild(divMedicamentos);
    });

    contenidoReceta.appendChild(dl);

    if (receta.Nota) {
      const Nota = crearElementoNota(receta.Nota);
      contenidoReceta.appendChild(Nota);
    }

    divReceta.appendChild(contenidoReceta);
    Recetas.appendChild(divReceta);
  });
}

function crearBotonImprimir(receta, ultimareceta) {
  const botonImprimir = document.createElement("button");
  botonImprimir.className = "iconbtn--print";
  botonImprimir.id = `Print_${ultimareceta}`;
  botonImprimir.innerHTML = "Imprimir Receta";
  botonImprimir.addEventListener("click", () => {
    const urlCompleta = window.location.href;
    const urlPaciente = "InfoPaciente/";
    const posicion = urlCompleta.indexOf(urlPaciente);
    const idPaciente = urlCompleta.substring(posicion + urlPaciente.length);

    //========================================================================================================
    // Codigo para no abrir la pestaña y solo imprimir la receta
    //========================================================================================================
    // Función para obtener o crear el iframe basado en su atributo src
    // function getOrCreateIframeBySrc(src) {
    //   // Buscar iframes en el documento y filtrar por el atributo src
    //   let iframes = Array.from(document.querySelectorAll("iframe"));
    //   let iframe = iframes.find((iframe) => iframe.src.endsWith(src));

    //   // Si el iframe no existe con ese src, lo crea y lo añade al documento
    //   if (!iframe) {
    //     iframe = document.createElement("iframe");
    //     iframe.style.display = "none";
    //     document.body.appendChild(iframe);
    //   } else {
    //     iframe.contentWindow.location.reload();
    //   }

    //   return iframe;
    // }

    // // Definir el src
    // let src = `/Receta/${idPaciente}/${ultimareceta}`;

    // // Usando la función getOrCreateIframeBySrc para obtener o crear el iframe
    // let iframe = getOrCreateIframeBySrc(src);

    // // Establece el evento onload solo si es necesario
    // if (!iframe.onload) {
    //   iframe.onload = function () {
    //     setTimeout(function () {
    //       iframe.contentWindow.print();
    //     }, 200);
    //   };
    // }

    // // Establece el atributo src para cargar el contenido y disparar el evento onload
    // iframe.src = src;

    const imprimir = window.open(
      `/Receta/${idPaciente}/${ultimareceta}`,
      "_blank"
    );

    // Puedes mover el evento onafterprint aquí si deseas que se cierre después de imprimir la página recargada
    // imprimir.onafterprint = () => {
    //   imprimir.close();
    // };
  });
  return botonImprimir;
}
