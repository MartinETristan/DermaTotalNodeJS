import { mysql, db } from "../conf_api.js";

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
    const Procedimiento = `SELECT idProcedimiento,Procedimiento FROM Procedimiento p`;
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
// Updates estados Pacientes / Citas
//==================================================================================================
export async function NuevaCita(
  idSucursal,
  idProcedimiento,
  idDoctor,
  idAsociado,
  idPaciente,
  idStatus,
  FechaCita,
  DuracionCita,
  NotasCita
) {}

export async function ActualizarAntecedentesPaciente(idPaciente, Propiedad, Valor) {
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

export async function ActualizarDatosGenerales(id, Propiedad, Valor, TipodeUsuario) {
  // Acrtualiza la informacion del usuario basados en el tipo de usuario
  switch (TipodeUsuario) {
    case 1:
      break;

    case 2:
      break;

    case 3:
      break;

    case 4:
      break;

    case 5:
      break;

    case 6:
      break;

    case 7:
      try {
        const connection = await mysql.createConnection(db);
        const Actualizacion = `UPDATE Usuarios as Usuario
          SET ${Propiedad} = ?
          WHERE Usuario.idUsuario IN(
          SELECT Fuente.idUsuario 
          FROM Paciente AS Fuente
          WHERE Fuente.idPaciente = ?
          )`;
        await connection.execute(Actualizacion, [Valor, id]);
        connection.end();
      } catch (error) {
        console.error(
          "Ha ocurrido un error actualizando la informacion personal del paciente: ",
          error
        );
      }
      break;

    default:
      console.log("No se encontro el tipo de usuario");
      break;
  }
}

export async function ActualizarStatus(TipodeUsuario, id, Status) {
  switch (TipodeUsuario) {
    case 1:
      break;

    case 2:
      break;

    case 3:
      break;

    case 4:
      break;

    case 5:
      break;

    case 6:
      break;

    case 7:
      try {
        const connection = await mysql.createConnection(db);
        const Actualizacion = `UPDATE Paciente SET idStatus = ? WHERE idPaciente = ?`;
        await connection.execute(Actualizacion, [Status, id]);
        connection.end();
      } catch (error) {
        console.error(
          "Ha ocurrido un error actualizando el status del usuario: ",
          error
        );
      }
      break;
    default:
      console.log("No se encontro el tipo de usuario");
      break;
  }
}

