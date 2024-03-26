// ========================================================================================================
// Seguimientos
// ========================================================================================================
function cargarSeguimiento() {
  const Seguimientos = document.querySelector(".Seguimientos");
  if (!Seguimientos) return;
  const contenidoDiag = Seguimientos.querySelector(".region__content");
  if (!contenidoDiag) return;

  const crearInfoGroup = crearElemento_Seguimiento("infogroup");
  const crearInfo = crearElemento_Seguimiento("info");

  const contHeaderSeguimientos = document.getElementById(
    "contHeaderSeguimientos"
  );

  // Definimos el padecimento Inicial en null
  let PadecimentoInicial = null;

  // Si existen seguimientos
  if (datosAlmacenados.Seguimientos.length > 0) {
    // Crear un Set para almacenar combinaciones únicas de idPadecimiento y Padecimiento
    let padecimientosUnicos = new Set();

    // Iterar sobre los seguimientos y agregar al Set
    datosAlmacenados.Seguimientos.forEach((seguimiento) => {
      padecimientosUnicos.add(
        JSON.stringify({
          idArea: seguimiento.idArea,
          idPadecimiento: seguimiento.idPadecimiento,
          Padecimiento: seguimiento.Padecimiento,
        })
      );
    });

    // Convertir el Set nuevamente en un array de objetos
    let arrayPadecimientos = Array.from(padecimientosUnicos).map((item) =>
      JSON.parse(item)
    );

    PadecimentoInicial = arrayPadecimientos[0].idPadecimiento;
    const Seguimientos = crearElementoHeader_Seguimiento("", "HeaderTags");
    contHeaderSeguimientos.appendChild(Seguimientos);
  }

  crearInfo.appendChild(crearSOAP());

  const numSeguimientos = datosAlmacenados.Seguimientos.length;

  // Si detecta que hay más de un diagnóstico, crea un elemento para cada uno
  if (numSeguimientos >= 1) {
    const Seguimientos = crearInfoItem_HistorialSeguimiento(
      datosAlmacenados.Seguimientos.filter(
        // Filtramos los seguimientos por el idPadecimiento con el padecimiento inicial
        (seguimiento) => seguimiento.idPadecimiento == PadecimentoInicial
      )
    );
    crearInfo.appendChild(Seguimientos);
  }

  crearInfoGroup.appendChild(crearInfo);
  contenidoDiag.appendChild(crearInfoGroup);

  // Y pasamos a la siguiente función
  cargarUltimaReceta();
}

// ========================================================================================================
// Assets de los Seguimientos
// ========================================================================================================
function crearInfoItem_HistorialSeguimiento(contenido) {
  const item = crearElemento_Seguimiento("info__item");
  item.classList.add("Historial_Seguimientos");
  const itemContent = crearElemento_Seguimiento("info__item__content");

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
    const header = document.createElement("div");
    header.classList.add("info__item__header");
    const fechaheader = document.createElement("h3");
    fechaheader.textContent =
      "SEGUIMIENTO " + fecha.dia + "/" + fecha.mes + "/" + fecha.año + ":";
    fechaheader.classList.add("info__item__title");
    const doctor = document.createElement("h4");
    doctor.textContent = elemento.Doctor;
    doctor.style.margin = "0px";
    header.appendChild(fechaheader);
    header.appendChild(doctor);

    // console.log(elemento);

    itemContent.appendChild(header);
    itemContent.appendChild(verAntiguosSOAP(elemento));

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

  item.appendChild(itemContent);
  return item;
}

// ========================================================================================================
// Funcion para crear conteido de Seguimientos
// ========================================================================================================

function crearElemento_Seguimiento(clase) {
  const elemento = document.createElement("div");
  elemento.classList.add(clase);
  return elemento;
}

