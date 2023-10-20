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

  const recetas = datosAlmacenadosReceta[0].Recetas;

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

    const contenidoReceta = document.createElement("div");
    contenidoReceta.className = "info__item__content";

    const header = document.createElement("header");
    header.className = "info__item__header";

    const TituloReceta = document.createElement("h2");
    TituloReceta.innerHTML = `Fecha <span>${dia}/${mes}/${año}</span>:`;
    TituloReceta.className = "FechaReceta";

    const botonImprimir = crearBotonImprimir(receta, ultimareceta);

    header.appendChild(TituloReceta);
    header.appendChild(botonImprimir);

    const Doctor = document.createElement("p");
    Doctor.innerHTML = `Recetado por: <b><span>${receta.Doctor}</span></b>`;
    Doctor.className = "DoctorReceta";

    contenidoReceta.appendChild(header);
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
    function getOrCreateIframeBySrc(src) {
      // Buscar iframes en el documento y filtrar por el atributo src
      let iframes = Array.from(document.querySelectorAll("iframe"));
      let iframe = iframes.find((iframe) => iframe.src.endsWith(src));

      // Si el iframe no existe con ese src, lo crea y lo añade al documento
      if (!iframe) {
        iframe = document.createElement("iframe");
        iframe.style.display = "none";
        document.body.appendChild(iframe);
      } else {
        iframe.contentWindow.location.reload();
      }

      return iframe;
    }

    // Definir el src
    let src = `/Receta/${idPaciente}/${ultimareceta}`;

    // Usando la función getOrCreateIframeBySrc para obtener o crear el iframe
    let iframe = getOrCreateIframeBySrc(src);

    // Establece el evento onload solo si es necesario
    if (!iframe.onload) {
      iframe.onload = function () {
        setTimeout(function () {
          iframe.contentWindow.print();
        }, 200);
      };
    }

    // Establece el atributo src para cargar el contenido y disparar el evento onload
    iframe.src = src;

    // window.open(`/Receta/${idPaciente}/${ultimareceta}`, "_blank");
  });
  return botonImprimir;
}
