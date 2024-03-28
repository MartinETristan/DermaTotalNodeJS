// Declarar una variable global para almacenar los datos
let datosAlmacenados = null;
// Guardamos el nombre de Usuario para el Boton de Reiniciar Contraseña
var NombreUsuario = null;
// Informacion de los Selects que hay en el sistema
let InfoSelects = null;
// Informacion de la sesion (la persona que está iniciando sesion)
let InfoSesion = null;

// ========================================================================================================
// Función para realizar la consulta AJAX y almacenar los datos
// ========================================================================================================

async function obtenerDatos() {
  if (datosAlmacenados || InfoSelects) {
    // Si los datos ya están almacenados, simplemente retornamos esos datos
    return datosAlmacenados;
  }

  try {
    // Crear función para la petición de InfoPaciente
    const fetchInfoPaciente = () => {
      return $.ajax({
        url: "/InfoPaciente",
        method: "POST",
        dataType: "json",
      });
    };

    // Crear función para la petición de InfoRegistros
    const fetchInfoRegistros = () => {
      return $.ajax({
        url: "/InfoRegistros",
        type: "POST",
        dataType: "json",
      });
    };

    // Crear función para la petición que obtendrá que tipo de usuario es el que está logueado
    const fetchInfoUsuario = () => {
      return $.ajax({
        url: "/InfoSesion",
        type: "POST",
        dataType: "json",
      });
    };

    // Ejecutar ambas peticiones de manera paralela
    const [dataPaciente, dataRegistros, dataSesion] = await Promise.all([
      fetchInfoPaciente(),
      fetchInfoRegistros(),
      fetchInfoUsuario(),
    ]);

    // Almacenar datos en variables globales
    datosAlmacenados = dataPaciente;
    InfoSelects = dataRegistros;
    InfoSesion = dataSesion;

    // Crear el Header con los datos obtenidos
    HeaderInfoPaciente(dataPaciente);
  } catch (error) {
    console.error(error);
    throw error; // Lanza el error para que pueda ser manejado por quien llame a la función
  }
}

