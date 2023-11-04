import { mysql, bcrypt, db } from "../conf_api.js";

//==================================================================================================
// Función para verificar el usuario y contraseña en varias tablas
//==================================================================================================
export async function VerificarUsuario(usuario, contrasena) {
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
export async function UsuarioyProfesion(idUsuario) {
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

export async function logout(idUsuario) {
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

// Cambia la contraseña de los pacientes
export async function CambiarContraseñaPaciente(idPaciente, NuevaContraseña) {
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
export async function CambiarContraseña(Usuario, NuevaContraseña) {}

// Reinicia la contraseña por el nombre de usuario
export async function PassRestart(Usuario) {
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

