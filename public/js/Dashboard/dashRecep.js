//==================================================================================================
// Funcion para mostrar los pacientes para hoy
//==================================================================================================

function PacientesHoy(datos) {
  const elementosPorPagina = 3;

  const CitasHoy = document.querySelector(".CitasHoy");
  CitasHoy.innerHTML = "";

  if (datos.length !== 0) {
    const Doctores = datos.reduce((acumulador, actual) => {
      if (!acumulador[actual.idDoctor]) acumulador[actual.idDoctor] = [];
      acumulador[actual.idDoctor].push(actual);
      return acumulador;
    }, {});

    for (let Doctor in Doctores) {
      const divDoctor = document.createElement("div");
      divDoctor.classList.add(`Doctor-${Doctor}`);

      // El título se puede obtener de cualquier cita del mismo doctor
      const tituloDoctor = document.createElement("h3");
      tituloDoctor.textContent = `${
        Doctores[Doctor][0].Doctor || "Otras Consultas"
      }:`;
      divDoctor.appendChild(tituloDoctor);

      const divContDoctor = document.createElement("div");
      divContDoctor.classList.add("ContenedorDoctor");

      function mostrarElementos(elementos) {
        divContDoctor.innerHTML = "";
        elementos.forEach((Paciente) => {
          const ElementoPaciente = document.createElement("div");
          ElementoPaciente.classList.add("Paciente", "PacienteHoy");
          ElementoPaciente.id = Paciente.idPaciente;

          const rutaRelativa = Paciente.RutaFoto
            ? getPacientePath(Paciente.RutaFoto, "/public")
            : "/img/UserIco.webp";
          const HeaderPaciente = createHeader(
            rutaRelativa,
            Paciente.NombresPacientes,
            Paciente.ApellidosPacientes
          );
          ElementoPaciente.appendChild(HeaderPaciente);

          const InfoLlegadaPaciente = [
            { TituloInfo: "Hora Cita", SourceInfo: Paciente.HoraCita },
          ];
          createInfoSection(InfoLlegadaPaciente, ElementoPaciente);

          const ContenedorBotones = document.createElement("div");
          ContenedorBotones.classList.add("BotonesDeAccion");

          const Boton = document.createElement("button");
          Boton.classList.add("BotonPedir");
          Boton.textContent = "CheckIn";
          Boton.addEventListener("click", function (event) {
            DatosPaciente = {
              Protocolo: "CheckIn",
              idStatusPaciente: 1,
              idAsociado: Paciente.idAsociado,
              idDoctor: Paciente.idDoctor,
              idCita: Paciente.idCitas,
              Procedimiento: Paciente.Procedimiento,
              Doctor: Paciente.Doctor,
              Asociado: Paciente.Asociado,
              Nombre: Paciente.NombresPacientes,
              Apellido: Paciente.ApellidosPacientes,
              HoraCita: Paciente.HoraCita,
              Procedimiento: Paciente.Procedimientos,
              RutaFoto: rutaRelativa,
            };
            Accion_Paciente(DatosPaciente);
            event.stopPropagation();
          });

          ContenedorBotones.appendChild(Boton);
          ElementoPaciente.appendChild(ContenedorBotones);
          divContDoctor.appendChild(ElementoPaciente);
        });
      }

      mostrarElementos(Doctores[Doctor].slice(0, elementosPorPagina));

      const Paginacion = document.createElement("div");
      Paginacion.classList.add(`Paginacion-${Doctor}`);
      divDoctor.appendChild(divContDoctor);
      divDoctor.appendChild(Paginacion);
      CitasHoy.appendChild(divDoctor);

      $(`.Paginacion-${Doctor}`).twbsPagination({
        totalPages: Math.ceil(Doctores[Doctor].length / elementosPorPagina),
        visiblePages: 5,
        first: "Primero",
        next: ">",
        prev: "<",
        last: "Ultimo",
        onPageClick: function (event, page) {
          const startIndex = (page - 1) * elementosPorPagina;
          const endIndex = startIndex + elementosPorPagina;
          mostrarElementos(Doctores[Doctor].slice(startIndex, endIndex));
        },
      });
    }

    CitasHoy.addEventListener("click", function (event) {
      const pacienteElement = event.target.closest(".Paciente");
      if (pacienteElement && pacienteElement.classList.contains("Paciente")) {
        window.location.href = "/InfoPaciente/" + pacienteElement.id;
      }
    });
  } else {
    const NoCitas = document.createElement("h2");
    NoCitas.textContent = "No hay mas citas para hoy.";
    CitasHoy.appendChild(NoCitas);
  }
}

//==================================================================================================
// Funcion para mostrar los pacientes Pedidos
//==================================================================================================

