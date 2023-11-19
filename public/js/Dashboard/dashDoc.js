//==================================================================================================
// Pacientes en Espera
//==================================================================================================
function PacientesEnEspera(datos) {
  const elementosPorPagina = 3;

  const NumPacientesEspera = document.querySelector(".NumeroPacientesEspera");
  NumPacientesEspera.textContent = datos.length;

  const PacientesEspera = document.querySelector(".PacientesEnEspera");
  PacientesEspera.innerHTML = "";

  if (datos.length !== 0) {
    $(".PaginacionEspera").twbsPagination({
      totalPages: Math.ceil(datos.length / elementosPorPagina),
      visiblePages: 5,
      first: "Primero",
      next: ">",
      prev: "<",
      last: "Ultimo",
      onPageClick: function (event, page) {
        const startIndex = (page - 1) * elementosPorPagina;
        const endIndex = startIndex + elementosPorPagina;
        const elementosPagina = datos.slice(startIndex, endIndex);
        mostrarElementos(elementosPagina);
      },
    });

    function mostrarElementos(elementos) {
      PacientesEspera.innerHTML = "";
      elementos.forEach((Paciente) => {
        const ElementoPaciente = document.createElement("div");

        // Condicionales para determinar la clase del paciente
        ElementoPaciente.classList.add("Paciente");
        if (Paciente.HoraLlegada) {
          ElementoPaciente.classList.add(
            Paciente.HoraCita >= Paciente.HoraLlegada ? "ATiempo" : "Tarde"
          );
        }
        if (Paciente.StatusPaciente === 3) {
          ElementoPaciente.classList.remove("ATiempo", "Tarde");
          ElementoPaciente.classList.add("EnConsulta");
        }
        ElementoPaciente.id = Paciente.idPaciente;

        const rutaRelativa = Paciente.RutaFoto
          ? getPacientePath(Paciente.RutaFoto, "/public")
          : "/img/UserIco.webp";

        const headerElement = createHeader(
          rutaRelativa,
          Paciente.NombresPacientes,
          Paciente.ApellidosPacientes
        );
        ElementoPaciente.appendChild(headerElement);

        const InfoLlegadaPaciente = [
          { TituloInfo: "Hora Cita", SourceInfo: Paciente.HoraCita || "- -:- -" },
          {
            TituloInfo: "Hora Llegada",
            SourceInfo: Paciente.HoraLlegada || "- -:- -",
          },
        ];

        createInfoSection(InfoLlegadaPaciente, ElementoPaciente);

        const ContenedorBotones = document.createElement("div");
        ContenedorBotones.classList.add("BotonesDeAccion");
        const Boton = CrearBotonDeAccion(Paciente);
        ContenedorBotones.appendChild(Boton);
        ElementoPaciente.appendChild(ContenedorBotones);

        // Event listeners para el boton de accion
        Boton.addEventListener("click", function (event) {
          if (Paciente.StatusPaciente === 3 ||Paciente.idSesion) {
            console.log("Informacion del Paciente Clickado:");
            console.log(Paciente);
            DatosPaciente = {
              Protocolo: "Finalizar",
              idStatusPaciente: Paciente.idStatusPaciente,
              idCita: Paciente.idCita,
              idSucursal: Paciente.idSucursal,
              idSesion: Paciente.idSesion,
              idDoctor: Paciente.idDoctor,
              Nombre: Paciente.NombresPacientes,
              Apellido: Paciente.ApellidosPacientes,
              HoraCita: Paciente.HoraCita,
              Procedimiento: Paciente.Procedimiento,
              RutaFoto: rutaRelativa,
              Consultorio: Paciente.Consultorio,
              PrecioSugerido: Paciente.PrecioProcedimineto,
            };
            Accion_Paciente(DatosPaciente);
            event.stopPropagation();
          } else {
            console.log("Informacion del Paciente Clickado:");
            console.log(Paciente);
            DatosPaciente = {
              Protocolo: "Pedir",
              idStatusPaciente: Paciente.idStatusPaciente,
              idCita: Paciente.idCita,
              idSucursal: Paciente.idSucursal,
              Nombre: Paciente.NombresPacientes,
              Apellido: Paciente.ApellidosPacientes,
              HoraCita: Paciente.HoraCita,
              Procedimiento: Paciente.Procedimiento,
              RutaFoto: rutaRelativa,
              Nota: Paciente.Nota,
            };
            Accion_Paciente(DatosPaciente);
            event.stopPropagation();
          }
        });

        ElementoPaciente.addEventListener("click", function (event) {
          const pacienteElement = event.target.closest(".Paciente");
          if (
            pacienteElement &&
            pacienteElement.classList.contains("Paciente")
          ) {
            const idPaciente = pacienteElement.id;
            window.location.href = "/InfoPaciente/" + idPaciente;
          }
        });

        PacientesEspera.appendChild(ElementoPaciente);
      });
    }

    mostrarElementos(datos.slice(0, elementosPorPagina));
  } else {
    const NoPacientes = document.createElement("h2");
    NoPacientes.textContent = "No hay pacientes en espera.";
    NoPacientes.classList.add("NoPacientes");
    PacientesEspera.appendChild(NoPacientes);
  }
}

