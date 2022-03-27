const express = require('express')
const { Server: IOServer } = require('socket.io')
const { Server: HttpServer } = require('http')
const Contenedor = require('./files/files')
const handlebars = require('express-handlebars')

const app = express()
const httpServer = new HttpServer(app)
const io = new IOServer(httpServer)

app.engine(
    "hbs",
    handlebars({
        extname: ".hbs",
        defaultLayout: "index.hbs",
        layoutsDir: __dirname + "/public/views",
    })
)
app.use(express.static('public'))
app.set("view engine", "hbs")

app.set("views", "./public/views")

app.get('/', (req,res) => {
    res.render('index', {y_n})
})

httpServer.listen(8080, () => {
    console.log('Escuchando correctamente el puerto 8080')
})

const msgsCont = new Contenedor('./files/msgs')
const prodsCont = new Contenedor('./files/prods')
let y_n = true 

io.on('connect', async (socket) => {
    let msgs = await msgsCont.getAll()
    let prods = [...await prodsCont.getAll()]
    socket.emit('prods', prods)
    socket.on('logged', ()=>{
        socket.emit('msgs', msgs)
    })
    socket.on('msg', async (msg) => {
        await msgsCont.save(msg)
        msgs = await msgsCont.getAll()
        io.sockets.emit('msgs', msgs)
    })
    socket.on('prod', async (prod) => {
        await prodsCont.save(prod)
        prods = await prodsCont.getAll()
        io.sockets.emit('prods', prods)
    })
})