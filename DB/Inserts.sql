-- Las aeras de tu clinica
INSERT INTO `Areas` (`idAreas`, `Area`) VALUES
(1, 'Clinica'),
(2, 'Quirúrgica '),
(3, 'Cosmetica'),
(4, 'Depilación '),
(5, 'Personal');


-- Los estados de tu clinica
INSERT INTO `Estado_Citas` (`idEstadoCita`, `Estado`, `Descripción`) VALUES
(1, 'Confirmada', 'La cita fue confirmada con éxito.'),
(2, 'Pendiente ', 'El paciente aun no confirma su cita.'),
(3, 'Cancelada', 'El paciente canceló su cita');


-- Los estados de los consultoros de tu clinica
INSERT INTO `Estado_Consultorio` (`idEstadoConsultorio`, `Estado`, `Descripcion`) VALUES
(1, 'Libre', 'El consultorio se encuentra libre.'),
(2, 'Pendiente', 'Hay un paciente asignado al consultorio.'),
(3, 'Ocupado', 'El consultorio se encuentra ocupado.');


-- Los estados de los pacientes de tu clinica
INSERT INTO `Status` (`idStatus`, `Status`, `Descripción`) VALUES
(1, 'Activo', 'Se encuentra activo.'),
(2, 'Inactivo', 'Se encuentra temporalmente inactivo'),
(3, 'Suspendido', 'Se encuentra temporalmente suspendido'),
(4, 'Baja', 'Fue dado de baja / Ya no se encuentra ');


-- Los Sexos de los usuarios de tu clinica (Puedes añadir mas de ser necesario)
INSERT INTO `Sexo` (`idSexo`, `Sexo`) VALUES
(1, 'Hombre'),
(2, 'Mujer');

-- Los tipos de usuarios de tu clinica
INSERT INTO `TipodeUsuario` (`idTipoUsuario`, `Tipo`, `Descripción`) VALUES
(1, 'SuperAdmin', 'El SuperAdmin tiene la vista completa al Inventario, Corte de caja, Pacientes y Agenda'),
(2, 'Admin', 'El Admin tiene la vista completa al Corte de caja, Pacientes y Agenda'),
(3, 'Doctor', 'El Doctor tiene la vista completa a Pacientes y Agenda'),
(4, 'Recepcion', 'Recepción tiene la vista completa a Ventas, Inventario, Ver pacientes en turno, Buscar Pacientes, Sala de espera y Agenda, así como agregar o modificar las citas y los datos de los pacientes '),
(5, 'RecepcionLite', 'Recepción lite solo puede ver pacientes en turno, hacer corte de caja, cobrar y abrir la TV'),
(6, 'Asociado', 'Las funciones del asociado varían dependiendo del área al que fue asignado/da(como Depilación, recepción o junto un medico en consulta). Tiene acceso únicamente a los pacientes de su área y sus sesiones, así como notas de los mismos'),
(7, 'Paciente', 'Solo puede agendarse una cita y ver su receta.');


-- En caso de requerilo, puedes añadir zonas para algun tratamiento de tu clinica
INSERT INTO `Zona` (`idZona`, `NombreZona`, `Descripción`) VALUES
(1, 'Nariz', NULL),
(2, 'Manos', NULL),
(3, 'Pies', NULL),
(4, 'Frente', NULL),
(5, 'Mejillas', NULL),
(6, 'Axila', NULL),
(7, 'Pecho', NULL),
(8, 'Hombros', NULL),
(9, 'Brazos', NULL),
(10, 'Biceps', NULL),
(11, 'Abdomen', NULL),
(12, 'Glúteos', NULL),
(13, 'Cara Completa', NULL),
(14, 'Muslo', NULL),
(15, 'Brazo Completo', NULL),
(16, 'Espalda', NULL),
(17, 'Cabeza', NULL),
(18, 'Pierna', NULL),
(19, 'Cuerpo Completo', NULL);


-- Las sucursales de tu clinica
INSERT INTO `Sucursales` (`Sucursal`,`NombreSucursal`,`Direccion`,`Telefono`) VALUES
	 ('Ciudad Peluche','Clinica Peluche','742 Evergreen Terrace, Springfield','(5549) 5323 3696'),
	 ('Scranton','Clinica DDPaperCo.','Dunder Mifflin Gift Shop, N Washington Ave, 702, Scranton','(0129) 312 7134');

