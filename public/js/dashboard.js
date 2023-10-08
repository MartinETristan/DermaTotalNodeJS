//==================================================================================================
// Funciones Auxiliares
//==================================================================================================
// Funcion para crear el Header
function createHeader(imageSrc, name, lastname) {
  const HeaderPaciente = document.createElement("div");
  HeaderPaciente.classList.add("HeaderPaciente");

  const ContenedorImagenPaciente = document.createElement("div");
  ContenedorImagenPaciente.classList.add("FotoPaciente");

  const ImagenPaciente = document.createElement("img");
  ImagenPaciente.src = imageSrc;
  ContenedorImagenPaciente.appendChild(ImagenPaciente);

  const HeaderInfoPaciente = document.createElement("div");
  HeaderInfoPaciente.classList.add("HeaderInfoPaciente");

  const NombrePaciente = document.createElement("div");
  NombrePaciente.classList.add("NombrePaciente");
  NombrePaciente.textContent = name;

  const ApellidosPaciente = document.createElement("div");
  ApellidosPaciente.classList.add("ApellidosPaciente");
  ApellidosPaciente.textContent = lastname;

  HeaderInfoPaciente.appendChild(NombrePaciente);
  HeaderInfoPaciente.appendChild(ApellidosPaciente);
  HeaderPaciente.appendChild(ContenedorImagenPaciente);
  HeaderPaciente.appendChild(HeaderInfoPaciente);

  return HeaderPaciente;
}

// Funcion para obtener la ruta de la imagen del paciente
function getPacientePath(ruta, relativa) {
  const posicion = ruta.indexOf(relativa);
  if (posicion !== -1) {
    let rutaRelativa = ruta.substring(posicion + relativa.length);
    const ultimaBarra = rutaRelativa.lastIndexOf("/");
    if (ultimaBarra !== -1) {
      return (
        rutaRelativa.substring(0, ultimaBarra + 1) +
        "Pequeño-" +
        rutaRelativa.substring(ultimaBarra + 1)
      );
    }
    return rutaRelativa;
  }
  console.log("Texto deseado no encontrado");
  return "/img/UserIco.webp";
}

// Funcion para crear la seccion de informacion
function createInfoSection(infoArr, parentDiv) {
  infoArr.forEach((Info) => {
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

    parentDiv.appendChild(CitaInfo);
  });
}

// Funcion para crear botones que cambian de color dependiendo del estado del paciente
function CrearBotonDeAccion(Paciente) {
  const Boton = document.createElement("button");
  Boton.classList.add(
    Paciente.StatusPaciente === 3 ? "BotonFinalizar" : "BotonPedir"
  );
  Boton.textContent = Paciente.StatusPaciente === 3 ? "Finalizar" : "Pedir";
  return Boton;
}

//==================================================================================================
// Funcion para pedir paciente
//==================================================================================================

