// ========================================================================================================
// Función para cargar la vista Recetas.ejs
// ========================================================================================================
function cargarRecetas() {
    const Recetas = document.querySelector("#infocontenido");
    var htmlString = `
    <p>Estas son las recetas</p>
    `;
    Recetas.innerHTML = htmlString;
  }
  