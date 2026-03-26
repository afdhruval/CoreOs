import dotenv from "dotenv";
dotenv.config({ path: "./.env" });
import http from "http"
import { initSocket } from "./src/sockets/server.socket.js";

import app from "./src/app.js";
import connectTOdb from "./src/config/database.js";

const httpServer = http.createServer(app)

initSocket(httpServer)


connectTOdb()

httpServer.listen(5000, () => {
    console.log("server is running on 5000");
})
