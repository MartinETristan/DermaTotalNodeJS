//==================================================================================================
// Mostrar la Info en las tablas una vez que se cargue la pagina (Para Recepcion)
//==================================================================================================
let socket = io();
$.ajax({
  url: "/DashboardRecepcion",
  method: "GET",
  dataType: "json",
  success: function (respuesta) {
    //==================================================================================================
    // Pacientes en Espera
    //==================================================================================================
    var CitasHoy = document.querySelector(".ContenidoCitasHoyR");
    if (respuesta.CitasDoctoresHoy.length != 0) {
      for (var i = 0; i < respuesta.CitasDoctoresHoy.length; i++) {
        var contenedor = document.createElement("div");

        var item = document.createElement("li");
        item.textContent =
          respuesta.CitasDoctoresHoy[i].NombresPacientes +
          " " +
          respuesta.CitasDoctoresHoy[i].ApellidosPacientes +
          " " +
          respuesta.CitasDoctoresHoy[i].HoraCita;

        var checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.id = respuesta.CitasDoctoresHoy[i].idCitas;
        checkbox.idDoctor = respuesta.CitasDoctoresHoy[i].idDoctor;
        checkbox.addEventListener("click", function () {
          var idCitas = this.id;
          var doctor = this.idDoctor;
          socket.emit("CambioEstadoPaciente", { Cita: idCitas, idStatus: 1,Doctor: doctor,});
          eliminarContenedor(this);
        });

        contenedor.appendChild(item);
        contenedor.appendChild(checkbox);
        CitasHoy.appendChild(contenedor);
      }
      // Función para eliminar el contenedor
    } else {
      var NoPacientes = document.createElement("h2");
      NoPacientes.textContent = "No hay pacientes en espera.";
      NoPacientes.classList.add("NoPacientes");
      CitasHoy.appendChild(NoPacientes);
    }
  },
  error: function (error) {
    console.error(error);
  },
});

function eliminarContenedor(checkbox) {
  var contenedor = checkbox.parentNode;
  contenedor.remove();
}