function HeaderInfoPaciente(data) {
  NombreUsuario = data.DatosDT[0].Usuario;
  // Llenamos los campos de la vista con los datos obtenidos
  //Nombre
  const Nombre = document.querySelector(".Nombre");
  const InputNombre = document.getElementById("InputNombre");
  InputNombre.value = data.BasicInfo[0].Nombres || "";
  Nombre.textContent = data.BasicInfo[0].Nombres;

  //Apellido
  const Apellido = document.querySelector(".Apellido");
  const InputApellidoP = document.getElementById("ApellidoP");
  const InputApellidoM = document.getElementById("ApellidoM");
  Apellido.textContent = data.BasicInfo[0].Apellidos;

  // Separamos el apellido en dos partes (por que viene concatenado de la BD)
  const partes = data.BasicInfo[0].Apellidos.split(" ");
  InputApellidoP.value = partes[0] || "";
  InputApellidoM.value = partes[1] || "";

  // Agregamos los eventos para editar el nombre
  agregarEventListener("EditarNombre", function () {
    const cont_InputNombre = document.querySelector(".Cont_InputsNombre");
    const cont_TextNombre = document.querySelector(".Cont_TextNombre");
    cont_InputNombre.style.display = "block";
    cont_TextNombre.style.display = "none";
  });
  // Para cancelar la edicion
  agregarEventListener("botonCancelarNombre", function () {
    const cont_InputNombre = document.querySelector(".Cont_InputsNombre");
    const cont_TextNombre = document.querySelector(".Cont_TextNombre");
    cont_TextNombre.style.display = "flex";
    cont_InputNombre.style.display = "none";
  });

  // Y para guardar los cambios
  agregarEventListener("botonGuardarNombre", function () {
    if (InputNombre.value == null || InputNombre.value == "") {
      alert("No se puede dejar el nombre vacio");
      return;
    }

    // Convertimos el ApellidoP y ApellidoM para quitarle los espacios
    const InputApellidoP_Clean = InputApellidoP.value.replace(/\s/g, "");
    const InputApellidoM_Clean = InputApellidoM.value.replace(/\s/g, "");

    // Datos a enviar en la solicitud Ajax
    var datos = {
      CambiosNombre: [
        { Propiedad: "Nombres", Valor: InputNombre.value, TipoUser: 7 },
        { Propiedad: "ApellidoP", Valor: InputApellidoP_Clean, TipoUser: 7 },
        { Propiedad: "ApellidoM", Valor: InputApellidoM_Clean, TipoUser: 7 },
      ],
    };

    // Petición Ajax a /ActualizarInfoPersonal
    $.ajax({
      url: "/ActualizarInfoPersonal",
      method: "POST",
      contentType: "application/json", // Especificamos el tipo de contenido del cuerpo de la solicitud
      data: JSON.stringify(datos), // Convertimos el objeto a una cadena JSON
      success: function (response) {
        console.log(response); // Manejar la respuesta si la solicitud tiene éxito
      },
      error: function (xhr, status, error) {
        console.error(
          "Error en la petición Ajax en /ActualizarInfoPersonal:",
          error
        );
      },
    });

    // Actualizamos el nombre con los datos del input
    const textoNombre = document.querySelector(".Nombre");
    textoNombre.textContent = InputNombre.value;
    const textoApellido = document.querySelector(".Apellido");
    // Concatenamos los apellidos
    const concatApellidos = InputApellidoP.value + " " + InputApellidoM.value;
    // Y los actualziamos en el texto
    textoApellido.textContent = concatApellidos;

    const cont_InputNombre = document.querySelector(".Cont_InputsNombre");
    const cont_TextNombre = document.querySelector(".Cont_TextNombre");
    cont_TextNombre.style.display = "flex";
    cont_InputNombre.style.display = "none";
  });

  // Edad
  const Edad = document.querySelector(".Edad");
  Edad.textContent = data.BasicInfo[0].Edad;

  //Y alergias
  const Alergias = document.querySelector(".Alergias");
  // Alergias.textContent = "Ninguna";
  const Alerg = document.querySelector(".Alerg");
  if (
    data.Antecedentes[0].Alergias == "ALERGIAS: Negadas" ||
    data.Antecedentes[0].Alergias == null
  ) {
    Alerg.textContent = "ALERGIAS: Negadas";
    Alerg.style.fontSize = "18px";
    Alerg.style.color = " #004368";
    Alerg.style.textDecoration = " none";
  } else {
    Alergias.textContent = data.Antecedentes[0].Alergias.toUpperCase();
  }
  const contenedorAlergias = document.querySelector(".contenedorAlergias");
  // Creamos el boton para editar las alergias
  const botonEditAlerg = document.createElement("button");
  botonEditAlerg.type = "button";
  botonEditAlerg.textContent = "Editar";
  botonEditAlerg.classList.add("botonEditarAlergias");
  botonEditAlerg.id = "editarAlergias";
  // Y seleccionamos el Input para editar las alergias
  const InputAlergias = document.getElementById("inputAlergias");
  InputAlergias.value =
    data.Antecedentes[0].Alergias != "ALERGIAS: Negadas"
      ? data.Antecedentes[0].Alergias
      : "";
  // const Alerg = document.querySelector(".Alerg");
  // Añadimos el boton al contenedor
  contenedorAlergias.appendChild(botonEditAlerg);

  // Agregamos el evento para editar las alergias
  agregarEventListener("editarAlergias", function () {
    editarDato("Alergias");
  });

  // Creamos el contenedor de los botones de guardar y cancelar
  const contAlergias = document.createElement("div");
  contAlergias.id = "contAlergias";
  contAlergias.style.display = "none";

  //Creamos el boton de cancelar
  const botonCancelarAlerg = document.createElement("button");
  botonCancelarAlerg.type = "button";
  botonCancelarAlerg.textContent = "Cancelar";
  botonCancelarAlerg.classList.add("botonCancelarAlergias");
  botonCancelarAlerg.id = "cancelarAlergias";
  contAlergias.appendChild(botonCancelarAlerg);

  //Creamos el boton de guardado
  const botonGuardarAlerg = document.createElement("button");
  botonGuardarAlerg.type = "button";
  botonGuardarAlerg.textContent = "Guardar";
  botonGuardarAlerg.classList.add("botonGuardarAlergias");
  botonGuardarAlerg.id = "confirmarAlergias";
  // Añadimos el boton al contenedor`
  contAlergias.appendChild(botonGuardarAlerg);

  contenedorAlergias.appendChild(contAlergias);

  // Agregamos el evento para guardar las alergias
  agregarEventListener("confirmarAlergias", function () {
    confirmarEdicion("Alergias", " ", 1);
  });

  // Foto de perfil
  const Avatar = document.querySelector(".fotousuario");
  const ruta = data.BasicInfo[0].RutaFoto;
  let rutarelativa = ""; // Declarar la variable fuera del bloque if

  if (ruta) {
    const relativa = "/public";
    // Encuentra la posición del texto deseado
    const posicion = ruta.indexOf(relativa);

    if (posicion !== -1) {
      // Usa substring() para obtener los caracteres después de "Ejemplo:"
      rutarelativa = ruta.substring(posicion + relativa.length);
    } else {
      console.log("Texto deseado no encontrado");
    }
  }
  const nuevaURL = rutarelativa || "/img/UserIco.webp";

  // En caso de error (imagen no encontrada), utiliza la imagen por defecto
  Avatar.onerror = function () {
    Avatar.src = "/img/UserIco.webp";
  };
  Avatar.src = nuevaURL;

  // Activa el Boton para Terminar la Consulta en caso de que haya una consulta activa
  if (data.SesionesActivas.length > 0) {
    const BotonTerminar = document.getElementById("TerminarConsulta");
    BotonTerminar.style.display = "block";

    agregarEventListener("TerminarConsulta", function () {
      // Mostrar el contenedor de las opciones
      const contenedor = document.getElementById("Cont_Opciones");
      contenedor.style.visibility = "visible";
      contenedor.style.opacity = "1";
      const TituloOpciones = document.getElementById("TituloOpciones");
      TituloOpciones.textContent = "Terminar Consulta";
      const MensajeOpciones = document.getElementById("MensajeOpciones");
      MensajeOpciones.textContent = `Este es el checkout de ${datosAlmacenados.BasicInfo[0].Nombres} por la ${datosAlmacenados.SesionesActivas[0].Procedimiento} (de requerirse, por favor indica cargos adicionales).`;

      const Opciones = document.getElementById("Opciones");
      // Limpiamos el contenido anterior
      const InfoOpciones = document.querySelector(".InfoOpciones");
      InfoOpciones.innerHTML = "";

      var Checkout = document.createElement("input");
      Checkout.setAttribute("id", "valorCheckout");
      Checkout.required = true;
      InfoOpciones.appendChild(Checkout);

      if (datosAlmacenados.SesionesActivas[0].Nota) {
        var Nota = document.createElement("p");
        Nota.classList.add("NotaOpciones");
        Nota.textContent = `Nota: ${datosAlmacenados.SesionesActivas[0].Nota}`;
        InfoOpciones.appendChild(Nota);
      }

      // Si ya existen los botones, eliminarlos
      const contenedorBotonesExistente =
        document.querySelector(".BotonesOpciones");
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

      // Aqui van las acciones para cuado se de en aceptar
      botonAceptar.addEventListener("click", function (event) {
        // Verificamos que el campo de checkout no esté vacío
        if (!Checkout.checkValidity()) {
          Checkout.reportValidity();
          return;
        } else {
          console.log("Checkout.value", Checkout.value);
          socket.emit("CambioEstadoPaciente", {
            idCita: datosAlmacenados.SesionesActivas[0].idCita,
            idStatus: 3,
            idSesion: datosAlmacenados.SesionesActivas[0].idSesion,
            Doctor: datosAlmacenados.SesionesActivas[0].idDoctor,
            Asociado: datosAlmacenados.SesionesActivas[0].idAsociado,
            Checkout: Checkout.value,
          });
          //Y mandamos al Dashboard
          window.location.href = "/Dashboard";
        }
      });
      Opciones.appendChild(contenedorBotones);

      console.log("Terminar Consulta", data.SesionesActivas[0]);
    });
  }

  // ========================================================================================================
  // Escuchar el boton para reiniciar la constraseña
  // ========================================================================================================
  agregarEventListener("InfoDTPaciente", function () {
    // Mostrar el contenedor de las opciones
    const contenedor = document.getElementById("Cont_Opciones");
    contenedor.style.visibility = "visible";
    contenedor.style.opacity = "1";
    // Vaciar el contenido anterior en el contenedor "InfoOpciones"
    var InfoOpciones = document.querySelector(".InfoOpciones");
    InfoOpciones.innerHTML = "";
    const TituloOpciones = document.getElementById("TituloOpciones");
    TituloOpciones.textContent = "Datos DermaTotal:";
    const MensajeOpciones = document.getElementById("MensajeOpciones");
    MensajeOpciones.textContent =
      "Esta es informacion y opciones del paciente en DermaTotal";
    InfoOpciones.innerHTML = `  
      <div class="infogroup">
         <div class="info">
           <div class="info__item">
             <div class="info__item__content">
               <header class="info__item__header">
                 <h3 class="info__item__title">Status:</h3>
                 <button class="iconbtn--edit" id="editarStatus"></button>
                 <div style="display:none;" id="contStatus">
                  <button class="iconbtn--cancelar" id="cancelarStatus"></button>
                  <button class="iconbtn--confirm" id="confirmarStatus">Confirmar</button>
                 </div>
               </header>
               <p id="textStatus">${
                 data.DatosDT[0].Status || "Cargando Status..."
               }</p>
               <select name="inputStatus" id="inputStatus" style="display:none;" >
               </select>
             </div>
           </div>
         </div>
         <div class="info">
           <div class="info__item">
             <div class="info__item__content">
               <header class="info__item__header">
                 <h3 class="info__item__title">Usuario:</h3>
                 <button class="iconbtn--passrestart" id="PassRestart">Reinciar Contraseña</button>
                 </header>
                 <p>${data.DatosDT[0].Usuario || "Usuario no disponible"}</p>
             </div>
           </div>
         </div>
         <div class="info">
           <div class="info__widget"></div>
         </div>
         <div class="info">
           <div class="info__item">
             <div class="info__item__content">
               <header class="info__item__header">
                 <h3 class="info__item__title">Alta Por:</h3>
               </header>
               <div class="avatar">
                 <div class="avatar__icon">
                   <img src="/img/UserIco.webp" alt="Nicholas Cage" />
                 </div>
                 <p>
                 ${
                   data.DatosDT[0].AltaPor || "Usuario no disponible"
                 } <span class="avatar__role"> 
                 ${
                   data.DatosDT[0].TipoUsuarioAlta ||
                   "Tipo de usuario no disponible"
                 }</span>
                 </p>
               </div>
             </div>
           </div>
           <div class="info__item">
             <div class="info__item__content">
               <header class="info__item__header">
                 <h3 class="info__item__title">El dia:</h3>
               </header>
               <p>${
                 data.DatosDT[0].FechaAlta || "Cargando fecha de alta..."
               }</p>
             </div>
           </div>
         </div>
         <button id="CerrarOpciones">Cerrar</button>
       </div>`;

    agregarEventListener("editarStatus", function () {
      editarDato("Status");
    });

    agregarEventListener("confirmarStatus", function () {
      confirmarEdicion("Status", "idStatus", 3);
    });

    agregarEventListener("CerrarOpciones", function () {
      contenedor.style.visibility = "hidden";
      contenedor.style.opacity = "0";
    });

    // Llenado para el Status
    const Status = document.getElementById("inputStatus");
    if (Status) {
      InfoSelects.StatusUsuario.forEach((element) => {
        const ListaStat = new Option(element.Status, element.idStatus);
        Status.appendChild(ListaStat);
      });
    } else {
      console.log("No hay status");
    }

    //En caso de que existan botones alternos, los ocultamos
    const BotonesAlternos = document.querySelector(".BotonesOpciones");
    if (BotonesAlternos) {
      BotonesAlternos.style.display = "none";
    }

    // ========================================================================================================
    // Escuchar el boton para reinciiar la constraseña
    // ========================================================================================================
    agregarEventListener("PassRestart", function () {
      // Acciones a realizar cuando se haga clic en el botón
      reiniciarContraseña();
    });
  });
}

