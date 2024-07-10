// public/script.js
const socket = io();
const chat = document.getElementById('chat');
const message = document.getElementById('message');
const send = document.getElementById('send');
const imageInput = document.getElementById('image');
const typingNotification = document.getElementById('typing-notification');

let nickname = prompt("Please enter your nickname");

socket.emit('nickname', nickname);

socket.on('init', (messages) => {
    messages.forEach(addMessage);
});

socket.on('message', (data) => {
    addMessage(data);
});

socket.on("welcome", (data) => {
    const msg = document.createElement('div');
    msg.classList.add('chat-message', 'welcome');
    msg.textContent = data;
    chat.appendChild(msg);
});

socket.on("bye", (data) => {
    const msg = document.createElement('div');
    msg.classList.add('chat-message', 'bye');
    msg.textContent = data;
    chat.appendChild(msg);
});

socket.on('typing', (data) => {
    typingNotification.textContent = `${data} is typing...`;
});

socket.on('stop typing', () => {
    typingNotification.textContent = '';
});

send.addEventListener('click', () => {
    const msg = { user: nickname, message: message.value };
    socket.emit('message', msg);
    message.value = '';
    socket.emit('stop typing');
});

let typingTimeout;
message.addEventListener('input', () => {
    clearTimeout(typingTimeout);
    socket.emit('typing');
    typingTimeout = setTimeout(() => {
        socket.emit('stop typing');
    }, 1000);
});

imageInput.addEventListener('change', () => {
    const file = imageInput.files[0];
    const reader = new FileReader();
    reader.onload = () => {
        const msg = { user: nickname, image: reader.result };
        socket.emit('message', msg);
        imageInput.value = '';
    };
    reader.readAsDataURL(file);
});

function addMessage(data) {
    const msg = document.createElement('div');
    msg.classList.add('chat-message');
    if (data.user === nickname) {
        msg.classList.add('self');
    }
    if (data.message) {
        msg.textContent = `${data.user}: ${data.message}`;
    } else if (data.image) {
        const img = document.createElement('img');
        img.src = data.image;
        img.style.maxWidth = '100%';
        msg.appendChild(img);
    }
    chat.appendChild(msg);
    chat.scrollTop = chat.scrollHeight;
}
