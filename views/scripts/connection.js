import { renderVideo } from "./ui.js";

const socket = io("/");

let client = {
	id: "",
	stream: "",
	sender: {},
};

//Initialize new Peer
export const peer = new Peer(undefined, {});

function renderVideoOnStream(id, call) {
	const video = document.createElement("video");
	// document.getElementById(String(id)).className =
	// 	"mini md:rounded-full w-full h-96 md:w-64 md:h-64 object-cover";
	call.on("stream", (stream) => {
		video.setAttribute("id", id);
		video.className =
			"mini md:rounded-full w-full h-full md:w-64 md:h-64 object-cover";
		renderVideo(video, stream, "participant");
	});
}

//Emit join-room

peer.on("open", (clientid) => {
	client.id = clientid;
	console.log(clientid);
	socket.emit("join-room", id, clientid);
});

//Answer when offer is recieved

peer.on("call", async (call) => {
	call.answer(client.stream);
	client.sender = call.peerConnection;
	renderVideoOnStream(call.peer, call);
});

//When new user is connected we call
export const connectToNewUser = (stream, clientid) => {
	const call = peer.call(clientid, stream);
	client.sender = call.peerConnection;
	renderVideoOnStream(client.id, call);
	call.on("close", () => {
		video.remove();
	});
};

export { socket, client };
