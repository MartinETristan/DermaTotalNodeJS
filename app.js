//==================================================================================================
// Importaciones de modulos y librerias
//==================================================================================================
import express from "express";
import { config } from "dotenv";
import session from "express-session";
import http from "http";
import { Server } from "socket.io";

// Importacion de API's
import {
  VerificarUsuario,
  UsuarioyProfesion,
  DashDoc,
  DashRecepcion,
  Hoy_Espera,
} from "./public/api/api_sql.js";
import { Copyright, Saludo, FechaHora } from "./public/api/api_timemachine.js";

//==================================================================================================
// Configuracion del Sitio Web
//==================================================================================================
//Arreglo de __dirname y __filename
import path from "path";
import { fileURLToPath } from "url";
import { log } from "console";
import e from "express";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ejjecucion de dotenv
config();
const app = express();
const web = http.createServer(app);
const io = new Server(web);

// En caso de que el puerto local no exista, se usará el puerto de testeo
const puerto = process.env.PUERTO_NODE_LOCAL || process.env.PUERTO_NODE_LOCALTEST;

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
  });

app.use(sessionMiddleware);

// Definimos el motor de plantillas
app.set("view engine", "ejs");

// Añadimos la carpeta public para los archivos estáticos
app.use(express.static("public"));

//Configuracion Express-session-socket.io
io.engine.use(sessionMiddleware);

//==================================================================================================
// WebSockets
//==================================================================================================
io.on("connection", (socket) => {
  console.log("Usuario conectado");
  // Asignamos un canal de comunicacion para cada tipo de usuario
  switch (socket.request.session.idClaseUsuario) {
    case 1: case 2: case 3:
      var RoomDoctor = "Doctor"+socket.request.session.idTipoDeUsuario;
      socket.join(RoomDoctor);
    break;
    case 4: case 5:
      var RoomRecepcion = "Recepcion"+socket.request.session.idTipoDeUsuario;
      socket.join(RoomRecepcion);
    break;
    case 6:
      var RoomAsociado = "Asociado"+socket.request.session.idTipoDeUsuario;
      socket.join(RoomAsociado);
    break;
    default:
      var RoomPaciente = "Paciente"+socket.request.session.idTipoDeUsuario;
      socket.join(RoomPaciente);
    break;
  }


// Cambios realizados en el dashboard por recepcionistas
  socket.on("CambioEstadoPaciente", (data) => {
    switch (data.idStatus) {
      case 1:
        if(socket.request.session.Sucursal == 1){
          Hoy_Espera(data.Cita, data.idStatus,FechaHora().HoraS1);
        }else{
          Hoy_Espera(data.Cita, data.idStatus,FechaHora().HoraS2);
        }
        io.to("Doctor"+data.Doctor).emit("Hoy/Espera");
        socket.except("Doctor"+data.Doctor).emit("OtrosConsultorios");
        break;
      case 2:

        io.emit("Espera/Activos");
        break;
      case 3:

        io.emit("Activos/Finalizada");
        break;
      default:
        break;
    }
  });


  socket.on('disconnect', () => {
    console.log('Socket desconectado');
  });

});

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
      saludo:Saludo(), 
      // El copyrigth
      Copy:Copyright().Copyright, 
      NombreE:Copyright().NombreEmpresa, 
      // El año actual
      Año:Copyright().Año, 
      // La version del sistema
      Ver:Copyright().Version 
    });
  }
});

// Ruta del Dashboard
app.get("/Dashboard", function (peticion, respuesta) {
  if (peticion.session.idusuario) {
    // Pasamos los datos de la sesión
    respuesta.render("Dashboard.ejs", {
      // ID del usuario en la TABLA USUARIOS
      idUsuario:peticion.session.idusuario,
      // Clase de usuario en Numero 
      ClaseUsuario:peticion.session.idClaseUsuario,
      // ID de la TABLA de donde es el usuario
      ID:peticion.session.idTipoDeUsuario,
      // Estilo de la web
      EstiloWeb:peticion.session.estiloweb,
      // Nombre del usuario
      Nombre:peticion.session.Nombres,
      // Rol del usuario en TEXTO
      TipUser:peticion.session.rol,
      // InfoDelSistema
      Empresa:Copyright().NombreEmpresa,
      saludo:Saludo(),
      Copy:Copyright().Copyright,
      Año:FechaHora().Año,
      Ver:Copyright().Version,
      Fecha:FechaHora().FormatoDia,
    });
  } else {
    respuesta.redirect("/");
  }
});

