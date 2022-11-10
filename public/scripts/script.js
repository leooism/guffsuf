const inputBox = document.querySelector("#input-box");
const sendBtn = document.querySelector(".send-btn");
const videoGrid = document.querySelector(".video-box");
const participantGrid = document.querySelector(".participants");
const chatMessage = document.querySelector(".msg-box");
const feedback = document.querySelector(".feedback");
const endCallBtn = document.querySelector(".end");
const videoOfOnBtn = document.querySelector(".video-off");
const micOffOnBtn = document.querySelector(".mute");
const chatBtn = document.querySelector(".chatBtn");

let localStream;
let remoteStream = [];

const peers = {};

chatBtn.addEventListener("click", () => {
	document.querySelector(".chat-grid").classList.toggle("hide");
});

let messageSeen = false;
export const socket = io("/");

let videoOn = true;
let micOn = true;

let userId;

inputBox.onkeydown = (e) => {
	socket.emit("typing", id, e.target.value.trim().length);
};

export const peer = new Peer(undefined, {
	port: "3001",
	host: "/",
});
peer.on("open", (clientid) => {
	userId = clientid;
	socket.emit("join-room", id, clientid);
});

const constraints = {
	video: true,
	width: { min: 640, ideal: 1280 },
	height: { min: 480, ideal: 720 },
	advanced: [{ width: 1920, height: 1280 }, { aspectRatio: 1.333 }],
};
export const onSucess = async (videoEle, stream, type = undefined) => {
	if (type === "cast") {
		return (document.getElementById(String(userId)).srcObject = stream);
	}
	stream.getVideoTracks().forEach((track) => {
		track.addEventListener("ended", () => {
			console.log("yiooooo");
		});
	});
	videoEle.srcObject = stream;
	videoEle.addEventListener("loadedmetadata", (e) => {
		videoEle.play();
	});
	if (type === "participant") return participantGrid.appendChild(videoEle);
	videoGrid.insertAdjacentElement("afterbegin", videoEle);
};

const onError = (error) => {
	console.log(error);
};

const getVideoTrack = async function (options) {
	return await navigator.mediaDevices.getUserMedia(options);
};

const connectToNewUser = (stream, clientid) => {
	const call = peer.call(clientid, stream);
	call.on("stream", () => {
		const video = document.createElement("video");
		video.setAttribute("user-id", clientid);
		video.classList.add("mini");
		onSucess(video, stream, "participant");
	});
	call.on("close", () => {
		// console.log("Hello");
		video.remove();
	});
	peers[clientid] = call;
};

const toggleStopVideo = function (localStream) {
	if (!localStream) return;
	peer.call();
	localStream.getTracks().forEach((track) => {
		console.log(track);
		if (track.readyState === "live" && track.kind === "video") {
			track.enabled = !track.enabled;
			socket.emit("video-status", track.enabled, userId);
			videoOn = !videoOn;
		}
	});
	if (!videoOn) {
		document.querySelector(".cover").classList.add("pin-cover");
		videoOfOnBtn.innerHTML = `<svg
		xmlns="http://www.w3.org/2000/svg"
		width="16"
		height="16"
		fill="currentColor"
		class="bi bi-camera-video-off"
		viewBox="0 0 16 16"
	>
		<path
			fill-rule="evenodd"
			d="M10.961 12.365a1.99 1.99 0 0 0 .522-1.103l3.11 1.382A1 1 0 0 0 16 11.731V4.269a1 1 0 0 0-1.406-.913l-3.111 1.382A2 2 0 0 0 9.5 3H4.272l.714 1H9.5a1 1 0 0 1 1 1v6a1 1 0 0 1-.144.518l.605.847zM1.428 4.18A.999.999 0 0 0 1 5v6a1 1 0 0 0 1 1h5.014l.714 1H2a2 2 0 0 1-2-2V5c0-.675.334-1.272.847-1.634l.58.814zM15 11.73l-3.5-1.555v-4.35L15 4.269v7.462zm-4.407 3.56-10-14 .814-.58 10 14-.814.58z"
		/>
	</svg>`;
	}
	if (videoOn) {
		document.querySelector(".cover").classList.remove("pin-cover");

		videoOfOnBtn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-camera-video" viewBox="0 0 16 16">
		<path fill-rule="evenodd" d="M0 5a2 2 0 0 1 2-2h7.5a2 2 0 0 1 1.983 1.738l3.11-1.382A1 1 0 0 1 16 4.269v7.462a1 1 0 0 1-1.406.913l-3.111-1.382A2 2 0 0 1 9.5 13H2a2 2 0 0 1-2-2V5zm11.5 5.175 3.5 1.556V4.269l-3.5 1.556v4.35zM2 4a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h7.5a1 1 0 0 0 1-1V5a1 1 0 0 0-1-1H2z"/>
	  </svg>`;
	}
};

videoOfOnBtn.addEventListener("click", () => {
	toggleStopVideo(localStream);
});
const toggleMuteAudio = function (localStream) {
	if (!localStream) return;
	localStream.getTracks().forEach((track) => {
		if (track.readyState === "live" && track.kind === "audio") {
			track.enabled = !track.enabled;
			micOn = !micOn;
		}
	});
	if (!micOn) {
		micOffOnBtn.innerHTML = `<svg
		xmlns="http://www.w3.org/2000/svg"
		width="16"
		height="16"
		fill="currentColor"
		class="bi bi-mic-mute"
		viewBox="0 0 16 16"
	>
		<path
			d="M13 8c0 .564-.094 1.107-.266 1.613l-.814-.814A4.02 4.02 0 0 0 12 8V7a.5.5 0 0 1 1 0v1zm-5 4c.818 0 1.578-.245 2.212-.667l.718.719a4.973 4.973 0 0 1-2.43.923V15h3a.5.5 0 0 1 0 1h-7a.5.5 0 0 1 0-1h3v-2.025A5 5 0 0 1 3 8V7a.5.5 0 0 1 1 0v1a4 4 0 0 0 4 4zm3-9v4.879l-1-1V3a2 2 0 0 0-3.997-.118l-.845-.845A3.001 3.001 0 0 1 11 3z"
		/>
		<path
			d="m9.486 10.607-.748-.748A2 2 0 0 1 6 8v-.878l-1-1V8a3 3 0 0 0 4.486 2.607zm-7.84-9.253 12 12 .708-.708-12-12-.708.708z"
		/> 	
	</svg>`;
	}
	if (micOn) {
		micOffOnBtn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-mic" viewBox="0 0 16 16">
		<path d="M3.5 6.5A.5.5 0 0 1 4 7v1a4 4 0 0 0 8 0V7a.5.5 0 0 1 1 0v1a5 5 0 0 1-4.5 4.975V15h3a.5.5 0 0 1 0 1h-7a.5.5 0 0 1 0-1h3v-2.025A5 5 0 0 1 3 8V7a.5.5 0 0 1 .5-.5z"/>
		<path d="M10 8a2 2 0 1 1-4 0V3a2 2 0 1 1 4 0v5zM8 0a3 3 0 0 0-3 3v5a3 3 0 0 0 6 0V3a3 3 0 0 0-3-3z"/>
	  </svg>`;
	}
};
micOffOnBtn.addEventListener("click", () => {
	toggleMuteAudio(localStream);
});

