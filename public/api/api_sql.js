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
      const consulta = `SELECT * FROM ${tabla} WHERE Usuario = ? AND Contraseña = ?`;
      const [rows, fields] = await connection.execute(consulta, [
        usuario,
        contrasena,
      ]);
      // si se obrtiene un resultado
      if (rows.length > 0) {
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
    var EsDoctor = false;
    if (rowsDoc.length > 0) {
      var EsDoctor = true;
    }
    if (rows.length > 0) {
      connection.end();
      // Visualizar array Obtenido de la tabla de Usuarios
      // console.log(rows);
      const InfoUsuario = {
        Nombre: rows[0].Nombres,
        ApellidoP: rows[0].ApellidoP,
        ApellidoM: rows[0].ApellidoM,
        EsDoctor: EsDoctor,
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
        DATE_FORMAT(c.HoraLlegada, '%H:%i') AS HoraLlegada, c.idStatusPaciente
        FROM Citas c
        INNER JOIN Citas_Paciente cp ON c.idCitas = cp.idCitas 
        INNER JOIN Paciente p ON cp.idPaciente = p.idPaciente 
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
    const consultaHoy = `SELECT p.idPaciente, u.Nombres, CONCAT(u.ApellidoP, ' ', u.ApellidoM) AS Apellidos, DATE_FORMAT(c.HoraCita, '%H:%i') AS HoraCita
        FROM Citas c
        INNER JOIN Citas_Paciente cp ON c.idCitas = cp.idCitas 
        INNER JOIN Paciente p ON cp.idPaciente = p.idPaciente 
        INNER JOIN Usuarios u ON p.idUsuario = u.idUsuario 
        WHERE c.idDoctor = ? AND c.idStatusPaciente = 1 AND DATE(c.HoraCita) = ? AND c.idEstadoCita = 1
        ORDER BY c.HoraCita ASC;`;

    const [rowsHoy, fieldsHoy] = await connection.execute(consultaHoy, [idDoctor,Fecha,]);

    if (rowsHoy.length > 0) {
      CitasHoy = rowsHoy.map((elemento) => {
        return {
          idPaciente: elemento.idPaciente,
          NombresPacientes: elemento.Nombres,
          ApellidosPacientes: elemento.Apellidos,
          HoraCita: elemento.HoraCita,
        };
      });
    }

    connection.end();
  } catch (error) {
    console.error("Ha ocurrido un error en la consulta de citas del día:",error);
    return "Ha ocurrido un error.";
  }



  //==================================================================================================
  // Otros consultorios
  try {
    const connection = await mysql.createConnection(db);
    const consultaOtrosConsultorios = `SELECT p.idPaciente,
    CONCAT(up.Nombres, ' ', up.ApellidoP, ' ', up.ApellidoM) AS NombrePaciente,
    CONCAT(ud.Nombres) AS NombreDoctor,
    DATE_FORMAT(c.HoraCita, '%H:%i') AS HoraCita,
    DATE_FORMAT(c.HoraLlegada, '%H:%i') AS HoraLlegada,
    c.idStatusPaciente, s.idConsultorio 
    FROM Citas c
    INNER JOIN Citas_Paciente cp ON c.idCitas = cp.idCitas
    INNER JOIN Paciente p ON cp.idPaciente = p.idPaciente
    INNER JOIN Usuarios up ON p.idUsuario = up.idUsuario 
    INNER JOIN Doctor d ON c.idDoctor = d.idDoctor
    INNER JOIN Usuarios ud ON d.idUsuario = ud.idUsuario
    LEFT JOIN Sesion s ON c.idCitas  = s.idCitas 
    WHERE c.idDoctor != ?
    AND c.idStatusPaciente = 2 OR c.idStatusPaciente = 3 
    ORDER BY c.HoraLlegada ASC;`;

    const [rowsOtros, fieldsEspera] = await connection.execute(consultaOtrosConsultorios,[idDoctor]);
    console.log(rowsOtros);
    if (rowsOtros.length > 0) {
      OtrosConsultorios = rowsOtros.map((elemento) => {
          return {
            idPaciente: elemento.idPaciente,
            NombresPacientes: elemento.Nombres,
            ApellidosPacientes: elemento.Apellidos,
            HoraCita: elemento.HoraCita,
            HoraLlegada: elemento.HoraLlegada,
            StatusPaciente: elemento.idStatusPaciente,
          };
        });
      connection.end();
    }



  } catch (error) {
    console.error("Ha ocurrido un error en la consulta de otros consultorios:",error);
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
async function DashRecepcion(Fecha) {
  let PacientesEsperaR = [];
  let CitasDoctoresHoy = [];
  let OtrosConsultoriosR = [];
  let CitasFinalizadasR = [];
  try {
    //==================================================================================================
    // Citas del dia
    const connection = await mysql.createConnection(db);
    const consultaHoy = `SELECT c.idCitas, p.idPaciente, idDoctor, u.Nombres, CONCAT(u.ApellidoP, ' ', u.ApellidoM) AS Apellidos, DATE_FORMAT(c.HoraCita, '%H:%i') AS HoraCita
    FROM Citas c
    INNER JOIN Citas_Paciente cp ON c.idCitas = cp.idCitas 
    INNER JOIN Paciente p ON cp.idPaciente = p.idPaciente 
    INNER JOIN Usuarios u ON p.idUsuario = u.idUsuario 
    WHERE c.idStatusPaciente = 1 AND DATE(c.HoraCita) = ? 
    ORDER BY c.HoraCita ASC;`;

    const [rowsHoy, fieldsHoy] = await connection.execute(consultaHoy, [Fecha]);

    if (rowsHoy.length > 0) {
      CitasDoctoresHoy = rowsHoy.map((elemento) => {
        return {
          idCitas: elemento.idCitas,
          idPaciente: elemento.idPaciente,
          idDoctor: elemento.idDoctor,
          NombresPacientes: elemento.Nombres,
          ApellidosPacientes: elemento.Apellidos,
          HoraCita: elemento.HoraCita,
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
    const consultaHoy = `SELECT c.idCitas, p.idPaciente, idDoctor, u.Nombres, CONCAT(u.ApellidoP, ' ', u.ApellidoM) AS Apellidos, DATE_FORMAT(c.HoraCita, '%H:%i') AS HoraCita, DATE_FORMAT(c.HoraLlegada, '%H:%i') AS HoraLlegada
  FROM Citas c
  INNER JOIN Citas_Paciente cp ON c.idCitas = cp.idCitas 
  INNER JOIN Paciente p ON cp.idPaciente = p.idPaciente 
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

async function NuevoPaciente(Nombres,ApellidoP,ApellidoM,idSexo,Correo,Telefono,TelefonoSecundario,FechaNacimiento,RutaFoto) {
  try{
    const connection = await mysql.createConnection(db);
    const NuevoPaciente = `INSERT INTO Usuarios
    (Nombres, ApellidoP, ApellidoM, idSexo, Correo, Telefono, TelefonoSecundario, FechadeNacimiento, FechaAlta, RutaFoto)
    VALUES(?, ?, ?, ?, ?, ?, ?, ?, CURDATE(), ?);

    SET @last_user_id = LAST_INSERT_ID();

    INSERT INTO Paciente
    (idUsuario, Usuario, Contraseña)
    VALUES(@last_user_id, ?, ?);
    `;
    const usuario = Nombres + ApellidoP + ApellidoM;
    const [rowsEspera, fieldsHoy] = await connection.execute(NuevoPaciente, [Nombres,ApellidoP,ApellidoM,idSexo,Correo,Telefono,TelefonoSecundario,FechaNacimiento,RutaFoto]);


  }catch (error) {
    console.error("Ha ocurrido un error en la creacion de un nuevo paciente:",error);
    return "Ha ocurrido un error.";
  }

}

async function NuevaCita(idPaciente,idSucursal,idProcedimineto,idDoctor,idAsociado,HoraCita,FinCita) {


}

async function Busqueda(idPaciente,idSucursal,idProcedimineto,idDoctor,idAsociado,HoraCita,FinCita) {


}





//==================================================================================================
// Updates estados Pacientes / Citas
//==================================================================================================

async function Hoy_Espera(idCita, idStatusPaciente,HoraLlegada) {
  try {
    const connection = await mysql.createConnection(db);
    idStatusPaciente = idStatusPaciente + 1;
    const consulta = `UPDATE Citas SET idStatusPaciente = ?, HoraLlegada = CONCAT(CURDATE()," ", ?) WHERE idCitas = ?;`;
    connection.execute(consulta, [idStatusPaciente,HoraLlegada,idCita]);
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

export { VerificarUsuario, UsuarioyProfesion, DashDoc, DashRecepcion,Hoy_Espera};
