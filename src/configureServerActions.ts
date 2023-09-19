import { Server } from "socket.io";
import { DefaultEventsMap } from "socket.io/dist/typed-events";

export function configureServerActions(
    io: Server<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap>
) {
    io.on("connection", (socket) => {
        socket.onAny((msg, ...payload) => {
            socket.broadcast.emit(msg, ...payload);
        });
    });

    setInterval(() => io.emit("time", new Date()), 10000);
}
