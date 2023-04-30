const socketMapConnection = (socket, user) => {
  socket.send(JSON.stringify({ type: "bootup", user: user }));
};

export default function SocketHandler(socket, cb, user) {
  socket.onmessage = (msg) => {
    cb(msg);
  };

  socket.onerror = (error) => {
    console.log("Socket Error: ", error);
  };

  socket.onopen = () => {
    // initiate mapping
    socketMapConnection(socket, user);
  };

  const socketSendMsg = (msg) => {
    socket.send(JSON.stringify(msg));
  };

  return () => socketSendMsg;
}
