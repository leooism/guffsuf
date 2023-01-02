import { renderVideo } from "./ui.js";
console.log("yo from connection");

const socket = io("/");
let client = {
	id: "",
	stream: "",
};

export const peer = new Peer(undefined, {
	port: "3001",
	host: "/",
});
// peers[peer.t._id] = peer;

peer.on("open", (clientid) => {
	client.id = clientid;
	socket.emit("join-room", id, clientid);
});

peer.on("call", async (call) => {
	call.answer(client.stream);
	const video = document.createElement("video");
	video.classList.add("mini");
	call.on("stream", (stream) => {
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
};

// socket.on("disconnected-user", (userId) => {
// 	document.getElementById(String(userId)).remove();
// });

// socket.on("disconnect", (id) => {
// 	console.log("User is disconnected");
// 	// console.log(document.getElementById(String(id)));
// 	// console.log("disconnected user");
// 	// console.log(peers);
// 	// if (!peers[id]) return;
// 	// peers[id].destroy();
// });
/*
 */
// socket.on("video-status", (s, i) => {
// 	const el = document.getElementById(String(i));
// 	console.log(el);
// 	el.srcObj.getTracks().forEach((track) => {
// 		if (track.kind === "video" && track.readyState === "live") {
// 			track.enabled = s;
// 		}
// 	});
// 	console.log(el);
// });
export { socket, client };
