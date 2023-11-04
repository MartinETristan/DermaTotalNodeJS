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

    return console.log("Datos obtenidos correctamente");
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
  Nombre.textContent = data.BasicInfo[0].Nombres;
  //Apellido
  const Apellido = document.querySelector(".Apellido");
  Apellido.textContent = data.BasicInfo[0].Apellidos;
  // Edad
  const Edad = document.querySelector(".Edad");
  Edad.textContent = data.BasicInfo[0].Edad;

  //Y alergias
  const Alergias = document.querySelector(".Alergias");
  if (
    data.Antecedentes[0].Alergias == "No hay Alergias" ||
    data.Antecedentes[0].Alergias == null
  ) {
    // Alergias.textContent = "Ninguna";
    const Alerg = document.querySelector(".Alerg");
    Alerg.setAttribute("style", "color: #004368;");
    Alerg.textContent = "No hay Alergias";
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
    data.Antecedentes[0].Alergias != "No hay Alergias"
      ? data.Antecedentes[0].Alergias
      : "";
  const Alerg = document.querySelector(".Alerg");
  // Añadimos el boton al contenedor
  contenedorAlergias.appendChild(botonEditAlerg);

  // Agregamos el evento para editar las alergias
  agregarEventListener("editarAlergias", function () {
    editarDato("Alergias");
  });
  //Creamos el boton de cancelar
  const botonCancelarAlerg = document.createElement("button");
  botonCancelarAlerg.type = "button";
  botonCancelarAlerg.textContent = "Cancelar";
  botonCancelarAlerg.classList.add("botonCancelarAlergias");
  botonCancelarAlerg.style.display = "none";
  botonCancelarAlerg.id = "cancelarAlergias";
  contenedorAlergias.appendChild(botonCancelarAlerg);

  //Creamos el boton de guardado
  const botonGuardarAlerg = document.createElement("button");
  botonGuardarAlerg.type = "button";
  botonGuardarAlerg.textContent = "Guardar";
  botonGuardarAlerg.classList.add("botonGuardarAlergias");
  botonGuardarAlerg.style.display = "none";
  botonGuardarAlerg.id = "confirmarAlergias";
  // Añadimos el boton al contenedor`
  contenedorAlergias.appendChild(botonGuardarAlerg);

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

  // ========================================================================================================
  // Escuchar el boton para reinciiar la constraseña
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
                 <button class="iconbtn--cancelar" id="cancelarStatus" style="display:none;"></button>
                 <button class="iconbtn--confirm" id="confirmarStatus" style="display:none;">Confirmar</button>
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

// Funcion para reinciar la contraseña:
function reiniciarContraseña() {
  // Restablecer la contraseña a el nombre de usuario
  var resultado =
    window.confirm(`Al reiniciar la contraseña, el usuario podrá iniciar sesión con su nombre de usuario.
      ¿Deseas Continuar?
    `);
  if (resultado === true) {
    // Hacemos el reinicio
    fetch("/PassRestart", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ usuario: NombreUsuario }),
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

var arrayInput = [];

// Comparar los datos
function itemsAreEqual(item1, item2) {
  return (
    item1.Medicamento === item2.Medicamento &&
    item1.Indicacion === item2.Indicacion
  );
}

// ========================================================================================================
// Funcion para compara el Array original con el Array dado por los cambios
// ========================================================================================================
function compareData(original, form) {
  let changes = [];
  let hasNotaChange = false;

  let contador = 1;
  form.forEach((item) => {
    const originalItem = original.find(
      (o) =>
        o.idMedicamento === item.idMedicamento &&
        o.idMedicamento_Receta === item.idMedicamento_Receta &&
        o.idReceta === item.idReceta
    );

    if (!originalItem) {
      if (item.Medicamento === "" && item.Indicacion === "") {
        return;
      }
      item.idReceta = original[0].idReceta;
      item.idMedicamento_Receta = original[0].idMedicamento_Receta;
      changes.push({ action: "Añadir", item });
    } else if (!itemsAreEqual(originalItem, item)) {
      changes.push({ action: "Editar", item });
    } else if (originalItem.Nota !== item.Nota) {
      hasNotaChange = true;
    }

    if (item.Orden != contador && contador <= original.length) {
      let cambios = [];
      cambios.push(item);
      cambios.push({ NuevoOrden: contador });

      changes.push({ action: "Reordendar", cambios });
    }
    contador++;
  });

  original.forEach((item) => {
    if (
      !form.some(
        (f) =>
          f.idMedicamento === item.idMedicamento &&
          f.idMedicamento_Receta === item.idMedicamento_Receta &&
          f.idReceta === item.idReceta
      )
    ) {
      changes.push({ action: "Quitar", item });
    }
  });

  if (hasNotaChange) {
    const notaChangeItem = form[0];
    changes.push({
      action: "EditNota",
      item: { idReceta: notaChangeItem.idReceta, Nota: notaChangeItem.Nota },
    });
  }

  // Funcion para resetear la interfaz
  function resetUI() {
    const formEditReceta = document.querySelector("#Receta_actual form");
    const botones = document.querySelector(".Botones");
    const botoncancelar = document.getElementById("CancelarEdit");
    const botonEditar = document.getElementById("EditarUltimaReceta");
    const botonGuardar = document.getElementById("GuardarCambios");
    const botonPrint = document.getElementById("Print");
    const botonNuevaReceta = document.getElementById("botonNuevaReceta");
    const Nota = document.querySelector(".Nota");

    if (Nota) {
      Nota.style.display = "block";
    }

    botones.style.display = "flex";
    botoncancelar.style.display = "none";
    botonEditar.style.display = "flex";
    botonGuardar.style.display = "none";
    botonPrint.style.display = "flex";
    botonNuevaReceta.style.display = "block";
    formEditReceta.style.display = "none";

    // Mostramos todos los elementos generados con 'crearElementoMedicamento'
    const elementosReceta = document.querySelectorAll(".elemento-receta");
    elementosReceta.forEach((elemento) => {
      elemento.style.display = "block";
    });
  }

  // Si hay cambios, pasamos el array de cambios
  // console.log(changes);
  if (changes.length > 0) {
    let respuesta = confirm(
      "¿Estas seguro de guardar los cambios? Estos cambios pueden alterar el orden, medicamentos o indicaciones para el paciente."
    );

    if (respuesta) {
      fetch("/CambiosReceta", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          Cambios: changes,
        }),
      });
      location.reload();
    } else {
      resetUI();
      return null;
    }
  } else {
    resetUI();
    return null;
  }
}

