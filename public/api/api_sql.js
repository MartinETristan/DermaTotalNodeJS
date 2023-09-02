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
          const registro = "INSERT INTO `Login/Out` (idUsuario,Login) VALUES (?, NOW())";
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
        idDoctor:idDoctor,
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
        ORDER BY c.HoraLlegada ASC;`;

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
// Creaciones  / Assets
//==================================================================================================

async function NuevoPaciente(Nombres, ApellidoP, ApellidoM, idSexo, Correo, Telefono, TelefonoSecundario, FechaNacimiento, RutaFoto,idDoctor,idRecepcionista) {
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

    //Obtenemos la fecha de hoy
    const fechaActual = new Date();
    // Y generamos el nombre de usuario con base a su nombre, el dia de registro y un numero aleatorio de 2 digitos
    const usuario = Nombres.substring(0, 3) + fechaActual.getDate() + (Math.floor(Math.random() * 90) + 10);
    // Encriptamos el usuario para generar la clave
    const salt = await bcrypt.genSalt(10);
    const password = await bcrypt.hash(usuario, salt);

    // Ejecutamos el registro del paciente
    await connection.execute(queryUsuario, [Nombres, ApellidoP, ApellidoM, idSexo, Correo, Telefono, TelefonoSecundario, FechaNacimiento, RutaFoto]);

    // Utilizamos el ID insertado en la primera consulta para la segunda consulta
    const [resultPaciente] = await connection.execute(queryPaciente, [usuario, password]);

    // Y finalmente registramos quien hizo el registro del paciente
    await connection.execute(queryRegistro, [idDoctor, idRecepcionista]);

    await connection.commit();
    connection.end();
    return resultPaciente.insertId;
  } catch (error) {
    console.error("Ha ocurrido un error en la creacion de un nuevo paciente:", error);
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
    const [docs,a] = await connection.execute(Doctores);

    //Pedimos el Sexo Disponible
    const Asociados = `SELECT a.idAsociado,u.Nombres, u.RutaFoto  FROM Asociado a 
    INNER JOIN Usuarios u ON a.idUsuario = u.idUsuario`;
    const [Asoc,b] = await connection.execute(Asociados);

    //Pedimos el Sexo Disponible
    const Sexo = `SELECT * FROM Sexo s`;
    const [Sex,c] = await connection.execute(Sexo);

    //Pedimos las Sucursales Disponibles
    const Sucursales = `SELECT idSucursal,Sucursal  FROM Sucursales s`;
    const [suc,d] = await connection.execute(Sucursales);

    //Pedimos los procedimientos Dispobibles
    const Procedimiento = `SELECT idProcedimiento,Procedimiento FROM Procedimiento p`;
    const [Proced,e] = await connection.execute(Procedimiento);

    //Pedimos los procedimientos Dispobibles
    const EstadoC = `SELECT * FROM Estado_Citas ec `;
    const [EstC,f] = await connection.execute(EstadoC);

    connection.end();
    const InfoparaRegistros = {
      Doctores: docs,
      Asociados: Asoc,
      Sucursales: suc,
      Sexo:Sex,
      Procedimiento:Proced,
      EstadoCitas:EstC
    };
    return InfoparaRegistros;
  } catch (error) {
    console.error("Ha ocurrido un error en la consulta de registros:", error);
    return "Ha ocurrido un error.";
  }
}

async function logout(idUsuario){
  try{
    const connection = await mysql.createConnection(db);
    const registro = "UPDATE `Login/Out` SET Logout = NOW() WHERE Login  = (SELECT MAX(Login) FROM `Login/Out` WHERE Logout IS NULL);";
    await connection.execute(registro, [idUsuario]);
    connection.end();
  } catch (error) {
    console.error("Ha ocurrido un error realizando el registro de logout", error);
    return "Ha ocurrido un error.";
  }

}
async function CitasDoctor(idDoctor) {
  try{
    const connection = await mysql.createConnection(db);
    const CalendarioCitas =  `SELECT c.idCitas,c.idStatusPaciente, u.Nombres, p.Procedimiento ,c.HoraCita ,c.FinCita FROM Citas c 
    INNER JOIN Procedimiento p ON c.idProcedimiento = p.idProcedimiento 
    INNER JOIN Paciente pa ON c.idPaciente  = pa.idPaciente 
    INNER JOIN  Usuarios u ON pa.idUsuario  = u.idUsuario 
    WHERE  idDoctor = ?`;
    const [rowsCitas, fieldsHoy] = await connection.execute(CalendarioCitas, [idDoctor]);
    connection.end();
    return rowsCitas;
  }catch(error){
    console.error("Ha ocurrido un error obteniendo las citas del doctor: ", error);
    return "Ha ocurrido un error.";
  }
}

async function ModificacionCita(idCita,HoraIncio,FinCita) {
  try{
    const connection = await mysql.createConnection(db);
    const CambioCita =  `UPDATE Citas SET HoraCita = ?, FinCita = ? WHERE idCitas = ?;
    `;
    await connection.execute(CambioCita, [HoraIncio,FinCita,idCita]);
    connection.end();
  }catch(error){
    console.error("Ha ocurrido un error actualizando la cita: ", error);
    return "Ha ocurrido un error.";
  }
}


async function NuevaCita(
  idPaciente,
  idSucursal,
  idProcedimineto,
  idDoctor,
  idAsociado,
  HoraCita,
  FinCita
) {}

async function Busqueda(Nombre, Apellidos, Telefono_Correo) {}

//==================================================================================================
// Updates estados Pacientes / Citas
//==================================================================================================

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

// Test de Encriptación de Contraseña
// app.post("/login", async (req, res) => {
//   const user = req.body.user;
//   const password = req.body.password;
//   if (user === "admin" && password === "admin") {
//     let encriptacion = await bcrypt.hash(password, 10);
//     res.json({
//       message: "success",
//       password: encriptacion,
//     });
//   } else {
//     res.json({
//       message: "error",
//     });
//   }
// });

// app.get("/compare", async (req, res) => {
//   let hashguardado =
//     "$2a$10$imQ4bXRuqdmlCpRIV8yf.ezDoN7RBh6Sndb3/CNFtoDIsyHLPYLym";
//   let comparacion = bcrypt.compareSync("adm in", hashguardado);

//   if (comparacion) {
//     res.json({
//       message: "success",
//       comparacion: comparacion,
//     });
//   } else {
//     res.json({
//       message: "error",
//       comparacion: comparacion,
//     });
//   }
// });

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
};
