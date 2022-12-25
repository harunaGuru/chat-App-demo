let socket = io();

let userlist = document.getElementById("active_users_list");
let roomlist = document.getElementById("active_rooms_list");
let message = document.getElementById("messageInput");
let sendMessageBtn = document.getElementById("send_message_btn");
let roomInput = document.getElementById("room_input");
let CreateRoomBtn = document.getElementById("room_add_icon_holder");
let chatDisplay = document.getElementById("chat");

let currentRoom = "globalChat";
let myUsername = "";

socket.on("connect", function () {
    myUsername = prompt("Enter your name");
    socket.emit("createUser", myUsername)
});

sendMessageBtn.addEventListener('click', function () {
    socket.emit('sendMessage', message.value);
    message.value = ""
})

socket.on("updateChat", function (username, data) {
    if (username === "INFO") {
        chatDisplay.innerHTML = `<div class="announcement"><span>${data}</span></div> `;
    } else {
        chatDisplay.innerHTML += `<div class="message_holder ${
          username === myUsername ? "me" : ""
        }">
                                <div class="pic"></div>
                                <div class="message_box">
                                  <div id="message" class="message">
                                    <span class="message_name">${username}</span>
                                    <span class="message_text">${data}</span>
                                  </div>
                                </div>
                              </div>`;
    }
    chatDisplay.scrollTop = chatDisplay.scrollHeight;
})

function changeRoom(room) {
    if (room !== currentRoom) {
        socket.emit("updateRooms", room)
        document.getElementById(currentRoom).classList.remove("active_item");
        currentRoom = room
        document.getElementById(currentRoom).classList.add("active_item");
}
}