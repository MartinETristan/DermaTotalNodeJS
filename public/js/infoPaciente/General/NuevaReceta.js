//========================================================================================================
// Nueva Receta
//========================================================================================================
function cargarNuevaReceta(){

  agregarEventListener("botonNuevaReceta", function () {
    // Acciones a realizar cuando se haga clic en el botón
    const formreceta = document.getElementById("NuevaReceta");
    const botoncancelar = document.getElementById("cancelarReceta");
    const botonNuevaReceta = document.getElementById("botonNuevaReceta");
    formreceta.style.display = "block";
    botoncancelar.style.display = "block";
    botonNuevaReceta.style.display = "none";

    if(datosAlmacenados.SesionesActivas.length > 0){
      const form = document.getElementById("recetaForm");
      const idSesion =document.createElement("input");
      idSesion.type = "hidden";
      idSesion.name = "idSesion";
      idSesion.value = datosAlmacenados.SesionesActivas[0].idSesion;
      form.appendChild(idSesion);
    }
    
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

        // Boton para crear el par de Medicamento e Indicación
        const botonAñadir = document.createElement("button");
        botonAñadir.type = "button";
        botonAñadir.textContent = "Añadir";
        botonAñadir.classList.add("AñadirMedicamento");
        botonAñadir.addEventListener("click", () => {
          agregarCampos({
            zona: botonAñadir.parentNode,
            NombreInputMedicamento: "Medicamentos",
            NombreInputIndicacion: "Indicaciones",
          });
        });
        contenedor.appendChild(botonAñadir);

        const indicacionInput = document.createElement("input");
        indicacionInput.type = "text";
        indicacionInput.name = "Indicaciones";
        indicacionInput.placeholder = "Indicación";
        indicacionInput.classList.add("indicacionreceta");
        indicacionInput.required = true;
        indicacionInput.value = item.Indicacion;
        contenedor.appendChild(indicacionInput);

        camposMedicamentos.appendChild(contenedor);

      });
    }else{
      // Si no hay recetas, creamos un par de campos de medicamentos e indicaciones
      const contenedor = document.createElement("div");
      contenedor.classList.add("New");
      const medicamentoInput = document.createElement("input");
      medicamentoInput.type = "text";
      medicamentoInput.name = "Medicamentos";
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
    
      // Boton para crear el par de Medicamento e Indicación
      const botonAñadir = document.createElement("button");
      botonAñadir.type = "button";
      botonAñadir.textContent = "Añadir";
      botonAñadir.classList.add("AñadirMedicamento");
      botonAñadir.addEventListener("click", () => {
        agregarCampos({
          zona: botonAñadir.parentNode,
          NombreInputMedicamento: "Medicamentos",
          NombreInputIndicacion: "Indicaciones",
        });
      });
      contenedor.appendChild(botonAñadir);
    
      const indicacionInput = document.createElement("input");
      indicacionInput.type = "text";
      indicacionInput.name = "Indicaciones";
      indicacionInput.placeholder = "Indicación";
      indicacionInput.classList.add("indicacionreceta");
      indicacionInput.required = true;
      contenedor.appendChild(indicacionInput);
      camposMedicamentosDiv.appendChild(contenedor);
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

  

  //========================================================================================================
  // Enviar el Formulario para crear una Nueva Receta
  //========================================================================================================
  const recetaForm = document.getElementById("recetaForm");
  const camposMedicamentosDiv = document.getElementById("camposMedicamentos");
  
  recetaForm.addEventListener("submit", (event) => {
    event.preventDefault();
  
    const formdata = [];
    
    // Seleccionar todos los divs que contienen los pares de medicamento e indicación
    const medicamentoDivs = camposMedicamentosDiv.querySelectorAll('div');
    
    medicamentoDivs.forEach((div) => {
      // Encontrar los inputs dentro del div actual
      const inputMedicamento = div.querySelector('input[name="Medicamentos"]');
      const inputIndicacion = div.querySelector('input[name="Indicaciones"]');
  
      // Verificar si ambos inputs existen
      if (inputMedicamento && inputIndicacion) {
        // Añadir el par medicamento-indicación al array formdata
        formdata.push({
          medicamento: inputMedicamento.value,
          indicacion: inputIndicacion.value
        });
      }
    });
  
    // Ahora formdata contiene los pares medicamento-indicación
    fetch(recetaForm.action, {
      method: recetaForm.method,
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
      Medicamento_Indicacion:formdata,
      idSesion: datosAlmacenados.SesionesActivas[0] ? datosAlmacenados.SesionesActivas[0].idSesion : null,
      Nota: recetaForm.Nota.value
    })
    });
    // Y recargamos la página
    location.reload();
  });
  

}