function PacientesPedidos(datos) {
  const PacientesPedidosDiv = document.querySelector(".Pedidos");
  if (PacientesPedidosDiv) {
    PacientesPedidosDiv.innerHTML = "";
    if (datos.length != 0) {
      datos.forEach((Paciente) => {
        const ElementoPaciente = document.createElement("div");
        ElementoPaciente.classList.add("Paciente", "Asignar");
        ElementoPaciente.id = Paciente.idPaciente;

        const InfoPedido = document.createElement("div");
        InfoPedido.classList.add("InfoPedido");

        const rutaRelativaPaciente = Paciente.RutaFotoP
          ? getPacientePath(Paciente.RutaFotoP, "/public")
          : "/img/UserIco.webp";

        const rutaRelativaDoctor = Paciente.RutaFotoD
          ? getPacientePath(Paciente.RutaFotoD, "/public")
          : "/img/UserIco.webp";

        // Sección de información del paciente
        const PacientePedido = document.createElement("div");
        PacientePedido.classList.add("PacientePedido");
        PacientePedido.appendChild(
          createHeader(
            rutaRelativaPaciente,
            Paciente.NombreP,
            Paciente.ApellidoP
          )
        );
        createInfoSection(
          [{ TituloInfo: "Cita", SourceInfo: Paciente.HoraCita }],
          PacientePedido
        );
        InfoPedido.appendChild(PacientePedido);

        // Sección de información del doctor
        const DrPedido = document.createElement("div");
        DrPedido.classList.add("DrPedido");
        DrPedido.appendChild(
          createHeader(rutaRelativaDoctor, Paciente.NombreD, Paciente.ApellidoD)
        );
        createInfoSection(
          [{ TituloInfo: "Consultorio", SourceInfo: Paciente.Cosultorio }],
          DrPedido
        );
        InfoPedido.appendChild(DrPedido);

        // Botones de acción
        const ContenedorBotones = document.createElement("div");
        ContenedorBotones.classList.add("BotonesDeAccion");
        const Boton = document.createElement("button");
        Boton.classList.add("BotonPedir");
        Boton.textContent = "Descartar";
        Boton.addEventListener("click", function (event) {
          console.log("Informacion del Paciente Clickado:");
          console.log(Paciente);
          socket.emit("Descartar_P_Pedido", {
            idCita: Paciente.idCitas,
          });
          event.stopPropagation();
        });
        ContenedorBotones.appendChild(Boton);
        ElementoPaciente.appendChild(InfoPedido);
        ElementoPaciente.appendChild(ContenedorBotones);
        PacientesPedidosDiv.appendChild(ElementoPaciente);
      });
    } else {
      const NoCitas = document.createElement("h2");
      NoCitas.textContent = "No hay pacientes pedidos.";
      PacientesPedidosDiv.appendChild(NoCitas);
    }
  }
}

//==================================================================================================
// Funcion para mostrar los pacientes Finalizados
//==================================================================================================

function PacientesFinalizados(datos) {
  const elementosPorPagina = 3; // Número de elementos por página

  // Vaciar el contenido anterior en el contenedor "PacientesFinalizados"
  const PacientesFinalizados = document.querySelector(".PacientesFinalizados");
  PacientesFinalizados.innerHTML = "";

  function mostrarElementos(elementos) {
    PacientesFinalizados.innerHTML = "";
    elementos.forEach((Paciente) => {
      const ElementoPaciente = document.createElement("div");
      ElementoPaciente.classList.add("Paciente", "Checkout");
      ElementoPaciente.id = Paciente.idPaciente;

      const rutaRelativa = Paciente.RutaFoto
        ? getPacientePath(Paciente.RutaFoto, "/public")
        : "/img/UserIco.webp";
      const HeaderPaciente = createHeader(
        rutaRelativa,
        Paciente.NombresPacientes,
        Paciente.ApellidosPacientes
      );
      ElementoPaciente.appendChild(HeaderPaciente);

      const InfoLlegadaPaciente = [
        { TituloInfo: "Hora Cita", SourceInfo: Paciente.HoraCita || "N/A" },
        // Agrega aquí más información si es necesario
      ];
      createInfoSection(InfoLlegadaPaciente, HeaderPaciente);

      const InfoCheckout = document.createElement("div");
      InfoCheckout.classList.add("InfoCheckout");
      const textCheckout = document.createElement("span");
      textCheckout.classList.add("textCheckout");
      textCheckout.textContent = Paciente.CheckOut;

      InfoCheckout.appendChild(textCheckout);
      ElementoPaciente.appendChild(InfoCheckout);

      PacientesFinalizados.appendChild(ElementoPaciente);
    });
  }

  if (datos.length != 0) {
    // Configura la paginación
    $(".PaginacionPF").twbsPagination({
      totalPages: Math.ceil(datos.length / elementosPorPagina),
      visiblePages: 5, // Cambia esto según tus necesidades
      first: "Primero",
      next: ">",
      prev: "<",
      last: "Ultimo",
      onPageClick: function (event, page) {
        // Calcula el índice de inicio y fin para la página actual
        const startIndex = (page - 1) * elementosPorPagina;
        const endIndex = startIndex + elementosPorPagina;

        // Filtra los datos para mostrar solo los elementos de la página actual
        const elementosPagina = datos.slice(startIndex, endIndex);

        // Llama a la función para mostrar los elementos de la página actual
        mostrarElementos(elementosPagina);
      },
    });

    PacientesFinalizados.addEventListener("click", function (event) {
      var pacienteElement = event.target.closest(".Paciente");
      if (pacienteElement && pacienteElement.classList.contains("Paciente")) {
        var idPaciente = pacienteElement.id;
        // Pasamos a mostrar la vista del paciente con su info en la URL
        window.location.href = "/InfoPaciente/" + idPaciente;
      }
    });

    // Inicialmente muestra la primera página
    mostrarElementos(datos.slice(0, elementosPorPagina));
  } else {
    const NoCitas = document.createElement("h2");
    NoCitas.textContent = "No hay citas finalizadas.";
    PacientesFinalizados.appendChild(NoCitas);
  }
}

