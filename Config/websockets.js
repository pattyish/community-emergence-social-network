const {Server} = require("socket.io");

let onlineUsers = [];
let sessionIdMap = new Map();

function setup(server) {
    const io = new Server(server);
    io.on('connection', (socket) => {
        console.log('a user connected');
        socket.on('disconnect', () => {
            console.log('user disconnected');
            const userId = sessionIdMap.get(socket.id)
            const index = onlineUsers.indexOf(userId);
            if (index > -1) {
                onlineUsers.splice(index, 1);
            }
            sessionIdMap.delete(socket.id);
            console.log("removed: "+userId+" ::: "+socket.id)
        });
        socket.on('onlineNotification', (data) => {
            console.log("someone online: "+JSON.stringify(data));
            onlineUsers.push(data.userId);
            sessionIdMap.set(data.socketId, data.userId);
        })
        socket.on('getOnlineUsersMap', ()=>{
            io.to(socket.id).emit('onlineUsersMap', onlineUsers)
        })
    });
    return io;
}

module.exports = { setup }