// ====================================================
// Creamos la vista general
// ====================================================
async function cargarGeneral() {
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
            <p id="textSexo">${await datosAlmacenados.BasicInfo[0].Sexo}</p>
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
              <h3 class="info__item__title">Tel:</h3>
              <button class="iconbtn--edit" id="editarTel1"></button>
              <button class="iconbtn--cancelar" id="cancelarTel1" style="display:none;"></button>
              <button class="iconbtn--confirm" id="confirmarTel1" style="display:none;">Confirmar</button>
            </header>
            <a id="textTel1" href="#">${
              (await datosAlmacenados.BasicInfo[0].Tel1) ||
              "No hay telefono registrado"
            }</a>
            <input type="tel" name="inputTel1" id="inputTel1" value="${await datosAlmacenados
              .BasicInfo[0]
              .Tel1}" style="display:none;" placeholder="(XXX) XXX XXXX" />
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
              (await datosAlmacenados.BasicInfo[0].Tel2) ||
              "No hay telefono secundario registrado"
            }</a>
            <input type="tel" name="inputTel2" id="inputTel2" value="${await datosAlmacenados
              .BasicInfo[0]
              .Tel2}" style="display:none;" placeholder="(XXX) XXX XXXX" />
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
              (await datosAlmacenados.BasicInfo[0].Correo) ||
              "No hay correo registrado"
            }</a>
            <input type="text" name="inputCorreo" id="inputCorreo" value="${await datosAlmacenados
              .BasicInfo[0]
              .Correo}" style="display:none;" placeholder="ejemplo@correo.com" />
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
            <p id="textA_PP">${await datosAlmacenados.Antecedentes[0].A_PP}</p>
            <input type="text" name="inputA_PP" id="inputA_PP" value="${await datosAlmacenados
              .Antecedentes[0].A_PP}" style="display:none;"/>
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
            <p id="textA_NP">${await datosAlmacenados.Antecedentes[0].A_NP}</p>
            <input type="text" name="inputA_NP" id="inputA_NP" value="${await datosAlmacenados
              .Antecedentes[0].A_NP}" style="display:none;" />
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
            <p id="textA_HF">${await datosAlmacenados.Antecedentes[0].A_HF}</p>
            <input type="text" name="inputA_HF" id="inputA_HF" value="${await datosAlmacenados
              .Antecedentes[0].A_HF}" style="display:none;" />
          </div>
        </div>
      </div>
    </div>
  </div>
  
