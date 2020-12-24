
let socketIdUser: string | undefined;

export const setWebSocketId = (socketIdVal: string | undefined) => {
    socketIdUser = socketIdVal;
}

export const getWebSocketId = () => {
    return socketIdUser;
} 