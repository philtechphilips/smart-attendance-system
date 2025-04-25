import { io, Socket } from 'socket.io-client';

let socket: Socket | undefined;

const socketConnection = (userName: string): Socket => {
    // Check to see if the socket is already connected
    if (socket && socket.connected) {
        // If so, then just return it so whoever needs it can use it
        return socket;
    } else {
        // It's not connected... connect!
        socket = io('http://localhost:8181', {
            auth: {
                password: "x",
                userName,
            },
        });

        if (userName === 'test') {
            console.log("Testing...");
            socket.emitWithAck('test')
                .then((resp: unknown) => {
                    console.log(resp);
                })
                .catch((err: unknown) => {
                    console.error("Error during test:", err);
                });
        }

        return socket;
    }
};

export default socketConnection;