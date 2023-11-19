import { mysql, db } from "../conf_api.js";


// -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
// Dashboard Doctor
// -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-

//==================================================================================================
// Dashboard Doc | Pacientes en espera
//==================================================================================================
export async function DashDoc_PacientesEspera(idDoctor, Fecha) {
  let PacientesEspera = [];
  try {
    const connection = await mysql.createConnection(db);
    const consultaEspera = `SELECT p.idPaciente, u.Nombres, CONCAT(u.ApellidoP, ' ', u.ApellidoM) AS Apellidos, 
      DATE_FORMAT(c.HoraCita, '%H:%i') AS HoraCita, c.idCitas, c.idStatusPaciente,
      DATE_FORMAT(c.HoraLlegada, '%H:%i') AS HoraLlegada, c2.NombreConsultorio AS Consultorio,
      u.RutaFoto, pr.Procedimiento, c.idSucursal, c.Nota, pr.Precio, s.idSesion
      FROM Citas c
      INNER JOIN Paciente p ON c.idPaciente = p.idPaciente 
      INNER JOIN Usuarios u ON p.idUsuario = u.idUsuario 
      LEFT JOIN Procedimiento pr ON c.idProcedimiento = pr.idProcedimiento
      LEFT JOIN Sesion s ON s.idCitas  = c.idCitas 
      LEFT JOIN Consultorio c2 ON c2.idConsultorio = s.idConsultorio
      WHERE c.idDoctor = ? AND c.idStatusPaciente = 2 AND DATE(c.HoraCita) = ?
  
      UNION
  
      SELECT s.idPaciente, up.Nombres, CONCAT(up.ApellidoP, ' ', up.ApellidoM) AS Apellidos,
      DATE_FORMAT(c.HoraCita, '%H:%i') AS HoraCita, s.idCitas, c.idStatusPaciente,
      DATE_FORMAT(c.HoraLlegada, '%H:%i') AS HoraLlegada, c2.NombreConsultorio AS Consultorio,
      up.RutaFoto, pr.Procedimiento, c.idSucursal, c.Nota, pr.Precio, s.idSesion
      FROM Sesion s
      INNER JOIN Paciente p ON s.idPaciente = p.idPaciente
      INNER JOIN Usuarios up ON p.idUsuario = up.idUsuario 
      LEFT JOIN Citas c ON s.idCitas  = c.idCitas 
      LEFT JOIN Consultorio c2 ON c2.idConsultorio = s.idConsultorio
      LEFT JOIN Procedimiento pr ON pr.idProcedimiento = s.idProcedimiento
      WHERE s.idDoctor = ?  AND s.CheckOut IS NULL
  
      ORDER BY HoraLlegada ASC, HoraCita ASC;
      `;

    const [rowsEspera, fieldsEspera] = await connection.execute(
      consultaEspera,
      [idDoctor, Fecha, idDoctor]
    );

    if (rowsEspera.length > 0) {
      PacientesEspera = rowsEspera.map((elemento) => {
        return {
          idPaciente: elemento.idPaciente,
          idCita: elemento.idCitas,
          idSucursal: elemento.idSucursal,
          idSesion: elemento.idSesion,
          idStatusPaciente: elemento.idStatusPaciente,
          idDoctor: idDoctor,
          NombresPacientes: elemento.Nombres,
          ApellidosPacientes: elemento.Apellidos,
          HoraCita: elemento.HoraCita,
          HoraLlegada: elemento.HoraLlegada,
          StatusPaciente: elemento.idStatusPaciente,
          RutaFoto: elemento.RutaFoto,
          Procedimiento: elemento.Procedimiento,
          Consultorio: elemento.Consultorio,
          Nota: elemento.Nota,
          PrecioProcedimineto: elemento.Precio,
        };
      });
    }
    connection.end();
    return PacientesEspera;
  } catch (error) {
    console.error(
      "Ha ocurrido un error en la consulta de pacientes en espera:",
      error
    );
    return "Ha ocurrido un error.";
  }
}


