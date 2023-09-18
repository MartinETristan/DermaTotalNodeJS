// ====================================================
// Creamos la vista general
// ====================================================
async function cargarGeneral() {
  await obtenerDatos();
  console.log(datosAlmacenados);
  const General = document.querySelector("#infocontenido");
  var htmlString = `
  <div class="region__content" id="region__content">
  <div class="infogroup">
    <div class="info">
    <h3>Antecedentes:</h3>
      <div class="info__item">
        <div class="info__item__content">
          <header class="info__item__header">
            <h3 class="info__item__title">Padecimineto Actual:</h3>
            <button class="iconbtn--edit" id="editarP_Actual"></button>
            <button class="iconbtn--cancelar" id="cancelarP_Actual" style="display:none;"></button>
            <button class="iconbtn--confirm" id="confirmarP_Actual" style="display:none;">Confirmar</button>
          </header>
          <p class="text--lg" id="textP_Actual">${await datosAlmacenados
            .Antecedentes[0].P_Actual}</p>
          <input type="text" name="inputP_Actual" id="inputP_Actual" value="${await datosAlmacenados
            .Antecedentes[0].P_Actual}" style="display:none;" />
        </div>
      </div>
      <div class="info__item">
        <div class="info__item__content">
          <header class="info__item__header">
            <h3 class="info__item__title">Alergias:</h3>
            <button class="iconbtn--edit" id="editarAlergias"></button>
            <button class="iconbtn--cancelar" id="cancelarAlergias" style="display:none;"></button>
            <button class="iconbtn--confirm" id="confirmarAlergias" style="display:none;">Confirmar</button>
          </header>
          <p id="textAlergias">${await datosAlmacenados.Antecedentes[0]
            .Alergias}</p>
          <input type="text" name="inputAlergias" id="inputAlergias" value="${await datosAlmacenados
            .Antecedentes[0].Alergias}" style="display:none;" />
        </div>
      </div>
      <div class="info__item">
        <div class="info__item__content">
          <header class="info__item__header">
            <h3 class="info__item__title">Antecedentes Heredo/Familiares:</h3>
            <button class="iconbtn--edit" id="editarA_HF"></button>
            <button class="iconbtn--cancelar" id="cancelarA_HF" style="display:none;"></button>
            <button class="iconbtn--confirm" id="confirmarA_HF" style="display:none;">Confirmar</button>
          </header>
          <p id="textA_HF">${await datosAlmacenados.Antecedentes[0].A_HF}</p>
          <input type="text" name="inputA_HF" id="inputA_HF" value="${await datosAlmacenados
            .Antecedentes[0].A_HF}" style="display:none;" />
        </div>
      </div>
      <div class="info__item">
        <div class="info__item__content">
          <header class="info__item__header">
            <h3 class="info__item__title">Antecedentes No Patologicos:</h3>
            <button class="iconbtn--edit" id="editarA_NP"></button>
            <button class="iconbtn--cancelar" id="cancelarA_NP" style="display:none;"></button>
            <button class="iconbtn--confirm" id="confirmarA_NP" style="display:none;">Confirmar</button>
          </header>
          <p id="textA_NP">${await datosAlmacenados.Antecedentes[0].A_NP}</p>
          <input type="text" name="inputA_NP" id="inputA_NP" value="${await datosAlmacenados
            .Antecedentes[0].A_NP}" style="display:none;" />
        </div>
      </div>
      <div class="info__item">
        <div class="info__item__content">
          <header class="info__item__header">
            <h3 class="info__item__title">Antecedentes Personales/Patologicos:</h3>
            <button class="iconbtn--edit" id="editarA_PP"></button>
            <button class="iconbtn--cancelar" id="cancelarA_PP" style="display:none;"></button>
            <button class="iconbtn--confirm" id="confirmarA_PP" style="display:none;">Confirmar</button>
          </header>
          <p id="textA_PP">${await datosAlmacenados.Antecedentes[0].A_PP}</p>
          <input type="text" name="inputA_PP" id="inputA_PP" value="${await datosAlmacenados
            .Antecedentes[0].A_PP}" style="display:none;"/>
        </div>
      </div>
    </div>
  </div>

  <div class="infogroup">
  <h3>Datos Generales:</h3>
    <div class="info">
      <div class="info__item">
        <div class="info__item__content">
          <header class="info__item__header">
            <h3 class="info__item__title">Fecha de Nacimiento:</h3>
            <button class="iconbtn--edit" id="editarFechaDeNac"></button>
            <button class="iconbtn--cancelar" id="cancelarFechaDeNac" style="display:none;"></button>
            <button class="iconbtn--confirm" id="confirmarFechaDeNac" style="display:none;">Confirmar</button>
          </header>
          <p id="textFechaDeNac">${await datosAlmacenados.BasicInfo[0]
            .FechadeNac}</p>
          <input type="date" name="inputFechaDeNac" id="inputFechaDeNac" style="display:none;"/>
        </div>
      </div>
    </div>
    <div class="info">
      <div class="info__item">
        <div class="info__item__content">
          <header class="info__item__header">
            <h3 class="info__item__title">Sexo:</h3>
            <button class="iconbtn--edit" id="editarSexo"></button>
            <button class="iconbtn--cancelar" id="cancelarSexo" style="display:none;"></button>
            <button class="iconbtn--confirm" id="confirmarSexo" style="display:none;">Confirmar</button>
          </header>
          <p id="textSexo">${await datosAlmacenados.BasicInfo[0].Sexo}</p>
          <select name="inputSexo" id="inputSexo" style="display:none;" >
          </select>
        </div>
      </div>
    </div>
    <div class="info">
      <div class="info__item">
        <div class="info__item__content">
          <header class="info__item__header">
            <h3 class="info__item__title">Telefono:</h3>
            <button class="iconbtn--edit" id="editarTel1"></button>
            <button class="iconbtn--cancelar" id="cancelarTel1" style="display:none;"></button>
            <button class="iconbtn--confirm" id="confirmarTel1" style="display:none;">Confirmar</button>
          </header>
          <p id="textTel1">${
            (await datosAlmacenados.BasicInfo[0].Tel1) ||
            "No hay telefono registrado"
          }</p>
          <input type="text" name="inputTel1" id="inputTel1" value="${await datosAlmacenados
            .BasicInfo[0].Tel1}" style="display:none;"/>
        </div>
      </div>
      <div class="info__item">
        <div class="info__item__content">
          <header class="info__item__header">
          <h3 class="info__item__title">Telefono Secundario:</h3>
          <button class="iconbtn--edit" id="editarTel2"></button>
          <button class="iconbtn--cancelar" id="cancelarTel2" style="display:none;"></button>
          <button class="iconbtn--confirm" id="confirmarTel2" style="display:none;">Confirmar</button>
          </header>
          <p id="textTel2">${
            (await datosAlmacenados.BasicInfo[0].Tel2) ||
            "No hay telefono secundario registrado"
          }</p>
          <input type="text" name="inputTel2" id="inputTel2" value="${await datosAlmacenados
            .BasicInfo[0].Tel2}" style="display:none;"/>
        </div>
      </div>
    </div>

    <div class="info">
      <div class="info__item">
        <div class="info__item__content">
          <header class="info__item__header">
            <h3 class="info__item__title">Correo:</h3>
            <button class="iconbtn--edit" id="editarCorreo"></button>
            <button class="iconbtn--cancelar" id="cancelarCorreo" style="display:none;"></button>
            <button class="iconbtn--confirm" id="confirmarCorreo" style="display:none;">Confirmar</button>
          </header>
          <p id="textCorreo">${
            (await datosAlmacenados.BasicInfo[0].Correo) ||
            "No hay correo registrado"
          }</p>
          <input type="text" name="inputCorreo" id="inputCorreo" value="${await datosAlmacenados
            .BasicInfo[0].Correo}" style="display:none;"/>
        </div>
      </div>
    </div>
  </div>

  <div class="infogroup">
  <h3>Datos DermaTotal:</h3>
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
            (await datosAlmacenados.DatosDT[0].Status) || "Cargando Status..."
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
            <p>${
              (await datosAlmacenados.DatosDT[0].Usuario) ||
              "Usuario no disponible"
            }</p>
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
              (await datosAlmacenados.DatosDT[0].AltaPor) ||
              "Usuario no disponible"
            } <span class="avatar__role"> 
            ${
              (await datosAlmacenados.DatosDT[0].TipoUsuarioAlta) ||
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
            (await datosAlmacenados.DatosDT[0].FechaAlta) ||
            "Cargando fecha de alta..."
          }</p>
        </div>
      </div>
    </div>
  </div>
</div>

<section class="region">
  <h2>Receta Actual:</h2>
  <div class="infogroup">
    <div class="info__item">
      <div class="info__item__content">
        <p>Receta</p>
      </div>
    </div>
  </div>
</section>
  `;
  General.innerHTML = htmlString;
  // ========================================================================================================
  // Funcion para llenar los selects
  // ========================================================================================================
  $.ajax({
    url: "/InfoRegistros",
    type: "GET",
    dataType: "json",
    success: function (data) {
      // Llenado para el Sexo
      const Sexo = document.getElementById("inputSexo");
      data.Sexo.forEach((element) => {
        const ListaSex = new Option(element.Sexo, element.idSexo);
        Sexo.appendChild(ListaSex);
      });
      //Llenado para el Status
      const Status = document.getElementById("inputStatus");
      data.StatusUsuario.forEach((element) => {
        const ListaStat = new Option(element.Status, element.idStatus);
        Status.appendChild(ListaStat);
      });
    },
  });
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
  // Para editar los datos
  // ========================================================================================================
  agregarEventListener("editarP_Actual", function () {
    // Acciones a realizar cuando se haga clic en el botón
    editarDato("P_Actual");
  });
  agregarEventListener("editarAlergias", function () {
    // Acciones a realizar cuando se haga clic en el botón
    editarDato("Alergias");
  });

  agregarEventListener("editarA_HF", function () {
    // Acciones a realizar cuando se haga clic en el botón
    editarDato("A_HF");
  });

  agregarEventListener("editarA_NP", function () {
    // Acciones a realizar cuando se haga clic en el botón
    editarDato("A_NP");
  });

  agregarEventListener("editarA_PP", function () {
    // Acciones a realizar cuando se haga clic en el botón
    editarDato("A_PP");
  });

  agregarEventListener("editarFechaDeNac", function () {
    // Acciones a realizar cuando se haga clic en el botón
    editarDato("FechaDeNac");
  });

  agregarEventListener("editarSexo", function () {
    // Acciones a realizar cuando se haga clic en el botón
    editarDato("Sexo");
  });

  agregarEventListener("editarTel1", function () {
    // Acciones a realizar cuando se haga clic en el botón
    editarDato("Tel1");
  });

  agregarEventListener("editarTel2", function () {
    // Acciones a realizar cuando se haga clic en el botón
    editarDato("Tel2");
  });

  agregarEventListener("editarCorreo", function () {
    // Acciones a realizar cuando se haga clic en el botón
    editarDato("Correo");
  });

  agregarEventListener("editarStatus", function () {
    // Acciones a realizar cuando se haga clic en el botón
    editarDato("Status");
  });

  agregarEventListener("PassRestart", function () {
    // Acciones a realizar cuando se haga clic en el botón
    reiniciarContraseña();
  });

  // ========================================================================================================
  // Para confirmar los cambios
  // ========================================================================================================

  agregarEventListener("confirmarP_Actual", function () {
    // Acciones a realizar cuando se haga clic en el botón
    confirmarEdicion("P_Actual"," ",1);
  });
  agregarEventListener("confirmarAlergias", function () {
    // Acciones a realizar cuando se haga clic en el botón
    confirmarEdicion("Alergias"," ",1);
  });

  agregarEventListener("confirmarA_HF", function () {
    // Acciones a realizar cuando se haga clic en el botón
    confirmarEdicion("A_HF"," ",1);
  });

  agregarEventListener("confirmarA_NP", function () {
    // Acciones a realizar cuando se haga clic en el botón
    confirmarEdicion("A_NP"," ",1);
  });

  agregarEventListener("confirmarA_PP", function () {
    // Acciones a realizar cuando se haga clic en el botón
    confirmarEdicion("A_PP"," ",1);
  });

  agregarEventListener("confirmarFechaDeNac", function () {
    // Acciones a realizar cuando se haga clic en el botón
    confirmarEdicion("FechaDeNac", "FechadeNacimiento", 2);
  });

  agregarEventListener("confirmarSexo", function () {
    // Acciones a realizar cuando se haga clic en el botón
    confirmarEdicion("Sexo", "idSexo", 2);
  });

  agregarEventListener("confirmarTel1", function () {
    // Acciones a realizar cuando se haga clic en el botón
    confirmarEdicion("Tel1", "Telefono", 2);
  });

  agregarEventListener("confirmarTel2", function () {
    // Acciones a realizar cuando se haga clic en el botón
    confirmarEdicion("Tel2", "TelefonoSecundario", 2);
  });

  agregarEventListener("confirmarCorreo", function () {
    // Acciones a realizar cuando se haga clic en el botón
    confirmarEdicion("Correo", "Correo", 2);
  });

  agregarEventListener("confirmarStatus", function () {
    // Acciones a realizar cuando se haga clic en el botón
    confirmarEdicion("Status", "idStatus", 3);
  });
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

  botoncancelar.addEventListener("click", function () {
    cancelarEdicion(NombredelCampo);
  });
}

