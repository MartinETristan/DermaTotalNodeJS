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
router.post("/AgendaMedico", async (peticion, respuesta) => {
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

// Actualizar el Seguimineto de la sesion de la cita
router.post("/UpdateSeguimiento", async (peticion, respuesta) => {
  if (peticion.session.idusuario) {
    if (peticion.session.EsDoctor) {
      await API_Citas.UpdateSeguimiento(
        peticion.body.idSesion,
        peticion.body.Seguimiento
      );
      respuesta.end(JSON.stringify("Seguimiento actualizado exitosamente"));
    } else {
      respuesta.end(
        JSON.stringify("No tiene permisos para realizar esta accion")
      );
    }
  }
});

export default router;