-- Los consultorios de tu clinica
INSERT INTO `Consultorio` (`idConsultorio`, `idEstadoConsultorio`, `idSucursal`, `NombreConsultorio`) VALUES
(1, 1, 1, 'Consultorio 1'),
(2, 1, 1, 'Consultorio 2'),
(3, 1, 1, 'Consultorio 3'),
(4, 1, 1, 'Consultorio 4'),
(5, 1, 2, 'Consultorio anexo 1'),
(6, 1, 2, 'Consultorio anexo 2'),
(7, 1, 2, 'Consultorio anexo 3'),
(8, 1, 2, 'Consultorio anexo 4');


-- Los procedimientos que realizan en tu clinica
INSERT INTO `Procedimiento` (`idProcedimiento`, `idAreas`, `Procedimiento`, `Precio`, `SesionesTotales`) VALUES
(1, 4, 'Depilación Cuerpo Completo', 22000, 10),
(2, 1, 'Consulta General', 1200, NULL);


-- Esta tabla relaciona los procedimientos con las zonas que se aplican
INSERT INTO `Zona_Procedimiento` (`idZona`, `idProcedimiento`) VALUES
(1, 1),
(2, 1),
(3, 1),
(4, 1),
(5, 1),
(6, 1),
(7, 1),
(8, 1),
(9, 1),
(10,1),
(11,1),
(12,1),
(13,1),
(14,1),
(15,1),
(16,1),
(17,1),
(18,1),
(19, 2);


-- Las categorias de los productos que se venden en tu clinica (para venta eh inventario)
INSERT INTO `CategoriaProducto` (`idCategoriaProducto`, `Categoria`, `Descripcion_Categoria`) VALUES
(1, 'Producto a la Venta', 'Productos que puedes encontrar a venta en DermaTotal'),
(2, 'Producto Medico', 'Todo aquel producto utilizado en las sesiones que NO está a la venta'),
(3, 'Material Medico', 'Material que se utiliza en las sesiones / es utilizado por el medico'),
(4, 'Material de Oficina', 'Material que se utiliza a diario en el consultorio NO medico');


-- Status de los pacientes de tu clinica
INSERT INTO `StatusPaciente` (`idStatusPaciente`, `Estado`, `Descripcion`) VALUES
(1, 'Ausente', 'El paciente no se encuentra.'),
(2, 'En sala de Espera', 'El paciente se encuentra en la sala de espera'),
(3, 'En Consulta', 'El paciente se encuentra en consulta'),
(4, 'Atendido', 'El paciente ya fue atendido');

-- Estilos de los usuarios de tu clinica
INSERT INTO `EstiloWeb` (`Nombre`,`Descripcion`) VALUES
	 ('Default','Este es el estilo general');

-- Categorias de los productos de tu clinica
INSERT INTO `CategoriaProducto` (`Categoria`,`Descripcion_Categoria`) VALUES
	 ('Producto a la Venta','Productos que puedes encontrar a venta en DermaTotal'),
	 ('Producto Medico','Todo aquel producto utilizado en las sesiones que NO está a la venta'),
	 ('Material Medico','Material que se utiliza en las sesiones / es utilizado por el medico'),
	 ('Material de Oficina','Material que se utiliza a diario en el consultorio NO medico');


-- ====================================================================================================
-- Para tener usuarios en tu sistema, es necesario que insertes primero los usuarios y despues su usuario y contraseña
-- en sus respectivas tablas, ya que de lo contrario, no se podrán crear los usuarios y no podrás acceder al sistema
-- ====================================================================================================

INSERT INTO `Usuarios` (`Nombres`,`ApellidoP`,`ApellidoM`,`idSexo`,`Correo`,`Telefono`,`TelefonoSecundario`,`FechadeNacimiento`,`FechaAlta`,`RutaFoto`) VALUES
	 ('Dr. Fulanito','Martinez','Garza',1,'DrFulanito@gmail.com','12311123','22323','2001-10-11','2023-09-11 14:35:30',NULL),
	 ('Dra. Fulatina Andrade','Perez','Hernandez',2,'DraFulanita@gmail.com','12311123','22323','2001-10-11','2023-09-11 14:35:30',NULL),
	 ('Veronica','Portales','Sanchez',2,'Veronica@gmail.com','12311123','22323','2001-10-11','2023-09-11 14:35:30',NULL),
	 ('Rocio','Sanches','Azure',2,'Rocio@gmail.com','12311123','22323','2001-10-11','2023-09-11 14:35:30',NULL),
	 ('Maria','Maria','Maria',2,'Maria@gmail.com','(131) 231 2312','(123) 123 1231','2001-06-30','2023-09-11 14:35:30',NULL),
	 ('Concepción','Treviño',NULL,2,'Concep@gmail.com','12311123','22323','2001-10-11','2023-09-11 14:35:30',NULL),
	 ('Kirby','Toyota','Mitsubishi',2,'Kirby@gmail.com','(868) 111 0035','(123) 123 4333','1980-10-12','2023-09-11 14:35:30',NULL),