//==================================================================================================
// Peticion de la informacion del dashboard de recepcion
//==================================================================================================
$.ajax({
  url: "/DashboardRecepcion",
  method: "POST",
  dataType: "json",
  success: function (respuesta) {
    PacientesHoy(respuesta.CitasHoy);
    PacientesPedidos(respuesta.PacientesPedidos);
    PacientesFinalizados(respuesta.PacientesCheckout);
  },
  error: function (error) {
    console.error(error);
  },
});

//==================================================================================================
// Funciones para actualizar de manera individual las tablas del Dashboard
//==================================================================================================

function ActualizarCitasHoy() {
  $.ajax({
    url: "/DashboardRecepcion/CitasHoy",
    method: "POST",
    dataType: "json",
    success: function (respuesta) {
      PacientesHoy(respuesta);
    },
    error: function (error) {
      console.error(error);
    },
  });
}

function ActualizarPedidos() {
  $.ajax({
    url: "/DashboardRecepcion/P_Pedidos",
    method: "POST",
    dataType: "json",
    success: function (respuesta) {
      PacientesPedidos(respuesta);
    },
    error: function (error) {
      console.error(error);
    },
  });
}

function ActualizarFinalizados() {
  $.ajax({
    url: "/DashboardRecepcion/P_Checkout",
    method: "POST",
    dataType: "json",
    success: function (respuesta) {
      PacientesFinalizados(respuesta);
    },
    error: function (error) {
      console.error(error);
    },
  });
}

//==================================================================================================
// Funciones para actualizar de manera individual las tablas del Dashboard
//==================================================================================================
$(document).ready(function () {
  $("#Recep_Actualizar_P_Hoy").click(function () {
    ActualizarCitasHoy();
    // Añade la clase para iniciar la animación y el manejador del evento para cuando termine
    $(".CitasHoy").addClass("entrando").on("animationend", function() {
      // Quita la clase si ya no se necesita más la animación
      $(this).removeClass("entrando");  
      // Elimina el manejador del evento para que no se acumulen si el botón se pulsa múltiples veces
      $(this).off("animationend");
    });
  });
  
  $("#Recep_Actualizar_P_Pedidos").click(function () {
    ActualizarPedidos();
    $(".Pedidos").addClass("entrando").on("animationend", function() {
      $(this).removeClass("entrando");  
      $(this).off("animationend");
    });
  });

  $("#Recep_Actualizar_P_Checkout").click(function () {
    ActualizarFinalizados();
    $(".PacientesFinalizados").addClass("entrando").on("animationend", function() {
      $(this).removeClass("entrando");  
      $(this).off("animationend");
    });
  });


});





//==================================================================================================
// Socket's para actualizar el Dashboard
//==================================================================================================
//Citas de Hoy
socket.on("CheckIn", function (data) {
  ActualizarCitasHoy();
});

//Pacientes Pedidos
socket.on("P_Pedidos", function (data) {
  ActualizarPedidos();
  NuevoAudio(2);
});

//Limpiar Pedidos
socket.on("Clean_P_Pedidos", function (data) {
  ActualizarPedidos();
});

//Checkout
socket.on("CheckOut", function (data) {
  ActualizarFinalizados();
  NuevoAudio(3);
});