// Función para agregar campos de Medicamentos e Indicaciones
function agregarCampos(zona, NombreInputMedicamento, NombreInputIndicacion) {
  const camposMedicamentos = document.getElementById(`${zona}`);
  // Creamos un contenedor para los campos de Medicamento e Indicación
  const contenedor = document.createElement("div");
  contenedor.classList.add("New");
  const medicamentoInput = document.createElement("input");
  medicamentoInput.type = "text";
  medicamentoInput.name = `${NombreInputMedicamento}`;
  medicamentoInput.placeholder = "Medicamento";
  medicamentoInput.required = true;
  medicamentoInput.classList.add("medicamentoreceta");
  contenedor.appendChild(medicamentoInput);

  // Boton para eliminar el par de Medicamento e Indicación
  const botonQuitar = document.createElement("button");
  botonQuitar.type = "button";
  botonQuitar.textContent = "Eliminar";
  botonQuitar.classList.add("iconbtn--Eliminar");
  botonQuitar.addEventListener("click", () => {
    const divMedicamentos = botonQuitar.parentNode;
    divMedicamentos.parentNode.removeChild(divMedicamentos);
  });
  contenedor.appendChild(botonQuitar);

  const indicacionInput = document.createElement("input");
  indicacionInput.type = "text";
  indicacionInput.name = `${NombreInputIndicacion}`;
  indicacionInput.placeholder = "Indicación";
  indicacionInput.classList.add("indicacionreceta");
  indicacionInput.required = true;
  contenedor.appendChild(indicacionInput);

  camposMedicamentos.appendChild(contenedor);

  if (zona === "camposMedicamentos") {
    // Agregar el par de Medicamento e Indicación al array correspondiente
    medicamentoInput.addEventListener("blur", () => {
      agregarMedicamentoIndicacion(
        medicamentoInput.value,
        indicacionInput.value
      );
    });
  }
}

