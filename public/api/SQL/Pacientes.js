import { mysql, bcrypt, db } from "../conf_api.js";

//==================================================================================================
// Funcion para obtener la informacion de los pacientes
//==================================================================================================
export async function InfoPaciente(idPaciente) {
  // Llenamos los datos con valores por defecto
  let BasicInfo = [];
  let Antecedentes = [];
  let DatosDT = [];
  let Recetas = [];
  let HistorialFotografico = [];
  let Diagnosticos = [];
  let SesionesActivas = [];

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
    const queryAntecedentes = `SELECT 
      hc.A_HF AS Antecedentes_HF, hc.A_NP AS Antecedentes_NP, hc.A_PP AS Antecedentes_PP, hc.Alergias AS Alergias 
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
      SELECT rp.idSesion, mr.idMedicamento_Receta ,mr.idReceta_Pacientes,mr.idMedicamento ,u.Nombres as Doctor,
      m.Medicamento, m.Indicacion, Fecha, Nota, mr.Orden
      FROM Receta_Pacientes rp
      LEFT JOIN Medicamento_Receta mr ON mr.idReceta_Pacientes = rp.idReceta_Pacientes
      LEFT JOIN Medicamento m ON m.idMedicamento = mr.idMedicamento
      LEFT JOIN Doctor d ON d.idDoctor = rp.idDoctor
      LEFT JOIN Usuarios u ON u.idUsuario = d.idUsuario
      WHERE rp.idPaciente = ?
      ORDER BY Fecha DESC, mr.Orden ASC  
      `;
    const [rowRecetas, fieldsAntecedentes] = await connection.execute(
      queryRecetas,
      [idPaciente]
    );
    connection.end();
    if (rowRecetas.length > 0) {
      Recetas = rowRecetas.map((elemento) => {
        return {
          idSesion: elemento.idSesion,
          idMedicamento_Receta: elemento.idMedicamento_Receta,
          idMedicamento: elemento.idMedicamento,
          idReceta: elemento.idReceta_Pacientes,
          Doctor: elemento.Doctor,
          Medicamento: elemento.Medicamento,
          Indicacion: elemento.Indicacion,
          Fecha: elemento.Fecha,
          Nota: elemento.Nota,
          Orden: elemento.Orden,
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
  // Diagnosticos del paciente
  try {
    const connection = await mysql.createConnection(db);
    const queryDiagnosticos = `SELECT s.idSesion, p.idPadecimiento, p.Padecimiento, s.InicioDeSesion, u.Nombres AS Doctor, s2.Seguimiento
    FROM Sesion s 
    LEFT JOIN Doctor d ON s.idDoctor = d.idDoctor 
    LEFT JOIN Usuarios u ON d.idUsuario = u.idUsuario 
    LEFT JOIN Seguimientos_Sesion ss ON s.idSesion = ss.idSesion
    LEFT JOIN Seguimientos s2 ON ss.idSeguimientos = s2.idSeguimientos
    LEFT JOIN Padecimientos p ON s2.idPadecimiento = p.idPadecimiento
    WHERE idPaciente = ? AND s.FinDeSesion IS NOT NULL
    ORDER BY s.idSesion DESC, p.idPadecimiento ASC;`;

    const [rowDiagnosticos, fieldsAntecedentes] = await connection.execute(
      queryDiagnosticos,
      [idPaciente]
    );
    connection.end();
    if (rowDiagnosticos.length > 0) {
      Diagnosticos = rowDiagnosticos.map((elemento) => {
        return {
          idSesion: elemento.idSesion,
          idPadecimiento: elemento.idPadecimiento,
          Padecimiento: elemento.Padecimiento,
          Fecha: elemento.InicioDeSesion,
          Doctor: elemento.Doctor,
          Diagnostico: elemento.Seguimiento,
        };
      });
    }
  } catch (error) {
    console.error(
      "Ha ocurrido un error obteniendo los diagnosticos del paciente: ",
      error
    );
    return "Ha ocurrido un error.";
  }

  // =================================================
  // Sesiones Activas del paciente
  try {
    const connection = await mysql.createConnection(db);
    const querySesionesActivas = ` SELECT S.idSesion, s.idCitas ,s.idDoctor, s.idAsociado, p.idPadecimiento, p.Padecimiento, InicioDeSesion, s2.Seguimiento, c.Nota
    FROM Sesion s 
    LEFT JOIN Citas c ON c.idCitas = s.idCitas
    LEFT JOIN Seguimientos_Sesion ss ON s.idSesion = ss.idSesion
    LEFT JOIN Seguimientos s2 ON ss.idSeguimientos = s2.idSeguimientos
    LEFT JOIN Padecimientos p ON s2.idPadecimiento = p.idPadecimiento
    WHERE s.idPaciente = ? AND (s2.Seguimiento IS NULL OR s.FinDeSesion IS NULL)
    ORDER BY s.idSesion ASC;`;

    const [rowSesiones_A, fieldsAntecedentes] = await connection.execute(
      querySesionesActivas,
      [idPaciente]
    );
    connection.end();
    if (rowSesiones_A.length > 0) {
      SesionesActivas = rowSesiones_A.map((elemento) => {
        return {
          idSesion: elemento.idSesion,
          idCita: elemento.idCitas,
          idDoctor: elemento.idDoctor,
          idAsociado: elemento.idAsociado,
          idPadecimiento: elemento.idPadecimiento,
          Padecimiento: elemento.Padecimiento,
          InicioSesion: elemento.InicioDeSesion,
          Seguimiento: elemento.Seguimiento,
          Nota: elemento.Nota,
        };
      });
    }
  } catch (error) {
    console.error(
      "Ha ocurrido un error obteniendo las sesiones activas del paciente: ",
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
    Seguimientos: Diagnosticos,
    SesionesActivas: SesionesActivas,
  };

  return InfoPaciente;
}

export async function NuevoPaciente(
  Nombres,
  ApellidoP,
  ApellidoM,
  idSexo,
  Correo,
  Telefono,
  TelefonoSecundario,
  FechaNacimiento,
  idDoctor,
  idRecepcionista
) {
  let connection;
  try {
    connection = await mysql.createConnection(db);
    await connection.beginTransaction();

    // Almacenamos los Querys en variables para ejecutarlas despues
    const queryUsuario = `INSERT INTO Usuarios
      (Nombres, ApellidoP, ApellidoM, idSexo, Correo, Telefono, TelefonoSecundario, FechadeNacimiento, FechaAlta)
      VALUES(?, ?, ?, ?, ?, ?, ?, ?, NOW())`;

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
    const [resultUsuario] = await connection.execute(queryUsuario, [
      Nombres,
      ApellidoP,
      ApellidoM,
      idSexo,
      Correo,
      Telefono,
      TelefonoSecundario,
      FechaNacimiento,
    ]);

    // Utilizamos el ID insertado en la primera consulta para la segunda consulta
    const [resultPaciente] = await connection.execute(queryPaciente, [
      usuario,
      password,
    ]);

    // Y registramos quien hizo el registro del paciente
    await connection.execute(queryRegistro, [idDoctor, idRecepcionista]);

    // Así como le creamos un expediente vacío
    await connection.execute(queryAntecedentes, [resultPaciente.insertId]);

    await connection.commit();
    connection.end();

    // Retorna el ID del usuario insertado en la tabla Usuarios
    return resultUsuario.insertId;
  } catch (error) {
    console.error(
      "Ha ocurrido un error en la creación de un nuevo paciente:",
      error
    );
    if (connection) {
      connection.rollback();
      connection.end();
    }
    return "Ha ocurrido un error.";
  }
}
