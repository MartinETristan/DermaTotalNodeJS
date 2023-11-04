import express from "express";
const router = express.Router();
// ==================================================================================================
// Importacion de API's
// ==================================================================================================
// Recetas
import * as API_Recetas from "../SQL/Recetas.js";
// Registros
import * as API_Registros from "../SQL/Registros.js";

router.post("/NuevaReceta", async (req, res) => {
    if (req.session.EsDoctor) {
      await API_Recetas.NuevaReceta(
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

  


router.post("/Receta", async function (peticion, respuesta) {
    if (peticion.session.idusuario) {
      // Ejecutamos el query para obtener los datos del paciente
      const DataPaciente = await API_Recetas.Receta(
        peticion.session.idInfoUsuario,
        peticion.session.idReceta
      );
      // Y damos el output en json
      respuesta.end(JSON.stringify(DataPaciente));
    } else {
      respuesta.redirect("/");
    }
  });
  
  router.post("/UltimaReceta", async function (peticion, respuesta) {
    if (peticion.session.idusuario) {
      // Ejecutamos el query para obtener la ultima receta
      const Sucursal = await API_Registros.SucursalUltimaCita(peticion.session.idInfoUsuario);
      // Y damos el output en json
      respuesta.end(JSON.stringify(Sucursal));
    } else {
      respuesta.redirect("/");
    }
  });
  
  router.post("/CambiosReceta", async function (peticion, respuesta) {
    if (peticion.session.idusuario) {
      // console.log(peticion.body);
      peticion.body.Cambios.forEach((cambio) => {
        switch (cambio.action) {
          case "Añadir":
            console.log("Añadir");
            API_Recetas.UpdateReceta_Añadir(cambio.item);
            break;
          case "Editar":
            console.log("Editar");
            API_Recetas.UpdateReceta_Editar(cambio.item);
            break;
  
          case "Quitar":
            console.log("Quitar");
            API_Recetas.UpdateReceta_Quitar(cambio.item);
            break;
  
          case "EditNota":
            console.log("Editar Nota");
            API_Recetas.UpdateReceta_EditNota(cambio.item);
            break;
  
          case "Reordendar":
            console.log("Reordenar Receta");
            API_Recetas.UpdateReceta_Orden(cambio.cambios);
            break;
  
          default:
            console.log(
              "No se ha encontrado el cambio para actualizar la receta."
            );
            break;
        }
      });
    } else {
      respuesta.redirect("/");
    }
  });
  



export default router;