//==================================================================================================
// Citas del día
//==================================================================================================
function CitasHoy(datos) {
  var NumCitasHoy = document.querySelector(".NumeroPacientesCitasHoy");
  NumCitasHoy.textContent = datos.length;

  var CitasHoy = document.querySelector(".PacientesHoy");
  CitasHoy.innerHTML = ""; // Limpiamos el contenedor

  if (datos.length != 0) {
    var elementosPorPagina = 3;

    $(".PaginacionHoy").twbsPagination({
      totalPages: Math.ceil(datos.length / elementosPorPagina),
      visiblePages: 5,
      first: "Primero",
      next: ">",
      prev: "<",
      last: "Ultimo",
      onPageClick: function (event, page) {
        var startIndex = (page - 1) * elementosPorPagina;
        var endIndex = startIndex + elementosPorPagina;
        var elementosPagina = datos.slice(startIndex, endIndex);
        mostrarElementos(elementosPagina);
      },
    });

    function mostrarElementos(elementos) {
      CitasHoy.innerHTML = "";

      elementos.forEach((Paciente) => {
        var ElementoPaciente = document.createElement("div");
        ElementoPaciente.classList.add("Paciente");
        ElementoPaciente.id = Paciente.idPaciente;

        const rutaRelativa = Paciente.RutaFoto
          ? getPacientePath(Paciente.RutaFoto, "/public")
          : "/img/UserIco.webp";

        const headerElement = createHeader(
          rutaRelativa,
          Paciente.NombresPacientes,
          Paciente.ApellidosPacientes
        );
        ElementoPaciente.appendChild(headerElement);

        var InfoLlegadaPaciente = [
          { TituloInfo: "Hora Cita", SourceInfo: Paciente.HoraCita },
          { TituloInfo: "Procedimiento", SourceInfo: Paciente.Procedimiento },
        ];

        createInfoSection(InfoLlegadaPaciente, ElementoPaciente);
        CitasHoy.appendChild(ElementoPaciente);
      });
    }

    CitasHoy.addEventListener("click", function (event) {
      var pacienteElement = event.target.closest(".Paciente");
      if (pacienteElement && pacienteElement.classList.contains("Paciente")) {
        var idPaciente = pacienteElement.id;
        window.location.href = "/InfoPaciente/" + idPaciente;
      }
    });

    // Mostramos la primera pagina
    mostrarElementos(datos.slice(0, elementosPorPagina));
  } else {
    var NoPacientes = document.createElement("h2");
    NoPacientes.textContent = "No hay citas para hoy.";
    NoPacientes.classList.add("NoPacientes");
    CitasHoy.appendChild(NoPacientes);
  }
}

