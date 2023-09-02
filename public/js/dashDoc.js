
//==================================================================================================
// Pacientes en Espera
//==================================================================================================
function PacientesEnEspera(datos) {
  const NumPacientesEspera = document.querySelector(".NumeroPacientesEspera");
  NumPacientesEspera.textContent = datos.length;
  const PacientesEspera = document.querySelector(".PacientesEnEspera");
  PacientesEspera.innerHTML = '';

  if (datos.length === 0) {
    const NoPacientes = document.createElement("h2");
    NoPacientes.textContent = "No hay pacientes en espera.";
    NoPacientes.classList.add("NoPacientes");
    PacientesEspera.appendChild(NoPacientes);
    return;
  }

  datos.forEach((Paciente) => {
    const ElementoPaciente = document.createElement("div");
    ElementoPaciente.classList.add("Paciente");
    ElementoPaciente.id = Paciente.idPaciente;

    const HeaderPaciente = document.createElement("div");
    HeaderPaciente.classList.add("HeaderPaciente");

    const ContenedorImagenPaciente = document.createElement("div");
    ContenedorImagenPaciente.classList.add("FotoPaciente");
    const ImagenPaciente = document.createElement("img");
    ImagenPaciente.src = Paciente.Foto || "/img/UserIco.webp";
    ContenedorImagenPaciente.appendChild(ImagenPaciente);

    const HeaderInfoPaciente = document.createElement("div");
    HeaderInfoPaciente.classList.add("HeaderInfoPaciente");

    const NombrePaciente = document.createElement("div");
    NombrePaciente.classList.add("NombrePaciente");
    NombrePaciente.textContent = Paciente.NombresPacientes;

    const ApellidosPaciente = document.createElement("div");
    ApellidosPaciente.classList.add("ApellidosPaciente");
    ApellidosPaciente.textContent = Paciente.ApellidosPacientes;

    HeaderInfoPaciente.appendChild(NombrePaciente);
    HeaderInfoPaciente.appendChild(ApellidosPaciente);

    HeaderPaciente.appendChild(ContenedorImagenPaciente);
    HeaderPaciente.appendChild(HeaderInfoPaciente);
    ElementoPaciente.appendChild(HeaderPaciente);

    const InfoLlegadaPaciente = [
      { TituloInfo: "Hora Cita", SourceInfo: Paciente.HoraCita },
      { TituloInfo: "Hora Llegada", SourceInfo: Paciente.HoraLlegada },
    ];

    InfoLlegadaPaciente.forEach((Info) => {
      const CitaInfo = document.createElement("div");
      CitaInfo.classList.add("CitaInfo");

      const TituloInfoPaciente = document.createElement("span");
      TituloInfoPaciente.classList.add("TituloInfoCita");
      TituloInfoPaciente.textContent = Info.TituloInfo;

      const DatoInfoPaciente = document.createElement("span");
      DatoInfoPaciente.classList.add("DatoInfoCita");
      DatoInfoPaciente.textContent = Info.SourceInfo;

      CitaInfo.appendChild(TituloInfoPaciente);
      CitaInfo.appendChild(DatoInfoPaciente);
      ElementoPaciente.appendChild(CitaInfo);
    });

    const ContenedorBotones = document.createElement("div");
    ContenedorBotones.classList.add("BotonesDeAccion");

    const Boton = document.createElement("button");
    Boton.classList.add(Paciente.StatusPaciente === 3 ? "BotonFinalizar" : "BotonPedir");
    Boton.textContent = Paciente.StatusPaciente === 3 ? "Finalizar" : "Pedir";

    Boton.addEventListener("click", function (event) {
      const action = Paciente.StatusPaciente === 3 ? "Finalizar" : "Pedir";
      const message = action === "Finalizar"
        ? `El paciente se está finalizando.`
        : `El paciente que se está pidiendo es: ${Paciente.idPaciente} con el doctor con el id: ${Paciente.idDoctor}`;
      
      alert(message);
      event.stopPropagation();
    });

    ContenedorBotones.appendChild(Boton);
    ElementoPaciente.appendChild(ContenedorBotones);

    ElementoPaciente.addEventListener("click", function (event) {
      const pacienteElement = event.target.closest(".Paciente");
      if (pacienteElement && pacienteElement.classList.contains("Paciente")) {
        const idPaciente = pacienteElement.id;
        alert(idPaciente);
        console.log("El id del paciente seleccionado es:", idPaciente);
      }
    });

    PacientesEspera.appendChild(ElementoPaciente);
  });
}


