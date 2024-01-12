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
    u.RutaFoto, c.idSucursal, c.Nota, s.idSesion
    FROM Citas c
    INNER JOIN Paciente p ON c.idPaciente = p.idPaciente 
    INNER JOIN Usuarios u ON p.idUsuario = u.idUsuario 
    LEFT JOIN Sesion s ON s.idCitas  = c.idCitas 
    LEFT JOIN Consultorio c2 ON c2.idConsultorio = s.idConsultorio
    WHERE c.idDoctor = ? AND c.idStatusPaciente = 2 AND DATE(c.HoraCita) = ?

    UNION

    SELECT s.idPaciente, up.Nombres, CONCAT(up.ApellidoP, ' ', up.ApellidoM) AS Apellidos,
    DATE_FORMAT(c.HoraCita, '%H:%i') AS HoraCita, s.idCitas, c.idStatusPaciente,
    DATE_FORMAT(c.HoraLlegada, '%H:%i') AS HoraLlegada, c2.NombreConsultorio AS Consultorio,
    up.RutaFoto, c.idSucursal, c.Nota, s.idSesion
    FROM Sesion s
    INNER JOIN Paciente p ON s.idPaciente = p.idPaciente
    INNER JOIN Usuarios up ON p.idUsuario = up.idUsuario 
    LEFT JOIN Citas c ON s.idCitas  = c.idCitas 
    LEFT JOIN Consultorio c2 ON c2.idConsultorio = s.idConsultorio
    WHERE s.idDoctor = ?  AND s.CheckOut IS NULL

    ORDER BY HoraLlegada ASC, HoraCita ASC;
      `;

    const [rowsEspera, fieldsEspera] = await connection.execute(
      consultaEspera,
      [idDoctor, Fecha, idDoctor]
    );

    if (rowsEspera.length > 0) {
      for (let cita of rowsEspera) {
        const query_procedimientos = `SELECT p.Procedimiento, p.Precio 
          FROM Procedimiento_Citas pc
          LEFT JOIN Procedimiento p ON pc.idProcedimiento = p.idProcedimiento 
          WHERE pc.idCitas = ?`;
        const [rowProcedimientos] = await connection.execute(
          query_procedimientos,
          [cita.idCitas]
        );

        // Crear una lista de objetos de procedimientos con sus detalles
        cita.DetallesProcedimientos = rowProcedimientos.map((proc) => {
          return {
            Procedimiento: proc.Procedimiento,
            Precio: proc.Precio,
          };
        });

        PacientesEspera.push({
          idPaciente: cita.idPaciente,
          idCita: cita.idCitas,
          idSucursal: cita.idSucursal,
          idSesion: cita.idSesion,
          idStatusPaciente: cita.idStatusPaciente,
          idDoctor: idDoctor,
          NombresPacientes: cita.Nombres,
          ApellidosPacientes: cita.Apellidos,
          HoraCita: cita.HoraCita,
          HoraLlegada: cita.HoraLlegada,
          StatusPaciente: cita.idStatusPaciente,
          RutaFoto: cita.RutaFoto,
          Procedimientos: cita.DetallesProcedimientos, // Lista de procedimientos con precios
          Consultorio: cita.Consultorio,
          Nota: cita.Nota,
        });
      }
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
    const consultaHoy = `SELECT c.idCitas, p.idPaciente, u.Nombres, CONCAT(u.ApellidoP, ' ', u.ApellidoM) AS Apellidos, 
    DATE_FORMAT(c.HoraCita, '%H:%i') AS HoraCita, u.RutaFoto
    FROM Citas c
    INNER JOIN Paciente p ON c.idPaciente = p.idPaciente 
    INNER JOIN Usuarios u ON p.idUsuario = u.idUsuario 
 
    WHERE c.idDoctor = 1 AND c.idStatusPaciente = 1 AND DATE(c.HoraCita) = "2024-01-11" AND c.idEstadoCita = 1
    ORDER BY c.HoraCita ASC;
    `;

    const [rowsHoy, fieldsHoy] = await connection.execute(consultaHoy, [
      idDoctor,
      Fecha,
    ]);

    if (rowsHoy.length > 0) {
      for (let cita of rowsHoy) {
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

        CitasHoy.push({
          idPaciente: cita.idPaciente,
          NombresPacientes: cita.Nombres,
          ApellidosPacientes: cita.Apellidos,
          HoraCita: cita.HoraCita,
          RutaFoto: cita.RutaFoto,
          Procedimientos: cita.Procedimientos,
        });
      }
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
    c2.NombreConsultorio AS Consultorio, up.RutaFoto, c.idSucursal, c.Nota
    FROM Citas c
    INNER JOIN Paciente p ON c.idPaciente = p.idPaciente
    INNER JOIN Usuarios up ON p.idUsuario = up.idUsuario 
    LEFT JOIN Doctor d ON c.idDoctor = d.idDoctor
    LEFT JOIN Usuarios ud ON d.idUsuario = ud.idUsuario
    LEFT JOIN Asociado a ON c.idAsociado = a.idAsociado
    LEFT JOIN Usuarios ua ON a.idUsuario = ua.idUsuario
    LEFT JOIN Sesion s ON s.idCitas  = c.idCitas 
    LEFT JOIN Consultorio c2 ON c2.idConsultorio = s.idConsultorio
    WHERE (c.idDoctor != ? OR c.idAsociado != 0)
    AND c.idStatusPaciente = 2

    UNION

    SELECT p.idPaciente, c.idCitas, c.idStatusPaciente,
    up.Nombres, CONCAT(up.ApellidoP, ' ', up.ApellidoM) AS Apellidos,
    CONCAT(ud.Nombres) AS NombreDoctor,
    CONCAT(ua.Nombres) AS NombreAsociado,
    DATE_FORMAT(c.HoraCita, '%H:%i') AS HoraCita,
    DATE_FORMAT(c.HoraLlegada, '%H:%i') AS HoraLlegada,
    c2.NombreConsultorio AS Consultorio, up.RutaFoto, c.idSucursal, c.Nota
    FROM Sesion s
    INNER JOIN Paciente p ON s.idPaciente = p.idPaciente
    INNER JOIN Usuarios up ON p.idUsuario = up.idUsuario 
    LEFT JOIN Doctor d ON s.idDoctor = d.idDoctor
    LEFT JOIN Usuarios ud ON d.idUsuario = ud.idUsuario
    LEFT JOIN Asociado a ON s.idAsociado = a.idAsociado
    LEFT JOIN Usuarios ua ON a.idUsuario = ua.idUsuario
    LEFT JOIN Citas c  ON s.idCitas  = c.idCitas 
    LEFT JOIN Consultorio c2 ON c2.idConsultorio = s.idConsultorio
    WHERE (s.idDoctor != ? OR s.idAsociado != 0) 
    AND s.CheckOut IS NULL
    ORDER BY HoraLlegada ASC;
      `;

    const [rowsOtros, fieldsEspera] = await connection.execute(
      consultaOtrosConsultorios,
      [idDoctor, idDoctor]
    );

    if (rowsOtros.length > 0) {
      for (let cita of rowsOtros) {
        const QuienAtiende = cita.NombreDoctor || cita.NombreAsociado;

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

        OtrosConsultorios.push({
          idCita: cita.idCitas,
          idPaciente: cita.idPaciente,
          idStatusPaciente: cita.idStatusPaciente,
          idSucursal: cita.idSucursal,
          Nombres: cita.Nombres,
          Apellidos: cita.Apellidos,
          NombreDoctor: QuienAtiende,
          HoraCita: cita.HoraCita,
          HoraLlegada: cita.HoraLlegada,
          Consultorio: cita.Consultorio,
          Procedimiento: cita.Procedimiento,
          RutaFoto: cita.RutaFoto,
          Nota: cita.Nota,
        });
      }
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
    DATE_FORMAT(s.InicioDeSesion , '%H:%i') AS HoraCita, s.idCitas, u.RutaFoto,
    s.idSesion, c2.NombreConsultorio AS Consultorio, s.CheckOut
    FROM Sesion s
    INNER JOIN Paciente p ON s.idPaciente = p.idPaciente
    INNER JOIN Usuarios u ON p.idUsuario = u.idUsuario
    LEFT JOIN Consultorio c2 ON c2.idConsultorio = s.idConsultorio
      WHERE s.idDoctor = ? AND s.FinDeSesion IS NOT NULL AND DATE(s.FinDeSesion) = ?
      ORDER BY s.FinDeSesion DESC;
      `;
    const [rowsFin, fieldsEspera] = await connection.execute(
      consultaFinalizadas,
      [idDoctor, Fecha]
    );
    if (rowsFin.length > 0) {
      for (let cita of rowsFin) {
        const query_procedimientos = `SELECT p.Procedimiento, p.Precio 
          FROM Procedimiento_Citas pc
          LEFT JOIN Procedimiento p ON pc.idProcedimiento = p.idProcedimiento 
          WHERE pc.idCitas = ?`;
        const [rowProcedimientos] = await connection.execute(
          query_procedimientos,
          [cita.idCitas]
        );

        // Crear una lista de objetos de procedimientos con sus detalles
        cita.DetallesProcedimientos = rowProcedimientos.map((proc) => {
          return {
            Procedimiento: proc.Procedimiento,
            Precio: proc.Precio,
          };
        });

        CitasFinalizadas.push({
          idPaciente: cita.idPaciente,
          idSesion: cita.idSesion,
          idStatusPaciente: 4,
          NombresPacientes: cita.Nombres,
          ApellidosPacientes: cita.Apellidos,
          HoraCita: cita.HoraCita,
          Procedimiento: cita.DetallesProcedimientos,
          Consultorio: cita.Consultorio,
          RutaFoto: cita.RutaFoto,
          CheckOut: cita.CheckOut,
        });
      }
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
      DATE_FORMAT(c.HoraCita, '%H:%i') AS HoraCita, u.RutaFoto
      FROM Citas c
      INNER JOIN Paciente p ON c.idPaciente = p.idPaciente 
      INNER JOIN Usuarios u ON p.idUsuario = u.idUsuario 
      LEFT JOIN Doctor d ON d.idDoctor = c.idDoctor
      LEFT JOIN Usuarios uDoc ON uDoc.idUsuario = d.idUsuario
      LEFT JOIN Asociado a ON a.idAsociado = c.idAsociado
      LEFT JOIN Usuarios uAso ON uAso.idUsuario = a.idUsuario
    WHERE c.idSucursal = ? AND c.idStatusPaciente = 1 AND DATE(c.HoraCita) = ?
    ORDER BY c.HoraCita ASC;`;

    const [rowsHoy, fieldsHoy] = await connection.execute(consultaHoy, [
      Sucursal,
      Fecha,
    ]);

    if (rowsHoy.length > 0) {
      for (let cita of rowsHoy) {
        const query_procedimientos = `SELECT p.Procedimiento 
        FROM Procedimiento_Citas pc
        LEFT JOIN Procedimiento p ON pc.idProcedimiento  = p.idProcedimiento 
        WHERE idCitas = ?`;
        const [rowProcedimientos] = await connection.execute(
          query_procedimientos,
          [cita.idCitas]
        );

        cita.Procedimientos = rowProcedimientos.map(
          (proc) => proc.Procedimiento
        );
        CitasHoy.push({
          idCitas: cita.idCitas,
          idPaciente: cita.idPaciente,
          idDoctor: cita.idDoctor,
          idAsociado: cita.idAsociado,
          Asociado: cita.Asociado,
          Doctor: cita.Doctor,
          NombresPacientes: cita.Nombres,
          ApellidosPacientes: cita.Apellidos,
          Procedimientos: cita.Procedimientos,
          HoraCita: cita.HoraCita,
          RutaFoto: cita.RutaFoto,
        });
      }
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
      consul.NombreConsultorio
      FROM Pacientes_Pedidos pp 
      LEFT JOIN Doctor doc ON doc.idDoctor = pp.idDoctor 
      LEFT JOIN Usuarios Udoc ON Udoc.idUsuario = doc.idUsuario 
      LEFT JOIN Citas c ON c.idCitas = pp.idCitas
      LEFT JOIN Paciente p ON p.idPaciente = c.idPaciente 
      LEFT JOIN Usuarios Upac ON Upac.idUsuario =P.idUsuario 
      LEFT JOIN Consultorio consul ON consul.idConsultorio  = pp.idConsultorio 
      LEFT JOIN Sucursales s ON s.idSucursal = consul.idSucursal 
      WHERE s.idSucursal = ?`;

    const [rowsPedidos, fieldsHoy] = await connection.execute(Pedidos, [
      Sucursal,
    ]);

    if (rowsPedidos.length > 0) {
      for (let cita of rowsPedidos) {
        const query_procedimientos = `SELECT p.Procedimiento, p.idProcedimiento
          FROM Procedimiento_Citas pc
          LEFT JOIN Procedimiento p ON pc.idProcedimiento = p.idProcedimiento 
          WHERE pc.idCitas = ?`;
        const [rowProcedimientos] = await connection.execute(
          query_procedimientos,
          [cita.idCitas]
        );

        // Crear una lista de objetos de procedimientos con sus detalles
        cita.DetallesProcedimientos = rowProcedimientos.map((proc) => {
          return {
            idProcedimiento: proc.idProcedimiento,
            Procedimiento: proc.Procedimiento,
          };
        });

        PacientesPedidos.push({
          idSucursal: Sucursal,
          idCitas: cita.idCitas,
          idPaciente: cita.idPaciente,
          idDoctor: cita.idDoctor,
          idConsultorio: cita.idConsultorio,
          NombreD: cita.NombreD,
          ApellidoD: cita.ApellidoD,
          NombreP: cita.NombreP,
          ApellidoP: cita.ApellidoP,
          HoraCita: cita.HoraCita,
          RutaFotoP: cita.RutaFotoP,
          RutaFotoD: cita.RutaFotoD,
          Cosultorio: cita.NombreConsultorio,
          Procedimiento: cita.DetallesProcedimientos,
        });
      }
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
    s.CheckOut,u.RutaFoto, s.idPaciente, c.idCitas
    FROM Sesion s 
    LEFT JOIN Citas c ON c.idCitas = s.idCitas 
    LEFT JOIN Paciente p ON s.idPaciente = p.idPaciente 
    LEFT JOIN Usuarios u ON u.idUsuario = p.idUsuario 
    LEFT JOIN Consultorio consul ON consul.idConsultorio =s.idConsultorio 
    LEFT JOIN Sucursales suc ON suc.idSucursal = consul.idSucursal 
    WHERE suc.idSucursal = ? AND DATE(s.FinDeSesion) = ?`;

    const [rowsFin, fieldsHoy] = await connection.execute(CitasFin, [
      Sucursal,
      Fecha,
    ]);

    if (rowsFin.length > 0) {
      for (let cita of rowsFin) {
        const query_procedimientos = `SELECT p.Procedimiento 
        FROM Procedimiento_Citas pc
        LEFT JOIN Procedimiento p ON pc.idProcedimiento  = p.idProcedimiento 
        WHERE idCitas = ?`;
        const [rowProcedimientos] = await connection.execute(
          query_procedimientos,
          [cita.idCitas]
        );

        cita.Procedimientos = rowProcedimientos.map(
          (proc) => proc.Procedimiento
        );
        PacientesCheckout.push({
          idPaciente: cita.idPaciente,
          NombresPacientes: cita.Nombres,
          ApellidosPacientes: cita.Apellidos,
          HoraCita: cita.HoraCita,
          RutaFoto: cita.RutaFoto,
          CheckOut: cita.CheckOut,
          Procedimiento: cita.Procedimientos,
        });
      }
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
