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

  const numSeguimientos = datosAlmacenados.Seguimientos.length;
  const numSesionesActivas = datosAlmacenados.SesionesActivas.length;

  // Si detecta que hay más de un diagnóstico, crea un elemento para cada uno
  if (numSeguimientos >= 1) {
    const Seguimientos = crearInfoItem_Seguimiento(
      "NotasSeguimiento",
      datosAlmacenados.Seguimientos
    );
    crearInfo.appendChild(Seguimientos);
  } else {
    // Si no, crea un elemento que indica que no hay notas de seguimiento registrados
    const item = crearElemento_Seguimiento("info__item");
    const itemContent = crearElemento_Seguimiento("info__item__content");
    itemContent.textContent = "Aun no hay notas de seguimientos registrados.";
    item.appendChild(itemContent);
    crearInfo.appendChild(item);
  }

  // Si detecta Sesiones Activas, crea un input para poder insertarla
  if (numSesionesActivas >= 1) {
    const Input = crearInfoItem_Seguimiento(
      "SeguiminetoActual",
      datosAlmacenados.SesionesActivas
    );
    crearInfo.appendChild(Input);
  }

  crearInfoGroup.appendChild(crearInfo);
  contenidoDiag.appendChild(crearInfoGroup);

  // Y pasamos a la siguiente función
  cargarUltimaReceta();
}

