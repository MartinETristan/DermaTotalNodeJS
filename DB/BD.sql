CREATE TABLE `Admin`  (
  `idAdmin` int NOT NULL AUTO_INCREMENT,
  `idUsuario` int NOT NULL COMMENT 'Quien es?',
  `idTipoDeUsuario` int NOT NULL DEFAULT 2 COMMENT 'El TipodeUsuario (2)',
  `idStatus` int NOT NULL DEFAULT 1 COMMENT 'Estado del usuario',
  `idEstiloWeb` int NOT NULL DEFAULT 1 COMMENT 'El estilo web elegido',
  `Usuario` varchar(255) NOT NULL COMMENT 'El Usuario con el se iniciara Sesión',
  `Contraseña` varchar(255) NOT NULL COMMENT 'La Contraseña con la que se iniciará Sesión',
  PRIMARY KEY (`idAdmin`)
);

CREATE TABLE `Alta_Paciente`  (
  `idAltaPaciente` int NOT NULL AUTO_INCREMENT,
  `idDoctor` int NULL COMMENT 'El Doctor que dio de Alta',
  `idRecepcionista` int NULL COMMENT 'La recepcionsita que lo dio de alta',
  `idPaciente` int NOT NULL COMMENT 'El paciente registrado\n',
  PRIMARY KEY (`idAltaPaciente`)
);

CREATE TABLE `Areas`  (
  `idAreas` int NOT NULL AUTO_INCREMENT,
  `Area` varchar(50) NULL COMMENT 'Clinica, Quirurgica, Cosmetica, Depilación, Personal\n',
  PRIMARY KEY (`idAreas`)
);

CREATE TABLE `Areas_Asociado`  (
  `idAsociado` int NOT NULL,
  `idAreas` int NOT NULL
);

CREATE TABLE `Asociado`  (
  `idAsociado` int NOT NULL AUTO_INCREMENT,
  `idUsuario` int NOT NULL,
  `idTipoDeUsuario` int NOT NULL DEFAULT 6 COMMENT 'El TipodeUsuario (6)',
  `idSucursal` int NOT NULL COMMENT 'De que sucursal es?',
  `idStatus` int NOT NULL DEFAULT 1 COMMENT 'Estado del usuario',
  `idEstiloWeb` int NOT NULL DEFAULT 1 COMMENT 'El estilo web elegido',
  `Usuario` varchar(255) NOT NULL COMMENT 'El Usuario con el se iniciara Sesión',
  `Contraseña` varchar(255) NOT NULL COMMENT 'La Contraseña con la que se iniciará Sesión',
  PRIMARY KEY (`idAsociado`)
);

CREATE TABLE `CategoriaProducto`  (
  `idCategoriaProducto` int NOT NULL AUTO_INCREMENT,
  `Categoria` varchar(255) NOT NULL COMMENT 'Material Medico /  Prodcuto Medico',
  `Descripcion_Categoria` varchar(255) NULL COMMENT 'Descripcion de la categoria',
  PRIMARY KEY (`idCategoriaProducto`)
);

CREATE TABLE `Citas`  (
  `idCitas` int NOT NULL AUTO_INCREMENT,
  `idEstadoCita` int NOT NULL DEFAULT 2 COMMENT 'Activa, Pendiente, Cancelada\n',
  `idSucursal` int NOT NULL COMMENT 'Para que sucursal es la cita?',
  `idDoctor` int NULL COMMENT 'Con que Doctor',
  `idAsociado` int NULL COMMENT 'Con que Asociado',
  `idPaciente` int NOT NULL COMMENT 'El paciente al que se le está generando la cita\n',
  `idStatusPaciente` int NOT NULL DEFAULT 1 COMMENT 'En que parte de la cita se encuentra? Ya llego? Ya fue atendido? Ya esta en consulta?',
  `HoraCita` datetime NOT NULL COMMENT 'Dia de la cita\n',
  `FinCita` datetime NOT NULL COMMENT 'La duracion asignada a la consulta',
  `HoraLlegada` datetime NULL COMMENT 'La hora ala que llego el paciete',
  `Nota` varchar(500) NULL COMMENT 'En caso de que se tenga una nota para la siguiente cita\n',
  PRIMARY KEY (`idCitas`)
);

CREATE TABLE `ClientesFacturacion`  (
  `idFactura` int NOT NULL AUTO_INCREMENT,
  `idPago` int NOT NULL,
  `idPaciente` int NOT NULL,
  `Nombre` varchar(255) NOT NULL,
  `ApellidoM` varchar(255) NOT NULL,
  `ApellidoP` varchar(255) NOT NULL,
  `RegimenFiscal` varchar(255) NOT NULL,
  `RFC` varchar(255) NOT NULL,
  `Telefono` varchar(15) NOT NULL,
  `CodigoPostal` int NOT NULL,
  PRIMARY KEY (`idFactura`)
);

CREATE TABLE `Consultorio`  (
  `idConsultorio` int NOT NULL AUTO_INCREMENT,
  `idEstadoConsultorio` int NOT NULL,
  `idSucursal` int NOT NULL,
  `NombreConsultorio` varchar(255) NULL COMMENT 'C1,C2,C3,C4',
  PRIMARY KEY (`idConsultorio`)
);

CREATE TABLE `Creacion_Citas`  (
  `idCreacion_citas` int NOT NULL AUTO_INCREMENT,
  `idDoctor` int NULL,
  `idRecepcionista` int NULL,
  `idCitas` int NOT NULL,
  `Fecha` datetime NOT NULL,
  PRIMARY KEY (`idCreacion_citas`)
);

