
# DermaTotalWeb

Este repositorio esta hecho para tener un mejor control de versiones web del Sistema de DermaTotal y sincronizarlo en la nube para evitar perder datos/tener un mejor control de actualizaciones y cambios, asi como trabajo en nuevas funciones y desarrollo del proyecto.




## Instalación

 Si te gustaria hacer uso de este proyecto y/o estructura, asegurate de tener el sigueinte formato en tu archivo .env:
```bash
# Datos de la empresa/debug
COPYRIGHT = "©Copyright (Puedes cambiarlo por cualquier otra cosa pero... este es el texto que se mostrará antes del nombre de la empresa)"
NOMBRE_EMPRESA = "(NOMBRE DE LA EMPRESA)"
VERSION = "1.0.0 (VERSION QUE SE MOSTRARÁ EN EL SISTEMA)"

#Host local
MYSQLDB_HOST = "El nombre de tu usuario conectado a la aqui (localhost)"
MYSQLDB_USER = "La constraseña de tu usuario (root)"

#Password local
MYSQLDB_PASSWORD = Contraseña de tu BD
MYSQLDB_NAME = Nombre de tu BD

# Estos son los puertos locales del sitio 
PUERTO_NODE_LOCAL = 3000 (Donde se conectará Express)

# Estos son los puertos de SQL
MYSQLDB_PORT_LOCAL = 3306
```

Al igual que modificar los Insert's de tu base de datos (Puedes encontraerlos en la ruta `/DB/Inserts.sql`) para que tus tablas tengan los datos que se ajusten mas a tu estrucutra

Si te gustaria añadir mas ramas POST a el proyecto, no olvides de añadirlas en el archivo `/public/api/api_index_post.js` para que detecte 
las rutas POST


## Características

- Vista instantanea de la sala de espera
- Actualizaciones en tiempo real de los pacientes 
- Tag's para identificar las citas
- Diseño Minimalista y facil de usar
- Mejoras considerables en optimizacion a la version anterior
- Capacidad de almacenar y administrar el inventario de medicamentos
- Dar de Alta pacientes
- Creacion de citas 
- Creacion de Recetas con formato 
- Historial Fotografico de pacientes


## 🛠 Tecnologia Utilizada

**Cliente:** ![HTML5](https://img.shields.io/badge/html5-%23E34F26.svg?style=for-the-badge&logo=html5&logoColor=white)![CSS3](https://img.shields.io/badge/css3-%231572B6.svg?style=for-the-badge&logo=css3&logoColor=white) 
![JavaScript](https://img.shields.io/badge/javascript-%23323330.svg?style=for-the-badge&logo=javascript&logoColor=%23F7DF1E) 

**Servidor:** 
![NodeJS](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white) 
![Nodemon](https://img.shields.io/badge/NODEMON-%23323330.svg?style=for-the-badge&logo=nodemon&logoColor=%BBDEAD) 
![Socket.io](https://img.shields.io/badge/Socket.io-black?style=for-the-badge&logo=socket.io&badgeColor=010101) 
![MySQL](https://img.shields.io/badge/mysql-%2300f.svg?style=for-the-badge&logo=mysql&logoColor=white)


## Paleta de Colores

| Color             | Hex                                                                |
| ----------------- | ------------------------------------------------------------------ |
| Azul Claro| ![#249DD9](https://via.placeholder.com/10/249DD9?text=+) #249DD9 |
| Azul Oscuro| ![#004368](https://via.placeholder.com/10/004368?text=+) #004368 |
| Girs claro | ![#EFF5FA](https://via.placeholder.com/10/EFF5FA?text=+) #EFF5FA |
| Gris Oscuro | ![#B0B0B0](https://via.placeholder.com/10/B0B0B0?text=+) #B0B0B0 |
| Verde (Ok)|![#73c235](https://via.placeholder.com/10/73c235?text=+) #73c235 |
| Rojo (Cancelar)|![#ff0000](https://via.placeholder.com/10/ff0000?text=+) #ff0000 |
|Naranja (Editar)|![#ffa500](https://via.placeholder.com/10/ffa500?text=+) #ffa500 |


## Usado por:

Este proyecto y sus derivados están siendo utilizados por:

- DermaTotal



## Soporte Tecnico

Para soporte tecico o preguntas sobre este proyecto, enviame un correo a martintristan_@outlook.com o contactame directamente a mi [Linkedin](https://www.linkedin.com/in/martín-emmanuel-tristán-méndez-762072229/)


## Authors

- [Martin E. Tristán](https://www.linkedin.com/in/martín-emmanuel-tristán-méndez-762072229/)