function crearElementoHeader_Seguimiento(Fecha, idDiv, Doctor) {
  const elemento = document.createElement("header");
  elemento.classList.add("info__item__header");

  const titulo = document.createElement("h3");
  titulo.classList.add("info__item__title");
  titulo.textContent = Fecha;
  elemento.appendChild(titulo);

  const etiquetasDiv = document.createElement("div");
  etiquetasDiv.classList.add("info__item__tags");

  const cont_etiquetas = document.createElement("div");
  cont_etiquetas.id = idDiv;

  etiquetasDiv.appendChild(cont_etiquetas);
  elemento.appendChild(etiquetasDiv);

  return elemento;
}

function crearSOAP() {
  const contenedorSuperior = document.createElement("div");
  contenedorSuperior.classList.add("info__item");
  contenedorSuperior.classList.add("SOAP");
  const contenedorSOAP = document.createElement("div");
  contenedorSOAP.classList.add("info__item__content");
  contenedorSOAP.style.display = "flex";
  contenedorSOAP.style.flexDirection = "column";
  const S = document.createElement("p");
  S.textContent = "(S)Subjetivo";
  contenedorSOAP.appendChild(S);
  const textArea1 = document.createElement("textarea");
  textArea1.classList.add("info__item__textarea");
  textArea1.placeholder = "Escribe el analisis subjetivo aquí...";
  contenedorSOAP.appendChild(textArea1);
  const O = document.createElement("p");
  O.textContent = "(O)Objetivo";
  contenedorSOAP.appendChild(O);
  const textArea2 = document.createElement("textarea");
  textArea2.classList.add("info__item__textarea");
  textArea2.placeholder = "Escribe el analisis objetivo aquí...";
  contenedorSOAP.appendChild(textArea2);
  const A = document.createElement("p");
  A.textContent = "(A)Apreciación";
  contenedorSOAP.appendChild(A);

  const selectApreciacion = document.createElement("select");
  selectApreciacion.setAttribute("multiple", "multiple");
  selectApreciacion.classList.add("info__item__select");

  contenedorSOAP.appendChild(selectApreciacion);

  // /Buscar_Padecimiento
  $(selectApreciacion)
    .select2({
      placeholder: "Escribe o selecciona un padecimiento...",
      tags: true,
      tokenSeparators: [","],
      // minimumInputLength: 3,
      ajax: {
        url: "/Buscar_Padecimiento",
        method: "POST",
        dataType: "json",
        delay: 250,
        data: function (params) {
          return {
            // Pasar el término de búsqueda como el parámetro "Padecimiento"
            Padecimiento: params.term,
          };
        },
        processResults: function (data) {
          // Agrupar los padecimientos por el idArea
          const groupedData = data.reduce((acc, current) => {
            const areaIndex = acc.findIndex(
              (group) => group.id === current.idArea
            );
            if (areaIndex === -1) {
              acc.push({
                id: current.idArea,
                text: current.Area,
                children: [
                  {
                    id: current.idPadecimiento,
                    text: current.Padecimiento,
                  },
                ],
              });
            } else {
              acc[areaIndex].children.push({
                id: current.idPadecimiento,
                text: current.Padecimiento,
              });
            }
            return acc;
          }, []);

          return {
            results: groupedData,
            pagination: {
              more: false,
            },
          };
        },
        // Habilita el almacenamiento en caché de los resultados de la consulta
        cache: true,
      },
      createTag: function (params) {
        var term = $.trim(params.term);
        if (term === "") {
          return null;
        }
        return {
          id: term,
          text: term,
          newTag: true,
        };
      },
    })
    .on("select2:selecting", function (e) {
      // Verifica si el tag seleccionado es un nuevo tag
      if (e.params.args.data.newTag) {
        // Llama a la función para crear el tag una vez que se presione Enter
        crearNuevoTag(e.params.args.data);
        // Detiene la acción predeterminada de Select2 para que no cree el tag automáticamente
        e.preventDefault();
      }
    });

  async function crearNuevoTag(data) {
    // Aquí puedes implementar la lógica para crear el nuevo tag
    console.log("Crear nuevo tag:", data);

    const areas = {};

    InfoSelects.Areas.forEach((area) => {
      areas[area.idAreas] = area.Area;
    });
    const { value: idArea } = await Swal.fire({
      title: "Crear nuevo padecimiento",
      text: `¿Estás seguro de registrar "${data.text}" como nuevo padecimiento?`,
      input: "select",
      inputOptions: areas,
      inputPlaceholder: "Seleciona el área",
      showCancelButton: true,
      inputValidator: (value) => {
        return new Promise((resolve) => {
          console.log(value);
          if (value != null && value != "") {
            resolve();
          } else {
            resolve("Por favor, selecciona un área válida.");
          }
        });
      },
    });
    if (idArea) {
      $.ajax({
        url: "/NuevoPadecimiento",
        method: "POST",
        data: {
          Padecimiento: data.text,
          idArea: idArea,
        },
      })
        .done((data) => {
          console.log(data);
          Swal.fire({
            title: "Padecimiento registrado",
            icon: "success",
            text: `El padecimiento "${data.text}" ha sido registrado con éxito.`,
          });
        })
        .fail((error) => {
          console.error(error);
          Swal.fire({
            title: "Error registrado padeceimiento",
            icon: "error",
            text: `Algo salió mal al registrar el padecimiento "${data.text}". Por favor, intenta de nuevo. Error: ${error}`,
          });
        });
    }
  }

  const btnGuardar = document.createElement("button");
  btnGuardar.classList.add("iconbtn--save");
  btnGuardar.textContent = "Guardar";
  btnGuardar.style.backgroundColor = "#73c235";
  btnGuardar.addEventListener("click", () => {
    if (textArea1.value == "" || textArea2.value == "") {
      Swal.fire({
        title: "Campos vacíos",
        icon: "warning",
        text: "Por favor, llena todos los campos antes de guardar.",
      });
      return;
    }
    if ($(selectApreciacion).select2("data").length == 0) {
      Swal.fire({
        title: "Padecimiento no seleccionado",
        icon: "warning",
        text: "Por favor, selecciona al menos un padecimiento antes de guardar.",
      });
      return;
    }
    // Obtener la parte de la URL después del nombre de dominio
    var path = window.location.pathname;

    // Dividir la URL en partes usando "/" como separador
    var parts = path.split("/");

    // El ID del paciente será el último elemento del array parts
    var idPaciente = parts[parts.length - 1];

    const padecimientos = $(selectApreciacion)
      .select2("data")
      .map((padecimiento) => padecimiento.id);
    console.log(padecimientos);
    $.ajax({
      url: "/Crear_Seguimiento",
      method: "POST",
      data: {
        idDoctor: InfoSesion.EsDoctor ? InfoSesion.ID : null,
        idSesion:
          datosAlmacenados.SesionesActivas.length > 0
            ? datosAlmacenados.SesionesActivas[0].idSesion
            : null,
        idPaciente: idPaciente,
        Subjetivo: textArea1.value,
        Objetivo: textArea2.value,
        idPadecimientos: padecimientos,
      },
    })
      .done(() => {
        Swal.fire({
          title: "Seguimiento guardado",
          icon: "success",
          text: "El seguimiento ha sido guardado con éxito.",
        }).then(() => {
          location.reload();
        });
      })
      .fail(() => {
        Swal.fire({
          title: "Error al guardar",
          icon: "error",
          text: "Algo salió mal al guardar el seguimiento. Por favor, intenta de nuevo.",
        });
      });

  });
  contenedorSOAP.appendChild(btnGuardar);

  contenedorSuperior.appendChild(contenedorSOAP);
  return contenedorSuperior;
}