function capitalizeFirstLetters(str) {
  return str
    .split(" ")
    .map((word) => {
      return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    })
    .join(" ");
}

//========================================================================================================
// Funciones para la generacion de la vista General.ejs
//========================================================================================================
function generate_info_item_header(title, id_suffix) {
  return `
  <header class="info__item__header">
      <h3 class="info__item__title">${title}:</h3>
      <button class="iconbtn--edit" id="editar${id_suffix}"></button>
      <button class="iconbtn--cancelar" id="cancelar${id_suffix}" style="display:none;"></button>
      <button class="iconbtn--confirm" id="confirmar${id_suffix}" style="display:none;">Confirmar</button>
  </header>
  `;
}

function generate_info_item_content(title, id_suffix, content) {
  const header = generate_info_item_header(title, id_suffix);
  return `
  <div class="info__item__content">
      ${header}
      <p id="text${id_suffix}">${content}</p>
  </div>
  `;
}

function generate_info_item(title, id_suffix, content) {
  const item_content = generate_info_item_content(title, id_suffix, content);
  return `
  <div class="info__item">
      ${item_content}
  </div>
  `;
}

function generate_info(info_items) {
  return `
  <div class="info">
      ${info_items}
  </div>
  `;
}

function generate_infogroup(title, info_contents) {
  return `
  <div class="infogroup ${title.toLowerCase()}">
      <h3>${title.toUpperCase()}:</h3>
      ${info_contents}
  </div>
  `;
}