// ========================================================================================================
// Funcion para crear conteido de Diagnosticos
// ========================================================================================================

function crearElemento_Diagnostico(clase) {
  const elemento = document.createElement("div");
  elemento.classList.add(clase);
  return elemento;
}

function crearElementoHeader_Diagnostico(Fecha, Etiquetas = []) {
  const elemento = document.createElement("header");
  elemento.classList.add("info__item__header");

  const titulo = document.createElement("h3");
  titulo.classList.add("info__item__title");
  titulo.textContent = Fecha;
  elemento.appendChild(titulo);

  if (Etiquetas.length > 0) {
    const etiquetasDiv = document.createElement("div");
    etiquetasDiv.classList.add("info__item__tags");
    Etiquetas.forEach((etiqueta) => {
      const span = document.createElement("span");
      span.classList.add("info__item__tag");
      span.textContent = etiqueta;
      etiquetasDiv.appendChild(span);
    });
    elemento.appendChild(etiquetasDiv);
  }

  return elemento;
}

function crearInfoItem_Diagnostico(contenido) {
  const item = crearElemento_Diagnostico("info__item");
  const itemContent = crearElemento_Diagnostico("info__item__content");

  //Eliminamos el ultimo por que ya se muestra en otra vista
  if (Array.isArray(contenido)) {
    item.classList.add("Historial_Seguimientos");
    //Creamos el elemento de paginación
    const paginacion = document.createElement("div");
    paginacion.classList.add("paginacion");
    itemContent.appendChild(paginacion);

    const totalPaginas = contenido.length;

    // Función para mostrar el contenido de la página actual
    function mostrarContenido(paginaActual) {
      // Limpiar el contenido anterior
      itemContent.innerHTML = "";
      const fecha = formatearFecha(contenido[paginaActual - 1].Fecha);
      const elemento = contenido[paginaActual - 1];
      const header = crearElementoHeader_Diagnostico(
        "SEGUIMIENTO " + fecha.dia + "/" + fecha.mes + "/" + fecha.año + ":"
      );
      itemContent.appendChild(header);
      const contenedor = document.createElement("div");
      contenedor.classList.add("Contenedor__Diagnosticos");
      const p = document.createElement("p");
      p.textContent = elemento.Diagnostico;
      contenedor.appendChild(p);
      itemContent.appendChild(contenedor);

      // Si la paginación ya está inicializada, simplemente la añadimos de nuevo al final de itemContent.
      if (paginacion) {
        itemContent.appendChild(paginacion);
      }
    }

    // Iniciar mostrando la primera página
    mostrarContenido(1);

    // Crear contenedor de paginación si aún no existe
    if (!paginacion) {
      paginacion = document.createElement("div");
    }

    // Añadirlo al final de itemContent
    itemContent.appendChild(paginacion);

    // Inicializar twbsPagination
    $(paginacion).twbsPagination({
      totalPages: totalPaginas,
      visiblePages: 5,
      first: "Mas Reciente",
      next: ">",
      prev: "<",
      last: "Mas Antigua",
      onPageClick: function (event, page) {
        mostrarContenido(page);
      },
    });
  } else if (typeof contenido === "string") {
    item.classList.add("SeguimientoHoy");
    const header = crearElementoHeader_Diagnostico("SEGUIMINETO HOY:");

    itemContent.appendChild(header);

    const input = document.createElement("textarea");
    input.classList.add("info__item__textarea");
    input.placeholder = "Escribe el seguimiento aquí...";
    input.required = true;
    input.addEventListener("input", function () {
      // Restablecer la altura para calcular correctamente el scrollHeight
      this.style.height = "auto";
      // Establecer la altura en función del contenido, pero no superará la max-height definida en CSS
      this.style.height = this.scrollHeight + "px";
    });
    itemContent.appendChild(input);

    const cont_text = document.createElement("div");
    cont_text.classList.add("Cont_Seguimiento");
    const textinput = document.createElement("p");
    textinput.style.display = "none";
    textinput.style.visibility = "0";
    cont_text.appendChild(textinput);
    itemContent.appendChild(cont_text);


    const botonGuardar = document.createElement("button");
    botonGuardar.type = "button";
    botonGuardar.textContent = "Guardar";
    botonGuardar.style.float = "right";
    botonGuardar.style.marginRight = "10px";
    botonGuardar.classList.add("iconbtn--save");
    botonGuardar.addEventListener("click", () => {
      const diagnostico = input.value;
        if (diagnostico) {
          // console.log(diagnostico);
          textinput.textContent = input.value;
          input.style.display = "none";
          textinput.style.display = "block";
          botonEditar.style.display = "inline-block";
          botonGuardar.style.display = "none";
        }
    });

    const botonEditar = document.createElement("button");
    botonEditar.type = "button";
    botonEditar.style.display = "none";
    botonEditar.textContent = "Editar";
    botonEditar.style.float = "right";
    botonEditar.style.marginRight = "10px";
    botonEditar.classList.add("iconbtn--editar");
    botonEditar.addEventListener("click", () => {
      input.style.display = "block";
      textinput.style.display = "none";
      botonEditar.style.display = "none";
      botonGuardar.style.display = "block";
    });
    itemContent.appendChild(botonEditar);
    itemContent.appendChild(botonGuardar);
  }

  item.appendChild(itemContent);
  return item;
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
    body: JSON.stringify({
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
    fetch(endPoints[Clase], fetchConfig);
  }

  // Mostramos la vista de antes para salir del modo de edicion
  document.getElementById(`editar${NombredelCampo}`).style.display =
    "inline-block";
  document.getElementById(`cancelar${NombredelCampo}`).style.display = "none";
  document.getElementById(`confirmar${NombredelCampo}`).style.display = "none";
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
        Alerg.textContent = "No hay Alergias";
      } else {
        textElement.textContent = `ALERGIAS: ${valor.toUpperCase()}`;
        textElement.style.color = "red";
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
      textElement.textContent = valor;
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
  document.getElementById(`cancelar${NombredelCampo}`).style.display = "none";
  document.getElementById(`confirmar${NombredelCampo}`).style.display = "none";
  document.getElementById(`input${NombredelCampo}`).style.display = "none";
  document.getElementById(`text${NombredelCampo}`).style.display = "block";
}

// ========================================================================================================
// Funciones para realizar cambios en los datos
// ========================================================================================================
function editarDato(NombredelCampo) {
  const botoneditar = document.getElementById(`editar${NombredelCampo}`);
  const botoncancelar = document.getElementById(`cancelar${NombredelCampo}`);
  const input = document.getElementById(`input${NombredelCampo}`);
  const texto = document.getElementById(`text${NombredelCampo}`);
  const confirmar = document.getElementById(`confirmar${NombredelCampo}`);

  botoneditar.style.display = "none";
  input.style.display = "flex";
  input.style.width = "95%";
  botoncancelar.style.display = "inline-block";
  confirmar.style.display = "inline-block";
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
  } else {
    $("#General").remove();
    $("#Historial").remove();
    $("#Recetas").remove();
    $(".infogroup.antecedentes").remove();
    $(".Diagnosticos").remove();
    $("#editarAlergias").remove();
    $("#RA").remove();
    $("#NR").remove();
    $(".infogroup.ficha").css({
      "margin-right": "auto",
      "max-width": "100%",
    });
  }
});
