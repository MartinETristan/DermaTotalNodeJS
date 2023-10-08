//==================================================================================================
// Importaciones de modulos y librerias
//==================================================================================================
import express from "express";
import { config } from "dotenv";
import session from "express-session";
import http from "http";
import { Server } from "socket.io";
import { promises as fs, constants } from "fs";
import multer from "multer";
import sharp from "sharp";

// Importacion de API's
import {
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
  InsertRutaFoto,
  PedirPaciente,
} from "./public/api/api_sql.js";
import { Copyright, Saludo, FechaHora } from "./public/api/api_timemachine.js";

//==================================================================================================
// Configuracion del Sitio Web
//==================================================================================================
//Arreglo de __dirname y __filename
import path from "path";
import { fileURLToPath } from "url";
import e from "express";
import { info } from "console";
import { render } from "ejs";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ejjecucion de dotenv
config();
const app = express();
const web = http.createServer(app);
const io = new Server(web);

// En caso de que el puerto local no exista, se usará el puerto de testeo
const puerto =
  process.env.PUERTO_NODE_LOCAL || process.env.PUERTO_NODE_LOCALTEST;

web.listen(puerto, function () {
  console.log("Servidor iniciado en el puerto " + puerto);
});

// Definimos el middleware para poder recibir datos en formato JSON
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Y el middleware para las sesiones
const sessionMiddleware = session({
  secret: "secret",
  resave: true,
  saveUninitialized: true,
  cookie: {
    // Caducidad de 12 horas de la cookie o "Sesión" en milisegundos
    maxAge: 43200000,
  },
});

app.use(sessionMiddleware);

// Definimos el motor de plantillas
app.set("view engine", "ejs");

// Añadimos la carpeta public para los archivos estáticos
app.use(express.static("public"));

//Configuracion Express-session-socket.io
io.engine.use(sessionMiddleware);

// //Aumentamos el limite del servidor
// app.use(express.json({limit: '50mb'}));
// app.use(express.urlencoded({limit: '50mb', extended: true, parameterLimit: 50000}));

//==================================================================================================
// WebSockets
//==================================================================================================
io.on("connection", (socket) => {
  console.log("Usuario conectado");
  // Asignamos un canal de comunicacion para cada tipo de usuario
  switch (socket.request.session.idClaseUsuario) {
    case 1:
    case 2:
    case 3:
      var RoomDoctor = "Doctor" + socket.request.session.idTipoDeUsuario;
      socket.join(RoomDoctor);
      break;
    case 4:
    case 5:
      var RoomRecepcion = "Recepcion";
      socket.join(RoomRecepcion);
      break;
    case 6:
      var RoomAsociado = "Asociado" + socket.request.session.idTipoDeUsuario;
      socket.join(RoomAsociado);
      break;
    default:
      var RoomPaciente = "Paciente" + socket.request.session.idTipoDeUsuario;
      socket.join(RoomPaciente);
      break;
  }

  // Cambios realizados en el dashboard por recepcionistas
  socket.on("CambioEstadoPaciente", (data) => {
    switch (data.idStatus) {
      case 1:
        //Registrar hora de llegada con base a la hora del recepcionista
        if (socket.request.session.Sucursal == 1) {
          Hoy_Espera(data.Cita,FechaHora().HoraS1);
        } else {
          Hoy_Espera(data.Cita,FechaHora().HoraS2);
        }
        io.to("Doctor" + data.Doctor).emit("Hoy/Espera");
        socket.except("Doctor" + data.Doctor).emit("OtrosConsultorios");
        io.to("Recepcion").emit("CheckIn");
        break;
      case 2:
        io.emit("Espera/Consulta");
        break;
      case 3:
        io.emit("Consulta/CheckOut");
        break;
      default:
        break;
    }
  });
// Socket para pedir paciente en recepcion
socket.on("PedirPaciente", async (data) => {
  const pedir = await PedirPaciente(data.Cita, socket.request.session.idDoctor, data.idConsultorio);
  if (pedir === "Sonido") {
    io.to("Recepcion").emit("Sonido");
  }
  else{
    io.to("Recepcion").emit("P_Pedidos");
  }
});

  // const rooms = io.sockets.adapter.rooms;
  // // Con esto vemos las salasdisponibles a donde se mandarán los mensajes
  // console.log('Lista de salas:', rooms);

  socket.on("disconnect", () => {
    console.log("Socket desconectado");
  });
});

//==================================================================================================
//  TESTING
//==================================================================================================