function generate_region_content(infogroups) {
  return `
  <div class="region__content" id="region__content">
      ${infogroups}
  </div>
  `;
}

// Funcion para dar formato a la fecha
function formatearFecha(fechaOriginal) {
  const fecha = new Date(fechaOriginal);

  // Formatea el día y el mes con 2 dígitos
  const dia2d = ("0" + fecha.getDate()).slice(-2);
  const mes2d = ("0" + (fecha.getMonth() + 1)).slice(-2);

  return {
    dia: fecha.getDate(),
    dia2d: dia2d,
    mes: fecha.getMonth() + 1,
    mes2d: mes2d,
    año: fecha.getFullYear() % 100,
    añofull: fecha.getFullYear(),
  };
}

// Funcion para dar formato a la hora
function formatearHora(hora) {
  const fecha = new Date(hora);
  let horas = fecha.getHours();
  let minutos = fecha.getMinutes();
  const ampm = horas >= 12 ? "pm" : "am";

  horas = horas % 12;
  horas = horas ? horas : 12; // La hora '0' debe ser '12'
  minutos = minutos < 10 ? "0" + minutos : minutos;

  const horaFormateada = horas + ":" + minutos + ampm;
  return horaFormateada;
}

// Funcion para reinciar la contraseña:
function reiniciarContraseña() {
  // Restablecer la contraseña a el nombre de usuario
  var resultado =
    window.confirm(`Al reiniciar la contraseña, el usuario podrá iniciar sesión con su nombre de usuario.
      ¿Deseas Continuar?
    `);
  if (resultado === true) {
    // Hacemos el reinicio
    $.ajax({
      url: "/PassRestart",
      method: "POST",
      contentType: "application/json", // Especificamos el tipo de contenido de la solicitud
      data: JSON.stringify({ usuario: NombreUsuario }),
      success: function(response) {
        // Manejar la respuesta si es necesaria
      },
      error: function(xhr, status, error) {
        console.error("Error en la petición Ajax en /PassRestart:", error);
      }
    });
    
    // Y mostramos la confirmacion Visual
    window.alert("La contraseña de " + NombreUsuario + " cambió con exito.");
  }
}