CREATE TABLE `Doctor`  (
  `idDoctor` int NOT NULL AUTO_INCREMENT,
  `idTipoDeUsuario` int NOT NULL DEFAULT 3 COMMENT 'El TipodeUsuario (3)',
  `idUsuario` int NOT NULL COMMENT 'Quien es?',
  `idStatus` int NOT NULL DEFAULT 1 COMMENT 'Estado del usuario',
  `idEstiloWeb` int NOT NULL DEFAULT 1 COMMENT 'El estilo web elegido',
  `Especialidad` varchar(255) NOT NULL COMMENT 'En que se especializa?',
  `Universidad` varchar(255) NOT NULL COMMENT 'Donde estudió?',
  `CertificadoProf` varchar(255) NOT NULL COMMENT 'El certificado Profecional',
  `Usuario` varchar(255) NOT NULL COMMENT 'El Usuario con el se iniciara Sesión',
  `Contraseña` varchar(255) NOT NULL COMMENT 'La Contraseña con la que se iniciará Sesión',
  PRIMARY KEY (`idDoctor`)
);

CREATE TABLE `EntradasProducutos_Productos`  (
  `idEntradasProdcutos_Productos` int NOT NULL AUTO_INCREMENT,
  `idMovimiento_EntradasProductos` int NOT NULL,
  `idProductos` int NOT NULL,
  `Fecha` datetime NOT NULL,
  `CantidadAnterior` double NULL,
  `NuevaCantidad` double NULL,
  PRIMARY KEY (`idEntradasProdcutos_Productos`)
);

CREATE TABLE `Equipo`  (
  `idEquipo` int NOT NULL AUTO_INCREMENT,
  `idStatus` int NOT NULL DEFAULT 1 COMMENT 'Se ecuentra Activa? Inactiva? Susepndida o Baja?\n',
  `NombreEquipo` varchar(255) NOT NULL COMMENT 'El nombre del instrumento o herramienta\n',
  `Caracteristicas` varchar(500) NULL COMMENT 'Las caracteristicas del equipo\n',
  PRIMARY KEY (`idEquipo`)
);

CREATE TABLE `Estado_Citas`  (
  `idEstadoCita` int NOT NULL AUTO_INCREMENT,
  `Estado` varchar(50) NOT NULL COMMENT 'Activa, Pendiente, Cancelada',
  `Descripción` varchar(255) NULL,
  PRIMARY KEY (`idEstadoCita`)
);

CREATE TABLE `Estado_Consultorio`  (
  `idEstadoConsultorio` int NOT NULL AUTO_INCREMENT,
  `Estado` varchar(255) NOT NULL,
  `Descripcion` varchar(255) NULL,
  PRIMARY KEY (`idEstadoConsultorio`)
);

CREATE TABLE `EstiloWeb`  (
  `idEstiloWeb` int NOT NULL AUTO_INCREMENT,
  `Nombre` varchar(255) NULL,
  `Descripcion` varchar(255) NULL,
  PRIMARY KEY (`idEstiloWeb`)
);

CREATE TABLE `FotosHistorial_Paciente`  (
  `idFotosHistorial_Paciente` int NOT NULL AUTO_INCREMENT,
  `idFotoHistorialClinico` int NULL,
  `idPaciente` int NULL,
  `idSesion` int NULL,
  PRIMARY KEY (`idFotosHistorial_Paciente`)
);

CREATE TABLE `FotosHistorialClinico`  (
  `idFotoHistorialClinico` int NOT NULL AUTO_INCREMENT,
  `RutaFoto` varchar(500) NOT NULL,
  `FechaFoto` date NOT NULL,
  PRIMARY KEY (`idFotoHistorialClinico`)
);

CREATE TABLE `Historial_Precio_Productos`  (
  `idHistorialProducto` int NOT NULL AUTO_INCREMENT,
  `idProducto` int NOT NULL,
  `NombreProducto` varchar(255) NOT NULL,
  `Precio` double NOT NULL,
  `Fecha` date NOT NULL,
  PRIMARY KEY (`idHistorialProducto`)
);

CREATE TABLE `Historial_Promociones`  (
  `idHistorialPromocion` int NOT NULL AUTO_INCREMENT,
  `idProcedminento` int NOT NULL,
  `NombreProcedimiento` varchar(255) NOT NULL,
  `Precio` double NOT NULL,
  `Fecha` date NOT NULL,
  `Nota` varchar(500) NULL,
  PRIMARY KEY (`idHistorialPromocion`)
);

CREATE TABLE `HistorialClinico`  (
  `idHistorialClinico` int NOT NULL AUTO_INCREMENT,
  `idPaciente` int NOT NULL,
  `A_HF` varchar(1000) NULL,
  `A_NP` varchar(1000) NULL,
  `A_PP` varchar(1000) NULL,
  `Alergias` varchar(1000) NULL,
  `NotasPaciente` varchar(1000) NULL,
  PRIMARY KEY (`idHistorialClinico`)
);

CREATE TABLE `Login_Out`  (
  `idLogin_Out` int NOT NULL AUTO_INCREMENT,
  `idUsuario` int NOT NULL,
  `Login` datetime NULL,
  `Logout` datetime NULL,
  PRIMARY KEY (`idLogin_Out`)
);

CREATE TABLE `Medicamento`  (
  `idMedicamento` int NOT NULL AUTO_INCREMENT,
  `Medicamento` varchar(255) NOT NULL,
  `Indicacion` varchar(1000) NOT NULL,
  PRIMARY KEY (`idMedicamento`)
);

CREATE TABLE `Medicamento_Receta`  (
  `idMedicamento_Receta` int NOT NULL AUTO_INCREMENT,
  `idMedicamento` int NULL,
  `idReceta_Pacientes` int NULL,
  `Orden` int NULL,
  PRIMARY KEY (`idMedicamento_Receta`)
);

CREATE TABLE `Movimiento_EntradasProducutos`  (
  `idMovimiento_EntradasProdcutos` int NOT NULL AUTO_INCREMENT,
  `idUsuario` int NOT NULL,
  `Fecha` datetime NOT NULL,
  PRIMARY KEY (`idMovimiento_EntradasProdcutos`)
);

