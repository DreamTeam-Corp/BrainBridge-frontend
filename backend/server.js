const app = require("./app");
const debug = require("debug")("node-angular");
const http = require("http");
const { MongoClient } = require("mongodb");

const normalizePort = (val) => {
  var port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
};

const onError = (error) => {
  if (error.syscall !== "listen") {
    throw error;
  }
  const bind = typeof port === "string" ? "pipe " + port : "port " + port;
  switch (error.code) {
    case "EACCES":
      console.error(bind + " требует повышенных привилегий");
      process.exit(1);
      break;
    case "EADDRINUSE":
      console.error(bind + " уже используется");
      process.exit(1);
      break;
    default:
      throw error;
  }
};

const port = normalizePort(process.env.PORT || "3000");
app.set("port", port);

const uri = "mongodb://127.0.0.1:27017/education";
const client = new MongoClient(uri, { useUnifiedTopology: true });

client.connect((err) => {
  if (err) {
    console.error("Ошибка подключения к MongoDB:", err);
    process.exit(1);
  }
  console.log("Успешно подключено к MongoDB");

  const server = http.createServer(app);

  const onListening = () => {
    const addr = server.address();
    const bind = typeof port === "string" ? "pipe " + port : "port " + port;
    debug("Прослушивание на " + bind);
    console.log("Сервер запущен и слушает на " + bind);
  };

  server.on("error", onError);
  server.on("listening", onListening);
  server.listen(port);
});
