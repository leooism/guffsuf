const chatBtn = document.querySelector(".chatBtn");
const feedback = document.querySelector(".feedback");
const sendBtn = document.querySelector(".send-btn");
inputBox.onkeydown = (e) => {
	socket.emit("typing", id, e.target.value.trim().length);
};

chatBtn.addEventListener("click", () => {
	document.querySelector(".chat-grid").classList.toggle("hide");
});

const Chat = (socket) => {
	function renderOnMessage(type, msg) {
		const msgBox = document.createElement("p");
		msgBox.classList.add(type);
		const p = document.createElement("p");
		p.classList.add(`${type}-msg`);
		p.innerText = msg;
		msgBox.appendChild(p);
		chatMessage.appendChild(msgBox);
	}

	const sendMessage = () => {
		const msg = inputBox.value;
		//If no message safely return the function
		if (msg.trim().length === 0) return;

		//Send if msg value > 0
		renderOnMessage("sender", msg);
		socket.emit("chat", msg);
		inputBox.value = "";
	};

	const renderMessage = (msg) => {
		renderOnMessage("reciever", msg);
	};
	sendBtn.addEventListener("click", (e) => {
		sendMessage();
		e.preventDefault();
	});

	socket.on("chat", (msg) => {
		feedback.innerHTML = " ";
		renderMessage(msg);
	});

	socket.on("typing", (id, msgLength) => {
		if (!msgLength > 0) return (feedback.innerHTML = "");
		feedback.innerHTML = `<div class="dots-bars-4 messaging"></div>`;
	});
	function leaveRoom() {
		// socket.emit("disconnect-user", client.id);
		socket.emit("disconnect-user", client.id);
	}
};
export default Chat;
