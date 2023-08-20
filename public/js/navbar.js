// ================================================================================
// Habilitamos el Socket.IO en todos los Dashboards
// ================================================================================
let socket = io();


// ================================================================================
// Logo Carga
$(window).on("load", function () {
  $("#LoadingLogo").fadeOut("slow");
});
// Animacion Scroll
$(window).bind("scroll", function () {
  var navHeight = $(".main-header").height();

  if ($(window).scrollTop() > navHeight) {
    $(".nav-bar").addClass("fixed");
    $(".nav-1").addClass("toleft");
    $(".icono").addClass("icoinvert");
  } else {
    $(".nav-bar").removeClass("fixed");
    $(".nav-1").removeClass("toleft");
    $(".icono").removeClass("icoinvert");
  }
});

$(document).ready(function () {
  // Al darle click a la foto de perfil del usuario se despliega el menu
  $("#Perfil").click(function () {
    const togglemenu = document.querySelector("#Menu");
    togglemenu.classList.toggle("active");
  });


  // Carga el DashBoard del usuario Doctor
  $("#Dashboard").click(function () {
    window.location.href = "/Dashboard";
    
  });
  // Carga la vista de la agenda
  $("#Agenda").click(function () {
    socket.disconnect();
    window.location.href = "/Agenda";
  });

  // Carga la vista de la busqueda de pacientes
  $("#Pacientes").click(function () {
    socket.disconnect();
    window.location.href = "/Busqueda";
  });

  // Carga la vista de Inventario
  $("#Inventario").click(function () {
    socket.disconnect();
    window.location.href = "/Inventario";
  });

  // Carga la vista de Cortes de Caja
  $("#Cortes").click(function () {
    socket.disconnect();
    window.location.href = "/Cortes";
  });


  


  // ==================================================================================================
  // Sesiones del Socket.IO
  // ==================================================================================================


  // Nos aseguramos de que se cierre sesion en el socket al cerrar sesion en el sitio web
  const BotonEnd = document.getElementById('CerrarSesion');
  if (BotonEnd){
    BotonEnd.addEventListener('click', (event) => {
      event.preventDefault();
      socket.disconnect(); // Desconecta el socket
      console.log('Sesión de Socket.IO cerrada');
      // Para posterioremente borrar las Cookies de la sesion
      window.location.href = "/logout";
    });
  }

  // Cerramos la sesion temporalmente al crear un nuevo usuario
  const NuevoPaciente = document.getElementById('NuevoPaciente');
  if (NuevoPaciente) {
    NuevoPaciente.addEventListener('click', (event) => {
      window.location.href = "/NuevoPaciente";
    });
  }




});


