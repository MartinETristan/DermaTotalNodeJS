// ====================================================
// Creamos la vista general
// ====================================================
function cargarGeneral() {
  console.log(datosAlmacenados);
  const General = document.querySelector("#infocontenido");
  var htmlString = `
    <div class="region__content" id="region__content">
    <div class="infogroup ficha">
    <h3>FICHA DE IDENTIFICACIÓN:</h3>
      <div class="info">
        <div class="info__item">
          <div class="info__item__content">
            <header class="info__item__header">
              <h3 class="info__item__title">Sexo:</h3>
              <button class="iconbtn--edit" id="editarSexo"></button>
              <button class="iconbtn--cancelar" id="cancelarSexo" style="display:none;"></button>
              <button class="iconbtn--confirm" id="confirmarSexo" style="display:none;">Confirmar</button>
            </header>
            <p id="textSexo">${datosAlmacenados.BasicInfo[0].Sexo}</p>
            <select name="inputSexo" id="inputSexo" style="display:none;" >
            </select>
          </div>
        </div>
        <div class="info__item">
          <div class="info__item__content">
            <header class="info__item__header">
              <h3 class="info__item__title">Fecha de Nac:</h3>
              <button class="iconbtn--edit" id="editarFechaDeNac"></button>
              <button class="iconbtn--cancelar" id="cancelarFechaDeNac" style="display:none;"></button>
              <button class="iconbtn--confirm" id="confirmarFechaDeNac" style="display:none;">Confirmar</button>
            </header>
            <p id="textFechaDeNac">${
              datosAlmacenados.BasicInfo[0].FechadeNac || "--/--/----"
            }</p>
            <input type="date" name="inputFechaDeNac" id="inputFechaDeNac" style="display:none;"/>
          </div>
        </div>
      </div>

      <div class="info">
        <div class="info__item">
          <div class="info__item__content">
            <header class="info__item__header">
              <h3 class="info__item__title">Tel:</h3>
              <button class="iconbtn--edit" id="editarTel1"></button>
              <button class="iconbtn--cancelar" id="cancelarTel1" style="display:none;"></button>
              <button class="iconbtn--confirm" id="confirmarTel1" style="display:none;">Confirmar</button>
            </header>
            <a id="textTel1" href="#">${
              datosAlmacenados.BasicInfo[0].Tel1 || "No hay telefono registrado"
            }</a>
            <input type="tel" name="inputTel1" id="inputTel1" value="${
              datosAlmacenados.BasicInfo[0].Tel1 || ""
            }" style="display:none;" placeholder="(XXX) XXX XXXX" />
          </div>
        </div>
        <div class="info__item">
          <div class="info__item__content">
            <header class="info__item__header">
            <h3 class="info__item__title">Tel. Secundario:</h3>
            <button class="iconbtn--edit" id="editarTel2"></button>
            <button class="iconbtn--cancelar" id="cancelarTel2" style="display:none;"></button>
            <button class="iconbtn--confirm" id="confirmarTel2" style="display:none;">Confirmar</button>
            </header>
            <a id="textTel2" href="#">${
              datosAlmacenados.BasicInfo[0].Tel2 ||
              "No hay telefono secundario registrado"
            }</a>
            <input type="tel" name="inputTel2" id="inputTel2" value="${
              datosAlmacenados.BasicInfo[0].Tel2 || ""
            }" style="display:none;" placeholder="(XXX) XXX XXXX" />
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
            <a id="textCorreo" href="#">${
              datosAlmacenados.BasicInfo[0].Correo || "No hay correo registrado"
            }</a>
            <input type="text" name="inputCorreo" id="inputCorreo" value="${
              datosAlmacenados.BasicInfo[0].Correo
            }" style="display:none;" placeholder="ejemplo@correo.com" />
          </div>
        </div>
      </div>
    </div>

    <div class="infogroup antecedentes">
      <div class="info">
      <h3>ANTECEDENTES:</h3>
        <div class="info__item">
          <div class="info__item__content">
            <header class="info__item__header">
              <h3 class="info__item__title">Personales/Patologicos:</h3>
              <button class="iconbtn--edit" id="editarA_PP"></button>
              <button class="iconbtn--cancelar" id="cancelarA_PP" style="display:none;"></button>
              <button class="iconbtn--confirm" id="confirmarA_PP" style="display:none;">Confirmar</button>
            </header>
            <p id="textA_PP"></p>
            <input type="text" name="inputA_PP" id="inputA_PP" style="display:none;"/>
          </div>
        </div>
        <div class="info__item">
          <div class="info__item__content">
            <header class="info__item__header">
              <h3 class="info__item__title">No Patologicos:</h3>
              <button class="iconbtn--edit" id="editarA_NP"></button>
              <button class="iconbtn--cancelar" id="cancelarA_NP" style="display:none;"></button>
              <button class="iconbtn--confirm" id="confirmarA_NP" style="display:none;">Confirmar</button>
            </header>
            <p id="textA_NP"></p>
            <input type="text" name="inputA_NP" id="inputA_NP" style="display:none;" />
          </div>
        </div>
        <div class="info__item">
          <div class="info__item__content">
            <header class="info__item__header">
              <h3 class="info__item__title">Heredo/Familiares:</h3>
              <button class="iconbtn--edit" id="editarA_HF"></button>
              <button class="iconbtn--cancelar" id="cancelarA_HF" style="display:none;"></button>
              <button class="iconbtn--confirm" id="confirmarA_HF" style="display:none;">Confirmar</button>
            </header>
            <p id="textA_HF"></p>
            <input type="text" name="inputA_HF" id="inputA_HF" style="display:none;" />
          </div>
        </div>
      </div>
    </div>
  </div>
  
  <div class="Diagnosticos">
  <h2>NOTAS DE SEGUIMIENTO:</h2>
    <div class="region__content"></div>
  </div>

  <section class="region" id="RA">
    <h2 id="Titulo_Receta">Ultima Receta:</h2>
    <div class="infogroup">
      <div class="info__item">
        <div class="info__item__content">
          <header class="info__item__header">
            <div id="Doctor">Cargando Receta...</div>
            <div class="Botones"> 
            <button class="iconbtn--cancel" id="CancelarEdit" style="display:none;">Cancelar</button>
            <button class="iconbtn--editar" id="EditarUltimaReceta">Editar</button>
            <button class="iconbtn--print" id="Print">Imprimir Receta</button>
            <button class="iconbtn--save" id="GuardarCambios" style="display:none;">Guardar Cambios</button>
            </div>
          </header>
          <div class="Receta_actual" id="Receta_actual">
          </div>
        </div>
      </div>
    </div>
  </section>

  <section class="region" id="NR">
    <div class="infogroup">
      <div class="info__item">
        <div class="info__item__content">
          <header class="info__item__header">
            <h2>Nueva Receta:</h2>
            <button type="button" id="cancelarReceta" style="display:none;">Cancelar</button>
            <button type="button" id="botonNuevaReceta">Nueva Receta</button>
          </header>
          <div class="NuevaReceta" id="NuevaReceta" style="display:none;">
            <form id="recetaForm" action="/NuevaReceta" method="POST">
              <div id="camposMedicamentos">
                  <!-- Los campos Medicamentos e Indicaciones se agregarán aquí -->
              </div>
              <header class="info__item__header">
                <div class="Nota">
                  <input type="text" name="Nota" placeholder="Nota" class="inputNota">
                </div>
                <button type="button" id="agregarCampo">Agregar Medicamento</button>
              </header>
              <button type="submit" id="GuardarReceta">Guardar Receta</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  </section>
    `;

  General.innerHTML = htmlString;

  // ========================================================================================================
  // Mapeo de valores por defecto de los valores por defecto del historial clinico
  // ========================================================================================================
  const HistorialClinico = {
    A_PP: datosAlmacenados.Antecedentes[0].A_PP,
    A_NP: datosAlmacenados.Antecedentes[0].A_NP,
    A_HF: datosAlmacenados.Antecedentes[0].A_HF,
  };
  // Nombre completo de los padecimientos
  const H_ClinicFullName = {
    A_PP: "antecedentes personales/patologicos",
    A_NP: "antecedentes no patologicos",
    A_HF: "antecedentes heredo/familiares",
  };
  // Y para cada uno de ellos, llena los inputs, los placeholders y el texto mostrado
  // cuando el valor es nulo
  Object.entries(HistorialClinico).forEach(([key, value]) => {
    const text = document.getElementById(`text${key}`);
    const input = document.getElementById(`input${key}`);
    text.textContent =
      value == null ? `No hay ${H_ClinicFullName[key]} registrados.` : value;
    input.placeholder = `Escribe aqui los ${H_ClinicFullName[key]} del paciente.`;
    input.value = value == null ? "" : value;
  });

  // ========================================================================================================
  // Mapa de botones para editar datos
  // ========================================================================================================
  const editarBotones = {
    editarA_HF: "A_HF",
    editarA_NP: "A_NP",
    editarA_PP: "A_PP",
    editarFechaDeNac: "FechaDeNac",
    editarSexo: "Sexo",
    editarTel1: "Tel1",
    editarTel2: "Tel2",
    editarCorreo: "Correo",
    // editarStatus: "Status",
    // ... (otros botones)
  };

  Object.keys(editarBotones).forEach((id) => {
    agregarEventListener(id, () => editarDato(editarBotones[id]));
  });

  // ========================================================================================================
  // Mapeo de botones para confirmar los cambios
  // ========================================================================================================
  const confirmarBotones = {
    confirmarA_HF: ["A_HF", " ", 1],
    confirmarA_NP: ["A_NP", " ", 1],
    confirmarA_PP: ["A_PP", " ", 1],
    confirmarFechaDeNac: ["FechaDeNac", "FechadeNacimiento", 2],
    confirmarSexo: ["Sexo", "idSexo", 2],
    confirmarTel1: ["Tel1", "Telefono", 2],
    confirmarTel2: ["Tel2", "TelefonoSecundario", 2],
    confirmarCorreo: ["Correo", "Correo", 2],
    // confirmarStatus: ["Status", "idStatus", 3],
    // ... (otros botones)
  };

  Object.keys(confirmarBotones).forEach((id) => {
    const [dato, otroParam, tercerParam] = confirmarBotones[id];
    agregarEventListener(id, () =>
      confirmarEdicion(dato, otroParam, tercerParam)
    );
  });

  // Le damos Formato a la fecha de nacimiento
  if (datosAlmacenados.BasicInfo[0].FechadeNac) {
    const Nacimiento = formatearFecha(datosAlmacenados.BasicInfo[0].FechadeNac);
    const valorNacimiento =
      Nacimiento.añofull + "-" + Nacimiento.dia2d + "-" + Nacimiento.mes2d;

    // Asignamos el valor por defecto a la fecha de nacimiento
    document.getElementById("inputFechaDeNac").value =
      valorNacimiento.toString();
  }

  agregarEventListener("botonNuevaReceta", function () {
    // Acciones a realizar cuando se haga clic en el botón
    const formreceta = document.getElementById("NuevaReceta");
    const botoncancelar = document.getElementById("cancelarReceta");
    const botonNuevaReceta = document.getElementById("botonNuevaReceta");
    formreceta.style.display = "block";
    botoncancelar.style.display = "block";
    botonNuevaReceta.style.display = "none";

    // Creamos los campos de medicamentos e indicaciones con los valores de la ultima receta
    // Si existen recetas
    if (datosAlmacenados.Recetas[0]) {
      const ultimareceta = datosAlmacenados.Recetas[0].idReceta;
      // Almacenamos todas las recetas con el mismo id en un array
      const datosFiltrados = datosAlmacenados.Recetas.filter(
        (item) => item.idReceta === ultimareceta
      );
      // Y por cada una de ellas creamos un par de campos de medicamentos e indicaciones
      // en caso de que no existan

      const camposMedicamentos = document.getElementById("camposMedicamentos");
      camposMedicamentos.innerHTML = ``;

      datosFiltrados.forEach((item) => {
        const contenedor = document.createElement("div");
        const medicamentoInput = document.createElement("input");
        medicamentoInput.type = "text";
        medicamentoInput.name = "Medicamentos";
        medicamentoInput.placeholder = "Medicamento";
        medicamentoInput.required = true;
        medicamentoInput.classList.add("medicamentoreceta");
        medicamentoInput.value = item.Medicamento;
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
        indicacionInput.name = "Indicaciones";
        indicacionInput.placeholder = "Indicación";
        indicacionInput.classList.add("indicacionreceta");
        indicacionInput.required = true;
        indicacionInput.value = item.Indicacion;
        contenedor.appendChild(indicacionInput);

        camposMedicamentos.appendChild(contenedor);

        // Agregar el par de Medicamento e Indicación al array correspondiente
        medicamentoInput.addEventListener("blur", () => {
          agregarMedicamentoIndicacion(
            medicamentoInput.value,
            indicacionInput.value
          );
        });
      });
    }
  });

  agregarEventListener("cancelarReceta", function () {
    // Acciones a realizar cuando se haga clic en el botón
    const formreceta = document.getElementById("NuevaReceta");
    const botoncancelar = document.getElementById("cancelarReceta");
    const botonNuevaReceta = document.getElementById("botonNuevaReceta");
    formreceta.style.display = "none";
    botoncancelar.style.display = "none";
    botonNuevaReceta.style.display = "block";
  });

  agregarEventListener("EditarUltimaReceta", function () {
    // Acciones a realizar cuando se haga clic en el botón
    const botones = document.querySelector(".Botones");
    const formEditReceta = document.querySelector("#Receta_actual form");
    const botoncancelar = document.getElementById("CancelarEdit");
    const botonEditar = document.getElementById("EditarUltimaReceta");
    const botonGuardar = document.getElementById("GuardarCambios");
    const botonPrint = document.getElementById("Print");
    const botonNuevaReceta = document.getElementById("botonNuevaReceta");

    const Nota = document.querySelector(".Nota");
    if (Nota) {
      Nota.style.display = "none";
    }

    botones.style.display = "flex";
    formEditReceta.style.display = "block";
    botoncancelar.style.display = "flex";
    botonEditar.style.display = "none";
    botonGuardar.style.display = "flex";
    botonPrint.style.display = "none";
    botonNuevaReceta.style.display = "none";

    // Ocultamos todos los elementos generados con 'crearElemento_DiagnosticoMedicamento'
    const elementosReceta = document.querySelectorAll(".elemento-receta");
    elementosReceta.forEach((elemento) => {
      elemento.style.display = "none";
    });
  });

  agregarEventListener("CancelarEdit", function () {
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
    // Mostramos todos los elementos generados con 'crearElemento_DiagnosticoMedicamento'
    const elementosReceta = document.querySelectorAll(".elemento-receta");
    elementosReceta.forEach((elemento) => {
      elemento.style.display = "block";
    });
  });

  agregarEventListener("GuardarCambios", function () {
    // Verificamos si el formulario es válido
    const form = document.querySelector("#Receta_actual form");
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    console.log("Array de inputs:");
    const inputData = getCombinedInputData();
    console.log(inputData);

    const ultimareceta = datosAlmacenados.Recetas[0].idReceta;
    // Almacenamos todas las recetas con el mismo id en un array
    const datosFiltrados = datosAlmacenados.Recetas.filter(
      (item) => item.idReceta === ultimareceta
    ).map((item) => {
      return {
        idMedicamento: String(item.idMedicamento),
        idMedicamento_Receta: String(item.idMedicamento_Receta),
        idReceta: String(item.idReceta),
        Medicamento: item.Medicamento,
        Indicacion: item.Indicacion,
        Nota: item.Nota,
        Orden: String(item.Orden),
      };
    });
    console.log("Ahora el array de la receta:");
    console.log(datosFiltrados);

    // Y llamamos a la función para comparar los datos
    compareData(datosFiltrados, inputData);
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
    const idPaciente = urlCompleta.substring(posision + urlPaciente.length);

    // Obtenemos el id de la receta
    const idReceta = datosAlmacenados.Recetas[0].idReceta;
    // Abrimos la receta en una nueva pestaña

    //========================================================================================================
    // Codigo para no abrir la pestaña y solo imprimir la receta
    //========================================================================================================
    // Función para obtener o crear el iframe basado en su atributo src
    // function getOrCreateIframeBySrc(src) {
    //   // Buscar iframes en el documento y filtrar por el atributo src
    //   let iframes = Array.from(document.querySelectorAll("iframe"));
    //   let iframe = iframes.find((iframe) => iframe.src.endsWith(src));

    //   // Si el iframe no existe con ese src, lo crea y lo añade al documento
    //   if (!iframe) {
    //     iframe = document.createElement("iframe");
    //     iframe.style.display = "none";
    //     document.body.appendChild(iframe);
    //   } else {
    //     iframe.contentWindow.location.reload();
    //   }

    //   return iframe;
    // }

    // // Definir el src
    // let src = `/Receta/${idPaciente}/${idReceta}`;

    // // Usando la función getOrCreateIframeBySrc para obtener o crear el iframe
    // let iframe = getOrCreateIframeBySrc(src);

    // // Establece el evento onload solo si es necesario
    // if (!iframe.onload) {
    //   iframe.onload = function () {
    //     setTimeout(function () {
    //       iframe.contentWindow.print();
    //     }, 200);
    //   };
    // }

    // // Establece el atributo src para cargar el contenido y disparar el evento onload
    // iframe.src = src;

    const imprimir = window.open(`/Receta/${idPaciente}/${idReceta}`, "_blank");

    // Puedes mover el evento onafterprint aquí si deseas que se cierre después de imprimir la página recargada
    // imprimir.onafterprint = () => {
    //   imprimir.close();
    // };
  });

  // Array para almacenar los valores de Medicamentos e Indicaciones
  const medicamentosIndicaciones = [];
  agregarCampos("camposMedicamentos", "Medicamentos", "Indicaciones");

  function agregarMedicamentoIndicacion(medicamento, indicacion) {
    // Buscar si ya existe el medicamento en el array
    const medicamentoExistente = medicamentosIndicaciones.find(
      (item) => item.medicamento === medicamento
    );

    if (indicacion && medicamento) {
      if (medicamentoExistente) {
        medicamentoExistente.indicaciones.push(indicacion);
      } else {
        medicamentosIndicaciones.push({
          medicamento,
          indicaciones: [indicacion],
        });
      }
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

  // Escuchar clic en el botón "Agregar"
  const agregarBoton = document.getElementById("agregarCampo");
  agregarBoton.addEventListener("click", (event) => {
    agregarCampos("camposMedicamentos", "Medicamentos", "Indicaciones");
  });

  // Enviar el formulario con los datos recolectados
  const recetaForm = document.getElementById("recetaForm");
  recetaForm.addEventListener("submit", (event) => {
    event.preventDefault();

    // Enviar el formulario
    recetaForm.submit();
  });

  // ========================================================================================================
  // Href's
  const tel1 = document.querySelector("#textTel1");
  const tel2 = document.querySelector("#textTel2");
  const correo = document.querySelector("#textCorreo");

  // Validar número de teléfono
  function isValidPhone(phone) {
    // Esta expresión regular valida números de 10 dígitos
    const phoneRegex = /^\(\d{3}\) \d{3} \d{4}$/;
    return phoneRegex.test(phone);
  }

  // Validar formato de correo
  function isValidEmail(email) {
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    return emailRegex.test(email);
  }

  // Establecer href si el teléfono es válido
  if (isValidPhone(tel1.textContent)) {
    tel1.href = `tel:${tel1.textContent}`;
  } else {
    tel1.removeAttribute("href");
  }

  if (isValidPhone(tel2.textContent)) {
    tel2.href = `tel:${tel2.textContent}`;
  } else {
    tel2.removeAttribute("href");
  }

  // Establecer href si el correo es válido
  if (isValidEmail(correo.textContent)) {
    correo.href = `mailto:${correo.textContent}`;
  } else {
    correo.removeAttribute("href");
  }

  // ========================================================================================================
  // Diagnosticos
  // ========================================================================================================
  const Diagnosticos = document.querySelector(".Diagnosticos");
  if (!Diagnosticos) return;
  const contenidoDiag = Diagnosticos.querySelector(".region__content");
  if (!contenidoDiag) return;

  const crearInfoGroup = crearElemento_Diagnostico("infogroup");
  const crearInfo = crearElemento_Diagnostico("info");

  const numDiagnosticos = datosAlmacenados.Diagnosticos.length;

  // Si detecta que hay más de un diagnóstico, crea un elemento para cada uno
  if (numDiagnosticos >= 1) {
    const item1b = crearInfoItem_Diagnostico(datosAlmacenados.Diagnosticos);
    const item2b = crearInfoItem_Diagnostico("Input");
    crearInfo.appendChild(item1b);
    crearInfo.appendChild(item2b);
  } else {
    // Si no hay diagnósticos, crea un elemento vacío
    const item0 = crearInfoItem_Diagnostico("Input");
    crearInfo.appendChild(item0);
  }

  crearInfoGroup.appendChild(crearInfo);
  contenidoDiag.appendChild(crearInfoGroup);

  llenarSelect(InfoSelects);
  procesarInfoPaciente(datosAlmacenados);
}

// Función para crear un elemento que representa un medicamento
function crearElemento_DiagnosticoMedicamento(item) {
  const divMedicamentos = document.createElement("div");
  divMedicamentos.classList.add("elemento-receta");
  const dt = document.createElement("dt");
  dt.innerHTML = `<b>${item.Medicamento}:</b>`;
  const dd = document.createElement("dd");
  dd.innerHTML = `<p>${item.Indicacion}</p><br>`;

  divMedicamentos.appendChild(dt);
  divMedicamentos.appendChild(dd);
  return divMedicamentos;
}

// Función para crear un input para el medicamento o indicación
function crearInputMedicamento(item, tipo) {
  const input = document.createElement("input");
  input.type = "text";
  input.name = `Edit${tipo}`;
  input.placeholder = tipo;
  input.required = true;
  input.classList.add("input-receta", `${tipo.toLowerCase()}receta`); // Agregamos la clase 'input-receta'
  input.value = item[tipo];
  input.setAttribute("idMedicamento", item.idMedicamento);
  input.setAttribute("idMedicamento_Receta", item.idMedicamento_Receta);
  input.setAttribute("idReceta", item.idReceta);
  input.setAttribute("Orden", item.Orden);
  return input;
}

// Función para mostrar la receta en el DOM
function mostrarReceta(data) {
  const Receta = document.getElementById("Receta_actual");
  const TituloReceta = document.getElementById("Titulo_Receta");
  const Print = document.getElementById("Print");
  const Doctor = document.getElementById("Doctor");

  // Mostrar el nombre del doctor y el botón de imprimir
  Doctor.style.display = "block";
  Print.style.display = "inline-block";

  // Formatear y mostrar la fecha de la receta
  const { dia, mes, año } = formatearFecha(data.Recetas[0].Fecha);
  TituloReceta.innerHTML = `Ultima Receta <span>${dia}/${mes}/${año}</span>:`;
  Doctor.innerHTML = `<p>Recetado por: <b><span>${data.Recetas[0].Doctor}</span></b></p>`;

  const dl = document.createElement("dl");
  const formEditReceta = document.createElement("form");
  formEditReceta.style.display = "none";

  // Filtrar y mostrar cada medicamento de la receta
  const ultimareceta = data.Recetas[0].idReceta;
  const datosFiltrados = data.Recetas.filter(
    (item) => item.idReceta === ultimareceta
  );

  const ContenedorEditMedicamentos = document.createElement("div");
  ContenedorEditMedicamentos.id = "ContenedorEditMedicamentos";
  let contador = 0;
  datosFiltrados.forEach((item) => {
    contador = contador + 1;
    const divMedicamentos = crearElemento_DiagnosticoMedicamento(item);
    const divinputs = document.createElement("div");
    divinputs.classList.add(contador);

    const spanDrag = document.createElement("span");
    spanDrag.ariaHidden = true;
    spanDrag.textContent = "☰";
    spanDrag.classList.add("drag");
    const divSelector = document.createElement("div");
    divSelector.classList.add("selector");
    // Boton para eliminar el par de Medicamento e Indicación
    const botonQuitar = document.createElement("button");
    botonQuitar.type = "button";
    botonQuitar.textContent = "Eliminar";
    botonQuitar.classList.add("iconbtn--Eliminar");
    botonQuitar.addEventListener("click", () => {
      const divMedicamentos = botonQuitar.parentNode;
      const divinputs = divMedicamentos.parentNode;
      divinputs.parentNode.removeChild(divinputs);
    });
    dl.appendChild(divMedicamentos);
    divSelector.appendChild(crearInputMedicamento(item, "Medicamento"));
    divSelector.appendChild(botonQuitar);
    divSelector.appendChild(crearInputMedicamento(item, "Indicacion"));
    divinputs.appendChild(spanDrag);
    divinputs.appendChild(divSelector);
    ContenedorEditMedicamentos.appendChild(divinputs);
  });
  formEditReceta.appendChild(ContenedorEditMedicamentos);

  const contenedornota = document.createElement("div");
  contenedornota.classList.add("ContenedorNota");
  const contenedorbotones = document.createElement("div");
  contenedorbotones.classList.add("Botones");

  const botonAñadirMedicamento = document.createElement("button");
  botonAñadirMedicamento.type = "button";
  botonAñadirMedicamento.textContent = "Añadir Medicamento";
  botonAñadirMedicamento.classList.add("AñadirMedicamento");
  botonAñadirMedicamento.addEventListener("click", () => {
    agregarCampos(
      "ContenedorEditMedicamentos",
      "EditMedicamentos",
      "EditIndicaciones"
    );
  });

  const Nota = document.createElement("div");
  Nota.classList.add("Nota");
  Nota.style.display = "block";
  const NotaTitulo = document.createElement("h3");
  NotaTitulo.innerHTML = "Nota:";
  const NotaP = document.createElement("p");
  NotaP.innerHTML = data.Recetas[0].Nota;
  Nota.appendChild(NotaTitulo);
  Nota.appendChild(NotaP);

  const inputNota = document.createElement("input");
  inputNota.type = "text";
  inputNota.name = "EditNota";
  inputNota.placeholder = "Contenido de la Nota";
  inputNota.classList.add("input-receta", "inputNota"); // Agregamos la clase 'input-receta'
  inputNota.value = data.Recetas[0].Nota || "";

  const tituloNota = document.createElement("h3");
  tituloNota.innerHTML = "Nota:";
  formEditReceta.appendChild(tituloNota);

  contenedorbotones.appendChild(botonAñadirMedicamento);
  contenedornota.appendChild(inputNota);
  contenedornota.appendChild(contenedorbotones);
  formEditReceta.appendChild(contenedornota);

  Receta.appendChild(dl);
  Receta.appendChild(Nota);
  Receta.appendChild(formEditReceta);

  DragNDrop();
}

// DRAG AND DROP LISTA DE MEDICAMENTOS
function DragNDrop() {
  const zonaDragNDrop = document.getElementById("ContenedorEditMedicamentos");
  Sortable.create(zonaDragNDrop, {
    handle: ".drag",
    animation: 350,
  });
}

// ========================================================================================================
// Funciones para crear llenar con las peticiones ajax los campos de la pagina
// ========================================================================================================
function procesarInfoPaciente(data) {
  if (data.Recetas.length !== 0) {
    mostrarReceta(data);
  } else {
    document.getElementById("Receta_actual").innerHTML = "";
    const doctor = document.getElementById("Doctor");
    doctor.style.display = "block";
    doctor.textContent = "No hay recetas registradas.";
    const botones = document.querySelector(".Botones");
    botones.style.display = "none";
  }
}

function llenarSelect(data) {
  // Llenado para el Sexo
  const Sexo = document.getElementById("inputSexo");
  data.Sexo.forEach((element) => {
    const ListaSex = new Option(element.Sexo, element.idSexo);
    Sexo.appendChild(ListaSex);
  });
}
