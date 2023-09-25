import mysql from "mysql2/promise";
import bcrypt from "bcryptjs";
import { config } from "dotenv";
config();

//==================================================================================================
// Configuración de la conexión a la base de datos
//==================================================================================================
const db = {
  host: process.env.MYSQLDB_HOST,
  user: process.env.MYSQLDB_USER,
  password: process.env.MYSQLDB_PASSWORD,
  database: process.env.MYSQLDB_NAME,
  port: process.env.MYSQLDB_PORT_DOCKER,
};

//==================================================================================================
// Función para verificar el usuario y contraseña en varias tablas
//==================================================================================================
async function VerificarUsuario(usuario, contrasena) {
  try {
    const connection = await mysql.createConnection(db);
    // Tablas donde se verificará el inicio de sesion
    const tablas = [
      "SuperAdmin",
      "Admin",
      "Doctor",
      "Recepcionista",
      "Asociado",
      "Paciente",
    ];

    for (const tabla of tablas) {
      const consulta = `SELECT * FROM ${tabla} WHERE Usuario = ?`;
      const [rows, fields] = await connection.execute(consulta, [usuario]);
      // Si encontro un usuario
      if (rows.length > 0) {
        const hashedPassword = rows[0].Contraseña;
        // Compara la contraseña encrpitada
        if (bcrypt.compareSync(contrasena, hashedPassword)) {
          // Registra el inicio de sesion
          const registro =
            "INSERT INTO `Login/Out` (idUsuario,Login) VALUES (?, NOW())";
          await connection.execute(registro, [rows[0].idUsuario]);
          connection.end();
          const InfoSession = {
            verificacion: "ReadyUser",
            idTipoDeUsuario: Object.values(rows[0])[0],
            TipoUsuario: rows[0].idTipoDeUsuario,
            idUsuario: rows[0].idUsuario,
            WebStyle: rows[0].EstiloWeb,
            rol: tabla,
            Sucursal: rows[0].idSucursal,
          };
          return InfoSession;
        }
      }
    }
    connection.end();
    return "Usuario y//o contraseña incorrectos.";
  } catch (error) {
    console.error("Error en la consulta de inicio de sesion:", error);
    return "Ha ocurrido un error.";
  }
}

//==================================================================================================
// Función para obtener el nombre del usuario y si es o no doctor
//==================================================================================================
async function UsuarioyProfesion(idUsuario) {
  try {
    const connection = await mysql.createConnection(db);
    const consulta = `SELECT * FROM Usuarios WHERE idUsuario = ?`;
    const [rows, fields] = await connection.execute(consulta, [idUsuario]);
    // Verificacion de Doctor
    const veriDoc = `SELECT * FROM Doctor WHERE idUsuario = ?`;
    const [rowsDoc, fieldsDoc] = await connection.execute(veriDoc, [idUsuario]);

    if (rows.length > 0) {
      connection.end();
      const EsDoctor = rowsDoc.length > 0;
      const idDoctor = EsDoctor ? rowsDoc[0].idDoctor : null;
      // Visualizar array Obtenido de la tabla de Usuarios
      // console.log(rows);
      const InfoUsuario = {
        Nombre: rows[0].Nombres,
        ApellidoP: rows[0].ApellidoP,
        ApellidoM: rows[0].ApellidoM,
        EsDoctor: EsDoctor,
        idDoctor: idDoctor,
      };
      return InfoUsuario;
    }
  } catch (error) {
    console.error("Error en la consulta de usuario:", error);
    return "Ha ocurrido un error.";
  }
}

