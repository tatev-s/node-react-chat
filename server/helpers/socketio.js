import MessageService from '../services/MessageService';
import FilesService from '../services/FilesService';
import UserService from '../services/UserService';
import siofu from "socketio-file-upload";

module.exports = (server) => {
  var io = require('socket.io')(server);
  siofu.listen(server);
  io.sockets.on('connection', function(socket) {
    var uploader = new siofu();
    uploader.dir = `${__dirname}/../../client/assets/uploads/`;
    uploader.listen(socket);
    socket.on('join', function(channel, ack) {
      socket.room = channel;
      socket.join(channel);
    });
    // Error handler:
    uploader.on("error", function(event) {
      console.log("Error from uploader", event);
    });
    // when the client emits 'sendchat', this listens and executes
    socket.on('sendchat', function(data) {
      if (data.senderId) {
        if (data.message) {
          MessageService.insertMessage({
            message: data.message,
            senderId: data.senderId,
            chatId: socket.room
          });
        }
        if (data.file) {
          FilesService.insertFile({
            file: `/uploads/${data.file}`,
            senderId: data.senderId,
            chatId: socket.room
          });
          data.file = `/uploads/${data.file}`;
        }
        UserService.getById(data.senderId).then(user => {
          data.date = new Date();
          data.username = user.name;
          io.sockets.in(socket.room).emit('updatechat', data);
        })
      }
    });
    // when the user disconnects.. perform this
    socket.on('disconnect', function() {
      socket.leave(socket.room);
    });
  });

}