//==================================================================================================
// Dashboard Doc | Citas del dia
//==================================================================================================
export async function DashDoc_CitasHoy(idDoctor, Fecha) {
  let CitasHoy = [];
  try {
    const connection = await mysql.createConnection(db);
    const consultaHoy = `SELECT p.idPaciente, u.Nombres, CONCAT(u.ApellidoP, ' ', u.ApellidoM) AS Apellidos, 
          DATE_FORMAT(c.HoraCita, '%H:%i') AS HoraCita, u.RutaFoto, pr.Procedimiento
          FROM Citas c
          INNER JOIN Paciente p ON c.idPaciente = p.idPaciente 
          INNER JOIN Usuarios u ON p.idUsuario = u.idUsuario 
          LEFT JOIN Procedimiento pr ON c.idProcedimiento = pr.idProcedimiento
          WHERE c.idDoctor = ? AND c.idStatusPaciente = 1 AND DATE(c.HoraCita) = ? AND c.idEstadoCita = 1
          ORDER BY c.HoraCita ASC;`;

    const [rowsHoy, fieldsHoy] = await connection.execute(consultaHoy, [
      idDoctor,
      Fecha,
    ]);

    if (rowsHoy.length > 0) {
      CitasHoy = rowsHoy.map((elemento) => {
        return {
          idPaciente: elemento.idPaciente,
          NombresPacientes: elemento.Nombres,
          ApellidosPacientes: elemento.Apellidos,
          HoraCita: elemento.HoraCita,
          RutaFoto: elemento.RutaFoto,
          Procedimiento: elemento.Procedimiento,
        };
      });
    }
    connection.end();
    return CitasHoy;
  } catch (error) {
    console.error(
      "Ha ocurrido un error en la consulta de citas del día:",
      error
    );
    return "Ha ocurrido un error.";
  }
}


//==================================================================================================
// Dashboard Doc | Otros consultorios
//==================================================================================================
export async function DashDoc_OtrosConsultorios(idDoctor, Fecha) {
  let OtrosConsultorios = [];
  try {
    const connection = await mysql.createConnection(db);
    const consultaOtrosConsultorios = `SELECT p.idPaciente, c.idCitas, c.idStatusPaciente,
      up.Nombres, CONCAT(up.ApellidoP, ' ', up.ApellidoM) AS Apellidos,
      CONCAT(ud.Nombres) AS NombreDoctor,
      CONCAT(ua.Nombres) AS NombreAsociado,
      DATE_FORMAT(c.HoraCita, '%H:%i') AS HoraCita,
      DATE_FORMAT(c.HoraLlegada, '%H:%i') AS HoraLlegada,
      c2.NombreConsultorio AS Consultorio, up.RutaFoto, pr.Procedimiento, c.idSucursal, c.Nota
      FROM Citas c
      INNER JOIN Paciente p ON c.idPaciente = p.idPaciente
      INNER JOIN Usuarios up ON p.idUsuario = up.idUsuario 
      LEFT JOIN Doctor d ON c.idDoctor = d.idDoctor
      LEFT JOIN Usuarios ud ON d.idUsuario = ud.idUsuario
      LEFT JOIN Asociado a ON c.idAsociado = a.idAsociado
      LEFT JOIN Usuarios ua ON a.idUsuario = ua.idUsuario
      LEFT JOIN Sesion s ON s.idCitas  = c.idCitas 
      LEFT JOIN Consultorio c2 ON c2.idConsultorio = s.idConsultorio
      LEFT JOIN Procedimiento pr ON pr.idProcedimiento = c.idProcedimiento
      WHERE (c.idDoctor != ? OR c.idAsociado != 0)
      AND c.idStatusPaciente = 2
  
      UNION
  
      SELECT p.idPaciente, c.idCitas, c.idStatusPaciente,
      up.Nombres, CONCAT(up.ApellidoP, ' ', up.ApellidoM) AS Apellidos,
      CONCAT(ud.Nombres) AS NombreDoctor,
      CONCAT(ua.Nombres) AS NombreAsociado,
      DATE_FORMAT(c.HoraCita, '%H:%i') AS HoraCita,
      DATE_FORMAT(c.HoraLlegada, '%H:%i') AS HoraLlegada,
      c2.NombreConsultorio AS Consultorio, up.RutaFoto, pr.Procedimiento, c.idSucursal, c.Nota
      FROM Sesion s
      INNER JOIN Paciente p ON s.idPaciente = p.idPaciente
      INNER JOIN Usuarios up ON p.idUsuario = up.idUsuario 
      LEFT JOIN Doctor d ON s.idDoctor = d.idDoctor
      LEFT JOIN Usuarios ud ON d.idUsuario = ud.idUsuario
      LEFT JOIN Asociado a ON s.idAsociado = a.idAsociado
      LEFT JOIN Usuarios ua ON a.idUsuario = ua.idUsuario
      LEFT JOIN Citas c  ON s.idCitas  = c.idCitas 
      LEFT JOIN Consultorio c2 ON c2.idConsultorio = s.idConsultorio
      LEFT JOIN Procedimiento pr ON pr.idProcedimiento = c.idProcedimiento
      WHERE (s.idDoctor != ? OR s.idAsociado != 0) 
      AND s.CheckOut IS NULL
      ORDER BY HoraLlegada ASC;
      `;

    const [rowsOtros, fieldsEspera] = await connection.execute(
      consultaOtrosConsultorios,
      [idDoctor, idDoctor]
    );

    if (rowsOtros.length > 0) {
      OtrosConsultorios = rowsOtros.map((elemento) => {
        // Verificamos si el paciente esta con un doctor o con un asociado
        const QuienAtiende = elemento.NombreDoctor || elemento.NombreAsociado;
        return {
          idCita: elemento.idCitas,
          idPaciente: elemento.idPaciente,
          idStatusPaciente: elemento.idStatusPaciente,
          idSucursal: elemento.idSucursal,
          Nombres: elemento.Nombres,
          Apellidos: elemento.Apellidos,
          NombreDoctor: QuienAtiende,
          HoraCita: elemento.HoraCita,
          HoraLlegada: elemento.HoraLlegada,
          Consultorio: elemento.Consultorio,
          Procedimiento: elemento.Procedimiento,
          RutaFoto: elemento.RutaFoto,
          Nota: elemento.Nota,
        };
      });
    }
    connection.end();
    return OtrosConsultorios;
  } catch (error) {
    console.error(
      "Ha ocurrido un error en la consulta de otros consultorios:",
      error
    );
    return "Ha ocurrido un error.";
  }
}