//==================================================================================================
// Otros Consultorios
//==================================================================================================
function OtrosConsultorios(datos) {
  const elementosPorPagina = 3;

  const NumOtrosConsultorios = document.querySelector(
    ".NumeroOtrosConsultorios"
  );
  NumOtrosConsultorios.textContent = datos.length;

  const ContenidoOtrosConsultorios = document.querySelector(
    ".ContenidoOtrosConsultorios"
  );
  ContenidoOtrosConsultorios.innerHTML = "";

  if (datos.length !== 0) {
    $(".PaginacionOtros").twbsPagination({
      totalPages: Math.ceil(datos.length / elementosPorPagina),
      visiblePages: 5,
      first: "Primero",
      next: ">",
      prev: "<",
      last: "Ultimo",
      onPageClick: function (event, page) {
        const startIndex = (page - 1) * elementosPorPagina;
        const endIndex = startIndex + elementosPorPagina;
        const elementosPagina = datos.slice(startIndex, endIndex);
        mostrarElementos(elementosPagina);
      },
    });

    function mostrarElementos(elementos) {
      ContenidoOtrosConsultorios.innerHTML = "";
      elementos.forEach((Paciente) => {
        const ElementoPaciente = document.createElement("div");
        ElementoPaciente.classList.add(
          "Paciente",
          Paciente.idStatusPaciente === 2 ? "Pedir" : "Ver"
        );
        ElementoPaciente.id = Paciente.idPaciente;

        const rutaRelativa = Paciente.RutaFoto
          ? getPacientePath(Paciente.RutaFoto, "/public")
          : "/img/UserIco.webp";

        const headerElement = createHeader(
          rutaRelativa,
          Paciente.Nombres,
          Paciente.Apellidos
        );
        ElementoPaciente.appendChild(headerElement);

        let InfoLlegadaPaciente = [
          { TituloInfo: "Hora Cita", SourceInfo: Paciente.HoraCita },
          { TituloInfo: "Doctor", SourceInfo: Paciente.NombreDoctor },
          {
            TituloInfo: "Consultorio",
            SourceInfo: Paciente.Consultorio || "-",
          },
        ];

        if (Paciente.idStatusPaciente === 2) {
          InfoLlegadaPaciente.pop();
        }

        createInfoSection(InfoLlegadaPaciente, ElementoPaciente);

        if (Paciente.idStatusPaciente === 2) {
          const Boton = CrearBotonDeAccion(Paciente);
          Boton.textContent = "Pedir";
          Boton.addEventListener("click", function (event) {
            DatosPaciente = {
              Protocolo: "Pedir",
              idStatusPaciente: Paciente.idStatusPaciente,
              idCita: Paciente.idCita,
              idSucursal: Paciente.idSucursal,
              Nombre: Paciente.Nombres,
              Apellido: Paciente.Apellidos,
              HoraCita: Paciente.HoraCita,
              Procedimiento: Paciente.Procedimiento,
              RutaFoto: rutaRelativa,
              Nota: Paciente.Nota,
            };
            Accion_Paciente(DatosPaciente);
            event.stopPropagation();
          });
          const ContenedorBotones = document.createElement("div");
          ContenedorBotones.classList.add("BotonesDeAccion");
          ContenedorBotones.appendChild(Boton);
          ElementoPaciente.appendChild(ContenedorBotones);
        }

        ContenidoOtrosConsultorios.appendChild(ElementoPaciente);
      });
    }

    ContenidoOtrosConsultorios.addEventListener("click", function (event) {
      const pacienteElement = event.target.closest(".Paciente");
      if (pacienteElement && pacienteElement.classList.contains("Paciente")) {
        const idPaciente = pacienteElement.id;
        window.location.href = "/InfoPaciente/" + idPaciente;
      }
    });

    mostrarElementos(datos.slice(0, elementosPorPagina));
  } else {
    const NoPacientes = document.createElement("h2");
    NoPacientes.textContent = "Consultorios Libres.";
    NoPacientes.classList.add("NoPacientes");
    ContenidoOtrosConsultorios.appendChild(NoPacientes);
  }
}

