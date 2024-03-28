async function cargarNuevaCita() {
  const FechaCita = document.getElementById("fechaNuevaCita");
  const SelectDuracion = document.getElementById("Duracion");
  const SelectMedico = document.getElementById("citaDoctor");
  const SelectProcedimiento = document.getElementById("procedimientoCita");
  const SelectSucursal = document.getElementById("sucursalCita");
  const nuevaCitaNota = document.getElementById("NotaNuevaCita");

  FechaCita.required = true;
  SelectMedico.required = true;
  SelectProcedimiento.required = true;

  // Creamos un objeto con las opciones de los doctores Disponibles
  const Medicos = {
    Doctores: {},
    Asociados: {},
  };
  // Realizamos un forEach para agregar las opciones de los doctores
  InfoSelects.Doctores.forEach((doctor) => {
    Medicos.Doctores[doctor.idDoctor] = doctor.Nombres;
  });
  // Y los asociados
  InfoSelects.Asociados.forEach((asociado) => {
    Medicos.Asociados[asociado.idAsociado] = asociado.Nombres;
  });
  // Generamos las opciones de los doctores y asociados
  OpcionesGrupos(Medicos.Doctores, "Doctores", SelectMedico);
  OpcionesGrupos(Medicos.Asociados, "Asociados", SelectMedico);

  function OpcionesGrupos(categoria, nombreCategoria, selectElement) {
    const optgroup = document.createElement("optgroup");
    optgroup.label = nombreCategoria;

    for (const id in categoria) {
      const option = document.createElement("option");
      option.value = id;
      option.textContent = categoria[id];
      optgroup.appendChild(option);
    }

    selectElement.appendChild(optgroup);
  }
  // Creamos una funcion exclusiva para los procedimientos
  OpcionesProcedimientos(InfoSelects.Procedimiento, SelectProcedimiento);

  function OpcionesProcedimientos(procedimientos, selectElement) {
    // Agrupar los procedimientos por área
    const procedimientosPorArea = procedimientos.reduce(
      (acc, procedimiento) => {
        if (!acc[procedimiento.Area]) {
          acc[procedimiento.Area] = [];
        }
        acc[procedimiento.Area].push(procedimiento);
        return acc;
      },
      {}
    );

    // Crear un optgroup para cada área
    for (const area in procedimientosPorArea) {
      const optgroup = document.createElement("optgroup");
      optgroup.label = area;

      procedimientosPorArea[area].forEach((procedimiento) => {
        const option = document.createElement("option");
        option.value = procedimiento.idProcedimiento;
        option.textContent = procedimiento.Procedimiento;
        optgroup.appendChild(option);
      });

      selectElement.appendChild(optgroup);
    }
  }

  OpcionesSucursales(InfoSelects.Sucursales, SelectSucursal);

  function OpcionesSucursales(categoria, selectElement) {
    console.log(categoria);
    for (const id in categoria) {
      const option = document.createElement("option");
      option.value = categoria[id].idSucursal;
      categoria[id].Procedimiento
        ? (option.textContent = categoria[id].Procedimiento)
        : (option.textContent = categoria[id].Sucursal);

      selectElement.appendChild(option);
    }
  }

  $("#citaDoctor").select2({
    language: "es",
    placeholder: "Elige a un especialista...",
  });

  $("#procedimientoCita").select2({
    language: "es",
    placeholder: "Elige un procedimiento...",
  });

  $("#sucursalCita").select2({
    language: "es",
    placeholder: "Elige una sucursal...",
  });

  // Si el que está realizando la cita es un doctor
  if (InfoSesion.EsDoctor) {
    //Se selecciona automaticamente su nombre
    $("#citaDoctor").val(InfoSesion.ID).trigger("change");
    // Se deshabilita el select para que no se pueda cambiar
    $("#citaDoctor").prop("disabled", true);
    // Se selecciona automaticamente la primera sucursal
    $("#sucursalCita").val("1").trigger("change");
    // Guardamos las citas del dia del doctor
    arrayCitasdelDiaElegido = await obtenerCitas(SelectMedico.value, null);
  } else {
    // Si no es doctor, solo puede ser recepcionista
    //Elegimos el primer doctor de la lista
    $("#citaDoctor").val("1").trigger("change");
    // Por lo que se selecciona en automatico su sucursal
    $("#sucursalCita").val(InfoSesion.Sucursal).trigger("change");
    // Y se deshabilita el select para que no se pueda cambiar
    $("#sucursalCita").prop("disabled", true);
    // Guardamos las citas del dia del Medico
    arrayCitasdelDiaElegido = await obtenerCitas(1, null);
  }

  agregarEventListener("botonNuevaCita", function () {
    // Acciones a realizar cuando se haga clic en el botón
    const formcita = document.getElementById("NuevaCita");
    const botoncancelar = document.getElementById("cancelarCita");
    const botonNuevaCita = document.getElementById("botonNuevaCita");
    formcita.style.display = "flex";
    botoncancelar.style.display = "block";
    botonNuevaCita.style.display = "none";
  });
  agregarEventListener("cancelarCita", function () {
    // Acciones a realizar cuando se haga clic en el botón
    const formcita = document.getElementById("NuevaCita");
    const botoncancelar = document.getElementById("cancelarCita");
    const botonNuevaCita = document.getElementById("botonNuevaCita");
    formcita.style.display = "none";
    botoncancelar.style.display = "none";
    botonNuevaCita.style.display = "block";
  });

  agregarEventListener("GuardarCita", async function () {
    if (FechaCita.value == "") {
      swal({
        title: "Llena el campo de Fecha",
        text: "Para crear una cita, debes seleccionar una fecha.",
        icon: "error",
        button: "Aceptar",
      });
      return;
    }

    if (!SelectMedico.checkValidity()) {
      swal({
        title: "Asigna un doctor o asociado",
        text: "Debes de seleccionar un Doctor o Asociado para agendar una cita.",
        icon: "error",
        button: "Aceptar",
      });
      return;
    }

    if (!SelectProcedimiento.checkValidity()) {
      swal({
        title: "Selecciona un procedimiento",
        text: "Debes de seleccionar un procedimiento para crear la cita.",
        icon: "error",
        button: "Aceptar",
      });
      return;
    }
    //Seleccionamos el texto del select del procedimiento
    let indexProcedimineto = SelectProcedimiento.selectedIndex;
    let textoProcedimiento =
      SelectProcedimiento.options[indexProcedimineto].text;
    // Selecionamos el texto del select del medico
    let indetMedico = SelectMedico.selectedIndex;
    let textoMedico = SelectMedico.options[indetMedico].text;
    // Seleccionamos el texto del select de la sucursal
    let indexSucursal = SelectSucursal.selectedIndex;
    let textoSucursal = SelectSucursal.options[indexSucursal].text;

    //En caso de que existan citas en el dia seleccionado
    if (arrayCitasdelDiaElegido.length > 0) {
      // Verificamos que la cita esté disponible y dentro de un horario disponible
      if (ComprobarDisponibilidad(FechaCita.value, arrayCitasdelDiaElegido)) {
        swal({
          title: `Crear nueva cita para ${datosAlmacenados.BasicInfo[0].Nombres}`,
          text: `Estas a punto de agendarle una cita a ${
            datosAlmacenados.BasicInfo[0].Nombres
          } para una ${textoProcedimiento} en un horario de ${formatearHora(
            FechaCita.value
          )} a ${formatearHora(
            sumarIntervalo(FechaCita.value, SelectDuracion.value)
          )} con ${textoMedico} en ${textoSucursal}.
            
            ¿Deseas continuar?`,
          icon: "warning",
          buttons: {
            cancel: "Cancelar",
            confirm: "Aceptar",
          },
        }).then((value) => {
          if (value) {
            console.log("Se hizo clic en Aceptar");
            CrearCita();
            // Llamadas adicionales o lógica aquí si se hace clic en Aceptar
          }
        });
      }
    }
    // En caso de que no existan citas en el dia seleccionado
    else {
      // Simplemenmte se crea in necesidad de comprobar disponibilidad
      swal({
        title: `Crear nueva cita para ${datosAlmacenados.BasicInfo[0].Nombres}`,
        text: `Estas a punto de agendarle una cita a ${
          datosAlmacenados.BasicInfo[0].Nombres
        } para una ${textoProcedimiento} en un horario de ${formatearHora(
          FechaCita.value
        )} a ${formatearHora(
          sumarIntervalo(FechaCita.value, SelectDuracion.value)
        )} con ${textoMedico} en ${textoSucursal}.
          
          ¿Deseas continuar?`,
        icon: "warning",
        buttons: {
          cancel: "Cancelar",
          confirm: "Aceptar",
        },
      }).then((value) => {
        if (value) {
          console.log("Se hizo clic en Aceptar");
          CrearCita();
          // Llamadas adicionales o lógica aquí si se hace clic en Aceptar
        }
      });
    }

    function CrearCita() {
      //Hacemos la peticion ajax para crear la cita
      $.ajax({
        url: "/CrearCita",
        method: "POST",
        dataType: "json",
        data: {
          R_EsDoctor: InfoSesion.EsDoctor,
          R_ID: InfoSesion.ID,
          idSucursal: SelectSucursal.value,
          idProcedimiento: SelectProcedimiento.value,
          idPaciente: datosAlmacenados.BasicInfo[0].idPaciente,
          idDoctor:
            encontrarGrupoDeOpcionSeleccionada(SelectMedico) == "Doctores"
              ? SelectMedico.value
              : null,
          idAsociado:
            encontrarGrupoDeOpcionSeleccionada(SelectMedico) == "Doctores"
              ? null
              : SelectMedico.value,
          HoraCita: FechaCita.value,
          FinCita: sumarIntervalo(FechaCita.value, SelectDuracion.value),
          NotasCita: nuevaCitaNota.value == "" ? null : nuevaCitaNota.value,
        },
        success: function (respuesta) {
          swal({
            title: "Cita Generada Exitosamente",
            text: `Se ha creado una cita de ${textoProcedimiento} para ${
              datosAlmacenados.BasicInfo[0].Nombres
            } de ${formatearHora(FechaCita.value)} a ${formatearHora(
              sumarIntervalo(FechaCita.value, SelectDuracion.value)
            )} con ${textoMedico} en ${textoSucursal}.`,
            icon: "success",
            timer: 8000,
          }).then(() => {
            location.reload();
          });
        },
        error: function (error) {
          swal({
            title: "Problema al crear la cita",
            text: `Ocurrio un error al agendar la cita: ${error[0]}`,
            icon: "error",
            button: "Aceptar",
          });
        },
      });
    }
  });

  $("#citaDoctor").on("select2:select", async function (e) {
    // Obtener las citas del doctor
    console.log("Cambiando de doctor...");
    console.log("Doctor seleccionado: ", SelectMedico.value);
    console.log(
      "Tipo Medico: ",
      encontrarGrupoDeOpcionSeleccionada(SelectMedico)
    );
    arrayCitasdelDiaElegido =
      encontrarGrupoDeOpcionSeleccionada(SelectMedico) == "Doctores"
        ? await obtenerCitas(SelectMedico.value, null)
        : await obtenerCitas(null, SelectMedico.value);
    console.log("Citas del doctor: ", arrayCitasdelDiaElegido);
    // formatoInputNuevaCita(arrayCitasdelDiaElegido);
    crearListaPacientes(
        arrayCitasdelDiaElegido.filter(
          (cita) => cita.HoraCita.split("T")[0] == FechaCita.value.split(" ")[0]
        )
      );
  });

  // Creamos el formato del calendario para mostrar la listas de las citas
  formatoInputNuevaCita(arrayCitasdelDiaElegido);
}