function confirmarEdicion(NombredelCampo, NombreEnSistema, Clase) {
  const input = document.getElementById(`input${NombredelCampo}`);
  const valor = input.value;
  // Mandamos el cambio al sistema dependiendo del tipo de cambio que se realice
  switch (Clase) {
    // En caso de cambios en los antecedentes
    case 1:
      fetch("/ActualizarAntecedentesPaciente", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ Propiedad: NombredelCampo, Valor: valor }),
      });
      break;
    // En caso de cambios en los datos generales  
    case 2:
      fetch("/ActualizarInfoPersonal", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          Propiedad: NombreEnSistema,
          Valor: valor,
          TipoUser: 7,
        }),
      });
      break;
    // En caso de cambios en los datos de DermaTotal (Status)
    case 3:
      fetch("/ActualizarStatus", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          Propiedad: NombreEnSistema,
          Valor: valor,
          TipoUser: 7,
        }),
      });
      break;
    default:
      break;
  }

  // Mostramos la vista de antes para salir del modo de edicion
  document.getElementById(`editar${NombredelCampo}`).style.display =
    "inline-block";
  document.getElementById(`cancelar${NombredelCampo}`).style.display = "none";
  document.getElementById(`confirmar${NombredelCampo}`).style.display = "none";
  document.getElementById(`input${NombredelCampo}`).style.display = "none";
  document.getElementById(`text${NombredelCampo}`).textContent = valor;
  document.getElementById(`text${NombredelCampo}`).style.display = "block";
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

