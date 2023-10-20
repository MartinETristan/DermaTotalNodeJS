import { mysql, db } from "../conf_api.js";

async function NuevaReceta(
  idPaciente,
  idDoctor,
  idSesion,
  Medicamentos,
  Indicaciones,
  Nota
) {
  let idReceta = 0;
  let idMedicamento = [];

  const connection = await mysql.createConnection(db);

  try {
    const NewReceta = `INSERT INTO Receta_Pacientes
        (idPaciente, idDoctor, idSesion, Fecha, Nota)
        VALUES (?, ?, ?, ?, ?);`;

    const [recetaResult] = await connection.execute(NewReceta, [
      idPaciente,
      idDoctor,
      idSesion || null,
      new Date(),
      Nota || null,
    ]);

    idReceta = recetaResult.insertId;
  } catch (error) {
    console.error("Ha ocurrido un error creando la receta: ", error);
    return "Ha ocurrido un error.";
  }

  if (Medicamentos.length > 0) {
    const medicamentosToInsert = Array.isArray(Medicamentos)
      ? Medicamentos
      : [Medicamentos];

    const indicacionesToInsert = Array.isArray(Indicaciones)
      ? Indicaciones
      : [Indicaciones];

    for (let i = 0; i < medicamentosToInsert.length; i++) {
      const Medicamento = medicamentosToInsert[i];
      const Indicacion = indicacionesToInsert[i] || "";

      const NewMedicamento = `INSERT INTO Medicamento
          (Medicamento, Indicacion)
          VALUES (?, ?);`;

      try {
        const [medicamentoResult] = await connection.execute(NewMedicamento, [
          Medicamento,
          Indicacion,
        ]);

        idMedicamento.push(medicamentoResult.insertId);
      } catch (error) {
        console.error("Error al insertar Medicamento:", error);
      }
    }
  } else {
    console.log(
      "El array Medicamentos está vacío, no se realizaron inserciones."
    );
  }

  if (Array.isArray(idMedicamento) && idMedicamento.length > 0) {
    for (const medicamentoId of idMedicamento) {
      const insertQuery =
        "INSERT INTO Medicamento_Receta (idMedicamento, idReceta_Pacientes) VALUES (?, ?);";
      await connection.execute(insertQuery, [medicamentoId, idReceta]);
    }
  }

  await connection.end();
}

async function Receta(idPaciente, idReceta) {
  try {
    const connection = await mysql.createConnection(db);
    const queryReceta = `
      SELECT CONCAT(ud.Nombres ," ",ud.ApellidoP," ",ud.ApellidoM) as Doctor,d.Especialidad,d.Universidad ,d.CertificadoProf, ud.Correo as CorreoDoc,
      CONCAT(up.Nombres ," ",up.ApellidoP," ",up.ApellidoM) as Paciente,TIMESTAMPDIFF(YEAR, up.FechadeNacimiento, CURDATE()) AS Edad,
      m.Medicamento, m.Indicacion, Fecha, Nota
      FROM Receta_Pacientes rp
      LEFT JOIN Medicamento_Receta mr ON mr.idReceta_Pacientes = rp.idReceta_Pacientes
      LEFT JOIN Medicamento m ON m.idMedicamento = mr.idMedicamento
      LEFT JOIN Doctor d ON d.idDoctor = rp.idDoctor
      LEFT JOIN Usuarios ud ON ud.idUsuario = d.idUsuario
      LEFT JOIN Paciente p ON p.idPaciente = rp.idPaciente
      LEFT JOIN Usuarios up ON up.idUsuario = p.idUsuario
      WHERE rp.idPaciente = ? AND mr.idReceta_Pacientes = ?
      `;
    const [checkreceta, a] = await connection.execute(queryReceta, [
      idPaciente,
      idReceta,
    ]);
    connection.end();
    return checkreceta;
  } catch (error) {
    console.error(
      "Ha ocurrido un error consultando la receta del paciente: ",
      error
    );
    return "Ha ocurrido un error.";
  }
}

async function UpdateReceta_Añadir(Elemento) {
  try {
    const connection = await mysql.createConnection(db);
    const InsertMedicamento = `
      INSERT INTO Medicamento
      (Medicamento, Indicacion)
      VALUES(?,?);`;
    const [result] = await connection.execute(InsertMedicamento, [
      Elemento.Medicamento,
      Elemento.Indicacion,
    ]);
    const idMedicamento = result.insertId; // Aquí obtienes el ID del medicamento insertado

    const Asociar_Receta = `
      INSERT INTO Medicamento_Receta
      (idMedicamento, idReceta_Pacientes)
      VALUES(?,?);`;
    await connection.execute(Asociar_Receta, [
      idMedicamento,
      Elemento.idReceta,
    ]);

    connection.end();
  } catch (error) {
    console.error(
      "Ha ocurrido un error añadiendo el medicamento la receta del paciente: ",
      error
    );
  }
}

async function UpdateReceta_Editar(Elemento) {
  try {
    const connection = await mysql.createConnection(db);

    const Actualizar_Meicamento = `
      UPDATE Medicamento
      SET Medicamento= ?, Indicacion= ?
      WHERE idMedicamento= ?;`;
    await connection.execute(Actualizar_Meicamento, [
      Elemento.Medicamento,
      Elemento.Indicacion,
      Elemento.idMedicamento,
    ]);

    connection.end();
  } catch (error) {
    console.error(
      "Ha ocurrido un error aplicando los cambios en el medicamento del paciente: ",
      error
    );
  }
}

async function UpdateReceta_Quitar(Elemento) {
  try {
    const connection = await mysql.createConnection(db);
    const Eliminar_Enlace = `
      DELETE FROM Medicamento_Receta
      WHERE idMedicamento_Receta= ?;`;
    await connection.execute(Eliminar_Enlace, [Elemento.idMedicamento_Receta]);

    const Eliminar_Meicamento = `
      DELETE FROM Medicamento
      WHERE idMedicamento= ?;`;
    await connection.execute(Eliminar_Meicamento, [Elemento.idMedicamento]);

    connection.end();
  } catch (error) {
    console.error(
      "Ha ocurrido un error eliminando el medicamento de la receta del paciente: ",
      error
    );
  }
}

async function UpdateReceta_EditNota(Elemento) {
  try {
    const connection = await mysql.createConnection(db);
    console.log(Elemento);
    const Actualizar_Nota = `
      UPDATE Receta_Pacientes
      SET Nota= ?
      WHERE idReceta_Pacientes= ?;`;
    if (Elemento.Nota == "") {
      Elemento.Nota = null;
    }
    await connection.execute(Actualizar_Nota, [
      Elemento.Nota,
      Elemento.idReceta,
    ]);

    connection.end();
  } catch (error) {
    console.error(
      "Ha ocurrido un error actualizando la nota en la receta del paciente: ",
      error
    );
  }
}

export {
  NuevaReceta,
  Receta,
  UpdateReceta_Añadir,
  UpdateReceta_Editar,
  UpdateReceta_Quitar,
  UpdateReceta_EditNota,
};