function getCombinedInputData() {
  const medicamentoInputs = document.querySelectorAll(
    'input[name^="EditMedicamento"]'
  );
  const indicacionInputs = document.querySelectorAll(
    'input[name^="EditIndicacion"]'
  );
  const notaInput = document.querySelector('input[name="EditNota"]');
  const combinedData = [];

  medicamentoInputs.forEach((medicamentoInput) => {
    const idMedicamento_Receta = medicamentoInput.getAttribute(
      "idmedicamento_receta"
    );
    const idMedicamento = medicamentoInput.getAttribute("idmedicamento");
    const idReceta = medicamentoInput.getAttribute("idreceta");
    const Orden = medicamentoInput.getAttribute("orden");

    const indicacionInput = Array.from(indicacionInputs).find(
      (input) => input.getAttribute("idmedicamento") === idMedicamento
    );

    combinedData.push({
      idMedicamento: idMedicamento,
      idMedicamento_Receta: idMedicamento_Receta,
      idReceta: idReceta,
      Medicamento: medicamentoInput.value,
      Indicacion: indicacionInput ? indicacionInput.value : "",
      Nota: notaInput ? notaInput.value : null,
      Orden: Orden,
    });
  });

  return combinedData;
}

// Función para agregar campos de Medicamentos e Indicaciones
function agregarCampos({
  zona,
  NombreInputMedicamento,
  NombreInputIndicacion,
}) {
  // Creamos un contenedor para los campos de Medicamento e Indicación
  const contenedor = document.createElement("div");
  contenedor.classList.add("New");
  const medicamentoInput = document.createElement("input");
  medicamentoInput.type = "text";
  medicamentoInput.name = NombreInputMedicamento;
  medicamentoInput.placeholder = "Medicamento";
  medicamentoInput.required = true;
  medicamentoInput.classList.add("medicamentoreceta");
  contenedor.appendChild(medicamentoInput);

  // Boton para eliminar el par de Medicamento e Indicación
  const botonQuitar = document.createElement("button");
  botonQuitar.type = "button";
  botonQuitar.textContent = "X";
  botonQuitar.classList.add("iconbtn--Eliminar");
  botonQuitar.addEventListener("click", () => {
    const divMedicamentos = botonQuitar.parentNode;
    divMedicamentos.parentNode.removeChild(divMedicamentos);
  });
  contenedor.appendChild(botonQuitar);

  // Boton para crear el par de Medicamento e Indicación
  const botonAñadir = document.createElement("button");
  botonAñadir.type = "button";
  botonAñadir.textContent = "Añadir Campo";
  botonAñadir.classList.add("AñadirMedicamento");
  botonAñadir.addEventListener("click", () => {
    agregarCampos({
      zona: botonAñadir.parentNode,
      NombreInputMedicamento: "Medicamentos",
      NombreInputIndicacion: "Indicaciones",
    });
  });
  contenedor.appendChild(botonAñadir);

  const indicacionInput = document.createElement("input");
  indicacionInput.type = "text";
  indicacionInput.name = NombreInputIndicacion;
  indicacionInput.placeholder = "Indicación";
  indicacionInput.classList.add("indicacionreceta");
  indicacionInput.required = true;
  contenedor.appendChild(indicacionInput);

  console.log("zona", zona);

  
    // const BotonEliminar = document.querySelectorAll("#camposMedicamentos .iconbtn--Eliminar");
    // console.log(BotonEliminar);
  

  zona.insertAdjacentElement("afterend", contenedor);
}

