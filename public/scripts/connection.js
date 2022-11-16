import { renderVideo } from "./ui.js";
console.log("yo from connection");

const socket = io("/");
let peers = {};
let client = {
	id: "",
	stream: "",
};
const peer = new Peer(undefined, {
	port: "3001",
	host: "/",
});

peer.on("open", (clientid) => {
	client.id = clientid;
	socket.emit("join-room", id, clientid);
});
peer.on("call", async (call) => {
	call.answer(client.stream);
	const video = document.createElement("video");
	video.classList.add("mini");
	call.on("stream", (stream) => {
		console.log(stream);
		video.setAttribute("id", call.peer);
		renderVideo(video, stream, "participant");
	});
});
export const connectToNewUser = (stream, clientid) => {
	const call = peer.call(clientid, stream);
	call.on("stream", () => {
		const video = document.createElement("video");
		video.setAttribute("id", clientid);
		video.classList.add("mini");
		renderVideo(video, stream, "participant");
	});
	call.on("close", () => {
		video.remove();
	});
	peers[clientid] = call;
};

// socket.on("disconnected-user", (userId) => {
// 	document.getElementById(String(userId)).remove();
// });

socket.on("disconnected", (id) => {
	console.log(document.getElementById(String(id)));
	console.log("disconnected user");
	console.log(peers);
	if (!peers[id]) return;
	peers[id].destroy();
});
/*
 */
socket.on("video-status", (s, i) => {
	const el = document.getElementById(String(i));
	console.log(el);
	console.log(s, i);
});
export { socket, client };