<div class="Diagnosticos">
<h2>DIAGNOSTICOS:</h2>
<div class="info__item"></div>
</div>

  <section class="region" id="RA">
    <h2 id="Titulo_Receta">Ultima Receta:</h2>
    <div class="infogroup">
      <div class="info__item">
        <div class="info__item__content">
          <header class="info__item__header">
            <div id="Doctor" style="font-size:18px; display:none;">Cargando Doctor...</div>
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
                <button type="button" id="quitarCampo" style="display:none;">Quitar Medicamento</button>
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
      if (Status) {
        data.StatusUsuario.forEach((element) => {
          const ListaStat = new Option(element.Status, element.idStatus);
          Status.appendChild(ListaStat);
        });
      } else {
        console.log("No hay status");
      }
    },
  });
  // ========================================================================================================
  // Peticion para insertar ultima receta
  // ========================================================================================================
  // Petición AJAX para obtener los datos de la receta
  $.ajax({
    url: "/InfoPaciente",
    method: "POST",
    dataType: "json",
    success: (data) => {
      if (data.Recetas.length !== 0) {
        mostrarReceta(data);
      } else {
        document.getElementById("Receta_actual").innerHTML;
        const doctor = document.getElementById("Doctor");
        doctor.style.display = "block";
        doctor.textContent = "No hay recetas registradas.";
        const botones = document.querySelector(".Botones");
        botones.style.display = "none";
      }
    },
    error: (error) => {
      console.error(error);
      // Se puede proporcionar retroalimentación al usuario aquí.
    },
  });

  // Función para crear un elemento que representa un medicamento
  function crearElementoMedicamento(item) {
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
    datosFiltrados.forEach((item) => {
      const divMedicamentos = crearElementoMedicamento(item);
      const divinputs = document.createElement("div");

      // Boton para eliminar el par de Medicamento e Indicación
      const botonQuitar = document.createElement("button");
      botonQuitar.type = "button";
      botonQuitar.textContent = "Eliminar";
      botonQuitar.addEventListener("click", () => {
        const divMedicamentos = botonQuitar.parentNode;
        divMedicamentos.parentNode.removeChild(divMedicamentos);
      });
      dl.appendChild(divMedicamentos);
      divinputs.appendChild(crearInputMedicamento(item, "Medicamento"));
      divinputs.appendChild(botonQuitar);
      divinputs.appendChild(crearInputMedicamento(item, "Indicacion"));
      ContenedorEditMedicamentos.appendChild(divinputs);
    });
    formEditReceta.appendChild(ContenedorEditMedicamentos);

    Receta.appendChild(dl);
    Receta.appendChild(formEditReceta);

    // Si existe una nota, se muestra
    if (data.Recetas[0].Nota) {
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
      inputNota.placeholder = "Nota";
      inputNota.required = true;
      inputNota.classList.add("input-receta", "inputNota"); // Agregamos la clase 'input-receta'
      inputNota.value = data.Recetas[0].Nota;
      inputNota.style.maxWidth = "70%";

      const tituloNota = document.createElement("h3");
      tituloNota.innerHTML = "Nota:";
      Receta.appendChild(Nota);
      formEditReceta.appendChild(tituloNota);
      formEditReceta.appendChild(inputNota);
    }
  }

  // ========================================================================================================
  // Mapa de botones para editar datos
  // ========================================================================================================
  const editarBotones = {
    editarAlergias: "Alergias",
    editarA_HF: "A_HF",
    editarA_NP: "A_NP",
    editarA_PP: "A_PP",
    editarFechaDeNac: "FechaDeNac",
    editarSexo: "Sexo",
    editarTel1: "Tel1",
    editarTel2: "Tel2",
    editarCorreo: "Correo",
    editarStatus: "Status",
    // ... (otros botones)
  };

  Object.keys(editarBotones).forEach((id) => {
    agregarEventListener(id, () => editarDato(editarBotones[id]));
  });

  // ========================================================================================================
  // Mapeo de botones para confirmar los cambios
  // ========================================================================================================

  const confirmarBotones = {
    confirmarAlergias: ["Alergias", " ", 1],
    confirmarA_HF: ["A_HF", " ", 1],
    confirmarA_NP: ["A_NP", " ", 1],
    confirmarA_PP: ["A_PP", " ", 1],
    confirmarFechaDeNac: ["FechaDeNac", "FechadeNacimiento", 2],
    confirmarSexo: ["Sexo", "idSexo", 2],
    confirmarTel1: ["Tel1", "Telefono", 2],
    confirmarTel2: ["Tel2", "TelefonoSecundario", 2],
    confirmarCorreo: ["Correo", "Correo", 2],
    confirmarStatus: ["Status", "idStatus", 3],
    // ... (otros botones)
  };

  Object.keys(confirmarBotones).forEach((id) => {
    const [dato, otroParam, tercerParam] = confirmarBotones[id];
    agregarEventListener(id, () =>
      confirmarEdicion(dato, otroParam, tercerParam)
    );
  });

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

    // Ocultamos todos los elementos generados con 'crearElementoMedicamento'
    const elementosReceta = document.querySelectorAll(".elemento-receta");
    elementosReceta.forEach((elemento) => {
      elemento.style.display = "none";
    });

    const botonAñadirMedicamento = document.createElement("button");
    botonAñadirMedicamento.type = "button";
    botonAñadirMedicamento.textContent = "Añadir Medicamento";
    botonAñadirMedicamento.addEventListener("click", () => {
      agregarCampos(
        "ContenedorEditMedicamentos",
        "EditMedicamentos",
        "EditIndicaciones"
      );
    });

    const botonQuitarMedicamento = document.createElement("button");
    botonQuitarMedicamento.type = "button";
    botonQuitarMedicamento.textContent = "Quitar Medicamento";
    botonQuitarMedicamento.addEventListener("click", () => {
      eliminarUltimosCampos("ContenedorEditMedicamentos");
    });
    formEditReceta.appendChild(botonQuitarMedicamento);
    formEditReceta.appendChild(botonAñadirMedicamento);
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
    // Mostramos todos los elementos generados con 'crearElementoMedicamento'
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
    alert("Vamos a guardar cambios");

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
    function getOrCreateIframeBySrc(src) {
      // Buscar iframes en el documento y filtrar por el atributo src
      let iframes = Array.from(document.querySelectorAll("iframe"));
      let iframe = iframes.find((iframe) => iframe.src.endsWith(src));

      // Si el iframe no existe con ese src, lo crea y lo añade al documento
      if (!iframe) {
        iframe = document.createElement("iframe");
        iframe.style.display = "none";
        document.body.appendChild(iframe);
      } else {
        iframe.contentWindow.location.reload();
      }

      return iframe;
    }

    // Definir el src
    let src = `/Receta/${idPaciente}/${idReceta}`;

    // Usando la función getOrCreateIframeBySrc para obtener o crear el iframe
    let iframe = getOrCreateIframeBySrc(src);

    // Establece el evento onload solo si es necesario
    if (!iframe.onload) {
      iframe.onload = function () {
        setTimeout(function () {
          iframe.contentWindow.print();
        }, 200);
      };
    }

    // Establece el atributo src para cargar el contenido y disparar el evento onload
    iframe.src = src;

    // window.open(`/Receta/${idPaciente}/${idReceta}`, "_blank");
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

  // Escuchar clic en el botón "Agregar"
  const agregarBoton = document.getElementById("agregarCampo");
  agregarBoton.addEventListener("click", (event) => {
    quitarBoton.style.display = "block";
    agregarCampos("camposMedicamentos", "Medicamentos", "Indicaciones");
  });

  // Escuchar clic en el botón "quitar"
  const quitarBoton = document.getElementById("quitarCampo");
  quitarBoton.addEventListener("click", (event) => {
    const camposMedicamentos = document.getElementById("camposMedicamentos");
    // Obtén todos los elementos hijos (los pares de Medicamento e Indicación)
    const elementosHijos =
      camposMedicamentos.querySelectorAll("input[type='text']");
    if (elementosHijos.length > 4) {
      eliminarUltimosCampos("camposMedicamentos");
    } else {
      eliminarUltimosCampos("camposMedicamentos");
      quitarBoton.style.display = "none";
    }
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
