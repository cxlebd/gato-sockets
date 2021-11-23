const path = require('path');
const express = require('express');
const app = express();
const morgan = require('morgan');
let db = [];

//importando rutas
const rutas = require('./routes/controller.js');

//settings 
app.set('port', process.env.PORT || 3000);
app.set('view engine','ejs');
app.set('views',path.join(__dirname,'views'));

//middlewares
app.use(morgan('dev'));

//rutas
app.use('/',rutas);

//static files
app.use('/public',express.static(path.join(__dirname,'public')));

//start server
const server = app.listen(app.get('port'),()=>{
    console.log('server on port ',app.get('port'));
});

//web socket
const socketIO = require('socket.io');
const io = socketIO(server);

io.on('connection',(socket)=>{
    console.log('new connection ',socket.id);

    socket.on('room:new',(data)=>{
        socket.join(data.room);
        if(add(data.room)){
            console.log('Se creó una nueva sala llamada '+data.room);
        }else{
            io.sockets.in(data.room).emit('room:userDelete',data.username);
            console.log('No hay espacio');
        }
    });

    socket.on('room:leave',(data)=>{
        deleter(data.room);
        socket.broadcast.to(data.room).emit('chat:message',{username:data.username, message:'Ha salido del juego! ->'});
        socket.leave(data.room);
    });

    socket.on('room:created',(data)=>{
        const index = search();
        console.log(index);
        if(index>=0){
            const room = db[index].room
            socket.join(room);
            if(add(room)){
                console.log('Se creó una nueva sala llamada '+room);
                io.sockets.in(room).emit('room:name',room);
            }else{
                io.sockets.in(room).emit('room:userDelete',data.username);
                console.log('No hay espacio');
            }
        }else{
            //en caso de que no haya salas disponibles
            io.sockets.emit('room:disponible',data);
        }
    });

    socket.on('chat:message',(data)=>{
        io.sockets.in(data.room).emit('chat:message',data);
    });

    socket.on('chat:typing',(data)=>{
        socket.broadcast.to(data.room).emit('chat:typing',data.username);
    });

    socket.on('game:position',(data)=>{
        socket.broadcast.to(data.room).emit('game:position',data);
    });

    socket.on('room:userData',(data)=>{
        socket.broadcast.to(data.room).emit('room:userData',data);
    });

    socket.on('game:lose',(data)=>{
        socket.broadcast.to(data.room).emit('game:lose',data);
    });

    socket.on('game:turn',(data)=>{
        socket.broadcast.to(data.room).emit('game:turn',data);
    });

    socket.on('game:name',(data)=>{
        socket.broadcast.to(data.room).emit('game:name',data.username);
    });

    socket.on('game:tie',(data)=>{
        socket.broadcast.to(data.room).emit('game:tie',data.username);
    });
});

//funciones de la bd
function add(room){
    let existe = false;
    let posicion = 0;
    db.forEach((con, i)=>{
        if(con.room==room){
            existe = true;
            posicion = i;
        }
    });
    if(!existe){
        db.push({room:room, user:1});
        return true;
    }else{
        if(db[posicion].user<2){
            db[posicion].user+=1;
            return true;
        }else{
            return false;
        }
    }
}

function deleter(room){
    let p = 0;
    db.forEach((con, i)=>{
        if(con.room==room){
            p = i;
            db[i].user -=1;
            if(con.user<=0){
                db.splice(i,1);
            }
        }
    });
}

function search(){
    let pos;
    let encuentra = false;
    console.log('searching')
    db.forEach((room, i)=>{
        console.log(room);
        if(room.user==1){
            pos = i;
            encuentra = true;
        }
    });
    if(encuentra){
        return pos;
    }else{
        return -1;
    }
}