// ========================================================================================================
// Assets para el calendario y la generacoon de la cita
// ========================================================================================================

// En esta variable almacenamos las citas del día seleccionado (por defecto, las del dia de hoy)
let arrayCitasdelDiaElegido = [];

function obtenerCitas(idDoctor, idAsociado) {
  return new Promise((resolve, reject) => {
    $.ajax({
      url: "/Agenda_Citas",
      method: "POST",
      dataType: "json",
      data: {
        idDoctor: idDoctor || null,
        idAsociado: idAsociado || null,
      },
      success: function (respuesta) {
        // Obtiene solo la fecha (YYYY-MM-DD)
        const fechaHoy = new Date().toISOString().split("T")[0];
        arrayCitasdelDiaElegido = respuesta.filter((cita) => {
          // Obtiene la fecha de la cita
          const fechaCita = new Date(cita.HoraCita).toISOString().split("T")[0];
          // Compara solo las fechas
          return fechaCita == fechaHoy;
        });
        console.log("Citas del día: ", arrayCitasdelDiaElegido);
        resolve(respuesta);
      },
      error: function (error) {
        reject(error);
      },
    });
  });
}

async function formatoInputNuevaCita(citas) {
  let Conteo_disponibilidadCitas = {};

  // Con base a las citas obtenidas, se genera un conteo de las citas por fecha
  // con este formato: { "2021-01-01": 2, "2021-01-02": 1, ... }
  citas.forEach((cita) => {
    // Extraer la fecha de la cita (ignorando la hora y tiempo)
    let fechaCita = cita.HoraCita.split("T")[0];

    // Inicializar o incrementar el contador para esa fecha
    if (Conteo_disponibilidadCitas[fechaCita]) {
      Conteo_disponibilidadCitas[fechaCita]++;
    } else {
      Conteo_disponibilidadCitas[fechaCita] = 1;
    }
  });

  let ultimoDiaSeleccionado = null;

  function actualizarEstiloDelDia(dayElem, estilo) {
    dayElem.style.backgroundColor = estilo.backgroundColor;
    dayElem.style.color = estilo.color;
  }

  // Crear un objeto Date para hoy
  let fechaHoy = new Date();
  let fechaMinima = new Date();

  // Establece la fecha mínima como hoy si son antes de las 21:00
  // Si son después de las 21:00, establece la fecha mínima como mañana
  if (fechaHoy.getHours() >= 21) {
    fechaMinima.setDate(fechaHoy.getDate() + 1); // Ajustar para el día siguiente
  }

  // Ajustar la fecha mínima para comenzar a las 9:00
  fechaMinima.setHours(9, 0, 0, 0);

  $(".flatpickr").flatpickr({
    // Cambiar el idioma a español
    locale: {
      firstDayOfWeek: 1,
      weekdays: {
        shorthand: ["Do", "Lu", "Ma", "Mi", "Ju", "Vi", "Sa"],
        longhand: [
          "Domingo",
          "Lunes",
          "Martes",
          "Miércoles",
          "Jueves",
          "Viernes",
          "Sábado",
        ],
      },
      months: {
        shorthand: [
          "Ene",
          "Feb",
          "Mar",
          "Abr",
          "May",
          "Jun",
          "Jul",
          "Ago",
          "Sep",
          "Oct",
          "Nov",
          "Dic",
        ],
        longhand: [
          "Enero",
          "Febrero",
          "Marzo",
          "Abril",
          "Mayo",
          "Junio",
          "Julio",
          "Agosto",
          "Septiembre",
          "Octubre",
          "Noviembre",
          "Diciembre",
        ],
      },
    },
    minDate: fechaMinima,
    disable: [
      function (date) {
        return date.getDay() === 0;
      },
    ],
    // dateFormat: "Y-m-d H:i",
    enableTime: true,
    minTime: "09:00",
    maxTime: "21:00",
    wrap: true,
    defaultDate: fechaMinima, // Establece la fecha y hora por defecto
    // Cuando se seleccioone una fecha, se ejecuta la siguiente función
    onChange: function (selectedDates, dateStr, instance) {
      // Le pasamos a la funcion el array con el filtro de las citas correspondientes al dia seleccionado
      crearListaPacientes(
        citas.filter(
          (cita) => cita.HoraCita.split("T")[0] == dateStr.split(" ")[0]
        )
      );

      // Si hay un día previamente seleccionado, restablece su estilo
      if (ultimoDiaSeleccionado) {
        actualizarEstiloDelDia(ultimoDiaSeleccionado, {
          backgroundColor: "default",
          color: "default",
        });
      }
      // Guarda la referencia al nuevo día seleccionado
      ultimoDiaSeleccionado = instance.days.querySelector(
        ".flatpickr-day.selected"
      );

      // Si el nuevo día seleccionado existe, actualiza su estilo
      if (ultimoDiaSeleccionado) {
        actualizarEstiloDelDia(ultimoDiaSeleccionado, {
          backgroundColor: "#569ef76b",
          color: "default",
        });
      }
    },

    onDayCreate: function (dObj, dStr, fp, dayElem) {
      let fecha = dayElem.dateObj.toISOString().split("T")[0];
      let fechaActual = new Date().toISOString().split("T")[0];

      // Verifica si la fecha del elemento es anterior a la fecha actual
      if (fecha < fechaActual) {
        // No aplicar estilos si la fecha es anterior a hoy
        return;
      }

      //En caso de que esten en los horarios disponibles
      if (Conteo_disponibilidadCitas.hasOwnProperty(fecha)) {
        let numCitas = Conteo_disponibilidadCitas[fecha];
        let estilo = { backgroundColor: "", color: "#ffffff" };

        if (numCitas > 20) {
          estilo.backgroundColor = "#f64747";
        } else if (numCitas > 10) {
          estilo.backgroundColor = "orange";
        } else {
          estilo.backgroundColor = "green";
        }
        actualizarEstiloDelDia(dayElem, estilo);
      }
    },
  });
}