// ========================================================================================================
// Función para cargar la vista Historial.ejs
// ========================================================================================================
function cargarHistorial() {
  const Historial = document.querySelector("#infocontenido");
  var htmlString = `
  <div class="region__content" id="region__content">
    <div class="infogroup">
      <div class="info">
      <h3>Historial Clinico:</h3>
        <div class="info__item">
          <div class="info__item__content">
            <header class="info__item__header">
              <h3 class="info__item__title">Seguimiento:</h3>
            </header>
            <p>Sexo del paciente</p>
          </div>
        </div>
      </div>
    </div>
    <div class="infogroup">
      <div class="info">
      <h3>Historial Fotografico:</h3>
        <div class="info__item">
          <div class="info__item__content">
            <img class="fotohistorial" src="/img/UserIco.webp" alt="">
            <img class="fotohistorial" src="/img/UserIco.webp" alt="">
            <img class="fotohistorial" src="/img/UserIco.webp" alt="">
            <img class="fotohistorial" src="/img/UserIco.webp" alt="">
            <img class="fotohistorial" src="/img/UserIco.webp" alt="">
            <img class="fotohistorial" src="/img/UserIco.webp" alt="">
            <img class="fotohistorial" src="/img/UserIco.webp" alt="">
            <img class="fotohistorial" src="/img/UserIco.webp" alt="">
            <img class="fotohistorial" src="/img/UserIco.webp" alt="">
            <img class="fotohistorial" src="/img/UserIco.webp" alt="">
            <img class="fotohistorial" src="/img/UserIco.webp" alt="">
            <img class="fotohistorial" src="/img/UserIco.webp" alt="">
            <img class="fotohistorial" src="/img/UserIco.webp" alt="">
            <img class="fotohistorial" src="/img/UserIco.webp" alt="">
            <img class="fotohistorial" src="/img/UserIco.webp" alt="">
            <img class="fotohistorial" src="/img/UserIco.webp" alt="">
            <img class="fotohistorial" src="/img/UserIco.webp" alt="">
            <img class="fotohistorial" src="/img/UserIco.webp" alt="">
            <img class="fotohistorial" src="/img/UserIco.webp" alt="">
            <img class="fotohistorial" src="/img/UserIco.webp" alt="">
          </div>
        </div>
      </div>
    </div>
  </div>
    
  `;
  Historial.innerHTML = htmlString;
}

// ========================================================================================================
// Función para cargar la vista Recetas.ejs
// ========================================================================================================
function cargarRecetas() {
  const Recetas = document.querySelector("#infocontenido");
  var htmlString = `
  <p>Estas son las recetas</p>
  `;
  Recetas.innerHTML = htmlString;
}

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
        method: "GET",
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
          // Y edad
          const Edad = document.querySelector(".Edad");
          Edad.textContent = data.BasicInfo[0].Edad;

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
          const nuevaURL =
            rutarelativa + "/" + data.BasicInfo[0].Nombres + ".jpg";

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

//Carga de contenido AJAX con los botones de la vista una vez que se cargue el doctumento
$(document).ready(async function () {
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