//==================================================================================================
// Citas Finalizadas
//==================================================================================================
function CitasFinalizadas(datos) {
  const elementosPorPagina = 3;

  const NumCitasFinalizadas = document.querySelector(".NumeroCitasFinalizadas");
  NumCitasFinalizadas.textContent = datos.length;

  const ContenidoCitasFinalizadas = document.querySelector(
    ".ContenidoCitasFinalizadas"
  );
  ContenidoCitasFinalizadas.innerHTML = "";

  if (datos.length !== 0) {
    $(".PaginacionCF").twbsPagination({
      totalPages: Math.ceil(datos.length / elementosPorPagina),
      visiblePages: 5,
      first: "Primero",
      next: ">",
      prev: "<",
      last: "Ultimo",
      onPageClick: function (event, page) {
        const startIndex = (page - 1) * elementosPorPagina;
        const endIndex = startIndex + elementosPorPagina;
        const elementosPagina = datos.slice(startIndex, endIndex);
        mostrarElementos(elementosPagina);
      },
    });

    function mostrarElementos(elementos) {
      ContenidoCitasFinalizadas.innerHTML = "";

      elementos.forEach((Paciente) => {
        const ElementoPaciente = document.createElement("div");
        ElementoPaciente.classList.add("Paciente", "CitasFin");
        ElementoPaciente.id = Paciente.idPaciente;

        const rutaRelativa = Paciente.RutaFoto
          ? getPacientePath(Paciente.RutaFoto, "/public")
          : "/img/UserIco.webp";

        const headerElement = createHeader(
          rutaRelativa,
          Paciente.NombresPacientes,
          Paciente.ApellidosPacientes
        );
        ElementoPaciente.appendChild(headerElement);

        const InfoLlegadaPaciente = [
          { TituloInfo: "Hora Cita", SourceInfo: Paciente.HoraCita },
        ];

        createInfoSection(InfoLlegadaPaciente, ElementoPaciente);

        const ContenedorBotones = document.createElement("div");
        ContenedorBotones.classList.add("BotonesDeAccion");
        const Boton = document.createElement("button");
        Boton.classList.add("BotonFinalizar");
        Boton.textContent = "Editar CheckOut";

        Boton.addEventListener("click", function (event) {
          console.log("Informacion del Paciente Clickado:");
          console.log(Paciente);
          DatosPaciente = {
            Protocolo: "UpdateFinalizar",
            idSesion: Paciente.idSesion,
            idStatusPaciente: Paciente.idStatusPaciente,
            CheckOut: Paciente.CheckOut,
            Nombre: Paciente.NombresPacientes,
            Apellido: Paciente.ApellidosPacientes,
            HoraCita: Paciente.HoraCita,
            Procedimiento: Paciente.Procedimiento,
            RutaFoto: rutaRelativa,
            Consultorio: Paciente.Consultorio,
            PrecioSugerido: Paciente.PrecioProcedimineto,
          };
          Accion_Paciente(DatosPaciente);
          event.stopPropagation();
        });

        ContenedorBotones.appendChild(Boton);
        ElementoPaciente.appendChild(ContenedorBotones);
        ContenidoCitasFinalizadas.appendChild(ElementoPaciente);
      });
    }

    ContenidoCitasFinalizadas.addEventListener("click", function (event) {
      const pacienteElement = event.target.closest(".Paciente");
      if (pacienteElement && pacienteElement.classList.contains("Paciente")) {
        const idPaciente = pacienteElement.id;
        window.location.href = "/InfoPaciente/" + idPaciente;
      }
    });

    mostrarElementos(datos.slice(0, elementosPorPagina));
  } else {
    const NoCitas = document.createElement("h2");
    NoCitas.textContent = "No hay citas finalizadas.";
    NoCitas.classList.add("NoPacientes");
    ContenidoCitasFinalizadas.appendChild(NoCitas);
  }
}





//==================================================================================================
// Realizar la carga y asignacion de datos obtenidos del servidor
//==================================================================================================
$.ajax({
  url: "/DashboardDoc",
  method: "POST",
  dataType: "json",
  success: function (respuesta) {
    PacientesEnEspera(respuesta.PacientesEspera);
    CitasHoy(respuesta.CitasHoy);
    OtrosConsultorios(respuesta.OtrosConsultorios);
    CitasFinalizadas(respuesta.CitasFinalizadas);
  },
  error: function (error) {
    console.error(error);
  },
});


//==================================================================================================
// Funciones para actualizar de manera individual las tablas del Dashboard
//==================================================================================================

function Actualizar_Hoy_Espera() {
  $.ajax({
    url: "/DashboardDoc/Hoy_Espera",
    method: "POST",
    dataType: "json",
    success: function (respuesta) {
      PacientesEnEspera(respuesta.PacientesEspera);
      CitasHoy(respuesta.CitasHoy);
    },
    error: function (error) {
      console.error(error);
    },
  });
}


function Actualizar_Consulta_Checkout() {
  $.ajax({
    url: "/DashboardDoc/Consulta_CheckOut",
    method: "POST",
    dataType: "json",
    success: function (respuesta) {
      PacientesEnEspera(respuesta.PacientesEspera);
      CitasFinalizadas(respuesta.CitasFinalizadas);
    },
    error: function (error) {
      console.error(error);
    },
  });
}

