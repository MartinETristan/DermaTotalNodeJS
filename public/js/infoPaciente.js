
// Declarar una variable global para almacenar los datos
let datosAlmacenados = null;
var NombreUsuario = null;

// ========================================================================================================
// Función para realizar la consulta AJAX y almacenar los datos
// ========================================================================================================
function obtenerDatos() {
  return new Promise((resolve, reject) => {
    if (datosAlmacenados) {
      // Si los datos ya están almacenados, resuelve con esos datos
      resolve(datosAlmacenados);
    } else {
      $.ajax({
        url: "/InfoPaciente",
        method: "POST",
        dataType: "json",
        success: (data) => {
          // Guardamos los datos para eviar hacer la consulta AJAX nuevamente
          datosAlmacenados = data;
          NombreUsuario = data.DatosDT[0].Usuario;
          // Llenamos los campos de la vista con los datos obtenidos
          //Nombre
          const Nombre = document.querySelector(".Nombre");
          Nombre.textContent = data.BasicInfo[0].Nombres;
          //Apellido
          const Apellido = document.querySelector(".Apellido");
          Apellido.textContent = data.BasicInfo[0].Apellidos;
          // Y edad
          const Edad = document.querySelector(".Edad");
          Edad.textContent = data.BasicInfo[0].Edad;

          // Foto de perfil
          const Avatar = document.querySelector(".fotousuario");
          const ruta = data.BasicInfo[0].RutaFoto;
          let rutarelativa = ""; // Declarar la variable fuera del bloque if

          if (ruta) {
            const relativa = "/public";
            // Encuentra la posición del texto deseado
            const posicion = ruta.indexOf(relativa);

            if (posicion !== -1) {
              // Usa substring() para obtener los caracteres después de "Ejemplo:"
              rutarelativa = ruta.substring(posicion + relativa.length);
            } else {
              console.log("Texto deseado no encontrado");
            }
          }
          const nuevaURL =
            rutarelativa + "/" + data.BasicInfo[0].Nombres + ".jpg";

          // En caso de error (imagen no encontrada), utiliza la imagen por defecto
          Avatar.onerror = function () {
            Avatar.src = "/img/UserIco.webp";
          };
          Avatar.src = nuevaURL;
          resolve(data);
        },
        error: function (error) {
          console.error(error);
        },
      });
    }
  });
}

//Carga de contenido AJAX con los botones de la vista una vez que se cargue el doctumento
$(document).ready(async function () {
  // Cargar la vista General.ejs al cargar la página
  cargarGeneral();

  $("#Historial").removeClass("activo");
  $("#Recetas").removeClass("activo");
  var seccion = document.getElementById("General");
  seccion.classList.add("activo");

  // Agregar eventos de clic para cargar las vistas
  $("#General").click(function () {
    cargarGeneral();
    $("#Historial").removeClass("activo");
    $("#Recetas").removeClass("activo");
    var seccion = document.getElementById("General");
    seccion.classList.add("activo");
  });

  $("#Historial").click(function () {
    cargarHistorial();
    $("#General").removeClass("activo");
    $("#Recetas").removeClass("activo");
    var seccion = document.getElementById("Historial");
    seccion.classList.add("activo");
  });

  $("#Recetas").click(function () {
    cargarRecetas();
    $("#General").removeClass("activo");
    $("#Historial").removeClass("activo");
    var seccion = document.getElementById("Recetas");
    seccion.classList.add("activo");
  });
});
