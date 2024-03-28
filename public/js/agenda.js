// Obtencion de la informacion de las variables globales
const InfoSesion = $.ajax({
  url: "/InfoSesion",
  method: "POST",
  dataType: "json",
  async: false,
}).responseJSON;

console.log(InfoSesion);

const InfoSelects = $.ajax({
  url: "/InfoRegistros",
  type: "POST",
  dataType: "json",
  async: false,
}).responseJSON;

console.log(InfoSelects);

//Animacion del NavBar para que desaparezca en cuanto baja el scroll
var $navBar = $(".nav-bar");

$(window).scroll(function () {
  var scrollTop = $(this).scrollTop() - 100;
  var windowHeight = 200;
  var navBarHeight = $navBar.height();

  var scrollFraction = scrollTop / (windowHeight - navBarHeight);

  var animationDuration = 0.01; // Duración de la animación en segundos
  var opacity = 1 - scrollFraction;

  $navBar.css({
    opacity: opacity,
    transition: `opacity ${animationDuration}s ease-in-out`,
    "pointer-events": opacity > 0 ? "auto" : "none",
  });
});

// ====================================================================================================
// Llenado de los selects de los doctores seleccionables
// ====================================================================================================

const SelectMedico = document.getElementById("SelectMedico");

// Creamos un objeto con las opciones de los doctores Disponibles
const Medicos = {
  Doctores: {},
  Asociados: {},
};
// Realizamos un forEach para agregar las opciones de los doctores
InfoSelects.Doctores.forEach((doctor) => {
  Medicos.Doctores[doctor.idDoctor] = doctor.Nombres;
});
// Y los asociados
InfoSelects.Asociados.forEach((asociado) => {
  Medicos.Asociados[asociado.idAsociado] = asociado.Nombres;
});
// Generamos las opciones de los doctores y asociados
OpcionesGrupos(Medicos.Doctores, "Doctores", SelectMedico);
OpcionesGrupos(Medicos.Asociados, "Asociados", SelectMedico);

function OpcionesGrupos(categoria, nombreCategoria, selectElement) {
  const optgroup = document.createElement("optgroup");
  optgroup.label = nombreCategoria;

  for (const id in categoria) {
    const option = document.createElement("option");
    option.value = id;
    option.textContent = categoria[id];
    optgroup.appendChild(option);
  }

  selectElement.appendChild(optgroup);
}

function encontrarGrupoDeOpcionSeleccionada(SelectElement) {
  var optgroups = SelectElement.getElementsByTagName("optgroup");
  for (var i = 0; i < optgroups.length; i++) {
    var opciones = optgroups[i].getElementsByTagName("option");
    for (var j = 0; j < opciones.length; j++) {
      if (opciones[j].selected) {
        return optgroups[i].label || "Grupo sin etiqueta";
      }
    }
  }

  return "Ninguna opción seleccionada";
}
// ====================================================================================================
// Configuracion de Select2
// ====================================================================================================

$("#SelectMedico").select2({
  language: "es",
  minimumResultsForSearch: Infinity,
  placeholder: "Elige a un especialista...",
});

// Si el que está realizando la cita es un doctor
if (InfoSesion.EsDoctor) {
  //Se selecciona automaticamente su nombre
  $("#SelectMedico").val(InfoSesion.ID).trigger("change");
  // Se deshabilita el select para que no se pueda cambiar
  $("#SelectMedico").prop("disabled", true);
  // Y se oculta de la vista
  $(".contSelect").hide();
  $(".PrintArea").hide();

} else {
  // Si no es doctor, solo puede ser recepcionista
  //Elegimos el primer doctor de la lista
  $("#SelectMedico").val("1").trigger("change");
}
// ====================================================================================================
// Configuracion de Impresion de la Agenda
// ====================================================================================================

$("#PrintRango").select2({
  language: "es",
  minimumResultsForSearch: Infinity,
  placeholder: "Elige un rango de fechas...",
});

function convertirFormatoFecha(fechaString) {
  // Parseamos la fecha
  const fecha = new Date(fechaString);

  // Obtenemos los componentes de la fecha
  const año = fecha.getFullYear();
  const mes = String(fecha.getMonth() + 1).padStart(2, "0"); // Añadimos ceros a la izquierda si es necesario
  const dia = String(fecha.getDate()).padStart(2, "0"); // Añadimos ceros a la izquierda si es necesario

  // Construimos la cadena con el formato deseado
  const formatoDeseado = `${año}-${mes}-${dia}`;

  return formatoDeseado;
}