// ========================================================================================================
// Funcion para escuchar los botones
// ========================================================================================================
function agregarEventListener(id, accion) {
  const elemento = document.getElementById(id);
  if (elemento) {
    elemento.addEventListener("click", accion);
  } else {
    console.log(`No se cargó correctamente el botón ${id}`);
  }
}

// ========================================================================================================
// Funcion para confirmar los cambios en las vistas
// ========================================================================================================

function confirmarEdicion(NombredelCampo, NombreEnSistema, Clase) {
  const input = document.getElementById(`input${NombredelCampo}`);
  let valor = input.value == "" ? null : input.value;

  // Mandamos el cambio al sistema dependiendo del tipo de cambio que se realice
  const fetchConfig = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    data: JSON.stringify({
      Propiedad: Clase === 1 ? NombredelCampo : NombreEnSistema,
      Valor: valor,
      TipoUser: Clase === 2 || Clase === 3 ? 7 : undefined,
    }),
  };
  
  const endPoints = {
    1: "/ActualizarAntecedentesPaciente",
    2: "/ActualizarInfoPersonal",
    3: "/ActualizarStatus",
  };
  
  if (endPoints[Clase]) {
    $.ajax({
      url: endPoints[Clase],
      method: "POST",
      contentType: "application/json",
      data: fetchConfig.data,
      success: function(response) {
        // Manejar la respuesta si es necesaria
      },
      error: function(xhr, status, error) {
        console.error("Error en la petición Ajax:", error);
      }
    });
  }

  // Mostramos la vista de antes para salir del modo de edicion
  document.getElementById(`editar${NombredelCampo}`).style.display =
    "inline-block";
  document.getElementById(`cont${NombredelCampo}`).style.display = "none";
  document.getElementById(`input${NombredelCampo}`).style.display = "none";
  // Almacenamos el texto en una variable
  const textElement = document.getElementById(`text${NombredelCampo}`);

  // Y hacemos cambios para casos especificos
  switch (NombredelCampo) {
    case "Sexo":
      textElement.textContent =
        {
          1: "Hombre",
          2: "Mujer",
        }[valor] || "Valor no reconocido";
      break;

    case "Alergias":
      if (!valor) {
        const Alerg = document.querySelector(".Alerg");
        Alerg.style.color = "#004368";
        Alerg.textContent = "ALERGIAS: Negadas";
        Alerg.style.textDecoration = "none";
        Alerg.style.fontSize = "18px";
      } else {
        textElement.style.color = "red";
        textElement.style.fontSize = "24px";
        textElement.textContent = "ALERGIAS: ";

        // Crear el elemento que contendrá la parte subrayada del texto
        var underlineText = document.createElement("span");
        underlineText.textContent = valor.toUpperCase();
        underlineText.style.textDecoration = "underline";

        // Añadir el elemento subrayado al elemento principal
        textElement.appendChild(underlineText);
      }
      break;

    case "Status":
      const statusMap = {
        1: "Activo",
        2: "Inactivo",
        3: "Suspendido",
        4: "Baja",
      };
      textElement.textContent = statusMap[valor] || "No es un status válido";
      break;

    case "FechaDeNac":
      // console.log("fecha");
      const fechaReordenada = reordenarFecha(valor);
      textElement.textContent = fechaReordenada;
      break;
    default:
      textElement.textContent = valor || `No hay ${NombredelCampo} registrado.`;
      break;
  }
  textElement.style.display = "block";
}

