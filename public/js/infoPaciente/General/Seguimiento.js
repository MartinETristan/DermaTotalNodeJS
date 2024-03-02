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

  console.log(datosAlmacenados.Seguimientos);

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
    const Seguimientos = crearElementoHeader_Seguimiento(
      "",
      "HeaderTags",
      arrayPadecimientos
    );
    contHeaderSeguimientos.appendChild(Seguimientos);
  }

  const numSeguimientos = datosAlmacenados.Seguimientos.length;
  const numSesionesActivas = datosAlmacenados.SesionesActivas.length;

  // Si detecta que hay más de un diagnóstico, crea un elemento para cada uno
  if (numSeguimientos >= 1) {
    const Seguimientos = crearInfoItem_HistorialSeguimiento(
      datosAlmacenados.Seguimientos.filter(
        // Filtramos los seguimientos por el idPadecimiento con el padecimiento inicial
        (seguimiento) => seguimiento.idPadecimiento == PadecimentoInicial
      )
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

  crearInfoGroup.appendChild(crearInfo);

  // Si detecta Sesiones Activas, crea un input para poder insertarla
  if (numSesionesActivas >= 1) {
    const Input = crearInfoItem_SeguimientoActual(
      datosAlmacenados.SesionesActivas
    );
    crearInfoGroup.appendChild(Input);
  }

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
    const header = document.createElement("h3");
    header.textContent =
      "SEGUIMIENTO " + fecha.dia + "/" + fecha.mes + "/" + fecha.año + ":";
    header.classList.add("info__item__title");

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

  item.appendChild(itemContent);
  return item;
}




// Se tiene que igualar a una petición fetch para obtener los datos de la base de datos
let arraydiagnosticos = [];
let SeguiminetoActivo = null;



function crearInfoItem_SeguimientoActual(contenido) {
  const item = crearElemento_Seguimiento("info__item");
  const itemContent = crearElemento_Seguimiento("info__item__content");

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
      ? `SEGUIMIENTO HOY:`
      : `SEGUIMIENTO (${FormatoFechaSesion}):`,
    "Etiquetas_Actuales"
  );

  // Añadimos el Header al itemContent
  itemContent.appendChild(header);




// Creamos el contenedor del TextArea y los elementos
const cont_Seguimiento = document.createElement("div");
cont_Seguimiento.id = "Cont_Seguimiento";
cont_Seguimiento.style.display = "none";

// Creamos el textarea para el seguimiento
  const input = document.createElement("textarea");
  input.classList.add("info__item__textarea");
  input.placeholder = "Escribe el seguimiento aquí...";
  input.value = contenido[0].Seguimiento || "";
  input.required = true;
  input.id = "Seguimiento_Textarea";
  
  input.addEventListener("input", function () {
    // Restablecer la altura para calcular correctamente el scrollHeight
    this.style.height = "auto";
    // Establecer la altura en función del contenido, pero no superará la max-height definida en CSS
    this.style.height = this.scrollHeight + "px";
  });
  cont_Seguimiento.appendChild(input);






// Creamos el contenedor para los diagnosticos
  const cont_text = document.createElement("div");
  cont_text.classList.add("Cont_TextSeguimiento");
  cont_text.style.display = "none";
  const textinput = document.createElement("p");
  textinput.textContent = contenido[0].Seguimiento || "";
  // textinput.style.display = "none";
  textinput.style.visibility = "0";
  cont_text.appendChild(textinput);
  cont_Seguimiento.appendChild(cont_text);


  const Cont_Botones = document.createElement("div");
  Cont_Botones.classList.add("Cont_BotonesSeguimiento");


  const botonEditar = document.createElement("button");
  botonEditar.type = "button";
  botonEditar.textContent = "Editar";
  botonEditar.classList.add("iconbtn--editar");
  botonEditar.style.display = "none";
  botonEditar.addEventListener("click", () => {
    // input.style.display = "block";
    // textinput.style.display = "none";
    // guardarSeguimiento.style.display = "block";
    botonEditar.style.display = "none";
    input.style.display = "block";
    cont_text.style.display = "none";
    NuevoDiagnostico.style.display = "none";
    guardarSeguimiento.style.display = "block";
    input.focus();
  });
  
  Cont_Botones.appendChild(botonEditar);


  const guardarSeguimiento = document.createElement("button");
  guardarSeguimiento.type = "button";
  guardarSeguimiento.textContent = "Guardar";
  guardarSeguimiento.classList.add("iconbtn--save");
  guardarSeguimiento.addEventListener("click", () => {
    // console.log(input.value);
    // console.log(textinput.textContent);
    if (input.value == "" || input.value == textinput.textContent) {
      input.classList.add("wiggle");
      setTimeout(() => input.classList.remove("wiggle"), 500);
      return;
    }

    const index = arraydiagnosticos.findIndex(e => e.idPadecimiento == SeguiminetoActivo);
    arraydiagnosticos[index].Seguimiento = input.value;

    oratrice_mecanique_d_analyse_cardinale();


  });

  Cont_Botones.appendChild(guardarSeguimiento);


  const NuevoDiagnostico = document.createElement("button");
  NuevoDiagnostico.type = "button";
  NuevoDiagnostico.textContent = "Nuevo Diagnostico";
  NuevoDiagnostico.classList.add("iconbtn--save");
  NuevoDiagnostico.style.display = "none";
  NuevoDiagnostico.addEventListener("click", () => {
    // Verificamos si existe algun seguimineto en nulo para invitar a llenarlo antes de agregar un nuevo diagnostico
    const padecimientoNulo = arraydiagnosticos.find(e => e.Seguimiento == null);
    if (padecimientoNulo) {
      const nombrePadecimiento = padecimientoNulo.Padecimiento;
      alert(`Por favor, llene el seguimiento del padecimiento "${nombrePadecimiento}" antes de agregar un nuevo diagnóstico`);
      return;
    }

    cont_Seguimiento.style.display = "none";
    Busqueda_Diagnostic.style.display = "block";
    botonGuardar.style.display = "block";
  });



  Cont_Botones.appendChild(NuevoDiagnostico);
  cont_Seguimiento.appendChild(Cont_Botones);
  itemContent.appendChild(cont_Seguimiento);



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
    Busqueda_Diagnostic.required = true;

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




    const crearElementoDiagnostico = (diagnostico, input, resultados, cont_etiqueta) => {
      const divResultado = document.createElement("div");
      divResultado.classList.add("diagnosticos_Resultado");
      divResultado.textContent = diagnostico.Padecimiento;

      divResultado.addEventListener("click", () => {
        if (arraydiagnosticos.some(e => e.idPadecimiento === diagnostico.idPadecimiento)) {
          console.log("Ya existe");
          // Suponiendo que Busqueda_Diagnostic es una referencia al elemento de búsqueda
          Busqueda_Diagnostic.classList.add("wiggle");
          setTimeout(() => Busqueda_Diagnostic.classList.remove("wiggle"), 500);
          return;
        }
    
  
        // Le añadimos la propiedad de Seguimiento para llevar control sobre los Insert's
        const postDiagnostico = { ...diagnostico, Seguimiento: null };

        // Añadimos el objeto clonado con la nueva propiedad al array arraydiagnosticos
        arraydiagnosticos.push(postDiagnostico);
        SeguiminetoActivo = postDiagnostico.idPadecimiento;

        console.log(SeguiminetoActivo);


        input.value = "";
        resultados.innerHTML = "";
    
        // Crear y añadir la nueva etiqueta con funcionalidad
        const etiqueta = document.createElement("div");
        etiqueta.classList.add("Etiqueta", "Activa");
        const etiquetaText = document.createElement("p");
        etiquetaText.textContent = diagnostico.Padecimiento;
        etiqueta.appendChild(etiquetaText);
    
        
        // Crear el botón para eliminar la etiqueta
        const etiquetaBoton = document.createElement("span");
        etiquetaBoton.classList.add("Eliminar-Etiqueta", "Activa");
        etiquetaBoton.textContent = "X";
        etiquetaBoton.addEventListener("click", (e) => {
          e.stopPropagation(); 
          console.log("Eliminar etiqueta:", diagnostico.Padecimiento);


          console.log(arraydiagnosticos[arraydiagnosticos.findIndex(e=> e.idPadecimiento == SeguiminetoActivo)]);

          
          if (!confirm("¿Está seguro de eliminar el padecimiento?")) {
            console.log("Cancelando eliminación");
            return;
          }
          arraydiagnosticos.pop(arraydiagnosticos.findIndex(e=> e.idPadecimiento == SeguiminetoActivo));
          console.log(arraydiagnosticos);
          console.log("Eliminando padecimiento");
          // oratrice_mecanique_d_analyse_cardinale();
          

          // Ejemplo de eliminación de etiqueta:
          etiqueta.parentNode.removeChild(etiqueta);
          if (arraydiagnosticos.length != 0) {
            SeguiminetoActivo = arraydiagnosticos[arraydiagnosticos.length - 1];
            const etiquetas = document.querySelectorAll("#HeaderTags .Etiqueta");
            $(etiquetas).removeClass("Activa");
            // etiqueta.classList.toggle("Activa");
            etiquetas[etiquetas.length - 1].classList.toggle("Activa");

          }

          oratrice_mecanique_d_analyse_cardinale();

        });
    
        // Manejar clics en la etiqueta para activar/desactivar
        etiqueta.addEventListener("click", () => {
          // Desactivar todas las etiquetas
          document.querySelectorAll("#Etiquetas_Actuales .Etiqueta").forEach(tag => {
            tag.classList.remove("Activa");
            // tag.querySelector(".Eliminar-Etiqueta").classList.remove("Activa");
            tag.querySelector(".Eliminar-Etiqueta").style.display = "none";
          });
          // Activar la etiqueta y su botón de eliminar clickeados
          etiqueta.classList.add("Activa");
          etiquetaBoton.classList.add("Activa");
          etiquetaBoton.style.display = "block";
          console.log(arraydiagnosticos);

          // Cambiar el seguimiento activo
          SeguiminetoActivo = diagnostico.idPadecimiento;

          oratrice_mecanique_d_analyse_cardinale();

        });
    
        etiqueta.appendChild(etiquetaBoton);
        cont_etiqueta.appendChild(etiqueta);
    




        // Activamos el Tag recien creada
        document.querySelectorAll("#Etiquetas_Actuales .Etiqueta").forEach(tag => {
          tag.classList.remove("Activa");
          // tag.querySelector(".Eliminar-Etiqueta").classList.remove("Activa");
          tag.querySelector(".Eliminar-Etiqueta").style.display = "none";
        });
        // Activar la etiqueta y su botón de eliminar clickeados
        etiqueta.classList.add("Activa");
        etiquetaBoton.classList.add("Activa");
        etiquetaBoton.style.display = "block";






        // Ocultamos el input y mostramos el area de seguimiento
        const Input_Seguimiento = document.getElementById("Seguimiento_Textarea");

        input.style.display = "none";
        cont_Seguimiento.style.display = "block";
        botonEditar.style.display = "none";

        Input_Seguimiento.style.display = "block";
        cont_text.style.display = "none";
        NuevoDiagnostico.style.display = "none";
        guardarSeguimiento.style.display = "block";
        Input_Seguimiento.value = "";
        Input_Seguimiento.focus();




      });
    
      
      return divResultado;
    };
    










    const procesarResultados = (filtrados, input, resultados, valorInput) => {
      filtrados.forEach(diagnostico => {
        const divResultado = crearElementoDiagnostico(diagnostico, input, resultados, document.getElementById("Etiquetas_Actuales"));
        resultados.appendChild(divResultado);
      });
    
      if (filtrados.length < 3) {
        const hr = document.createElement("hr");
        resultados.appendChild(hr);
        hr.style.margin = "2px";
    
        const crearDiagnostico = document.createElement("div");
        crearDiagnostico.textContent = "Crear diagnóstico";
        crearDiagnostico.classList.add("diagnosticos_CrearBoton");
        crearDiagnostico.addEventListener("click", () => {
          Crear_padecimiento.style.display = "flex";
          Busqueda_Diagnostic.style.display = "none";
          botonGuardar.style.display = "none";
          input_NuevoPadecimiento.value = Busqueda_Diagnostic.value;
        });
        resultados.appendChild(crearDiagnostico);
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

    footerSeguimiento.appendChild(cont_diagnostics);
    footerSeguimiento.appendChild(cont_botonesDiagnostic);



  itemContent.appendChild(footerSeguimiento);


  item.appendChild(itemContent);
  return item;
}





function oratrice_mecanique_d_analyse_cardinale() {

  // Nos aseguramos de ocultar el buscador de diagnosticos
   const Busqueda_Diagnostic = document.getElementById("inputDiagnostic");


    // Seleccionamos los elementos con los que vamos a trabajar
    const Text = document.querySelector(".Cont_TextSeguimiento");
    const TextArea = document.getElementById("Seguimiento_Textarea");
    const botonEditar = document.querySelector(".Cont_BotonesSeguimiento button:nth-child(1");
    const guardarSeguimiento = document.querySelector(".Cont_BotonesSeguimiento button:nth-child(2");
    const NuevoDiagnostico = document.querySelector(".Cont_BotonesSeguimiento button:nth-child(3");

  //========================================================================================================
  // AQUI ME QUEDE:
  // EL BUG QUE SE TIENE ES QUE CUANDO SE CREA UN NUEVO DIAGNOSTICO PERO SE REGRESA A VISUALIZAR EL DIAGNOSTICO ANTERIOR
  // NI EL P, NI EL TEXTAREA SE MUESTRAN EN PANTALLA, SE TIENE QUE VERIFICAR EL LARGO DEL ARRAY PARA CAMBIAR LA VISTA
  //========================================================================================================
  console.log(arraydiagnosticos.length);

   // Verificamos si existe algun seguimineto, si no, mostramos el buscador de diagnosticos
  if(arraydiagnosticos.length == 0){
    Busqueda_Diagnostic.style.display = "block";

    TextArea.style.display = "none";
    Text.style.display = "none";
    botonEditar.style.display = "none";
    guardarSeguimiento.style.display = "none";
    NuevoDiagnostico.style.display = "none";

  }else{
    Busqueda_Diagnostic.style.display = "none";


    // Verificar si el seguimiento actual es Nulo
    // Si lo es, entones el textarea se muestra, si no, se muestra la p con el seguimiento

    console.log(SeguiminetoActivo);
    console.log(arraydiagnosticos[arraydiagnosticos.findIndex(e=> e.idPadecimiento == SeguiminetoActivo)]);
    
    
    TextArea.value = arraydiagnosticos[arraydiagnosticos.findIndex(e=> e.idPadecimiento == SeguiminetoActivo)].Seguimiento;
    Text.textContent = arraydiagnosticos[arraydiagnosticos.findIndex(e=> e.idPadecimiento == SeguiminetoActivo)].Seguimiento;


    if (arraydiagnosticos[arraydiagnosticos.findIndex(e=> e.idPadecimiento == SeguiminetoActivo)].Seguimiento != null) {
      TextArea.style.display = "none";
      Text.style.display = "block";
      botonEditar.style.display = "block";
      guardarSeguimiento.style.display = "none";
      NuevoDiagnostico.style.display = "block";
    }else{
      TextArea.style.display = "block";
      Text.style.display = "none";
      botonEditar.style.display = "none";
      guardarSeguimiento.style.display = "block";
      NuevoDiagnostico.style.display = "none";
    }
  }
} 





function Comparar_Seguimiento(Array) {

  
}

// ========================================================================================================
// Funcion para crear conteido de Seguimientos
// ========================================================================================================

function crearElemento_Seguimiento(clase) {
  const elemento = document.createElement("div");
  elemento.classList.add(clase);
  return elemento;
}


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

  if (Etiquetas) {
    Etiquetas.forEach((element, indice) => {
      const etiqueta = document.createElement("div");
      etiqueta.classList.add("Etiqueta");
      if (indice == 0) {
        etiqueta.classList.add("Activa");
      }
      const NombrePadecimiento = document.createElement("p");
      NombrePadecimiento.textContent = element.Padecimiento;
      etiqueta.appendChild(NombrePadecimiento);

      etiqueta.addEventListener("click", () => {
        mostrarSeguimientosFiltrados(element.idPadecimiento);
        const etiquetas = document.querySelectorAll("#HeaderTags .Etiqueta");
        $(etiquetas).removeClass("Activa");
        etiqueta.classList.toggle("Activa");
      });

      cont_etiquetas.appendChild(etiqueta);
    });
  }

  etiquetasDiv.appendChild(cont_etiquetas);
  elemento.appendChild(etiquetasDiv);

  return elemento;
}

// Esta funcion actualiza el contenido de los seguimientos con base al idPadecimiento dado
function mostrarSeguimientosFiltrados(idPadecimiento) {
  // Filtramos los seguimientos por el idPadecimiento
  const seguimientosFiltrados = datosAlmacenados.Seguimientos.filter(
    (seguimiento) => seguimiento.idPadecimiento == idPadecimiento
  );

  // Llamamos el elemento donde se encuentran los seguimientos
  const Historial_Seguimientos = document.querySelector(
    ".Historial_Seguimientos"
  );
  // Limpiamos el contenido
  Historial_Seguimientos.innerHTML = "";

  // Y creaos el nuevo contenido filtrado
  Historial_Seguimientos.appendChild(
    crearInfoItem_HistorialSeguimiento(seguimientosFiltrados)
  );
}
