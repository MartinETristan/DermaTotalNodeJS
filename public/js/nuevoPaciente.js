// Obtener la fecha actual en formato YYYY-MM-DD
const fechaActual = new Date().toISOString().split("T")[0];

// Asignamos la fecha actual como valor predeterminado al input de fecha
document.getElementById("FechaNacimiento").value = fechaActual;

const DefImg = "/img/UserIco.webp";
const InputFile = document.getElementById("SubirFoto");
const img = document.getElementById("img");
const validImageFormats = ["image/jpeg", "image/png"];

let selectedImage = null; // Almacenar la imagen seleccionada

// Codigo para mostrar la imagen seleccionada en el input file
InputFile.addEventListener("change", (e) => {
  if (e.target.files[0]) {
    if (validImageFormats.includes(e.target.files[0].type)) {
      let reader = new FileReader();
      reader.onload = (e) => {
        img.setAttribute("src", e.target.result); // Muestra la imagen seleccionada
      };
      reader.readAsDataURL(e.target.files[0]);
    } else {
      // Mostrar mensaje de error o hacer algo cuando el formato no es válido
      img.setAttribute("src", DefImg);
      console.log(
        "Formato de imagen no válido. Por favor, selecciona una imagen JPEG, PNG o GIF."
      );
    }
  } else {
    img.setAttribute("src", DefImg);
    selectedImage = null; // Reiniciar la imagen seleccionada
  }
});

$.ajax({
  url: "/InfoRegistros",
  type: "POST",
  dataType: "json",
  success: function (data) {
    const Sexo = document.getElementById("Sexo");
    data.Sexo.forEach((element) => {
      const Lista = new Option(element.Sexo, element.idSexo);
      Sexo.appendChild(Lista);
    });
  },
});





//Pasar los datos del formulario a un objeto JSON
document.addEventListener('DOMContentLoaded', () => {

// Le damos formato a los campos de texto para Telefonos y Correo
function formatPhoneNumber(e) {
  let value = e.target.value.replace(/\D/g, ''); // Eliminar todos los caracteres no numéricos

  if (value.length > 3 && value.length <= 6) {
      value = '(' + value.substring(0, 3) + ') ' + value.substring(3);
  } else if (value.length > 6) {
      value = '(' + value.substring(0, 3) + ') ' + value.substring(3, 6) + ' ' + value.substring(6, 10);
  }

  e.target.value = value;
}

// Función de validación de email
function validateEmail(e) {
    // Esta expresión regular verifica un correo con el formato x@x.com
    const re = /^[a-zA-Z0-9]+@[a-zA-Z0-9]+\.[a-zA-Z]{2,4}$/;
    const isValid = re.test(e.target.value);
    
    e.target.style.borderColor = isValid ? 'green' : 'red';
}

// Agregar eventos a los campos de teléfono
['Telefono', 'TelefonoSecundario'].forEach(id => {
  const element = document.getElementById(id);
  element.addEventListener('input', formatPhoneNumber);
});

// Agregar evento al campo de correo
const Correo = document.getElementById('Correo');
Correo.addEventListener('input', validateEmail);



  const CrearPacienteForm = document.getElementById('DatosGenerales');
  CrearPacienteForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    // Validar que el nombre de usuario no esté vacío
   if($('#Nombres').val()===''){
    alert('Por favor ingrese un nombre de usuario');
    return;
   }
    const formData = new FormData();
    // Gerarquia de envio de datos del formulario para que se pueda crear correctamente la foto en caso de que exista
    formData.append('Nombres', $('#Nombres').val());
    formData.append('ApellidoP', $('#ApellidoP').val());
    formData.append('ApellidoM', $('#ApellidoM').val());
    formData.append('idSexo', $('#Sexo').val());
    formData.append('FechaNacimiento', $('#FechaNacimiento').val());
    formData.append('Telefono', $('#Telefono').val());
    formData.append('TelefonoSecundario', $('#TelefonoSecundario').val());
    formData.append('Correo', $('#Correo').val());
    formData.append('Protocolo', $('#Protocolo').val());
  
    // Agregar el archivo al final solo si existe
    if ($('#SubirFoto')[0].files.length > 0) {
      formData.append('file', $('#SubirFoto')[0].files[0]);
    }
  
    $.ajax({
      url: '/CrearPaciente',
      type: 'POST',
      data: formData,
      processData: false,
      contentType: false,
      success: function(response) {
        // Si todo se agrega con extio, se pone todo en blanco y re respoduce la animacion exitosa
        const togglemenu = document.querySelector(".BGExito");
        togglemenu.classList.toggle("active");
        // Y despues de 3 segundos se pasa al dashboard 
        setTimeout(function() {
          window.location.href = '/Dashboard';
        }, 3000);
      },
      error: function(error) {
        console.error('Error:', error);
      }
    });

  });
});