function reordenarFecha(fechaOriginal) {
  if (fechaOriginal != null) {
    const partes = fechaOriginal.split("-");

    if (partes.length !== 3) {
      throw new Error("Formato de fecha no válido");
    }

    const año = partes[0];
    const mes = partes[1];
    const dia = partes[2];

    return `${dia}-${mes}-${año}`;
  } else {
    return "--/--/----";
  }
}

function cancelarEdicion(NombredelCampo) {
  // Restablecer la interfaz
  document.getElementById(`editar${NombredelCampo}`).style.display =
    "inline-block";
  document.getElementById(`cont${NombredelCampo}`).style.display = "none";
  document.getElementById(`input${NombredelCampo}`).style.display = "none";
  document.getElementById(`text${NombredelCampo}`).style.display = "block";
}

// ========================================================================================================
// Funciones para realizar cambios en los datos
// ========================================================================================================
function editarDato(NombredelCampo) {
  const botoneditar = document.getElementById(`editar${NombredelCampo}`);
  const botoncancelar = document.getElementById(`cancelar${NombredelCampo}`);
  const contenedor = document.getElementById(`cont${NombredelCampo}`);
  const input = document.getElementById(`input${NombredelCampo}`);
  const texto = document.getElementById(`text${NombredelCampo}`);

  botoneditar.style.display = "none";
  input.style.display = "flex";
  input.style.width = "95%";
  contenedor.style.display = "flex";
  contenedor.style.gap = "25px";
  texto.style.display = "none";

  if (NombredelCampo == "Tel1" || NombredelCampo == "Tel2") {
    input.addEventListener("input", function (e) {
      let value = e.target.value.replace(/\D/g, ""); // Eliminar todos los caracteres no numéricos

      // Formatear número
      if (value.length <= 3) {
        value = value;
      } else if (value.length <= 6) {
        value = "(" + value.substring(0, 3) + ") " + value.substring(3);
      } else {
        value =
          "(" +
          value.substring(0, 3) +
          ") " +
          value.substring(3, 6) +
          " " +
          value.substring(6, 10);
      }

      e.target.value = value;
    });
  }

  botoncancelar.addEventListener("click", function () {
    cancelarEdicion(NombredelCampo);
  });
}