//==================================================================================================
// Citas del día
//==================================================================================================
function CitasHoy(datos) {
  // Contadores de Pacientes en espera:
  var NumCitasHoy = document.querySelector(".NumeroPacientesCitasHoy");
  NumCitasHoy.textContent = datos.length;
  // Vaciar el contenido anterior en el contenedor "PacientesEspera"
  var CitasHoy = document.querySelector(".PacientesHoy");
  while (CitasHoy.firstChild) {
    CitasHoy.removeChild(CitasHoy.firstChild);
  }
  if (datos.length != 0) {
    datos.forEach((Paciente) => {
      var ElementoPaciente = document.createElement("div");
      ElementoPaciente.classList.add("Paciente");
      ElementoPaciente.id = Paciente.idPaciente;

      var HeaderPaciente = document.createElement("div");
      HeaderPaciente.classList.add("HeaderPaciente");

      var ContenedorImagenPaciente = document.createElement("div");
      ContenedorImagenPaciente.classList.add("FotoPaciente");
      var ImagenPaciente = document.createElement("img");
      if (Paciente.Foto == null) {
        ImagenPaciente.src = "/img/UserIco.webp";
      }else{
        ImagenPaciente.src = Paciente.Foto;
      }
      ContenedorImagenPaciente.appendChild(ImagenPaciente);

      var HeaderInfoPaciente = document.createElement("div");
      HeaderInfoPaciente.classList.add("HeaderInfoPaciente");

      var NombrePaciente = document.createElement("div");
      NombrePaciente.classList.add("NombrePaciente");
      NombrePaciente.textContent = Paciente.NombresPacientes;

      var ApellidosPaciente = document.createElement("div");
      ApellidosPaciente.classList.add("ApellidosPaciente");
      ApellidosPaciente.textContent = Paciente.ApellidosPacientes;

      HeaderInfoPaciente.appendChild(NombrePaciente);
      HeaderInfoPaciente.appendChild(ApellidosPaciente);

      HeaderPaciente.appendChild(ContenedorImagenPaciente);
      HeaderPaciente.appendChild(HeaderInfoPaciente);

      ElementoPaciente.appendChild(HeaderPaciente);

      var InfoLlegadaPaciente = [
        { TituloInfo: "Hora Cita", SourceInfo: Paciente.HoraCita },
      ];

      InfoLlegadaPaciente.forEach((Info) => {
        var CitaInfo = document.createElement("div");
        CitaInfo.classList.add("CitaInfo");

        var TituloInfoPaciente = document.createElement("span");
        TituloInfoPaciente.classList.add("TituloInfoCita");
        TituloInfoPaciente.textContent = Info.TituloInfo;

        var DatoInfoPaciente = document.createElement("span");
        DatoInfoPaciente.classList.add("DatoInfoCita");
        DatoInfoPaciente.textContent = Info.SourceInfo;

        CitaInfo.appendChild(TituloInfoPaciente);
        CitaInfo.appendChild(DatoInfoPaciente);

        ElementoPaciente.appendChild(CitaInfo);
      });

      CitasHoy.appendChild(ElementoPaciente);
    });

    CitasHoy.addEventListener("click", function (event) {
      var pacienteElement = event.target.closest(".Paciente");
      if (pacienteElement && pacienteElement.classList.contains("Paciente")) {
        var idPaciente = pacienteElement.id;
        alert(idPaciente);
        console.log("El id del paciente seleccionado es:", idPaciente);
      }
    });
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
  // Contadores de Pacientes en espera:
  var NumOtrosConsultorios = document.querySelector(".NumeroOtrosConsultorios");
  NumOtrosConsultorios.textContent = datos.length;
  // Vaciar el contenido anterior en el contenedor "PacientesEspera"
  var OtrosConsultorios = document.querySelector(".ContenidoOtrosConsultorios");
  while (OtrosConsultorios.firstChild) {
    OtrosConsultorios.removeChild(OtrosConsultorios.firstChild);
  }
  if (datos.length != 0) {
    for (var i = 0; i < datos.length; i++) {
      var item = document.createElement("li");
      item.textContent ="Paciente: "+
        datos[i].NombresPacientes +
        " | Doctor: " +
        datos[i].NombreDoctor+
        " | HoraCita: " +
        datos[i].HoraCita;
      OtrosConsultorios.appendChild(item);
    }
  } else {
    var NoPacientes = document.createElement("h2");
    NoPacientes.textContent = "Consultorios Libres.";
    NoPacientes.classList.add("NoPacientes");
    OtrosConsultorios.appendChild(NoPacientes);
  }
}

//==================================================================================================
// Citas Finalizadas
//==================================================================================================
function CitasFinalizadas(datos) {
  // Contadores de Pacientes en espera:
  var NumCitasFinalizadas = document.querySelector(".NumeroCitasFinalizadas");
  NumCitasFinalizadas.textContent = datos.length;
  // Vaciar el contenido anterior en el contenedor "PacientesEspera"
  var CitasFinalizadas = document.querySelector(".ContenidoCitasFinalizadas");
  while (CitasFinalizadas.firstChild) {
    CitasFinalizadas.removeChild(CitasFinalizadas.firstChild);
  }
  if (datos.length != 0) {
    for (var i = 0; i < datos.length; i++) {
      var item = document.createElement("li");
      item.textContent =
        datos[i].NombresPacientes +
        " " +
        datos[i].ApellidosPacientes +
        " " +
        datos[i].HoraCita;
      OtrosConsultorios.appendChild(item);
    }
  } else {
    var NoPacientes = document.createElement("h2");
    NoPacientes.textContent = "No hay citas finalizadas.";
    NoPacientes.classList.add("NoPacientes");
    CitasFinalizadas.appendChild(NoPacientes);
  }
}




//==================================================================================================
// Realizar la carga de datos y asignacion obtenidos del servidor
//==================================================================================================
$.ajax({
  url: "/DashboardDoc",
  method: "GET",
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


// Sonidos
function NuevoPacienteAudio() {
  const audio = new Audio("/private/sounds/Bing.mp3");
  audio.play().catch(function(error) {
    // Manejar la excepción y mostrar un mensaje al usuario
    console.log("No se pudo reproducir el sonido: " + error.message);
  });
}


//==================================================================================================
// Socket para actualizar Citas Hoy - Pacientes en Espera
//==================================================================================================
socket.on("Hoy/Espera", function (data) {
  $.ajax({
    url: "/DashboardDoc",
    method: "GET",
    dataType: "json",
    success: function (respuesta) {
      PacientesEnEspera(respuesta.PacientesEspera);
      CitasHoy(respuesta.CitasHoy);
      OtrosConsultorios(respuesta.OtrosConsultorios);
    },
    error: function (error) {
      console.error(error);
    },
  });
  NuevoPacienteAudio();
});

socket.on("OtrosConsultorios", function (data) {
  $.ajax({
    url: "/DashboardDoc",
    method: "GET",
    dataType: "json",
    success: function (respuesta) {
      OtrosConsultorios(respuesta.OtrosConsultorios);
    },
    error: function (error) {
      console.error(error);
    },
  });
});

// Socket para actualizar Citas Hoy- Otros Consultorios





