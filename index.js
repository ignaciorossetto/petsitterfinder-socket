import congif from './config/congif.js'

const io = require('socket.io')(8900, {
    cors:{
        origin: congif.url
    }
})

let users = []

const addUser = (userId, socketId) => {
    !users.some(user=>user.userId === userId) && users.push({userId, socketId})
}

const removeUser = (socketId) => {
    users = users.filter(u=>u.socketId !== socketId)
}

const getUser = (userId) => {
    return users.find(user=>user.userId === userId)
}

// IMPORTANT: As we are using an array  (users), after every save here, the array gets empty again. So every user at the front end will have to refresh the message view
// for the messenger to work properly.

io.on("connection", (socket)=> {
    // someone connected
    console.log('connected')
    io.emit("Welcome", "Welcome to socket server")
    // take userId, socketId from user
    socket.on('addUser', (userId)=> {
        addUser(userId, socket.id)
        io.emit('getUsers', users)
    })
    // send and get message
    socket.on('sendMessage', ({senderId, receiverId,text})=>{
        const user = getUser(receiverId)
        io.to(user?.socketId).emit('getMessage',{
            senderId,
            text
        })
    })




    // someone disconnected
    socket.on('disconnect', ()=> {
        console.log('someone disconnected');
        removeUser(socket.id)
    })
})