import { Server, Socket } from "socket.io";

let io;

export function initSocket(httpserver) {
    io = new Server(httpserver, {
        cors: {
            origin: ["http://localhost:5173", "http://127.0.0.1:5173"],
            credentials: true
        }
    })

    console.log("socket.io server is runnning");
    

    io.on("connection", (Socket) => {
        console.log("A is connected", Socket.id);
    })
}

export function getIO() {

    if (!io) {
        throw new Error("socket.io not initialized")
    }

    return io
}