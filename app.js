//==================================================================================================
// Importaciones de modulos y librerias
//==================================================================================================
import express from "express";
import { config } from "dotenv";
import session from "express-session";
import http from "http";
import { Server } from "socket.io";

// ==================================================================================================
// Importacion de API's
// ==================================================================================================
// Tiempo
import * as API_TimeMachine from "./public/api/api_timemachine.js";

//==================================================================================================
// Configuracion del Sitio Web
//==================================================================================================

// Ejecucion de dotenv
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

// ==================================================================================================
// Rutas Post
// ==================================================================================================
import rutasPost from "./public/api/index_post.js";

Object.values(rutasPost).forEach((route) => {
  app.use(route);
});

//==================================================================================================
// WebSockets
//==================================================================================================
import socketManager from "./public/api/WebSocket's.js";
socketManager(io);

// ==================================================================================================
// Detectar el Navegador del usuario
// ==================================================================================================
app.use((req, res, next) => {
  const agente = req.headers["user-agent"];
  let navegador;

  const mapaNavegadores = {
    Safari: {
      contiene: ["Safari"],
      noContiene: ["Chrome", "OPR"],
      encabezados: {
        "Cache-Control": "no-cache, no-store, must-revalidate",
        Pragma: "no-cache",
        Expires: "0",
      },
    },
    Chrome: {
      contiene: ["Chrome"],
      noContiene: ["OPR"],
    },
    Opera: {
      contiene: ["OPR"],
    },
    Firefox: {
      contiene: ["Firefox"],
    },
    Edge: {
      contiene: ["Edge"],
    },
  };

  for (const [clave, valor] of Object.entries(mapaNavegadores)) {
    if (
      valor.contiene.every((v) => agente.includes(v)) &&
      (!valor.noContiene || valor.noContiene.every((v) => !agente.includes(v)))
    ) {
      navegador = clave;
      break;
    }
  }

  navegador = navegador || "Otro";

  if (mapaNavegadores[navegador] && mapaNavegadores[navegador].encabezados) {
    for (const [claveEncabezado, valorEncabezado] of Object.entries(
      mapaNavegadores[navegador].encabezados
    )) {
      res.header(claveEncabezado, valorEncabezado);
    }
  }

  console.log(navegador);
  // req.session.Navegador = navegador === "Otro" ? "Otros" : navegador;
  req.navegador = navegador === "Otro" ? "Otros" : navegador;

  next();
});

//==================================================================================================
//  TESTING
//==================================================================================================




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
      saludo: API_TimeMachine.Saludo(),
      // El copyrigth
      Copy: API_TimeMachine.Copyright().Copyright,
      NombreE: API_TimeMachine.Copyright().NombreEmpresa,
      // El año actual
      Año: API_TimeMachine.Copyright().Año,
      // La version del sistema
      Ver: API_TimeMachine.Copyright().Version,
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

    console.log(req.session.Navegador);
    // Determinar la hoja de estilos basada en el navegador
    let stylesheet = "/css/Receta/Chrome.css";
    switch (req.navegador) {
      case "Safari":
        stylesheet = "/css/Receta/Safari.css";
        break;
      case "Chrome":
        stylesheet = "/css/Receta/Chrome.css";
        break;
      case "Opera":
        stylesheet = "/css/Receta/Opera.css";
        break;
      case "Firefox":
        stylesheet = "/css/Receta/Firefox.css";
        break;
      case "Edge":
        stylesheet = "/css/Receta/Edge.css";
        break;
      default:
        stylesheet = "/css/Receta/Brave.css";
        break;
    }

    // Y renderizamos la vista pasando el nombre de la hoja de estilos como variable
    res.render("Receta.ejs", { Navegador: stylesheet });
  } else {
    res.redirect("/");
  }
});

// Y un Middleware para Cualquier otro sitio no encontrado (página 404)
app.use((req, res) => {
  res.render("404.ejs");
});
