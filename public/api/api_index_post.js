// =============================================================================
// Aqui se importan todos los archivos POST de la carpeta POST
// para poder exportarlos todos juntos y que puedan ser usados
// =============================================================================
import Auth from './POST/Auth&Cookies.js';
import Dashboards from "./POST/Dashboard.js";
import Registros from "./POST/Registros.js";
import Citas from "./POST/Citas.js";
import Recetas from "./POST/Recetas.js";

export default {
  Auth,
  Dashboards,
  Registros,
  Citas,
  Recetas
};