//==================================================================================================
// Dashboard Doc | Citas Finalizadas
//==================================================================================================
export async function DashDoc_CitasFinalizadas(idDoctor, Fecha) {
  let CitasFinalizadas = [];
  try {
    const connection = await mysql.createConnection(db);
    const consultaFinalizadas = `SELECT p.idPaciente, u.Nombres, 
      CONCAT(u.ApellidoP, ' ', u.ApellidoM) AS Apellidos, 
      DATE_FORMAT(s.InicioDeSesion , '%H:%i') AS HoraCita, u.RutaFoto,
      s.idSesion, pr.Procedimiento, c2.NombreConsultorio AS Consultorio, s.CheckOut,pr.Precio
      FROM Sesion s
      INNER JOIN Paciente p ON s.idPaciente = p.idPaciente
      INNER JOIN Usuarios u ON p.idUsuario = u.idUsuario
      LEFT JOIN Procedimiento pr ON s.idProcedimiento = pr.idProcedimiento
      LEFT JOIN Consultorio c2 ON c2.idConsultorio = s.idConsultorio
      WHERE s.idDoctor = ? AND s.FinDeSesion IS NOT NULL AND DATE(s.FinDeSesion) = ?
      ORDER BY s.FinDeSesion DESC;
      `;
    const [rowsFin, fieldsEspera] = await connection.execute(
      consultaFinalizadas,
      [idDoctor, Fecha]
    );
    if (rowsFin.length > 0) {
      CitasFinalizadas = rowsFin.map((elemento) => {
        return {
          idPaciente: elemento.idPaciente,
          idSesion: elemento.idSesion,
          idStatusPaciente: 4,
          NombresPacientes: elemento.Nombres,
          ApellidosPacientes: elemento.Apellidos,
          HoraCita: elemento.HoraCita,
          Procedimiento: elemento.Procedimiento,
          Consultorio: elemento.Consultorio,
          RutaFoto: elemento.RutaFoto,
          CheckOut: elemento.CheckOut,
          PrecioProcedimineto: elemento.Precio,
        };
      });
    }
    connection.end();
    return CitasFinalizadas;
  } catch (error) {
    console.error(
      "Ha ocurrido un error en la consulta de citas finalizadas:",
      error
    );
    return "Ha ocurrido un error.";
  }
}

