const jsonServer = require("json-server");

const server = jsonServer.create();
const router = jsonServer.router("db.json");
const middlewares = jsonServer.defaults();

const PORT = process.env.PORT || 3000;

server.use(middlewares);
server.use(jsonServer.bodyParser);

server.use(router);

server.listen(PORT, "0.0.0.0", () => {
  console.log(`JSON Server running on port ${PORT}`);
});