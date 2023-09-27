//==================================================================================================
// Pacientes en Espera
//==================================================================================================
function PacientesEnEspera(datos) {
  const elementosPorPagina = 3; // Número de elementos por página

  // Contadores de Pacientes en espera:
  const NumPacientesEspera = document.querySelector(".NumeroPacientesEspera");
  NumPacientesEspera.textContent = datos.length;

  // Vaciar el contenido anterior en el contenedor "PacientesEnEspera"
  const PacientesEspera = document.querySelector(".PacientesEnEspera");
  PacientesEspera.innerHTML = "";

  if (datos.length != 0) {
    // Configura la paginación
    $(".PaginacionEspera").twbsPagination({
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

    // Función para mostrar los elementos de la página actual
    function mostrarElementos(elementos) {
      PacientesEspera.innerHTML = "";

      elementos.forEach((Paciente) => {
        const ElementoPaciente = document.createElement("div");
        if (Paciente.HoraLlegada) {
          if (Paciente.HoraCita >= Paciente.HoraLlegada) {
            ElementoPaciente.classList.add("Paciente", "ATiempo");
          } else {
            ElementoPaciente.classList.add("Paciente", "Tarde");
          }
        } else {
          ElementoPaciente.classList.add("Paciente");
        }
        if (Paciente.StatusPaciente === 3) {
          ElementoPaciente.classList.remove("ATiempo", "Tarde");
          ElementoPaciente.classList.add("Paciente","EnConsulta");
        }
        ElementoPaciente.id = Paciente.idPaciente;

        const HeaderPaciente = document.createElement("div");
        HeaderPaciente.classList.add("HeaderPaciente");

        const ContenedorImagenPaciente = document.createElement("div");
        ContenedorImagenPaciente.classList.add("FotoPaciente");
        const ImagenPaciente = document.createElement("img");

        let rutarelativa = "/img/UserIco.webp"; // Declarar la imagen por defecto fuera del bloque if
        if (Paciente.RutaFoto) {
          // Formato para la ruta de la imagen del paciente
          const relativa = "/public";
          // Encuentra la posición del texto deseado
          const ruta = Paciente.RutaFoto;
          const posicion = ruta.indexOf(relativa);

          if (posicion !== -1) {
            // Usa substring() para obtener los caracteres después de "Ejemplo:"
            rutarelativa = ruta.substring(posicion + relativa.length);

            // Encuentra la última posición de "/" en la cadena rutarelativa
            const ultimaBarra = rutarelativa.lastIndexOf("/");

            // Agrega el texto después de la última barra
            if (ultimaBarra !== -1) {
              const parte1 = rutarelativa.substring(0, ultimaBarra + 1); // Incluye la última barra
              const parte2 = rutarelativa.substring(ultimaBarra + 1); // Lo que sigue después de la última barra
              rutarelativa = parte1 + "Pequeño-" + parte2;
            }
          } else {
            console.log("Texto deseado no encontrado");
          }
        }

        ImagenPaciente.src = rutarelativa;
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
          {
            TituloInfo: "Hora Llegada",
            SourceInfo: Paciente.HoraLlegada || "- -:- -",
          },
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
        Boton.classList.add(
          Paciente.StatusPaciente === 3 ? "BotonFinalizar" : "BotonPedir"
        );
        Boton.textContent =
          Paciente.StatusPaciente === 3 ? "Finalizar" : "Pedir";

        Boton.addEventListener("click", function (event) {
          const action = Paciente.StatusPaciente === 3 ? "Finalizar" : "Pedir";
          const message =
            action === "Finalizar"
              ? `El paciente se está finalizando.`
              : `El paciente que se está pidiendo es: ${Paciente.idPaciente} con el doctor con el id: ${Paciente.idDoctor}`;

          alert(message);
          event.stopPropagation();
        });

        ContenedorBotones.appendChild(Boton);
        ElementoPaciente.appendChild(ContenedorBotones);

        ElementoPaciente.addEventListener("click", function (event) {
          const pacienteElement = event.target.closest(".Paciente");
          if (
            pacienteElement &&
            pacienteElement.classList.contains("Paciente")
          ) {
            const idPaciente = pacienteElement.id;
            // Pasamos a mostrar la vista del paciente con su info en la URL
            window.location.href = "/InfoPaciente/" + idPaciente;
          }
        });

        PacientesEspera.appendChild(ElementoPaciente);
      });
    }

    // Inicialmente muestra la primera página
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
  // Contadores de Pacientes en espera:
  var NumCitasHoy = document.querySelector(".NumeroPacientesCitasHoy");
  NumCitasHoy.textContent = datos.length;

  // Vaciar el contenido anterior en el contenedor "PacientesEspera"
  var CitasHoy = document.querySelector(".PacientesHoy");
  while (CitasHoy.firstChild) {
    CitasHoy.removeChild(CitasHoy.firstChild);
  }

  if (datos.length != 0) {
    // Número de elementos por página
    var elementosPorPagina = 3;

    // Configura la paginación
    $(".PaginacionHoy").twbsPagination({
      totalPages: Math.ceil(datos.length / elementosPorPagina),
      visiblePages: 5, // Cambia esto según tus necesidades
      first: "Primero",
      next: ">",
      prev: "<",
      last: "Ultimo",
      onPageClick: function (event, page) {
        // Calcula el índice de inicio y fin para la página actual
        var startIndex = (page - 1) * elementosPorPagina;
        var endIndex = startIndex + elementosPorPagina;

        // Filtra los datos para mostrar solo los elementos de la página actual
        var elementosPagina = datos.slice(startIndex, endIndex);

        // Llama a la función para mostrar los elementos de la página actual
        mostrarElementos(elementosPagina);
      },
    });

    // Función para mostrar los elementos de la página actual
    function mostrarElementos(elementos) {
      CitasHoy.innerHTML = "";

      elementos.forEach((Paciente) => {
        var ElementoPaciente = document.createElement("div");
        ElementoPaciente.classList.add("Paciente");
        ElementoPaciente.id = Paciente.idPaciente;

        var HeaderPaciente = document.createElement("div");
        HeaderPaciente.classList.add("HeaderPaciente");

        var ContenedorImagenPaciente = document.createElement("div");
        ContenedorImagenPaciente.classList.add("FotoPaciente");
        var ImagenPaciente = document.createElement("img");

        let rutarelativa = "/img/UserIco.webp"; // Declarar la imagen por defecto fuera del bloque if
        if (Paciente.RutaFoto) {
          // Formato para la ruta de la imagen del paciente
          const relativa = "/public";
          // Encuentra la posición del texto deseado
          const ruta = Paciente.RutaFoto;
          const posicion = ruta.indexOf(relativa);

          if (posicion !== -1) {
            // Usa substring() para obtener los caracteres después de "Ejemplo:"
            rutarelativa = ruta.substring(posicion + relativa.length);

            // Encuentra la última posición de "/" en la cadena rutarelativa
            const ultimaBarra = rutarelativa.lastIndexOf("/");

            // Agrega el texto después de la última barra
            if (ultimaBarra !== -1) {
              const parte1 = rutarelativa.substring(0, ultimaBarra + 1); // Incluye la última barra
              const parte2 = rutarelativa.substring(ultimaBarra + 1); // Lo que sigue después de la última barra
              rutarelativa = parte1 + "Pequeño-" + parte2;
            }
          } else {
            console.log("Texto deseado no encontrado");
          }
        }

        ImagenPaciente.src = rutarelativa;
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
          // Agrega aquí más información si es necesario
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
    }
    CitasHoy.addEventListener("click", function (event) {
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
  const elementosPorPagina = 3; // Número de elementos por página

  // Contadores de Pacientes en espera:
  const NumOtrosConsultorios = document.querySelector(
    ".NumeroOtrosConsultorios"
  );
  NumOtrosConsultorios.textContent = datos.length;

  // Vaciar el contenido anterior en el contenedor "ContenidoOtrosConsultorios"
  const ContenidoOtrosConsultorios = document.querySelector(
    ".ContenidoOtrosConsultorios"
  );
  ContenidoOtrosConsultorios.innerHTML = "";

  if (datos.length != 0) {
    // Configura la paginación
    $(".PaginacionOtros").twbsPagination({
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

    // Función para mostrar los elementos de la página actual
    function mostrarElementos(elementos) {
      ContenidoOtrosConsultorios.innerHTML = "";

      elementos.forEach((Paciente) => {
        const ElementoPaciente = document.createElement("div");

          if (Paciente.idStatusPaciente === 2) {
            ElementoPaciente.classList.add("Paciente", "Pedir");
          } else {
            ElementoPaciente.classList.add("Paciente", "Ver");
          }
        
        ElementoPaciente.id = Paciente.idPaciente;

        const HeaderPaciente = document.createElement("div");
        HeaderPaciente.classList.add("HeaderPaciente");

        const ContenedorImagenPaciente = document.createElement("div");
        ContenedorImagenPaciente.classList.add("FotoPaciente");
        const ImagenPaciente = document.createElement("img");

        let rutarelativa = "/img/UserIco.webp"; // Declarar la imagen por defecto fuera del bloque if
        if (Paciente.RutaFoto) {
          // Formato para la ruta de la imagen del paciente
          const relativa = "/public";
          // Encuentra la posición del texto deseado
          const ruta = Paciente.RutaFoto;
          const posicion = ruta.indexOf(relativa);

          if (posicion !== -1) {
            // Usa substring() para obtener los caracteres después de "Ejemplo:"
            rutarelativa = ruta.substring(posicion + relativa.length);

            // Encuentra la última posición de "/" en la cadena rutarelativa
            const ultimaBarra = rutarelativa.lastIndexOf("/");

            // Agrega el texto después de la última barra
            if (ultimaBarra !== -1) {
              const parte1 = rutarelativa.substring(0, ultimaBarra + 1); // Incluye la última barra
              const parte2 = rutarelativa.substring(ultimaBarra + 1); // Lo que sigue después de la última barra
              rutarelativa = parte1 + "Pequeño-" + parte2;
            }
          } else {
            console.log("Texto deseado no encontrado");
          }
        }

        ImagenPaciente.src = rutarelativa;
        ContenedorImagenPaciente.appendChild(ImagenPaciente);

        const HeaderInfoPaciente = document.createElement("div");
        HeaderInfoPaciente.classList.add("HeaderInfoPaciente");

        const NombrePaciente = document.createElement("div");
        NombrePaciente.classList.add("NombrePaciente");
        NombrePaciente.textContent = Paciente.Nombres;

        const ApellidosPaciente = document.createElement("div");
        ApellidosPaciente.classList.add("ApellidosPaciente");
        ApellidosPaciente.textContent = Paciente.Apellidos;

        HeaderInfoPaciente.appendChild(NombrePaciente);
        HeaderInfoPaciente.appendChild(ApellidosPaciente);

        HeaderPaciente.appendChild(ContenedorImagenPaciente);
        HeaderPaciente.appendChild(HeaderInfoPaciente);

        ElementoPaciente.appendChild(HeaderPaciente);

        let InfoLlegadaPaciente = [
          { TituloInfo: "Hora Cita", SourceInfo: Paciente.HoraCita },
          { TituloInfo: "Doctor", SourceInfo: Paciente.NombreDoctor },
          { TituloInfo: "Consultorio", SourceInfo: Paciente.Consultorio ||"-"},
          // Agrega aquí más información si es necesario
        ];
        // Si esta en espera no muestra la info de consultorio
        if (Paciente.idStatusPaciente === 2) {
          InfoLlegadaPaciente.pop();
        }
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

        if (Paciente.idStatusPaciente === 2) {
          const ContenedorBotones = document.createElement("div");
          ContenedorBotones.classList.add("BotonesDeAccion");

          const Boton = document.createElement("button");
          Boton.classList.add("BotonPedir");
          Boton.textContent = "Pedir";

          Boton.addEventListener("click", function (event) {
            const message = `El paciente que se está pidiendo es: ${Paciente.idPaciente} con el doctor con el id: ${Paciente.idDoctor}`;
            alert(message);
            event.stopPropagation();
          });

          ContenedorBotones.appendChild(Boton);
          ElementoPaciente.appendChild(ContenedorBotones);
        }

        ContenidoOtrosConsultorios.appendChild(ElementoPaciente);
      });
    }
    ContenidoOtrosConsultorios.addEventListener("click", function (event) {
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
  const elementosPorPagina = 3; // Número de elementos por página

  // Contadores de Citas Finalizadas:
  const NumCitasFinalizadas = document.querySelector(".NumeroCitasFinalizadas");
  NumCitasFinalizadas.textContent = datos.length;

  // Vaciar el contenido anterior en el contenedor "ContenidoCitasFinalizadas"
  const ContenidoCitasFinalizadas = document.querySelector(
    ".ContenidoCitasFinalizadas"
  );
  ContenidoCitasFinalizadas.innerHTML = "";

  if (datos.length != 0) {
    // Configura la paginación
    $(".PaginacionCF").twbsPagination({
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

    // Función para mostrar los elementos de la página actual
    function mostrarElementos(elementos) {
    ContenidoCitasFinalizadas.innerHTML = "";

    elementos.forEach((Paciente) => {
      var ElementoPaciente = document.createElement("div");
      ElementoPaciente.classList.add("Paciente","CitasFin");
      ElementoPaciente.id = Paciente.idPaciente;

      var HeaderPaciente = document.createElement("div");
      HeaderPaciente.classList.add("HeaderPaciente");

      var ContenedorImagenPaciente = document.createElement("div");
      ContenedorImagenPaciente.classList.add("FotoPaciente");
      var ImagenPaciente = document.createElement("img");

      let rutarelativa = "/img/UserIco.webp"; // Declarar la imagen por defecto fuera del bloque if
      if (Paciente.RutaFoto) {
        // Formato para la ruta de la imagen del paciente
        const relativa = "/public";
        // Encuentra la posición del texto deseado
        const ruta = Paciente.RutaFoto;
        const posicion = ruta.indexOf(relativa);

        if (posicion !== -1) {
          // Usa substring() para obtener los caracteres después de "Ejemplo:"
          rutarelativa = ruta.substring(posicion + relativa.length);

          // Encuentra la última posición de "/" en la cadena rutarelativa
          const ultimaBarra = rutarelativa.lastIndexOf("/");

          // Agrega el texto después de la última barra
          if (ultimaBarra !== -1) {
            const parte1 = rutarelativa.substring(0, ultimaBarra + 1); // Incluye la última barra
            const parte2 = rutarelativa.substring(ultimaBarra + 1); // Lo que sigue después de la última barra
            rutarelativa = parte1 + "Pequeño-" + parte2;
          }
        } else {
          console.log("Texto deseado no encontrado");
        }
      }

      ImagenPaciente.src = rutarelativa;
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
        // Agrega aquí más información si es necesario
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

      const ContenedorBotones = document.createElement("div");
      ContenedorBotones.classList.add("BotonesDeAccion");

      const Boton = document.createElement("button");
      Boton.classList.add("BotonFinalizar");
      Boton.textContent = "Editar CheckOut";

      Boton.addEventListener("click", function (event) {
        const message = `El paciente a editar su checkout es: ${Paciente.idPaciente} con el doctor con el id: ${Paciente.idDoctor}`;
        alert(message);
        event.stopPropagation();
      });

      ContenedorBotones.appendChild(Boton);
      ElementoPaciente.appendChild(ContenedorBotones);
      ContenidoCitasFinalizadas.appendChild(ElementoPaciente);
    });
  }
  ContenidoCitasFinalizadas.addEventListener("click", function (event) {
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
    NoCitas.classList.add("NoPacientes");
    ContenidoCitasFinalizadas.appendChild(NoCitas);
  }
}

//==================================================================================================
// Realizar la carga de datos y asignacion obtenidos del servidor
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

// Sonidos
function NuevoPacienteAudio() {
  const audio = new Audio("/private/sounds/Bing.mp3");
  audio.play().catch(function (error) {
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