// -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
// Dashboard Recepcion
// -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-

//==================================================================================================
// Dashboard Recepcion | Pacientes Hoy
//==================================================================================================
export async function DashRecepcion_PacientesHoy(Sucursal, Fecha) {
  let CitasHoy = [];
  try {
    const connection = await mysql.createConnection(db);
    const consultaHoy = `SELECT c.idCitas, p.idPaciente, c.idDoctor, a.idAsociado, CONCAT(uDoc.Nombres," ",uDoc.ApellidoP) AS Doctor,
      CONCAT(uAso.Nombres," ",uAso.ApellidoP) AS Asociado,
        u.Nombres, CONCAT(u.ApellidoP, ' ', u.ApellidoM) AS Apellidos, 
        DATE_FORMAT(c.HoraCita, '%H:%i') AS HoraCita,p2.Procedimiento, u.RutaFoto
        FROM Citas c
        INNER JOIN Paciente p ON c.idPaciente = p.idPaciente 
        INNER JOIN Usuarios u ON p.idUsuario = u.idUsuario 
        LEFT JOIN Doctor d ON d.idDoctor = c.idDoctor
        LEFT JOIN Usuarios uDoc ON uDoc.idUsuario = d.idUsuario
        LEFT JOIN Asociado a ON a.idAsociado = c.idAsociado
        LEFT JOIN Usuarios uAso ON uAso.idUsuario = a.idUsuario
        LEFT JOIN Procedimiento p2 ON p2.idProcedimiento = c.idProcedimiento
      WHERE c.idSucursal = ? AND c.idStatusPaciente = 1 AND DATE(c.HoraCita) = ? 
      ORDER BY c.HoraCita ASC;`;

    const [rowsHoy, fieldsHoy] = await connection.execute(consultaHoy, [
      Sucursal,
      Fecha,
    ]);

    if (rowsHoy.length > 0) {
      CitasHoy = rowsHoy.map((elemento) => {
        return {
          idCitas: elemento.idCitas,
          idPaciente: elemento.idPaciente,
          idDoctor: elemento.idDoctor,
          idAsociado: elemento.idAsociado,
          Asociado: elemento.Asociado,
          Doctor: elemento.Doctor,
          NombresPacientes: elemento.Nombres,
          ApellidosPacientes: elemento.Apellidos,
          Procedimiento: elemento.Procedimiento,
          HoraCita: elemento.HoraCita,
          RutaFoto: elemento.RutaFoto,
        };
      });
    }
    connection.end();
    return CitasHoy;
  } catch (error) {
    console.error(
      "Ha ocurrido un error en la consulta de citas del día:",
      error
    );
    return "Ha ocurrido un error.";
  }
}

//==================================================================================================
// Dashboard Recepcion | Pacientes Pedidos
//==================================================================================================
export async function DashRecepcion_PacientesPedidos(Sucursal) {
  let PacientesPedidos = [];
  try {
    const connection = await mysql.createConnection(db);
    const Pedidos = `SELECT pp.idCitas,pp.idDoctor,pp.idConsultorio, Udoc.Nombres AS NombreD, Upac.Nombres AS NombreP,
      CONCAT(Udoc.ApellidoP," ",Udoc.ApellidoM) AS ApellidoD,	CONCAT(Upac.ApellidoP," ",Upac.ApellidoM) AS ApellidoP,
      Upac.RutaFoto AS RutaFotoP,Udoc.RutaFoto AS RutaFotoD,DATE_FORMAT(c.HoraCita, '%H:%i') AS HoraCita,c.idPaciente,
      consul.NombreConsultorio, p2.Procedimiento, p2.idProcedimiento
      FROM Pacientes_Pedidos pp 
      LEFT JOIN Doctor doc ON doc.idDoctor = pp.idDoctor 
      LEFT JOIN Usuarios Udoc ON Udoc.idUsuario = doc.idUsuario 
      LEFT JOIN Citas c ON c.idCitas = pp.idCitas
      LEFT JOIN Paciente p ON p.idPaciente = c.idPaciente 
      LEFT JOIN Usuarios Upac ON Upac.idUsuario =P.idUsuario 
      LEFT JOIN Consultorio consul ON consul.idConsultorio  = pp.idConsultorio 
      LEFT JOIN Sucursales s ON s.idSucursal = consul.idSucursal 
      LEFT JOIN Procedimiento p2 ON p2.idProcedimiento = c.idProcedimiento
      WHERE s.idSucursal = ?`;

    const [rowsPedidos, fieldsHoy] = await connection.execute(Pedidos, [
      Sucursal,
    ]);

    if (rowsPedidos.length > 0) {
      PacientesPedidos = rowsPedidos.map((elemento) => {
        return {
          idSucursal: Sucursal,
          idCitas: elemento.idCitas,
          idPaciente: elemento.idPaciente,
          idDoctor: elemento.idDoctor,
          idConsultorio: elemento.idConsultorio,
          idProcedimiento: elemento.idProcedimiento,
          NombreD: elemento.NombreD,
          ApellidoD: elemento.ApellidoD,
          NombreP: elemento.NombreP,
          ApellidoP: elemento.ApellidoP,
          HoraCita: elemento.HoraCita,
          RutaFotoP: elemento.RutaFotoP,
          RutaFotoD: elemento.RutaFotoD,
          Cosultorio: elemento.NombreConsultorio,
          Procedimiento: elemento.Procedimiento,
        };
      });
    }
    connection.end();
    return PacientesPedidos;
  } catch (error) {
    console.error("Ha ocurrido un error en los pacientes pedidos:", error);
    return "Ha ocurrido un error.";
  }
}

