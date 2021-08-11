const express = require('express')
const socket = require('socket.io')
const app = express()
const cors = require('cors')

app.use(cors())
app.use(express.json())


const server = app.listen('8080', () => {
    console.log("Server running on port 8080")
})


io = socket(server)

io.on('connection', (socket)=>{
    console.log(socket.id)

    socket.on('join_room', (data)=>{
        socket.join(data)
        console.log('Usuario se unio a la sala: ' + data)
    })

    socket.on('send_message', (data)=>{
        console.log(data)
        socket.to(data.room).emit('receive_message', data.content)
    })

    socket.on('disconnect', () => {
        console.log('Usuario desconectado')
    })
})