app.use((req, res, next) => {
  const agent = req.headers["user-agent"];
  if (
    agent.indexOf("Safari") > -1 &&
    agent.indexOf("Chrome") === -1 &&
    agent.indexOf("OPR") === -1
  ) {
    res.header("Cache-Control", "no-cache, no-store, must-revalidate");
    res.header("Pragma", "no-cache");
    res.header("Expires", "0");
    console.log("Safari");
  }
  next();
});

//==================================================================================================
//  Logica del Sitio Web (Backend)
//==================================================================================================
// Ruta de autenticación de usuario
app.post("/login", async (req, res) => {
  const { usuario, contrasena } = req.body;

  if (!usuario || !contrasena) {
    res.send("Falta llenar algún campo.");
  } else {
    const resultado = await VerificarUsuario(usuario, contrasena);
    // Visualizar array Obtenido en la tabla donde se inicia sesion
    // console.log(resultado);
    if (resultado.verificacion === "ReadyUser") {
      // Guargamos la info del tipo de usuario en la sesión
      req.session.idusuario = resultado.idUsuario;
      req.session.idTipoDeUsuario = resultado.idTipoDeUsuario;
      req.session.idClaseUsuario = resultado.TipoUsuario;
      req.session.estiloweb = resultado.WebStyle;
      req.session.rol = resultado.rol;
      //En caso de tener sucursal, la guardamos en la sesión
      req.session.Sucursal = resultado.Sucursal;
      // Test de sesiones o recargas de la pagina
      // req.session.visitas = req.session.visitas ? ++req.session.visitas : 1;
      // console.log(req.session);
      // Y buscamos su información en la base de datos, asi como si es o no doctor
      const InfoUsuario = await UsuarioyProfesion(resultado.idUsuario);
      req.session.Nombres = InfoUsuario.Nombre;
      req.session.EsDoctor = InfoUsuario.EsDoctor;
      req.session.idDoctor = InfoUsuario.idDoctor;
      // console.log(InfoUsuario);
      res.send("ReadyUser");
    } else {
      res.send("Usuario y/o contraseña incorrectos.");
    }
  }
});

// Ruta para cerrar sesión
app.get("/logout", function (peticion, respuesta) {
  logout(peticion.session.idusuario);
  peticion.session.destroy(function (error) {
    if (error) {
      console.log(error);
    } else {
      respuesta.redirect("/");
    }
  });
});

app.post("/InfoSesion", function (peticion, respuesta) {
  const DatosSistema = {
    // ID del usuario en la TABLA USUARIOS
    idUsuario: peticion.session.idusuario,
    // Clase de usuario en Numero
    ClaseUsuario: peticion.session.idClaseUsuario,
    // ID de la TABLA de donde es el usuario
    ID: peticion.session.idTipoDeUsuario,
    //En caso de tener sucursal, la guardamos en la sesión
    Sucursal: peticion.session.Sucursal,
    // Mandamos si es doctor o no
    EsDoctor: peticion.session.EsDoctor,
    // Estilo de la web
    EstiloWeb: peticion.session.estiloweb,
    // Nombre del usuario
    Nombre: peticion.session.Nombres,
    // Rol del usuario en TEXTO
    TipUser: peticion.session.rol,
  };
  respuesta.end(JSON.stringify(DatosSistema));
});

// Ruta para obtener los datos de la Compañia/CopyRight
app.post("/DatosSistema", function (peticion, respuesta) {
  const DatosSistema = {
    Saludo: Saludo(),
    Copy: Copyright().Copyright,
    Empresa: Copyright().NombreEmpresa,
    Año: FechaHora().Año,
    Ver: Copyright().Version,
  };
  respuesta.end(JSON.stringify(DatosSistema));
});

// Ruta para obtener las opciones de cualqueir tipo de registro
app.post("/InfoRegistros", async (req, res) => {
  const resultado = await InfoRegistros();
  res.end(JSON.stringify(resultado));
});

// Ruta para obtener los datos del Dashboard para los Doctores
app.post("/DashboardDoc", async (peticion, respuesta) => {
  if (peticion.session.idusuario) {
    if (peticion.session.EsDoctor) {
      const PacientesEspera = await DashDoc(
        peticion.session.idDoctor,
        FechaHora().FormatoDia
      );
      respuesta.end(JSON.stringify(PacientesEspera));
    } else {
      const PacientesEspera = {
        PacientesEspera: [],
        CitasHoy: [],
        OtrosConsultorios: [],
        CitasFinalizadas: [],
      };
      respuesta.end(JSON.stringify(PacientesEspera));
    }
  } else {
    respuesta.redirect("/");
  }
});

