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
  
  <section class="region" id="RA">
    <h2 id="Titulo_Receta">Receta Actual:</h2>
    <div class="infogroup">
      <div class="info__item">
        <div class="info__item__content">
          <header class="info__item__header">
            <div id="Doctor" style="font-size:18px; display:none;">Cargando Doctor...</div>
            <button class="iconbtn--print" id="Print" style="display:none;">Imprimir Receta</button>
          </header>
          <div class="Receta_actual" id="Receta_actual">
          </div>
        </div>
      </div>
    </div>
  </section>

  <section class="region" id="NR" style="display:none;">
    <h2>Nueva Receta:</h2>
    <div class="infogroup">
      <div class="info__item">
        <div class="info__item__content">
          <div class="Nueva_Receta" id="Nueva_Receta">
          </div>
        </div>
      </div>
    </div>
  </section>

    `;

  General.innerHTML = htmlString;
  // ========================================================================================================
  // Peticion para llenar los selects
  // ========================================================================================================
  $.ajax({
    url: "/InfoRegistros",
    type: "POST",
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
  // Peticion para insertar ultima receta
  // ========================================================================================================
  $.ajax({
    url: "/InfoPaciente",
    method: "POST",
    dataType: "json",
    success: (data) => {
      // Buscamos el div donde se insertara la receta
      const Receta = document.getElementById("Receta_actual");
      const TituloReceta = document.getElementById("Titulo_Receta");
      const Print = document.getElementById("Print");
      const Doctor = document.getElementById("Doctor");
      const veriRecetas = data.Recetas.length;
      const idPaciente = data.DatosDT[0].idPaciente;
      // Si existen elementos en la receta:
      if (veriRecetas != 0) {
        // Activamos el nombre del doctor y el boton de imprimir
        Doctor.style.display = "block";
        Print.style.display = "inline-block";
        // Realizamos converciones en la fecha para que se muestre correctamente:
        const fechaOriginal = data.Recetas[0].Fecha;
        // Parsear la fecha
        const fecha = new Date(fechaOriginal);
        // Obtener los componentes de la fecha (día, mes y año)
        const dia = fecha.getDate();
        const mes = fecha.getMonth() + 1; // Sumar 1 porque los meses comienzan en 0
        const año = fecha.getFullYear() % 100; // Obtener los últimos dos dígitos del año

        // Cambiamos el titulo
        TituloReceta.innerHTML = `Receta actual (<span>${dia}/${mes}/${año}</span>):`;
        //Almacenamos el id de la receta mas reciente
        const ultimareceta = data.Recetas[0].idReceta;
        // Añadimos el nombre del doctor que la recetó
        Doctor.innerHTML = `<p>Recetado por: <b><span>${data.Recetas[0].Doctor}</span></b></p>`;
        // Crea un elemento dl
        const dl = document.createElement("dl");
        // Filtra los datos para incluir solo aquellos con idReceta igual a ultimareceta
        const datosFiltrados = data.Recetas.filter(
          (item) => item.idReceta === ultimareceta
        );
        // Recorre los datos filtrados
        datosFiltrados.forEach((item, index) => {
          // Crea elementos dt y dd para cada conjunto de datos
          const dt = document.createElement("dt");
          // Con el nombre del medicamento en negritas
          dt.innerHTML = `<b>${item.Medicamento}:</b>`;
          const dd = document.createElement("dd");
          // Y su indicacion
          dd.innerHTML = `
            <p>${item.Indicacion}</p>
            <br>
          `;
          // Agrega los elementos dt y dd al elemento dl
          dl.appendChild(dt);
          dl.appendChild(dd);
        });
        if (data.Recetas[0].Nota) {
          // Crea el elemento para mostrar la nota
          const Nota = document.createElement("div");
          const NotaTitulo = document.createElement("h3");
          NotaTitulo.innerHTML = "Nota:";
          const NotaP = document.createElement("p");
          NotaP.innerHTML = data.Recetas[0].Nota;

          // Agrega el elemento dl a tu página
          Receta.appendChild(dl);
          // Agrega el elemento de la nota
          Nota.appendChild(NotaTitulo);
          Nota.appendChild(NotaP);
          Receta.appendChild(Nota);
        } else {
          // Agrega el elemento dl a tu página
          Receta.appendChild(dl);
        }
      } else {
        // Si no hay receta, muestra un mensaje
        Receta.innerHTML = "No hay recetas registradas.";
      }
    },
    // Resto de la configuración de la solicitud AJAX
    
    error: function (error) {
      console.error(error);
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
    confirmarEdicion("P_Actual", " ", 1);
  });
  agregarEventListener("confirmarAlergias", function () {
    // Acciones a realizar cuando se haga clic en el botón
    confirmarEdicion("Alergias", " ", 1);
  });

  agregarEventListener("confirmarA_HF", function () {
    // Acciones a realizar cuando se haga clic en el botón
    confirmarEdicion("A_HF", " ", 1);
  });

  agregarEventListener("confirmarA_NP", function () {
    // Acciones a realizar cuando se haga clic en el botón
    confirmarEdicion("A_NP", " ", 1);
  });

  agregarEventListener("confirmarA_PP", function () {
    // Acciones a realizar cuando se haga clic en el botón
    confirmarEdicion("A_PP", " ", 1);
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

  
  // ========================================================================================================
  // Y escucnhar el boton de imprimir
  // ========================================================================================================
  agregarEventListener("Print", function () {
    // Acciones a realizar cuando se haga clic en el botón
    // Obtenemos el id del paciente con base a la URL
    const urlCompleta = window.location.href;
    const urlPaciente = "InfoPaciente/";
    const posision = urlCompleta.indexOf(urlPaciente);
    const idPaciente = urlCompleta.substring(posision+urlPaciente.length);

    // Obtenemos el id de la receta
    const idReceta = datosAlmacenados.Recetas[0].idReceta;
    // Abrimos la receta en una nueva pestaña
    window.open(`/Receta/${idPaciente}/${idReceta}`, '_blank');

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