-- ====================================================================================================
-- Las contraseñas son generadas con Bycript, por lo que no se pueden ver, pero aqui te dejo unas constraseñas 
-- de ejemplo para que puedas acceder a los usuarios que se crearon: 
-- Usuario: Ejemplo | Contraseña: admin | Encriptada: $2a$10$wrpmFa50fANNmkSFtesaFukjoGanknOjREFrvWfCjdkQmLGLlg1Mq
-- Usuario: Ejemplo2 | Contraseña: root | Encriptada: $2a$10$6tc5gY9ZXDI1SZbcKxtULOg.VsDxThmJVzHV4SZGoidfhZ.itWB3i
-- Usuario: Ejemplo3 | Contraseña: 123456 | Encriptada: $2a$10$LXCem0l7xmIu5hs58D0yGearq2U1lnXjRwYfQ3QbAYnoI5FfEatRW

-- (Cuando entres al localhost vas a insertar la contraseña normal y en la BD se va a guardar encriptada)
-- ====================================================================================================

INSERT INTO `SuperAdmin` (`idUsuario`,`idTipoDeUsuario`,`idStatus`,`idEstiloWeb`,`Usuario`,`Contraseña`) VALUES
	 (1,1,1,1,'root','$2a$10$6tc5gY9ZXDI1SZbcKxtULOg.VsDxThmJVzHV4SZGoidfhZ.itWB3i');


INSERT INTO `Admin` (`idUsuario`,`idTipoDeUsuario`,`idStatus`,`idEstiloWeb`,`Usuario`,`Contraseña`) VALUES
	 (2,2,1,1,'Admin','$2a$10$wrpmFa50fANNmkSFtesaFukjoGanknOjREFrvWfCjdkQmLGLlg1Mq');


INSERT INTO `Doctor` (`idTipoDeUsuario`,`idUsuario`,`idStatus`,`idEstiloWeb`,`Especialidad`,`Universidad`,`CertificadoProf`,`Usuario`,`Contraseña`) VALUES
	 (3,1,1,1,'Pediatria','U.A.N.L., U de G.','21212','Doctor1','$2a$10$LXCem0l7xmIu5hs58D0yGearq2U1lnXjRwYfQ3QbAYnoI5FfEatRW'),
	 (3,2,1,1,'Odontologia','U.A.T.','121231','Doctor2','$$2a$10$LXCem0l7xmIu5hs58D0yGearq2U1lnXjRwYfQ3QbAYnoI5FfEatRW');


INSERT INTO `Recepcionista` (`idUsuario`,`idTipoDeUsuario`,`idSucursal`,`idStatus`,`idEstiloWeb`,`Usuario`,`Contraseña`) VALUES
	 (3,5,1,1,1,'VERO','$2a$10$LXCem0l7xmIu5hs58D0yGearq2U1lnXjRwYfQ3QbAYnoI5FfEatRW'),
	 (4,4,1,1,1,'ROCIO','$2a$10$LXCem0l7xmIu5hs58D0yGearq2U1lnXjRwYfQ3QbAYnoI5FfEatRW'),
	 (5,4,2,1,1,'MARIA','$2a$10$LXCem0l7xmIu5hs58D0yGearq2U1lnXjRwYfQ3QbAYnoI5FfEatRW');


INSERT INTO `Asociado` (`idUsuario`,`idTipoDeUsuario`,`idSucursal`,`idStatus`,`idEstiloWeb`,`Usuario`,`Contraseña`) VALUES
	 (6,6,1,1,1,'CONCEP','$2a$10$LXCem0l7xmIu5hs58D0yGearq2U1lnXjRwYfQ3QbAYnoI5FfEatRW'),
	 (7,6,1,1,1,'KIRBY','$2a$10$LXCem0l7xmIu5hs58D0yGearq2U1lnXjRwYfQ3QbAYnoI5FfEatRW');




--
-- Inserts de prueba para probar las funciones de la BD con valores de ejemplo y temporales 
--