//==================================================================================================
// Dashboard Recepcion | Citas Finalizadas
//==================================================================================================
export async function DashRecepcion_CitasFinalizadas(Sucursal, Fecha) {
  let PacientesCheckout = [];
  try {
    const connection = await mysql.createConnection(db);
    const CitasFin = `SELECT u.Nombres, CONCAT(u.ApellidoP," ",u.ApellidoM) AS Apellidos, DATE_FORMAT(c.HoraCita, '%H:%i') AS HoraCita, 
      s.CheckOut,u.RutaFoto, s.idPaciente, p2.Procedimiento
      FROM Sesion s 
      LEFT JOIN Citas c ON c.idCitas = s.idCitas 
      LEFT JOIN Paciente p ON s.idPaciente = p.idPaciente 
      LEFT JOIN Usuarios u ON u.idUsuario = p.idUsuario 
      LEFT JOIN Consultorio consul ON consul.idConsultorio =s.idConsultorio 
      LEFT JOIN Sucursales suc ON suc.idSucursal = consul.idSucursal 
      LEFT JOIN Procedimiento p2 ON p2.idProcedimiento = s.idProcedimiento
      WHERE suc.idSucursal = ? AND DATE(s.FinDeSesion) = ?`;

    const [rowsFin, fieldsHoy] = await connection.execute(CitasFin, [
      Sucursal,
      Fecha,
    ]);

    if (rowsFin.length > 0) {
      PacientesCheckout = rowsFin.map((elemento) => {
        return {
          idPaciente: elemento.idPaciente,
          NombresPacientes: elemento.Nombres,
          ApellidosPacientes: elemento.Apellidos,
          HoraCita: elemento.HoraCita,
          RutaFoto: elemento.RutaFoto,
          CheckOut: elemento.CheckOut,
          Procedimiento: elemento.Procedimiento,
        };
      });
    }
    connection.end();
    return PacientesCheckout;
  } catch (error) {
    console.error("Ha ocurrido un error en los pacientes Finalizados:", error);
    return "Ha ocurrido un error.";
  }
}





//==================================================================================================
// Función para obtener la informacion del Dashboard de recpecion (Pacientes en espera, Citas del dia, Otros consultorios y Citas Finalizadas)
//==================================================================================================
export async function Hoy_Espera(idCita, HoraLlegada) {
  try {
    const connection = await mysql.createConnection(db);
    const consulta = `UPDATE Citas SET idStatusPaciente = ?, HoraLlegada = CONCAT(CURDATE()," ", ?) WHERE idCitas = ?;`;
    connection.execute(consulta, [2, HoraLlegada, idCita]);
    connection.end();
  } catch (error) {
    console.error("Ha ocurrido un error en la actualizacion de datos:", error);
    return "Ha ocurrido un error.";
  }
}

