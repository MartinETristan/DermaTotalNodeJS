import { mysql, db } from "../api_conf.js";

export async function InsertRutaFoto(idUsuario, RutaFoto) {
  try {
    const connection = await mysql.createConnection(db);
    const query = `UPDATE Usuarios SET RutaFoto = ? WHERE idUsuario = ?`;
    const [result] = await connection.execute(query, [RutaFoto, idUsuario]);
    connection.end();
    return result.insertId;
  } catch (error) {
    console.error(
      "Ha ocurrido un error actualizando la ruta del usuario:",
      error
    );
    return "Ha ocurrido un error.";
  }
}

// Funcion para obtener la sucursal de la ultima cita del paciente
export async function SucursalUltimaCita(idPaciente) {
  try {
    const connection = await mysql.createConnection(db);
    const query = `SELECT idSucursal 
      FROM Citas c 
      WHERE c.idPaciente = ?
      ORDER BY ABS(DATEDIFF(c.HoraCita, CURDATE())) DESC
      LIMIT 1;
      `;
    const [result] = await connection.execute(query, [idPaciente]);
    connection.end();

    return result[0].idSucursal;
  } catch (error) {
    console.error(
      "Ha ocurrido un error obteniendo la sucursal de la ultima cita del paciente: ",
      error
    );
    return "Ha ocurrido un error.";
  }
}

// Funcion para obtener la informacion de los registros
export async function InfoRegistros() {
  try {
    const connection = await mysql.createConnection(db);
    // Pedimos los Doctores Existentes
    const Doctores = `SELECT d.idDoctor, u.Nombres, u.RutaFoto  FROM Doctor d
      INNER JOIN Usuarios u ON d.idUsuario  = u.idUsuario `;
    const [docs] = await connection.execute(Doctores);

    //Pedimos el Sexo Disponible
    const Asociados = `SELECT a.idAsociado,u.Nombres, u.RutaFoto  FROM Asociado a 
      INNER JOIN Usuarios u ON a.idUsuario = u.idUsuario`;
    const [Asoc] = await connection.execute(Asociados);

    //Pedimos el Sexo Disponible
    const Sexo = `SELECT * FROM Sexo s`;
    const [Sex] = await connection.execute(Sexo);

    //Pedimos las Sucursales Disponibles
    const Sucursales = `SELECT * FROM Sucursales s`;
    const [suc] = await connection.execute(Sucursales);

    //Pedimos los procedimientos Dispobibles
    const Procedimiento = `SELECT p.idProcedimiento,p.idAreas,p.Procedimiento, a.Area 
    FROM Procedimiento p 
    LEFT JOIN Areas a ON p.idAreas = a.idAreas
    ORDER  BY p.idAreas ASC, p.idProcedimiento ASC`;
    const [Proced] = await connection.execute(Procedimiento);

    //Pedimos los Estados de citas
    const EstadoC = `SELECT * FROM Estado_Citas ec `;
    const [EstC] = await connection.execute(EstadoC);

    //Pedimos los Status de los usuarios
    const StatusUsuario = ` SELECT * FROM Status s`;
    const [Stat_U] = await connection.execute(StatusUsuario);

    //Pedimos los Consultorios
    const Consultorios = ` SELECT * FROM Consultorio`;
    const [Cons_U] = await connection.execute(Consultorios);

    // Pedimos los padeciminetos
    const Padecimientos = `SELECT * FROM Padecimientos`;
    const [Padec] = await connection.execute(Padecimientos);

    // Pedimos las Areas
    const Areas = `SELECT * FROM Areas`;
    const [Area] = await connection.execute(Areas);

    connection.end();
    const InfoparaRegistros = {
      Doctores: docs,
      Asociados: Asoc,
      Sucursales: suc,
      Sexo: Sex,
      Procedimiento: Proced,
      EstadoCitas: EstC,
      StatusUsuario: Stat_U,
      Consultorios: Cons_U,
      Padecimientos: Padec,
      Areas: Area,
    };
    return InfoparaRegistros;
  } catch (error) {
    console.error("Ha ocurrido un error en la consulta de registros:", error);
    return "Ha ocurrido un error.";
  }
}