// Ruta para obtener los datos del Dashboard para los recepcionistas
app.post("/DashboardRecepcion", async (peticion, respuesta) => {
  if (peticion.session.idusuario) {
    const PacientesEspera = await DashRecepcion(
      peticion.session.Sucursal,
      FechaHora().FormatoDia
    );
    respuesta.end(JSON.stringify(PacientesEspera));
  } else {
    respuesta.redirect("/");
  }
});

app.post("/AgendaDoctor", async (peticion, respuesta) => {
  if (peticion.session.idusuario) {
    if (peticion.session.EsDoctor) {
      const Agenda = await CitasDoctor(peticion.session.idDoctor);
      respuesta.end(JSON.stringify(Agenda));
    } else {
      const Agenda = [];
      respuesta.end(JSON.stringify(Agenda));
    }
  } else {
    respuesta.redirect("/");
  }
});

app.post("/CrearCita", async (req, res) => {
  if (peticion.session.idusuario) {
    // Lanzamos la creacion de la cita a la base de datos
    await NuevaCita(
      req.body.idSucursal, 
      req.body.idProcedimiento, 
      req.body.idDoctor, 
      req.body.idAsociado, 
      req.body.idPaciente, 
      req.body.idStatus,
      req.body.FechaCita,
      req.body.DuracionCita,
      req.body.NotasCita,
      );
  } else {
    respuesta.redirect("/");
  }
});

app.post("/ActualizarCita", async (req, res) => {
  // Lanzamos la actualizacion de la cita a la base de datos
  ModificacionCita(req.body.idCita, req.body.HoraCita, req.body.FinCita);
  return res.status(200).json({ mensaje: "Cita actualizada exitosamente" });
});

// Actualziamos la informacion del Expediente del paciente
app.post("/ActualizarAntecedentesPaciente", async (req, res) => {
  // Actualizamos la informacion del paciente
  ActualizarAntecedentesPaciente(
    req.session.idInfoUsuario,
    req.body.Propiedad,
    req.body.Valor
  );
  return res
    .status(200)
    .json({ mensaje: "Antecedente actualizado exitosamente" });
});

// Actualizamos la informacion personal
app.post("/ActualizarInfoPersonal", async (req, res) => {
  ActualizarDatosGenerales(
    req.session.idInfoUsuario,
    req.body.Propiedad,
    req.body.Valor,
    req.body.TipoUser
  );
  return res
    .status(200)
    .json({ mensaje: "Informacion Personal actualizada exitosamente" });
});

// Actualizamos la informacion personal
app.post("/ActualizarStatus", async (req, res) => {
  ActualizarStatus(
    req.body.TipoUser,
    req.session.idInfoUsuario,
    req.body.Valor
  );
  return res.status(200).json({ mensaje: "Status actualizado exitosamente" });
});

// Reinicio de la contraseña al nombre de usuario
app.post("/PassRestart", async (req, res) => {
  PassRestart(req.body.usuario);
  console.log("Contraseña Reiniciada con exito.");
  return res.status(200).json({ mensaje: "Contaseña reiniciada exitosamente" });
});

app.post("/NuevaReceta", async (req, res) => {
  if (req.session.EsDoctor) {
    await NuevaReceta(
      req.session.idInfoUsuario,
      req.session.idDoctor,
      req.body.idSesion,
      req.body.Medicamentos,
      req.body.Indicaciones,
      req.body.Nota
    );
    
    // Redirige a la misma página actual (recargará la página)
    return res.redirect(`InfoPaciente/${req.session.idInfoUsuario}`);
  } else {
    res.redirect("/");
  }
});


app.post("/InfoPaciente", async function (peticion, respuesta) {
  if (peticion.session.idusuario) {
    // Ejecutamos el query para obtener los datos del paciente
    const DataPaciente = await InfoPaciente(peticion.session.idInfoUsuario);
    // Y damos el output en json
    respuesta.end(JSON.stringify(DataPaciente));
  } else {
    respuesta.redirect("/");
  }
});

app.post("/Receta", async function (peticion, respuesta) {
  if (peticion.session.idusuario) {
    // Ejecutamos el query para obtener los datos del paciente
    const DataPaciente = await Receta(
      peticion.session.idInfoUsuario,
      peticion.session.idReceta
    );
    // Y damos el output en json
    respuesta.end(JSON.stringify(DataPaciente));
  } else {
    respuesta.redirect("/");
  }
});

app.post("/BusquedaPacientes", async function (req, res) {
  if (req.session.idusuario) {
    const resBusqueda = await Busqueda(req.body.nombre, req.body.apellido, req.body.telefono_correo);
    res.end(JSON.stringify(resBusqueda));
  } else {
    res.redirect("/");
  }
});









