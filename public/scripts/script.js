const inputBox = document.querySelector("#input-box");
const sendBtn = document.querySelector(".send-btn");
const videoGrid = document.querySelector(".video-box");
const participantGrid = document.querySelector(".participants");
const chatMessage = document.querySelector(".msg-box");
const feedback = document.querySelector(".feedback");
const endCallBtn = document.querySelector(".end");
const videoOffBtn = document.querySelector(".video-off");
export const socket = io("/");

let userId;

inputBox.onkeydown = (e) => {
	console.log(e.target.value.length + 1);
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
	audio: false,
};

export const onSucess = async (videoEle, stream, type = undefined) => {
	stream.getVideoTracks()[0].onended = () => {
		videoGrid.removeChild(videoGrid.firstElementChild);
	};
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
		console.log("yoooooo");
		console.log("call is closed");
	});
};

const toggleStopVideo = function (videoElm) {
	console.log(videoElm.srcObject);
	videoElm.srcObject.getTracks().forEach((track) => {
		console.log(track);
		if (track.readyState === "live" && track.kind === "video") {
			track.enabled = !track.enabled;
		}
	});
};

videoOffBtn.addEventListener("click", () => {
	toggleStopVideo(document.getElementById(String(userId)));
});

function stopStreamedVideo(videoElem) {
	const stream = videoElem.srcObject;
	const tracks = stream.getTracks();
	tracks.forEach((track) => {
		track.stop();
	});
	videoElem.srcObject = null;
	console.log(videoElem);
	videoElem.remove();
	socket.emit("disconnect-user", userId);
}
endCallBtn.addEventListener("click", () => {
	stopStreamedVideo(document.getElementById(String(userId)));
});

getVideoTrack(constraints).then((stream) => {
	const video = document.createElement("video");
	video.setAttribute("id", userId);
	video.classList.add("pin");
	onSucess(video, stream);
	peer.on("call", (call) => {
		call.answer(stream);
		call.on("stream", (stream) => {
			const video = document.createElement("video");
			video.classList.add("mini");
			video.setAttribute("id", call.peer);
			onSucess(video, stream, "participant");
		});
	});
	socket.on("user-connected", (id) => {
		console.log("Yo");
		connectToNewUser(stream, id);
	});
});
socket.on("disconnect-user", (id) => {
	console.log("disconnect user");
	stopStreamedVideo(document.getElementById(String(id)));
});

socket.on("typing", (id, msgLength) => {
	console.log(msgLength);
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
