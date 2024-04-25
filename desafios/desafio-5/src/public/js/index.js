const socket = io();

let user;
const chatBox = document.getElementById("chatBox");

Swal.fire({
    title: "Ingresa tu nombre",
    input: "text",
    text: "Debes ingresar tu nombre identificativo para comunicarte en el chat.",
    inputValidator: (value) =>{
        return !value && "Necesitas ingresar un nombre para continuar."
    },
    allowOutsideClick: false,
}).then(result =>{
    user = result.value
})

chatBox.addEventListener("keyup" , (e)=>{
    if(e.key == "Enter"){
        if(chatBox.value.trim().length > 0){
            socket.emit("message", {user: user, message: chatBox.value});
            chatBox.value="";
        }
    }
})

socket.on("message", data =>{
    let log = document.getElementById("messagesLogs");
    let messages = "";
    data.forEach( message => {
        messages = messages + `${message.user} dice: ${message.message} <br> <br>`
    });
    log.innerHTML = messages;
})