//Variable para el almacenamiento de imagenes con multer
const almacenamiento = multer.diskStorage({
  destination: async (req, file, cb) => {
    try {
      //Creamos la carpeta del paciente
      const rutaDestino = path.join(__dirname,"public/private/src/temp");
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
   const idUsuario = await NuevoPaciente(
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
      path.join(__dirname, "public/private/src/temp", req.file.filename),
      path.join(Ruta, req.file.filename)
    );
    
    // Si el protocolo es "Perfil", crear la miniatura de la imagen y moverla a la carpeta del paciente
    if (req.body.Protocolo === "Perfil") {
      const rutaImagenOriginal = path.join(Ruta, req.file.filename);
      const rutaMiniatura = path.join(Ruta, `Pequeño-${req.file.filename}`);
    
      // Llamar a la función Resizer para redimensionar la imagen
      Resizer(rutaImagenOriginal, rutaMiniatura, 50)
      // Y guardar la ruta de la imagen en la base de datos
      InsertRutaFoto(idUsuario,rutaImagenOriginal);
    }else{
      const rutaImagenOriginal = path.join(Ruta, req.file.filename);
      const rutaMiniatura = path.join(Ruta, `Preview-${req.file.filename}`);
    
      // Llamar a la función Resizer para redimensionar la imagen
      Resizer(rutaImagenOriginal, rutaMiniatura, 100)
      // Y guardar la ruta de la imagen en la base de datos
      InsertRutaFoto(idUsuario,rutaImagenOriginal);
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
app.post("/CrearPaciente", subirfoto.single("file"), CrearPaciente);

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
    __dirname,
    "public/private/src/img",
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









//==================================================================================================
//  Vistas del sitio Web (Frontend)
//==================================================================================================
// Ruta principal
app.get("/", function (peticion, respuesta) {
  // Si ya hay un usuario logueado, se redirige al dashboard
  if (peticion.session.idusuario) {
    respuesta.redirect("/Dashboard");
  } else {
    // Pasamos la información del sistema
    respuesta.render("index.ejs", {
      // El saludo con base a la hora
      saludo: Saludo(),
      // El copyrigth
      Copy: Copyright().Copyright,
      NombreE: Copyright().NombreEmpresa,
      // El año actual
      Año: Copyright().Año,
      // La version del sistema
      Ver: Copyright().Version,
    });
  }
});

// Ruta del Dashboard
app.get("/Dashboard", function (peticion, respuesta) {
  if (peticion.session.idusuario) {
    // Pasamos los datos de la sesión
    respuesta.render("Dashboard.ejs", {
      // Clase de usuario en Numero
      ClaseUsuario: peticion.session.idClaseUsuario,
    });
  } else {
    respuesta.redirect("/");
  }
});

app.get("/Busqueda", function (peticion, respuesta) {
  if (peticion.session.idusuario) {
    respuesta.render("Busqueda.ejs", {
      // Clase de usuario en Numero
      ClaseUsuario: peticion.session.idClaseUsuario,
    });
  } else {
    respuesta.redirect("/");
  }
});

app.get("/NuevoPaciente", function (peticion, respuesta) {
  if (peticion.session.idusuario && peticion.session.idClaseUsuario <= 5) {
    respuesta.render("NuevoPaciente.ejs");
  } else {
    respuesta.redirect("/");
  }
});

app.get("/Agenda", function (peticion, respuesta) {
  if (peticion.session.idusuario) {
    respuesta.render("Agenda.ejs");
  } else {
    respuesta.redirect("/");
  }
});

app.get("/InfoPaciente/:id", async (req, res) => {
  if (req.session.idusuario) {
    const pacienteId = req.params.id;
    // Guardamos temporalmente el id del paciente en una Cookie para realizar la consulta
    req.session.idInfoUsuario = pacienteId;
    //  Y renderizamos la vista
    res.render("InfoPaciente.ejs");
  } else {
    res.redirect("/");
  }
});

app.get("/Receta/:idPaciente/:idReceta", function (req, res) {
  if (req.session.idusuario) {
    const idPaciente = req.params.idPaciente;
    const idReceta = req.params.idReceta;
    // Guardamos temporalmente el id del paciente en una Cookie para realizar la consulta
    req.session.idInfoUsuario = idPaciente;
    req.session.idReceta = idReceta;
    //  Y renderizamos la vista
    res.render("Receta.ejs");
  }
});

// Y un Middleware para Cualquier otro sitio no encontrado (página 404)
// app.use((req, res) => {
//   res.render("404.ejs");
// });