const flatpickrConfig = {
  // Cambiar el idioma a español
  locale: {
    firstDayOfWeek: 1,
    weekdays: {
      shorthand: ["Do", "Lu", "Ma", "Mi", "Ju", "Vi", "Sa"],
      longhand: [
        "Domingo",
        "Lunes",
        "Martes",
        "Miércoles",
        "Jueves",
        "Viernes",
        "Sábado",
      ],
    },
    months: {
      shorthand: [
        "Ene",
        "Feb",
        "Mar",
        "Abr",
        "May",
        "Jun",
        "Jul",
        "Ago",
        "Sep",
        "Oct",
        "Nov",
        "Dic",
      ],
      longhand: [
        "Enero",
        "Febrero",
        "Marzo",
        "Abril",
        "Mayo",
        "Junio",
        "Julio",
        "Agosto",
        "Septiembre",
        "Octubre",
        "Noviembre",
        "Diciembre",
      ],
    },
    rangeSeparator: " a ",
  },
  dateFormat: "Y-m-d",
  mode: "range", // Establece el modo de selección de fecha en rango
  minDate: new Date().fp_incr(-14), // Establece la fecha mínima en 14 días antes de la fecha actual
  maxDate: new Date().fp_incr(14), // Establece la fecha máxima en 14 días
};

$("#PrintFecha").hide();

const fp = $("#PrintFecha").flatpickr(flatpickrConfig);

$("#PrintRango").on("select2:select", function (e) {
  // Obtenemos el rango de fechas seleccionado
  const rango = e.params.data.id;
  if (rango == "Hoy") {
    $("#PrintFecha").hide();
    fp.clear();
  } else {
    $("#PrintFecha").show();
  }
});

$("#PrintButton").on("click", function (e) {
  // En caso de que se haya seleccionado "Rango"
  if ($("#PrintRango").val() == "Rango") {
    // Verificamos que se haya seleccionado un rango de fechas
    if (fp.selectedDates.length != 2) {
      alert("Por favor, selecciona un rango de fechas.");
      return;
    }
  }
  // Convertimos las fechas seleccionadas al formato deseado
  let fechaInicio = convertirFormatoFecha(fp.selectedDates[0]);
  let fechaFin = convertirFormatoFecha(fp.selectedDates[1]);

  // En caso de que se haya seleccionado "Hoy"
  if ($("#PrintRango").val() == "Hoy") {
    // Obtenemos la fecha actual
    const fechaActual = new Date();
    // Convertimos la fecha actual al formato deseado
    fechaInicio = convertirFormatoFecha(fechaActual);
    fechaFin = convertirFormatoFecha(fechaActual);
  }

  // Abrimos una nueva ventana con la URL de impresión de la agenda
  window.open(
    `/ImprimirAgenda?Tipo=${encontrarGrupoDeOpcionSeleccionada(
      SelectMedico
    )}&id=${$(
      "#SelectMedico"
    ).val()}&fechaInicio=${fechaInicio}&fechaFin=${fechaFin}`,
    "_blank"
  );
  // URL:
  // /ImprimirAgenda?Tipo=Doctor&id=1&fechaInicio=2021-08-01&fechaFin=2021-08-01
});

// ====================================================================================================
// Creacion de Calendario
// ====================================================================================================