CREATE TABLE `Paciente`  (
  `idPaciente` int NOT NULL AUTO_INCREMENT,
  `idUsuario` int NOT NULL COMMENT 'Quien es?',
  `idTipoDeUsuario` int NOT NULL DEFAULT 7 COMMENT 'El TipodeUsuario (7)',
  `idStatus` int NOT NULL DEFAULT 1 COMMENT 'Estado del usuario',
  `idEstiloWeb` int NOT NULL DEFAULT 1 COMMENT 'El estilo web elegido',
  `Usuario` varchar(255) NOT NULL COMMENT 'El Usuario con el se iniciara Sesión',
  `Contraseña` varchar(255) NOT NULL COMMENT 'La Contraseña con la que se iniciará Sesión',
  PRIMARY KEY (`idPaciente`)
);

CREATE TABLE `Pacientes_Pedidos`  (
  `idCitas` int NOT NULL,
  `idDoctor` int NOT NULL,
  `idConsultorio` int NOT NULL
);

CREATE TABLE `Padecimientos`  (
  `idPadecimiento` int NOT NULL AUTO_INCREMENT,
  `idArea` int NOT NULL,
  `Padecimiento` varchar(255) NOT NULL COMMENT 'Nombre de la enfermedad (Acné, Vitiligo etc.)',
  PRIMARY KEY (`idPadecimiento`)
);

CREATE TABLE `Pago`  (
  `idPago` int NOT NULL AUTO_INCREMENT,
  `idRecepcionista` int NOT NULL,
  `idTipoDePago` int NOT NULL,
  `Total` double NULL,
  `Pago` double NULL,
  `Cambio` double NULL,
  `No.Autoizacion` int NULL,
  `FechaPago` datetime NOT NULL,
  PRIMARY KEY (`idPago`)
);

CREATE TABLE `Procedimiento`  (
  `idProcedimiento` int NOT NULL AUTO_INCREMENT,
  `idAreas` int NOT NULL,
  `idEquipo` int NULL COMMENT 'El equipo que se está utilizando (en caso de utilizar alguno)',
  `Procedimiento` varchar(255) NOT NULL COMMENT 'Nombre del Procedimiento',
  `Precio` double NOT NULL COMMENT 'Costo del procedimiento',
  `SesionesTotales` int NULL COMMENT 'Numero total de sesiones',
  PRIMARY KEY (`idProcedimiento`)
);

CREATE TABLE `Procedimiento_Citas`  (
  `idProcedimiento_Citas` int NOT NULL AUTO_INCREMENT,
  `idProcedimiento` int NOT NULL,
  `idCitas` int NOT NULL,
  PRIMARY KEY (`idProcedimiento_Citas`)
);

CREATE TABLE `Productos`  (
  `idProducto` int NOT NULL AUTO_INCREMENT,
  `idCategoriaProducto` int NOT NULL COMMENT 'El producto esta a la venta o forma parte de algo interno?',
  `idStatus` int NOT NULL DEFAULT 1 COMMENT 'El producto esta activo o inactivo? (0 inactivo 1 actvio)',
  `Producto` varchar(255) NOT NULL COMMENT 'Nombre del Producto',
  `CodigoDeBarra` int NULL COMMENT 'El numero de serial',
  `Cantidad` int NOT NULL COMMENT 'Cantidad de productos restantes',
  `FechaEntrada` datetime NOT NULL COMMENT 'Dia en que llego el producto',
  `CostoProducto` double NULL COMMENT 'El precio al que fue comprado',
  `Precio` double NULL COMMENT 'El precio a la venta',
  PRIMARY KEY (`idProducto`)
);

CREATE TABLE `Recepcionista`  (
  `idRecepcionista` int NOT NULL AUTO_INCREMENT,
  `idUsuario` int NOT NULL COMMENT 'Quien es?',
  `idTipoDeUsuario` int NOT NULL DEFAULT 4 COMMENT 'El TipodeUsuario (4 y 5 para Lite)',
  `idSucursal` int NOT NULL COMMENT 'De que sucursal es',
  `idStatus` int NOT NULL DEFAULT 1 COMMENT 'Estado del usuario',
  `idEstiloWeb` int NOT NULL DEFAULT 1 COMMENT 'El estilo web elegido',
  `Usuario` varchar(255) NOT NULL COMMENT 'El Usuario con el se iniciara Sesión',
  `Contraseña` varchar(255) NOT NULL COMMENT 'La Contraseña con la que se iniciará Sesión',
  PRIMARY KEY (`idRecepcionista`)
);

CREATE TABLE `Receta_Pacientes`  (
  `idReceta_Pacientes` int NOT NULL AUTO_INCREMENT,
  `idPaciente` int NOT NULL,
  `idDoctor` int NOT NULL,
  `idSesion` int NULL,
  `Fecha` datetime NULL,
  `Nota` varchar(1000) NULL,
  PRIMARY KEY (`idReceta_Pacientes`)
);

CREATE TABLE `Registro_Confirmacion`  (
  `idRegistroConfirmacion` int NOT NULL AUTO_INCREMENT,
  `idUsuario` int NOT NULL COMMENT 'El usuario que realizó cambios a la cita',
  `idTipodeUsuario` int NOT NULL COMMENT 'Con que tipo de usuario realizó los cambios',
  `idCita` int NOT NULL COMMENT 'La cita que se cambió',
  `idEstadoAnterior` int NOT NULL COMMENT 'El estado anterior de la cita',
  `idNuevoEstado` int NOT NULL COMMENT 'El nuevo estado de la cita',
  `Fecha` datetime NOT NULL COMMENT 'El dia que se realizó el cambio',
  PRIMARY KEY (`idRegistroConfirmacion`)
);

CREATE TABLE `RegistroTratamientos`  (
  `idRegistroTratamientos` int NOT NULL AUTO_INCREMENT,
  `idEquipo` int NULL,
  `idProcedimiento` int NULL,
  `idZona` int NULL,
  `SesionesActuales` int NULL DEFAULT 0,
  `SesionesTotales` int NULL DEFAULT 0,
  `Intensidad` int NULL,
  PRIMARY KEY (`idRegistroTratamientos`)
);