function verAntiguosSOAP(elemento) {
  const contenedor = document.createElement("div");
  contenedor.classList.add("Contenedor__Diagnosticos");

  contenedor.appendChild(
    crearElementoAntiguosSOAP("(S)Subjetivo", elemento.Subjetivo, elemento)
  );
  contenedor.appendChild(
    crearElementoAntiguosSOAP("(O)Objetivo", elemento.Objetivo, elemento)
  );

  const contApreciacion = document.createElement("div");
  contApreciacion.classList.add("Contenedor__SOAP");
  const ApreciacionTitle = document.createElement("h2");
  ApreciacionTitle.textContent = "(A)Apreciación:";
  const ApreciacionContent = document.createElement("p");
  if (elemento.Padecimientos.length > 0) {
    const Padecimiento = document.createElement("p");
    elemento.Padecimientos.forEach((padecimiento, index) => {
      Padecimiento.textContent =
        Padecimiento.textContent + padecimiento.Padecimiento;
      if (elemento.Padecimientos.length - 1 != index) {
        Padecimiento.textContent = Padecimiento.textContent + ", ";
      } else {
        Padecimiento.textContent = Padecimiento.textContent + ".";
      }
    });
    ApreciacionContent.appendChild(Padecimiento);
  } else {
    ApreciacionContent.textContent = "No fue registrada una apreciación";
  }

  contApreciacion.appendChild(ApreciacionTitle);
  contApreciacion.appendChild(ApreciacionContent);
  contenedor.appendChild(contApreciacion);

  return contenedor;
}