function leaveRoom() {
	socket.emit("disconnect-user", userId);
}
socket.on("disconnected-user", (userId) => {
	document.getElementById(String(userId)).remove();
});

endCallBtn.addEventListener("click", () => {
	leaveRoom(document.getElementById(String(userId)));
	window.location.assign("/feedback");
});

getVideoTrack(constraints).then(async (stream) => {
	localStream = await stream;
	const video = document.createElement("video");
	video.setAttribute("id", userId);
	video.classList.add("pin");
	onSucess(video, localStream);
});
socket.on("user-connected", async (id) => {
	connectToNewUser(localStream, id);
});

// socket.on("video-status", (status, userId) => {
// 	let stream = document.getElementById(String(userId)).srcObject;
// 	stream.getTracks().forEach((track) => {
// 		if (track.readyState === "live" && track.kind === "video") {
// 			track.enabled = status;
// 		}
// 	});
// });

peer.on("call", async (call) => {
	call.answer(localStream);
	const video = document.createElement("video");
	video.classList.add("mini");
	call.on("stream", (stream) => {
		video.setAttribute("id", call.peer);
		remoteStream.push(stream);
		onSucess(video, stream, "participant");
	});
});

const handleUserLeft = (videoElem) => {
	const stream = videoElem.srcObject;
	const tracks = stream.getTracks();
	tracks.forEach((track) => {
		track.stop();
	});
	videoElem.srcObject = null;
	videoElem.remove();
};
socket.on("disconnected", (id) => {
	if (!peers[id]) return;
	peers[id].destroy();
});

socket.on("typing", (id, msgLength) => {
	if (!msgLength > 0) return (feedback.innerHTML = "");
	feedback.innerHTML = `<div class="dots-bars-4 messaging"></div>`;
});

const sendMessage = () => {
	const msg = inputBox.value;
	if (msg.trim().length === 0) return;
	const msgBox = document.createElement("p");
	msgBox.classList.add("sender");
	const p = document.createElement("span");
	p.classList.add("sender-msg");
	p.innerText = msg;
	msgBox.appendChild(p);
	chatMessage.appendChild(msgBox);
	socket.emit("chat", msg);
	inputBox.value = "";
};

const renderMessage = (msg) => {
	const msgBox = document.createElement("p");
	msgBox.classList.add("reciever");
	const p = document.createElement("soab");
	p.classList.add("reciever-msg");
	p.innerText = msg;
	msgBox.appendChild(p);

	chatMessage.appendChild(msgBox);
};

sendBtn.addEventListener("click", (e) => {
	sendMessage();
	e.preventDefault();
});

socket.on("chat", (msg) => {
	feedback.innerHTML = " ";
	renderMessage(msg);
});

// console.log(shareScreen);

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
