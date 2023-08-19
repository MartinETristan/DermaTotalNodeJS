
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
    window.location.href = "/Agenda";
  });

  // Carga la vista de la busqueda de pacientes
  $("#Pacientes").click(function () {
    window.location.href = "/Pacientes";
  });

  // Carga la vista de Inventario
  $("#Inventario").click(function () {
    window.location.href = "/Inventario";
  });

  // Carga la vista de Cortes de Caja
  $("#Cortes").click(function () {
    window.location.href = "/Cortes";
  });


  // Carga la vista de Historial de los Pacientes
  $("#HistorialVistaPaciente").click(function () {
    window.location.href = "/InfoPaciente";
  });





});
