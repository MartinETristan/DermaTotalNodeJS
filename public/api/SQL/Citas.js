import { mysql, db } from "../conf_api.js";

async function CitasDoctor(idDoctor) {
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

async function ModificacionCita(idCita, HoraIncio, FinCita) {
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

export { 
  CitasDoctor, 
  ModificacionCita 
};