export async function Busqueda(Nombre, Apellidos, Telefono_Correo) {
  let connection;
  try {
    connection = await mysql.createConnection(db);
    let busqueda = `
      SELECT p.idPaciente, u.Nombres, u.ApellidoP, u.ApellidoM,
      CASE 
        WHEN u.Telefono IS NOT NULL THEN u.Telefono
        ELSE u.TelefonoSecundario
      END AS Telefono,
      u.Correo,
      u.RutaFoto,
      s.Status  
      FROM Paciente p 
      LEFT JOIN Usuarios u ON u.idUsuario = p.idUsuario 
      LEFT JOIN Status s ON s.idStatus = p.idStatus 
      WHERE s.idStatus IN (1, 2) AND`;

    const params = [];

    switch (true) {
      case Boolean(Nombre):
        busqueda += ` u.Nombres LIKE ? AND`;
        params.push(`%${Nombre}%`);
        break;
      case Boolean(Apellidos):
        busqueda += ` (ApellidoP LIKE ? OR ApellidoM LIKE ?) AND`;
        params.push(`%${Apellidos}%`, `%${Apellidos}%`);
        break;
      case Boolean(Telefono_Correo):
        busqueda += ` (Telefono LIKE ? OR TelefonoSecundario LIKE ? OR Correo LIKE ?) AND`;
        params.push(
          `%${Telefono_Correo}%`,
          `%${Telefono_Correo}%`,
          `%${Telefono_Correo}%`
        );
        break;
      default:
        throw new Error("Ningún criterio de búsqueda válido proporcionado.");
    }

    // Elimina el último "AND" si existe
    if (busqueda.endsWith("AND")) {
      busqueda = busqueda.slice(0, -3);
    }

    busqueda += ` LIMIT 15;`;

    // Ejecuta la consulta SQL con los parámetros
    const [resBusqueda] = await connection.execute(busqueda, params);

    let arrayBusqueda = resBusqueda.map((elemento) => {
      return {
        idPaciente: elemento.idPaciente,
        Nombre: elemento.Nombres,
        ApellidoP: elemento.ApellidoP,
        ApellidoM: elemento.ApellidoM,
        Telefono: elemento.Telefono,
        Correo: elemento.Correo,
        Status: elemento.Status,
        RutaFoto: elemento.RutaFoto,
      };
    });

    // Devuelve el resultado de la búsqueda
    return arrayBusqueda;
  } catch (error) {
    throw error; // Lanza la excepción para que el cliente pueda manejarla
  } finally {
    if (connection) {
      connection.end();
    }
  }
}

//==================================================================================================
// Diagnostico
//==================================================================================================

export async function NuevoPadecimiento(idArea, Padecimiento) {
  try {
    const connection = await mysql.createConnection(db);
    const query = `INSERT INTO Padecimientos (idArea,Padecimiento) VALUES (?,?)`;
    const [result] = await connection.execute(query, [idArea, Padecimiento]);
    connection.end();
    return { id: result.insertId, text: Padecimiento };
  } catch (error) {
    console.error("Ha ocurrido un error creando el padecimiento: ", error);
    return "Ha ocurrido un error.";
  }
}

export async function Buscar_Padecimiento(Padecimiento) {
  try {
    const connection = await mysql.createConnection(db);
    const query = `SELECT p.idPadecimiento,p.idArea,p.Padecimiento, a.Area  
    FROM Padecimientos p
    LEFT JOIN Areas a ON p.idArea = a.idAreas 
    WHERE p.Padecimiento LIKE ?
    LIMIT 5;
    `;
    const [result] = await connection.execute(query, [`%${Padecimiento}%`]);

    connection.end();
    return result;
  } catch (error) {
    console.error("Ha ocurrido un error buscando el padecimiento: ", error);
    return "Ha ocurrido un error.";
  }
}

// export async function Añadir_Padecimiento(idPadecimiento, idSesion) {
//   try {
//     const connection = await mysql.createConnection(db);
//     const query = `INSERT INTO Padecimientos_Sesion
//     (idPadecimiento, idSesion)
//     VALUES(?, ?);`;
//     await connection.execute(query, [idPadecimiento, idSesion]);
//     connection.end();
//   } catch (error) {
//     console.error("Ha ocurrido un error añadiendo el padecimiento: ", error);
//     return "Ha ocurrido un error.";
//   }
// }

// export async function Quitar_Padecimiento(idPadecimiento, idSesion) {
//   try {
//     const connection = await mysql.createConnection(db);
//     const query = `DELETE FROM Padecimientos_Sesion
//     WHERE idPadecimiento = ? AND idSesion = ?;`;
//     await connection.execute(query, [idPadecimiento, idSesion]);
//     connection.end();
//   } catch (error) {
//     console.error("Ha ocurrido un error quitando el padecimiento: ", error);
//     return "Ha ocurrido un error.";
//   }
// }

