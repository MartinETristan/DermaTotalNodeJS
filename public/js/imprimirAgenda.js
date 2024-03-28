// Obtener la parte de la URL que contiene los parámetros de consulta
const queryString = window.location.search;

// Crear un objeto URLSearchParams para facilitar la manipulación de los parámetros de consulta
const params = new URLSearchParams(queryString);

// Acceder a los valores de los parámetros de consulta utilizando el método get()
const tipo = params.get("Tipo");
const id = params.get("id");
const fechaInicio = params.get("fechaInicio");
const fechaFin = params.get("fechaFin");

function convertirFormatoFecha(fechaString) {
  // Parseamos la fecha
  const fecha = new Date(fechaString);

  // Obtenemos los componentes de la fecha
  const año = fecha.getFullYear();
  const mes = String(fecha.getMonth() + 1).padStart(2, "0"); // Añadimos ceros a la izquierda si es necesario
  const dia = String(fecha.getDate()).padStart(2, "0"); // Añadimos ceros a la izquierda si es necesario
  const hora = String(fecha.getHours()).padStart(2, "0"); // Añadimos ceros a la izquierda si es necesario
  const minutos = String(fecha.getMinutes()).padStart(2, "0"); // Añadimos ceros a la izquierda si es necesario
  const segundos = String(fecha.getSeconds()).padStart(2, "0"); // Añadimos ceros a la izquierda si es necesario

  // Construimos la cadena con el formato deseado
  const formatoDeseado = `${año}-${mes}-${dia} ${hora}:${minutos}:${segundos}`;

  return formatoDeseado;
}
// Obtenemos los Selects

const InfoSelects = $.ajax({
    url: "/InfoRegistros",
    type: "POST",
    dataType: "json",
    async: false,
  }).responseJSON;

const EstadosCitas =  InfoSelects.EstadoCitas.map((estado) => {
    return {
        id: estado.idEstadoCita,
        text: estado.Estado,
    };
});


const Citas = $.ajax({
  url: "/Info_ImprimirAgenda",
  type: "POST",
  dataType: "json",
  async: false,
  data: {
    idDoctor: tipo == "Doctores" ? id : null,
    idAsociado: tipo == "Asociados" ? id : null,
    fechaInicio: fechaInicio,
    fechaFin: fechaFin,
  },
}).responseJSON;

// Convertir las fechas en el objeto Citas
Citas.forEach((cita) => {
  cita.HoraCita = convertirFormatoFecha(cita.HoraCita);
  cita.FinCita = convertirFormatoFecha(cita.FinCita);
  cita.FechaCreacion = convertirFormatoFecha(cita.FechaCreacion);
});

