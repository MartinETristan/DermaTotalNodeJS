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
  Recetas.innerHTML = `<h3>Historial de Recetas:</h3>`;

    const recetas = datosAlmacenadosReceta[0].Recetas;

    if (recetas.length > 0) {
      const idRecetasUtilizadas = new Set();

      recetas.forEach((receta) => {
        const ultimareceta = receta.idReceta;

        // Verifica si el idReceta ya se ha utilizado
        if (idRecetasUtilizadas.has(ultimareceta)) {
          return; // Pasa al siguiente si ya se ha utilizado
        }

        // Agrega el idReceta al conjunto
        idRecetasUtilizadas.add(ultimareceta);

        // Resto del código para crear elementos con este idReceta
        const fechaOriginal = receta.Fecha;
        const fecha = new Date(fechaOriginal);
        const dia = fecha.getDate();
        const mes = fecha.getMonth() + 1;
        const año = fecha.getFullYear() % 100;

        const header = document.createElement("header");
        header.className = "info__item__header";
        const TituloReceta = document.createElement("h2");
        TituloReceta.innerHTML = `Receta del día (<span>${dia}/${mes}/${año}</span>):`;

        const botonImprimir = document.createElement("button");
        botonImprimir.className = "iconbtn--print";
        botonImprimir.id = `Print_${ultimareceta}`;
        botonImprimir.innerHTML = "Imprimir Receta";

        header.appendChild(TituloReceta);
        header.appendChild(botonImprimir);

        const Doctor = document.createElement("p");
        Doctor.innerHTML = `Recetado por: <b><span>${receta.Doctor}</span></b>`;

        const dl = document.createElement("dl");
        const datosFiltrados = recetas.filter(
          (item) => item.idReceta === ultimareceta
        );

        datosFiltrados.forEach((item) => {
          const dt = document.createElement("dt");
          dt.innerHTML = `<b>${item.Medicamento}:</b>`;

          const dd = document.createElement("dd");
          dd.innerHTML = `
            <p>${item.Indicacion}</p>
            <br>
          `;

          dl.appendChild(dt);
          dl.appendChild(dd);
        });

        const divReceta = document.createElement("div");
        divReceta.className = "info__item";
        divReceta.id = `receta_${ultimareceta}`;

        const contenidoReceta = document.createElement("div");
        contenidoReceta.className = "info__item__content";
        contenidoReceta.appendChild(header);
        contenidoReceta.appendChild(Doctor);
        contenidoReceta.appendChild(dl);

        if (receta.Nota) {
          const Nota = document.createElement("div");
          const NotaTitulo = document.createElement("h3");
          NotaTitulo.innerHTML = "Nota:";
          const NotaP = document.createElement("p");
          NotaP.innerHTML = receta.Nota;
          Nota.appendChild(NotaTitulo);
          Nota.appendChild(NotaP);
          contenidoReceta.appendChild(Nota);
        }

        botonImprimir.addEventListener("click", () => {
          const urlCompleta = window.location.href;
          const urlPaciente = "InfoPaciente/";
          const posicion = urlCompleta.indexOf(urlPaciente);
          const idPaciente = urlCompleta.substring(
            posicion + urlPaciente.length
          );
          window.open(`/Receta/${idPaciente}/${ultimareceta}`, "_blank");
        });

        contenidoReceta.insertBefore(header, contenidoReceta.firstChild);
        divReceta.appendChild(contenidoReceta);
        Recetas.appendChild(divReceta);
      });
    } else {
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
    }
}
