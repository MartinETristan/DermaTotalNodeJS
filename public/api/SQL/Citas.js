import { mysql, db } from "../api_conf.js";

// Muestra las citas que tiene el doctor 15 dias antes de la fecha actual
// y todas las citas que tiene el doctor despues de la fecha actual
export async function CitasMedico(idDoctor, idAsociado) {
  let CitasMedico = [];

  try {
    const connection = await mysql.createConnection(db);
    let fechaActual = new Date();
    fechaActual.setDate(fechaActual.getDate() - 15);
    let fechaLimite = fechaActual.toISOString().split("T")[0];

    // Define la consulta base
    let CalendarioCitasBase = `SELECT c.idCitas, c.idPaciente, c.idStatusPaciente, u.Nombres, c.HoraCita, c.FinCita 
          FROM Citas c 
          INNER JOIN Paciente pa ON c.idPaciente = pa.idPaciente 
          INNER JOIN Usuarios u ON pa.idUsuario = u.idUsuario  `;

    // Añadir la condición adecuada según si idDoctor o idAsociado está presente
    let CalendarioCitas;
    let params;
    if (idDoctor != "" && idAsociado == "") {
      CalendarioCitas =
        CalendarioCitasBase +
        `WHERE c.idDoctor = ? AND c.HoraCita >= ? ORDER BY c.HoraCita ASC`;
      params = [idDoctor, fechaLimite];
    } else if (idAsociado != "" && idDoctor == "") {
      CalendarioCitas =
        CalendarioCitasBase +
        `WHERE c.idAsociado = ? AND c.HoraCita >= ? ORDER BY c.HoraCita ASC`;
      params = [idAsociado, fechaLimite];
    } else {
      // Manejar el caso en que ambos son null, si es necesario
      return "Error: No se especificó un doctor o asociado";
    }

    const [rowsCitas, fieldsHoy] = await connection.execute(
      CalendarioCitas,
      params
    );
    if (rowsCitas.length > 0) {
      for (let cita of rowsCitas) {
        const query_procedimientos = `SELECT p.Procedimiento
          FROM Procedimiento_Citas pc
          LEFT JOIN Procedimiento p ON pc.idProcedimiento  = p.idProcedimiento 
          WHERE idCitas = ?             
          `;
        const [rowProcedimientos] = await connection.execute(
          query_procedimientos,
          [cita.idCitas]
        );

        // Agrega la información de los procedimientos a cada cita
        cita.Procedimientos = rowProcedimientos.map(
          (proc) => proc.Procedimiento
        );

        CitasMedico.push({
          idCitas: cita.idCitas,
          idPaciente: cita.idPaciente,
          idStatusPaciente: cita.idStatusPaciente,
          Nombres: cita.Nombres,
          Procedimiento: cita.Procedimientos,
          HoraCita: cita.HoraCita,
          FinCita: cita.FinCita,
        });
      }
    }

    connection.end();
    return CitasMedico;
  } catch (error) {
    console.error(
      "Ha ocurrido un error obteniendo las citas del doctor: ",
      error
    );
    return "Ha ocurrido un error.";
  }
}

export async function NuevaCita(
  idSucursal,
  idProcedimiento,
  idDoctor,
  idAsociado,
  idPaciente,
  HoraCita,
  FinCita,
  NotasCita
) {
  try {
    const connection = await mysql.createConnection(db);
    const consulta = `INSERT INTO Citas
    (idSucursal, idProcedimiento, idDoctor, idAsociado, idPaciente, HoraCita, FinCita, Nota)
    VALUES(?,?,?,?,?,?,?,?);`;
    const idCita = await connection.execute(consulta, [
      idSucursal,
      idProcedimiento,
      idDoctor != "" ? idDoctor : null,
      idAsociado != "" ? idAsociado : null,
      idPaciente,
      HoraCita,
      FinCita,
      NotasCita != "" ? NotasCita : null,
    ]);
    connection.end();
    return idCita[0].insertId;
  } catch (error) {
    console.error("Ha ocurrido un error creando la cita: ", error);
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
export async function UpdateSeguimiento(idSesion, Seguimiento) {
  try {
    const connection = await mysql.createConnection(db);
    const consulta = `UPDATE Sesion
  SET Seguimiento = ?
  WHERE idSesion = ?`;
    connection.execute(consulta, [Seguimiento, idSesion]);
    connection.end();
  } catch (error) {
    console.error(
      "Ha ocurrido un error en la actualizacion del seguimiento:",
      error
    );
    return "Ha ocurrido un error.";
  }
}
