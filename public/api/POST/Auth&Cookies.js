import express from "express";
const router = express.Router();

// ==================================================================================================
// Importacion de API's
// ==================================================================================================
// Autentificacion y Usuarios
import * as API_Auth from "../SQL/Aut&Usuarios.js";
// Tiempo
import * as API_TimeMachine from "../api_timemachine.js";


// ==================================================================================================
// Rutas Post
// ==================================================================================================
// Ruta para verificar el usuario y contraseña
router.post("/login", async (req, res) => {
  const { usuario, contrasena } = req.body;

  if (!usuario || !contrasena) {
    res.send("Falta llenar algún campo.");
  } else {
    const resultado = await API_Auth.VerificarUsuario(usuario, contrasena);
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
      const InfoUsuario = await API_Auth.UsuarioyProfesion(resultado.idUsuario);
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



// Ruta para obtener los datos de la Inforamacion de la sesion
router.post("/InfoSesion", function (peticion, respuesta) {
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
router.post("/DatosSistema", function (peticion, respuesta) {
  const DatosSistema = {
    Saludo: API_TimeMachine.Saludo(),
    Copy: API_TimeMachine.Copyright().Copyright,
    Empresa: API_TimeMachine.Copyright().NombreEmpresa,
    Año: API_TimeMachine.FechaHora().Año,
    Ver: API_TimeMachine.Copyright().Version,
  };
  respuesta.end(JSON.stringify(DatosSistema));
});




  export default router;