//Carga de contenido AJAX con los botones de la vista una vez que se cargue el doctumento
$(document).ready(async function () {
  await obtenerDatos();
  // Cargar la vista General.ejs al cargar la página
  cargarGeneral();

  if (InfoSesion.EsDoctor) {
    $("#Historial").removeClass("activo");
    $("#Recetas").removeClass("activo");
    var seccion = document.getElementById("General");
    seccion.classList.add("activo");

    // Agregar eventos de clic para cargar las vistas
    $("#General").click(function () {
      cargarGeneral();
      $("#Historial").removeClass("activo");
      $("#Recetas").removeClass("activo");
      var seccion = document.getElementById("General");
      seccion.classList.add("activo");
    });

    $("#Historial").click(function () {
      cargarHistorial();
      $("#General").removeClass("activo");
      $("#Recetas").removeClass("activo");
      var seccion = document.getElementById("Historial");
      seccion.classList.add("activo");
    });

    $("#Recetas").click(function () {
      cargarRecetas();
      $("#General").removeClass("activo");
      $("#Historial").removeClass("activo");
      var seccion = document.getElementById("Recetas");
      seccion.classList.add("activo");
    });

    if (datosAlmacenados.SesionesActivas.length > 0) {
      if (
        InfoSesion.idUsuario != datosAlmacenados.SesionesActivas[0].idDoctor
      ) {
        $("#TerminarConsulta").remove();
        $(".SeguimientoHoy").remove();
      }
    }
  } else {
    $("#General").remove();
    $("#Historial").remove();
    $("#Recetas").remove();
    $(".infogroup.antecedentes").remove();
    $(".Seguimientos").remove();
    $("#editarAlergias").remove();
    $(".Botones").remove();
    $("#TerminarConsulta").remove();
    $("#NR").remove();
    $(".infogroup.ficha").css({
      "margin-right": "auto",
      "max-width": "100%",
    });
  }
});
