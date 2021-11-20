const express = require('express')
const { Server: IOServer } = require('socket.io')
const { Server: HttpServer } = require('http')
const Contenedor = require('./files/files')
const handlebars = require('express-handlebars')

const app = express()

const msgsCont = new Contenedor('./files/msgs')

let y_n = true 

app.engine(
    "hbs",
    handlebars({
        extname: ".hbs",
        defaultLayout: "index.hbs",
        layoutsDir: __dirname + "/views",
    })
)

app.set("view engine", "hbs")

app.set("views", "./views")

app.get('/', (req,res) => {
    res.render('index', {y_n})
})

app.use(express.static('public'))
const httpServer = new HttpServer(app)
const io = new IOServer(httpServer)

httpServer.listen(8080, () => {
    console.log('Escuchando correctamente el puerto 8080')
})

io.on('connect', async (socket) => {
    let msgs = await msgsCont.getAll()

    socket.on('logged', ()=>{
        socket.emit('msgs', msgs)
    })
    
    socket.on('msg', async (msg) => {
        await msgsCont.save(msg)
        msgs = await msgsCont.getAll()
        io.sockets.emit('msgs', msgs)
    })
})