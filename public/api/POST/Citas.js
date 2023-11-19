import express from "express";
const router = express.Router();
// ==================================================================================================
// Importacion de API's
// ==================================================================================================
// Autentificacion y Usuarios
import * as API_Citas from "../SQL/Citas.js";



// ==================================================================================================
// Rutas Post
// ==================================================================================================
// Crear una nueva cita
router.post("/CrearCita", async (req, res) => {
  if (peticion.session.idusuario) {
    // Lanzamos la creacion de la cita a la base de datos
    await API_Citas.NuevaCita(
      req.body.idSucursal,
      req.body.idProcedimiento,
      req.body.idDoctor,
      req.body.idAsociado,
      req.body.idPaciente,
      req.body.idStatus,
      req.body.FechaCita,
      req.body.DuracionCita,
      req.body.NotasCita
    );
  } else {
    respuesta.redirect("/");
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

// Ver la agenda del doctor
router.post("/AgendaDoctor", async (peticion, respuesta) => {
  if (peticion.session.idusuario) {
    if (peticion.session.EsDoctor) {
      const Agenda = await API_Citas.CitasDoctor(peticion.session.idDoctor);
      respuesta.end(JSON.stringify(Agenda));
    } else {
      const Agenda = [];
      respuesta.end(JSON.stringify(Agenda));
    }
  } else {
    respuesta.redirect("/");
  }
});

// Actualizar el Seguimineto de la sesion de la cita
router.post ("/UpdateSeguimiento", async (peticion, respuesta) => {
  if (peticion.session.idusuario) {
    if (peticion.session.EsDoctor) {
      await API_Citas.UpdateSeguimiento(
        peticion.body.idSesion,
        peticion.body.Seguimiento,
      );
      respuesta.end(JSON.stringify("Seguimiento actualizado exitosamente"));
    } else {
      respuesta.end(JSON.stringify("No tiene permisos para realizar esta accion"));
    }
  }
});




export default router;