// Funcion para obtener el grupo de la opcion seleccionada
function encontrarGrupoDeOpcionSeleccionada(SelectElement) {
  var optgroups = SelectElement.getElementsByTagName("optgroup");
  for (var i = 0; i < optgroups.length; i++) {
    var opciones = optgroups[i].getElementsByTagName("option");
    for (var j = 0; j < opciones.length; j++) {
      if (opciones[j].selected) {
        return optgroups[i].label || "Grupo sin etiqueta";
      }
    }
  }

  return "Ninguna opción seleccionada";
}



function crearListaPacientes(objeto) {
  console.log(objeto);
  // Se guarda el objeto en una variable global
  arrayCitasdelDiaElegido = objeto;
  const listaPacientes = document.querySelector(".ListaCitas");

  const itemsPorPagina = 8;
  const paginador = $("#PaginacionListaCitas"); // Asegúrate de tener un elemento con este ID en tu HTML

  function mostrarPagina(pageIndex) {
    listaPacientes.innerHTML = ""; // Limpiar la lista actual
    const inicio = (pageIndex - 1) * itemsPorPagina;
    const fin = inicio + itemsPorPagina;
    const citasPagina = arrayCitasdelDiaElegido.slice(inicio, fin);

    citasPagina.forEach((cita) => {
      const lista = document.createElement("ul");
      lista.classList.add("lista");
      listaPacientes.appendChild(lista);

      const li = document.createElement("li");
      li.classList.add("lista__item");
      lista.appendChild(li);

      const p = document.createElement("p");
      p.classList.add("lista__item__parrafo");
      p.textContent = formatearHora(cita.HoraCita);
      li.appendChild(p);

      const p2 = document.createElement("p");
      p2.classList.add("lista__item__parrafo");
      p2.textContent = cita.Procedimiento;
      li.appendChild(p2);

      const p3 = document.createElement("p");
      p3.classList.add("lista__item__parrafo");
      p3.textContent = cita.Nombres;
      li.appendChild(p3);
    });
  }

  if (objeto.length > 0) {
    // Inicializar twbsPagination
    paginador.twbsPagination({
      totalPages: Math.ceil(objeto.length / itemsPorPagina),
      visiblePages: 8,
      first: "Primeras citas del dia",
      next: ">",
      prev: "<",
      last: "Ultima citas del dia",
      onPageClick: function (event, page) {
        mostrarPagina(page);
      },
    });

    // Cargar la primera página
    mostrarPagina(1);
  } else {
    listaPacientes.innerHTML = ""; // Limpiar la lista actual
    paginador.twbsPagination("destroy"); // Destruir el paginador
    const lista = document.createElement("ul");
    lista.classList.add("lista");
    listaPacientes.appendChild(lista);

    const li = document.createElement("li");
    li.classList.add("lista__item");
    lista.appendChild(li);

    const p = document.createElement("p");
    p.classList.add("lista__item__parrafo");
    p.textContent = "No hay citas agendadas";
    li.appendChild(p);
  }
}