// Se tiene que pedir la Ruta de foto de perfil, Nombre y Apellidos del paciente, Hora cita y Procedimiento
function Accion_Paciente(datos) {
  // Cambiar el contenido de el titulo con base al protocolo
  const titulo = document.getElementById("TituloOpciones");
  const protocoloTitulo = {
    Pedir: "Pedir Paciente",
    Finalizar: "Finalizar Paciente",
    Asignar: "Asignar Paciente",
    CheckIn: "Confirmar CheckIn",
    UpdateFinalizar: "Actualizar CheckOut",
  };
  titulo.textContent =
    protocoloTitulo[datos.Protocolo] || "No se eligió un protocolo válido";

  //Definimos el mensaje descriptivo de las acciones que se pueden realizar
  const mensaje = document.getElementById("MensajeOpciones");
  const protocoloMensajes = {
    Pedir: `Estas a punto de pedir a ${datos.Nombre} para realizarle una ${datos.Procedimiento}.`,
    Finalizar: `Este es el checkout de ${datos.Nombre} por la ${datos.Procedimiento} (de requerirse, por favor indica cargos adicionales).`,
    Asignar: `Estas a punto de asignar a ${datos.NombreP} a un consultorio con ${datos.NombreD} para su cita de las ${datos.HoraCita}.`,
    CheckIn: `Confirmacion de asistencia de ${datos.Nombre}. ¿Quieres confirmar su asistencia?`,
    UpdateFinalizar: `Actualiza el Checkout de ${datos.Nombre} por la ${datos.Procedimiento} (de requerirse, por favor indica cargos adicionales).`,
  };
  mensaje.textContent =
    protocoloMensajes[datos.Protocolo] || "No se eligió un protocolo válido";

  // Y hacemos la evaluacion de la Sucursal para saber que array mostrar en el select
  let ConsultoriosSucursal = [];

  // Recorre la matriz
  for (const arr of Consultorios) {
    // Filtra los elementos que coincidan con el idSucursal deseado
    const consultoriosFiltrados = arr.filter(
      (consultorio) => consultorio.idSucursal === datos.idSucursal
    );

    // Agrega los consultorios filtrados al array ConsultoriosSucursal
    ConsultoriosSucursal = ConsultoriosSucursal.concat(consultoriosFiltrados);
  }

  // Mostrar el contenedor de las opciones
  const contenedor = document.getElementById("Cont_Opciones");
  contenedor.style.visibility = "visible";
  contenedor.style.opacity = "1";
  // Vaciar el contenido anterior en el contenedor "InfoOpciones"
  var InfoOpciones = document.querySelector(".InfoOpciones");
  InfoOpciones.innerHTML = "";

  var ElementoPaciente = document.createElement("div");
  ElementoPaciente.classList.add("Paciente", "Opciones");

  var HeaderPaciente = document.createElement("div");
  HeaderPaciente.classList.add("HeaderPaciente");

  var ContenedorImagenPaciente = document.createElement("div");
  ContenedorImagenPaciente.classList.add("FotoPaciente");
  var ImagenPaciente = document.createElement("img");

  ContenedorImagenPaciente.appendChild(ImagenPaciente);

  var HeaderInfoPaciente = document.createElement("div");
  HeaderInfoPaciente.classList.add("HeaderInfoPaciente");

  var NombrePaciente = document.createElement("div");
  NombrePaciente.classList.add("NombrePaciente");

  var ApellidosPaciente = document.createElement("div");
  ApellidosPaciente.classList.add("ApellidosPaciente");

  // Cambiar por datos.Nombre
  NombrePaciente.textContent = datos.Nombre;
  // Cambiar por datos.RutaFoto
  ImagenPaciente.src = datos.RutaFoto;
  // Cambiar por datos.Apellidos
  ApellidosPaciente.textContent = datos.Apellido;
  if (datos.Protocolo === "Asignar") {
    // Cambiar por datos.Nombre
    NombrePaciente.textContent = datos.NombreP;
    // Cambiar por datos.RutaFoto
    ImagenPaciente.src = datos.RutaFotoP;
    // Cambiar por datos.Apellidos
    ApellidosPaciente.textContent = datos.ApellidoP;
  }

  HeaderInfoPaciente.appendChild(NombrePaciente);
  HeaderInfoPaciente.appendChild(ApellidosPaciente);

  HeaderPaciente.appendChild(ContenedorImagenPaciente);
  HeaderPaciente.appendChild(HeaderInfoPaciente);

  ElementoPaciente.appendChild(HeaderPaciente);

  var InfoLlegadaPaciente = [
    { TituloInfo: "Procedimiento", SourceInfo: datos.Procedimiento },
    { TituloInfo: "Hora Cita", SourceInfo: datos.HoraCita },
  ];

  switch (datos.Protocolo) {
    case "Pedir":
      InfoLlegadaPaciente.push({
        TituloInfo: "Consultorio",
        SourceInfo: ConsultoriosSucursal,
      });
      break;

    case "Finalizar":
      InfoLlegadaPaciente.push({
        TituloInfo: "Consultorio",
        SourceInfo: datos.Consultorio || "- -",
      });
      break;

    case "CheckIn":
      InfoLlegadaPaciente.push({
        TituloInfo: "Doctor",
        SourceInfo: datos.Doctor,
      });
      break;

    case "Asignar":
      InfoLlegadaPaciente.pop();
      InfoLlegadaPaciente.push({
        TituloInfo: "Doctor",
        SourceInfo: datos.NombreD,
      });
      InfoLlegadaPaciente.push({
        TituloInfo: "Consultorio Pedido",
        SourceInfo: datos.Consultorio || "- -",
      });
      InfoLlegadaPaciente.push({
        TituloInfo: "Consultorio Asignado",
        SourceInfo: ConsultoriosSucursal,
      });
      console.log(ConsultoriosSucursal);
      break;

    case "UpdateFinalizar":
      InfoLlegadaPaciente.push({
        TituloInfo: "Consultorio",
        SourceInfo: datos.Consultorio || "- -",
      });
      break;

    default:
      console.log("No se eligió un protocolo válido");
  }

  console.log("Datos pasados a la funcion");
  console.log(datos);

  InfoLlegadaPaciente.forEach((Info) => {
    var CitaInfo = document.createElement("div");
    CitaInfo.classList.add("CitaInfo");

    var TituloInfoPaciente = document.createElement("span");
    TituloInfoPaciente.classList.add("TituloInfoCita");
    TituloInfoPaciente.textContent = Info.TituloInfo;

    var DatoInfoPaciente = document.createElement("span");
    DatoInfoPaciente.classList.add("DatoInfoCita");

    if (Array.isArray(Info.SourceInfo)) {
      // Si SourceInfo es un array, crea una lista desplegable
      var select = document.createElement("select");
      select.classList.add("SelectConsultorios");
      select.id = "SelectConsultorios";
      Info.SourceInfo.forEach((opcion) => {
        var option = document.createElement("option");
        option.value = opcion.idConsultorio;
        option.text = opcion.NombreConsultorio;
        select.appendChild(option);
      });

      DatoInfoPaciente.appendChild(select);
    } else {
      // Si SourceInfo no es un array, muestra el valor directamente
      DatoInfoPaciente.textContent = Info.SourceInfo;
    }

    CitaInfo.appendChild(TituloInfoPaciente);
    CitaInfo.appendChild(DatoInfoPaciente);

    ElementoPaciente.appendChild(CitaInfo);
  });

  const Opciones = document.getElementById("Opciones");

  // Si ya existen los botones, eliminarlos
  const contenedorBotonesExistente = document.querySelector(".BotonesOpciones");
  if (contenedorBotonesExistente) {
    Opciones.removeChild(contenedorBotonesExistente);
  }

  // Creación de los botones de aceptar y cancelar
  const contenedorBotones = document.createElement("div");
  contenedorBotones.classList.add("BotonesOpciones");

  // Crear el botón de Cancelar
  const botonCancelar = document.createElement("button");
  botonCancelar.classList.add("CancelarOpciones");
  botonCancelar.textContent = "Cancelar";

  // Crear el botón de Aceptar
  const botonAceptar = document.createElement("button");
  botonAceptar.classList.add("AceptarOpciones");
  botonAceptar.textContent = "Aceptar";

  // Agregar los botones al contenedor
  contenedorBotones.appendChild(botonCancelar);
  contenedorBotones.appendChild(botonAceptar);

  // Acciones de los botones de aceptar y cancelar
  botonCancelar.addEventListener("click", function (event) {
    contenedor.style.visibility = "hidden";
    contenedor.style.opacity = "0";
    event.stopPropagation();
  });

  botonAceptar.addEventListener("click", function (event) {
    // Aqui van las acciones para cuado se de en aceptar
    switch (datos.Protocolo) {
      case "Pedir":
        // Asi se obtiene el valor del consultorio elegido
        var idConsultorio = document.getElementById("SelectConsultorios").value;
        console.log(idConsultorio);
        socket.emit("PedirPaciente", {
          Cita: datos.idCita,
          idConsultorio: idConsultorio,
        });
        // Y limpiamos la vista
        contenedor.style.visibility = "hidden";
        contenedor.style.opacity = "0";
        break;
      case "Finalizar":
        // Asi se obtiene el valor del checkout
        var valorCheckout = document.getElementById("valorCheckout").value;
        console.log(valorCheckout);
        // Y limpiamos la vista
        contenedor.style.visibility = "hidden";
        contenedor.style.opacity = "0";
        break;
      case "CheckIn":
        // Mandamos el Socket para cambiar el estado del paciente y notificar a los doctores
        socket.emit("CambioEstadoPaciente", {
          Cita: datos.idCita,
          idStatus: 1,
          Doctor: datos.idDoctor,
        });
        // Y limpiamos la vista
        contenedor.style.visibility = "hidden";
        contenedor.style.opacity = "0";
        break;
      case "Asignar":
        // Asi se obtiene el valor del consultorio elegido
        var idConsultorio = document.getElementById("SelectConsultorios").value;
        console.log(idConsultorio);
        // Y limpiamos la vista
        contenedor.style.visibility = "hidden";
        contenedor.style.opacity = "0";
        break;
      case "UpdateFinalizar":
        // Asi se obtiene el valor del checkout
        var valorCheckout = document.getElementById("valorCheckout").value;
        console.log("Se actualizó el checkout de", datos.Nombre, "a:");
        console.log(valorCheckout);
        // Y limpiamos la vista
        contenedor.style.visibility = "hidden";
        contenedor.style.opacity = "0";
        break;
      default:
        console.log("No se eligió un protocolo válido");
        break;
    }
  });
  Opciones.appendChild(contenedorBotones);
  InfoOpciones.appendChild(ElementoPaciente);

  // En caso de que se haya pasado una nota, la muestra en la parte de abajo antes de los botones
  if (datos.Nota) {
    var Nota = document.createElement("p");
    Nota.classList.add("NotaOpciones");
    Nota.textContent = `Nota: ${datos.Nota}`;
    InfoOpciones.appendChild(Nota);
  }

  if (
    datos.Protocolo === "Finalizar" ||
    datos.Protocolo === "UpdateFinalizar"
  ) {
    var TituloCheckout = document.createElement("h2");
    TituloCheckout.classList.add("TituloCheckout");
    TituloCheckout.textContent = `Checkout de ${datos.Nombre}:`;
    InfoOpciones.appendChild(TituloCheckout);

    var PrecioProcedimiento = document.createElement("p");
    PrecioProcedimiento.classList.add("PrecioProcedimiento");
    PrecioProcedimiento.textContent = `Costo de ${datos.Procedimiento} sugerido: $${datos.PrecioSugerido}`;
    InfoOpciones.appendChild(PrecioProcedimiento);

    var Checkout = document.createElement("input");
    Checkout.setAttribute("id", "valorCheckout");
    Checkout.value = datos.CheckOut || "";
    InfoOpciones.appendChild(Checkout);
  }
}

