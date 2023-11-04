
import { moment } from "./conf_api.js";

 // Asi se hace una aproximacion de la zona horaria
const AproximacionZona = moment.tz.guess();
const ZonaSucursal01 = "America/Matamoros";
const ZonaSucursal02 = "America/Monterrey";

//Formato completo de fecha y hora 
// .format("YYYY-MM-DD HH:mm:ss");

// Funcion para obtener la hora y el saludo
export function Saludo() {
  const HoraActual = moment().tz(ZonaSucursal01).format("HH:mm:ss"); // Obtener hora en la zona horaria
  const Hora = moment().tz(ZonaSucursal01).format("HH"); // Obtener hora en la zona horaria

  // Aqui ajustamos el saludo según la hora
  if (Hora >= 5 && Hora < 12) {
    var Saludo = "Buenos días ";
  } else if (Hora >= 12 && Hora < 20) {
    var Saludo = "Buenas tardes ";
  } else {
    var Saludo = "Buenas noches ";
  }

  return (Saludo);
};

// Funcion para obtener la fecha y hora
export function FechaHora() {
  const HoraS1 = moment().tz(ZonaSucursal01).format("HH:mm:ss"); // Obtener hora en la Sucursal 01
  const HoraS2 = moment().tz(ZonaSucursal02).format("HH:mm:ss"); // Obtener hora en la Sucursal 02
  const Año = moment().tz(AproximacionZona).format("YYYY"); // Obtener el año
  const Mes = moment().tz(AproximacionZona).format("MM"); // Obtener el mes
  const Dia = moment().tz(AproximacionZona).format("DD"); // Obtener el dia
  const InfoFechaHora = {
    HoraS1: HoraS1,
    HoraS2: HoraS2,
    Año: Año,
    Mes: Mes,
    Dia: Dia,
    FormatoDia: Año + "-" + Mes + "-" + Dia
  }
  return InfoFechaHora;
}


// Funcion para obtener la informacion del copyrigth
export function Copyright() {
  const Año = moment().format("YYYY");
  // const Año = moment().tz(zonaHoraria).format("YYYY");
  const InfoCopy = {
    Año: Año,
    Copyright: process.env.COPYRIGHT,
    NombreEmpresa: process.env.NOMBRE_EMPRESA,
    Version: process.env.VERSION,
  };
  return InfoCopy;
}



