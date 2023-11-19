import { mysql, db } from "../conf_api.js";

// Muestra las citas que tiene el doctor en el dia de hoy
export async function CitasDoctor(idDoctor) {
  try {
    const connection = await mysql.createConnection(db);
    const CalendarioCitas = `SELECT c.idCitas,c.idPaciente,c.idStatusPaciente, u.Nombres, p.Procedimiento ,c.HoraCita ,c.FinCita FROM Citas c 
      INNER JOIN Procedimiento p ON c.idProcedimiento = p.idProcedimiento 
      INNER JOIN Paciente pa ON c.idPaciente  = pa.idPaciente 
      INNER JOIN  Usuarios u ON pa.idUsuario  = u.idUsuario 
      WHERE  idDoctor = ?`;
    const [rowsCitas, fieldsHoy] = await connection.execute(CalendarioCitas, [
      idDoctor,
    ]);
    connection.end();
    return rowsCitas;
  } catch (error) {
    console.error(
      "Ha ocurrido un error obteniendo las citas del doctor: ",
      error
    );
    return "Ha ocurrido un error.";
  }
}

// Modigica la fecha y duracion de la cita
export async function ModificacionCita(idCita, HoraIncio, FinCita) {
  try {
    const connection = await mysql.createConnection(db);
    const CambioCita = `UPDATE Citas SET HoraCita = ?, FinCita = ? WHERE idCitas = ?;
      `;
    await connection.execute(CambioCita, [HoraIncio, FinCita, idCita]);
    connection.end();
  } catch (error) {
    console.error("Ha ocurrido un error actualizando la cita: ", error);
    return "Ha ocurrido un error.";
  }
}

// Actualiza el Checkout de la Sesions
export async function Update_Checkout(idSesion, CheckOut) {
  try {
    const connection = await mysql.createConnection(db);
    const consulta = `UPDATE Sesion
  SET CheckOut = ?
  WHERE idSesion = ?`;
    connection.execute(consulta, [CheckOut, idSesion]);
    connection.end();
  } catch (error) {
    console.error(
      "Ha ocurrido un error en la actualizacion del Checkout:",
      error
    );
    return "Ha ocurrido un error.";
  }
}

// Actualiza el seguimiento de la sesion de la cita
export async function UpdateSeguimiento(idSesion, Seguimiento){
try {
  const connection = await mysql.createConnection(db);
  const consulta = `UPDATE Sesion
  SET Seguimiento = ?
  WHERE idSesion = ?`;
  connection.execute(consulta, [Seguimiento, idSesion]);
  connection.end();
}catch (error) {
  console.error(
    "Ha ocurrido un error en la actualizacion del seguimiento:",
    error
  );
  return "Ha ocurrido un error.";
}

}


