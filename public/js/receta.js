var Pagina = 0;
var IReceta = [];
var IDT = [];

// Definimos una la funcion para obtener los datos de la receta.
function obtenerDatos() {
  // ====================================================
  // Hacemos la peticion de los medicamentos de la receta
  // ====================================================
  $.ajax({
    url: "/Receta",
    method: "POST",
    dataType: "json",
    success: (data) => {
      console.log(data);
      IReceta.push(data);
    },
  });

  // ====================================================
  // Hacemos la peticion con la info de la sucursal
  // ====================================================
  $.ajax({
    url: "/InfoRegistros",
    method: "GET",
    dataType: "json",
    success: (data) => {
      // console.log(data);
      IDT.push(data);
    },
  });
  // Se pone un Delay para que se cargue la info de la receta
  setTimeout(
    () => {
      MedicamentosReceta();
    },
    100
  );
  // Y para que en cuanto termine de cargarse, se imprima automaticamente y se cierre la ventana
  setTimeout(
    () => {
      window.print();
      window.close();
    },
    150
  );
}
// ====================================================
// Función para formatear la receta
// ====================================================
function FormatoReceta() {
  Pagina++;
  console.log("Info de la Receta con IReceta:");
  console.log(IReceta);
  console.log("Info de la Sucursal con IDT:");
  console.log(IDT);

  const InsertReceta = document.getElementById("ContenidoReceta");
  // Obtener la fecha actual
  const fechaActual = new Date();
  // Obtener el día, mes y año
  const dia = fechaActual.getDate();
  const mes = fechaActual.getMonth() + 1; // Los meses en JavaScript van de 0 a 11, así que sumamos 1
  const año = fechaActual.getFullYear();

  // Formatear la fecha en el formato día/mes/año
  const fechaFormateada = `Fecha: ${dia}/${mes}/${año}`;

  // Crear el div "Receta" y configurarlo
  const divReceta = document.createElement("div");
  divReceta.className = "Receta_" + Pagina;

  // Crear los elementos Header, InfoPaciente, InfoReceta, Footer y otros elementos
  const Header = document.createElement("div");
  Header.className = "Header";

  Header.innerHTML = `
      <div class="LogoCMI">
          <img src="/img/RCTa/Logo-CMI.png" alt="Logo" />
      </div>
      <div class="InfoDoc">
          <h3 class="Doctor">${
            IReceta[0][0].Doctor || "Cargando Doctor..."
          }</h3>
          <h4 class="Especialidad">${
            IReceta[0][0].Especialidad || "Cargando Especialidad..."
          }</h4>
          <p class="Estudios">${
            IReceta[0][0].Universidad +
              " / Ced. Prof: " +
              IReceta[0][0].CertificadoProf ||
            "Cargando Universidad / Cert. Prof..."
          }</p>
      </div>`;
  const lineup = document.createElement("hr");
  const InfoPaciente = document.createElement("div");
  InfoPaciente.className = "InfoPaciente";
  InfoPaciente.innerHTML = `
      <div class="Nombre">
          <p class="NombrePaciente">${
            "Nombre: " + IReceta[0][0].Paciente || "Cargando Nombre Paciente..."
          }</p>
      </div>
      <div class="Fecha">
          <p class="FechaHoy">${fechaFormateada || "Cargando Fecha..."}</p>
      </div>`;
  const linedown = document.createElement("hr");

  const InfoReceta = document.createElement("div");
  InfoReceta.className = "InfoReceta";

  // Crear un nuevo div contenedor para el footer
  const divContenedorFooter = document.createElement("div");
  divContenedorFooter.className = "ContenedorFooter";

  // Recorre el array de sucursales y crea la estructura HTML para cada una
  IDT[0].Sucursales.forEach((sucursal, index) => {
    const divSucursal = document.createElement("div");
    divSucursal.className = `Sucursal${index + 1}`;

    const pNombre = document.createElement("b");
    pNombre.textContent = `${sucursal.NombreSucursal}`;

    const pDireccion = document.createElement("p");
    pDireccion.textContent = `${sucursal.Direccion}`;

    const pTelefono = document.createElement("p");
    pTelefono.textContent = `${sucursal.Telefono}`;

    divSucursal.appendChild(pNombre);
    divSucursal.appendChild(pDireccion);
    divSucursal.appendChild(pTelefono);

    divContenedorFooter.appendChild(divSucursal);

    if (index === IDT[0].Sucursales.length - 1) {
      const Correo = document.createElement("p");
      Correo.className = "Correo";
      Correo.innerHTML = `${IReceta[0][0].CorreoDoc}`;
      divSucursal.appendChild(Correo);
    }
  });

  // Insertar el fragmento de código HTML después del bucle
  const divQR = document.createElement("div");
  divQR.className = "QRs";
  divQR.innerHTML = `
  <img src="/img/RCTa/qr_FB.png" alt="QR_FB" />
  <img src="/img/RCTa/qr_IG.png" alt="QR_IG" />
  `;
  divContenedorFooter.appendChild(divQR);
  const divLogo = document.createElement("div");
  divLogo.className = "LogoDT";
  divLogo.innerHTML = `
     <img src="/img/RCTa/DermaTotalLogo.png" alt="Logo" />
   `;
  divContenedorFooter.appendChild(divLogo);

  // Crear un nuevo footer y adjuntarlo al contenedor general
  const Footer = document.createElement("div");
  Footer.className = "Footer";
  Footer.appendChild(divContenedorFooter);

  // Agregar todos los elementos al div "Receta"
  divReceta.appendChild(Header);
  divReceta.appendChild(lineup);
  divReceta.appendChild(InfoPaciente);
  divReceta.appendChild(linedown);
  divReceta.appendChild(InfoReceta);
  divReceta.appendChild(Footer);

  // Finalmente, agregar el div "Receta" al documento
  document.body.appendChild(divReceta);
  document.body.appendChild(InsertReceta);
}