app.get("/Busqueda", function (peticion, respuesta) {
  if (peticion.session.idusuario) {
    respuesta.render("Busqueda.ejs",{
      // Clase de usuario en Numero 
      ClaseUsuario:peticion.session.idClaseUsuario,
      // ID de la TABLA de donde es el usuario
      ID:peticion.session.idTipoDeUsuario,
      // Estilo de la web
      EstiloWeb:peticion.session.estiloweb,
      // Nombre del usuario
      Nombre:peticion.session.Nombres,
      // Rol del usuario en TEXTO
      TipUser:peticion.session.rol,
      // InfoDelSistema
      Empresa:Copyright().NombreEmpresa,
      saludo:Saludo(),
      Copy:Copyright().Copyright,
      Año:FechaHora().Año,
      Ver:Copyright().Version,
      Fecha:FechaHora().FormatoDia,
    });
  } else {
    respuesta.redirect("/");
  }
});




app.get("/NuevoPaciente", function (peticion, respuesta) {
  if (peticion.session.idusuario) {
    respuesta.render("NuevoPaciente.ejs",{
      // ID del usuario en la TABLA USUARIOS
      idUsuario:peticion.session.idusuario,
      // Clase de usuario en Numero 
      ClaseUsuario:peticion.session.idClaseUsuario,
      // ID de la TABLA de donde es el usuario
      ID:peticion.session.idTipoDeUsuario,
      // Estilo de la web
      EstiloWeb:peticion.session.estiloweb,
      // Nombre del usuario
      Nombre:peticion.session.Nombres,
      // Rol del usuario en TEXTO
      TipUser:peticion.session.rol,
      // InfoDelSistema
      Empresa:Copyright().NombreEmpresa,
      saludo:Saludo(),
      Copy:Copyright().Copyright,
      Año:FechaHora().Año,
      Ver:Copyright().Version,
      Fecha:FechaHora().FormatoDia,
    });
  }else{
    respuesta.redirect("/");
  }

});






// Y un Middleware para Cualquier otro sitio no encontrado (página 404)
// app.use((req, res) => {
//   res.render("404.ejs");
// });

//==================================================================================================
//  TESTING
//==================================================================================================




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
      // console.log(InfoUsuario);
      res.send("ReadyUser");
    } else {
      res.send("Usuario y/o contraseña incorrectos.");
    }
  }
});


// Ruta para cerrar sesión
app.get("/logout", function (peticion, respuesta) {
  peticion.session.destroy(function (error) {
    if (error) {
      console.log(error);
    } else {
      
      respuesta.redirect("/");
    }
  });
});

app.get("/CrearPaciente", function (peticion, respuesta) {

});


// Ruta para obtener los datos del Dashboard para los Doctores
app.get("/DashboardDoc", async (peticion, respuesta) => {
  if (peticion.session.idusuario) {
    if (peticion.session.EsDoctor) {
      const PacientesEspera = await DashDoc(peticion.session.idTipoDeUsuario,FechaHora().FormatoDia);
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
  } 
  else {
    respuesta.redirect("/");
  }
});

// Ruta para obtener los datos del Dashboard para los recepcionistas
app.get("/DashboardRecepcion", async (peticion, respuesta) => {
  if (peticion.session.idusuario) {
    const PacientesEspera = await DashRecepcion(peticion.session.Sucursal,FechaHora().FormatoDia);
    respuesta.end(JSON.stringify(PacientesEspera));
  } else {
    respuesta.redirect("/");
  }
});