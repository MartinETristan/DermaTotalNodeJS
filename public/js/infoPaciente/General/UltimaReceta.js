//========================================================================================================
// Ultima Receta
//========================================================================================================
function cargarUltimaReceta() {
  if (datosAlmacenados.Recetas.length !== 0) {
    mostrarReceta(datosAlmacenados);
    // Activamos el DranNDrop
    DragNDrop();
  } else {
    document.getElementById("Receta_actual").innerHTML = "";
    const doctor = document.getElementById("Doctor");
    doctor.style.display = "block";
    doctor.textContent = "No hay recetas registradas.";
    const botones = document.querySelector(".Botones");
    botones.style.display = "none";
  }

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

  // Y pasamos a la siguiente seccion
  cargarNuevaReceta();
}

// ========================================================================================================
// Assets de la Ultima Receta
// ========================================================================================================

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

    // Boton para crear el par de Medicamento e Indicación
    const botonAñadir = document.createElement("button");
    botonAñadir.type = "button";
    botonAñadir.textContent = "Añadir";
    botonAñadir.classList.add("AñadirMedicamento");
    botonAñadir.addEventListener("click", () => {
      // console.log("Añadir");
      // console.log(botonAñadir.parentNode.parentNode);
      agregarCampos({
        zona: botonAñadir.parentNode.parentNode,
        NombreInputMedicamento: "EditMedicamento",
        NombreInputIndicacion: "EditIndicacion",
      });
    });

    dl.appendChild(divMedicamentos);
    divSelector.appendChild(crearInputMedicamento(item, "Medicamento"));
    divSelector.appendChild(botonQuitar);
    divSelector.appendChild(botonAñadir);
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

  const Nota = document.createElement("div");
  Nota.classList.add("Nota");
  Nota.style.display = "block";

  if (data.Recetas[0].Nota) {
    const NotaTitulo = document.createElement("h3");
    NotaTitulo.innerHTML = "Nota:";
    const NotaP = document.createElement("p");
    NotaP.innerHTML = data.Recetas[0].Nota;
    Nota.appendChild(NotaTitulo);
    Nota.appendChild(NotaP);
  }

  const inputNota = document.createElement("input");
  inputNota.type = "text";
  inputNota.name = "EditNota";
  inputNota.placeholder = "Escribe la nota de la receta aquí...";
  inputNota.classList.add("input-receta", "inputNota"); // Agregamos la clase 'input-receta'
  inputNota.value = data.Recetas[0].Nota || "";

  const tituloNota = document.createElement("h3");
  tituloNota.innerHTML = "Nota Actual:";
  formEditReceta.appendChild(tituloNota);

  contenedornota.appendChild(inputNota);
  contenedornota.appendChild(contenedorbotones);
  formEditReceta.appendChild(contenedornota);

  Receta.appendChild(dl);
  Receta.appendChild(Nota);
  Receta.appendChild(formEditReceta);
}

// ========================================================================================================
// Funcion para compara el Array original con el Array dado por los cambios
// ========================================================================================================
function compareData(original, form) {
  let changes = [];
  let hasNotaChange = false;

  // Asignar un orden a los nuevos elementos
  let maxOrder = original.length + 1;

  form.forEach((item, index) => {
    const originalItem = original.find(
      (o) =>
        o.idMedicamento == item.idMedicamento &&
        o.idMedicamento_Receta == item.idMedicamento_Receta &&
        o.idReceta == item.idReceta
    );

    if (!originalItem) {
      if (item.Medicamento == "" && item.Indicacion == "") {
        return;
      }
      item.Orden = maxOrder++; // Asigna un nuevo orden que es el máximo actual
      item.idReceta = original[0].idReceta;
      item.idMedicamento_Receta = original[0].idMedicamento_Receta;
      changes.push({ action: "Añadir", item });
    } else if (!itemsAreEqual(originalItem, item)) {
      changes.push({ action: "Editar", item });
    } else if (
      originalItem.Nota != item.Nota &&
      !(item.Nota == "" && originalItem.Nota == null)
    ) {
      hasNotaChange = true;
    }
  });

  // Ajustar los órdenes de los elementos existentes y los nuevos
  let currentOrder = 1;
  form.forEach((item) => {
    if (item.Orden != currentOrder) {
      changes.push({
        action: "Reordendar",
        cambios: [{ ...item, Orden: item.Orden }, { NuevoOrden: currentOrder }],
      });
      item.Orden = currentOrder; // Asegurarse de que el orden en el formulario también esté actualizado
    }
    currentOrder++;
  });

  original.forEach((item) => {
    if (
      !form.some(
        (f) =>
          f.idMedicamento == item.idMedicamento &&
          f.idMedicamento_Receta == item.idMedicamento_Receta &&
          f.idReceta == item.idReceta
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
  console.log(changes);

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

// Comparar los datos
function itemsAreEqual(item1, item2) {
  return (
    item1.Medicamento === item2.Medicamento &&
    item1.Indicacion === item2.Indicacion
  );
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

// DRAG AND DROP LISTA DE MEDICAMENTOS
function DragNDrop() {
  const zonaDragNDrop = document.getElementById("ContenedorEditMedicamentos");
  Sortable.create(zonaDragNDrop, {
    handle: ".drag",
    animation: 350,
  });
}
