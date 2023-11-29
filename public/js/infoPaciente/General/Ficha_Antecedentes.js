// ========================================================================================================
// Aqui empieza el codigo de la seccion General
// ========================================================================================================
function cargarGeneral() {
  console.log(datosAlmacenados);
  console.log(InfoSesion);
  console.log(InfoSelects);
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
                datosAlmacenados.BasicInfo[0].Tel1 ||
                "No hay telefono registrado"
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
                datosAlmacenados.BasicInfo[0].Correo ||
                "No hay correo registrado"
              }</a>
              <input type="text" name="inputCorreo" id="inputCorreo" value="${
                datosAlmacenados.BasicInfo[0].Correo || ""
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
    
    <div class="Seguimientos">
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
                  <button type="submit" id="GuardarReceta">Guardar Receta</button>
                </header>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  
    <section class="region" id="NC">
      <div class="infogroup">
        <div class="info__item">
          <div class="info__item__content">
            <header class="info__item__header">
              <h2>Nueva Cita:</h2>
              <button type="button" id="cancelarCita" style="display:none;">Cancelar</button>
              <button type="button" id="botonNuevaCita">Nueva Cita</button>
            </header>
            <div class="NuevaCita" id="NuevaCita" style="display:none;">
              <div class="ControlesNuevaCita">
                <div class="flatpickr">
                  <h2>Fecha de la cita:</h2>
                  <div class="calendaroNuevaCita">
                    <input name="fechaNuevaCita" id="fechaNuevaCita" type="text" placeholder="Elegir fecha..." data-input> 
                    <a class="input-button" title="clear" data-clear>
                        <i class="bi bi-x-lg"></i>
                    </a>
                  </div>
                  <div class="duracion">
                  <span>Duracion:</span>
                  <select name="Duracion" id="Duracion">
                    <option value="10">10 minutos</option>
                    <option value="15">15 minutos</option>
                    <option value="20">20 minutos</option>
                    <option value="30" selected>30 minutos</option>
                    <option value="45">45 minutos</option>
                    <option value="60">1 hora</option>
                  </select>
                  </div>
                </div>
                <div class="SeleccionarDoctor">
                <h2>Medico:</h2>
                  <select name="idDoctor" id="citaDoctor">
                    <option value="" disabled selected>Elige a un especialista...</option>
                  </select>
                </div>

                <div class="SeleccionarProcedimiento">
                <h2>Procedimiento:</h2>
                  <select name="idProcedimiento" id="procedimientoCita" >
                    <option value="" disabled selected>Elige un procedimiento...</option>
                  </select>
                </div>
                <div class="SeleccionarSucursal">
                <h2>Sucursal:</h2>
                  <select name="idSucursal" id="sucursalCita">
                    <option value="" disabled selected>Elige una sucursal...</option>
                  </select>
                </div>
                <div class="nuevaCitaNota">
                  <h2>Nota (Opcional):</h2>
                  <textarea id="NotaNuevaCita" placeholder="Nota" class="inputNuevaCitaNota"></textarea>
                </div>
                <div class="Cont_BotonGuardarCita">
                  <button type="submit" id="GuardarCita">Agendar Cita</button>
                </div>
              </div>
              <div class="InfoCitas">
                <div class="TextoListaCitas">
                  <h2>Citas agendadas:</h2>
                </div>
                <div class="ListaCitas">
                <p>Elige un dia en la fecha de cita para ver las citas agendadas para ese dia.</p>
                </div>
                <div id="PaginacionListaCitas">
                </div>
              </div>
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

  // ========================================================================================================
  // Href's
  // ========================================================================================================
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

  // Llenamos los Select's para el Sexo
  const Sexo = document.getElementById("inputSexo");
  InfoSelects.Sexo.forEach((element) => {
    const ListaSex = new Option(element.Sexo, element.idSexo);
    Sexo.appendChild(ListaSex);
  });

  // Y pasamos a la siguente parte de la pagina
  cargarSeguimiento();
}
