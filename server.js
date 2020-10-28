// ----------------------back end -------------------------
const express = require('express');
const socket = require('socket.io');
const mongo = require('mongodb').MongoClient;

let app = express();

app.use(express.static('static')); // allows all the html/css and js files to be connected to the back end server

let server = app.listen(3500);
let backSocket = socket(server);

mongo.connect('mongodb://127.0.0.1:27017/chat',function(err,db){
  let chat = db.collection('chats'); //chat is an object of messages
  
  if(err) throw err;
  
  else{
    backSocket.on('connection',function(socket){
      chat.find().limit(100).sort({_id:1}).toArray(function(err,result){
        if(err) throw err;
        
        else{
          socket.emit('output',result); // automatically load messages for corresponding user
        }
      })
      socket.on('message',function(data){
        chat.insert(
          {
            name:data.name, 
            message:data.message
          },function(){
            backSocket.emit('output',[data]); // [data] = [{1 name, 1 message}]
          })
        
      });

      socket.on('clear',function(){
        chat.remove({});
      });
      socket.on('typing',function(data){
       socket.broadcast.emit('typing',data)
      })
     });
  }
})// end of mongo

