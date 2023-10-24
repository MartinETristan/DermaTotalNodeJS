// Declarar una variable global para almacenar los datos
let datosAlmacenados = null;
var NombreUsuario = null;

// ========================================================================================================
// Función para realizar la consulta AJAX y almacenar los datos
// ========================================================================================================

function obtenerDatos() {
  return new Promise((resolve, reject) => {
    if (datosAlmacenados) {
      // Si los datos ya están almacenados, resuelve con esos datos
      resolve(datosAlmacenados);
    } else {
      $.ajax({
        url: "/InfoPaciente",
        method: "POST",
        dataType: "json",
        success: (data) => {
          // Guardamos los datos para eviar hacer la consulta AJAX nuevamente
          datosAlmacenados = data;
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
          Alergias.textContent = data.Antecedentes[0].Alergias.toUpperCase();
          if (data.Antecedentes[0].Alergias === "No hay Alergias") {
            // Alergias.textContent = "Ninguna";
            const Alerg = document.querySelector(".Alerg");
            Alerg.setAttribute("style", "color: #004368;");
            Alerg.textContent = capitalizeFirstLetters(data.Antecedentes[0].Alergias);

          }

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
          resolve(data);
        },
        error: function (error) {
          console.error(error);
        },
      });
    }
  });
}


function capitalizeFirstLetters(str) {
  return str.split(' ').map(word => {
      return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
  }).join(' ');
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
  return {
    dia: fecha.getDate(),
    mes: fecha.getMonth() + 1,
    año: fecha.getFullYear() % 100,
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

agregarEventListener("PassRestart", function () {
  // Acciones a realizar cuando se haga clic en el botón
  reiniciarContraseña();
});

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

    if (item.Orden != contador && contador <= original.length){
      let cambios = [];
      cambios.push(item);
      cambios.push({NuevoOrden: contador});

      changes.push({action:"Reordendar",cambios});
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
  console.log(changes);
  // Si hay cambios, pasamos el array de cambios
  if (changes.length > 0) {
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

function eliminarUltimosCampos(zona) {
  const contenedorEditMedicamentos = document.getElementById(`${zona}`);
  
  // Seleccionar el último div dentro del contenedor
  const ultimoDiv = contenedorEditMedicamentos.lastElementChild;
  
  // Verificar que el último elemento es realmente un div antes de eliminarlo
  if (ultimoDiv && ultimoDiv.tagName === 'DIV') {
    contenedorEditMedicamentos.removeChild(ultimoDiv);
  }

  
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

//Carga de contenido AJAX con los botones de la vista una vez que se cargue el doctumento
$(document).ready(async function () {
  await obtenerDatos();
  // Cargar la vista General.ejs al cargar la página
  cargarGeneral();

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
});
