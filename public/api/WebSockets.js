// ==================================================================================================
// Importacion de API's
// ==================================================================================================
// Tiempo
import * as API_TimeMachine from "./api_timemachine.js";
// Dashboard
import * as API_Dashboard from "./SQL/Dashboard.js";
// Citas
import * as API_Citas from "./SQL/Citas.js";

export default function (io) {
  io.on("connection", (socket) => {
    console.log("Usuario conectado");
    // Asignamos un canal de comunicacion para cada tipo de usuario
    switch (socket.request.session.idClaseUsuario) {
      case 1:
      case 2:
      case 3:
        var RoomDoctor = "Doctor" + socket.request.session.idTipoDeUsuario;
        socket.join(RoomDoctor);
        break;
      case 4:
      case 5:
        var RoomRecepcion = "Recepcion";
        socket.join(RoomRecepcion);
        break;
      case 6:
        var RoomAsociado = "Asociado" + socket.request.session.idTipoDeUsuario;
        socket.join(RoomAsociado);
        break;
      default:
        var RoomPaciente = "Paciente" + socket.request.session.idTipoDeUsuario;
        socket.join(RoomPaciente);
        break;
    }

    // Cambios realizados en el dashboard por recepcionistas
    socket.on("CambioEstadoPaciente", (data) => {
      let HoraLocal =
        socket.request.session.Sucursal == 1
          ? API_TimeMachine.FechaHora().HoraS1
          : API_TimeMachine.FechaHora().HoraS2;

      switch (data.idStatus) {
        case 1:
          // Registrar hora de llegada con base a la hora del recepcionista
          API_Dashboard.Hoy_Espera(data.Cita, HoraLocal).then(() => {
            // Emitimos el cambio de estado a los doctores en caso de que sea un doctor
            let room = data.Doctor
              ? "Doctor" + data.Doctor
              : "Asociado" + data.Asociado;
            io.to(room).emit("Hoy_Espera");
            socket.except("Doctor" + data.Doctor).emit("OtrosConsultorios");
            io.to("Recepcion").emit("CheckIn");
          });

          break;

        case 2:
          // Creamos una sesion y le asignamos los datos de la cita
          // Si la cita es de un doctor, se le asigna el id del doctor, si no, se le asigna el id del asociado
          let params = [
            data.idCita,
            data.idConsultorio,
            data.idDoctor || null,
            data.idAsociado || null,
            data.idPaciente,
            HoraLocal,
          ];
          // console.log(params);

          API_Dashboard.CrearSesion(...params).then(() => {
            // if (data.idDoctor) {
            //   // Mandamos actualizar la tabla de espera para el doctor
            //   io.to("Doctor" + data.idDoctor).emit("Espera_Consulta");
            // }
            // socket.except("Doctor" + data.idDoctor).emit("OtrosConsultorios");
            io.emit("OC_Espera");
            console.log("Se ha asignado la consulta");
            io.to("Recepcion").emit("P_Pedidos");
          });

          break;

        case 3:
          // Registrar hora de finalizacion y checkout de la consulta
          API_Dashboard.Consulta_Checkout(
            data.idCita || null,
            data.idSesion,
            HoraLocal,
            data.Checkout
          ).then(() => {
            // Emitimos el cambio de estado a los doctores en caso de que sea un doctor
            let cuarto = data.Doctor
              ? "Doctor" + data.Doctor
              : "Asociado" + data.Asociado;
            io.to(cuarto).emit("Consulta_CheckOut");
            socket.except("Doctor" + data.Doctor).emit("OtrosConsultorios");
            io.to("Recepcion").emit("CheckOut");
          });

          break;

        default:
          console.log(
            "No se ha encontrado el estado para actualizar el Socket"
          );
          break;
      }
    });

    socket.on("Update_Checkout", (data) => {
      console.log(data);
      API_Citas.Update_Checkout(data.idSesion, data.CheckOut).then(() => {
        io.to("Doctor" + socket.request.session.idDoctor).emit(
          "Update_CheckOut"
        );
        io.to("Recepcion").emit("CheckOut");
      });
    });

    socket.on("Descartar_P_Pedido", (data) => {
      API_Dashboard.Limpiar_P_Pedidos(data.idCita).then(() => {
        io.to("Recepcion").emit("Clean_P_Pedidos");
      });
    });

  

    // const rooms = io.sockets.adapter.rooms;
    // // Con esto vemos las salasdisponibles a donde se mandarán los mensajes
    // console.log('Lista de salas:', rooms);

    socket.on("disconnect", () => {
      console.log("Socket desconectado");
    });

    socket.onclose = function (event) {
      console.log("La conexión WebSocket se cerró.");
      // Aquí puedes agregar lógica para manejar el cierre
    };
  });
}