export async function PedirPaciente(idCita, idDoctor, idConsultorio) {
  try {
    const connection = await mysql.createConnection(db);

    // Primero, verifica si la entrada ya existe en la base de datos
    const checkQuery = `
      SELECT 1 
      FROM DermaTotalDB.Pacientes_Pedidos
      WHERE idCitas = ? AND idDoctor = ? AND idConsultorio = ?;
    `;
    const [rows] = await connection.execute(checkQuery, [
      idCita,
      idDoctor,
      idConsultorio,
    ]);

    if (rows.length > 0) {
      connection.end();
      return "Sonido"; // Retorna "Sonido" si ya existe una entrada con esas propiedades
    }

    // Si no existe, inserta la entrada en la base de datos
    const pedir = `
      INSERT INTO DermaTotalDB.Pacientes_Pedidos
      (idCitas, idDoctor, idConsultorio)
      VALUES(?, ?, ?);
    `;

    await connection.execute(pedir, [idCita, idDoctor, idConsultorio]);
    connection.end();
  } catch (error) {
    console.error("Ha ocurrido un error pidiendo al paciente:", error);
    return "Ha ocurrido un error.";
  }
}

//Aqui asi como se elimina todas las citas de la tabla de PedirPaciente, se crea ua nueva sesion para el paciente
//y se avanza un status en la cita
export async function AsignarP_Pedido(
  idCita,
  idConsultorio,
  idDoctor,
  idAsociado,
  idProcedimiento,
  idPaciente,
  HoraInicio
) {
  try {
    const connection = await mysql.createConnection(db);
    await connection.beginTransaction();

    // elimina la entrada de la tabla
    const deleteQuery = `
        DELETE FROM Pacientes_Pedidos
        WHERE idCitas = ? ;
      `;
    await connection.execute(deleteQuery, [idCita]);

    // Crea una nueva sesión para el paciente
    // Si la sesion es con un Doctor
    if (idDoctor) {
      const insertSesion = `
        INSERT INTO Sesion
        (idCitas, idConsultorio, idDoctor, idProcedimiento, idPaciente, InicioDeSesion)
        VALUES(?, ?, ?, ?, ?, CONCAT(CURDATE()," ", ?));
      `;
      await connection.execute(insertSesion, [
        idCita,
        idConsultorio,
        idDoctor,
        idProcedimiento,
        idPaciente,
        HoraInicio,
      ]);
    } else {
      const insertSesion = `
        INSERT INTO Sesion
        (idCitas, idConsultorio, idAsociado, idProcedimiento, idPaciente, InicioDeSesion)
        VALUES(?, ?, ?, ?, ?, CONCAT(CURDATE()," ", ?)));
      `;
      await connection.execute(insertSesion, [
        idCita,
        idConsultorio,
        idAsociado,
        idProcedimiento,
        idPaciente,
        HoraInicio,
      ]);
    }

    // Actualiza el status de la cita
    const updateCita = `
      UPDATE Citas
      SET idStatusPaciente = 3
      WHERE idCitas = ?;
    `;
    await connection.execute(updateCita, [idCita]);

    await connection.commit();
    connection.end();
  } catch (error) {
    console.error(
      "Ha ocurrido un error creando la sesion/limpiando a pacientes pedidos:",
      error
    );
    return "Ha ocurrido un error.";
  }
}

// Aqui se da el checkout a recepcion y se avanza un status en la cita
export async function Consulta_Checkout(idCita, idSesion, HoraFin, CheckOut) {
  try {
    const connection = await mysql.createConnection(db);
    await connection.beginTransaction();

    // Actualiza el status de la cita en caso de que la sesion esté enlazada a una
    if (idCita != null) {
      const updateCita = `
      UPDATE DermaTotalDB.Citas
      SET idStatusPaciente = 4
      WHERE idCitas = ?;
      `;
      await connection.execute(updateCita, [idCita]);
    }

    // Actualiza el status de la sesion
    const updateSesion = `
    UPDATE Sesion
    SET FinDeSesion = CONCAT(CURDATE()," ", ?), CheckOut = ?
    WHERE idSesion= ?;
    `;
    await connection.execute(updateSesion, [HoraFin, CheckOut, idSesion]);

    await connection.commit();
    connection.end();
  } catch (error) {
    console.error(
      "Ha ocurrido un error en la actualizacion del paciente a Checkout:",
      error
    );
    return "Ha ocurrido un error.";
  }
}


