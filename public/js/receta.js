var Pagina = 0;
var IReceta = [];
var IDT = [];
var SucursalUltimaCita = 1;

// Hacemos la consulta para obtener la sucursal de la ultima cita
$.ajax({
  url: "/UltimaReceta",
  method: "POST",
  dataType: "json",
}).then((data) => {
  SucursalUltimaCita = data;
});

// Definimos una la funcion para obtener los datos de la receta.
async function obtenerDatos() {
  // Creamos un array para almacenar las promesas de las peticiones AJAX
  let promises = [];

  // Primera petición AJAX
  let promise1 = $.ajax({
    url: "/Receta",
    method: "POST",
    dataType: "json",
  }).then((data) => {
    IReceta.push(data);
  });

  promises.push(promise1);

  // Segunda petición AJAX
  let promise2 = $.ajax({
    url: "/InfoRegistros",
    method: "POST",
    dataType: "json",
  }).then((data) => {
    IDT.push(data);
  });

  promises.push(promise2);

  // Devolvemos una Promise que se resuelve cuando ambas peticiones AJAX se han completado
  return Promise.all(promises).then(() => {
    // Aquí puedes realizar otras operaciones que dependan de los datos obtenidos, si es necesario
    MedicamentosReceta();
  });
}

// ====================================================
// Función para formatear la receta
// ====================================================
function FormatoReceta() {
  Pagina++;

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

  // Insertar el fragmento de código HTML después del bucle
  const divQR = document.createElement("div");
  divQR.className = "QRs";
  divQR.innerHTML = `
  <img src="/img/RCTa/qr_FB.png" alt="QR_FB" />
  <img src="/img/RCTa/qr_IG.png" alt="QR_IG" />
  `;
  divContenedorFooter.appendChild(divQR);

  // Obtener la información de la sucursal
  const InfoSucursal = IDT[0].Sucursales[SucursalUltimaCita - 1];
  // Y creamos un nuevo div para la sucursal
  const divSucursal = document.createElement("div");
  divSucursal.className = `Sucursal`;

  const pNombre = document.createElement("b");
  pNombre.className = "NombreSucursal";
  pNombre.textContent = `${InfoSucursal.NombreSucursal}`;

  const pDireccion = document.createElement("p");
  pDireccion.textContent = `${InfoSucursal.Direccion}`;

  const pTelefono = document.createElement("p");
  pTelefono.textContent = `${InfoSucursal.Telefono}`;

  divSucursal.appendChild(pNombre);
  divSucursal.appendChild(pDireccion);
  divSucursal.appendChild(pTelefono);

  divContenedorFooter.appendChild(divSucursal);
  const Correo = document.createElement("p");
  Correo.className = "Correo";
  Correo.innerHTML = `${IReceta[0][0].CorreoDoc.toLowerCase()}`;
  divSucursal.appendChild(Correo);

  const divLogo = document.createElement("div");
  divLogo.className = "LogoDT";
  divLogo.innerHTML = `
     <img src="/img/RCTa/DermaTotalLogo.png" alt="Logo" />
   `;

  // Crear un nuevo footer y adjuntarlo al contenedor general
  const Footer = document.createElement("div");
  Footer.className = "Footer";
  Footer.appendChild(divContenedorFooter);
  Footer.appendChild(divLogo);
  // Agregar todos los elementos al div "Receta"
  divReceta.appendChild(Header);
  divReceta.appendChild(lineup);
  divReceta.appendChild(InfoPaciente);
  divReceta.appendChild(linedown);
  divReceta.appendChild(InfoReceta);
  divReceta.appendChild(Footer);

  // Finalmente, agregar el div "Receta" al documento
  InsertReceta.appendChild(divReceta);
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

  // Verificamos si es par o no
  function isEven(num) {
    return num % 2 === 0;
  }

  // Función para agregar los elementos <div> al elemento .InfoReceta
  function AgregarDivsAReceta(divs) {
    // Buscar el div padre "Receta N" y dentro de él buscar el div hijo "InfoReceta"
    const padreReceta = document.querySelector(`.Receta_${contadorReceta}`);
    // Si es par, le quitarmos el margin Bottom
    if (isEven(contadorReceta)) {
      padreReceta.setAttribute(
        "style",
        `margin-bottom: 0;     
      page-break-after: always;
      `
      );
    }

    if (padreReceta) {
      const contenedorInfoReceta = padreReceta.querySelector(".InfoReceta");
      divs.forEach((div) => {
        contenedorInfoReceta.appendChild(div);
      });
      if (
        divs[divs.length - 1].className === "Nota" &&
        contenedorInfoReceta.querySelector(".NotaPaciente")
      ) {
        if (contenedorInfoReceta.scrollHeight > 300) {
          const lastDiv = divs[divs.length - 1];
          contenedorInfoReceta.removeChild(lastDiv);
          contadorReceta++;
          FormatoReceta();
          const RecetaNota = document.querySelector(
            `.Receta_${contadorReceta}`
          );
          const InfoRecetaNota = RecetaNota.querySelector(".InfoReceta");
          InfoRecetaNota.appendChild(lastDiv);
        }
      }

      console.log(contenedorInfoReceta.scrollHeight);
      // Verificar si la altura del contenedor supera los 300px
      if (contenedorInfoReceta.scrollHeight > 300) {
        // Remover el último div agregado
        const lastDiv = divs[divs.length - 1];
        contenedorInfoReceta.removeChild(lastDiv);

        // Agregar el div removido al inicio de divsParaRecetaActual
        divsParaRecetaActual.unshift(lastDiv);
        console.log(divsParaRecetaActual);
        overlap = true;
      }
    }
  }
  //Aqui nos aseguramos de que no se agregue un salto de pagina al final de la ultima receta
  function quitarUltimoSaltoDePagina() {
    const ultimoDivReceta = document.querySelector(`.Receta_${contadorReceta}`);
    if (ultimoDivReceta) {
      const ultimoInfoReceta = ultimoDivReceta.querySelector(`.InfoReceta`);
      ultimoDivReceta.style.pageBreakAfter = "auto";
      ultimoInfoReceta.setAttribute(
        "style",
        `justify-content: flex-start; gap: 10px;`
      );
    }
  }

  overlap = false;

  // Iterar sobre cada elemento en el array IReceta
  IReceta.forEach((receta) => {
    for (let key = 0; key < receta.length; key++) {
      if (receta.hasOwnProperty(key)) {
        // Crear un elemento <div> para cada conjunto de elementos <dl>
        const div = document.createElement("div");

        // Crear elementos <dl>, <dt> y <dd>
        const dl = document.createElement("dl");
        const dt = document.createElement("dt");
        const dd = document.createElement("dd");

        // Establecer el contenido de <dt> y <dd>
        let span = document.createElement("span");
        span.textContent = receta[key].Medicamento.toUpperCase(); // Usar 'key' como nombre del medicamento
        dt.appendChild(span);
        dt.appendChild(document.createTextNode(":")); // Añadir el ':' fuera del span
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
      if (overlap) {
        key--;
        overlap = false;
      }
    }
    // Si se tiene una nota en la receta, se agrega al final de la receta
    if (IReceta[0][0].Nota) {
      const divNota = document.createElement("div");
      divNota.className = "Nota";
      divNota.innerHTML = `
      <div class="NotaPaciente">
        <b>NOTA:</b>
        <p>${IReceta[0][0].Nota.toUpperCase()}</p>
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
  quitarUltimoSaltoDePagina();
}

// Y ejecutamos la funcion principal que nos generará la receta
obtenerDatos();

$(document).on("click",function () {
  window.print();
});