// ========================================================================================================
// Assets de los Seguimientos
// ========================================================================================================
function crearInfoItem_Seguimiento(tipo, contenido) {
  const item = crearElemento_Seguimiento("info__item");
  const itemContent = crearElemento_Seguimiento("info__item__content");

  //Eliminamos el ultimo por que ya se muestra en otra vista
  if (tipo == "NotasSeguimiento") {
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
      const header = crearElementoHeader_Seguimiento(
        "SEGUIMIENTO " + fecha.dia + "/" + fecha.mes + "/" + fecha.año + ":",
        "Etiquetas",
        datosAlmacenados.Tags.filter(
          (tag) => tag.idSesion == contenido[paginaActual - 1].idSesion
        )
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
  } else if (tipo == "SeguiminetoActual") {
    console.log(contenido);
    const fecha_sesion = formatearFecha(contenido[0].InicioSesion);
    const fechaActual = new Date();
    const FormatoFechaActual =
      fechaActual.getDate() +
      "/" +
      (fechaActual.getMonth() + 1) +
      "/" +
      (fechaActual.getFullYear() % 100);
    const FormatoFechaSesion =
      fecha_sesion.dia + "/" + fecha_sesion.mes + "/" + fecha_sesion.año;

    item.classList.add("SeguimientoHoy");
    const header = crearElementoHeader_Seguimiento(
      FormatoFechaActual == FormatoFechaSesion
        ? `SEGUIMINETO HOY:`
        : `SEGUIMINETO (${FormatoFechaSesion}):`,
      "Etiquetas_Actuales",
      datosAlmacenados.Tags.filter(
        (tag) => tag.idSesion == contenido[0].idSesion
      )
    );

    itemContent.appendChild(header);

    const input = document.createElement("textarea");
    input.classList.add("info__item__textarea");
    input.placeholder = "Escribe el seguimiento aquí...";
    input.value = contenido[0].Seguimiento || "";
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
    textinput.textContent = contenido[0].Seguimiento || "";
    textinput.style.display = "none";
    textinput.style.visibility = "0";
    cont_text.appendChild(textinput);
    itemContent.appendChild(cont_text);

    // Creamos el footer para los botones y diagnosticos
    const footerSeguimiento = document.createElement("div");
    footerSeguimiento.classList.add("footerSeguimiento");

    // Ahora creamos el contenedor para los diagnosticos
    const cont_diagnostics = document.createElement("div");
    cont_diagnostics.classList.add("Cont_Diagnosticos");
    const Busqueda_Diagnostic = document.createElement("input");
    Busqueda_Diagnostic.type = "text";
    Busqueda_Diagnostic.id = "inputDiagnostic";
    Busqueda_Diagnostic.placeholder = "Buscar Diagnosticos...";
    Busqueda_Diagnostic.classList.add("inputDiagnostic");

    const Crear_padecimiento = document.createElement("div");
    Crear_padecimiento.classList.add("Crear_padecimiento");

    const input_NuevoPadecimiento = document.createElement("input");
    input_NuevoPadecimiento.type = "text";
    input_NuevoPadecimiento.id = "input_NuevoPadecimiento";
    input_NuevoPadecimiento.placeholder = "Nuevo Padecimiento...";
    input_NuevoPadecimiento.required = true;

    const Areas = document.createElement("select");
    Areas.id = "Areas";
    Areas.classList.add("Areas");
    for (let index = 0; index < InfoSelects.Areas.length; index++) {
      const element = InfoSelects.Areas[index];
      const option = document.createElement("option");
      option.value = element.idAreas;
      option.textContent = element.Area;
      Areas.appendChild(option);
    }

    const BotonCrearPadecimiento = document.createElement("button");
    BotonCrearPadecimiento.type = "button";
    BotonCrearPadecimiento.textContent = "Guardar";
    BotonCrearPadecimiento.classList.add("GuardarPadecimiento");
    BotonCrearPadecimiento.addEventListener("click", () => {
      const nuevoPadecimiento = input_NuevoPadecimiento.value;
      const idArea = Areas.value;
      if (input_NuevoPadecimiento.checkValidity()) {
        fetch("/NuevoPadecimiento", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            Padecimiento: nuevoPadecimiento,
            idArea: idArea,
          }),
        });
        Crear_padecimiento.style.display = "none";
        Busqueda_Diagnostic.style.display = "block";
        botonGuardar.style.display = "block";
      } else {
        input_NuevoPadecimiento.focus();
      }
    });

    const BotonCancelarPadecimiento = document.createElement("button");
    BotonCancelarPadecimiento.type = "button";
    BotonCancelarPadecimiento.textContent = "Cancelar";
    BotonCancelarPadecimiento.classList.add("CancelarPadecimiento");
    BotonCancelarPadecimiento.addEventListener("click", () => {
      Crear_padecimiento.style.display = "none";
      Busqueda_Diagnostic.style.display = "block";
      botonGuardar.style.display = "block";
    });

    Crear_padecimiento.style.display = "none";
    Crear_padecimiento.appendChild(input_NuevoPadecimiento);
    Crear_padecimiento.appendChild(Areas);
    Crear_padecimiento.appendChild(BotonCancelarPadecimiento);
    Crear_padecimiento.appendChild(BotonCrearPadecimiento);

    cont_diagnostics.appendChild(Crear_padecimiento);
    cont_diagnostics.appendChild(Busqueda_Diagnostic);

    //Autocompletado
    const datosFiltrados = datosAlmacenados.Tags.filter(
      (tag) => tag.idSesion == contenido[0].idSesion
    );

    // Usar el operador de propagación para añadir cada elemento filtrado individualmente al array
    arraydiagnosticos.push(...datosFiltrados);

    // Función para actualizar los resultados del autocompletado
    const actualizarAutocompletado = (input, resultados) => {
      const valorInput = input.value.toLowerCase();
      resultados.innerHTML = ""; // Limpia resultados anteriores

      if (!valorInput) return;
      // Tus datos de autocompletado
      $.ajax({
        url: "/Buscar_Padecimiento",
        method: "POST",
        dataType: "json",
        data: { Padecimiento: valorInput },
        success: function (data) {
          // Ahora los diagnosticos están en 'data'
          const filtrados = data.filter((item) =>
            item.Padecimiento.toLowerCase().includes(valorInput)
          );
          // Aquí procesamos los resultados
          procesarResultados(filtrados, input, resultados, valorInput);
        },
        error: function (error) {
          console.log(error);
        },
      });
    };

    const procesarResultados = (filtrados, input, resultados, valorInput) => {
      // En caso de que los resultados sean menos de 3, mostramos un botón para crear un nuevo diagnóstico
      if (filtrados.length < 3) {
        filtrados.forEach((diagnostico) => {
          const divResultado = document.createElement("div");
          divResultado.classList.add("diagnosticos_Resultado");
          divResultado.textContent = diagnostico.Padecimiento;
          divResultado.addEventListener("click", () => {
            if (
              arraydiagnosticos.some(
                (e) => e.idPadecimiento === diagnostico.idPadecimiento
              )
            ) {
              console.log("Ya existe");
              Busqueda_Diagnostic.classList.add("wiggle");

              // Opcional: quitar la clase después de que la animación haya terminado
              setTimeout(() => {
                Busqueda_Diagnostic.classList.remove("wiggle");
              }, 500); // 500 ms es la duración de la animación
              return;
            }

            arraydiagnosticos.push(diagnostico);

            input.value = ""; // Limpiar el input
            resultados.innerHTML = ""; // Limpiar los resultados anteriores

            // Contenedor para las etiquetas seleccionadas
            const cont_etiqueta = document.getElementById("Etiquetas_Actuales");

            // Crear un nuevo elemento para la etiqueta
            const etiqueta = document.createElement("div");
            etiqueta.classList.add("Etiqueta");
            etiqueta.classList.add("Area" + diagnostico.idArea);
            const etiquetaText = document.createElement("p");
            etiquetaText.textContent = diagnostico.Padecimiento;
            etiqueta.appendChild(etiquetaText);

            const etiquetaBoton = document.createElement("span");
            etiquetaBoton.classList.add("Eliminar-Etiqueta");
            etiquetaBoton.textContent = "X";
            etiquetaBoton.addEventListener("click", () => {
              const indice = arraydiagnosticos.findIndex(
                (diag) => diag.idPadecimiento == diagnostico.idPadecimiento
              );
              // Verificar si se encontró el índice
              if (indice != -1) {
                arraydiagnosticos.splice(indice, 1); // Elimina 1 elemento en el índice encontrado
              }

              etiqueta.parentNode.removeChild(etiqueta);
            });
            etiqueta.appendChild(etiquetaBoton);

            // Añadir la nueva etiqueta al contenedor
            cont_etiqueta.appendChild(etiqueta);
          });
          resultados.appendChild(divResultado);
        });
        const hr = document.createElement("hr");
        resultados.appendChild(hr);
        hr.style.margin = "2px";
        const crearDiagnostico = document.createElement("div");
        crearDiagnostico.textContent = "Crear diagnóstico";
        crearDiagnostico.classList.add("diagnosticos_CrearBoton");
        crearDiagnostico.addEventListener("click", () => {
          // Aqui es donde se realizará la creación del diagnóstico
          // y ocultará las entradas anteriores dentro de ""
          Crear_padecimiento.style.display = "flex";
          Busqueda_Diagnostic.style.display = "none";
          botonGuardar.style.display = "none";
          input_NuevoPadecimiento.value = Busqueda_Diagnostic.value;
        });
        resultados.appendChild(crearDiagnostico);
      } else {
        filtrados.forEach((diagnostico) => {
          const divResultado = document.createElement("div");
          divResultado.classList.add("diagnosticos_Resultado");
          divResultado.textContent = diagnostico.Padecimiento;
          divResultado.addEventListener("click", () => {
            if (
              arraydiagnosticos.some(
                (e) => e.idPadecimiento === diagnostico.idPadecimiento
              )
            ) {
              console.log("Ya existe");
              Busqueda_Diagnostic.classList.add("wiggle");

              // Opcional: quitar la clase después de que la animación haya terminado
              setTimeout(() => {
                Busqueda_Diagnostic.classList.remove("wiggle");
              }, 500); // 500 ms es la duración de la animación
              return;
            }

            arraydiagnosticos.push(diagnostico);

            input.value = ""; // Limpiar el input
            resultados.innerHTML = ""; // Limpiar los resultados anteriores

            // Contenedor para las etiquetas seleccionadas
            const cont_etiqueta = document.getElementById("Etiquetas_Actuales");

            // Crear un nuevo elemento para la etiqueta
            const etiqueta = document.createElement("div");
            etiqueta.classList.add("Etiqueta");
            etiqueta.classList.add("Area" + diagnostico.idArea);
            const etiquetaText = document.createElement("p");
            etiquetaText.textContent = diagnostico.Padecimiento;
            etiqueta.appendChild(etiquetaText);

            const etiquetaBoton = document.createElement("span");
            etiquetaBoton.classList.add("Eliminar-Etiqueta");
            etiquetaBoton.textContent = "X";
            etiquetaBoton.addEventListener("click", () => {
              const indice = arraydiagnosticos.findIndex(
                (diag) => diag.idPadecimiento == diagnostico.idPadecimiento
              );
              // Verificar si se encontró el índice
              if (indice != -1) {
                arraydiagnosticos.splice(indice, 1); // Elimina 1 elemento en el índice encontrado
              }

              etiqueta.parentNode.removeChild(etiqueta);
            });
            etiqueta.appendChild(etiquetaBoton);

            // Añadir la nueva etiqueta al contenedor
            cont_etiqueta.appendChild(etiqueta);
          });
          resultados.appendChild(divResultado);
        });
      }
    };

    // Crear contenedor para los resultados del autocompletado
    const resultadosAutocompletado = document.createElement("div");
    resultadosAutocompletado.classList.add("resultados-autocompletado");
    cont_diagnostics.appendChild(resultadosAutocompletado);

    // Añadir evento de entrada al input
    Busqueda_Diagnostic.addEventListener("input", () =>
      actualizarAutocompletado(Busqueda_Diagnostic, resultadosAutocompletado)
    );

    // Ocultar resultados cuando se hace clic fuera
    document.addEventListener("click", (evento) => {
      if (evento.target !== Busqueda_Diagnostic) {
        resultadosAutocompletado.innerHTML = "";
      }
    });

    // Ahora creamos el contenedor para los botones
    const cont_botonesDiagnostic = document.createElement("div");
    cont_botonesDiagnostic.classList.add("Cont_Botones");

    const botonGuardar = document.createElement("button");
    botonGuardar.type = "button";
    botonGuardar.textContent = "Guardar";
    botonGuardar.classList.add("iconbtn--save");
    // Al hacer Click en el boton guardar
    botonGuardar.addEventListener("click", () => {
      const diagnostico = input.value;
      if (!input.checkValidity()) {
        input.reportValidity();
        return;
      }else{
        // Guardamos el seguimiento
        fetch("/UpdateSeguimiento", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            idSesion: contenido[0].idSesion,
            Seguimiento: diagnostico,
          }),
        });
        textinput.textContent = input.value;
        input.style.display = "none";
        textinput.style.display = "block";
        botonEditar.style.display = "inline-block";
        botonGuardar.style.display = "none";
        const botonesEliminar = document.querySelectorAll(
          "#Etiquetas_Actuales .Etiqueta .Eliminar-Etiqueta"
        );
        botonesEliminar.forEach((boton) => {
          boton.style.display = "none"; // Esto oculta el botón
        });
        Busqueda_Diagnostic.style.display = "none";
        // Guardamos los diagnosticos en caso de que existan
        if (arraydiagnosticos.length > 0) {
          // Pero antes los comparamos para saber que cambios se hacen
          Comparar_Diagnosticos(
            datosFiltrados,
            arraydiagnosticos,
            contenido[0].idSesion
          );
        }
      }
    });

    const botonEditar = document.createElement("button");
    botonEditar.type = "button";
    botonEditar.style.display = "none";
    botonEditar.textContent = "Editar";
    botonEditar.classList.add("iconbtn--editar");
    botonEditar.addEventListener("click", () => {
      input.style.display = "block";
      textinput.style.display = "none";
      botonEditar.style.display = "none";
      botonGuardar.style.display = "block";
      // Seleccionar todos los elementos 'Eliminar-Etiqueta' que son hijos de 'Etiqueta' dentro de 'Etiquetas_Actuales'
      const botonesEliminar = document.querySelectorAll(
        "#Etiquetas_Actuales .Etiqueta .Eliminar-Etiqueta"
      );
      botonesEliminar.forEach((boton) => {
        boton.removeAttribute("style"); // Esto elimina el atributo 'style' del botón
      });
      Busqueda_Diagnostic.style.display = "block";
    });

    if (contenido[0].Seguimiento != null) {
      input.style.display = "none";
      textinput.style.display = "block";
      botonEditar.style.display = "inline-block";
      botonGuardar.style.display = "none";
      Busqueda_Diagnostic.style.display = "none";
    }

    cont_botonesDiagnostic.appendChild(botonEditar);
    cont_botonesDiagnostic.appendChild(botonGuardar);

    footerSeguimiento.appendChild(cont_diagnostics);
    footerSeguimiento.appendChild(cont_botonesDiagnostic);

    itemContent.appendChild(footerSeguimiento);
  }

  item.appendChild(itemContent);
  return item;
}