export async function Crear_Seguimiento(Body, HoraS1, HoraS2) {
  try {
    const connection = await mysql.createConnection(db);

    // Definimos la hora de seguimiento
    let HoraSeguimiento = HoraS1;
    // En caso de que exista una sesion acitva, se obtiene la sucursal de la cita
    // y se pone la hora de seguimiento correspondiente
    if (Body.idSesion) {
      const querySucursal = `SELECT c.idSucursal
      FROM Sesion s
      LEFT JOIN Citas c ON c.idCitas = s.idCitas
      WHERE s.idSesion = ?;`;
      // Obtenemos la Sucursal de la cita
      const [Sucursal] = await connection.execute(querySucursal, [
        Body.idSesion,
      ]);
      console.log("Sucursal:", Sucursal);
      console.log("Sucursal[0].idSucursal:", Sucursal[0].idSucursal);
      switch (Sucursal[0].idSucursal) {
        case 1:
          HoraSeguimiento = HoraS1;
          break;
        case 2:
          HoraSeguimiento = HoraS2;
          break;
        default:
          HoraSeguimiento = HoraS1;
          break;
      }
    }


    var date = new Date();
    const formatDate = (date) => {
      let formatted_date =
        date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate();
      return formatted_date;
    };

    const HoraFinal = formatDate(date) + " " + HoraSeguimiento;

    // Insertamos el seguimiento
    const queryCrear_Seguimiento = `INSERT INTO Seguimientos
    ( idDoctor, idPaciente, idSesion, Subjetivo, Objetivo, Fecha)
    VALUES(?, ?, ?, ?, ?, ?);`;
    const [result] = await connection.execute(queryCrear_Seguimiento, [
      Body.idDoctor,
      Body.idPaciente,
      Body.idSesion || null,
      Body.Subjetivo,
      Body.Objetivo,
      HoraFinal,
    ]);

    const queryInsertPadecimientos = `INSERT INTO Padecimientos_Seguimientos
    (idPadecimientos, idSeguimientos)
    VALUES( ?, ?);`;

    // Accede a la propiedad idPadecimientos[]
    const Padecimientos = Body["idPadecimientos[]"];
    console.log("Padecimientos:", Padecimientos);
    // Se tiene que evaluar si es un array o un valor único
    if (!Array.isArray(Padecimientos)) {
      // Si es un valor único, hacemos solo una inserción
      await connection.execute(queryInsertPadecimientos, [
        Padecimientos,
        result.insertId,
      ]);
    } else {
      // Si es un array, hacemos un foreach para insertar cada padecimiento
      Padecimientos.forEach(async (idPadecimiento) => {
        await connection.execute(queryInsertPadecimientos, [
          idPadecimiento,
          result.insertId,
        ]);
      });
    }

    connection.end();

    return "Se ha creado el seguimiento.";
  } catch (error) {
    console.error("Ha ocurrido un error creando el seguimiento: ", error);
    return "Ha ocurrido un error.";
  }
}

// export async function Update_Seguimiento(idSeguimiento,Seguimiento) {
//   try {
//     const connection = await mysql.createConnection(db);

//     const query = `UPDATE Seguimientos
//     SET Seguimiento = ?
//     WHERE idSeguimientos = ?;`;

//     await connection.execute(query, [Seguimiento,idSeguimiento]);
//     connection.end();
//     return "Se ha actualizado el seguimiento.";
//   } catch (error) {
//     console.error("Ha ocurrido un error creando el seguimiento: ", error);
//     return "Ha ocurrido un error.";
//   }
// }

export async function Update_Subjetivo(idSeguimiento, Valor) {
  try {
    const connection = await mysql.createConnection(db);

    const query = `UPDATE Seguimientos
    SET Subjetivo = ?
    WHERE idSeguimientos = ?;`;

    await connection.execute(query, [Valor, idSeguimiento]);
    connection.end();
    return "Se ha actualizado el seguimiento.";
  } catch (error) {
    console.error("Ha ocurrido un error creando el seguimiento: ", error);
    return "Ha ocurrido un error.";
  }
}

export async function Update_Objetivo(idSeguimiento, Valor) {
  try {
    const connection = await mysql.createConnection(db);

    const query = `UPDATE Seguimientos
    SET Objetivo = ?
    WHERE idSeguimientos = ?;`;

    await connection.execute(query, [Valor, idSeguimiento]);
    connection.end();
    return "Se ha actualizado el seguimiento.";
  } catch (error) {
    console.error("Ha ocurrido un error creando el seguimiento: ", error);
    return "Ha ocurrido un error.";
  }
}