//==================================================================================================
// Consulta AJAX para pedir informacion del sistema para llenado de datos (En este caso, consultorios)
//==================================================================================================
let Consultorios = [];

//Aqui pedimos la info para asignar los consultorios disponibles
$.ajax({
  url: "/InfoRegistros",
  method: "POST",
  dataType: "json",
  success: function (respuesta) {
    //Asignamos los consultorios en la variable Consultorios
    Consultorios.push(respuesta.Consultorios);
  },
  error: function (error) {
    console.error(error);
  },
});

// Sonidos
function NuevoAudio(pista) {
  switch (pista) {
    case 1:
      const audio1 = new Audio("/private/sounds/Bing.mp3");
      audio1.play().catch(function (error) {
        // Manejar la excepción y mostrar un mensaje al usuario
        console.log("No se pudo reproducir el sonido: " + error.message);
      });
      break;
    case 2:
      const audio2 = new Audio("/private/sounds/Default.mp3");
      audio2.play().catch(function (error) {
        // Manejar la excepción y mostrar un mensaje al usuario
        console.log("No se pudo reproducir el sonido: " + error.message);
      });
      break;
    case 3:
      const audio3 = new Audio("/private/sounds/Drop.mp3");
      audio3.play().catch(function (error) {
        // Manejar la excepción y mostrar un mensaje al usuario
        console.log("No se pudo reproducir el sonido: " + error.message);
      });
      break;
    case 4:
      const audio4 = new Audio("/private/sounds/Note.mp3");
      audio4.play().catch(function (error) {
        // Manejar la excepción y mostrar un mensaje al usuario
        console.log("No se pudo reproducir el sonido: " + error.message);
      });
      break;
    default:
      console.log("No se eligió un sonido válido");
      break;
  }
}
