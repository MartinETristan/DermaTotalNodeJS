
//Pasa el nombre de usuario y la contraseña para autentificiar
$(document).ready(function () {
  $("#loginForm").submit(function (event) {
    event.preventDefault();
    const usuario = $('#loginForm input[name="NombreUsuario"]').val();
    const contrasena = $('#loginForm input[name="Contrasena"]').val();

    $.post("/login", { usuario, contrasena }, function (data) {
      if (data === "ReadyUser") {
        window.location.href = "/Dashboard";
      } else {
        $(".respuesta").text(data);
      }
    });
  });
});