//==================================================================================================
// Updates estados Pacientes
//==================================================================================================

export async function ActualizarAntecedentesPaciente(
  idPaciente,
  Propiedad,
  Valor
) {
  try {
    const connection = await mysql.createConnection(db);
    const Actualizacion = `UPDATE HistorialClinico SET ${Propiedad} = ? WHERE idPaciente = ?`;
    await connection.execute(Actualizacion, [Valor, idPaciente]);
    connection.end();
  } catch (error) {
    console.error(
      "Ha ocurrido un error actualizando los antecedentes del paciente: ",
      error
    );
  }
}

export async function ActualizarDatosGenerales(
  id,
  Propiedad,
  Valor,
  TipodeUsuario
) {
  // Actualiza la informacion del usuario basados en el tipo de usuario
  const tablas = [
    "SuperAdmin",
    "Admin",
    "Doctor",
    "Recepcionista",
    "Asociado",
    "Paciente",
  ];

  // Validación de TipodeUsuario
  const tipoUsuarioIndex = parseInt(TipodeUsuario) - 2;

  if (
    isNaN(tipoUsuarioIndex) ||
    tipoUsuarioIndex < 0 ||
    tipoUsuarioIndex >= tablas.length
  ) {
    console.error("Tipo de usuario inválido.");
    return "Tipo de usuario inválido.";
  }

  try {
    const connection = await mysql.createConnection(db);
    const Actualizacion = `UPDATE Usuarios as Usuario
        SET ${Propiedad} = ?
        WHERE Usuario.idUsuario IN(
        SELECT Fuente.idUsuario 
        FROM ${tablas[tipoUsuarioIndex]} AS Fuente
        WHERE Fuente.id${tablas[tipoUsuarioIndex]} = ?
        )`;
    await connection.execute(Actualizacion, [Valor, id]);
    connection.end();
  } catch (error) {
    console.error(
      `Ha ocurrido un error actualizando la informacion personal del paciente: (${Propiedad})`,
      error
    );
  }
}

//==================================================================================================
// NOTA:
// Se pueden modificar estas funciones para que retornen el Nombre de lo que estan modificando
// (Activo, Inactivo, Cancelado, etc)
// Al igual para las funciones de arriba (ActualizarAntecedentesPaciente, ActualizarDatosGenerales)
// y unicamente faltaría adaptar el frontend para que muestre el nombre en lugar del id
//==================================================================================================
export async function ActualizarStatus(TipodeUsuario, id, Status) {
  const tablas = [
    "SuperAdmin",
    "Admin",
    "Doctor",
    "Recepcionista",
    "Asociado",
    "Paciente",
  ];

  // Validación de TipodeUsuario
  const tipoUsuarioIndex = parseInt(TipodeUsuario) - 2;

  if (
    isNaN(tipoUsuarioIndex) ||
    tipoUsuarioIndex < 0 ||
    tipoUsuarioIndex >= tablas.length
  ) {
    console.error("Tipo de usuario inválido.");
    return "Tipo de usuario inválido.";
  }

  try {
    const connection = await mysql.createConnection(db);
    const Actualizacion = `UPDATE ${tablas[tipoUsuarioIndex]} SET idStatus = ? WHERE idPaciente = ?`;
    await connection.execute(Actualizacion, [Status, id]);
    connection.end();
  } catch (error) {
    console.error(
      "Ha ocurrido un error actualizando el status del usuario: ",
      error
    );
  }
}

export async function RegitroCreacionCita(R_EsDoctor, R_ID, idCita) {
  try {
    const connection = await mysql.createConnection(db);

    const query = `INSERT INTO Creacion_Citas (idDoctor, idRecepcionista, idCitas, Fecha) VALUES (?, ?, ?, NOW());`;

    let idDoctor = null;
    let idRecepcionista = null;

    // Verificación más explícita
    if (R_EsDoctor === true || R_EsDoctor === "true") {
      idDoctor = R_ID;
    } else {
      idRecepcionista = R_ID;
    }

    await connection.execute(query, [idDoctor, idRecepcionista, idCita]);

    connection.end();
  } catch (error) {
    console.error(
      "Ha ocurrido un error realizando el registro de la creacion de la cita: ",
      error
    );
  }
}