// ====================================================
// Función para crear los elementos <div> de la receta
// ====================================================

function MedicamentosReceta() {
  // Crear un elemento <div> para contener la lista de medicamentos
  const mainDiv = document.createElement("div");
  let divCount = 0;
  let contadorReceta = 1;
  let divsParaRecetaActual = []; // Array para almacenar los divs de la receta actual

  // Función para isnertar el formato de la receta
  FormatoReceta();

  // Función para agregar los elementos <div> al elemento .InfoReceta
  function AgregarDivsAReceta(divs) {
    // Buscar el div padre "Receta N" y dentro de él buscar el div hijo "InfoReceta"
    const padreReceta = document.querySelector(`.Receta_${contadorReceta}`);
    if (padreReceta) {
      const contenedorInfoReceta = padreReceta.querySelector(".InfoReceta");
      divs.forEach((div) => {
        contenedorInfoReceta.appendChild(div);
      });
    }
  }

  // Iterar sobre cada elemento en el array IReceta
  IReceta.forEach((receta) => {
    for (const key in receta) {
      if (receta.hasOwnProperty(key)) {
        // Crear un elemento <div> para cada conjunto de elementos <dl>
        const div = document.createElement("div");

        // Crear elementos <dl>, <dt> y <dd>
        const dl = document.createElement("dl");
        const dt = document.createElement("dt");
        const dd = document.createElement("dd");

        // Establecer el contenido de <dt> y <dd>
        dt.textContent = receta[key].Medicamento; // Usar 'key' como nombre del medicamento
        dd.textContent = receta[key].Indicacion;

        // Agregar elementos <dt> y <dd> al elemento <dl>
        dl.appendChild(dt);
        dl.appendChild(dd);

        // Agregar elemento <dl> al elemento <div>
        div.appendChild(dl);

        // Incrementar el contador de <div>
        divCount++;

        // Agregar el <div> al array de la receta actual
        divsParaRecetaActual.push(div);

        // Comprobar si se han generado 4 <div>
        if (divCount % 4 === 0) {
          // Agregar los 4 <div> a la receta actual
          AgregarDivsAReceta(divsParaRecetaActual);
          // Limpiar el array
          divsParaRecetaActual = [];
          // Cambiar a la siguiente receta
          contadorReceta++;
          // Formatear la receta si es necesario
          FormatoReceta();
        }
      }
    }
    // Si se tiene una nota en la receta, se agrega al final de la receta
    if(IReceta[0][0].Nota){
      const divNota = document.createElement("div");
      divNota.className = "Nota";
      divNota.innerHTML = `
      <div class="NotaPaciente">
        <b>NOTA:</b>
        <p>${IReceta[0][0].Nota}</p>
      </div>
      `;
      divsParaRecetaActual.push(divNota);
    }
  });

  // Si quedan divs sin agregar a una receta completa, agrégalos
  if (divsParaRecetaActual.length > 0) {
    AgregarDivsAReceta(divsParaRecetaActual);
  }

  // Agregar el elemento principal <div> al documento HTML
  document.body.appendChild(mainDiv);
}



$(document).ready(async function () {
  obtenerDatos();

});