//==================================================================================================
// Funciones para obtener la informacion del Dashboard de los doctores (Pacientes en espera, Citas del dia, Otros consultorios y Citas Finalizadas)
//==================================================================================================
async function DashDoc(idDoctor, Fecha) {
  let PacientesEspera = [];
  let CitasHoy = [];
  let OtrosConsultorios = [];
  let CitasFinalizadas = [];

  //==================================================================================================
  // Pacientes en espera
  try {
    const connection = await mysql.createConnection(db);
    const consultaEspera = `SELECT p.idPaciente, u.Nombres, CONCAT(u.ApellidoP, ' ', u.ApellidoM) AS Apellidos, DATE_FORMAT(c.HoraCita, '%H:%i') AS HoraCita,
        DATE_FORMAT(c.HoraLlegada, '%H:%i') AS HoraLlegada, c.idStatusPaciente, u.RutaFoto
        FROM Citas c
        INNER JOIN Paciente p ON c.idPaciente = p.idPaciente 
        INNER JOIN Usuarios u ON p.idUsuario = u.idUsuario 
        WHERE c.idDoctor = ? AND c.idStatusPaciente = 2 OR c.idStatusPaciente = 3 AND DATE(c.HoraCita) = ? 
        ORDER BY c.HoraLlegada ASC, c.HoraCita ASC;`;

    const [rowsEspera, fieldsEspera] = await connection.execute(
      consultaEspera,
      [idDoctor, Fecha]
    );

    if (rowsEspera.length > 0) {
      PacientesEspera = rowsEspera.map((elemento) => {
        return {
          idPaciente: elemento.idPaciente,
          NombresPacientes: elemento.Nombres,
          ApellidosPacientes: elemento.Apellidos,
          HoraCita: elemento.HoraCita,
          HoraLlegada: elemento.HoraLlegada,
          StatusPaciente: elemento.idStatusPaciente,
          RutaFoto: elemento.RutaFoto,
        };
      });
    }

    connection.end();
  } catch (error) {
    console.error(
      "Ha ocurrido un error en la consulta de pacientes en espera:",
      error
    );
    return "Ha ocurrido un error.";
  }

  //==================================================================================================
  // Citas del dia
  try {
    const connection = await mysql.createConnection(db);
    const consultaHoy = `SELECT p.idPaciente, u.Nombres, CONCAT(u.ApellidoP, ' ', u.ApellidoM) AS Apellidos, DATE_FORMAT(c.HoraCita, '%H:%i') AS HoraCita, u.RutaFoto
        FROM Citas c
        INNER JOIN Paciente p ON c.idPaciente = p.idPaciente 
        INNER JOIN Usuarios u ON p.idUsuario = u.idUsuario 
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
        };
      });
    }

    connection.end();
  } catch (error) {
    console.error(
      "Ha ocurrido un error en la consulta de citas del día:",
      error
    );
    return "Ha ocurrido un error.";
  }

  //==================================================================================================
  // Otros consultorios
  try {
    const connection = await mysql.createConnection(db);
    const consultaOtrosConsultorios = `SELECT p.idPaciente,
    CONCAT(up.Nombres, ' ', up.ApellidoP, ' ', up.ApellidoM) AS NombrePaciente,
    CONCAT(ud.Nombres) AS NombreDoctor,
    CONCAT(ua.Nombres) AS NombreAsociado,
    DATE_FORMAT(c.HoraCita, '%H:%i') AS HoraCita,
    DATE_FORMAT(c.HoraLlegada, '%H:%i') AS HoraLlegada,
    c.idStatusPaciente, s.idConsultorio, up.RutaFoto
    FROM Citas c
    INNER JOIN Paciente p ON c.idPaciente = p.idPaciente
    INNER JOIN Usuarios up ON p.idUsuario = up.idUsuario 
    LEFT JOIN Doctor d ON c.idDoctor = d.idDoctor
    LEFT JOIN Usuarios ud ON d.idUsuario = ud.idUsuario
    LEFT JOIN Asociado a ON c.idAsociado = a.idAsociado
    LEFT JOIN Usuarios ua ON a.idUsuario = ua.idUsuario
    LEFT JOIN Sesion s ON c.idCitas  = s.idCitas 
    WHERE (c.idDoctor != ? OR c.idAsociado != 0)
    AND c.idStatusPaciente = 2 OR c.idStatusPaciente = 3 
    ORDER BY c.HoraLlegada ASC;`;

    const [rowsOtros, fieldsEspera] = await connection.execute(
      consultaOtrosConsultorios,
      [idDoctor]
    );

    if (rowsOtros.length > 0) {
      OtrosConsultorios = rowsOtros.map((elemento) => {
        // Verificamos si el paciente esta con un doctor o con un asociado
        const QuienAtiende = elemento.NombreDoctor || elemento.NombreAsociado;
        return {
          idPaciente: elemento.idPaciente,
          NombresPacientes: elemento.NombrePaciente,
          NombreDoctor: QuienAtiende,
          HoraCita: elemento.HoraCita,
          HoraLlegada: elemento.HoraLlegada,
          StatusPaciente: elemento.idStatusPaciente,
          Consultorio: elemento.idConsultorio,
          RutaFoto: elemento.RutaFoto,
        };
      });
      connection.end();
    }
  } catch (error) {
    console.error(
      "Ha ocurrido un error en la consulta de otros consultorios:",
      error
    );
    return "Ha ocurrido un error.";
  }

  //==================================================================================================
  // Citas Finalizadas
  try {
    const connection = await mysql.createConnection(db);
    const consultaFinalizadas = `SELECT p.idPaciente, u.Nombres, CONCAT(u.ApellidoP, ' ', u.ApellidoM) AS Apellidos, DATE_FORMAT(c.HoraCita, '%H:%i') AS HoraCita, u.RutaFoto
    FROM Citas c
    INNER JOIN Paciente p ON c.idPaciente = p.idPaciente
    INNER JOIN Usuarios u ON p.idUsuario = u.idUsuario
    WHERE c.idDoctor = ? AND c.idStatusPaciente = 4 
    ORDER BY c.HoraCita DESC;`;
    const [rowsFin, fieldsEspera] = await connection.execute(
      consultaFinalizadas,
      [idDoctor]
    );
    if (rowsFin.length > 0) {
      CitasFinalizadas = rowsFin.map((elemento) => {
        return {
          idPaciente: elemento.idPaciente,
          NombresPacientes: elemento.Nombres,
          ApellidosPacientes: elemento.Apellidos,
          HoraCita: elemento.HoraCita,
          RutaFoto: elemento.RutaFoto,
        };
      });
      connection.end();
    }
  } catch (error) {
    console.error(
      "Ha ocurrido un error en la consulta de citas finalizadas:",
      error
    );
    return "Ha ocurrido un error.";
  }
  const InfoDashDoc = {
    PacientesEspera: PacientesEspera,
    CitasHoy: CitasHoy,
    OtrosConsultorios: OtrosConsultorios,
    CitasFinalizadas: CitasFinalizadas,
  };
  return InfoDashDoc;
}

//==================================================================================================
// Función para obtener la informacion del Dashboard de recpecion (Pacientes en espera, Citas del dia, Otros consultorios y Citas Finalizadas)
//==================================================================================================
async function DashRecepcion(Sucursal, Fecha) {
  let PacientesEsperaR = [];
  let CitasDoctoresHoy = [];
  let OtrosConsultoriosR = [];
  let CitasFinalizadasR = [];
  try {
    //==================================================================================================
    // Citas del dia
    const connection = await mysql.createConnection(db);
    const consultaHoy = `SELECT c.idCitas, p.idPaciente, idDoctor, u.Nombres, CONCAT(u.ApellidoP, ' ', u.ApellidoM) AS Apellidos, DATE_FORMAT(c.HoraCita, '%H:%i') AS HoraCita,u.RutaFoto
    FROM Citas c
    INNER JOIN Paciente p ON c.idPaciente = p.idPaciente 
    INNER JOIN Usuarios u ON p.idUsuario = u.idUsuario 
    WHERE c.idSucursal = ? AND c.idStatusPaciente = 1 AND DATE(c.HoraCita) = ? 
    ORDER BY c.HoraCita ASC;`;

    const [rowsHoy, fieldsHoy] = await connection.execute(consultaHoy, [
      Sucursal,
      Fecha,
    ]);

    if (rowsHoy.length > 0) {
      CitasDoctoresHoy = rowsHoy.map((elemento) => {
        return {
          idCitas: elemento.idCitas,
          idPaciente: elemento.idPaciente,
          idDoctor: elemento.idDoctor,
          NombresPacientes: elemento.Nombres,
          ApellidosPacientes: elemento.Apellidos,
          HoraCita: elemento.HoraCita,
          RutaFoto: elemento.RutaFoto,
        };
      });
    }

    connection.end();
  } catch (error) {
    console.error(
      "Ha ocurrido un error en la consulta de citas del día:",
      error
    );
    return "Ha ocurrido un error.";
  }

  try {
    //==================================================================================================
    // Sala de espera
    const connection = await mysql.createConnection(db);
    const consultaHoy = `SELECT c.idCitas, p.idPaciente, idDoctor, u.Nombres, CONCAT(u.ApellidoP, ' ', u.ApellidoM) AS Apellidos, DATE_FORMAT(c.HoraCita, '%H:%i') AS HoraCita, DATE_FORMAT(c.HoraLlegada, '%H:%i') AS HoraLlegada, u.RutaFoto
  FROM Citas c
  INNER JOIN Paciente p ON c.idPaciente = p.idPaciente 
  INNER JOIN Usuarios u ON p.idUsuario = u.idUsuario 
  WHERE c.idStatusPaciente = 2 AND DATE(c.HoraCita) = ?
  ORDER BY c.HoraLlegada ASC;`;

    const [rowsEspera, fieldsHoy] = await connection.execute(consultaHoy, [
      Fecha,
    ]);

    if (rowsEspera.length > 0) {
      PacientesEsperaR = rowsEspera.map((elemento) => {
        return {
          idCitas: elemento.idCitas,
          idPaciente: elemento.idPaciente,
          idDoctor: elemento.idDoctor,
          NombresPacientes: elemento.Nombres,
          ApellidosPacientes: elemento.Apellidos,
          HoraCita: elemento.HoraCita,
          HoraLlegada: elemento.HoraLlegada,
          RutaFoto: elemento.RutaFoto,
        };
      });
    }
    connection.end();
  } catch (error) {
    console.error("Ha ocurrido un error en los pacientes en espera:", error);
    return "Ha ocurrido un error.";
  }

  try {
    //==================================================================================================
    // Citas Finalizadas
  } catch (error) {
    console.error("Ha ocurrido un error en los pacientes en espera:", error);
    return "Ha ocurrido un error.";
  }

  const InfoDashRecep = {
    CitasDoctoresHoy: CitasDoctoresHoy,
    PacientesEspera: PacientesEsperaR,
    CitasFinalizadas: CitasFinalizadasR,
    OtrosConsultorios: OtrosConsultoriosR,
  };
  return InfoDashRecep;
}

//==================================================================================================
// Funcion para obtener la informacion de los pacientes
//==================================================================================================
async function InfoPaciente(idPaciente) {
  // Llenamos los datos con valores por defecto
  let BasicInfo = [];
  let Antecedentes = [];
  let DatosDT = [];
  let Recetas = [];
  let HistorialFotografico = [];
  let Consultas = [];
  // =================================================
  // Informacion basica del paciente
  try {
    const connection = await mysql.createConnection(db);
    const queryBasicInfo = `
    SELECT U.Nombres, CONCAT(U.ApellidoP,' ',U.ApellidoM) AS Apellidos, TIMESTAMPDIFF(YEAR, u.FechadeNacimiento, CURDATE()) AS Edad,
    DATE_FORMAT(U.FechadeNacimiento, '%d-%m-%Y') AS FechaDeNacimiento, S.Sexo, U.Telefono, U.TelefonoSecundario, U.Correo, U.RutaFoto 
    FROM Paciente p INNER JOIN Usuarios U  ON p.idUsuario = U.idUsuario INNER JOIN Sexo s ON U.idSexo = S.idSexo 
    WHERE p.idPaciente = ?
    `;
    const [rowInfoP, fieldsHistory] = await connection.execute(queryBasicInfo, [
      idPaciente,
    ]);
    connection.end();
    if (rowInfoP.length > 0) {
      BasicInfo = rowInfoP.map((elemento) => {
        return {
          Nombres: elemento.Nombres,
          Apellidos: elemento.Apellidos,
          Edad: elemento.Edad,
          FechadeNac: elemento.FechaDeNacimiento,
          Sexo: elemento.Sexo,
          Tel1: elemento.Telefono,
          Tel2: elemento.TelefonoSecundario,
          Correo: elemento.Correo,
          RutaFoto: elemento.RutaFoto,
        };
      });
    }
  } catch (error) {
    console.error(
      "Ha ocurrido un error obteniendo la informacion Basica del paciente: ",
      error
    );
    return "Ha ocurrido un error.";
  }
  // =================================================
  // Antecedentes del paciente
  try {
    const connection = await mysql.createConnection(db);
    const queryAntecedentes = `SELECT hc.P_Actual AS PadecimientoActual, hc.A_HF AS Antecedentes_HF, hc.A_NP AS Antecedentes_NP, hc.A_PP AS Antecedentes_PP, hc.Alergias AS Alergias 
    FROM Paciente p 
    INNER JOIN HistorialClinico hc ON p.idPaciente = hc.idPaciente 
    WHERE p.idPaciente = ?`;
    const [rowAntecedentes, fieldsAntecedentes] = await connection.execute(
      queryAntecedentes,
      [idPaciente]
    );
    connection.end();
    if (rowAntecedentes.length > 0) {
      Antecedentes = rowAntecedentes.map((elemento) => {
        return {
          P_Actual: elemento.PadecimientoActual,
          A_HF: elemento.Antecedentes_HF,
          A_NP: elemento.Antecedentes_NP,
          A_PP: elemento.Antecedentes_PP,
          Alergias: elemento.Alergias,
        };
      });
    }
  } catch (error) {
    console.error(
      "Ha ocurrido un error obteniendo los antecedentes del paciente: ",
      error
    );
    return "Ha ocurrido un error.";
  }

  // =================================================
  // Datos del Sistema del paciente
  try {
    const connection = await mysql.createConnection(db);
    const queryDatoDT = `
    SELECT S.Status, P.Usuario,COALESCE(u2.Nombres, u3.Nombres) AS AltaPor, COALESCE(u2.RutaFoto , u3.RutaFoto) AS FotoAlta, 
    COALESCE(u2.RutaFoto , u3.RutaFoto) AS FotoAlta, 
    COALESCE(tu.Tipo, tu2.Tipo) AS TipodeUsuario, 
    DATE_FORMAT(u.FechaAlta, "%d/%m/%y a las %h:%i:%s %p") AS FechaAlta
    FROM Paciente p 
    LEFT JOIN Status s ON p.idStatus  = s.idStatus 
    LEFT JOIN Usuarios U  ON p.idUsuario = U.idUsuario 
    LEFT JOIN Alta_Paciente ap  ON p.idPaciente =ap.idPaciente
    LEFT JOIN Doctor d ON ap.idDoctor  = d.idDoctor 
    LEFT JOIN Usuarios u2 ON d.idUsuario = u2.idUsuario 
    LEFT JOIN TipodeUsuario tu ON d.idTipoDeUsuario = tu.idTipoUsuario
    LEFT JOIN Recepcionista r ON ap.idRecepcionista = r.idRecepcionista 
    LEFT JOIN Usuarios u3 ON r.idUsuario = u3.idUsuario 
    LEFT JOIN TipodeUsuario tu2 ON r.idTipoDeUsuario = tu2.idTipoUsuario
    WHERE p.idPaciente = ?
    `;
    const [rowDatosDT, fieldsAntecedentes] = await connection.execute(
      queryDatoDT,
      [idPaciente]
    );
    connection.end();
    if (rowDatosDT.length > 0) {
      DatosDT = rowDatosDT.map((elemento) => {
        return {
          Status: elemento.Status,
          Usuario: elemento.Usuario,
          AltaPor: elemento.AltaPor,
          TipoUsuarioAlta: elemento.TipodeUsuario,
          FotoAlta: elemento.FotoAlta,
          FechaAlta: elemento.FechaAlta,
        };
      });
    }
    // console.log(DatosDT);
  } catch (error) {
    console.error(
      "Ha ocurrido un error obteniendo los datos de DermaTotal del paciente: ",
      error
    );
    return "Ha ocurrido un error.";
  }
  // =================================================
  // Recetas del paciente
  try {
    const connection = await mysql.createConnection(db);
    const queryRecetas = `
    SELECT mr.idReceta_Pacientes,u.Nombres as Doctor,m.Medicamento, m.Indicacion, Fecha, Nota
    FROM Receta_Pacientes rp
    LEFT JOIN Medicamento_Receta mr ON mr.idReceta_Pacientes = rp.idReceta_Pacientes
    LEFT JOIN Medicamento m ON m.idMedicamento = mr.idMedicamento
    LEFT JOIN Doctor d ON d.idDoctor = rp.idDoctor
    LEFT JOIN Usuarios u ON u.idUsuario = d.idUsuario
    WHERE rp.idPaciente = ?
    ORDER BY Fecha DESC  
    `;
    const [rowRecetas, fieldsAntecedentes] = await connection.execute(
      queryRecetas,
      [idPaciente]
    );
    connection.end();
    if (rowRecetas.length > 0) {
      Recetas = rowRecetas.map((elemento) => {
        return {
          idReceta: elemento.idReceta_Pacientes,
          Doctor: elemento.Doctor,
          Medicamento: elemento.Medicamento,
          Indicacion: elemento.Indicacion,
          Fecha: elemento.Fecha,
          Nota: elemento.Nota,
        };
      });
    }
  } catch (error) {
    console.error(
      "Ha ocurrido un error obteniendo la receta del paciente: ",
      error
    );
    return "Ha ocurrido un error.";
  }
  // =================================================
  // Historial fotografico del paciente
  try {
  } catch (error) {
    console.error(
      "Ha ocurrido un error obteniendo el historial fotografico del paciente: ",
      error
    );
    return "Ha ocurrido un error.";
  }
  // =================================================
  // Consultas del paciente
  try {
  } catch (error) {
    console.error(
      "Ha ocurrido un error obteniendo las consultas del paciente: ",
      error
    );
    return "Ha ocurrido un error.";
  }

  const InfoPaciente = {
    BasicInfo: BasicInfo,
    Antecedentes: Antecedentes,
    DatosDT: DatosDT,
    Recetas: Recetas,
    HistorialFotografico: HistorialFotografico,
    Consultas: Consultas,
  };

  return InfoPaciente;
}

//==================================================================================================
// Creaciones  / Assets
//==================================================================================================

async function NuevoPaciente(
  Nombres,
  ApellidoP,
  ApellidoM,
  idSexo,
  Correo,
  Telefono,
  TelefonoSecundario,
  FechaNacimiento,
  RutaFoto,
  idDoctor,
  idRecepcionista
) {
  try {
    const connection = await mysql.createConnection(db);
    await connection.beginTransaction();
    // Almacenamos los Querys en variables para ejecutarlas despues
    const queryUsuario = `INSERT INTO Usuarios
      (Nombres, ApellidoP, ApellidoM, idSexo, Correo, Telefono, TelefonoSecundario, FechadeNacimiento, FechaAlta, RutaFoto)
      VALUES(?, ?, ?, ?, ?, ?, ?, ?, NOW(), ?)`;

    const queryPaciente = `INSERT INTO Paciente
      (idUsuario, Usuario, Contraseña)
      VALUES(LAST_INSERT_ID(), ?, ?)`;

    const queryRegistro = `INSERT INTO Alta_Paciente 
      (idDoctor,idRecepcionista,idPaciente)
      VALUES(?, ?, LAST_INSERT_ID())`;

    const queryAntecedentes = `INSERT INTO HistorialClinico (idPaciente) 
      VALUES (?)`;

    //Obtenemos la fecha de hoy
    const fechaActual = new Date();
    // Y generamos el nombre de usuario con base a su nombre, el dia de registro y un numero aleatorio de 2 digitos
    const usuario =
      Nombres.substring(0, 3) +
      fechaActual.getDate() +
      (Math.floor(Math.random() * 90) + 10);
    // Encriptamos el usuario para generar la clave
    const salt = await bcrypt.genSalt(10);
    const password = await bcrypt.hash(usuario, salt);

    // Ejecutamos el registro del paciente
    await connection.execute(queryUsuario, [
      Nombres,
      ApellidoP,
      ApellidoM,
      idSexo,
      Correo,
      Telefono,
      TelefonoSecundario,
      FechaNacimiento,
      RutaFoto,
    ]);

    // Utilizamos el ID insertado en la primera consulta para la segunda consulta
    const [resultPaciente] = await connection.execute(queryPaciente, [
      usuario,
      password,
    ]);

    // Y registramos quien hizo el registro del paciente
    await connection.execute(queryRegistro, [idDoctor, idRecepcionista]);

    //Asi como le creamos un expediente vacio
    await connection.execute(queryAntecedentes, [resultPaciente.insertId]);

    await connection.commit();
    connection.end();
    return resultPaciente.insertId;
  } catch (error) {
    console.error(
      "Ha ocurrido un error en la creacion de un nuevo paciente:",
      error
    );
    connection.rollback();
    connection.end();
    return "Ha ocurrido un error.";
  }
}

// Funcion para obtener la informacion de los registros
async function InfoRegistros() {
  try {
    const connection = await mysql.createConnection(db);
    // Pedimos los Doctores Existentes
    const Doctores = `SELECT d.idDoctor, u.Nombres, u.RutaFoto  FROM Doctor d
    INNER JOIN Usuarios u ON d.idUsuario  = u.idUsuario `;
    const [docs, a] = await connection.execute(Doctores);

    //Pedimos el Sexo Disponible
    const Asociados = `SELECT a.idAsociado,u.Nombres, u.RutaFoto  FROM Asociado a 
    INNER JOIN Usuarios u ON a.idUsuario = u.idUsuario`;
    const [Asoc, b] = await connection.execute(Asociados);

    //Pedimos el Sexo Disponible
    const Sexo = `SELECT * FROM Sexo s`;
    const [Sex, c] = await connection.execute(Sexo);

    //Pedimos las Sucursales Disponibles
    const Sucursales = `SELECT * FROM Sucursales s`;
    const [suc, d] = await connection.execute(Sucursales);

    //Pedimos los procedimientos Dispobibles
    const Procedimiento = `SELECT idProcedimiento,Procedimiento FROM Procedimiento p`;
    const [Proced, e] = await connection.execute(Procedimiento);

    //Pedimos los procedimientos Dispobibles
    const EstadoC = `SELECT * FROM Estado_Citas ec `;
    const [EstC, f] = await connection.execute(EstadoC);

    //Pedimos los procedimientos Dispobibles
    const StatusUsuario = ` SELECT * FROM Status s`;
    const [Stat_U, g] = await connection.execute(StatusUsuario);

    connection.end();
    const InfoparaRegistros = {
      Doctores: docs,
      Asociados: Asoc,
      Sucursales: suc,
      Sexo: Sex,
      Procedimiento: Proced,
      EstadoCitas: EstC,
      StatusUsuario: Stat_U,
    };
    return InfoparaRegistros;
  } catch (error) {
    console.error("Ha ocurrido un error en la consulta de registros:", error);
    return "Ha ocurrido un error.";
  }
}

async function logout(idUsuario) {
  try {
    const connection = await mysql.createConnection(db);
    const registro =
      "UPDATE `Login/Out` SET Logout = NOW() WHERE Login  = (SELECT MAX(Login) FROM `Login/Out` WHERE Logout IS NULL);";
    await connection.execute(registro, [idUsuario]);
    connection.end();
  } catch (error) {
    console.error(
      "Ha ocurrido un error realizando el registro de logout",
      error
    );
    return "Ha ocurrido un error.";
  }
}

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

// Cambia la contraseña de los pacientes
async function CambiarContraseñaPaciente(idPaciente, NuevaContraseña) {
  try {
    // Encriptamos la contraseña
    const salt = await bcrypt.genSalt(10);
    const ContraCript = await bcrypt.hash(NuevaContraseña, salt);
    const connection = await mysql.createConnection(db);

    const CambioContra = `UPDATE Paciente SET Contraseña = ?, WHERE idPaciente = ?;`;
    // Y insartamos el cambio
    await connection.execute(CambioContra, [ContraCript, idPaciente]);
    connection.end();
  } catch (error) {
    console.error("Ha ocurrido un error actualizando la cita: ", error);
    return "Ha ocurrido un error.";
  }
}
// Cambia la contraseña del Personal
async function CambiarContraseña(Usuario, NuevaContraseña) {}

// Reinicia la contraseña por el nombre de usuario
async function PassRestart(Usuario) {
  try {
    const connection = await mysql.createConnection(db);
    // Tablas donde se realizara la busqueda para el usuario
    const tablas = [
      "SuperAdmin",
      "Admin",
      "Doctor",
      "Recepcionista",
      "Asociado",
      "Paciente",
    ];
    // Buscael usuario en todas las tablas
    for (const tabla of tablas) {
      const consulta = `SELECT * FROM ${tabla} WHERE Usuario = ?`;
      const [rows, fields] = await connection.execute(consulta, [Usuario]);
      // Si encontro un usuario
      if (rows.length > 0) {
        // Encriptamos el nombre de usuario para generar la clave
        const salt = await bcrypt.genSalt(10);
        const ContraCript = await bcrypt.hash(Usuario, salt);
        const CambioCita = `UPDATE ${tabla} SET Contraseña = ? WHERE Usuario = ?;`;
        await connection.execute(CambioCita, [ContraCript, Usuario]);
        connection.end();
      }
    }
  } catch (error) {
    console.error("Ha ocurrido un error actualizando la cita: ", error);
    return "Ha ocurrido un error.";
  }
}

async function NuevaReceta(
  idPaciente,
  idDoctor,
  idSesion,
  Medicamentos,
  Indicaciones,
  Nota
) {
  let idReceta = 0;
  let idMedicamento = [];

  const connection = await mysql.createConnection(db);

  try {
    const NewReceta = `INSERT INTO Receta_Pacientes
      (idPaciente, idDoctor, idSesion, Fecha, Nota)
      VALUES (?, ?, ?, ?, ?);`;

    const [recetaResult] = await connection.execute(NewReceta, [
      idPaciente,
      idDoctor,
      idSesion || null,
      new Date(),
      Nota || null,
    ]);

    idReceta = recetaResult.insertId;
  } catch (error) {
    console.error("Ha ocurrido un error creando la receta: ", error);
    return "Ha ocurrido un error.";
  }

  if (Medicamentos.length > 0) {
    const medicamentosToInsert = Array.isArray(Medicamentos)
      ? Medicamentos
      : [Medicamentos];

    const indicacionesToInsert = Array.isArray(Indicaciones)
      ? Indicaciones
      : [Indicaciones];

    for (let i = 0; i < medicamentosToInsert.length; i++) {
      const Medicamento = medicamentosToInsert[i];
      const Indicacion = indicacionesToInsert[i] || "";

      const NewMedicamento = `INSERT INTO Medicamento
        (Medicamento, Indicacion)
        VALUES (?, ?);`;

      try {
        const [medicamentoResult] = await connection.execute(NewMedicamento, [
          Medicamento,
          Indicacion,
        ]);

        idMedicamento.push(medicamentoResult.insertId);
      } catch (error) {
        console.error("Error al insertar Medicamento:", error);
      }
    }
  } else {
    console.log(
      "El array Medicamentos está vacío, no se realizaron inserciones."
    );
  }

  if (Array.isArray(idMedicamento) && idMedicamento.length > 0) {
    for (const medicamentoId of idMedicamento) {
      const insertQuery =
        "INSERT INTO Medicamento_Receta (idMedicamento, idReceta_Pacientes) VALUES (?, ?);";
      await connection.execute(insertQuery, [medicamentoId, idReceta]);
    }
  }

  await connection.end();
}

async function Receta(idPaciente, idReceta) {
  try {
    const connection = await mysql.createConnection(db);
    const queryReceta = `
    SELECT CONCAT(ud.Nombres ," ",ud.ApellidoP," ",ud.ApellidoM) as Doctor,d.Especialidad,d.Universidad ,d.CertificadoProf, ud.Correo as CorreoDoc,
    CONCAT(up.Nombres ," ",up.ApellidoP," ",up.ApellidoM) as Paciente,TIMESTAMPDIFF(YEAR, up.FechadeNacimiento, CURDATE()) AS Edad,
    m.Medicamento, m.Indicacion, Fecha, Nota
    FROM Receta_Pacientes rp
    LEFT JOIN Medicamento_Receta mr ON mr.idReceta_Pacientes = rp.idReceta_Pacientes
    LEFT JOIN Medicamento m ON m.idMedicamento = mr.idMedicamento
    LEFT JOIN Doctor d ON d.idDoctor = rp.idDoctor
    LEFT JOIN Usuarios ud ON ud.idUsuario = d.idUsuario
    LEFT JOIN Paciente p ON p.idPaciente = rp.idPaciente
    LEFT JOIN Usuarios up ON up.idUsuario = p.idUsuario
    WHERE rp.idPaciente = ? AND mr.idReceta_Pacientes = ?
    `;
    const [checkreceta, a] = await connection.execute(queryReceta, [
      idPaciente,
      idReceta,
    ]);
    connection.end();
    return checkreceta;
  } catch (error) {
    console.error(
      "Ha ocurrido un error consultando la receta del paciente: ",
      error
    );
    return "Ha ocurrido un error.";
  }
}


async function Busqueda(Nombre, Apellidos, Telefono_Correo) {
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
        Correo:elemento.Correo,
        Status: elemento.Status,
        RutaFoto:elemento.RutaFoto,
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
async function NuevaCita(
  idPaciente,
  idSucursal,
  idProcedimineto,
  idDoctor,
  idAsociado,
  HoraCita,
  FinCita
) {}

async function ActualizarAntecedentesPaciente(idPaciente, Propiedad, Valor) {
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

async function ActualizarDatosGenerales(id, Propiedad, Valor, TipodeUsuario) {
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

async function ActualizarStatus(TipodeUsuario, id, Status) {
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

async function Hoy_Espera(idCita, idStatusPaciente, HoraLlegada) {
  try {
    const connection = await mysql.createConnection(db);
    idStatusPaciente = idStatusPaciente + 1;
    const consulta = `UPDATE Citas SET idStatusPaciente = ?, HoraLlegada = CONCAT(CURDATE()," ", ?) WHERE idCitas = ?;`;
    connection.execute(consulta, [idStatusPaciente, HoraLlegada, idCita]);
    connection.end();
  } catch (error) {
    console.error("Ha ocurrido un error en la actualizacion:", error);
    return "Ha ocurrido un error.";
  }
}

export {
  VerificarUsuario,
  UsuarioyProfesion,
  DashDoc,
  DashRecepcion,
  Hoy_Espera,
  NuevoPaciente,
  InfoRegistros,
  logout,
  CitasDoctor,
  ModificacionCita,
  InfoPaciente,
  ActualizarAntecedentesPaciente,
  PassRestart,
  ActualizarDatosGenerales,
  ActualizarStatus,
  NuevaReceta,
  Receta,
  Busqueda,
};
