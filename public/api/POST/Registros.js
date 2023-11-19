import express from "express";
const router = express.Router();
import { promises as fs, constants } from "fs";
import multer from "multer";
import sharp from "sharp";
import path from "path";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// console.log("Ruta de Registros.js: ", __dirname);
// Ahora vamos a recortar la ruta hasta '/public/'
const pathToPublic = __dirname.split("/public/")[0] + "/public/";

// console.log("Ruta hasta /public/: ", pathToPublic);
// ==================================================================================================
// Importacion de API's
// ==================================================================================================
// Autentificacion y Usuarios
import * as API_Auth from "../SQL/Aut&Usuarios.js";
// Registros
import * as API_Registros from "../SQL/Registros.js";
// Informacion de Pacientes
import * as API_Pacientes from "../SQL/Pacientes.js";

// ==================================================================================================
// Rutas Post
// ==================================================================================================
// Ruta para obtener las opciones de cualqueir tipo de registro
router.post("/InfoRegistros", async (req, res) => {
  const resultado = await API_Registros.InfoRegistros();
  res.end(JSON.stringify(resultado));
});

// Ruta para cerrar sesion
router.get("/logout", function (peticion, respuesta) {
  API_Auth.logout(peticion.session.idusuario);
  peticion.session.destroy(function (error) {
    if (error) {
      console.log(error);
    } else {
      respuesta.redirect("/");
    }
  });
});

// Actualziamos la informacion del Expediente del paciente
router.post("/ActualizarAntecedentesPaciente", async (req, res) => {
  // Actualizamos la informacion del paciente
  API_Registros.ActualizarAntecedentesPaciente(
    req.session.idInfoUsuario,
    req.body.Propiedad,
    req.body.Valor
  );
  return res
    .status(200)
    .json({ mensaje: "Antecedente actualizado exitosamente" });
});

// Actualizamos la informacion personal
router.post("/ActualizarInfoPersonal", async (req, res) => {
  // En caso de que se vaya a cambiar el nombre del paciente,
  // se ejecuta un ciclo para actualizar el nombre y apellido
  // ya que se encuientra en columbnas diferentes
  if (req.body.CambiosNombre) {
    req.body.CambiosNombre.forEach((element) => {
      API_Registros.ActualizarDatosGenerales(
        req.session.idInfoUsuario,
        element.Propiedad,
        element.Valor,
        element.TipoUser
      );
    });
    //En caso de que se actualice cualquier otro valor, se ejecuta la funcion normal
  } else {
    API_Registros.ActualizarDatosGenerales(
      req.session.idInfoUsuario,
      req.body.Propiedad,
      req.body.Valor,
      req.body.TipoUser
    );
  }
  return res
    .status(200)
    .json({ mensaje: "Informacion Personal actualizada exitosamente" });
});

// Actualizamos la informacion personal
router.post("/ActualizarStatus", async (req, res) => {
  API_Registros.ActualizarStatus(
    req.body.TipoUser,
    req.session.idInfoUsuario,
    req.body.Valor
  );
  return res.status(200).json({ mensaje: "Status actualizado exitosamente" });
});

// Reinicio de la contraseña al nombre de usuario
router.post("/PassRestart", async (req, res) => {
  API_Auth.PassRestart(req.body.usuario);
  console.log("Contraseña Reiniciada con exito.");
  return res.status(200).json({ mensaje: "Contaseña reiniciada exitosamente" });
});

// Informacion del paciente del sistema
router.post("/InfoPaciente", async function (peticion, respuesta) {
  if (peticion.session.idusuario) {
    // Ejecutamos el query para obtener los datos del paciente
    const DataPaciente = await API_Pacientes.InfoPaciente(
      peticion.session.idInfoUsuario
    );
    // Y damos el output en json
    respuesta.end(JSON.stringify(DataPaciente));
  } else {
    respuesta.redirect("/");
  }
});

// Busqueda de pacientes
router.post("/BusquedaPacientes", async function (req, res) {
  if (req.session.idusuario) {
    const resBusqueda = await API_Registros.Busqueda(
      req.body.nombre,
      req.body.apellido,
      req.body.telefono_correo
    );
    res.end(JSON.stringify(resBusqueda));
  } else {
    res.redirect("/");
  }
});

//==================================================================================================
//  Funciones para crear una carpeta personal para cada usuario
//  y subir imagenes a la carpeta
//==================================================================================================
//Variable para el almacenamiento de imagenes con multer
const almacenamiento = multer.diskStorage({
  destination: async (req, file, cb) => {
    try {
      //Creamos la carpeta del paciente
      const rutaDestino = path.join(pathToPublic, "/private/src/temp");
      // Y utilizamos la ruta donde se creó la carpeta
      cb(null, rutaDestino);
    } catch (error) {
      cb(error);
    }
  },
  filename: (req, file, cb) => {
    const extension = path.extname(file.originalname);
    const nombreArchivo = `${req.body.Nombres}${extension}`;
    cb(null, nombreArchivo);
  },
});

// Aqui está la configuracion del Resaizer (para los diferentes tamaños)
const Resizer = (Archivo, Ruta, porcentaje) => {
  return sharp(Archivo)
    .resize(porcentaje)
    .toFile(Ruta, (err, info) => {
      if (err) {
        console.log(err);
      }
    });
};

const subirfoto = multer({ storage: almacenamiento });

