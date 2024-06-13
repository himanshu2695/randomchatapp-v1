import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import './App.css';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';


//const socket = io('https://randomchatapp-v1.onrender.com');


 const socket = io('http://localhost:4000');


 function formatAMPM(date) {
    var hours = date.getHours();
    var minutes = date.getMinutes();
    var ampm = hours >= 12 ? 'pm' : 'am';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    minutes = minutes < 10 ? '0' + minutes : minutes;
    var strTime = hours + ':' + minutes + ' ' + ampm;
    return strTime;
 }
function App() {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');
  const [socketId, setSocketId] = useState('');
  const [user, setUser] = useState('');
  const [userflag, setUserFlag] = useState(false);
  useEffect(() => {
    // Get and store the socket ID
    socket.on('connect', () => {
      setSocketId(socket.id);
    });

    socket.on('receiveMessage', (newMessage) => {
      setMessages((prevMessages) => [...prevMessages, newMessage]);
    });

    return () => {
      socket.off('receiveMessage');
    };
  }, []);
  const sendUser = (e) => {
    if(user=="")
      {
        alert("Please enter your name")
      }
      else
    setUserFlag(true);
  }

  const sendMessage = () => {
    if (message.trim()) {
      const time = formatAMPM(new Date());
      
      const newMessage = { content: message, username: user,time };
      socket.emit('sendMessage', newMessage);
      setMessage(''); // Clear the message input
    }
  };
 
  
  
  return (
    <>
{     userflag? <>
<div className='body2' style={{display:'flex'}}>

      <div className="chat-window">
        
        <div className="chat-header">Welcome {user}</div>

        <div className="chat-body">
          {messages.map((msg, index) => (<>
         
         
            <div
              key={index}
              className={`message ${msg.senderId === socketId ? 'right' : 'left'}`}
            >
              <div style={{display:'flex',flexDirection:'column'}}>
              <div style={{fontSize:'0.7em',fontWeight:'600'}}>{msg.username.toUpperCase()}</div>
              <div className="content">{msg.content}</div>
              <div style={{fontSize:'0.7em',fontWeight:'600',color:'grey',display:'flex',justifyContent:'flex-end',marginRight:'2em'}}>{msg.time}</div>
              </div>
            </div>
           
          </>
          ))}
        </div>
        <div className="chat-footer">
          <input
            type="text"
            value={message}
            onKeyDown={(e)=>{if(e.key==="Enter") sendMessage();}}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type a message..."
          />
          <button  onClick={sendMessage}>Send</button>
        </div>
      </div>
      </div></>:
      <div className="body2"style={{display:'flex',alignItems:'center'}}>
 
      {/* <input
        type="text"
        value={user}
        onKeyDown={(e)=>{if(e.key==="Enter") sendUser();}}
        onChange={(e)=>setUser(e.target.value)}
        placeholder="Enter your Name"
      /> */}

        <TextField value={user}
        onKeyDown={(e)=>{if(e.key==="Enter") {sendUser();}}}
        onChange={(e)=>setUser(e.target.value)} id="standard-basic" label="Enter your name to chat" variant="standard" />
       
      <Button style={{backgroundColor:'black',borderRadius:'2em',margin: '15px 0 0 10px'}} variant="contained" onClick={sendUser}>Send</Button>
    </div>
      }
    </>
  );
}

export default App;