CREATE TABLE `Seguimientos`  (
  `idSeguimientos` int NOT NULL AUTO_INCREMENT,
  `idPadecimiento` int NULL,
  `Seguimiento` varchar(1500) NULL,
  PRIMARY KEY (`idSeguimientos`)
);

CREATE TABLE `Seguimientos_Sesion`  (
  `idSeguimientos_Sesion` int NOT NULL AUTO_INCREMENT,
  `idSesion` int NOT NULL,
  `idSeguimientos` int NOT NULL,
  PRIMARY KEY (`idSeguimientos_Sesion`)
);

CREATE TABLE `Sesion`  (
  `idSesion` int NOT NULL AUTO_INCREMENT,
  `idPago` int NULL,
  `idCitas` int NULL,
  `idConsultorio` int NULL,
  `idDoctor` int NULL,
  `idAsociado` int NULL,
  `idPaciente` int NULL,
  `InicioDeSesion` datetime NULL,
  `FinDeSesion` datetime NULL,
  `CheckOut` varchar(500) NULL,
  PRIMARY KEY (`idSesion`)
);

CREATE TABLE `Sexo`  (
  `idSexo` int NOT NULL AUTO_INCREMENT,
  `Sexo` varchar(255) NOT NULL,
  PRIMARY KEY (`idSexo`)
);

CREATE TABLE `Status`  (
  `idStatus` int NOT NULL AUTO_INCREMENT,
  `Status` varchar(255) NOT NULL COMMENT 'Activo, Inactivo, Suspendido, Baja',
  `Descripción` varchar(255) NOT NULL,
  PRIMARY KEY (`idStatus`)
);

CREATE TABLE `StatusCorreo`  (
  `idUsuario` int NOT NULL,
  `idStatus` int NOT NULL
);

CREATE TABLE `StatusPaciente`  (
  `idStatusPaciente` int NOT NULL AUTO_INCREMENT,
  `Estado` varchar(255) NOT NULL COMMENT 'Se enceuntra en sala de espera o en consulta o en otro tipo de estado?',
  `Descripcion` varchar(255) NOT NULL COMMENT 'Descripcion de dicho estado',
  PRIMARY KEY (`idStatusPaciente`)
);

CREATE TABLE `Sucursales`  (
  `idSucursal` int NOT NULL AUTO_INCREMENT,
  `Sucursal` varchar(255) NOT NULL COMMENT 'Matamoros, Rio Bravo\n',
  `NombreSucursal` varchar(255) NOT NULL COMMENT 'El nombre de la sucursal',
  `Direccion` varchar(255) NOT NULL COMMENT 'La direccion del Consultorio sucursal',
  `Telefono` varchar(50) NOT NULL COMMENT 'Telefono de a plaza medica o recepcion ',
  PRIMARY KEY (`idSucursal`)
);

CREATE TABLE `SuperAdmin`  (
  `idSuperAdmin` int NOT NULL AUTO_INCREMENT,
  `idUsuario` int NOT NULL COMMENT 'Quien es?',
  `idTipoDeUsuario` int NOT NULL DEFAULT 1 COMMENT 'El TipodeUsuario (1)',
  `idStatus` int NOT NULL DEFAULT 1 COMMENT 'Estado del usuario',
  `idEstiloWeb` int NOT NULL DEFAULT 1 COMMENT 'El estilo web elegido',
  `Usuario` varchar(255) NOT NULL COMMENT 'El Usuario con el se iniciara Sesión',
  `Contraseña` varchar(255) NOT NULL COMMENT 'La Contraseña con la que se iniciará Sesión',
  PRIMARY KEY (`idSuperAdmin`)
);

CREATE TABLE `Tipo_de_Pago`  (
  `idTipoDePago` int NOT NULL AUTO_INCREMENT,
  `Nombre` varchar(255) NOT NULL COMMENT 'USD, MXN, Tarjeta, Cortesia',
  `Descripción` varchar(255) NULL,
  PRIMARY KEY (`idTipoDePago`)
);

CREATE TABLE `TipodeUsuario`  (
  `idTipoUsuario` int NOT NULL AUTO_INCREMENT,
  `Tipo` varchar(50) NOT NULL COMMENT 'Doctor, Paciente, Recepcionista, Asociado a Consultorio\n\n',
  `Descripción` varchar(255) NULL,
  PRIMARY KEY (`idTipoUsuario`)
);

CREATE TABLE `Tratamientos_Sesion`  (
  `idTratamientos_Sesion` int NOT NULL AUTO_INCREMENT,
  `idRegistroTratamientos` int NULL,
  `idSesion` int NULL,
  `idEquipo` int NULL,
  `Registro_Intensidad` int NULL,
  `Nota` varchar(500) NULL,
  PRIMARY KEY (`idTratamientos_Sesion`)
);

CREATE TABLE `Usuarios`  (
  `idUsuario` int NOT NULL AUTO_INCREMENT,
  `Nombres` varchar(50) NOT NULL,
  `ApellidoP` varchar(50) NULL,
  `ApellidoM` varchar(50) NULL,
  `idSexo` int NOT NULL,
  `Correo` varchar(100) NULL,
  `Telefono` varchar(15) NULL,
  `TelefonoSecundario` varchar(15) NULL,
  `FechadeNacimiento` date NULL,
  `FechaAlta` datetime NULL,
  `RutaFoto` varchar(500) NULL,
  PRIMARY KEY (`idUsuario`)
);

CREATE TABLE `Venta_Producto`  (
  `idVentaProd` int NOT NULL AUTO_INCREMENT,
  `idProducto` int NOT NULL COMMENT 'El producto Vendido',
  `idVenta` int NULL COMMENT 'El id de la venta',
  `Cantidad` int NOT NULL COMMENT 'Cuanto de el se vendió\n',
  PRIMARY KEY (`idVentaProd`)
);

CREATE TABLE `VentaCliente`  (
  `idVentaCliente` int NOT NULL AUTO_INCREMENT,
  `Nombre` varchar(255) NOT NULL,
  `Apellidos` varchar(255) NOT NULL,
  PRIMARY KEY (`idVentaCliente`)
);

