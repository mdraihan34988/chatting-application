import io from "socket.io-client";

let socket ;

const initiateSocket = () => {
    if(!socket) {
        socket = io(process.env.REACT_APP_API_URL, {
            reconnectionDelay: 1000,
            reconnection: true,
            reconnectionAttemps: 10,
            transports: ["websocket"],
            agent: false,
            upgrade: false,
            rejectUnauthorized: false,
        });
    }

    return socket;
};

export default initiateSocket;