function Comparar_Diagnosticos(Original, Nuevo, idSesion) {
  let cambios = [];

  // Verificar qué elementos se eliminaron
  Original.forEach((originalItem) => {
    if (
      !Nuevo.some(
        (nuevoItem) => nuevoItem.idPadecimiento === originalItem.idPadecimiento
      )
    ) {
      cambios.push({
        action: "Eliminar",
        idPadecimiento: originalItem.idPadecimiento,
        idSesion: idSesion,
      });
    }
  });

  // Verificar qué elementos son nuevos
  Nuevo.forEach((nuevoItem) => {
    if (
      !Original.some(
        (originalItem) =>
          originalItem.idPadecimiento === nuevoItem.idPadecimiento
      )
    ) {
      cambios.push({
        action: "Añadir",
        idPadecimiento: nuevoItem.idPadecimiento,
        idSesion: idSesion,
      });
    }
  });

  // En caso de que encuentre cambios en los diagnosticos
  if (cambios.length > 0) {
    // va a realizar un fetch con los cambios a la base de datos
    fetch("/GuardarDiagnosticos", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        cambios: cambios,
      }),
    });
    console.log(cambios);
  } else {
    return;
  }
}

// ========================================================================================================
// Funcion para crear conteido de Seguimientos
// ========================================================================================================

