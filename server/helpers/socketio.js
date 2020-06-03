
import jwt from 'jsonwebtoken';
//import MessagesService from '../services/MessageService'
const io = require('socket.io')
const ChatServer = {
    init(app){
        this.socketio = io(app, {
            path: '/publish',
            forceNew: true,
        });
        this.socketio
          .use(function(socket, next){
            if (socket.handshake.query && socket.handshake.query.token){ //ACCESS_TOKEN_SECRET
              jwt.verify(socket.handshake.query.token, process.env.ACCESS_TOKEN_SECRET, function(err, decoded) {
                if(err) return next(new Error('Authentication error'));
                socket.decoded = decoded;
                next();
              });
            } else {
                next(new Error('Authentication error'));
            }    
          })
          .on('connection', (socket) => {
            //   socket.on('message', function(data) {
            //     const {sub} = socket.decoded;
            //     const {message} = data;
            //     if(message ){
            //       MessagesService.create({
            //           message, 
            //           userId: sub})
            //       .then( inserted=>{
            //           MessagesService.getByid(inserted.id)
            //             .then(message=>{
            //               console.log('message',message)
            //               socketio.sockets.emit('message', message); 
            //             })
            //             .catch(error=>{
            //               next(error);
            //             })
                    
            //       })
            //       .catch(error=>{
            //         console.log('errpr',error)
            //         socket.emit('error', "Wrong parameter: Missing message");
            //       })
            //   }else{
            //     socket.emit('error', "Wrong parameter: Missing message");
            //   }
                  
            // });
            // when the user disconnects.. perform this
            socket.on('disconnect', function(socket) {
              console.log('disconnected socket',socket.id)
            });
          })
          return this
    },
    share(message){
      this.socketio.sockets.emit('message', message); 
    }
}

export default ChatServer