function Actualizar_OC_Espera() {
  $.ajax({
    url: "/DashboardDoc/OC_Espera",
    method: "POST",
    dataType: "json",
    success: function (respuesta) {
      PacientesEnEspera(respuesta.PacientesEspera);
    },
    error: function (error) {
      console.error(error);
    },
  });
}









function Actualizar_Espera(){
  console.log("Actualizando Espera");
  $.ajax({
    url: "/DashboardDoc/Espera",
    method: "POST",
    dataType: "json",
    success: function (respuesta) {
      PacientesEnEspera(respuesta);
    },
    error: function (error) {
      console.error(error);
    },
  });
}

function Actualizar_CitasHoy(){
  console.log("Actualizando Citas Hoy");
  $.ajax({
    url: "/DashboardDoc/CitasHoy",
    method: "POST",
    dataType: "json",
    success: function (respuesta) {
      CitasHoy(respuesta);
    },
    error: function (error) {
      console.error(error);
    },
  });
}

function Actualizar_OC(){
  console.log("Actualizando Otros Consultorios");
  $.ajax({
    url: "/DashboardDoc/OtrosConsultorios",
    method: "POST",
    dataType: "json",
    success: function (respuesta) {
      OtrosConsultorios(respuesta);
    },
    error: function (error) {
      console.error(error);
    },
  });
}

function Actualizar_CF(){
  console.log("Actualizando Citas Finalizadas");
  $.ajax({
    url: "/DashboardDoc/CitasFinalizadas",
    method: "POST",
    dataType: "json",
    success: function (respuesta) {
      CitasFinalizadas(respuesta);
    },
    error: function (error) {
      console.error(error);
    },
  });
}



//==================================================================================================
// Events Listeners para actualizar las tablas del Dashboard
//==================================================================================================

$(document).ready(function () {
  $("#Doc_ActualizarEspera").click(function () {
    Actualizar_Espera();
    // Añade la clase para iniciar la animación y el manejador del evento para cuando termine
    $(".Entrada").addClass("entrando").on("animationend", function() {
      // Quita la clase si ya no se necesita más la animación
      $(this).removeClass("entrando");  
      // Elimina el manejador del evento para que no se acumulen si el botón se pulsa múltiples veces
      $(this).off("animationend");
    });
  });
  
  $("#Doc_ActualizarCitasHoy").click(function () {
    Actualizar_CitasHoy();
    $(".CCPH").addClass("entrando").on("animationend", function() {
      $(this).removeClass("entrando");  
      $(this).off("animationend");
    });
  });

  $("#Doc_ActualizarOC").click(function () {
    Actualizar_OC();
    $(".Otros").addClass("entrando").on("animationend", function() {
      $(this).removeClass("entrando");  
      $(this).off("animationend");
    });
  });
  $("#Doc_ActualizarCF").click(function () {
    Actualizar_CF();
    $(".Finalizadas").addClass("entrando").on("animationend", function() {
      $(this).removeClass("entrando");  
      $(this).off("animationend");
    });
  });
}); 


//==================================================================================================
// Socket's para actualizar el Dashboard
//==================================================================================================
// Citas Hoy - Pacientes en Espera
socket.on("Hoy_Espera", function (data) {
  Actualizar_Hoy_Espera();
  NuevoAudio(1);
});


// Pacientes en Espera - Consulta
socket.on("Espera_Consulta", function (data) {
  Actualizar_Espera();
  NuevoAudio(4);
});

// Consulta - CheckOut
socket.on("Consulta_CheckOut", function (data) {
  Actualizar_Consulta_Checkout();
  NuevoAudio(3);
});

// Actualizar Otros consultorios
socket.on("OtrosConsultorios", function (data) {
  Actualizar_OC();
});

// Actualizar El CheckOut
socket.on("Update_CheckOut", function (data) {
  $.ajax({
    url: "/DashboardDoc",
    method: "POST",
    dataType: "json",
    success: function (respuesta) {
      CitasFinalizadas(respuesta.CitasFinalizadas);
    },
    error: function (error) {
      console.error(error);
    },
  });
});