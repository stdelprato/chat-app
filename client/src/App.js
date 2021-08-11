import React, {useState, useEffect} from 'react';
import io from 'socket.io-client';
import './App.css';

let socket;
const CONNECTION_PORT = 'localhost:8080/';

function App() {

  // Before login
  const [loggedIn, setLoggedIn] = useState(false)
  const [room, setRoom] = useState('')
  const [userName, setUserName] = useState('')
  
  // After login
  const [message, setMessage] = useState("")
  const [messageList, setMessageList] = useState([])

  useEffect(() => {
    socket = io(CONNECTION_PORT);
  }, [CONNECTION_PORT])

  useEffect(() => {
    socket.on('receive_message', (data) => {
      setMessageList([...messageList, data])
    })
  })

  const connectToRoom = () => {
    setLoggedIn(true)
    socket.emit('join_room', room)
  }

  const sendMessage = () => {
    let message = document.getElementById('inputMessage').value
    let messagePayload = {
      room : room,
      content: {
        author: userName,
        message: message
      }
    }

    socket.emit('send_message', messagePayload)
    setMessageList([...messageList, messagePayload.content ])
    setMessage("")
    document.getElementById('inputMessage').value = ''
  }

  return (
    <div className="App">
      {!loggedIn ? (
          <div className="logIn">
            <div className='inputs'>
              <input 
                type='text' 
                placeholder='Nombre..' 
                onChange={(e) => {
                  setUserName(e.target.value)
                }}
              />
              <input 
                type='text' 
                placeholder='Sala..' 
                onChange={(e) => {
                  setRoom(e.target.value)
                }}
              />
            </div>
            <button onClick={connectToRoom}>Ingresar al chat</button>
          </div>
        ) : (
          <div className='chatContainer'>
            <div className='messages'>
              {messageList.map((val, key) => {
                return (
                  <div className='message_container' id={val.author == userName ? "you" : "other"}>
                    <div className='onscreen_message'>
                      {val.author}: {val.message} 
                    </div>
                  </div>
                )
              })}
            </div>
            <div className='messageInputs'>
              <input 
                id="inputMessage"
                type='text' 
                placeholder='Mensaje...' 
              />
              <button onClick={sendMessage}>Enviar</button>
            </div>
          </div>
      )}
    </div>
  );
}

export default App;