$(document).ready(function () {
  var calendarEl = document.getElementById("calendar");

  var calendar = new FullCalendar.Calendar(calendarEl, {
    initialView: "timeGridWeek",
    headerToolbar: {
      left: "prev,today,next",
      center: "title",
      right: "dayGridMonth,timeGridWeek,timeGridDay",
    },
    locale: "es-MX",
    // Tiempos Maximos y minimos

    slotMinTime: "08:00:00",
    slotMaxTime: "20:00:00",
    // Duracion de los eventos
    slotDuration: "00:05:00",
    // Ocultamos los eventos del domingo
    hiddenDays: [0],
    //Ocultamos los eventos de todo el dia
    views: {
      timeGridWeek: {
        // Establecemos el tamano del calendario para que no aparezcan los scrollbars
        contentHeight: "3485px",
        allDaySlot: false, // Ocultar la pestaña "all-day" en la vista semanal
      },
      timeGridDay: {
        contentHeight: "3485px",
        allDaySlot: false, // Ocultar la pestaña "all-day" en la vista diaria
      },
      dayGridMonth: {
        contentHeight: "1000px",
      },
    },

    businessHours: true,
    businessHours: [
      {
        daysOfWeek: [1, 2, 3, 4, 5], // Dias de la semana que se trabajan (Lunes a Viernes)
        startTime: "09:00", // 9am
        endTime: "18:00", // 6pm
      },
      {
        daysOfWeek: [6], // Horario de trabajo(Sabado)
        startTime: "09:00", // 9am
        endTime: "14:00", // 2pm
      },
    ],
    stickyHeaderDates: true,
    // Indicador de hora
    nowIndicator: true,

    // Si se puede seleccionar los eventos
    selectable: true,
    // Formato de la hora
    slotLabelFormat: {
      hour: "2-digit",
      minute: "2-digit",
      omitZeroMinute: false,
      meridiem: "short",
      hour12: true,
    },

    events: function (fetchInfo, successCallback, failureCallback) {
      $.ajax({
        url: "/Agenda_Citas",
        method: "POST",
        dataType: "json",
        data: {
          idDoctor:
            encontrarGrupoDeOpcionSeleccionada(SelectMedico) == "Doctores"
              ? $("#SelectMedico").val()
              : null,
          idAsociado:
            encontrarGrupoDeOpcionSeleccionada(SelectMedico) == "Asociados"
              ? $("#SelectMedico").val()
              : null,
        },
        success: function (data) {
          const colores = {
            1: "#249DD9",
            2: "#f9b11f",
            3: "green",
            4: "#ACACAC",
          };
          console.log(data);
          var eventos = data.map(function (evento) {
            var startTime = moment.utc(evento.HoraCita).local().format("HH:mm");
            var endTime = moment.utc(evento.FinCita).local().format("HH:mm");

            // Filtrar eventos que cumplan la condición de edición (idStatusPaciente igual a 1)
            if (evento.idStatusPaciente === 1) {
              return {
                id: evento.idCitas,
                title: evento.Nombres,
                start: evento.HoraCita,
                end: evento.FinCita,
                backgroundColor: colores[evento.idStatusPaciente],
                borderColor: colores[evento.idStatusPaciente],
                extendedProps: {
                  Procedimiento: evento.Procedimiento,
                  idPaciente: evento.idPaciente,
                },
                _content: `<h3>${evento.Nombres}</h3><div class="HoraConsulta">${startTime}/${endTime}</div>`,
                editable: true, // Habilitar edición solo para eventos con idStatusPaciente igual a 1
              };
            } else {
              return {
                id: evento.idCitas,
                title: evento.Nombres,
                start: evento.HoraCita,
                end: evento.FinCita,
                backgroundColor: colores[evento.idStatusPaciente],
                borderColor: colores[evento.idStatusPaciente],
                extendedProps: {
                  Procedimiento: evento.Procedimiento,
                  idPaciente: evento.idPaciente,
                },
                _content: `<h3>${evento.Nombres}</h3><div class="HoraConsulta">${startTime}/${endTime}</div>`,
                editable: false, // Deshabilitar edición para otros eventos
              };
            }
          });

          successCallback(eventos);
        },
        error: function (error) {
          console.error(error);
          failureCallback(error);
        },
      });
    },

    // Crea los eventos con base a la informacion de la base de datos
    eventContent: function (arg) {
      return { html: arg.event._def.extendedProps._content };
    },

    // Muestra el modal con la informacion del evento al hacer Hover
    eventDidMount: function (info) {
      var tooltip = new Tooltip(info.el, {
        title: info.event._def.extendedProps.Procedimiento,
        placement: "top",
        trigger: "hover",
      });
    },

    // Actualiza el evento en la base de datos al cambiarse en el calendario
    eventDrop: function (info) {
      // Aquí accedemos a la información del evento movido en info.event

      // evenTime es un objeto con las propiedades start y end (el tiempo en que se movió el evento)
      var evenTime = info.event._instance.range;
      // eventID es el identificador único del evento (idCita)
      var eventID = info.event._def.publicId;

      // Creamos una funcion que convierte la fecha a un formato de insersion en la base de datos
      function convertirFechaAFormatoDeseado(fecha) {
        const año = fecha.getFullYear();
        const mes = String(fecha.getMonth() + 1).padStart(2, "0");
        const dia = String(fecha.getDate()).padStart(2, "0");
        // Hay un ligero desface de horas en el mapa (5 horas) por lo que lo compensamos
        // agregando 5 horas a la hora de inicio y fin
        const hora = String(fecha.getHours() + 5).padStart(2, "0");
        const minutos = String(fecha.getMinutes()).padStart(2, "0");
        const segundos = String(fecha.getSeconds()).padStart(2, "0");

        return `${año}-${mes}-${dia} ${hora}:${minutos}:${segundos}`;
      }
      // Convertimos las fechas a un formato con el que puede trabajar la funcion de arriba
      const StartTime = new Date(evenTime.start);
      const EndTime = new Date(evenTime.end);

      // Y almacenamos el resultado en una variable
      const newStartTime = convertirFechaAFormatoDeseado(StartTime);
      const newEndTime = convertirFechaAFormatoDeseado(EndTime);

      // Realiza una solicitud AJAX para actualizar la base de datos con los nuevos datos
      $.ajax({
        url: "/ActualizarCita",
        method: "POST",
        data: {
          idCita: eventID, // Identificador único del evento
          HoraCita: newStartTime,
          FinCita: newEndTime,
        },
        success: function (response) {
          // Actualiza el calendario
          calendar.refetchEvents();
        },
        error: function (error) {
          console.error("Hubo un error en la solicitud AJAX: ", error);
        },
      });
    },

    // Lo mismo de Arriba pero cuando se modifica la duracion del evento
    eventResize: function (info) {
      // Aquí accedemos a la información del evento movido en info.event

      // evenTime es un objeto con las propiedades start y end (el tiempo en que se movió el evento)
      var evenTime = info.event._instance.range;
      // eventID es el identificador único del evento (idCita)
      var eventID = info.event._def.publicId;

      // Creamos una funcion que convierte la fecha a un formato de insersion en la base de datos
      function convertirFechaAFormatoDeseado(fecha) {
        const año = fecha.getFullYear();
        const mes = String(fecha.getMonth() + 1).padStart(2, "0");
        const dia = String(fecha.getDate()).padStart(2, "0");
        // Hay un ligero desface de horas en el mapa (5 horas) por lo que lo compensamos
        // agregando 5 horas a la hora de inicio y fin
        const hora = String(fecha.getHours() + 5).padStart(2, "0");
        const minutos = String(fecha.getMinutes()).padStart(2, "0");
        const segundos = String(fecha.getSeconds()).padStart(2, "0");

        return `${año}-${mes}-${dia} ${hora}:${minutos}:${segundos}`;
      }
      // Convertimos las fechas a un formato con el que puede trabajar la funcion de arriba
      const StartTime = new Date(evenTime.start);
      const EndTime = new Date(evenTime.end);

      // Y almacenamos el resultado en una variable
      const newStartTime = convertirFechaAFormatoDeseado(StartTime);
      const newEndTime = convertirFechaAFormatoDeseado(EndTime);

      // Realiza una solicitud AJAX para actualizar la base de datos con los nuevos datos
      $.ajax({
        url: "/ActualizarCita",
        method: "POST",
        data: {
          idCita: eventID, // Identificador único del evento
          HoraCita: newStartTime,
          FinCita: newEndTime,
        },
        success: function (response) {
          // Actualiza el calendario
          calendar.refetchEvents();
        },
        error: function (error) {
          console.error("Hubo un error en la solicitud AJAX: ", error);
        },
      });
    },

    // Cuando se hace click en un evento
    eventClick: function (info) {
      // Obtenemos el id del paciente
      var idPaciente = info.event._def.extendedProps.idPaciente;
      // Pasamos a mostrar la vista del paciente con su info en la URL
      window.location.href = "/InfoPaciente/" + idPaciente;
    },
  });

  calendar.render();

  $("#SelectMedico").on("select2:select", async function (e) {
    // En cuanto se seleccione un medico, se va a recargar el calendario
    calendar.refetchEvents();
  });
});
