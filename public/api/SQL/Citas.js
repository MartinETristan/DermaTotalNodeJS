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
  idProcedimientos,
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
    (idSucursal, idDoctor, idAsociado, idPaciente, HoraCita, FinCita, Nota)
    VALUES(?,?,?,?,?,?,?);`;
    const idCita = await connection.execute(consulta, [
      idSucursal,
      idDoctor != "" ? idDoctor : null,
      idAsociado != "" ? idAsociado : null,
      idPaciente,
      HoraCita,
      FinCita,
      NotasCita != "" ? NotasCita : null,
    ]);

    const consultaProcedimientos = `INSERT INTO Procedimiento_Citas
    (idCitas, idProcedimiento)
    VALUES(?,?);`;

    if (!Array.isArray(idProcedimientos)) {
      // Si es un valor único, hacemos solo una inserción
      await connection.execute(consultaProcedimientos, [
        idCita[0].insertId,
        idProcedimientos,
      ]);
    } else {
      // Si es un array, hacemos un foreach para insertar cada padecimiento
      idProcedimientos.forEach(async (idProcedimiento) => {
        await connection.execute(queryInsertPadecimientos, [
          idProcedimiento,
          result.insertId,
        ]);
      });
    }

    connection.end();

    return idCita[0].insertId;
  } catch (error) {
    console.error("Ha ocurrido un error creando la cita: ", error);
    throw error; // Lanzar la excepción
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
export async function Info_ImprimirAgenda(
  idDoctor,
  idAsociado,
  fechaInicio,
  fechaFin
) {
  try {
    const connection = await mysql.createConnection(db);
    let query = `SELECT c.idEstadoCita, ec.Estado, c.idCitas, c.HoraCita, 
    c.FinCita, CONCAT(u.Nombres, " ",u.ApellidoP, " ",u.ApellidoM)AS NombrePaciente,
    CONCAT(u2.Nombres, " ",u2.ApellidoP, " ",u2.ApellidoM) AS Doctor, u3.Nombres AS Asociado, c.Nota
    FROM Citas c 
    LEFT JOIN Paciente p ON c.idPaciente = p.idPaciente 
    LEFT JOIN Usuarios u ON p.idUsuario = u.idUsuario 
    LEFT JOIN Doctor d ON d.idDoctor = c.idDoctor 
    LEFT JOIN Asociado a ON a.idAsociado = c.idAsociado 
    LEFT JOIN Usuarios u2 ON d.idUsuario = u2.idUsuario 
    LEFT JOIN Usuarios u3 ON a.idUsuario = u3.idUsuario 
    LEFT JOIN Estado_Citas ec ON ec.idEstadoCita = c.idEstadoCita
    WHERE DATE(c.HoraCita) >= ? AND DATE(c.HoraCita) <= ? `;

    let idBusqueda = null;

    // En caso de que sea un doctor, se completa el Query como un doctor
    if (idDoctor != null && idAsociado == "") {
      query += `AND c.idDoctor = ? `;
      idBusqueda = idDoctor;
    }
    // En caso de que sea un asociado, se completa el Query con asociado
    if (idAsociado != null && idDoctor == "") {
      query += `AND c.idAsociado = ? `;
      idBusqueda = idAsociado;
    }

    query += `ORDER BY c.HoraCita ASC;`;

    const [rows] = await connection.execute(query, [
      fechaInicio,
      fechaFin,
      idBusqueda,
    ]);

    const queryCreacionCita = `SELECT cc.Fecha, u2.Nombres AS Recepcionista, u.Nombres AS Doctor
    FROM Creacion_Citas cc 
    LEFT JOIN Doctor d ON d.idDoctor = cc.idDoctor 
    LEFT JOIN Usuarios u ON d.idUsuario = u.idUsuario 
    LEFT JOIN Recepcionista r ON r.idRecepcionista = cc.idRecepcionista 
    LEFT JOIN Usuarios u2 ON r.idUsuario = u2.idUsuario  
    WHERE cc.idCitas = ?;`;

    for (let cita of rows) {
      const [rowCreacionCita] = await connection.execute(queryCreacionCita, [
        cita.idCitas,
      ]);
      cita.FechaCreacion = rowCreacionCita[0].Fecha;
      cita.CreacionCita =
        rowCreacionCita[0].Doctor != null
          ? rowCreacionCita[0].Doctor
          : rowCreacionCita[0].Recepcionista;
    }

    // console.log(rows);
    connection.end();
    return rows;
  } catch (error) {
    console.error("Error en la función Info_ImprimirAgenda: ", error);
    throw error;
  }
}
