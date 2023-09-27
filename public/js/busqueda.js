$(document).ready(function () {
  // Cuando se presione una tecla en los campos de entrada
  $(".f-inp").keyup(buscarPacientes);

  function buscarPacientes() {
    // Obtiene los valores de los campos de entrada
    var nombre = $("#BNombre").val();
    var apellido = $("#BApellido").val();
    var telefono = $("#BTelefono").val();

    if (nombre === "" && apellido === "" && telefono === "") {
      $("#ResultadosBusqueda").html("");
      return;
    }

    // Realiza la solicitud Ajax
    $.ajax({
      url: "/BusquedaPacientes",
      type: "POST",
      data: { nombre: nombre, apellido: apellido, telefono_correo: telefono },
      dataType: "json",
      success: function (data) {
        function generarImagenPerfil(ruta) {
            let rutarelativa = "/img/UserIco.webp";  // Declarar la imagen por defecto fuera del bloque if
            if (ruta !== "/img/UserIco.webp") {
              // Formato para la ruta de la imagen del paciente
              const relativa = "/public";
              // Encuentra la posición del texto deseado
              const posicion = ruta.indexOf(relativa);
    
              if (posicion !== -1) {
                // Usa substring() para obtener los caracteres después de "Ejemplo:"
                rutarelativa = ruta.substring(posicion + relativa.length);
      
                // Encuentra la última posición de "/" en la cadena rutarelativa
                const ultimaBarra = rutarelativa.lastIndexOf("/");
      
                // Agrega el texto después de la última barra
                if (ultimaBarra !== -1) {
                  const parte1 = rutarelativa.substring(0, ultimaBarra + 1); // Incluye la última barra
                  const parte2 = rutarelativa.substring(ultimaBarra + 1); // Lo que sigue después de la última barra
                  rutarelativa = parte1 + "Pequeño-" + parte2;
                }
              } else {
                console.log("Texto deseado no encontrado");
              }
            }
          return rutarelativa;
        }

        // Muestra los resultados en la sección "ResultadosBusqueda"
        const $resultados = $("#ResultadosBusqueda");
        const resultadosHTML =
          data && Array.isArray(data) && data.length > 0
            ? data
                .map((elemento) => {
                  const imagenPerfil = generarImagenPerfil(elemento.RutaFoto || "/img/UserIco.webp");
                  return `
                  <div class="contresultados">
                    <div class="resultado" data-id="${elemento.idPaciente}">
                      <div class="PacienteFoto">
                        <img class="fotousuario" src="${imagenPerfil}" alt="Foto de perfil" onerror="this.onerror=null;this.src='/img/UserIco.webp';">
                      </div>
                      <div class="datospaciente">
                        <h2>${elemento.Nombre} ${elemento.ApellidoP} ${
                    elemento.ApellidoM
                  }</h2>
                        <span><b>Telefono: </b>${
                          elemento.Telefono || "No hay telefono registrado"
                        } | <b>Correo: </b>${
                    elemento.Correo || "No hay correo registrado"
                  } <br> <b>Status: </b>${elemento.Status}</span>
                      </div>
                    </div>
                    <hr>
                  </div>`;
                })
                .join("")
            : '<p>No se encontraron pacientes. <a href="/NuevoPaciente">Puedes crear uno nuevo</a></p>';

        $resultados.html(resultadosHTML);

        // Agrega un controlador de eventos para redirigir al hacer clic en un paciente
        $resultados.on("click", ".resultado", function () {
          const idPaciente = $(this).data("id");
          if (idPaciente) {
            const url = `/InfoPaciente/${idPaciente}`;
            window.location.href = url;
          }
        });
      },
      error: function (xhr) {
        if (xhr.status === 404) {
          // Manejo de error 404 (Imagen no encontrada)
          const imagenNoEncontradaURL = "/img/UserIco.webp";
          $(".fotousuario").on("error", function () {
            this.onerror = null;
            this.src = imagenNoEncontradaURL;
          });
        } else {
          alert("Error en la solicitud Ajax");
        }
      },
    });
  }
});
