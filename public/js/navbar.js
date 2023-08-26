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

function getUserRole() {
  return new Promise((resolve, reject) => {
    $.ajax({
      url: "/InfoSesion",
      method: "GET",
      dataType: "json",
      success: function (respuesta) {
        resolve(respuesta);
      },
      error: function (error) {
        reject(error);
      },
    });
  });
}

getUserRole()
  .then(resultado => {
    // Almacenar el resultado en una variable
    const Clase = resultado.ClaseUsuario;

    // Llamar a otra función con el resultado
    CrearItemsNavBar(Clase)
  })



// Estos son los apartados del NavBar que se mostraran con base al tipo de usuario
const ItemsNavBar = {
  1: [
    {
      class: "Dashboard",
      icon: "/img/Icons/DashBoard.svg",
      text: "Dashboard",
      className: "nav-1",
    },
    {
      class: "Agenda",
      icon: "/img/Icons/Agenda.svg",
      text: "Agenda",
      className: "nav-2",
    },
    {
      class: "Pacientes",
      icon: "/img/Icons/Lupa.svg",
      text: "Pacientes",
      className: "nav-3",
    },
    {
      class: "Inventario",
      icon: "/img/Icons/Inventario.svg",
      text: "Inventario",
      className: "nav-4",
    },
    {
      class: "Cortes",
      icon: "/img/Icons/Corte.svg",
      text: "Cortes",
      className: "nav-5",
    },
  ],
  2: [
    {
      class: "Dashboard",
      icon: "/img/Icons/DashBoard.svg",
      text: "Dashboard",
      className: "nav-1",
    },
    {
      class: "Agenda",
      icon: "/img/Icons/Agenda.svg",
      text: "Agenda",
      className: "nav-2",
    },
    {
      class: "Pacientes",
      icon: "/img/Icons/Lupa.svg",
      text: "Pacientes",
      className: "nav-3",
    },
    {
      class: "Cortes",
      icon: "/img/Icons/Corte.svg",
      text: "Cortes",
      className: "nav-4",
    },
  ],
  3: [
    {
      class: "Dashboard",
      icon: "/img/Icons/DashBoard.svg",
      text: "Dashboard",
      className: "nav-1",
    },
    {
      class: "Agenda",
      icon: "/img/Icons/Agenda.svg",
      text: "Agenda",
      className: "nav-2",
    },
    {
      class: "Pacientes",
      icon: "/img/Icons/Lupa.svg",
      text: "Pacientes",
      className: "nav-3",
    },
  ],
  4: [
    {
      class: "Dashboard",
      icon: "/img/Icons/DashBoard.svg",
      text: "Dashboard",
      className: "nav-1",
    },
    {
      class: "Agenda",
      icon: "/img/Icons/Agenda.svg",
      text: "Agenda",
      className: "nav-2",
    },
    {
      class: "Pacientes",
      icon: "/img/Icons/Lupa.svg",
      text: "Pacientes",
      className: "nav-3",
    },
    {
      class: "Inventario",
      icon: "/img/Icons/Inventario.svg",
      text: "Inventario",
      className: "nav-4",
    },
  ],
  5: [
    {
      class: "Dashboard",
      icon: "/img/Icons/DashBoard.svg",
      text: "Dashboard",
      className: "nav-1",
    },
    {
      class: "Agenda",
      icon: "/img/Icons/Agenda.svg",
      text: "Agenda",
      className: "nav-2",
    },
    {
      class: "Pacientes",
      icon: "/img/Icons/Lupa.svg",
      text: "Pacientes",
      className: "nav-3",
    },
  ],
  6: [
    {
      class: "Dashboard",
      icon: "/img/Icons/DashBoard.svg",
      text: "Dashboard",
      className: "nav-1",
    },
    {
      class: "Pacientes",
      icon: "/img/Icons/Lupa.svg",
      text: "Pacientes",
      className: "nav-3",
    },
  ],
  7: [
    {
      class: "Dashboard",
      icon: "/img/Icons/DashBoard.svg",
      text: "Dashboard",
      className: "nav-1",
    },
  ],
};



