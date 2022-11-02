const inputBox = document.querySelector("#input-box");
const sendBtn = document.querySelector(".send-btn");
const videoGrid = document.querySelector(".video-grid");
const participantGrid = document.querySelector(".video-participant");
const videoHost = document.querySelector(".video-host");

const chatMessage = document.querySelector(".chat-message");

const socket = io("/");
const peer = new Peer(undefined, {
	port: "3001",
	host: "/",
});
const constraints = {
	video: true,
	audio: false,
};

const onSucess = async (videoEle, stream) => {
	videoEle.srcObject = stream;
	videoEle.addEventListener("loadedmetadata", (e) => {
		videoEle.play();
	});
	videoGrid.appendChild(videoEle);
};

const onError = (error) => {
	console.log(error);
};

const getVideoTrack = async function (options) {
	return await navigator.mediaDevices.getUserMedia(options);
};

peer.on("open", (clientid) => {
	socket.emit("join-room", id, clientid);
});
const connectToNewUser = (stream, clientid) => {
	const call = peer.call(clientid, stream);

	call.on("stream", (remoteStream) => {
		const video = document.createElement("video");
		video.classList.add("mini");

		onSucess(video, remoteStream);
	});
	call.on("close", () => {
		console.log("call is closed");
	});
};
getVideoTrack(constraints).then((stream) => {
	const video = document.createElement("video");
	video.classList.add("pin");
	onSucess(video, stream);

	peer.on("call", (call) => {
		call.answer(stream);
		call.on("stream", (stream) => {
			const video = document.createElement("video");
			video.classList.add("mini");

			onSucess(video, stream);
		});
	});
	socket.on("user-connected", (id) => {
		connectToNewUser(stream, id);
	});
});
sendBtn.addEventListener("click", (e) => {
	e.preventDefault();
	const msg = inputBox.value;
	const msgBox = document.createElement("p");
	msgBox.classList.add("sender");
	const p = document.createElement("span");
	p.classList.add("sender-msg");
	p.innerText = msg;
	msgBox.appendChild(p);
	chatMessage.appendChild(msgBox);
	socket.emit("message", msg);
	inputBox.value = "";
});
socket.on("createMessage", (msg) => {
	const msgBox = document.createElement("p");
	msgBox.classList.add("reciever");
	const p = document.createElement("soab");
	p.classList.add("reciever-msg");
	p.innerText = msg;
	msgBox.appendChild(p);
	chatMessage.appendChild(msgBox);
});

// const getListOfInputDevices = async () => {
// 	const devices = await navigator.mediaDevices.enumerateDevices();
// 	return devices;
// };
// getListOfInputDevices().then((devices) => console.log(devices));

// We should constantly look for media device changes

/* 
*Create a RTCPeerConnection for each end of the call and 
*at each end, add the local stream from getUserMedia()


* Get and share network information: potential connection 
* endpoints are known as ICE candidates

* Get and share local and remote descriptions: metadata
* about local media in SDP format.



*/

// const server = {
// 	iceServers: [
// 		{
// 			url: "stun:stun.xten.com",
// 		},
// 		{
// 			// Use my TURN server on DigitalOcean
// 			url: "turn:numb.viagenie.ca",
// 			credential: "sunghiep",
// 			username: "nghiepnds@yahoo.com",
// 		},
// 	],
// };
// let stream;

/* 
! We should specify STUN and TURN servers in the server argument.


*/

// const pc1 = new RTCPeerConnection(server);
// const pc2 = new RTCPeerConnection(server);
// let answer, offer;

//Exchange Network information -> finding network interfaces and ports using ICE framework

// pc1.onicecandidate = (e) => gotIceCandidate(pc1, e);
// pc2.onicecandidate = (e) => gotIceCandidate(pc2, e);

// pc2.ontrack = gotRemoteStream;
// function gotIceCandidate(peer, event) {
// 	console.log(peer);
// 	if (!event.candidate) return;
// 	getOtherPc(peer).addIceCandidate(event.candidate);
// }

// const createConnection = async () => {};

// function getOtherPc(pc) {
// 	return pc === pc1 ? pc2 : pc1;
// }

// function gotRemoteStream(e) {
// 	if (remoteElement.srcObject === e) {
// 		return;
// 	}
// 	remoteElement.srcObject = e;
// }

// const makeCall = async (connection) => {
// 	onSucess(getVideoTrack(constraints));

// 	getVideoTrack(constraints).then(async (stream) => {
// 		// connection.addTrack(track, stream);
// 		if (stream) socket.emit("offer", stream);
// 	});
// };

/* 

*/
