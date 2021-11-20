const socket = io()

let send = null
let input = null
let mail = null
const mailInp = document.getElementById("mail")

document.getElementById("entry").addEventListener('click', () => {
    mail = mailInp.value
    document.getElementById('log').remove()
    console.log(mail)
    const chat = document.createElement("div")
    chat.id = "chat"
    chat.innerHTML = 
    `
        <div id="msgs">
        </div>
        <div class="input">
            <input id="msg" type="text">
            <button id="send">Enviar</button>
        </div>
        `
    const main = document.getElementById('main')
    main.appendChild(chat)
    send = document.getElementById("send")
    input = document.getElementById("msg")
    send.addEventListener('click', () => {
        time = new Date()
        socket.emit('msg', {msg: input.value, time: time, mail: mail})
        const empty = () => {
            input.value = ""
        }
        empty()
    })
    socket.emit('logged')
})

socket.on('msgs', msgs => {
    const chat = document.getElementById("msgs")
    while(chat.firstChild){
        chat.removeChild(chat.firstChild)
    }

    msgs.forEach(p => {
        let row = document.createElement("div")
        row.classList.add("row")        
        row.innerHTML = 
        ` 
        <p class="m">${p.mail}</p>
        <p class="msg">${p.msg}</p>
        <p class="t">${p.time}</p>
        `
        chat.appendChild(row)
    })
})