$(document).ready(function () {
  // Configuramos el selec2
  $("#EstadosCitas").select2({
    placeholder: "Seleccione un Doctor",
    language: "es",
    minimumResultsForSearch: Infinity,
    data: EstadosCitas,
  });

  $("#EstadosCitas").on("change", function() {
    const estadoSeleccionado = $(this).val();
    // Llamar a la función crearTabla con el estado seleccionado
    crearTabla(Citas, estadoSeleccionado);
    if(estadoSeleccionado == 0){
        h1.textContent = "Agenda de Citas Médicas";
    }
    else{
        h1.textContent = "Agenda de Citas ";
        h1.textContent += " " + EstadosCitas.find((estado) => estado.id == estadoSeleccionado).text+"s";
    }
});



  const contenedor = document.getElementById("ContenidoImprimirAgenda");

  const header = document.createElement("header");

  const contLogo = document.createElement("div");
  contLogo.className = "contLogo";
  const Logo = document.createElement("img");
  Logo.className = "Logo";
  Logo.src = "/img/RCTa/DermaTotalLogo.png";
  Logo.alt = "DermaTotal Logo";
  contLogo.appendChild(Logo);

  const contTextHeader = document.createElement("div");
  contTextHeader.className = "contTextHeader";
  const h1 = document.createElement("h1");
  h1.textContent = "Agenda de Citas Médicas";
  const h2 = document.createElement("h2");
  h2.textContent =
    fechaInicio == fechaFin
      ? `Citas del dia ${fechaInicio}`
      : `Citas del ${fechaInicio} al ${fechaFin}`;
  contTextHeader.appendChild(h1);
  contTextHeader.appendChild(h2);

  header.appendChild(contLogo);
  header.appendChild(contTextHeader);

  contenedor.appendChild(header);

  const contenido = document.createElement("div");
  contenido.className = "contenido";

  // Llamar a la función crearTabla con los datos transformados
  crearTabla(Citas, $("#EstadosCitas").val());

  // Creacion de la tabla:
  function crearTabla(datos, estadoSeleccionado) {
  
    // Limpiar el contenido
    contenido.innerHTML = "";

    // Filtrar las citas según el estado seleccionado
    const citasFiltradas = datos.filter((cita) => {
      if (estadoSeleccionado == 0) return true; // Todos
      return cita.idEstadoCita == estadoSeleccionado;
    });


    if (citasFiltradas.length == 0) {
      const mensaje = document.createElement("p");
      mensaje.textContent = "No hay citas en este rango de fechas.";
      contenido.appendChild(mensaje);
      return;
    } else {
      // Obtener el elemento donde se insertará la tabla
      const contenedorTabla = document.createElement("div");

      // Crear la tabla y sus elementos
      const tabla = document.createElement("table");
      const cabecera = document.createElement("thead");
      const cuerpo = document.createElement("tbody");

      // Verificar si todas las fechas son del mismo día
      const fechasDiferentes = datos.some((fila, index) => {
        // Si es la primera fila, no se compara con las siguientes
        if (index === 0) return false;
        // Se compara la fecha de la fila actual con la fecha de la primera fila
        return fila.HoraCita.split(" ")[0] !== datos[0].HoraCita.split(" ")[0];
      });

      let totalColumnas = fechasDiferentes ? 1 : 1; // Incluyendo la columna de hora

      // Crear la fila de encabezados
      const filaEncabezados = document.createElement("tr");
      if (fechasDiferentes) {
        const thFecha = document.createElement("th");
        thFecha.textContent = "Fecha";
        filaEncabezados.appendChild(thFecha);
        totalColumnas++;
      }

      const thHora = document.createElement("th");
      thHora.textContent = "Hora";
      filaEncabezados.appendChild(thHora);
      totalColumnas++;
      const thPaciente = document.createElement("th");
      thPaciente.textContent = "Paciente";
      filaEncabezados.appendChild(thPaciente);
      totalColumnas++;
      const thUsuario = document.createElement("th");
      thUsuario.textContent = "Creada por";
      filaEncabezados.appendChild(thUsuario);
      totalColumnas++;
      const thNota = document.createElement("th");
      thNota.textContent = "Nota";
      filaEncabezados.appendChild(thNota);
      if(estadoSeleccionado == 0){
          totalColumnas++;
          const thEstado = document.createElement("th");
          thEstado.textContent = "Estado";
          filaEncabezados.appendChild(thEstado);
      }

      // Titulo de la tabla
      const filaTitulo = document.createElement("tr");
      const titulo = document.createElement("th");
      titulo.className = "TituloTabla";
      titulo.textContent =
      citasFiltradas[0].Doctor == null ? citasFiltradas[0].Asociado : citasFiltradas[0].Doctor;
      titulo.setAttribute("colspan", totalColumnas); // Abarcar todas las columnas
      filaTitulo.appendChild(titulo);
      cabecera.appendChild(filaTitulo);

      // se agrega la fila de encabezados
      cabecera.appendChild(filaEncabezados);
      // Crear las filas de datos
      citasFiltradas.forEach((filaDatos) => {
        const fila = document.createElement("tr");
        if (fechasDiferentes) {
          const tdFecha = document.createElement("td");
          tdFecha.textContent = filaDatos.HoraCita.split(" ")[0];
          fila.appendChild(tdFecha);
        }
        const tdHora = document.createElement("td");
        tdHora.textContent =
          "De " +
          filaDatos.HoraCita.split(" ")[1] +
          " a " +
          filaDatos.FinCita.split(" ")[1];
        fila.appendChild(tdHora);

        const tdPaciente = document.createElement("td");
        tdPaciente.textContent = filaDatos.NombrePaciente;
        fila.appendChild(tdPaciente);

        const tdUsuario = document.createElement("td");
        tdUsuario.textContent = filaDatos.CreacionCita;
        fila.appendChild(tdUsuario);

        const tdNota = document.createElement("td");
        tdNota.textContent = filaDatos.Nota;
        fila.appendChild(tdNota);

        if(estadoSeleccionado == 0){
            const tdEstado = document.createElement("td");
            tdEstado.textContent = filaDatos.Estado;
            fila.appendChild(tdEstado);
        }

        cuerpo.appendChild(fila);
      });

      // Agregar la cabecera y el cuerpo a la tabla
      tabla.appendChild(cabecera);
      tabla.appendChild(cuerpo);

      // Agregar la tabla al contenedor
      contenedorTabla.appendChild(tabla);
      contenido.appendChild(contenedorTabla);
    }
  }

  contenedor.appendChild(contenido);

  // Funcion para impimir
  $("#ContenidoImprimirAgenda").click(function () {
    window.print();
  });
  
  $("#PrintButton").click(function () {
    window.print();
  });

});