// Creacion del NavBar con base al tipo de usuario
async function CrearItemsNavBar(ClaseUsuario) {
  const section = document.querySelector(".nav-bar");
  while (section.firstChild) {
    section.removeChild(section.firstChild);
  }

  const itemsToShow = await ItemsNavBar[ClaseUsuario];
  itemsToShow.forEach((item) => {
    const div = document.createElement("div");
    div.className = item.class;

    const h2 = document.createElement("h2");
    h2.className = item.className;

    const img = document.createElement("img");
    img.src = item.icon;
    img.className = "icono";

    const text = document.createTextNode(item.text);

    h2.appendChild(img);
    h2.appendChild(text);
    div.appendChild(h2);

    section.appendChild(div);
  });
}

function datosSistema() {
  return new Promise((resolve, reject) => {
    $.ajax({
      url: "/DatosSistema",
      method: "GET",
      dataType: "json",
      success: function (respuesta) {
        resolve(respuesta.Copy + " " + respuesta.Empresa + " " + respuesta.Año + " " + respuesta.Ver);
      },
      error: function (error) {
        reject(error);
      },
    });
  });
}

document.addEventListener("DOMContentLoaded", () => {
  // Generacion  del saludo para todos los usuarios
  const saludo = document.querySelector(".saludo");
  if (saludo) {
    saludo.textContent = "Hola";
  }
  // Generacion del Footer para todos los usuarios
  datosSistema()
    .then((resultado) => {
      const Footer = document.querySelector(".footer");
      if (Footer) {
        const b = document.createElement("b");
        const text = document.createTextNode(resultado);
        b.appendChild(text);
        Footer.appendChild(b);
      }
    })
    .catch((error) => {
      console.error("Error:", error); // Manejar el error en caso de que ocurra
    });
});



// Una vez que el documento se cree con exito se ejecutara el codigo
$(document).ready(function () {
  // Al darle click a la foto de perfil del usuario se despliega el menu
  $("#Perfil").click(function () {
    const togglemenu = document.querySelector("#Menu");
    togglemenu.classList.toggle("active");
  });

  // Redirecciones del NavBar
  // Carga la vista del Dashboard
  $(".nav-bar").on("click", ".Dashboard", function () {
    window.location.href = "/Dashboard";
  });

  // Carga la vista de la agenda
  $(".nav-bar").on("click", ".Agenda", function () {
    window.location.href = "/Agenda";
  });

  // Carga la vista de la busqueda de pacientes
  $(".nav-bar").on("click", ".Pacientes", function () {
    window.location.href = "/Busqueda";
  });

  // Carga la vista de Inventario
  $(".nav-bar").on("click", ".Inventario", function () {
    window.location.href = "/Inventario";
  });

  // Carga la vista de Cortes de Caja
  $(".nav-bar").on("click", ".Cortes", function () {
    window.location.href = "/Cortes";
  });


  
  // ==================================================================================================
  // Sesiones del Socket.IO
  // ==================================================================================================

  // Nos aseguramos de que se cierre sesion en el socket al cerrar sesion en el sitio web
  const BotonEnd = document.getElementById("CerrarSesion");
  if (BotonEnd) {
    BotonEnd.addEventListener("click", (event) => {
      event.preventDefault();
      socket.disconnect(); // Desconecta el socket
      console.log("Sesión de Socket.IO cerrada");
      // Para posterioremente borrar las Cookies de la sesion
      window.location.href = "/logout";
    });
  }

  // Cerramos la sesion temporalmente al crear un nuevo usuario
  const NuevoPaciente = document.getElementById("NuevoPaciente");
  if (NuevoPaciente) {
    NuevoPaciente.addEventListener("click", (event) => {
      window.location.href = "/NuevoPaciente";
    });
  }
});

// Y desconcectamos al usuario del socket al cerrar la ventana
window.addEventListener("beforeunload", function (event) {
  socket.disconnect();
});

if (window.location.href.indexOf('/Dashboard') === -1) {
  socket.disconnect();
}