CREATE TABLE `Ventas`  (
  `idVenta` int NOT NULL AUTO_INCREMENT COMMENT 'El id de la venta de varios prodcutos',
  `idUsuario` int NULL COMMENT 'A que usuario se le vendio el prodcuto?',
  `idVentaCliente` int NULL COMMENT 'A quien se le vendio el producto? ',
  `idPago` int NULL COMMENT 'Aqui esta el id del pago por el total',
  `Total` double NOT NULL COMMENT 'Aqui esta la suma total de los medicamentos ',
  PRIMARY KEY (`idVenta`)
);

CREATE TABLE `Zona`  (
  `idZona` int NOT NULL AUTO_INCREMENT,
  `NombreZona` varchar(255) NOT NULL COMMENT 'Zona del cuerpo donde se realiza el procedimiento\n',
  `Descripción` varchar(255) NULL,
  PRIMARY KEY (`idZona`)
);

CREATE TABLE `Zona_Procedimiento`  (
  `idZona` int NOT NULL,
  `idProcedimiento` int NOT NULL
);

ALTER TABLE `Admin` ADD CONSTRAINT `fk_Admin_Usuarios_1` FOREIGN KEY (`idUsuario`) REFERENCES `Usuarios` (`idUsuario`);
ALTER TABLE `Admin` ADD CONSTRAINT `fk_Admin_TipodeUsuario_1` FOREIGN KEY (`idTipoDeUsuario`) REFERENCES `TipodeUsuario` (`idTipoUsuario`);
ALTER TABLE `Admin` ADD CONSTRAINT `fk_Admin_Status_1` FOREIGN KEY (`idStatus`) REFERENCES `Status` (`idStatus`);
ALTER TABLE `Admin` ADD CONSTRAINT `fk_Admin_EstiloWeb_1` FOREIGN KEY (`idEstiloWeb`) REFERENCES `EstiloWeb` (`idEstiloWeb`);
ALTER TABLE `Alta_Paciente` ADD CONSTRAINT `fk_Alta_Paciente_Doctor_1` FOREIGN KEY (`idDoctor`) REFERENCES `Doctor` (`idDoctor`);
ALTER TABLE `Alta_Paciente` ADD CONSTRAINT `fk_Alta_Paciente_Recepcionista_1` FOREIGN KEY (`idRecepcionista`) REFERENCES `Recepcionista` (`idRecepcionista`);
ALTER TABLE `Alta_Paciente` ADD CONSTRAINT `fk_Alta_Paciente_Paciente_1` FOREIGN KEY (`idPaciente`) REFERENCES `Paciente` (`idPaciente`);
ALTER TABLE `Areas_Asociado` ADD CONSTRAINT `fk_Areas_Asociado 1_Asociado_1` FOREIGN KEY (`idAsociado`) REFERENCES `Asociado` (`idAsociado`);
ALTER TABLE `Areas_Asociado` ADD CONSTRAINT `fk_Areas_Asociado 1_Areas_1` FOREIGN KEY (`idAreas`) REFERENCES `Areas` (`idAreas`);
ALTER TABLE `Asociado` ADD CONSTRAINT `fk_Asociado_a_Consultorio_Usuarios_1` FOREIGN KEY (`idUsuario`) REFERENCES `Usuarios` (`idUsuario`);
ALTER TABLE `Asociado` ADD CONSTRAINT `fk_Asociado_TipodeUsuario_1` FOREIGN KEY (`idTipoDeUsuario`) REFERENCES `TipodeUsuario` (`idTipoUsuario`);
ALTER TABLE `Asociado` ADD CONSTRAINT `fk_Asociado_Status_1` FOREIGN KEY (`idStatus`) REFERENCES `Status` (`idStatus`);
ALTER TABLE `Asociado` ADD CONSTRAINT `fk_Asociado_EstiloWeb_1` FOREIGN KEY (`idEstiloWeb`) REFERENCES `EstiloWeb` (`idEstiloWeb`);
ALTER TABLE `Asociado` ADD CONSTRAINT `fk_Asociado_Sucursales_1` FOREIGN KEY (`idSucursal`) REFERENCES `Sucursales` (`idSucursal`);
ALTER TABLE `Citas` ADD CONSTRAINT `fk_Citas_Estado_Citas_1` FOREIGN KEY (`idEstadoCita`) REFERENCES `Estado_Citas` (`idEstadoCita`) ON DELETE RESTRICT ON UPDATE RESTRICT;
ALTER TABLE `Citas` ADD CONSTRAINT `fk_Citas_Doctor_1` FOREIGN KEY (`idDoctor`) REFERENCES `Doctor` (`idDoctor`);
ALTER TABLE `Citas` ADD CONSTRAINT `fk_Citas_Asociado_1` FOREIGN KEY (`idAsociado`) REFERENCES `Asociado` (`idAsociado`);
ALTER TABLE `Citas` ADD CONSTRAINT `fk_Citas_StatusPaciente_1` FOREIGN KEY (`idStatusPaciente`) REFERENCES `StatusPaciente` (`idStatusPaciente`);
ALTER TABLE `Citas` ADD CONSTRAINT `fk_Citas_Sucursales_1` FOREIGN KEY (`idSucursal`) REFERENCES `Sucursales` (`idSucursal`);
ALTER TABLE `Citas` ADD CONSTRAINT `fk_Citas_Paciente_1` FOREIGN KEY (`idPaciente`) REFERENCES `Paciente` (`idPaciente`);
ALTER TABLE `Consultorio` ADD CONSTRAINT `fk_Consultorio_Sucursales_1` FOREIGN KEY (`idSucursal`) REFERENCES `Sucursales` (`idSucursal`);
ALTER TABLE `Consultorio` ADD CONSTRAINT `fk_Consultorio_Estado_Consultorio_1` FOREIGN KEY (`idEstadoConsultorio`) REFERENCES `Estado_Consultorio` (`idEstadoConsultorio`);
ALTER TABLE `Creacion_Citas` ADD CONSTRAINT `fk_Recepcionsita_Citas 1_Recepcionista_1` FOREIGN KEY (`idRecepcionista`) REFERENCES `Recepcionista` (`idRecepcionista`);
ALTER TABLE `Creacion_Citas` ADD CONSTRAINT `fk_Recepcionsita_Citas 1_Citas_1` FOREIGN KEY (`idCitas`) REFERENCES `Citas` (`idCitas`);
ALTER TABLE `Creacion_Citas` ADD CONSTRAINT `fk_Creacion_Citas_Doctor_1` FOREIGN KEY (`idDoctor`) REFERENCES `Doctor` (`idDoctor`);
ALTER TABLE `Doctor` ADD CONSTRAINT `fk_Doctor_Usuarios_1` FOREIGN KEY (`idUsuario`) REFERENCES `Usuarios` (`idUsuario`) ON DELETE RESTRICT ON UPDATE RESTRICT;
ALTER TABLE `Doctor` ADD CONSTRAINT `fk_Doctor_Status_1` FOREIGN KEY (`idStatus`) REFERENCES `Status` (`idStatus`);
ALTER TABLE `Doctor` ADD CONSTRAINT `fk_Doctor_TipodeUsuario_1` FOREIGN KEY (`idTipoDeUsuario`) REFERENCES `TipodeUsuario` (`idTipoUsuario`);
ALTER TABLE `Doctor` ADD CONSTRAINT `fk_Doctor_EstiloWeb_1` FOREIGN KEY (`idEstiloWeb`) REFERENCES `EstiloWeb` (`idEstiloWeb`);
ALTER TABLE `EntradasProducutos_Productos` ADD CONSTRAINT `fk_EntradasProducutos_Productos_Movimiento_EntradasProducutos_1` FOREIGN KEY (`idMovimiento_EntradasProductos`) REFERENCES `Movimiento_EntradasProducutos` (`idMovimiento_EntradasProdcutos`);
ALTER TABLE `EntradasProducutos_Productos` ADD CONSTRAINT `fk_EntradasProducutos_Productos_Productos_1` FOREIGN KEY (`idProductos`) REFERENCES `Productos` (`idProducto`);
ALTER TABLE `Equipo` ADD CONSTRAINT `fk_Equipo_Status_1` FOREIGN KEY (`idStatus`) REFERENCES `Status` (`idStatus`);
ALTER TABLE `FotosHistorial_Paciente` ADD CONSTRAINT `fk_FotosHistorial_Paciente_FotosHistorialClinico_1` FOREIGN KEY (`idFotoHistorialClinico`) REFERENCES `FotosHistorialClinico` (`idFotoHistorialClinico`);
ALTER TABLE `FotosHistorial_Paciente` ADD CONSTRAINT `fk_FotosHistorial_Paciente_Paciente_1` FOREIGN KEY (`idPaciente`) REFERENCES `Paciente` (`idPaciente`);
ALTER TABLE `FotosHistorial_Paciente` ADD CONSTRAINT `fk_FotosHistorial_Paciente_Sesion_1` FOREIGN KEY (`idSesion`) REFERENCES `Sesion` (`idSesion`);
ALTER TABLE `HistorialClinico` ADD CONSTRAINT `fk_HistorialClinico_Pacientes_1` FOREIGN KEY (`idPaciente`) REFERENCES `Paciente` (`idPaciente`) ON DELETE RESTRICT ON UPDATE RESTRICT;
ALTER TABLE `Login_Out` ADD CONSTRAINT `fk_Login/Out_Usuarios_1` FOREIGN KEY (`idUsuario`) REFERENCES `Usuarios` (`idUsuario`);
ALTER TABLE `Medicamento_Receta` ADD CONSTRAINT `fk_Medicamento_Receta_Medicamento_1` FOREIGN KEY (`idMedicamento`) REFERENCES `Medicamento` (`idMedicamento`);
ALTER TABLE `Medicamento_Receta` ADD CONSTRAINT `fk_Medicamento_Receta_Receta_Pacientes_1` FOREIGN KEY (`idReceta_Pacientes`) REFERENCES `Receta_Pacientes` (`idReceta_Pacientes`);
ALTER TABLE `Movimiento_EntradasProducutos` ADD CONSTRAINT `fk_Movimiento_EntradasProducutos_Usuarios_1` FOREIGN KEY (`idUsuario`) REFERENCES `Usuarios` (`idUsuario`);
ALTER TABLE `Paciente` ADD CONSTRAINT `fk_Paciente_Usuarios_1` FOREIGN KEY (`idUsuario`) REFERENCES `Usuarios` (`idUsuario`) ON DELETE RESTRICT ON UPDATE RESTRICT;
ALTER TABLE `Paciente` ADD CONSTRAINT `fk_Paciente_TipodeUsuario_1` FOREIGN KEY (`idTipoDeUsuario`) REFERENCES `TipodeUsuario` (`idTipoUsuario`);
ALTER TABLE `Paciente` ADD CONSTRAINT `fk_Paciente_Status_1` FOREIGN KEY (`idStatus`) REFERENCES `Status` (`idStatus`);
ALTER TABLE `Paciente` ADD CONSTRAINT `fk_Paciente_EstiloWeb_1` FOREIGN KEY (`idEstiloWeb`) REFERENCES `EstiloWeb` (`idEstiloWeb`);
ALTER TABLE `Pacientes_Pedidos` ADD CONSTRAINT `fk_Pacientes_Pedidos_Citas_1` FOREIGN KEY (`idCitas`) REFERENCES `Citas` (`idCitas`);
ALTER TABLE `Pacientes_Pedidos` ADD CONSTRAINT `fk_Pacientes_Pedidos_Doctor_1` FOREIGN KEY (`idDoctor`) REFERENCES `Doctor` (`idDoctor`);
ALTER TABLE `Pacientes_Pedidos` ADD CONSTRAINT `fk_Pacientes_Pedidos_Consultorio_1` FOREIGN KEY (`idConsultorio`) REFERENCES `Consultorio` (`idConsultorio`);
ALTER TABLE `Padecimientos` ADD CONSTRAINT `fk_Padecimientos_Areas_1` FOREIGN KEY (`idArea`) REFERENCES `Areas` (`idAreas`);
ALTER TABLE `Pago` ADD CONSTRAINT `fk_Pago_Recepcionista_1` FOREIGN KEY (`idRecepcionista`) REFERENCES `Recepcionista` (`idRecepcionista`);
ALTER TABLE `Pago` ADD CONSTRAINT `fk_Pago_Tipo_de_Pago_1` FOREIGN KEY (`idTipoDePago`) REFERENCES `Tipo_de_Pago` (`idTipoDePago`);
ALTER TABLE `Procedimiento` ADD CONSTRAINT `fk_Procedimiento_Areas_1` FOREIGN KEY (`idAreas`) REFERENCES `Areas` (`idAreas`);
ALTER TABLE `Procedimiento` ADD CONSTRAINT `fk_Procedimiento_Equipo_1` FOREIGN KEY (`idEquipo`) REFERENCES `Equipo` (`idEquipo`);
ALTER TABLE `Procedimiento_Citas` ADD CONSTRAINT `fk_Procedimiento_Citas_Procedimiento_1` FOREIGN KEY (`idProcedimiento`) REFERENCES `Procedimiento` (`idProcedimiento`);
ALTER TABLE `Procedimiento_Citas` ADD CONSTRAINT `fk_Procedimiento_Citas_Citas_1` FOREIGN KEY (`idCitas`) REFERENCES `Citas` (`idCitas`);
ALTER TABLE `Productos` ADD CONSTRAINT `fk_Productos_CategoriaProducto_1` FOREIGN KEY (`idCategoriaProducto`) REFERENCES `CategoriaProducto` (`idCategoriaProducto`);
ALTER TABLE `Productos` ADD CONSTRAINT `fk_Productos_Status_1` FOREIGN KEY (`idStatus`) REFERENCES `Status` (`idStatus`);
ALTER TABLE `Recepcionista` ADD CONSTRAINT `fk_Recepcionista_Usuarios_1` FOREIGN KEY (`idUsuario`) REFERENCES `Usuarios` (`idUsuario`);
ALTER TABLE `Recepcionista` ADD CONSTRAINT `fk_Recepcionista_TipodeUsuario_1` FOREIGN KEY (`idTipoDeUsuario`) REFERENCES `TipodeUsuario` (`idTipoUsuario`);
ALTER TABLE `Recepcionista` ADD CONSTRAINT `fk_Recepcionista_Status_1` FOREIGN KEY (`idStatus`) REFERENCES `Status` (`idStatus`);
ALTER TABLE `Recepcionista` ADD CONSTRAINT `fk_Recepcionista_EstiloWeb_1` FOREIGN KEY (`idEstiloWeb`) REFERENCES `EstiloWeb` (`idEstiloWeb`);
ALTER TABLE `Recepcionista` ADD CONSTRAINT `fk_Recepcionista_Sucursales_1` FOREIGN KEY (`idSucursal`) REFERENCES `Sucursales` (`idSucursal`);
ALTER TABLE `Receta_Pacientes` ADD CONSTRAINT `fk_Receta_Pacientes_Sesion_1` FOREIGN KEY (`idSesion`) REFERENCES `Sesion` (`idSesion`);
ALTER TABLE `Receta_Pacientes` ADD CONSTRAINT `fk_Receta_Pacientes_Paciente_1` FOREIGN KEY (`idPaciente`) REFERENCES `Paciente` (`idPaciente`);
ALTER TABLE `Receta_Pacientes` ADD CONSTRAINT `fk_Receta_Pacientes_Doctor_1` FOREIGN KEY (`idDoctor`) REFERENCES `Doctor` (`idDoctor`);
ALTER TABLE `Registro_Confirmacion` ADD CONSTRAINT `fk_Registro_Confirmacion_Citas_1` FOREIGN KEY (`idCita`) REFERENCES `Citas` (`idCitas`);
ALTER TABLE `Registro_Confirmacion` ADD CONSTRAINT `fk_Registro_Confirmacion_Estado_Citas_1` FOREIGN KEY (`idEstadoAnterior`) REFERENCES `Estado_Citas` (`idEstadoCita`);
ALTER TABLE `Registro_Confirmacion` ADD CONSTRAINT `fk_Registro_Confirmacion_Estado_Citas_2` FOREIGN KEY (`idNuevoEstado`) REFERENCES `Estado_Citas` (`idEstadoCita`);
ALTER TABLE `Registro_Confirmacion` ADD CONSTRAINT `fk_Registro_Confirmacion_Usuarios_1` FOREIGN KEY (`idUsuario`) REFERENCES `Usuarios` (`idUsuario`);
ALTER TABLE `Registro_Confirmacion` ADD CONSTRAINT `fk_Registro_Confirmacion_TipodeUsuario_1` FOREIGN KEY (`idTipodeUsuario`) REFERENCES `TipodeUsuario` (`idTipoUsuario`);
ALTER TABLE `RegistroTratamientos` ADD CONSTRAINT `fk_RegistroTratamientos_Equipo_1` FOREIGN KEY (`idEquipo`) REFERENCES `Equipo` (`idEquipo`);
ALTER TABLE `RegistroTratamientos` ADD CONSTRAINT `fk_RegistroTratamientos_Procedimiento_1` FOREIGN KEY (`idProcedimiento`) REFERENCES `Procedimiento` (`idProcedimiento`);
ALTER TABLE `RegistroTratamientos` ADD CONSTRAINT `fk_RegistroTratamientos_Zona_1` FOREIGN KEY (`idZona`) REFERENCES `Zona` (`idZona`);
ALTER TABLE `Seguimientos` ADD CONSTRAINT `fk_Padecimientos_Sesion_Padecimientos_1` FOREIGN KEY (`idPadecimiento`) REFERENCES `Padecimientos` (`idPadecimiento`);
ALTER TABLE `Seguimientos_Sesion` ADD CONSTRAINT `fk_Registro_Sesion_Sesion_1` FOREIGN KEY (`idSesion`) REFERENCES `Sesion` (`idSesion`);
ALTER TABLE `Seguimientos_Sesion` ADD CONSTRAINT `fk_Seguimientos_Sesion_Seguimientos_1` FOREIGN KEY (`idSeguimientos`) REFERENCES `Seguimientos` (`idSeguimientos`);
ALTER TABLE `Sesion` ADD CONSTRAINT `fk_Consulta_Citas_1` FOREIGN KEY (`idCitas`) REFERENCES `Citas` (`idCitas`) ON DELETE RESTRICT ON UPDATE RESTRICT;
ALTER TABLE `Sesion` ADD CONSTRAINT `fk_Consulta_Pago_1` FOREIGN KEY (`idPago`) REFERENCES `Pago` (`idPago`) ON DELETE RESTRICT ON UPDATE RESTRICT;
ALTER TABLE `Sesion` ADD CONSTRAINT `fk_Consulta_Consultorio_1` FOREIGN KEY (`idConsultorio`) REFERENCES `Consultorio` (`idConsultorio`) ON DELETE RESTRICT ON UPDATE RESTRICT;
ALTER TABLE `Sesion` ADD CONSTRAINT `fk_Consulta_Doctor_1` FOREIGN KEY (`idDoctor`) REFERENCES `Doctor` (`idDoctor`) ON DELETE RESTRICT ON UPDATE RESTRICT;
ALTER TABLE `Sesion` ADD CONSTRAINT `fk_Sesion_Asociado_1` FOREIGN KEY (`idAsociado`) REFERENCES `Asociado` (`idAsociado`);
ALTER TABLE `Sesion` ADD CONSTRAINT `fk_Sesion_Paciente_1` FOREIGN KEY (`idPaciente`) REFERENCES `Paciente` (`idPaciente`);
ALTER TABLE `StatusCorreo` ADD CONSTRAINT `fk_StatusCorreo 1_Usuarios_1` FOREIGN KEY (`idUsuario`) REFERENCES `Usuarios` (`idUsuario`);
ALTER TABLE `StatusCorreo` ADD CONSTRAINT `fk_StatusCorreo 1_Status_1` FOREIGN KEY (`idStatus`) REFERENCES `Status` (`idStatus`);
ALTER TABLE `SuperAdmin` ADD CONSTRAINT `fk_SuperAdmin_TipodeUsuario_1` FOREIGN KEY (`idTipoDeUsuario`) REFERENCES `TipodeUsuario` (`idTipoUsuario`);
ALTER TABLE `SuperAdmin` ADD CONSTRAINT `fk_SuperAdmin_Usuarios_1` FOREIGN KEY (`idUsuario`) REFERENCES `Usuarios` (`idUsuario`);
ALTER TABLE `SuperAdmin` ADD CONSTRAINT `fk_SuperAdmin_Status_1` FOREIGN KEY (`idStatus`) REFERENCES `Status` (`idStatus`);
ALTER TABLE `SuperAdmin` ADD CONSTRAINT `fk_SuperAdmin_EstiloWeb_1` FOREIGN KEY (`idEstiloWeb`) REFERENCES `EstiloWeb` (`idEstiloWeb`);
ALTER TABLE `Tratamientos_Sesion` ADD CONSTRAINT `fk_Tratamientos_Sesion_RegistroTratamientos_1` FOREIGN KEY (`idRegistroTratamientos`) REFERENCES `RegistroTratamientos` (`idRegistroTratamientos`);
ALTER TABLE `Tratamientos_Sesion` ADD CONSTRAINT `fk_Tratamientos_Sesion_Sesion_1` FOREIGN KEY (`idSesion`) REFERENCES `Sesion` (`idSesion`);
ALTER TABLE `Tratamientos_Sesion` ADD CONSTRAINT `fk_Tratamientos_Sesion_Equipo_1` FOREIGN KEY (`idEquipo`) REFERENCES `Equipo` (`idEquipo`);
ALTER TABLE `Usuarios` ADD CONSTRAINT `fk_Usuarios_Sexo_1` FOREIGN KEY (`idSexo`) REFERENCES `Sexo` (`idSexo`) ON DELETE RESTRICT ON UPDATE RESTRICT;
ALTER TABLE `Venta_Producto` ADD CONSTRAINT `fk_Venta_Producto_Productos_1` FOREIGN KEY (`idProducto`) REFERENCES `Productos` (`idProducto`);
ALTER TABLE `Venta_Producto` ADD CONSTRAINT `fk_Venta_Producto_Ventas_1` FOREIGN KEY (`idVenta`) REFERENCES `Ventas` (`idVenta`);
ALTER TABLE `Ventas` ADD CONSTRAINT `fk_Ventas_Pago_1` FOREIGN KEY (`idPago`) REFERENCES `Pago` (`idPago`);
ALTER TABLE `Ventas` ADD CONSTRAINT `fk_Ventas_VentaCliente_1` FOREIGN KEY (`idVentaCliente`) REFERENCES `VentaCliente` (`idVentaCliente`);
ALTER TABLE `Ventas` ADD CONSTRAINT `fk_Ventas_Usuarios_1` FOREIGN KEY (`idUsuario`) REFERENCES `Usuarios` (`idUsuario`);
ALTER TABLE `Zona_Procedimiento` ADD CONSTRAINT `fk_Zona_Procedimineto 1_Zona_1` FOREIGN KEY (`idZona`) REFERENCES `Zona` (`idZona`);
ALTER TABLE `Zona_Procedimiento` ADD CONSTRAINT `fk_Zona_Procedimineto 1_Procedimiento_1` FOREIGN KEY (`idProcedimiento`) REFERENCES `Procedimiento` (`idProcedimiento`);

