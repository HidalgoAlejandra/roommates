const axios = require("axios");
const fs = require("fs");
const { v4: uuidv4 } = require("uuid");
const { json } = require("express");

const obtenerUser = async () => {
  try {
    const { data } = await axios.get("https://randomuser.me/api");
    console.log("Valor de propiedad data de response: ", data);
    const userRandom = data.results[0];
    const nombre = userRandom.name.first;
    return nombre;
  } catch (error) {
    return "Error al obtener el usuario de la api" + error.message;
  }
};

const consultarroommates = async () => {
  const roommatesJSON = JSON.parse(
    fs.readFileSync("./data/roommates_data.json", "utf8")
  );
  return roommatesJSON;
};

const agregarroommates = async () => {
  const roommate = await obtenerUser();
  let email = "";
  let debe = 0;
  let recibe = 0;
  let total = 0;
  const nuevoroommates = {
    id: uuidv4().slice(30),
    nombre: roommate,
    email,
    debe,
    recibe,
    total,
  };
  const roommatesJSON = JSON.parse(
    fs.readFileSync("./data/roommates_data.json", "utf8")
  );
  roommatesJSON.roommates.push(nuevoroommates);
  fs.writeFileSync("./data/roommates_data.json", JSON.stringify(roommatesJSON));
  return roommatesJSON;
};

const editarcuentas = async () => {
  const roommatesJSON = JSON.parse(
    fs.readFileSync("./data/roommates_data.json", "utf8")
  );
  const gastosJSON = JSON.parse(
    fs.readFileSync("./data/gastos_data.json", "utf8")
  );
  const roommates = roommatesJSON.roommates;
  const gastos = gastosJSON.gastos;

  roommates.forEach((roommate) => {
    roommate.debe = 0;
    roommate.recibe = 0;
  });
  gastos.forEach((gasto) => {
    const montoporroommate = gasto.monto / roommates.length;
    roommates.forEach((roommate) => {
      if (roommate.nombre === gasto.roommate) {
        roommate.recibe += montoporroommate;
      } else {
        roommate.debe += montoporroommate;
      }
    });
  });

  roommates.forEach((roommate) => {
    roommate.total = roommate.recibe - roommate.debe;
  });
  fs.writeFileSync("./data/roommates_data.json", JSON.stringify(roommatesJSON));
};

module.exports = { agregarroommates, consultarroommates, editarcuentas };
