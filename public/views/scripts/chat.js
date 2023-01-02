const chatBtn = document.querySelector(".chatBtn");
const feedback = document.querySelector(".feedback");
chatBtn.addEventListener("click", () => {
	document.querySelector(".chat-grid").classList.toggle("hide");
});
const Chat = (socket) => {
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
