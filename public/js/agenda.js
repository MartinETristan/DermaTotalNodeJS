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
    
    slotMinTime: "08:30:00",
    slotMaxTime: "19:00:00",
    // Duracion de los eventos
    slotDuration: "00:10:00",
    // Ocultamos los eventos del domingo
    hiddenDays: [0], 
    //Ocultamos los eventos de todo el dia
    views: {
      timeGridWeek: {
        // Establecemos el tamano del calendario para que no aparezcan los scrollbars
        contentHeight: '1538px',
        allDaySlot: false, // Ocultar la pestaña "all-day" en la vista semanal
      },
      timeGridDay: {
        contentHeight: '1538px',
        allDaySlot: false, // Ocultar la pestaña "all-day" en la vista diaria
      },
      dayGridMonth: {
        contentHeight: '1000px',
   
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
    // Indicador de hora
    nowIndicator: true,
    // Si se puede arrastrar los eventos
    editable: true,
    // Si se puede seleccionar los eventos
    selectable: true,
    // Formato de la hora
    slotLabelFormat: {
      hour: "numeric",
      minute: "2-digit",
      omitZeroMinute: false,
      meridiem: "short",
      hour12: true,
    },

    events: function (fetchInfo, successCallback, failureCallback) {
      $.ajax({
        url: "/AgendaDoctor",
        method: "GET",
        dataType: "json",
        success: function (data) {
          // Array con los colores a mostrar con base a su status
          const colores = {1: '#249DD9', 2: '#f9b11f', 3: 'green', 4: '#ACACAC'};
          var eventos = data.map(function (evento) {
            var startTime = moment.utc(evento.HoraCita).local().format("HH:mm"); // Convertir y ajustar la hora de inicio
            var endTime = moment.utc(evento.FinCita).local().format("HH:mm"); // Convertir y ajustar la hora de finalización

            return {
              id: evento.idCitas,
              title: evento.Nombres,
              start: evento.HoraCita,
              end: evento.FinCita,
              backgroundColor: colores[evento.idStatusPaciente],
              borderColor: colores[evento.idStatusPaciente],
              extendedProps: {
                Procedimiento: evento.Procedimiento,
              },
              // Agrega otras propiedades según tus necesidades
              _content: `<h3>${evento.Nombres}</h3><div class="HoraConsulta">${startTime}/${endTime}</div>`,
            };
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
    eventDidMount: function(info) {
      var tooltip = new Tooltip(info.el, {
        title: info.event._def.extendedProps.Procedimiento,
        placement: 'top',
        trigger: 'hover',
        container: 'body'
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
    eventClick: function(info) {


    },

    

  });

  calendar.render();
});