function ComprobarDisponibilidad(fechaHora, citas) {
  let citaMasCercana = null;
  let diferenciaMinima = Infinity;

  // Convertir fechaHora de string a objeto Date
  //   console.log("Fecha y hora: ", fechaHora);
  let fechaHoraObj = new Date(fechaHora); // Asume que fechaHora está en UTC
  //   console.log("Fecha y hora: ", fechaHoraObj);
  console.log("Comprobando disponibilidad...");

  //   console.log("Citas: ", citas);
  citas.forEach((cita) => {
    let horaCita = new Date(cita.HoraCita);
    let diferencia = Math.abs(fechaHoraObj - horaCita);

    if (diferencia < diferenciaMinima) {
      diferenciaMinima = diferencia;
      citaMasCercana = cita;
    }
  });
  console.log("Cita más cercana: ", citaMasCercana);
  //   verificarDisponibilidad(citaMasCercana, fechaHoraObj);
  return verificarDisponibilidad(citaMasCercana, fechaHoraObj);
}

//Funcion para comprobar si la hora esta entre un rango de horas
function verificarDisponibilidad(CitaBase, horaAComprobar) {
  // Crearmos objetos de fecha para las horas
  let inicio = new Date(CitaBase.HoraCita);
  let fin = new Date(CitaBase.FinCita);
  let comprobar = new Date(horaAComprobar);

  // Comprobar si la hora está en el rango
  if (comprobar >= inicio && comprobar < fin) {
    swal({
      title: "Problema con la hora de la cita",
      text: `La cita se encuentra en conflicto con la cita de ${
        CitaBase.Nombres
      } para ${CitaBase.Procedimiento} a las ${formatearHora(inicio)}.
        Elige una hora diferente o otra fecha!`,
      icon: "error",
      button: "Aceptar",
    });
    return false;
  } else {
    return true;
  }
}

function sumarIntervalo(fechaHora, intervaloMinutos) {
  // Crear un objeto Date en la zona horaria local
  let fecha = new Date(fechaHora);

  // Sumar el intervalo en minutos
  fecha.setMinutes(parseInt(fecha.getMinutes()) + parseInt(intervaloMinutos));

  // Formatear la fecha y hora para UTC-6
  let fechaFormateada =
    fecha.getFullYear() +
    "-" +
    ("0" + (fecha.getMonth() + 1)).slice(-2) +
    "-" +
    ("0" + fecha.getDate()).slice(-2) +
    " " +
    ("0" + fecha.getHours()).slice(-2) +
    ":" +
    ("0" + fecha.getMinutes()).slice(-2);

  return fechaFormateada;
}