function crearElemento_Seguimiento(clase) {
  const elemento = document.createElement("div");
  elemento.classList.add(clase);
  return elemento;
}

let arraydiagnosticos = [];

function crearElementoHeader_Seguimiento(Fecha, idDiv, Etiquetas) {
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

  if (Etiquetas.length > 0) {
    Etiquetas.forEach((element) => {
      const etiqueta = document.createElement("div");
      etiqueta.classList.add("Etiqueta", "Area" + element.idArea);

      const NombrePadecimiento = document.createElement("p");
      NombrePadecimiento.textContent = element.Padecimiento;
      etiqueta.appendChild(NombrePadecimiento);

      if (idDiv != "Etiquetas") {
        const Eliminar = document.createElement("span");
        Eliminar.textContent = "X";
        Eliminar.classList.add("Eliminar-Etiqueta");
        Eliminar.style.display = "none";
        Eliminar.addEventListener("click", () => {
          const indice = arraydiagnosticos.findIndex(
            (diag) => diag.idPadecimiento === element.idPadecimiento
          );
          if (indice !== -1) {
            arraydiagnosticos.splice(indice, 1);
            etiqueta.parentNode.removeChild(etiqueta);
          }
        });
        etiqueta.appendChild(Eliminar);
      }

      cont_etiquetas.appendChild(etiqueta);
    });
  }else if (idDiv != "Etiquetas_Actuales") {
    const etiqueta = document.createElement("div");
    etiqueta.classList.add("Etiqueta", "Area0" );

    const NombrePadecimiento = document.createElement("p");
    NombrePadecimiento.textContent = "Sin Diagnósticos Registrados";
    etiqueta.appendChild(NombrePadecimiento);

    cont_etiquetas.appendChild(etiqueta);

  }

  etiquetasDiv.appendChild(cont_etiquetas);
  elemento.appendChild(etiquetasDiv);

  return elemento;
}
