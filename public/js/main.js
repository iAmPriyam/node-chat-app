const socket = io();
const chatForm = document.querySelector("#chat-form");
const chatMessages = document.querySelector(".chat-messages");
const roomName = document.querySelector("#room-name");
const userList = document.querySelector("#users");

const { username, room } = Qs.parse(location.search, {
    ignoreQueryPrefix: true
});

// console.log(username, room);

//Join room
socket.emit("joinRoom", { username, room });

//Listen to messages from server
socket.on("message", message => {
    console.log(message.text);
    output(message);
    chatMessages.scrollTop = chatMessages.scrollHeight;
});

chatForm.addEventListener("submit", e => {
    e.preventDefault();
    const msg = e.target.elements.msg.value;
    // console.log(msg);
    socket.emit("chatMessage", msg);
    e.target.elements.msg.value = "";
    e.target.elements.msg.focus();
});

//get room and users
socket.on("roomUsers", ({ users, room }) => {
    outputRoomName(room);
    outputUsers(users);
});

//output message to DOM

const output = message => {
    const div = document.createElement("div");
    const name = message.username;
    const t = new Date();
    const time = message.time;
    div.classList.add("message");
    div.innerHTML = `<p class="meta">${name} <span>${time}</span></p>
    <p class="text">
       ${message.text}
    </p>`;
    document.querySelector(".chat-messages").appendChild(div);
};

const outputRoomName = room => {
    roomName.innerHTML = room;
};

const outputUsers = users => {
    userList.innerHTML = `${users
        .map(user => `<li>${user.username}</li>`)
        .join("")}`;
};