function crearElementoAntiguosSOAP(titulo, contenido, array) {
  // console.log(array);
  const contenedor = document.createElement("div");
  contenedor.classList.add("Contenedor__SOAP");
  //Header
  const contHeader = document.createElement("div");
  contHeader.classList.add("Contenedor__SOAP__Header");
  const Title = document.createElement("h2");
  Title.textContent = titulo;
  contHeader.appendChild(Title);

  //Content
  const contContent = document.createElement("p");
  contContent.textContent =
    contenido || `No fue registrado un ${titulo.toLowerCase()}`;

  const textArea = document.createElement("textarea");
  textArea.classList.add("info__item__textarea");
  textArea.style.display = "none";

  //Contenedor
  const contBotones = document.createElement("div");
  contBotones.classList.add("Contenedor__SOAP__Botones");
  //Boton de editar
  const editar = document.createElement("button");
  editar.classList.add("iconbtn--editar");
  editar.textContent = "Editar";
  editar.addEventListener("click", () => {
    textArea.style.display = "block";
    textArea.value = contContent.textContent;
    contContent.style.display = "none";
    editar.style.display = "none";
    guardar.style.display = "block";
    cancelar.style.display = "block";
  });
  contBotones.appendChild(editar);

  // Boton de cancelar
  const cancelar = document.createElement("button");
  cancelar.style.display = "none";
  cancelar.classList.add("iconbtn--cancel");
  cancelar.textContent = "Cancelar";
  cancelar.addEventListener("click", () => {
    textArea.style.display = "none";
    textArea.value = contContent.textContent;
    contContent.style.display = "block";
    editar.style.display = "block";
    guardar.style.display = "none";
    cancelar.style.display = "none";
  });
  contBotones.appendChild(cancelar);

  //Boton de guardar
  const guardar = document.createElement("button");
  guardar.style.display = "none";
  guardar.classList.add("iconbtn--save");
  guardar.textContent = "Guardar";
  guardar.addEventListener("click", () => {
    $.ajax({
      url: "/Update_Seguimiento",
      method: "POST",
      data: {
        idSeguimiento: array.idSeguimientos,
        tipo: titulo,
        contenido: textArea.value,
      },
    })
      .done(() => {
        contContent.textContent = textArea.value;
        contContent.style.display = "block";
        textArea.style.display = "none";
        editar.style.display = "block";
        guardar.style.display = "none";
        cancelar.style.display = "none";
      })
      .fail((error) => {
        Swal.fire({
          title: "Error al guardar",
          icon: "error",
          text: `Algo salió mal al guardar los cambios. Por favor, intenta de nuevo. Error: ${error[0]}`,
        });
      });
  });
  contBotones.appendChild(guardar);
  contHeader.appendChild(contBotones);

  contenedor.appendChild(contHeader);
  contenedor.appendChild(contContent);
  contenedor.appendChild(textArea);

  return contenedor;
}
