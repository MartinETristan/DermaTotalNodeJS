import express from "express";
const router = express.Router();
// ==================================================================================================
// Importacion de API's
// ==================================================================================================
// Autentificacion y Usuarios
import * as API_Citas from "../SQL/Citas.js";
// Registros
import * as API_Registros from "../SQL/Registros.js";

// ==================================================================================================
// Rutas Post
// ==================================================================================================
// Crear una nueva cita
router.post("/CrearCita", async (req, res) => {
  if (req.session.idusuario) {
    try {      
      // Lanzamos la creacion de la cita a la base de datos
      const idCita = await API_Citas.NuevaCita(
        req.body.idSucursal,
        req.body.idProcedimiento,
        req.body.idDoctor,
        req.body.idAsociado,
        req.session.idInfoUsuario,
        req.body.HoraCita,
        req.body.FinCita,
        req.body.NotasCita
      );
  
      // Y el registro de quien la creo
      await API_Registros.RegitroCreacionCita(
        req.body.R_EsDoctor,
        req.body.R_ID,
        idCita
      );
      res.status(200).json({ mensaje: "Cita creada exitosamente" });
    } catch (error) {
      console.error("Ha ocurrido un error creando la cita: ", error);
      res.status(500).json({ mensaje: "Ha ocurrido un error." });
    }
  } else {
    res.redirect("/");
  }
});

// Actualizar una cita
router.post("/ActualizarCita", async (req, res) => {
  // Lanzamos la actualizacion de la cita a la base de datos
  API_Citas.ModificacionCita(
    req.body.idCita,
    req.body.HoraCita,
    req.body.FinCita
  );
  return res.status(200).json({ mensaje: "Cita actualizada exitosamente" });
});

// Ver la agenda del medico en especifico (idDoctor o idAsociado)
router.post("/Agenda_Citas", async (peticion, respuesta) => {
  if (peticion.session.idusuario) {
    const Agenda = await API_Citas.CitasMedico(
      peticion.body.idDoctor,
      peticion.body.idAsociado
    );
    respuesta.end(JSON.stringify(Agenda));
  } else {
    respuesta.redirect("/");
  }
});


router.post("/Info_ImprimirAgenda", async (req, res) => {
  // if (req.session.idusuario) {
    // console.log(req.body);
    const ImprimirAgenda = await API_Citas.Info_ImprimirAgenda(req.body.idDoctor,req.body.idAsociado,req.body.fechaInicio,req.body.fechaFin);
    res.status(200).json(ImprimirAgenda);
  // } else {
  //   res.redirect("/");
  // }
});




export default router;
