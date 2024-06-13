const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');
const dotenv=require('dotenv');

// dotenv.config({path: __dirname + '../../.env'});
dotenv.config();

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "*",
  }
});
// function formatAMPM(date) {
//   var hours = date.getHours();
//   var minutes = date.getMinutes();
//   var ampm = hours >= 12 ? 'pm' : 'am';
//   hours = hours % 12;
//   hours = hours ? hours : 12; // the hour '0' should be '12'
//   minutes = minutes < 10 ? '0' + minutes : minutes;
//   var strTime = hours + ':' + minutes + ' ' + ampm;
//   return strTime;
// }
//--------------------Deployment--------------------------
const aa=process.env.NODE_ENV;
 console.log("pp",aa)
 const __dirname1 = path.resolve();

 if (process.env.NODE_ENV === "production") {

  // app.use(express.static(path.join(__dirname1, '../client/build')))
  app.use(express.static(path.join(__dirname1, '/client/build')))
console.log(__dirname1)
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname1, 'client', 'build', 'index.html'))
  }
  )
}

else {
  app.get("/", (req, res) => {
    res.send("Api is running successfully")
  })
}

//--------------------Deployment--------------------------



io.on('connection', (socket) => {
  console.log('a user connected');

  socket.on('sendMessage', (message) => {
    // Add sender ID to the message
    const newMessage = { senderId: socket.id, content: message.content, username: message.username,time:message.time };
    console.log(newMessage)
    io.emit('receiveMessage', newMessage);
  });

  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
});

const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
