//npm init --yes
//npm i express
//npm i axios
//npm i fs
//npm i uuidv4
//npm i -g nodemon
//npm i nodemon --D

const express = require("express");
const app = express();
const port = 3000;
const fs = require("fs");

app.listen(port, () => console.log("Servidor escuchado en puerto 3000"));
app.use(express.json());
app.use(express.static("public"));

const {
  agregarroommates,
  consultarroommates,
  editarcuentas,
} = require("./roommates.js");

const { agregargastos, consultargastos } = require("./gastos.js");

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

app.get("/roommates", async (req, res) => {
  // try {
  const roommates = await consultarroommates();
  //console.log(roommates);
  roommates.roommates.forEach((roommate) => {
    roommate.debe = Math.round(roommate.debe);
    roommate.recibe = Math.round(roommate.recibe);
    roommate.total = Math.round(roommate.total);
  });
  res.status(200).send(roommates); //json
  /*   } catch (error) {
    console.log(res, error.code);
  } */
});

app.post("/roommate", async (req, res) => {
  //  try {
  const respuesta = await agregarroommates();
  await editarcuentas();
  res.status(201).send(respuesta); //json
  /*   } catch (error) {
    handleError(res, error);
  } */
});

app.get("/gastos", async (req, res) => {
  //try {
  res.status(200).send(await consultargastos());
  /*   } catch (error) {
    handleError(res, error);
  } */
});

app.post("/gasto", async (req, res) => {
  // try {
  const { roommate, descripcion, monto } = req.body;
  console.log("hola");
  console.log(req.body);
  const respuesta = await agregargastos(roommate, descripcion, monto);
  await editarcuentas();
  res.status(201).send(respuesta);
  /*   } catch (error) {
    handleError(res, error);
  } */
});

app.put("/gasto", async (req, res) => {
  // try {
  const { id } = req.query;
  const { roommate, descripcion, monto } = req.body;
  console.log(req.query);
  console.log(req.body);
  console.log(req.params);
  const gastosJSON = JSON.parse(
    fs.readFileSync("./data/gastos_data.json", "utf8")
  );
  const gastos = gastosJSON.gastos;
  const buscarid = gastos.findIndex((g) => g.id == id);
  gastos[buscarid] = { id, roommate, descripcion, monto };
  fs.writeFileSync("./data/gastos_data.json", JSON.stringify(gastosJSON));
  await editarcuentas();
  res.status(200).send(gastosJSON);
  /*   } catch (error) {
    handleError(res, error);
  } */
});

app.delete("/gasto", async (req, res) => {
  // try {
  const { id } = req.query;
  const gastosJSON = JSON.parse(
    fs.readFileSync("./data/gastos_data.json", "utf8")
  );
  const gastos = gastosJSON.gastos;
  const buscarid = gastos.findIndex((g) => g.id == id);
  gastosJSON.gastos = gastos.filter((g) => g.id !== id);
  fs.writeFileSync("./data/gastos_data.json", JSON.stringify(gastosJSON));
  await editarcuentas();
  res.status(200).send(gastosJSON);
  /*   } catch (error) {
    handleError(res, error);
  } */
});
