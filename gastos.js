const fs = require("fs");
const { v4: uuidv4 } = require("uuid");
const { json } = require("express");

const consultargastos = async () => {
  const gastosJSON = JSON.parse(
    fs.readFileSync("./data/gastos_data.json", "utf8")
  );
  return gastosJSON;
};

const agregargastos = async (roommate, descripcion, monto) => {
  console.log(monto);

  const nuevogasto = {
    roommate: roommate + "",
    descripcion: descripcion + "",
    monto: parseFloat(monto),
    fecha: new Date().toLocaleDateString(),
    id: uuidv4().slice(30),
  };
  const gastosJSON = JSON.parse(
    fs.readFileSync("./data/gastos_data.json", "utf8")
  );
  gastosJSON.gastos.push(nuevogasto);
  fs.writeFileSync("./data/gastos_data.json", JSON.stringify(gastosJSON));
  return nuevogasto;
};
module.exports = { agregargastos, consultargastos };