-- Usuarios de prueba
INSERT INTO `Usuarios` (`Nombres`,`ApellidoP`,`ApellidoM`,`idSexo`,`Correo`,`Telefono`,`TelefonoSecundario`,`FechadeNacimiento`,`FechaAlta`,`RutaFoto`) VALUES
	 ('Loui','Recio','Izaguirre',1,'mad@gmail.com','(956) 617 3091','(827) 373 7833','2013-10-11','2023-09-26 13:47:15','/public/private/src/img/Perfil/8/Panchito.jpg'),
	 ('Panchito','Tristan','',1,'','','','1999-10-05','2023-10-17 12:43:40','/public/private/src/img/Perfil/9/Panchito.jpg'),
	 ('Carlos','Trejo','',1,'','','','2005-03-04','2023-11-04 15:58:25','/public/private/src/img/Perfil/10/Carlos.jpeg');
	 ('Jose Paciente','Gonzales','Smith',1,'','','','2005-03-04','2023-11-04 15:58:25',NULL),
	 ('Jose Paciente 2','Gonzales','Smith',1,'','','','2005-03-04','2023-11-04 15:58:25',NULL);
-- (Asegurate que la ruta de la foto sea correcta y completa (ya sea desde C:/ o /User/), ya que si no, no se va a mostrar la foto del usuario)

-- Pacientes de prueba (basados en los usuarios de prueba)
INSERT INTO `Paciente` (`idUsuario`,`idTipoDeUsuario`,`idStatus`,`idEstiloWeb`,`Usuario`,`Contraseña`) VALUES
	 (11,7,1,1,'JosePaciente','$2a$10$yc3TMgfEC8j0G50abZn2RO4TEz5L4Vaad1Y3QC2gICkbFCfcIsOca'),
	 (12,7,1,1,'JosePaciente2','$2a$10$K5O5QCZY4qnnFuVXg/0vwu2xQRbFQUcjODIUkd7kqY8EyDGJHcroq'),
	 (8,7,1,1,'Pan2658','$2a$10$Dg5/DyhoAMS2ns6S7ifrUu4N6fnUUyjoKIcu6IORSFoyH8269PV/K'),
	 (9,7,1,1,'Pan1746','$2a$10$e8wXcRQ2J06YwE2AjRrDk.ryBev.xtqKMec929PLSKjNGdMPvrQSe'),
	 (10,7,1,1,'Car451','$2a$10$zxqmV1.XlMPxvHIyB1IsuOZpfhdcnINECnBK4Fn6FEdipGw8EVOQe');

-- Registro de Alta de pacientes
INSERT INTO `Alta_Paciente` (`idDoctor`,`idRecepcionista`,`idPaciente`) VALUES
	 (1,NULL,3),
	 (1,NULL,4),
	 (1,NULL,5);


-- Padecimientos de prueba
INSERT INTO `Padecimientos` (`idArea`,`Padecimiento`) VALUES
	 (1,'Acné'),
	 (1,'Acné Rosácea'),
	 (1,'Alopecia'),
	 (1,'Cicatrices'),
	 (1,'Dermatitis'),
	 (1,'Eczema'),
	 (1,'Enfermedades de Transmisión Sexual'),

-- Historial Clinico de prueba
INSERT INTO `HistorialClinico` (`idPaciente`,`A_HF`,`A_NP`,`A_PP`,`Alergias`) VALUES
	 (1,'Si presenta','Si presenta','YA NO PRESENTA',NULL),
	 (2,NULL,NULL,NULL,NULL),
	 (3,'DM2 PADRES','ALCOHOL SOCIAL','NEGADO','PENICILINA'),
	 (4,NULL,NULL,NULL,NULL),
	 (5,NULL,NULL,NULL,NULL);


-- Citas de prueba
INSERT INTO `Citas` (`idEstadoCita`,`idSucursal`,`idDoctor`,`idAsociado`,`idPaciente`,`idStatusPaciente`,`HoraCita`,`FinCita`,`HoraLlegada`,`Nota`) VALUES
	 (1,1,1,NULL,1,3,'2024-01-06 14:45:00','2024-01-06 15:15:00','2024-01-06 13:53:31','No se le va a aplicar Botox'),
	 (1,1,1,NULL,4,1,'2024-01-06 13:00:00','2024-01-06 13:30:00',NULL,'Cita para aplicar Sculptra'),
	 (1,1,1,NULL,2,1,'2024-01-06 12:00:00','2024-01-06 12:30:00',NULL,'Recordar si utiizo tratamiento'),
	 (1,1,1,NULL,3,1,'2024-01-06 11:30:00','2024-01-06 12:00:00',NULL,'Quitar Lineas de Expresion'),
	 (1,1,1,NULL,5,1,'2024-01-06 12:30:00','2024-01-06 13:00:00',NULL,'Esta cita solo es para darle continuidad');


