import express from "express";
const router = express.Router();

// ==================================================================================================
// Importacion de API's
// ==================================================================================================
// Dashboard
import * as API_Dashboard from "../SQL/Dashboard.js";
// Tiempo
import * as API_TimeMachine from "../api_timemachine.js";


// ==================================================================================================
// Rutas Post
// ==================================================================================================

// -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
// Dashboard Doctor
// -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
router.post("/DashboardDoc", async (peticion, respuesta) => {
  if (peticion.session.idusuario) {
    if (peticion.session.EsDoctor) {
      const PacientesEspera = await API_Dashboard.DashDoc_PacientesEspera(
        peticion.session.idDoctor,
        API_TimeMachine.FechaHora().FormatoDia
      );
      const Citas_Hoy = await API_Dashboard.DashDoc_CitasHoy(
        peticion.session.idDoctor,
        API_TimeMachine.FechaHora().FormatoDia
      );
      const OtrosConsultorios = await API_Dashboard.DashDoc_OtrosConsultorios(
        peticion.session.idDoctor,
        API_TimeMachine.FechaHora().FormatoDia
      );
      const Citas_Finalizadas = await API_Dashboard.DashDoc_CitasFinalizadas(
        peticion.session.idDoctor,
        API_TimeMachine.FechaHora().FormatoDia
      );

      const InfoDashboard = {
        PacientesEspera: PacientesEspera,
        CitasHoy: Citas_Hoy,
        OtrosConsultorios: OtrosConsultorios,
        CitasFinalizadas: Citas_Finalizadas,
      };
      respuesta.end(JSON.stringify(InfoDashboard));
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


//==================================================================================================
// Dashboard Doc | Pacientes de Hoy / Espera
//==================================================================================================
router.post("/DashboardDoc/Hoy_Espera", async (peticion, respuesta) => {
  if (peticion.session.idusuario) {
    if (peticion.session.EsDoctor) {
      const PacientesEspera = await API_Dashboard.DashDoc_PacientesEspera(
        peticion.session.idDoctor,
        API_TimeMachine.FechaHora().FormatoDia
      );
      const Citas_Hoy = await API_Dashboard.DashDoc_CitasHoy(
        peticion.session.idDoctor,
        API_TimeMachine.FechaHora().FormatoDia
      );

      const InfoDashboard = {
        PacientesEspera: PacientesEspera,
        CitasHoy: Citas_Hoy,
      };
      respuesta.end(JSON.stringify(InfoDashboard));
    } else {
      const PacientesEspera = [];
      respuesta.end(JSON.stringify(PacientesEspera));
    }
  } else {
    respuesta.redirect("/");
  }
});

//==================================================================================================
// Dashboard Doc | Pacientes en Consulta / Finalizadas
//==================================================================================================
router.post("/DashboardDoc/Consulta_CheckOut", async (peticion, respuesta) => {
  if (peticion.session.idusuario) {
    if (peticion.session.EsDoctor) {
      const PacientesEspera = await API_Dashboard.DashDoc_PacientesEspera(
        peticion.session.idDoctor,
        API_TimeMachine.FechaHora().FormatoDia
      );
      const Citas_Finalizadas = await API_Dashboard.DashDoc_CitasFinalizadas(
        peticion.session.idDoctor,
        API_TimeMachine.FechaHora().FormatoDia
      );

      const InfoDashboard = {
        PacientesEspera: PacientesEspera,
        CitasFinalizadas: Citas_Finalizadas,
      };
      respuesta.end(JSON.stringify(InfoDashboard));
    } else {
      const PacientesEspera = [];
      respuesta.end(JSON.stringify(PacientesEspera));
    }
  } else {
    respuesta.redirect("/");
  }
});

//==================================================================================================
// Dashboard Doc | Pacientes en Otros Consultorios / Espera
//==================================================================================================
router.post("/DashboardDoc/OC_Espera", async (peticion, respuesta) => {
  if (peticion.session.idusuario) {
    if (peticion.session.EsDoctor) {
      const PacientesEspera = await API_Dashboard.DashDoc_PacientesEspera(
        peticion.session.idDoctor,
        API_TimeMachine.FechaHora().FormatoDia
      );
      const OtrosConsultorios = await API_Dashboard.DashDoc_OtrosConsultorios(
        peticion.session.idDoctor,
        API_TimeMachine.FechaHora().FormatoDia
      );
      const InfoDashboard = {
        PacientesEspera: PacientesEspera,
        OtrosConsultorios: OtrosConsultorios,
      };
      respuesta.end(JSON.stringify(InfoDashboard));
    } else {
      const PacientesEspera = [];
      respuesta.end(JSON.stringify(PacientesEspera));
    }
  } else {
    respuesta.redirect("/");
  }
});

//==================================================================================================
// Dashboard Doc | Pacientes en Espera
//==================================================================================================
router.post("/DashboardDoc/Espera", async (peticion, respuesta) => {
  if (peticion.session.idusuario) {
    if (peticion.session.EsDoctor) {
      const PacientesEspera = await API_Dashboard.DashDoc_PacientesEspera(
        peticion.session.idDoctor,
        API_TimeMachine.FechaHora().FormatoDia
      );
      respuesta.end(JSON.stringify(PacientesEspera));
    } else {
      const PacientesEspera = [];
      respuesta.end(JSON.stringify(PacientesEspera));
    }
  } else {
    respuesta.redirect("/");
  }
});

//==================================================================================================
// Dashboard Doc | Pacientes para Hoy
//==================================================================================================
router.post("/DashboardDoc/CitasHoy", async (peticion, respuesta) => {
  if (peticion.session.idusuario) {
    if (peticion.session.EsDoctor) {
      const Citas_Hoy = await API_Dashboard.DashDoc_CitasHoy(
        peticion.session.idDoctor,
        API_TimeMachine.FechaHora().FormatoDia
      );
      respuesta.end(JSON.stringify(Citas_Hoy));
    } else {
      const PacientesEspera = [];
      respuesta.end(JSON.stringify(PacientesEspera));
    }
  } else {
    respuesta.redirect("/");
  }
});

//==================================================================================================
// Dashboard Doc | Pacientes en Otros Consultorios
//==================================================================================================
router.post("/DashboardDoc/OtrosConsultorios", async (peticion, respuesta) => {
  if (peticion.session.idusuario) {
    if (peticion.session.EsDoctor) {
      const OtrosConsultorios = await API_Dashboard.DashDoc_OtrosConsultorios(
        peticion.session.idDoctor,
        API_TimeMachine.FechaHora().FormatoDia
      );
      respuesta.end(JSON.stringify(OtrosConsultorios));
    } else {
      const PacientesEspera = [];
      respuesta.end(JSON.stringify(PacientesEspera));
    }
  } else {
    respuesta.redirect("/");
  }
});

//==================================================================================================
// Dashboard Doc | Pacientes Finalizados
//==================================================================================================
router.post("/DashboardDoc/CitasFinalizadas", async (peticion, respuesta) => {
  if (peticion.session.idusuario) {
    if (peticion.session.EsDoctor) {
      const Citas_Finalizadas = await API_Dashboard.DashDoc_CitasFinalizadas(
        peticion.session.idDoctor,
        API_TimeMachine.FechaHora().FormatoDia
      );
      respuesta.end(JSON.stringify(Citas_Finalizadas));
    } else {
      const PacientesEspera = [];
      respuesta.end(JSON.stringify(PacientesEspera));
    }
  } else {
    respuesta.redirect("/");
  }
});



// -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
// Dashboard Recepcion
// -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
router.post("/DashboardRecepcion", async (peticion, respuesta) => {
  if (peticion.session.idusuario) {

    const CitasHoy = await API_Dashboard.DashRecepcion_PacientesHoy(
      peticion.session.Sucursal,
      API_TimeMachine.FechaHora().FormatoDia
    );
    const PacientesPedidos = await API_Dashboard.DashRecepcion_PacientesPedidos(
      peticion.session.Sucursal,
      API_TimeMachine.FechaHora().FormatoDia
    );

    const PacientesCheckout = await API_Dashboard.DashRecepcion_CitasFinalizadas(
      peticion.session.Sucursal,
      API_TimeMachine.FechaHora().FormatoDia
    );

    const InfoDashboard = {
    CitasHoy: CitasHoy,
    PacientesPedidos: PacientesPedidos,
    PacientesCheckout: PacientesCheckout,
    };

    respuesta.end(JSON.stringify(InfoDashboard));
  } else {
    respuesta.redirect("/");
  }
});

//==================================================================================================
// Dashboard Recepcion | Citas Hoy
//==================================================================================================

router.post("/DashboardRecepcion/CitasHoy", async (peticion, respuesta) => {
  if (peticion.session.idusuario) {

    const CitasHoy = await API_Dashboard.DashRecepcion_PacientesHoy(
      peticion.session.Sucursal,
      API_TimeMachine.FechaHora().FormatoDia
    );

    respuesta.end(JSON.stringify(CitasHoy));
  } else {
    respuesta.redirect("/");
  }
});

//==================================================================================================
// Dashboard Recepcion | Pacientes Pedidos
//==================================================================================================

router.post("/DashboardRecepcion/P_Pedidos", async (peticion, respuesta) => {
  if (peticion.session.idusuario) {
    const PacientesPedidos = await API_Dashboard.DashRecepcion_PacientesPedidos(
      peticion.session.Sucursal,
      API_TimeMachine.FechaHora().FormatoDia
    );

    respuesta.end(JSON.stringify(PacientesPedidos));
  } else {
    respuesta.redirect("/");
  }
});

//==================================================================================================
// Dashboard Recepcion | Pacientes Checkout
//==================================================================================================

router.post("/DashboardRecepcion/P_Checkout", async (peticion, respuesta) => {
  if (peticion.session.idusuario) {

    const PacientesCheckout = await API_Dashboard.DashRecepcion_CitasFinalizadas(
      peticion.session.Sucursal,
      API_TimeMachine.FechaHora().FormatoDia
    );
    respuesta.end(JSON.stringify(PacientesCheckout));
  } else {
    respuesta.redirect("/");
  }
});





export default router;