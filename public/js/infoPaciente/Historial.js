// ========================================================================================================
// Función para cargar la vista Historial.ejs
// ========================================================================================================
function cargarHistorial() {
    const Historial = document.querySelector("#infocontenido");
    var htmlString = `
    <div class="region__content" id="region__content">
      <div class="infogroup">
        <div class="info">
        <h3>Historial Clinico:</h3>
          <div class="info__item">
            <div class="info__item__content">
              <header class="info__item__header">
                <h3 class="info__item__title">Seguimiento:</h3>
              </header>
              <p>Aqui aparecen las citas anteriores</p>
            </div>
          </div>
        </div>
      </div>
      <div class="infogroup">
        <div class="info">
        <h3>Historial Fotografico:</h3>
          <div class="info__item">
            <div class="info__item__content">
              <img class="fotohistorial" src="/img/UserIco.webp" alt="">
              <img class="fotohistorial" src="/img/UserIco.webp" alt="">
              <img class="fotohistorial" src="/img/UserIco.webp" alt="">
              <img class="fotohistorial" src="/img/UserIco.webp" alt="">
              <img class="fotohistorial" src="/img/UserIco.webp" alt="">
              <img class="fotohistorial" src="/img/UserIco.webp" alt="">
              <img class="fotohistorial" src="/img/UserIco.webp" alt="">
              <img class="fotohistorial" src="/img/UserIco.webp" alt="">
              <img class="fotohistorial" src="/img/UserIco.webp" alt="">
              <img class="fotohistorial" src="/img/UserIco.webp" alt="">
              <img class="fotohistorial" src="/img/UserIco.webp" alt="">
              <img class="fotohistorial" src="/img/UserIco.webp" alt="">
              <img class="fotohistorial" src="/img/UserIco.webp" alt="">
              <img class="fotohistorial" src="/img/UserIco.webp" alt="">
              <img class="fotohistorial" src="/img/UserIco.webp" alt="">
              <img class="fotohistorial" src="/img/UserIco.webp" alt="">
              <img class="fotohistorial" src="/img/UserIco.webp" alt="">
              <img class="fotohistorial" src="/img/UserIco.webp" alt="">
              <img class="fotohistorial" src="/img/UserIco.webp" alt="">
              <img class="fotohistorial" src="/img/UserIco.webp" alt="">
            </div>
          </div>
        </div>
      </div>
    </div>
      
    `;
    Historial.innerHTML = htmlString;
  }
  