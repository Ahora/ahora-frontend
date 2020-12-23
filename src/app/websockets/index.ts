
let socketId: string | undefined;

export const setWebSocketId = (socketIdVal: string | undefined) => {
    socketId = socketIdVal;
}

export const getWebSocketId = () => {
    return socketId;
} 