// Funcion de apoyo para la creacion de pacientes
async function CrearPaciente(req, res) {
  try {
    // Si el usuario es doctor, le pasamos el id del doctor, si no, le pasamos el id del recepcionista
    const idDoctor = req.session.EsDoctor ? req.session.idDoctor : null;
    const idTipoDeUsuario = req.session.EsDoctor
      ? null
      : req.session.idTipoDeUsuario;

    // Llamar a la función NuevoPaciente y proporcionar la ruta de la imagen si existe
    const idUsuario = await API_Pacientes.NuevoPaciente(
      req.body.Nombres,
      req.body.ApellidoP,
      req.body.ApellidoM,
      req.body.idSexo,
      req.body.Correo,
      req.body.Telefono,
      req.body.TelefonoSecundario,
      req.body.FechaNacimiento,
      idDoctor,
      idTipoDeUsuario
    );
    console.log("idUsuario insertado: ", idUsuario);

    // Crear la carpeta del paciente
    const Ruta = await CarpetaPersonal(req.body.Protocolo, idUsuario);

    // Mover la imagen a la carpeta del paciente
    await fs.rename(
      path.join(pathToPublic, "/private/src/temp", req.file.filename),
      path.join(Ruta, req.file.filename)
    );

    // Si el protocolo es "Perfil", crear la miniatura de la imagen y moverla a la carpeta del paciente
    if (req.body.Protocolo === "Perfil") {
      const rutaImagenOriginal = path.join(Ruta, req.file.filename);
      const rutaMiniatura = path.join(Ruta, `Pequeño-${req.file.filename}`);

      // Llamar a la función Resizer para redimensionar la imagen
      Resizer(rutaImagenOriginal, rutaMiniatura, 50);
      // Y guardar la ruta de la imagen en la base de datos
      API_Registros.InsertRutaFoto(idUsuario, rutaImagenOriginal);
    } else {
      const rutaImagenOriginal = path.join(Ruta, req.file.filename);
      const rutaMiniatura = path.join(Ruta, `Preview-${req.file.filename}`);

      // Llamar a la función Resizer para redimensionar la imagen
      Resizer(rutaImagenOriginal, rutaMiniatura, 100);
      // Y guardar la ruta de la imagen en la base de datos
      API_Registros.InsertRutaFoto(idUsuario, rutaImagenOriginal);
    }

    return res
      .status(200)
      .json({ mensaje: "Nuevo paciente creado exitosamente" });
  } catch (error) {
    console.error("Error en la creación de paciente:", error);
    return res
      .status(500)
      .json({ mensaje: "Ha ocurrido un error en la creación de paciente" });
  }
}

// Ruta para la creacion de pacientes
router.post("/CrearPaciente", subirfoto.single("file"), CrearPaciente);

// Funcion para la creacion de carpetas de usuarios
async function crearCarpeta(Ruta, Protocolo, id) {
  try {
    await fs.mkdir(Ruta, { recursive: true });
    CarpetaPersonal(Protocolo, id);
  } catch (error) {
    console.error("Error al crear la carpeta:", error);
  }
}

// Funcion de adminisrtacion de carpetas personales (historial y perfil)
async function CarpetaPersonal(Protocolo, id) {
  //Verifica que existan los argumentos
  if (!Protocolo || !id) {
    console.log("Faltan argumentos para construir la ruta.");
    throw new Error(
      "Faltan argumentos para construir la ruta.",
      " Protocolo: ",
      Protocolo,
      " id: ",
      id
    );
  }
  //Genera la ruta de la carpeta
  const Ruta = path.join(
    pathToPublic,
    "/private/src/img",
    Protocolo,
    id.toString()
  );

  //Verifica que el protocolo sea valido
  if (Protocolo == "Perfil" || Protocolo == "Historial") {
    //Verifica que la carpeta exista
    try {
      await fs.access(Ruta, constants.F_OK);
      console.log("La carpeta del usuario ", id, " se creó o ya existe.");
      return Ruta;
    } catch (error) {
      // Si no existe, la crea
      await crearCarpeta(Ruta, Protocolo, id);
      return Ruta;
    }
  } else {
    console.log("El protocolo no es valido.");
    throw new Error("El protocolo no es valido.");
  }
}

router.post("/NuevoPadecimiento", async (req, res) => {
  const idPadecimiento = await API_Registros.NuevoPadecimiento(
    req.body.idArea,
    req.body.Padecimiento
  );
  return res.status(200).json({ idPadecimiento: idPadecimiento });
});

router.post("/Buscar_Padecimiento", async (req, res) => {
  const resBusqueda = await API_Registros.Buscar_Padecimiento(
    req.body.Padecimiento
  );
  res.end(JSON.stringify(resBusqueda));
});

router.post("/GuardarDiagnosticos", async (req, res) => {
  // Para cada una de las instrucciones, ejecutar la funcion correspondiente
  req.body.cambios.forEach((element) => {
    switch (element.action) {
      // En caso de añadir un padecimiento
      case "Añadir":
        API_Registros.Añadir_Padecimiento(
          element.idPadecimiento,
          element.idSesion
        );
        break;  
      // En caso de eliminar un padecimiento
      case "Eliminar":
        API_Registros.Quitar_Padecimiento(
          element.idPadecimiento,
          element.idSesion
        );
        break;
      // En caso de no tener una entrada valida
      default:
        console.log("No se ha encontrado la accion");
        break;
    }
  });
});

export default router;
